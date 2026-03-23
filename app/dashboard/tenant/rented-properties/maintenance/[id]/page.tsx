"use client";
import TenantLayout from "@/app/components/layout/TenantLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useState, useEffect } from "react";
import Button from "../../../../../components/shared/buttons/Button";
import { useParams, useRouter } from "next/navigation";
import MaintainanceCard from "@/app/components/maintainance/MaintainanceCard";
import { useDispatch } from "react-redux";
import { getMaintenanceByUserId } from "../../../../../../redux/slices/maintenanceSlice";
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
      <ProtectedRoute>
        <TenantLayout>
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
            {isLoading ? (
              <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="md:w-4/5 w-full rounded-lg border border-nrvGreyMediumBg bg-white p-5 h-50 animate-pulse">
                    <div className="flex gap-3 items-center">
                      <div className="w-full flex gap-4 justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4 mb-4 text-end ml-auto"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : maintenance.length < 1 ? (
                <div>
                  <div className="p-8 w-full">
                    <div className="w-full flex justify-center items-center">
                      <div className="w-full max-w-md text-center rounded-2xl border border-gray-200 bg-white p-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                          <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 font-medium">
                          No maintenance request yet
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Create a request and track updates here.
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
                           type="tenant"
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
    </div>
  );
};

export default Maintainance;
