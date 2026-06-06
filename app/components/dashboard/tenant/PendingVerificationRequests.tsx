"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { FiAlertCircle, FiUserCheck } from "react-icons/fi";

type PendingVerificationRequest = {
  _id: string;
  dateRequested?: string;
  createdAt?: string;
  verificationTier?: "standard" | "premium";
  requestedBy?: {
    firstName?: string;
    lastName?: string;
  };
};

const unwrapList = (res: unknown): unknown[] => {
  const payload = res as { data?: { data?: unknown[] } | unknown[] };
  const raw = payload?.data;
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown[] }).data)) {
    return (raw as { data: unknown[] }).data;
  }
  return [];
};

const unwrapData = (res: unknown): unknown | null => {
  const payload = res as { data?: { data?: unknown } | unknown };
  const raw = payload?.data;
  if (raw && typeof raw === "object" && "data" in (raw as object)) {
    return (raw as { data: unknown }).data ?? null;
  }
  return raw ?? null;
};

const formatRequestDate = (value?: string) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const tierLabel = (tier?: "standard" | "premium") => {
  if (tier === "premium") {
    return "Premium screening";
  }
  if (tier === "standard") {
    return "Standard screening";
  }
  return "Tenant verification";
};

const PendingVerificationRequests = () => {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<PendingVerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      let email: string | null = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            email = userObj?.user?.email || userObj?.email || null;
          } catch {
            email = null;
          }
        }
      }

      if (!email) {
        setPendingRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const reqRes = await apiService.get(
          `/verification/by-email?email=${encodeURIComponent(email)}`,
        );
        const list = unwrapList(reqRes) as PendingVerificationRequest[];
        const sorted = [...list].sort((a, b) => {
          const dateA = new Date(a.dateRequested || a.createdAt || 0).getTime();
          const dateB = new Date(b.dateRequested || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        const pairs = await Promise.allSettled(
          sorted.map(async (req) => {
            const res = await apiService.get(
              `/verification/response/by-request/${req._id}?email=${encodeURIComponent(email as string)}`,
            );
            return { req, submission: unwrapData(res) };
          }),
        );

        const pending = pairs
          .filter((pair) => pair.status === "fulfilled")
          .map((pair) => (pair as PromiseFulfilledResult<{ req: PendingVerificationRequest; submission: unknown }>).value)
          .filter(({ submission }) => !submission)
          .map(({ req }) => req);

        setPendingRequests(pending);
      } catch {
        setPendingRequests([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <section
        aria-label="Loading pending verification requests"
        className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5 animate-pulse"
      >
        <div className="h-5 w-56 rounded bg-amber-100 mb-4" />
        <div className="h-20 rounded-xl bg-white/80 border border-amber-100" />
      </section>
    );
  }

  if (!pendingRequests.length) {
    return null;
  }

  const handleComplete = (verificationId: string) => {
    router.push(`/dashboard/tenant/verification/personal-info?verificationId=${verificationId}`);
  };

  return (
    <section
      aria-label="Pending verification requests"
      className="mb-8 rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900">
            <FiAlertCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Pending verification {pendingRequests.length === 1 ? "request" : "requests"}
            </h2>
            <p className="mt-1 text-sm text-gray-700">
              A landlord is waiting for you to complete your verification. Finish the form to continue.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/tenant/verification/requests")}
          className="text-sm font-medium text-amber-900 hover:text-amber-950 hover:underline shrink-0"
        >
          View all verifications
        </button>
      </div>

      <div className="space-y-3">
        {pendingRequests.map((req) => {
          const landlordName = [req.requestedBy?.firstName, req.requestedBy?.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() || "Landlord";

          return (
            <div
              key={req._id}
              className="flex flex-col gap-4 rounded-xl border border-amber-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                    <FiUserCheck aria-hidden="true" />
                    Action required
                  </span>
                  <span className="text-xs text-gray-500">
                    Requested {formatRequestDate(req.dateRequested || req.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  From {landlordName}
                </p>
                <p className="text-sm text-gray-600">{tierLabel(req.verificationTier)}</p>
              </div>

              <button
                type="button"
                onClick={() => handleComplete(req._id)}
                className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition-colors shrink-0"
                aria-label={`Complete verification request from ${landlordName}`}
              >
                Complete verification
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PendingVerificationRequests;
