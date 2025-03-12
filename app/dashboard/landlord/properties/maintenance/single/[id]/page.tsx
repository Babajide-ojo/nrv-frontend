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
import LandLordLayout from "@/app/components/layout/LandLordLayout";

const SingleMaintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenAcknowledge, setIsOpenOpenAcknowledge] =
    useState<boolean>(false);
  const [isOpenDecline, setIsOpenOpenDecline] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<any>([]);

  // Fetch maintenance data
  const fetchData = async () => {
    const formData = { id };
    try {
      const response = await dispatch(getMaintenanceById(formData) as any); // Pass page parameter
      setMaintenance(response?.payload?.data);
    } catch (error) {
      toast.error("Failed to fetch maintenance data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submit for resolving or acknowledging
  const handleSubmit = async (status: string) => {
    const payload = { id, status };
    try {
      const data = await dispatch(markIssueAsResolved(payload) as any).unwrap();
      window.location.reload();
    } catch (error: any) {
      toast.error("An error occurred.");
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout>
            <ToastContainer />
            <div className="md:py-10 md:px-20 p-5">
              <div className="mb-8">
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
      maintenance?.status === "Resolved"
        ? "bg-[#107E4B]" // Green for Resolved
        : maintenance?.status === "New"
        ? "bg-blue-500" // Blue for New
        : maintenance?.status === "Acknowleged"
        ? "bg-yellow-500" // Yellow for Acknowleged
        : maintenance?.status === "Declined"
        ? "bg-red-500" // Red for Declined
        : "bg-nrvPrimaryGreen" // Default color if none match
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
                    <h3>
                      <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                        Tenant Name
                      </span>{" "}
                      <br />
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
                      <br />
                      <span className="font-light mb-2 text-md text-nrvDarkGrey">
                        {maintenance?.createdBy?.phoneNumber}
                      </span>
                      <br />
                      <span className="font-light mb-2 text-md text-nrvDarkGrey">
                        {maintenance?.createdBy?.email}
                      </span>
                    </h3>
                  </div>
                </div>

                <div>
                  <div className="md:flex block justify-between md:gap-8">
                    <div className="md:w-1/2 w-full">
                      <h3>
                        <br />
                        <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                          {maintenance?.title}
                        </span>
                        <br />
                        <div className="text-sm leading-10 text-nrvDarkGrey font-light">
                          {maintenance?.description}
                        </div>
                        <div className="flex gap-4">
                          {maintenance?.status === "New" && (
                            <p
                              className="underline pt-2 text-blue-500 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpenOpenAcknowledge(!isOpenAcknowledge);
                              }}
                            >
                              Acknowledge Issue
                            </p>
                          )}
                        </div>
                        <div>
                          {maintenance?.status === "Acknowleged" && (
                            <p
                              className="underline pt-2 text-green-600 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpen(true);
                              }}
                            >
                              Mark As Resolved
                            </p>
                          )}
                        </div>
                        <div>
                          {(maintenance?.status === "New" ||
                            maintenance?.status === "Acknowleged") && (
                            <p
                              className="underline pt-2 text-red-500 text-sm cursor-pointer"
                              onClick={() => {
                                setIsOpenOpenDecline(true);
                              }}
                            >
                              Decline Issue
                            </p>
                          )}
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

            {/* Modal for Resolved */}
            <CenterModal
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
              }}
            >
              <div className="mx-auto text-center p-4 w-full md:w-4/5">
                <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
                  Has this issue been resolved?
                </h2>
                <p className="text-nrvLightGrey text-sm mb-4 mt-4">
                  Performing this action will mark this issue as resolved and
                  close the issue.
                </p>

                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-white w-72 max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="bluebg"
                    showIcon={false}
                    disabled={isLoading}
                    onClick={() => {
                      handleSubmit("Resolved");
                    }}
                  >
                    Submit
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2 hover:text-white hover:bg-nrvPrimaryGreen"
                    variant="mediumGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CenterModal>

            {/* Modal for Acknowledgement */}
            <CenterModal
              isOpen={isOpenAcknowledge}
              onClose={() => {
                setIsOpenOpenAcknowledge(false);
              }}
            >
              <div className="mx-auto text-center p-4 w-full md:w-4/5">
                <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
                  Acknowledge Complaint/Issue
                </h2>
                <p className="text-nrvLightGrey text-sm mb-4 mt-4">
                  Performing this action will mark this issue as Acknowleged.
                  This means the issue resolution has commenced.
                </p>

                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-white w-72 max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="bluebg"
                    showIcon={false}
                    disabled={isLoading}
                    onClick={() => {
                      handleSubmit("Acknowleged");
                    }}
                  >
                    Submit
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2 hover:text-white hover:bg-nrvPrimaryGreen"
                    variant="mediumGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsOpenOpenAcknowledge(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CenterModal>

            {/* Modal for Decline */}
            <CenterModal
              isOpen={isOpenDecline}
              onClose={() => {
                setIsOpenOpenDecline(false);
              }}
            >
              <div className="mx-auto text-center p-4 w-full md:w-4/5">
                <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
                  Decline Complaint/Issue
                </h2>
                <p className="text-nrvLightGrey text-sm mb-4 mt-4">
                  Performing this action will mark this issue as declined
                </p>

                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-white w-72 max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="bluebg"
                    showIcon={false}
                    disabled={isLoading}
                    onClick={() => {
                      handleSubmit("Declined");
                    }}
                  >
                    Submit
                  </Button>
                </div>
                <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2 hover:text-white hover:bg-nrvPrimaryGreen"
                    variant="mediumGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsOpenOpenDecline(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CenterModal>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default SingleMaintainance;
