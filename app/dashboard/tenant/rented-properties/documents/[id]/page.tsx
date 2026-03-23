"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getPropertyByIdForTenant } from "../../../../../../redux/slices/propertySlice";
import TenantLayout from "@/app/components/layout/TenantLayout";

import ApartmentDocuments from "@/app/components/screens/renters/ApartmentDocuments";
import BackIcon from "@/app/components/shared/icons/BackIcon";

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [property, setProperty] = useState<any>({});
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading
  const dispatch = useDispatch();
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
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          {isLoading ? (
            <div className="p-8 space-y-6 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-gray-100 rounded-xl border border-gray-200"></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {isPageLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white"></div>
                </div>
              )}

              {property && (
                <div>
                  <div className="p-8">
                    <div className="flex gap-4">
                      <BackIcon />
                      <div className=" text-xl font-medium ">Documents</div>
                    </div>
                    <div className=" text-md font-light text-nrvDarkGrey">
                      Here are the documents for this apartments!
                    </div>
                    {/* {property && <ApartmentDocuments data={property} />} */}
                  </div>
                </div>
              )}
            </>
          )}
        </TenantLayout>
      </ProtectedRoute>
    </div>
  );
};

export default RentedPropertiesScreen;
