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
import Button from "@/app/components/shared/buttons/Button";

const TenantPropertiesScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState<any>({
    searchTerm: "",
    minimiumPrice: "",
    maximiumPrice: "",
  });
  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
  
    const formData = {
      page: page,
    };

    try {
      setIsLoading(true);
      const response = await dispatch(getAllPropertyForTenant(formData) as any); // Pass page parameter
      setProperties(response?.payload?.data);
      // setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSearchByLocation = async () => {
  
    try {
      setIsLoading(true);
      const response = await dispatch(getAllPropertyForTenant(formData) as any); // Pass page parameter
      setProperties(response?.payload?.data);
      setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const resetFilters = () => {
    setFormData({
      searchTerm: "",
      minimiumPrice: "",
      maximiumPrice: "",
    });
    fetchData();
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
                <div className="mt-2 ">Filter by location and budget price</div>
                <div>
                    <Button
                      size="small"
                      className="text-nrvDarkGrey bg-nrvGreyMediumBg border border-nrvGreyMediumBg  hover:text-white hover:bg-nrvDarkBlue"
                      variant="ordinary"
                      showIcon={false}
                      //disabled={isLoading === true ? true : false}
                      onClick={() => {
                        handleSearchByLocation();
                      }}
                    >
                      Apply Filters
                    </Button>
                    <Button
                      size="small"
                      className="text-nrvDarkGrey bg-nrvGreyMediumBg border border-nrvGreyMediumBg  hover:text-white hover:bg-red-700 mt-2 ml-4"
                      variant="ordinary"
                      showIcon={false}
                      onClick={() => {
                        resetFilters();
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>

                <div className="md:flex md:gap-4 block mt-4">
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label="Search by Location"
                    placeholder="Search"
                    inputType="search"
                    name="searchTerm"
                    value={formData.searchTerm}
                    onChange={handleInputChange}
                  />
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label="Minimum Price"
                    ariaLabel="Number input"
                    placeholder="100,000"
                    //inputType="text"
                    name="minimiumPrice"
                    value={formData?.minimiumPrice.toLocaleString()}
                    onChange={handleInputChange}
                   // onWheel={() => document.activeElement.blur()}
                  />
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label="Maximium Price"
                    placeholder="5,000,000"
                    inputType="number"
                    name="maximiumPrice"
                    value={formData.maximiumPrice}
                    onChange={handleInputChange}
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
