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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let userEmail = null;
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("nrv-user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userEmail = userObj?.user?.email || userObj?.email;
        } catch {}
      }
    }
    if (!userEmail) {
      setLoading(false);
      setError("User email not found. Please sign in again.");
      return;
    }
    fetchRequests(userEmail);
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async (email: string) => {
    setLoading(true);
    try {
      const res = await apiService.get(`/verification/by-email?email=${email}`);
      console.log({ res });
      setRequests(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch verification requests.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantLayout>
      <div className="max-w-3xl mx-auto w-full p-3 bg-white rounded-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-nrvPrimaryGreen flex items-center gap-2">
          <FiUserCheck className="inline-block" /> Verification Requests
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
                onClick={() => router.push(`/dashboard/tenant/verification/${req._id}`)}
                tabIndex={0}
                aria-label={`Open verification request ${req._id}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/dashboard/tenant/verification/${req._id}`);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FiUser className="text-nrvPrimaryGreen" />
                    {req.firstName} {req.lastName} <span className="text-xs text-gray-400">(You)</span>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-medium capitalize ${statusColors[req.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}
                  >
                    {req.status || "-"}
                  </span>
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