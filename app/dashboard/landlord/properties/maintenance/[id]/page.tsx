// "use client";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import TenantLayout from "@/app/components/layout/TenantLayout";
// import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
// import LoadingPage from "@/app/components/loaders/LoadingPage";
// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useDispatch } from "react-redux";
// import {
//   getMaintenanceById,
//   markIssueAsResolved,
// } from "@/redux/slices/maintenanceSlice";
// import Image from "next/image";
// import BackIcon from "@/app/components/shared/icons/BackIcon";
// import Button from "@/app/components/shared/buttons/Button";
// import CenterModal from "@/app/components/shared/modals/CenterModal";
// import React from "react";
// import LandLordLayout from "@/app/components/layout/LandLordLayout";

// const SingleMaintainance = () => {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [maintenance, setMaintenance] = useState<any>({});

//   const fetchData = async () => {
//     try {
//       const response = await dispatch(getMaintenanceById({ id }) as any);
//       setMaintenance(response?.payload?.data);
//     } catch (error) {
//       toast.error("Failed to fetch maintenance data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       setIsLoading(true);
//       const data = await dispatch(markIssueAsResolved({ id }) as any).unwrap();
//       if (data.response.statusCode === 400) {
//         toast.error(data.response.message);
//       }
//       setMaintenance(data?.payload?.data);
//       router.push(
//         `/dashboard/tenant/rented-properties/maintenance/single/${id}`
//       );
//     } catch (error: any) {
//       toast.error("Could not mark issue as resolved.");
//     } finally {
//       setIsLoading(false);
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <ProtectedRoute>
//       <LandLordLayout
//         path="Apartment"
//         mainPath="Maintenance"
//         subMainPath="View Maintenance"
//       >
//         <ToastContainer />
//         {isLoading ? (
//           <LoadingPage />
//         ) : (
//           <div className="p-5 md:p-10">
//             <div className="flex flex-col gap-3 text-nrvGreyBlack mb-4">
//               <div className="text-xl font-semibold">Maintenance Request</div>
//               <div className="text-[14px] font-light">
//                 View and track your maintenance request
//               </div>
//             </div>

