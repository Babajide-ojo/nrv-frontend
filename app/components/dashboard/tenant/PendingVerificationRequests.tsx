"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiService } from "@/lib/api";
import { FiAlertCircle } from "react-icons/fi";
import TermsAgreementCheckbox from "@/app/components/shared/TermsAgreementCheckbox";
import {
  getVerificationNextStep,
  isVerificationIncomplete,
  verificationStepPath,
} from "@/lib/verificationProgress";

type PendingVerificationRequest = {
  _id: string;
  dateRequested?: string;
  createdAt?: string;
  status?: string;
  verificationTier?: "standard" | "premium";
  requestedBy?: {
    firstName?: string;
    lastName?: string;
  };
  nextStep?: ReturnType<typeof getVerificationNextStep>;
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

const getTenantEmail = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const userStr = localStorage.getItem("nrv-user");
  if (!userStr) {
    return null;
  }
  try {
    const userObj = JSON.parse(userStr);
    return userObj?.user?.email || userObj?.email || null;
  } catch {
    return null;
  }
};

const PendingVerificationRequests = () => {
  const router = useRouter();
  const [pendingRequests, setPendingRequests] = useState<PendingVerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const loadPending = useCallback(async () => {
    const email = getTenantEmail();
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
      const active = list.filter((req) => {
        const status = String(req.status || "").toLowerCase();
        return status !== "declined" && status !== "rejected";
      });
      const sorted = [...active].sort((a, b) => {
        const dateA = new Date(a.dateRequested || a.createdAt || 0).getTime();
        const dateB = new Date(b.dateRequested || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      const pairs = await Promise.allSettled(
        sorted.map(async (req) => {
          const res = await apiService.get(
            `/verification/response/by-request/${req._id}?email=${encodeURIComponent(email)}`,
          );
          return { req, submission: unwrapData(res) };
        }),
      );

      const pending = pairs
        .filter((pair) => pair.status === "fulfilled")
        .map((pair) => (pair as PromiseFulfilledResult<{ req: PendingVerificationRequest; submission: unknown }>).value)
        .filter(({ submission }) => isVerificationIncomplete(submission))
        .map(({ req, submission }) => ({
          ...req,
          nextStep: getVerificationNextStep(submission),
        }));

      setPendingRequests(pending);
    } catch {
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  useEffect(() => {
    setTermsAccepted(false);
  }, [pendingRequests[0]?._id]);

  if (loading) {
    return (
      <section
        aria-label="Loading pending verification requests"
        className="mb-8 overflow-hidden rounded-2xl border border-[#E8D9B8] bg-[#FBF7EE] p-5 sm:p-6 animate-pulse"
      >
        <div className="mb-5 h-5 w-48 rounded bg-[#EDE4D0]" />
        <div className="h-28 rounded-xl bg-white/70" />
      </section>
    );
  }

  if (!pendingRequests.length) {
    return null;
  }

  const handleComplete = (verificationId: string, nextStep?: PendingVerificationRequest["nextStep"]) => {
    if (!termsAccepted) {
      toast.error("Please agree to the terms before accepting this verification request.");
      return;
    }
    router.push(
      verificationStepPath(verificationId, nextStep || "personal"),
    );
  };

  const handleDecline = async (verificationId: string) => {
    const confirmed = window.confirm(
      "Decline this verification request? The landlord will be notified and you will not continue this screening.",
    );
    if (!confirmed) {
      return;
    }

    const email = getTenantEmail();
    setDecliningId(verificationId);
    try {
      await apiService.post(`/verification/${verificationId}/decline`, email ? { email } : {});
      toast.success("Verification request declined");
      await loadPending();
      router.push("/dashboard/tenant/verification/requests");
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline verification request.");
    } finally {
      setDecliningId(null);
    }
  };

  const featuredRequest = pendingRequests[0];
  const remainingCount = pendingRequests.length - 1;
  const landlordName = [
    featuredRequest.requestedBy?.firstName,
    featuredRequest.requestedBy?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "Landlord";
  const requestDate = formatRequestDate(
    featuredRequest.dateRequested || featuredRequest.createdAt,
  );
  const continueLabel =
    featuredRequest.nextStep && featuredRequest.nextStep !== "personal"
      ? "Continue verification"
      : "Complete verification";
  const isDeclining = decliningId === featuredRequest._id;

  return (
    <section
      aria-label="Pending verification requests"
      className="mb-8 overflow-hidden rounded-2xl border border-[#E8D9B8] bg-[#FBF7EE]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#E8D9B8]/80 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0E2C4] text-[#8A5A12]"
            aria-hidden="true"
          >
            <FiAlertCircle className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-[#1C1917] sm:text-lg">
              Pending verification request
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[#57534E]">
              {landlordName} is waiting for you to finish screening.
              {remainingCount > 0
                ? ` ${remainingCount} more pending ${remainingCount === 1 ? "request" : "requests"}.`
                : ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/tenant/verification/requests")}
          className="shrink-0 rounded-md px-1 py-1 text-sm font-medium text-[#8A5A12] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A5A12]"
          aria-label="View all verification requests"
        >
          View all
          {remainingCount > 0 ? ` (${pendingRequests.length})` : ""}
        </button>
      </div>

      <div className="space-y-4 bg-white px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[#A8A29E]">
            From
          </p>
          <p className="text-lg font-semibold tracking-tight text-[#1C1917]">
            {landlordName}
          </p>
          <p className="text-sm text-[#78716C]">
            {tierLabel(featuredRequest.verificationTier)}
            <span className="mx-1.5 text-[#D6D3D1]" aria-hidden="true">
              ·
            </span>
            Requested {requestDate}
          </p>
        </div>

        <TermsAgreementCheckbox
          checked={termsAccepted}
          onChange={setTermsAccepted}
          id="pending-verification-terms"
          label="I agree to the"
        />

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => handleDecline(featuredRequest._id)}
            disabled={isDeclining}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#E7E5E4] bg-white px-4 py-2.5 text-sm font-medium text-[#57534E] transition-colors hover:border-[#D6D3D1] hover:bg-[#FAFAF9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57534E] disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Decline verification request from ${landlordName}`}
          >
            {isDeclining ? "Declining…" : "Decline"}
          </button>
          <button
            type="button"
            onClick={() => handleComplete(featuredRequest._id, featuredRequest.nextStep)}
            disabled={isDeclining || !termsAccepted}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-nrvPrimaryGreen px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#023524] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nrvPrimaryGreen disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`${continueLabel} from ${landlordName}`}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PendingVerificationRequests;
