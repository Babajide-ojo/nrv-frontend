"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import EmptyState from "../../../../components/screens/empty-state/EmptyState";
import Button from "../../../../components/shared/buttons/Button";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getRentedApartmentsForTenant,
  getPropertyByIdForTenant,
} from "../../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { tenantDashboardMetrics, tenantPropertyMetrics } from "@/helpers/data";
import TenantDashboardNavigationCard from "@/app/components/shared/cards/TenantDashboardNavigationCard";

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [property, setProperty] = useState<any>({});

  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
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
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Reload properties when page changes

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <ToastContainer />
            {isPageLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white"></div>
              </div>
            )}

            {property && (
              <div>
                <div className="md:p-8 p-4">
                <div className="md:text-xl text-sm font-medium text-nrvDarkBlue">
                      Apartment ID : {property?.property.roomId}
                    </div>
                  <div className="flex gap-3">
                
                    <div className="md:text-lg text-sm text-nrvDarkGrey">
                      {property?.property.propertyId.streetAddress},{" "}
                      {property?.property.propertyId.city},{" "}
                      {property?.property.propertyId.state}
                    </div>
                  </div>

                  <div className="pt-8 font-medium">Overview</div>
                  <div className="flex gap-6 w-full md:w-3/5 my-2">
                    <div className="w-1/3">
                      <div
                        className="w-full md:h-28 h-28 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer  p-4 justify-center text-center"
                        onClick={() => {
                          router.push(
                            `/dashboard/tenant/rented-properties/documents/${property.property._id}`
                          );
                        }}
                      >
                        <div className="w-full justify-center flex">
                          <img
                            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1721141652/document-attachment_h2siur.png"
                            className="w-8 h-8"
                            alt="image"
                          />
                        </div>
                        <div>
                          <p className=" text-nrvGreyBlack md:text-[15px] text-xs mt-4 font-medium">
                            Rent Due Date 
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3">
                      <div className="w-full md:h-28 h-28 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer  p-4 justify-center text-center">
                        <div className="w-full justify-center flex">
                          <img
                            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1721141652/license-maintenance_emi1an.png"
                            className="w-8 h-8"
                            alt="image"
                          />
                        </div>
                        <div>
                          <p className=" text-nrvGreyBlack md:text-[15px] text-xs mt-4 font-medium">
                             Maintenance Issued
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 font-medium">Manage Apartment</div>
                  <div className="flex gap-6 w-full md:w-3/5 my-2">
                    <div className="w-1/3">
                      <div
                        className="w-full md:h-28 h-28 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer  p-4 justify-center text-center"
                        onClick={() => {
                          router.push(
                            `/dashboard/tenant/rented-properties/documents/${property.property._id}`
                          );
                        }}
                      >
                        <div className="w-full justify-center flex">
                          <img
                            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1721141652/document-attachment_h2siur.png"
                            className="w-8 h-8"
                            alt="image"
                          />
                        </div>
                        <div>
                          <p className=" text-nrvGreyBlack md:text-[15px] text-xs mt-4 font-medium">
                            Apartment Documents
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3">
                      <div className="w-full md:h-28 h-28 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer  p-4 justify-center text-center">
                        <div className="w-full justify-center flex">
                          <img
                            src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1721141652/license-maintenance_emi1an.png"
                            className="w-8 h-8"
                            alt="image"
                          />
                        </div>
                        <div>
                          <p className=" text-nrvGreyBlack md:text-[15px] text-xs mt-4 font-medium">
                            Request Maintenance
                          </p>
                        </div>
                      </div>
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
