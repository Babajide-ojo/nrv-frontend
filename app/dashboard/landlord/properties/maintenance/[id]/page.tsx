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
import LandLordLayout from "@/app/components/layout/LandLordLayout";

const SingleMaintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<any>({});

  const fetchData = async () => {
    try {
      const response = await dispatch(getMaintenanceById({ id }) as any);
      setMaintenance(response?.payload?.data);
    } catch (error) {
      toast.error("Failed to fetch maintenance data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const data = await dispatch(markIssueAsResolved({ id }) as any).unwrap();
      if (data.response.statusCode === 400) {
        toast.error(data.response.message);
      }
      setMaintenance(data?.payload?.data);
      router.push(
        `/dashboard/tenant/rented-properties/maintenance/single/${id}`
      );
    } catch (error: any) {
      toast.error("Could not mark issue as resolved.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <LandLordLayout
        path="Apartment"
        mainPath="Maintenance"
        subMainPath="View Maintenance"
      >
        <ToastContainer />
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div className="p-5 md:p-10">
            <div className="flex flex-col gap-3 text-nrvGreyBlack mb-4">
              <div className="text-xl font-semibold">Maintenance Request</div>
              <div className="text-[14px] font-light">
                View and track your maintenance request
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="col-span-2 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row w-full gap-6">
                  <div className="border rounded-xl p-4 shadow-sm w-full lg:w-3/5 h-auto lg:h-[370px]">
                    <h3 className="text-md font-medium text-[#101828] mb-2">
                      Active Maintenance Ticket
                    </h3>
                    <div className="mb-4 flex justify-between flex-wrap">
                      <p className="text-sm text-red-600 font-medium">
                        Priority: {maintenance?.priority || "High Priority"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Reported on: {maintenance?.createdAt?.slice(0, 10)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-[12px] font-light text-[#475467]">
                          Issue Type
                        </p>
                        <p className="text-sm text-gray-600">
                          {maintenance?.title}
                        </p>
                      </div>

                      <div>
                        <p className="text-[12px] font-light text-[#475467]">
                          Description
                        </p>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {maintenance?.description}
                        </p>
                      </div>

                      <div>
                        <p className="text-[12px] font-light text-[#475467]">
                          Status
                        </p>
                        <p className="text-sm text-yellow-600 font-medium">
                          {maintenance?.status || "Pending"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-light text-[#475467]">
                          Your Availability
                        </p>
                        <p className="text-sm text-gray-600">
                          {maintenance?.availability || "Weekdays after 5pm"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button
                        className="bg-nrvPrimaryGreen text-white rounded-sm bg-[#2B892B]"
                        size="large"
                        variant="darkPrimary"
                      >
                        Mark As In-Progress
                      </Button>
                      <Button
                        className="border border-nrvPrimaryGreen text-nrvPrimaryGreen rounded-sm"
                        size="large"
                        variant="lightGrey"
                      >
                        Message Landlord
                      </Button>
                    </div>
                  </div>

                  <div className="w-full lg:w-2/5 h-auto flex flex-col gap-4">
                    <div className="border rounded-xl p-4 shadow-sm min-h-[150px]">
                      <h3 className="text-md font-medium text-[#101828] mb-2">
                        Assignment Card
                      </h3>
                      <div className="flex flex-col gap-4">
                        <p className="text-sm text-[#475467] ">
                          Currently assigned to:{" "}
                          <span className="text-gray-500">-</span>
                        </p>
                        <p className="text-sm  text-[#475467]">
                          Contact: <span className="text-gray-500">-</span>
                        </p>
                        <p className="text-sm  text-[#475467]">
                          Scheduled Date:{" "}
                          <span className="text-gray-500">-</span>
                        </p>
                      </div>
                    </div>
                    <div className="border rounded-xl p-4 shadow-sm min-h-[150px]">
                      <h3 className="text-md font-medium text-[#101828] mb-2">
                        Timeline
                      </h3>
                      <div className="flex flex-col gap-4">
                        <p className="text-sm  text-[#475467]">
                          Opened: {maintenance?.createdAt || "-"}
                        </p>
                        <p className="text-sm  text-[#475467]">
                          Diagnosed & Assigned: -
                        </p>
                        <p className="text-sm  text-[#475467]">
                          Repair Completed: -
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-4 shadow-sm">
                  <h3 className="text-md font-medium text-nrvDarkGrey mb-4">
                    Attachments from Tenant
                  </h3>
                  {maintenance?.attachments?.length ? (
                    maintenance.attachments.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-wrap justify-between items-center border rounded p-3 mb-2 bg-gray-50 text-sm"
                      >
                        <span className="truncate max-w-[70%]">{file.name}</span>
                        <div className="flex gap-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            👁️
                          </a>
                          <a href={file.url} download>
                            ⬇️
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      No attachments provided.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <div className="border rounded-xl shadow-sm">
                  <p className="text-nrvPrimaryGreen font-medium text-sm p-4 ">
                    Your Maintenance Request is in Progress!
                  </p>
                  <p className="text-sm text-gray-500 p-4 leading-8">
                    Your maintenance request has been received by the property
                    owner. You'll be notified once assigned to a technician.
                  </p>
                  <div className="flex justify-end bg-gray-50 p-4">
                    <Button
                      className="border text-nrvPrimaryGreen"
                      size="small"
                      variant="light"
                    >
                      Contact Property Owner
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden w-full">
                  <Image
                    src={maintenance.file}
                    alt="Property Image"
                    width={500}
                    height={700}
                    className="rounded-xl object-cover w-full h-auto max-h-[400px]"
                  />
                  <div className="text-sm mt-2 text-gray-700">
                    {maintenance.propertyId?.streetAddress},
                    {maintenance.propertyId?.city},
                    {maintenance.propertyId?.state}
                  </div>
                </div>
              </div>
            </div>

            <CenterModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                    className="text-white w-full md:w-72 border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="bluebg"
                    showIcon={false}
                    disabled={isLoading}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>

                  <Button
                    size="small"
                    className="w-full md:w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mt-2 hover:text-white hover:bg-nrvPrimaryGreen"
                    variant="mediumGrey"
                    showIcon={false}
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CenterModal>
          </div>
        )}
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default SingleMaintainance;
