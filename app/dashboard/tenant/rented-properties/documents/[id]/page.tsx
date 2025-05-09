"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { getPropertyByIdForTenant } from "../../../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default RentedPropertiesScreen;
