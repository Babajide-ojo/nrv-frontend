"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getPropertyByIdForTenant } from "../../../../../redux/slices/propertySlice";
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

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLandLordOpen, setIsLandLordOpen] = useState<boolean>(false);
  const [isUploadSignedDocsOpen, setIsUploadSignedDocsOpen] = useState<boolean>(false);

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
      setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

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
                <div className="flex items-center mb-4 text-nrvGreyBlack mb-8">
                  <BackIcon width={24} height={24} />
                  <h3 className="ml-3 text-lg font-medium text-nrvDarkBlue">
                    <span className="font-semibold">Manage Your Apartment</span>
                  </h3>
                </div>
                <div className="flex gap-6 flex-wrap mt-4">
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
                </div>

                <div className="flex gap-6 flex-wrap mt-4">
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
                </div>

                <div className="flex gap-6 flex-wrap mt-4">
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
                </div>
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
                  <div className="text-nrvDarkBlue md:text-md text-sm">
                    Property Type:{" "}
                    <span className="text-nrvDarkGrey">
                      {property?.property.propertyId.propertyType}
                    </span>
                  </div>
                </div>

                <div className="mb-2 flex  mt-4">
                  <div className="text-nrvDarkBlue md:text-md text-sm">
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
                    <span className="text-nrvDarkBlue md:text-md text-sm">
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
                    className="text-nrvDarkBlue  max-w-full border border-nrvDarkBlue mt-2 rounded-md"
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
                <p className="text-nrvDarkBlue text-md font-medium">
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
                    className="text-nrvDarkBlue  max-w-full border border-nrvDarkBlue mt-2 rounded-md"
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
                    className="text-nrvDarkBlue  max-w-full border border-nrvDarkBlue mt-2 rounded-md"
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
