"use client";
import { ToastContainer } from "react-toastify";
import TenantLayout from "@/app/components/layout/TenantLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useState, useEffect } from "react";
import Button from "@/app/components/shared/buttons/Button";
import { useParams, useRouter } from "next/navigation";
import MaintainanceCard from "@/app/components/maintainance/MaintainanceCard";
import { useDispatch } from "react-redux";
import {
  getMaintenanceById,
  getMaintenanceByOwnerId,
  getMaintenanceByUserId,
} from "@/redux/slices/maintenanceSlice";
import EmptyState from "@/app/components/screens/empty-state/EmptyState";
import { IoAddCircle } from "react-icons/io5";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import DataTable from "@/app/components/shared/tables/ReusableTable";
import { formatDateToWords } from "@/helpers/utils";
import MaintenanceSummary from "@/app/components/maintainance/MaintenanceSummary";
import { API_URL } from "@/config/constant";

const Maintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [maintenance, setMaintenance] = useState<any>([]);

  let user: any = null;
  if (typeof window !== "undefined") {
    user = JSON.parse(localStorage.getItem("nrv-user") as any);
  }
  const fetchData = async () => {
    const formData = {
      page: 5,
      ownerId: user?.user?._id,
    };

    try {
      const response = await dispatch(getMaintenanceByOwnerId(formData) as any); // Pass page parameter
      setMaintenance(response?.payload?.data);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);
  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout mainPath="Maintenance">
            <ToastContainer />
           <MaintenanceSummary/>
            <DataTable
              endpoint={`${API_URL}/maintenance/get-landlord-maintenance/${user?.user?._id}`}
              columns={[
                {
                  key: "roomId",
                  label: "Apartment Name & Address",
                  render: (val) => (
                    <div>
                      <div className="font-[#101828] font-medium text-[13px]">
                        {val?.apartmentType || "N/A"}
                      </div>{" "}
                      <div>{val?.propertyId?.streetAddress}</div>
                    </div>
                  ),
                },
                {
                  key: "title",
                  label: "Title",
                },
                {
                  key: "description",
                  label: "Description",
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
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
