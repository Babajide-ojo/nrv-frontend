"use client";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiService } from "@/lib/api";
import { FiUser, FiMail, FiHash, FiHome, FiUserCheck, FiPhone } from "react-icons/fi";
import { MdArrowBackIos } from "react-icons/md";
import {
  getVerificationNextStep,
  isVerificationIncomplete,
  verificationStepPath,
} from "@/lib/verificationProgress";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  declined: "bg-red-100 text-red-800 border-red-300",
};

const VerificationRequestsPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [submissionByRequestId, setSubmissionByRequestId] = useState<Record<string, any | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [decliningId, setDecliningId] = useState<string | null>(null);

  useEffect(() => {
    let email = null;
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("nrv-user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          email = userObj?.user?.email || userObj?.email;
        } catch {}
      }
    }
    if (!email) {
      setLoading(false);
      setError("User email not found. Please sign in again.");
      return;
    }
    setUserEmail(email);
    fetchRequests(email);
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async (email: string) => {
    setLoading(true);
    try {
      const res: any = await apiService.get(`/verification/by-email?email=${encodeURIComponent(email)}`);
      const raw = Array.isArray(res?.data) ? res.data : [];
      const list = [...raw].sort((a, b) => {
        const dateA = new Date(a.dateRequested || a.createdAt || 0).getTime();
        const dateB = new Date(b.dateRequested || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      setRequests(list);

      // For each verification request, check whether a submission exists for this tenant email.
      const pairs = await Promise.allSettled(
        list.map(async (req: any) => {
          const r: any = await apiService.get(
            `/verification/response/by-request/${req._id}?email=${encodeURIComponent(email)}`,
          );
          return [req._id, r?.data ?? null] as const;
        }),
      );
      const map: Record<string, any | null> = {};
      for (const p of pairs) {
        if (p.status === "fulfilled") {
          const [id, submission] = p.value;
          map[id] = submission;
        }
      }
      setSubmissionByRequestId(map);
    } catch (err: any) {
      setError(err.message || "Failed to fetch verification requests.");
    } finally {
      setLoading(false);
    }
  };

  const shouldOpenVerificationDetails = (req: any) => {
    const status = String(req?.status || "").toLowerCase();
    if (status === "declined" || status === "rejected") {
      return true;
    }
    if (status === "approved" || status === "verification completed") {
      return true;
    }
    const submission = submissionByRequestId[req?._id];
    return Boolean(submission) && !isVerificationIncomplete(submission);
  };

  const handleOpenRequest = (req: any) => {
    const status = String(req?.status || "").toLowerCase();
    // Always land on summary page for declined — never open the form wizard.
    if (status === "declined" || status === "rejected") {
      router.push(`/dashboard/tenant/verification?verificationId=${req._id}`);
      return;
    }
    if (shouldOpenVerificationDetails(req)) {
      router.push(`/dashboard/tenant/verification?verificationId=${req._id}`);
      return;
    }
    const nextStep = getVerificationNextStep(submissionByRequestId[req?._id]);
    router.push(verificationStepPath(req._id, nextStep));
  };

  const canDeclineRequest = (req: any) => {
    const status = String(req?.status || "").toLowerCase();
    if (status === "declined" || status === "rejected" || status === "approved") {
      return false;
    }
    return isVerificationIncomplete(submissionByRequestId[req?._id]);
  };

  const handleDeclineRequest = async (req: any, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Decline this verification request? The landlord will be notified and you will not continue this screening.",
    );
    if (!confirmed) {
      return;
    }

    setDecliningId(req._id);
    try {
      await apiService.post(
        `/verification/${req._id}/decline`,
        userEmail ? { email: userEmail } : {},
      );
      toast.success("Verification request declined");
      if (userEmail) {
        await fetchRequests(userEmail);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to decline verification request.");
    } finally {
      setDecliningId(null);
    }
  };

  return (
    <TenantLayout path="Verification" mainPath=" / My Verifications">
      <div className="max-w-3xl mx-auto w-full p-3 bg-white rounded-lg mt-8">
        <button
          onClick={() => router.push("/dashboard/tenant")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-nrvPrimaryGreen mb-4"
        >
          <MdArrowBackIos size={16} />
          Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold mb-6 text-nrvPrimaryGreen flex items-center gap-2">
          <FiUserCheck className="inline-block" /> My Verifications
        </h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : requests && requests.length > 0 ? (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gray-50 p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-nrvPrimaryGreen"
                onClick={() => handleOpenRequest(req)}
                tabIndex={0}
                aria-label={`Open verification request ${req._id}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleOpenRequest(req);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FiUser className="text-nrvPrimaryGreen" />
                    {req.firstName} {req.lastName} <span className="text-xs text-gray-400">(You)</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${
                      statusColors[(req.status || "").toLowerCase()] ||
                      "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {(req.status || "").toLowerCase() === "approved"
                      ? "Verification completed"
                      : (req.status || "").toLowerCase() === "declined"
                        ? "Declined"
                        : req.status
                          ? String(req.status).charAt(0).toUpperCase() + String(req.status).slice(1).toLowerCase()
                          : "-"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <FiMail /> {req.email}
                  </div>
                  {(req.nin != null && req.nin !== "") && (
                    <div className="flex items-center gap-1">
                      <FiHash /> NIN: {req.nin}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FiHome /> Requested on: {req.dateRequested ? new Date(req.dateRequested).toLocaleString() : "-"}
                  </div>
                </div>
                <div className="mt-4 bg-white border border-gray-100 rounded-lg p-4">
                  <div className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiUser className="text-nrvPrimaryGreen" /> Landlord Information
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiUser /> {req.requestedBy?.firstName} {req.requestedBy?.lastName}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiMail /> {req.requestedBy?.email}
                    </div>
                    {req.requestedBy?.phoneNumber && (
                      <div className="flex items-center gap-1">
                        <FiPhone /> {req.requestedBy.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
                {canDeclineRequest(req) && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => handleDeclineRequest(req, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleDeclineRequest(req, e);
                        }
                      }}
                      disabled={decliningId === req._id}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                      aria-label={`Decline verification request ${req._id}`}
                      tabIndex={0}
                    >
                      {decliningId === req._id ? "Declining…" : "Decline"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No verification requests found for your email.</div>
        )}
      </div>
    </TenantLayout>
  );
};

export default VerificationRequestsPage; 