"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getApplicationsById,
  getPropertyByIdForTenant,
} from "../../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TenantLayout from "@/app/components/layout/TenantLayout";
import Link from "next/link";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import { MdAddHomeWork } from "react-icons/md";
import { FaPersonShelter } from "react-icons/fa6";
import { GrWorkshop } from "react-icons/gr";
import { IoDocuments } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { RiGitPullRequestFill } from "react-icons/ri";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import Button from "@/app/components/shared/buttons/Button";
import AgreementDocumentScreen from "@/app/components/dashboard/tenant/AgreementDocumentScreen";
import Modal from "@/app/components/shared/modals/Modal";
import Image from "next/image";
import House from "@/app/components/icons/House";
import CheckMark from "@/app/components/icons/CheckMark";
import MessageIcon from "@/app/components/icons/MessageIcon";
import PdfIcon from "@/app/components/icons/PdfIcon";
import EyeIcon from "@/app/components/icons/EyeIcon";
import { DownloadIcon } from "lucide-react";

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLandLordOpen, setIsLandLordOpen] = useState<boolean>(false);
  const [isUploadSignedDocsOpen, setIsUploadSignedDocsOpen] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    const formData = {
      id: id,
      tenantId: user?.user?._id,
    };

    try {
      const response = await dispatch(
        getPropertyByIdForTenant(formData) as any
      );
      // const response = await dispatch(getApplicationsById(formData) as any);
      setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const rentDetails = [
    { name: "Rent Status", value: "Active*" },
    { name: "Rent Start Date", value: "2023-11-06*" },
    { name: "Rent End Date", value: "2023-11-06*" },
    {
      name: "Rent Amount",
      value: `₦${property?.property?.rentAmount?.toLocaleString() ?? 0}`,
    },
    { name: "Security Deposit", value: "₦500,000*" },
    {
      name: "Landlord Contact",
      value: property?.property?.propertyId?.createdBy?.phoneNumber,
    },
  ];

  console.log("Property Data:", property);

  useEffect(() => {
    fetchData();
  }, [id]); // Dependency on `id` to refetch when it changes

  return (
    <div className="min-h-screen bg-gray-100 ">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <ToastContainer />
            {isPageLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white">Loading...</div>
              </div>
            )}

            {property && (
              <div className="p-6 md:p-8 mb-40">
                <div className="flex items-center gap-3 mb-4 text-nrvGreyBlack mb-8">
                  <BackIcon width={24} height={24} />
                  <div>
                    <h3 className="text-lg font-medium text-nrvPrimaryGreen">
                      <span className="font-semibold">
                        Manage Your Apartment
                      </span>
                    </h3>
                    <p className="-mt-1 text-xs">
                      {property?.property?.propertyId?.streetAddress}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col border border-nrvLightGray rounded-2xl bg-white overflow-hidden">
                  <div className="px-10 py-4 bg-[#E4E7EC] flex items-center gap-6">
                    <div className="rounded-full h-12 w-12 bg-[#429634] flex items-center justify-center">
                      <House width={20} height={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-base">
                        {property?.property?.description}
                      </p>
                      <p className="font- text-sm text-[#475367]">
                        Apartment ID: {property?.property?.propertyId?._id}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-4 gap-5 md:gap-0 flex justify-center items-center flex-col md:flex-row">
                    {rentDetails.map((detail, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center w-60 ${
                          i !== rentDetails.length - 1 ? "md:border-r" : ""
                        }`}
                      >
                        <p className="text-[#475367] text-sm">{detail.name}</p>
                        <p className="text-base font-medium">{detail.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 flex flex-col border border-nrvLightGray rounded-2xl bg-white overflow-hidden">
                  <p className="p-4 pt-7 text-base font-semibold border-b">
                    Apartment Information
                  </p>
                  <div className="flex flex-col-reverse md:flex-row px-4">
                    <div className="md:border-r w-full md:w-4/5">
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">
                            Apartment Name
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.property?.description}
                          </p>
                        </div>
                        <div className="sm:border-l sm:pl-5 mt-4 sm:mt-0">
                          <p className="text-[#475367] text-sm">
                            Apartment Address/Location
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.property?.propertyId?.streetAddress}{" "}
                            {property?.property?.propertyId?.state}
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">Flat Number</p>
                          <p className="text-semibold font-medium">
                            No detail*
                          </p>
                        </div>
                        <div className="sm:border-l sm:pl-5 mt-4 sm:mt-0">
                          <p className="text-[#475367] text-sm">Floor Plan</p>
                          <p className="text-semibold font-medium">
                            No detail*
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">
                            Number of Bedrooms
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.property?.noOfRooms}
                          </p>
                        </div>
                        <div className="sm:border-l sm:pl-5 mt-4 sm:mt-0">
                          <p className="text-[#475367] text-sm">
                            Number of Bathrooms
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.property?.noOfBaths}
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex border-b">
                        <div className="">
                          <p className="text-[#475367] text-sm">
                            Apartment Facilities/Amenities
                          </p>
                          <div className="flex gap-3 flex-wrap mt-3 mb-5">
                            {property?.property?.otherAmentities?.length > 0 &&
                              property?.property?.otherAmentities?.map(
                                (amenity: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 bg-[#E9F4E7] px-4 py-1 text-xs font-medium rounded-full"
                                  >
                                    <CheckMark height={15} width={15} />
                                    {amenity}
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="py-4 md:pr-4 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">
                              Rent Payment Tracker
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-sm text-[#475467]">
                              January 2023
                            </p>
                            <div className="text-sm flex items-center gap-2 justify-between">
                              <p className="font-semibold">Paid ₦5,000,000</p>
                              <button className="text-[#2B892B] underline">
                                View Receipt
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-sm text-[#475467]">
                              January 2024
                            </p>
                            <div className="text-sm flex items-center gap-2 justify-between">
                              <p className="font-semibold">Paid ₦5,000,000</p>
                              <button className="text-[#2B892B] underline">
                                View Receipt
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-sm text-[#475467]">
                              January 2025
                            </p>
                            <div className="text-sm flex items-center gap-2 justify-between">
                              <p className="font-semibold">Paid ₦5,000,000</p>
                              <button className="text-[#2B892B] underline">
                                View Receipt
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">
                              Signed Documents
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col">
                            <p className="text-xs text-[#475467]">
                              Signed Lease Agreement
                            </p>
                            <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                              <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                                <PdfIcon width={20} height={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  Signed Lease.pdf
                                </p>
                                <p className="text-xs text-[#475467]">
                                  11 Sep, 2023 | 12:24pm • 2MB
                                </p>
                              </div>
                              <EyeIcon width={29} height={20} color="#475367" />
                              <DownloadIcon
                                width={23.33}
                                height={24.5}
                                color="#475367"
                              />
                            </div>
                          </div>
                          <div className="mt-6 flex flex-col">
                            <p className="text-xs text-[#475467]">
                              Offer Letter
                            </p>
                            <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                              <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                                <PdfIcon width={20} height={20} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  Signed Lease.pdf
                                </p>
                                <p className="text-xs text-[#475467]">
                                  11 Sep, 2023 | 12:24pm • 2MB
                                </p>
                              </div>
                              <EyeIcon width={29} height={20} color="#475367" />
                              <DownloadIcon
                                width={23.33}
                                height={24.5}
                                color="#475367"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">
                              Rules & Policies
                            </p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">Quiet Hours</p>
                            <p className="font-semibold">10:00 PM - 4:00 AM</p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">Pet Policy</p>
                            <p className="font-semibold">None</p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">Parking Rules</p>
                            <p className="font-semibold">None</p>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-semibold">
                              Emergency Contacts
                            </p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">Landlord</p>
                            <p className="font-semibold">+234 81 32265445</p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">
                              Maintenance Hotline
                            </p>
                            <p className="font-semibold">+234 81 32265445</p>
                          </div>
                          <div className="mt-4 text-sm flex flex-col">
                            <p className="text-[#475467]">Building Security</p>
                            <p className="font-semibold">+234 81 6675 5303</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full mt-4 md:mt-0 md:w-1/5 md:pl-4 pb-5">
                      <div className="w-full aspect-square rounded-lg p-3 bg-[#F9FAFB]">
                        <div className="h-full w-full aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={property?.property?.propertyId?.file}
                            alt="Apartment Image"
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col gap-2">
                        <Button
                          variant="darkPrimary"
                          className="h-10 rounded-md w-full"
                          onClick={() =>
                            window.open(
                              `mailto:${property?.property?.owner?.email}`
                            )
                          }
                        >
                          <div className="flex gap-2 items-center">
                            <MessageIcon />
                            Contact Landlord
                          </div>
                        </Button>
                        <Button
                          variant="mediumGrey"
                          className="h-10 rounded-md w-full"
                        >
                          Renew Rent/Lease
                        </Button>
                        <Button
                          variant="orangeOutline"
                          className="h-10 rounded-md w-full"
                          onClick={() =>
                            router.push(
                              `/dashboard/tenant/rented-properties/maintenance/request-maintainance/${id}`
                            )
                          }
                        >
                          Request Maintainance
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="flex gap-6 flex-wrap mt-4">
                  <div className="w-full md:w-1/4">
                    <div
                      className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition"
                      onClick={() => {
                        setIsOpen(!isOpen);
                      }}
                    >
                      <MdAddHomeWork color="#153969" size={40} />
                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Apartment Details
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/4">
                    <div
                      className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition"
                      onClick={() => {
                        setIsLandLordOpen(!isLandLordOpen);
                      }}
                    >
                      <FaPersonShelter color="#153969" size={40} />
                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Landlord Details
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* <div className="flex gap-6 flex-wrap mt-4">
                  <div className="w-full md:w-1/4">
                    <div
                      className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition"
                      onClick={() => {
                        setIsUploadSignedDocsOpen(true);
                      }}
                    >
                      <IoIosSend color="#153969" size={40} />

                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Agreement Documents
                      </p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/4">
                    <div
                      className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition"
                      onClick={() => {
                        router.push(
                          `/dashboard/tenant/rented-properties/maintenance/${id}`
                        );
                      }}
                    >
                      <GrWorkshop color="#153969" size={40} />
                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Maintenance Issued
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* <div className="flex gap-6 flex-wrap mt-4">
                  <div className="w-full md:w-1/4">
                    <div
                      className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition"
                      onClick={() => {
                        router.push(
                          `/dashboard/tenant/rented-properties/documents/${property.property._id}`
                        );
                      }}
                    >
                      <IoDocuments color="#153969" size={40} />
                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Apartment Documents
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/tenant/rented-properties/maintenance/${id}`}
                    className="w-full md:w-1/4"
                  >
                    <div className="flex flex-col items-center justify-center bg-white border border-nrvLightGray rounded-2xl p-4 cursor-pointer hover:bg-nrvLightGreyBg hover:border-black transition">
                      <RiGitPullRequestFill color="#153969" size={40} />
                      <p className="text-nrvGreyBlack text-md font-light mt-4">
                        Request Maintenance
                      </p>
                    </div>
                  </Link>
                </div> */}
              </div>
            )}

            <CenterModal
              isOpen={isOpen}
              onClose={() => {
                setIsOpen(false);
              }}
            >
              <div className="mx-auto  p-4">
                <p className="text-nrvDarkGrey text-md font-medium">
                  View your property full details
                </p>
                <p className="text-nrvDarkGrey mt-4 text-sm">
                  {property?.property.propertyId.streetAddress},{" "}
                  {property?.property.propertyId.city},{" "}
                  {property?.property.propertyId.state}
                </p>

                <div className="mb-2 flex md:items-center items-start mt-4">
                  <div className="text-nrvPrimaryGreen md:text-md text-sm">
                    Property Type:{" "}
                    <span className="text-nrvDarkGrey">
                      {property?.property.propertyId.propertyType}
                    </span>
                  </div>
                </div>

                <div className="mb-2 flex  mt-4">
                  <div className="text-nrvPrimaryGreen md:text-md text-sm">
                    {" "}
                    Rent Amount:{" "}
                    <span className="text-nrvDarkGrey">
                      {" "}
                      ₦{" "}
                      {parseInt(
                        property?.property?.rentAmount
                      ).toLocaleString()}
                      /{property?.property?.rentAmountMetrics}
                    </span>
                  </div>
                </div>
                <div className="mb-2 flex mt-4">
                  <div className="">
                    <span className="text-nrvPrimaryGreen md:text-md text-sm">
                      {" "}
                      Description:{" "}
                    </span>
                    <span className="text-nrvDarkGrey text-xs">
                      {" "}
                      {property?.property.description}
                    </span>
                  </div>
                </div>

                <div
                  className="pt-4"
                  style={{ maxHeight: "50px", minHeight: "50px" }}
                >
                  <div className="flex gap-2">
                    <Button
                      size="smaller"
                      className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                      variant="ordinary"
                      showIcon={false}
                    >
                      {property?.property.noOfRooms} Rooms
                    </Button>
                    <Button
                      size="smaller"
                      className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                      variant="ordinary"
                      showIcon={false}
                    >
                      {property?.property.noOfBaths} Baths
                    </Button>
                    <Button
                      size="smaller"
                      className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                      variant="ordinary"
                      showIcon={false}
                    >
                      {property?.property.noOfPools} Pools
                    </Button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-nrvPrimaryGreen  max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex gap-3">Close</div>
                  </Button>
                </div>
              </div>
            </CenterModal>
            <CenterModal
              isOpen={isLandLordOpen}
              onClose={() => {
                setIsLandLordOpen(false);
              }}
            >
              <div className="mx-auto text-center p-4">
                <p className="text-nrvPrimaryGreen text-md font-medium">
                  View Landlord Details
                </p>
                <p className="text-nrvDarkGrey mt-4 text-md">
                  {property?.property.propertyId.createdBy.firstName}{" "}
                  {property?.property.propertyId.createdBy.lastName}
                </p>

                <p className="text-nrvDarkGrey mt-4 text-md">
                  {property?.property.propertyId.createdBy.phoneNumber}
                </p>

                <p className="text-nrvDarkGrey mt-4 text-md">
                  {property?.property.propertyId.createdBy.email}
                </p>
                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-nrvPrimaryGreen  max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsLandLordOpen(false);
                    }}
                  >
                    <div className="flex gap-3">Close</div>
                  </Button>
                </div>
              </div>
            </CenterModal>
            <Modal
              isOpen={isUploadSignedDocsOpen}
              onClose={() => {
                setIsUploadSignedDocsOpen(false);
              }}
            >
              <div className="mx-auto text-center p-4">
                <AgreementDocumentScreen data={property} />
                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-nrvPrimaryGreen  max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      setIsUploadSignedDocsOpen(false);
                    }}
                  >
                    <div className="flex gap-3">Close</div>
                  </Button>
                </div>
              </div>
            </Modal>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default RentedPropertiesScreen;
