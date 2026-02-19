"use client";

import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getMaintenanceByOwnerId } from "@/redux/slices/maintenanceSlice";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { formatDateToWords } from "@/helpers/utils";
import { API_URL } from "@/config/constant";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const Maintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [maintenance, setMaintenance] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("New");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("nrv-user") || "null")
      : null;

  const fetchData = async () => {
    setIsLoading(true);
    const formData = {
      page: 1,
      ownerId: user?.user?._id,
    };

    try {
      const response = await dispatch(getMaintenanceByOwnerId(formData) as any);
      console.log({ response });

      setMaintenance(response?.payload || {});
    } catch (error) {
      console.error("Failed to fetch maintenance data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (status: string) => {
    setActiveTab(status);
  };


  const handleRowAction = (row: BaseRow) => {
    return (
      <div className="flex gap-2">
        <p className="text-xs text-[#2B892B] font-medium cursor-pointer" onClick={() => router.push(`/dashboard/landlord/properties/maintenance/${row._id}`)}>
          view
        </p>
      </div>
    );
  };

  const handleDelete = (id: string) => {
    // handle delete logic here
    console.log('Deleting user with ID:', id);
  };

  useEffect(() => {
    if (user?.user?._id) {
      fetchData();
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout mainPath="Maintenance">
            <ToastContainer />
            <div className="space-y-12 p-4 font-jakarta">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Maintenance Management
                  </h2>
                  <p className="text-gray-500">
                    View and manage your maintenance
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full md:w-auto"
                  onClick={fetchData}
                >
                  <RefreshCcw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>

              {/* Summary Cards */}
              {maintenance?.summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 border rounded-lg">
                  {[
                    {
                      title: "Active Requests",
                      value: `${maintenance?.summary?.New || 0} Open Tickets`,
                      change: "0%",
                      trend: "up",
                      comparison: "compared to the last 6 months",
                    },
                    {
                      title: "Resolved",
                      value: `${
                        maintenance?.summary?.Completed || 0
                      } Completed`,
                      change: "10%",
                      trend: "up",
                      comparison: "compared to the last 6 months",
                    },
                    {
                      title: "In Progress (Under Review)",
                      value: `${
                        maintenance?.summary["In Progress"] || 0
                      } In Progress`,
                      change: "83%",
                      trend: "up",
                      comparison: "compared to the last 6 months",
                    },
                    {
                      title: "Urgent",
                      value: `${
                        maintenance?.summary?.emergency || 0
                      } Emergency`,
                      change: "10%",
                      trend: "down",
                      comparison: "compared to the last 6 months",
                    },
                  ].map((card, i) => (
                    <div key={i} className="border-b sm:border-b-0 sm:border-r last:border-0 pb-4 sm:pb-0 px-4">
                      <p className="text-gray-500 text-sm">{card.title}</p>
                      <h3 className="text-xl font-semibold text-green-900">
                        {card.value}
                      </h3>
                      <p
                        className={`text-xs mt-1 ${
                          card.trend === "up"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {card.trend === "up" ? "↑" : "↓"} {card.change}{" "}
                        {card.comparison}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Tabs */}
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="default"
                  className={`${
                    activeTab === "New"
                      ? "bg-green-700 text-white text-center"
                      : "bg-white text-gray-800 border text-center"
                  }`}
                  onClick={() => handleTabClick("New")}
                >
                  Active Maintenance{" "}
                  <span className="ml-2 font-semibold">
                    {maintenance?.summary?.openTickets}
                  </span>
                </Button>
                <Button
                  className={`${
                    activeTab === "In progress"
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                  onClick={() => handleTabClick("In progress")}
                >
                  In Progress{" "}
                  <span className="ml-2 font-semibold">
                    {maintenance?.summary?.inProgress}
                  </span>
                </Button>
                <Button
                  className={`${
                    activeTab === "Completed"
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                  onClick={() => handleTabClick("Completed")}
                >
                  Completed{" "}
                  <span className="ml-2 font-semibold">
                    {maintenance?.summary?.completed}
                  </span>
                </Button>
              </div>

              {/* Section Title */}
              <div className="flex-col items-center gap-4 mt-2">
                <h4 className="text-lg font-semibold">
                  Recent Maintenance Activities
                </h4>
                <span className="text-gray-400 text-sm">
                  View and manage recent maintenance activities
                </span>
              </div>
            </div>

            <DataTable
              rowActions={handleRowAction}
              key={activeTab} 
              endpoint={`${API_URL}/maintenance/get-landlord-maintenance/${user?.user?._id}`}
              status={activeTab}
              columns={[
                {
                  key: "roomId",
                  label: "Apartment Name & Address",
                  render: (val) => (
                    <div>
                      <div className="text-[#101828] font-medium text-[13px]">
                        {val?.apartmentType || "N/A"}
                      </div>
                      <div className="text-[#667085] font-light">
                        {val?.propertyId?.streetAddress}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "maintenanceId",
                  label: "Maintenance ID",
                  render: (val) => <span className="font-medium italic text-[#045D23]">MR-{val}</span>,
                },
                {
                  key: "title",
                  label: "Title",
                },
                {
                  key: "createdAt",
                  label: "Reported On",
                  render: (val) => <span>{formatDateToWords(val)}</span>,
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        val === "Resolved"
                          ? "bg-[#F7F6F2] text-green-700"
                          : "bg-[#F7F6F2] text-yellow-700"
                      }`}
                    >
                      {val || "Pending"}
                    </span>
                  ),
                },
              ]}
            />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Maintainance;
