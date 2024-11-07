"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TenantLayout from "@/app/components/layout/TenantLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getMaintenanceById,
  markIssueAsResolved,
} from "@/redux/slices/maintenanceSlice";

import Image from "next/image";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import Button from "@/app/components/shared/buttons/Button";
import CenterModal from "@/app/components/shared/modals/CenterModal";

const SingleMaintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<any>([]);

  const fetchData = async () => {
    const formData = {
      id: id,
    };

    try {
      const response = await dispatch(getMaintenanceById(formData) as any); // Pass page parameter
      setMaintenance(response?.payload?.data);
    } catch (error) {
    } finally {
    }
  };

  const handleSubmit = async () => {
    const payload = {
      id: id,
    };

    try {
      setIsLoading(true);
      const data = await dispatch(markIssueAsResolved(payload) as any).unwrap();
      if (data.response.statusCode === 400) {
        toast.error(data.response.message);
      }
      setMaintenance(data?.payload?.data);
      router.push(
        `/dashboard/tenant/rented-properties/maintenance/single/${id}`
      );
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
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
              <div className=" mb-8">
                <div className="flex justify-between space-between">
                  <div className="text-nrvGreyBlack mb-4 flex gap-3">
                    <BackIcon />
                    <div className="text-xl font-medium text-nrvDarkGrey">
                      Maintenance Request
                    </div>
                  </div>
                  <div>
                    <Button
                      className={`text-white text-md ${
                        maintenance.status === "Resolved"
                          ? "bg-[#107E4B]"
                          : "bg-nrvDarkBlue"
                      }`}
                      variant="ordinary"
                      size="small"
                      showIcon={false}
                    >
                      {maintenance?.status}
                    </Button>
                  </div>
                </div>

                <div className="flex pb-3 space-between justify-between">
                  <div>
                    <h3 className="">
                      <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                        Tenant Name
                      </span>{" "}
                      <br></br>{" "}
                      <span className="font-light mb-2 text-md text-nrvDarkGrey">
                        {maintenance?.createdBy?.firstName}{" "}
                        {maintenance?.createdBy?.lastName}
                      </span>
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-end">
                      <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                        Contact Details
                      </span>{" "}
                      <br></br>{" "}
                      <span className="font-light mb-2 text-md text-nrvDarkGrey">
                        {maintenance?.createdBy?.phoneNumber}
                      </span>
                      <br></br>{" "}
                      <span className="font-light mb-2 text-md text-nrvDarkGrey">
                        {maintenance?.createdBy?.email}
                      </span>
                    </h3>
                  </div>
                </div>
                <div>
                  <div className="md:flex block justify-between md:gap-8">
                    <div className="md:w-1/2 w-full">
                      <h3 className="">
                        <br></br>{" "}
                        <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                          {maintenance.title}
                        </span>
                        <br></br>
                        <div className="text-sm leading-10 text-nrvDarkGrey font-light">
                          {maintenance.description}
                        </div>
                     <div className="flex gap-5 mt-8">
                     <div>
                          {maintenance?.status != "Resolved" ? (
                            <p
                              className="underline pt-2 text-blue-500 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpen(!isOpen);
                              }}
                            >
                              Acknowledge Issue
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                     <div>
                          {maintenance?.status != "Resolved" ? (
                            <p
                              className="underline pt-2 text-green-600 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpen(!isOpen);
                              }}
                            >
                              Mark As Resolved
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div>
                          {maintenance?.status != "Resolved" ? (
                            <p
                              className="underline pt-2 text-red-500 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpen(!isOpen);
                              }}
                            >
                              Decline Issue
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                    
                     </div>
                      </h3>
                    </div>

                    <div className="mt-8 md:w-1/2 w-full flex justify-end">
                      <Image
                        src={maintenance.file}
                        alt="issue-image"
                        width={500}
                        height={350}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CenterModal
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
              }}
            >
              <div className="mx-auto text-center p-4 w-full md:w-4/5">
                <h2 className="text-nrvDarkBlue font-semibold text-xl">
                  Has this issue been resolved?
                </h2>
                <p className="text-nrvLightGrey text-sm mb-4 mt-4">
                  Performing this action will mark this issue as resolved and
                  close the issue
                </p>

                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-white w-72 max-w-full border border-nrvDarkBlue mt-2 rounded-md"
                    variant="bluebg"
                    showIcon={false}
                     disabled={isLoading === false ? false : true}
                  >
                    <div
                      className="flex gap-3"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Submit
                    </div>
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                    variant="mediumGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex gap-2">Close</div>
                  </Button>
                </div>
              </div>
            </CenterModal>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default SingleMaintainance;
