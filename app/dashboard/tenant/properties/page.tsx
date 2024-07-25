"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getAllProperty,
  getAllPropertyForTenant,
} from "../../../../redux/slices/propertySlice";
import "react-toastify/dist/ReactToastify.css";
import TenantLayout from "../../../components/layout/TenantLayout";
import PropertyCard from "../../../components/shared/cards/PropertyCard";
import InputField from "../../../components/shared/input-fields/InputFields";

const TenantPropertiesScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [searchTerm, setSearchTerm] = useState<any>(null);
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      page: page,
    };

    try {
      const response = await dispatch(getAllPropertyForTenant(formData) as any); // Pass page parameter
      setProperties(response?.payload?.data);
      // setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleNextPage = () => {
    if (page) {
      setIsPageLoading(true);
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setIsPageLoading(true);
      setPage(page - 1);
    }
  };

  const handleSearchByLocation = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      page: page,
      search: e.target.value,
    };

    try {
      const response = await dispatch(getAllPropertyForTenant(formData) as any); // Pass page parameter
      setProperties(response?.payload?.data);
      // setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <div className="p-8">
              <div>
                <div className="text-2xl text-nrvGreyBlack font-semibold">
                  Find Properties 🏠
                </div>
                <div className="text-nrvLightGrey">
                  Look for apartments that suit your preferences.
                </div>
              </div>
              <div>
                <div className="mt-2">
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label="Search by Location"
                    placeholder="Search"
                    inputType="search"
                    onChange={(e) => handleSearchByLocation(e)}
                  />
                </div>
                <div className="mt-2">
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label="Rent Range"
                    placeholder="1000 - 50000"
                    inputType="search"
                  />
                </div>
              </div>
              <div className="pt-8 text-nrvGreyBlack text-lg font-semibold">
                Explore Properties
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {properties?.map((property: any) => (
                  <div
                    key={property.id}
                    className=" mt-8"
                    onClick={() => {
                      router.push(
                        `/dashboard/tenant/properties/${property._id}`
                      );
                    }}
                  >
                    <PropertyCard
                      imageUrl={property?.file}
                      address={property?.propertyId.streetAddress}
                      rentAmount={property?.rentAmount}
                      property={property}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default TenantPropertiesScreen;
