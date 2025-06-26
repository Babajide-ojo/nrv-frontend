"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import DataTable from "@/app/components/shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDateToWords } from "@/helpers/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TenantVerification() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [userId, setUserId] = useState<string | null>(null);

  // Use effect to safely access localStorage in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUserId(user?.user?._id || null);
    }
  }, []);

  const handleRowAction = (id: string) => {
    return (
      <div className="flex items-center gap-2">
        <button onClick={() => {}} className="p-1 hover:bg-gray-100 rounded">
          <Eye size={16} />
        </button>
        <button onClick={() => {}} className="p-1 hover:bg-gray-100 rounded">
          <Pencil size={16} />
        </button>
        <button onClick={() => {}} className="p-1 hover:bg-red-100 rounded">
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      <LandLordLayout path="Tenant Verification">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Tenant Verification</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Send tenant verification requests and review their profiles before a lease agreement.
              </p>
            </div>

            <button
              className="bg-green-900 text-white px-4 py-2 text-sm rounded-md hover:bg-green-800 transition"
              onClick={() => router.push(`/dashboard/landlord/properties/verification/request`)}
            >
              + New Tenant Request
            </button>
          </div>

          <div className="bg-white border rounded-lg shadow-sm">
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h4 className="text-md font-medium">Tenant Screening Report</h4>
            </div>

            {/* Render DataTable only when userId is available */}
            {userId && (
              <DataTable
                rowActions={handleRowAction}
                endpoint={`${API_URL}/verification/user/${userId}`}
                columns={[
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
                        label = "Tenant Verified";
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
