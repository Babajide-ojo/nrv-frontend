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
      roomId: id
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

            <div className="py-10 px-20">
              <div className="flex justify-between items-center  mb-8">
              <div className="text-2xl text-nrvGreyBlack mb-4 flex gap-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        router.back();
                      }}
                    >
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.6548 5L10.8333 13.8215C10.2778 14.377 10 14.6548 10 15C10 15.3452 10.2778 15.623 10.8333 16.1785L19.6548 25"
                          stroke="#333333"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div>Maintenance</div>
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
              {
                maintenance.length < 1 ? (
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
                  </div> ):  (
                       <div className="grid md:grid-cols-2 grid-cols-1  md:w-4/5 w-full">
                       {maintenance &&
                         maintenance.map((item: any, index: any) => (
                           <div key={index}>
                             <MaintainanceCard
                               title={item.title}
                               description={item.description}
                               dateLogged={item.createdAt}
                               status={item.status}
                             />
                           </div>
                         ))}
                     </div>
                  )
                
              }
           
            </div>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Maintainance;
