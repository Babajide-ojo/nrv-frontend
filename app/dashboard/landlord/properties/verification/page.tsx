"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDateToWords } from "@/helpers/utils";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { getVerificationCreditBalances } from "@/helpers/verificationCredits";

function VerificationListEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <div className="text-gray-400 text-5xl mb-3" aria-hidden>
        📄
      </div>
      <p className="text-gray-800 text-lg font-medium">Verification still pending</p>
      <p className="text-gray-500 text-sm mt-2 max-w-md">
        Your screening requests will show here. If you just sent one, your tenant may still be completing verification.
      </p>
    </div>
  );
}

export default function TenantVerification() {
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.user.data);

  const [userId, setUserId] = useState<string | null>(null);
  const [statusOptions, setStatusOptions] = useState<Array<{ value: string; label: string }>>([]);

  // Use effect to safely access localStorage in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUserId(user?.user?._id || null);
    }
  }, []);

  const creditBalances = useMemo(() => {
    const doc = reduxUser?.user ?? reduxUser;
    if (doc && (doc as { _id?: string })?._id) {
      return getVerificationCreditBalances(doc);
    }
    if (typeof window === "undefined") return { standard: 0, premium: 0 };
    try {
      const raw = localStorage.getItem("nrv-user");
      return getVerificationCreditBalances(raw ? JSON.parse(raw)?.user : null);
    } catch {
      return { standard: 0, premium: 0 };
    }
  }, [reduxUser]);

  // Fetch status options from backend
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await fetch(`${API_URL}/verification/statuses`);
        if (response.ok) {
          const data = await response.json();
          setStatusOptions(data.data || []);
        } else {
          console.error('Failed to fetch status options:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching status options:', error);
        // Fallback to default options if API fails
        setStatusOptions([
          { value: '', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Verification completed' },
          { value: 'rejected', label: 'Rejected' },
        ]);
      }
    };

    fetchStatusOptions();
  }, []);

  /** Format short reference for display (unique ID instead of long DB _id) */
  const formatVerificationRef = (row: BaseRow) => {
    const id = row.uniqueId != null ? String(row.uniqueId) : (row._id ? String(row._id).slice(-6) : "");
    return id ? `VRF-${id}` : "—";
  };

  const handleRowAction = (row: BaseRow) => {
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => router.push(`/dashboard/landlord/properties/verification/response/${row._id}?email=${encodeURIComponent(row.email)}`)} 
          className="p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
          title="View verification details"
        >
          <Eye size={16} className="text-blue-600" />
        </button>
      </div>
    );
  };

  return (
    <>
      <LandLordLayout path="Tenant Verification">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Tenant Verification</h2>
              <p className="mt-1 text-sm text-gray-500">
                Send tenant verification requests and review their profiles before a lease agreement.
              </p>
            </div>
            <button
              type="button"
              className="min-h-[44px] w-full shrink-0 touch-manipulation rounded-lg bg-green-900 px-4 py-2.5 text-sm text-white transition hover:bg-green-800 sm:w-auto"
              onClick={() => router.push(`/dashboard/landlord/properties/verification/request`)}
            >
              + New Verification Request
            </button>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-[#03442C]/20 bg-[#03442C]/[0.06] px-3 py-3 text-sm text-gray-800 sm:gap-x-4 sm:px-4">
            <span className="font-semibold text-[#03442C]">Verification credits</span>
            <span className="text-gray-700">
              Standard{" "}
              <strong className="text-gray-900 tabular-nums">{creditBalances.standard}</strong>
              <span className="text-gray-400 mx-2">·</span>
              Premium{" "}
              <strong className="text-gray-900 tabular-nums">{creditBalances.premium}</strong>
            </span>
            <button
              type="button"
              onClick={() => router.push("/dashboard/landlord/settings/plans")}
              className="text-sm font-medium text-[#03442C] hover:underline ml-auto"
            >
              Buy credits
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">Tenant Screening Report</h4>
            </div>

            {/* Render DataTable only when userId is available */}
            {userId && (
              <DataTable
                rowActions={handleRowAction}
                endpoint={`${API_URL}/verification/user/${userId}`}
                emptyStateComponent={VerificationListEmptyState}
                filters={[
                  {
                    name: 'status',
                    label: 'Status',
                    options: statusOptions,
                  },
                ]}

                columns={[
                  {
                    key: "uniqueId",
                    label: "Reference",
                    render: (_, row) => (
                      <span className="text-sm font-mono font-medium text-[#101828]">
                        {formatVerificationRef(row)}
                      </span>
                    ),
                  },
                  {
                    key: "fullName",
                    label: "Tenant Full Name",
                    render: (val, row) => (
                      <div className="flex items-center gap-2">
                        <div className="bg-green-100 text-green-700 text-xs w-8 h-8 flex items-center justify-center rounded-full font-bold">
                          {row.firstName?.[0] || ""}
                          {row.lastName?.[0] || ""}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-[#101828]">
                            {row.firstName} {row.lastName}
                          </div>
                          <div className="text-xs text-[#667085]">
                            {row.streetAddress || "N/A"}
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: "email",
                    label: "Tenant Contact Info.",
                    render: (val, row) => (
                      <div>
                        <div className="text-sm text-[#344054]">{val}</div>
                        <div className="text-xs text-[#667085]">{row.phone}</div>
                      </div>
                    ),
                  },
                  {
                    key: "status",
                    label: "Verification Status",
                    render: (val) => {
                      let colorClass = "bg-gray-100 text-gray-600";
                      let label = val;

                      if (val === "pending") {
                        colorClass = "bg-yellow-100 text-yellow-700";
                        label = "Pending";
                      } else if (val === "approved") {
                        colorClass = "bg-green-100 text-green-700";
                        label = "Verification completed";
                      } else if (val === "rejected") {
                        colorClass = "bg-red-100 text-red-700";
                        label = "Rejected";
                      }

                      return (
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${colorClass}`}>
                          {label}
                        </span>
                      );
                    },
                  },
                  {
                    key: "createdAt",
                    label: "Verification Date",
                    render: (val) => (
                      <span className="text-sm text-[#667085]">
                        {formatDateToWords(val)}
                      </span>
                    ),
                  },
                ]}
              />
            )}
          </div>
        </div>
      </LandLordLayout>
    </>
  );
}
