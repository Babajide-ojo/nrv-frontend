"use client";
import { ToastContainer } from "react-toastify";
import TenantLayout from "@/app/components/layout/TenantLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useState, useEffect } from "react";
import Button from "../../../../../components/shared/buttons/Button";
import { useParams, useRouter } from "next/navigation";
import MaintainanceCard from "@/app/components/maintainance/MaintainanceCard";
import { useDispatch } from "react-redux";
import { getMaintenanceByUserId } from "../../../../../../redux/slices/maintenanceSlice";
import EmptyState from "@/app/components/screens/empty-state/EmptyState";
import { IoAddCircle } from "react-icons/io5";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import CenterModal from "@/app/components/shared/modals/CenterModal";

const Maintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [maintenance, setMaintenance] = useState<any>([]);


  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    const formData = {
      page: 5,
      id: user?.user?._id,
      roomId: id,
    };

    try {
      const response = await dispatch(getMaintenanceByUserId(formData) as any); // Pass page parameter
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
          <TenantLayout>
            <ToastContainer />

            <div className="md:py-10 md:px-20 p-5">
              <div className="flex justify-between items-center  mb-8">
              <div className="text-nrvGreyBlack mb-4 flex gap-3">
                  <BackIcon />
                  <div className="md:text-xl text-md font-medium text-nrvDarkGrey">
                    Maintenance Requests
                  </div>
                </div>
                <Button
                  onClick={() =>
                    router.push(
                      `/dashboard/tenant/rented-properties/maintenance/request-maintainance/${id}`
                    )
                  }
                  variant="roundedRec"
                  showIcon={false}
                >
                  Create Request
                </Button>
              </div>
              {maintenance.length < 1 ? (
                <div>
                  <div className="p-8 w-full">
                    <div className="w-full flex justify-center items-center">
                      <div className="">
                        <EmptyState />
                        <p className="text-nrvLightGrey m-2">
                          No Maintenance Request
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 grid-cols-1 w-full">
                  {maintenance &&
                    maintenance.map((item: any, index: any) => (
                      <div key={index}>
                        <MaintainanceCard
                          title={item.title}
                          description={item.description}
                          dateLogged={item.createdAt}
                          status={item.status}
                          id={item._id}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>

    
          </TenantLayout>

         
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Maintainance;
