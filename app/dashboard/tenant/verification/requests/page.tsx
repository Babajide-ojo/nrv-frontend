"use client";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";
import { FiUser, FiMail, FiPhone, FiHome, FiUserCheck } from "react-icons/fi";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const VerificationRequestsPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [submissionByRequestId, setSubmissionByRequestId] = useState<Record<string, any | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
      const list = Array.isArray(res?.data) ? res.data : [];
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

  return (
    <TenantLayout path="Verification" mainPath=" / My Verifications">
      <div className="max-w-3xl mx-auto w-full p-3 bg-white rounded-lg mt-8">
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
                onClick={() => {
                  const hasSubmission = !!submissionByRequestId[req._id];
                  if (hasSubmission) {
                    router.push(`/dashboard/tenant/verification?verificationId=${req._id}`);
                    return;
                  }
                  router.push(`/dashboard/tenant/verification/personal-info?verificationId=${req._id}`);
                }}
                tabIndex={0}
                aria-label={`Open verification request ${req._id}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    const hasSubmission = !!submissionByRequestId[req._id];
                    if (hasSubmission) {
                      router.push(`/dashboard/tenant/verification?verificationId=${req._id}`);
                      return;
                    }
                    router.push(`/dashboard/tenant/verification/personal-info?verificationId=${req._id}`);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FiUser className="text-nrvPrimaryGreen" />
                    {req.firstName} {req.lastName} <span className="text-xs text-gray-400">(You)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-medium capitalize ${
                        statusColors[req.status] || "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {req.status || "-"}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${
                        submissionByRequestId[req._id]
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                      title={submissionByRequestId[req._id] ? "Submission found" : "No submission yet"}
                    >
                      {submissionByRequestId[req._id] ? "Submitted" : "Not submitted"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <FiMail /> {req.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiPhone /> {req.phone}
                  </div>
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
                    <div className="flex items-center gap-1">
                      <FiPhone /> {req.requestedBy?.phoneNumber}
                    </div>
                  </div>
                </div>
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