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
import React from "react";

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
                <div className="text-nrvGreyBlack mb-4 flex gap-3">
                  <BackIcon />
                  <div className="text-xl font-medium text-nrvDarkGrey">
                    Maintenance
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="">
                        <span className="font-medium mb-2 text-md text-nrvDarkGrey">
                          Issue Type
                        </span>{" "}
                        <br></br>{" "}
                        <span className="font-light mb-2 text-md text-nrvDarkGrey">
                          {maintenance.title}
                        </span>
                      </h3>
                    </div>
                    <div>
                      <Button
                        className={`w-full text-white text-md ${
                          maintenance.status === "Resolved"
                            ? "bg-[#107E4B]"
                            : "bg-nrvDarkBlue"
                        }`}
                        variant="ordinary"
                        size="small"
                        showIcon={false}
                      >
                        {maintenance.status}
                      </Button>
                      {maintenance.status != "Resolved" ? (
                        <p
                          className="underline pt-2 text-nrvDarkGrey text-sm cursor-pointer"
                          onClick={() => {
                            setIsOpen(!isOpen);
                          }}
                        >
                          Mark Issue as Resolved
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-medium mb-2 text-lg text-nrvDarkGrey">
                      Description
                    </h3>
                    <div className="text-md text-nrvDarkGrey font-light">
                      {maintenance.description}
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-medium mb-2 text-lg text-nrvDarkGrey">
                      Attached Image (Proof of Issue)
                    </h3>
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
