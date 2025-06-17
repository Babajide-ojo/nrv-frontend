"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams, usePathname } from "next/navigation";
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
import { format } from "date-fns";
import Status from "@/app/components/shared/Status";

const RentedPropertiesScreen = () => {
  const pathname = usePathname();
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
      const response = await dispatch(getApplicationsById(formData) as any);
      setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const rentDetails = pathname.includes("applications")
    ? [
        {
          name: "Application Status",
          value: <Status status={property?.status} />,
        },
        {
          name: "Application Date",
          value: property?.createdAt
            ? format(new Date(property?.createdAt), "dd-MM-yyyy")
            : "NIL",
        },
      ]
    : [
        {
          name: "Rent Status",
          value:
            property?.status === "activeTenant" ? "Active" : property?.status,
        },
        {
          name: "Rent Start Date",
          value: property?.rentStartDate
            ? format(new Date(property?.rentStartDate), "dd-MM-yyyy")
            : "NIL",
        },
        {
          name: "Rent End Date",
          value: property?.rentEndDate
            ? format(new Date(property?.rentEndDate), "dd-MM-yyyy")
            : "NIL",
        },
        {
          name: "Rent Amount",
          value: `₦${property?.propertyId?.rentAmount?.toLocaleString() ?? 0}`,
        },
        {
          name: "Landlord Contact",
          value: property?.ownerId?.phoneNumber,
        },
      ];
  useEffect(() => {
    fetchData();
  }, [id]);

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
                  <BackIcon />
                  <div>
                    <h3 className="text-lg font-medium text-nrvPrimaryGreen">
                      <span className="font-semibold">
                        Manage Your Apartment
                      </span>
                    </h3>
                    <p className="-mt-1 text-xs">
                      {property?.propertyId?.propertyId?.streetAddress}
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
                        {property?.propertyId?.description}
                      </p>
                      <p className="font- text-sm text-[#475367]">
                        Apartment ID: {property?.propertyId?.roomId}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-4 gap-5 md:gap-0 flex flex-col md:flex-row">
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
                    <div className="md:border-r w-full md:w-[70%]">
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">
                            Apartment Style
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.apartmentStyle}
                          </p>
                        </div>
                        <div className="sm:border-l sm:pl-5 mt-4 sm:mt-0">
                          <p className="text-[#475367] text-sm">
                            Apartment Address/Location
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.propertyId?.propertyId?.streetAddress}{" "}
                            {property?.propertyId?.propertyId?.state}
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">Flat Number</p>
                          <p className="text-semibold font-medium">
                            {property?.propertyId?.roomId}
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex flex-col sm:flex-row border-b">
                        <div className="w-60">
                          <p className="text-[#475367] text-sm">
                            Number of Bedrooms
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.propertyId?.noOfRooms}
                          </p>
                        </div>
                        <div className="sm:border-l sm:pl-5 mt-4 sm:mt-0">
                          <p className="text-[#475367] text-sm">
                            Number of Bathrooms
                          </p>
                          <p className="text-semibold font-medium">
                            {property?.propertyId?.noOfBaths}
                          </p>
                        </div>
                      </div>
                      <div className="py-4 flex border-b">
                        <div className="">
                          <p className="text-[#475367] text-sm">
                            Apartment Facilities/Amenities
                          </p>
                          <div className="flex gap-3 flex-wrap mt-3 mb-5">
                            {property?.propertyId?.otherAmentities?.length >
                              0 &&
                              property?.propertyId?.otherAmentities?.map(
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
                    </div>
                    <div className="w-full mt-4 md:mt-0 md:w-[30%] md:pl-4 pb-5">
                      <div className="w-full aspect-square rounded-lg p-3 bg-[#F9FAFB]">
                        <div className="h-full w-full aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={property?.propertyId?.propertyId?.file}
                            alt="Apartment Image"
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      {pathname.includes("applications") ? (
                        <div className="mt-4 flex items-center justify-between text-sm gap-4">
                          <div className="flex flex-col">
                            <p className="text-sm text-[#475467]">
                              Apartment Style
                            </p>
                            <p className="font-semibold">
                              {property?.propertyId?.propertyId.apartmentStyle}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-sm text-[#475467]">
                              Price Per Anum
                            </p>
                            <p className="font-semibold">{`₦${property?.propertyId?.rentAmount?.toLocaleString()}`}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            variant="darkPrimary"
                            className="h-10 rounded-md w-full"
                            onClick={() =>
                              window.open(
                                `mailto:${property?.propertyId?.owner?.email}`
                              )
                            }
                          >
                            <div className="flex gap-2 items-center">
                              <MessageIcon />
                              Contact Landlord
                            </div>
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default RentedPropertiesScreen;
