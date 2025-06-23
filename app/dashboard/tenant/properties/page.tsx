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
import { RefreshCcw } from "lucide-react";
import { Button as Btn } from "@/components/ui/button";
import { LuMapPin } from "react-icons/lu";

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
  const thumbImages = [
    "https://images.unsplash.com/photo-1599423300746-b62533397364",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471",
    "https://images.unsplash.com/photo-1599423300746-b62533397364",
  ];

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
              <div className="flex gap-5 items-center justify-between flex-wrap">
                <div>
                  <div className="text-2xl text-nrvGreyBlack font-semibold">
                    Explore Properties 🏠
                  </div>
                  <div className="text-nrvLightGrey">
                    View and apply for new property listed
                  </div>
                </div>
                <Btn variant="outline" size="sm" className="gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Refresh
                </Btn>
              </div>

              <div className="my-10">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Featured Properties</h3>
                  <button className="text-green-600 text-sm font-medium">
                    See all
                  </button>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                  {thumbImages.map((thumb, index) => (
                    <div
                      key={index}
                      className="min-w-[340px] max-w-[340px] h-[100px] rounded-xl border shadow flex items-center bg-white overflow-hidden pr-3"
                    >
                      <div className="relative h-[100px] w-[100px] min-w-[100px]">
                        <img
                          src={thumb}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 w-full space-y-1">
                        <div className="flex w-full justify-between items-center">
                          <p className="text-[14px] font-medium text-[#263245]">
                            Luxury Apartment
                          </p>
                          <div className="">
                            {index === 0 ? (
                              <span className="text-red-500 text-xl">❤️</span>
                            ) : (
                              <span className="text-gray-400 text-xl">🤍</span>
                            )}
                          </div>
                        </div>
                        <p className="text-[10px] font-light text-[#737D8C] flex items-center gap-1">
                          <LuMapPin /> Victoria Island
                        </p>
                        <p className="text-[#263245] text-[14px] font-semibole">
                          ₦10,000,000 /{" "}
                          <span className="text-[10px] font-normal">
                            Per Annum
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mt-2 ">Filter by location and budget price</div>
                <div>
                  <Button
                    size="small"
                    className="text-nrvDarkGrey bg-nrvGreyMediumBg border border-nrvGreyMediumBg  hover:text-white hover:bg-nrvPrimaryGreen"
                    variant="ordinary"
                    showIcon={false}
                    // disabled={isLoading === false ? false : true}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {properties?.map((property: any) => (
                  <div
                    key={property.id}
                    className=""
                    onClick={() => {
                      router.push(
                        `/dashboard/tenant/properties/${property._id}`
                      );
                    }}
                  >
                    <PropertyCard
                      imageUrl={property?.file}
                      address={property?.propertyId?.street}
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
