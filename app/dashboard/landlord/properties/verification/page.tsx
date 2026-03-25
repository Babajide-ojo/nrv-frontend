"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDateToWords } from "@/helpers/utils";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TenantVerification() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState<string | null>(null);
  const [statusOptions, setStatusOptions] = useState<Array<{ value: string; label: string }>>([]);

  // Use effect to safely access localStorage in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUserId(user?.user?._id || null);
    }
  }, []);

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
          { value: 'approved', label: 'Approved' },
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
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Tenant Verification</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send tenant verification requests and review their profiles before a lease agreement.
              </p>
            </div>
            <button
              className="bg-green-900 text-white px-4 py-2.5 text-sm rounded-lg hover:bg-green-800 transition shrink-0 min-h-[44px] touch-manipulation"
              onClick={() => router.push(`/dashboard/landlord/properties/verification/request`)}
            >
              + New Verification Request
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
                        label = "Approved";
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