//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//               {/* Left Column */}
//               <div className="col-span-2 flex flex-col gap-6">
//                 <div className="flex flex-col lg:flex-row w-full gap-6">
//                   <div className="border rounded-xl p-4 shadow-sm w-full lg:w-3/5 h-auto lg:h-[370px]">
//                     <h3 className="text-md font-medium text-[#101828] mb-2">
//                       Active Maintenance Ticket
//                     </h3>
//                     <div className="mb-4 flex justify-between flex-wrap">
//                       <p className="text-sm text-red-600 font-medium">
//                         Priority: {maintenance?.priority || "High Priority"}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Reported on: {maintenance?.createdAt?.slice(0, 10)}
//                       </p>
//                     </div>
//                     <div className="flex flex-col gap-4">
//                       <div>
//                         <p className="text-[12px] font-light text-[#475467]">
//                           Issue Type
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {maintenance?.title}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-[12px] font-light text-[#475467]">
//                           Description
//                         </p>
//                         <p className="text-sm text-gray-600 whitespace-pre-line">
//                           {maintenance?.description}
//                         </p>
//                       </div>

//                       <div>
//                         <p className="text-[12px] font-light text-[#475467]">
//                           Status
//                         </p>
//                         <p className="text-sm text-yellow-600 font-medium">
//                           {maintenance?.status || "Pending"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[12px] font-light text-[#475467]">
//                           Your Availability
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {maintenance?.availability || "Weekdays after 5pm"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap gap-2 mt-4">
//                       <Button
//                         className="bg-nrvPrimaryGreen text-white rounded-sm bg-[#2B892B]"
//                         size="large"
//                         variant="darkPrimary"
//                       >
//                         Mark As In-Progress
//                       </Button>
//                       <Button
//                         className="border border-nrvPrimaryGreen text-nrvPrimaryGreen rounded-sm"
//                         size="large"
//                         variant="lightGrey"
//                       >
//                         Message Landlord
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="w-full lg:w-2/5 h-auto flex flex-col gap-4">
//                     <div className="border rounded-xl p-4 shadow-sm min-h-[150px]">
//                       <h3 className="text-md font-medium text-[#101828] mb-2">
//                         Assignment Card
//                       </h3>
//                       <div className="flex flex-col gap-4">
//                         <p className="text-sm text-[#475467] ">
//                           Currently assigned to:{" "}
//                           <span className="text-gray-500">-</span>
//                         </p>
//                         <p className="text-sm  text-[#475467]">
//                           Contact: <span className="text-gray-500">-</span>
//                         </p>
//                         <p className="text-sm  text-[#475467]">
//                           Scheduled Date:{" "}
//                           <span className="text-gray-500">-</span>
//                         </p>
//                       </div>
//                     </div>
//                     <div className="border rounded-xl p-4 shadow-sm min-h-[150px]">
//                       <h3 className="text-md font-medium text-[#101828] mb-2">
//                         Timeline
//                       </h3>
//                       <div className="flex flex-col gap-4">
//                         <p className="text-sm  text-[#475467]">
//                           Opened: {maintenance?.createdAt || "-"}
//                         </p>
//                         <p className="text-sm  text-[#475467]">
//                           Diagnosed & Assigned: -
//                         </p>
//                         <p className="text-sm  text-[#475467]">
//                           Repair Completed: -
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border rounded-xl p-4 shadow-sm">
//                   <h3 className="text-md font-medium text-nrvDarkGrey mb-4">
//                     Attachments from Tenant
//                   </h3>
//                   {maintenance?.attachments?.length ? (
//                     maintenance.attachments.map((file: any, index: number) => (
//                       <div
//                         key={index}
//                         className="flex flex-wrap justify-between items-center border rounded p-3 mb-2 bg-gray-50 text-sm"
//                       >
//                         <span className="truncate max-w-[70%]">{file.name}</span>
//                         <div className="flex gap-2">
//                           <a
//                             href={file.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             👁️
//                           </a>
//                           <a href={file.url} download>
//                             ⬇️
//                           </a>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-400">
//                       No attachments provided.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="flex flex-col gap-6">
//                 <div className="border rounded-xl shadow-sm">
//                   <p className="text-nrvPrimaryGreen font-medium text-sm p-4 ">
//                     Your Maintenance Request is in Progress!
//                   </p>
//                   <p className="text-sm text-gray-500 p-4 leading-8">
//                     Your maintenance request has been received by the property
//                     owner. You will be notified once assigned to a technician.
//                   </p>
//                   <div className="flex justify-end bg-gray-50 p-4">
//                     <Button
//                       className="border text-nrvPrimaryGreen"
//                       size="small"
//                       variant="light"
//                     >
//                       Contact Property Owner
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="rounded-xl overflow-hidden w-full">
//                   <Image
//                     src={maintenance.file}
//                     alt="Property Image"
//                     width={500}
//                     height={700}
//                     className="rounded-xl object-cover w-full h-auto max-h-[400px]"
//                   />
//                   <div className="text-sm mt-2 text-gray-700">
//                     {maintenance.propertyId?.streetAddress},
//                     {maintenance.propertyId?.city},
//                     {maintenance.propertyId?.state}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <CenterModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
//               <div className="mx-auto text-center p-4 w-full md:w-4/5">
//                 <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
//                   Has this issue been resolved?
//                 </h2>
//                 <p className="text-nrvLightGrey text-sm mb-4 mt-4">
//                   Performing this action will mark this issue as resolved and
//                   close the issue.
//                 </p>

//                 <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
//                   <Button
//                     size="small"
//                     className="text-white w-full md:w-72 border border-nrvPrimaryGreen mt-2 rounded-md"
//                     variant="bluebg"
//                     showIcon={false}
//                     disabled={isLoading}
//                     onClick={handleSubmit}
//                   >
//                     Submit
//                   </Button>

//                   <Button
//                     size="small"
//                     className="w-full md:w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mt-2 hover:text-white hover:bg-nrvPrimaryGreen"
//                     variant="mediumGrey"
//                     showIcon={false}
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Close
//                   </Button>
//                 </div>
//               </div>
//             </CenterModal>
//           </div>
//         )}
//       </LandLordLayout>
//     </ProtectedRoute>
//   );
// };

// export default SingleMaintainance;

"use client";

import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  getMaintenanceById,
  markIssueAsResolved,
  updateMaintenance,
} from "@/redux/slices/maintenanceSlice";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { LocationIcon } from "@/public/icons/iconsExport";
import AssignMaintenanceRequest from "@/app/components/maintainance/AssignMaintenanceRequest";
import { formatDate } from "@/helpers/utils";

const SingleMaintainance = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isResolvedModalOpen, setIsResolvedModalOpen] =
    useState<boolean>(false);
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

  const handleUpdateStatus = async (status: string, successMessage: string) => {
    try {
      setIsLoading(true);
      const response = await dispatch(
        updateMaintenance({
          id: JSON.stringify(id),
          formData: {
            status,
          },
        }) as any,
      );
      setMaintenance(response?.payload?.data);
      setIsResolvedModalOpen(false);
      toast.success(successMessage);
    } catch (error) {
      toast.error("Failed to update maintenance status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsResolved = async () => {
    await handleUpdateStatus("Resolved", "Maintenance marked as resolved.");
  };

  const handleMarkInProgress = async () => {
    await handleUpdateStatus(
      "In Progress",
      "Maintenance marked as in progress.",
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LandLordLayout
      path="Maintenance"
      mainPath="Single Maintenance"
      subMainPath="Assign To Expert"
    >
      {
        isLoading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Loading Maintenance Details...</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full min-w-0 max-w-[1200px] px-3 py-4 font-jakarta sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-2 text-nrvGreyBlack">
            <button onClick={() => router.back()}>
              <BackIcon />
            </button>
            <h1 className="text-xl font-semibold">Active Ticket</h1>
          </div>
  
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: linked apartment */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {maintenance?.roomId?.propertyId?.file ||
              maintenance?.roomId?.imageUrls?.[0] ||
              maintenance?.roomId?.file ? (
                <div className="relative aspect-[16/9] w-full bg-gray-100">
                  <Image
                    src={
                      maintenance?.roomId?.propertyId?.file ||
                      maintenance?.roomId?.imageUrls?.[0] ||
                      maintenance?.roomId?.file
                    }
                    alt="Linked apartment"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-gray-100 text-sm text-gray-500">
                  No apartment image available
                </div>
              )}

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Linked apartment
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {maintenance?.roomId?.apartmentStyle ||
                      maintenance?.roomId?.apartmentType ||
                      maintenance?.roomId?.description ||
                      "Apartment"}
                  </h2>
                  {maintenance?.roomId?.roomId != null && (
                    <span className="whitespace-nowrap rounded-full bg-[#E9F4E7] px-2.5 py-1 text-xs font-semibold text-[#03442C]">
                      Unit {maintenance.roomId.roomId}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                  <LocationIcon />
                  <p>
                    {[
                      maintenance?.roomId?.propertyId?.streetAddress,
                      maintenance?.roomId?.propertyId?.city,
                      maintenance?.roomId?.propertyId?.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address unavailable"}
                  </p>
                </div>

                {maintenance?.roomId?._id && (
                  <Button
                    variant="outline"
                    className="mt-5 w-full rounded-xl border-[#03442C]/20 text-[#03442C] hover:bg-[#E9F4E7]"
                    onClick={() =>
                      router.push(
                        `/dashboard/landlord/properties/rooms/${maintenance.roomId._id}`,
                      )
                    }
                  >
                    View apartment
                  </Button>
                )}
              </div>
            </div>
  
            <div>
              <div className="border rounded-xl shadow-sm p-4 h-fit">
                <div className="text-[#101828] font-medium text-md mb-4">
                  Active Maintenance Ticket
                </div>
                <div className="text-sm text-[#667085] space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <span className="block font-semibold text-[11px]">
                        Request ID:
                      </span>
                      <span>#MR {maintenance?.maintenanceId}</span>
                    </div>
                    <div>
                      <span className="block font-semibold text-red-600 text-[11px]">
                        Priority:
                      </span>
                      <span className="text-red-600">
                        {maintenance?.priority}
                      </span>
                    </div>
                    <div>
                      <span className="block font-semibold text-[11px]">
                        Reported on:
                      </span>
                      <span>{maintenance?.createdAt?.slice(0, 10)}</span>
                    </div>
                  </div>
                  <div>
                    <span className="block font-semibold text-[11px]">
                      Issue Type:
                    </span>
                    <span>{maintenance?.title}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-[11px]">
                      Description:
                    </span>
                    <span>{maintenance?.description}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-[11px] mt-2">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1.5 rounded rounded-full text-xs font-medium ${
                        maintenance.status === "Resolved"
                          ? "bg-[#F7F6F2] text-green-700"
                          : "bg-[#F7F6F2] text-yellow-700"
                      }`}
                    >
                      {maintenance.status || "Pending"}
                    </span>
                  </div>
                  <div>
                    <span className="block font-semibold text-[11px]">
                      {maintenance.status === "Resolved" && "Date Resolved"}{" "}
                      {maintenance.status === "Declined" && "Date Declined"}
                    </span>
                    <span>
                      {formatDate(maintenance?.updatedAt?.slice(0, 10))}
                    </span>
                  </div>
                </div>
  
                <div className="mt-4 flex flex-wrap gap-3">
                  {maintenance.status !== "Resolved" &&
                    maintenance.status !== "Declined" &&
                    maintenance.status !== "In Progress" && (
                      <Button
                        className="rounded-md bg-[#03442C] text-[12px] font-medium text-white hover:bg-[#023522] hover:text-white"
                        disabled={isLoading}
                        onClick={() => {
                          void handleMarkInProgress();
                        }}
                      >
                        Mark As In Progress
                      </Button>
                    )}
                  {maintenance.status !== "Resolved" &&
                    maintenance.status !== "Declined" && (
                      <Button
                        className="rounded-md bg-[#2B892B] text-[12px] font-medium text-white hover:text-white"
                        onClick={() => {
                          setIsResolvedModalOpen(true);
                        }}
                      >
                        Mark As Resolved
                      </Button>
                    )}
                </div>
              </div>
              {/* Right: Assignment + Timeline */}
              <div className="flex flex-col gap-4 mt-4">
                <div className="border rounded-xl p-4 shadow-sm">
                  <h3 className="font-medium text-md text-[#101828] mb-2">
                    Assignment Card
                  </h3>
                  {maintenance?.assignedTo ? (
                    <div className="space-y-4">
                      <p className="text-sm text-[#475467]">
                        Currently assigned to:{" "}
                        <span className="text-gray-500">
                          {maintenance?.assignedTo || "-"}
                        </span>
                      </p>
                      <p className="text-sm text-[#475467]">
                        Contact:{" "}
                        <span className="text-gray-500">
                          {maintenance?.assigneePhoneNumber}
                        </span>
                      </p>
                      <p className="text-sm text-[#475467]">
                        Scheduled visit:{" "}
                        <span className="text-gray-500">
                          {formatDate(maintenance?.scheduledDate?.slice(0, 10))}
                          {maintenance?.scheduledTime
                            ? ` at ${maintenance.scheduledTime}`
                            : ""}
                        </span>
                      </p>
                      {maintenance?.extraNoteToTenant && (
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Note shared with tenant
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-[#475467]">
                            {maintenance.extraNoteToTenant}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 items-center flex justify-center">
                      <Button
                        className="rounded-xl bg-[#03442C] px-4 text-xs font-semibold text-white hover:bg-[#023522]"
                        onClick={() => setIsOpen(true)}
                      >
                        Assign an expert
                      </Button>
                    </div>
                  )}
                </div>
  
                <div className="border rounded-xl p-4 shadow-sm ">
                  <h3 className="font-medium text-md text-[#101828] mb-2">
                    Timeline
                  </h3>
                  <div className="space-y-6">
                    {maintenance?.statusHistory?.length > 0 ? (
                      [...maintenance.statusHistory]
                        .reverse()
                        .map((entry: any, index: number) => (
                          <div
                            key={`${entry.status}-${entry.changedAt}-${index}`}
                            className="flex gap-3"
                          >
                            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#03442C]" />
                            <div>
                              <p className="text-sm font-semibold text-[#344054]">
                                {entry.status}
                              </p>
                              {entry.note && (
                                <p className="text-sm text-[#475467]">
                                  {entry.note}
                                </p>
                              )}
                              <p className="mt-1 text-xs text-gray-500">
                                {new Intl.DateTimeFormat("en-NG", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }).format(new Date(entry.changedAt))}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-[#475467]">
                        Ticket opened:{" "}
                        {maintenance?.createdAt
                          ? new Intl.DateTimeFormat("en-NG", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(maintenance.createdAt))
                          : "—"}
                      </p>
                    )}
                  </div>
                </div>
  
                <div className="border rounded-xl shadow-sm">
                  <p className="text-nrvPrimaryGreen font-medium text-sm p-4">
                    Maintenance request received
                  </p>
                  <p className="text-sm text-gray-500 px-4 pb-4">
                    Review the issue, assign an expert, and keep the tenant
                    informed as work progresses.
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-[#101828]">
                Evidence uploaded by tenant
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Photo submitted when this maintenance request was logged.
              </p>
            </div>
            {maintenance?.file ? (
              <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,560px)_1fr]">
                <a
                  href={maintenance.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={maintenance.file}
                    alt={`Evidence for ${maintenance?.title || "maintenance request"}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 560px"
                  />
                </a>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-900">
                    Tenant evidence
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Open the original image to inspect the reported issue in
                    full resolution.
                  </p>
                  <a
                    href={maintenance.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex h-10 w-fit items-center rounded-xl bg-[#03442C] px-4 text-sm font-semibold text-white"
                  >
                    View full image
                  </a>
                </div>
              </div>
            ) : (
              <p className="px-5 py-8 text-sm text-gray-500">
                No evidence image was attached to this request.
              </p>
            )}
          </div>
          <CenterModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <AssignMaintenanceRequest
              onCancel={() => setIsOpen(false)}
              onSuccess={() => {
                setIsOpen(false);
                void fetchData();
              }}
            />
          </CenterModal>
  
          <CenterModal
            isOpen={isResolvedModalOpen}
            onClose={() => setIsResolvedModalOpen(false)}
          >
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                Update Maintenance Status
              </h2>
  
              <div className="text-base text-center">
                This action will mark the request as{" "}
                <span className="font-medium text-green-700">Resolved</span>.
              </div>
  
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsResolvedModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleAsResolved()}
                  disabled={isLoading}
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  {isLoading ? "Updating..." : "Submit"}
                </Button>
              </div>
            </div>
          </CenterModal>
        </div>
        )
      }
  
    </LandLordLayout>
  );
};

export default SingleMaintainance;
