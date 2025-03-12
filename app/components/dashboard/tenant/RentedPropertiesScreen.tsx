"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import Button from "../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getPropertyByUserId,
  getRentedApartmentsForTenant,
} from "../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { FcHome } from "react-icons/fc";

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
      page: page,
    };

    try {
      const response = await dispatch(
        getRentedApartmentsForTenant(formData) as any
      ); // Pass page parameter
      setProperties(response?.payload?.data);
      setTotalPages(response?.totalPages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]); // Reload properties when page changes

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

  return (
    <div>
      {isLoading ? (
              <div className="w-full mx-auto">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex bg-gray-200 mt-4 rounded-2xl p-4">
                  <div className="w-1/5">
                    <div className="h-20 bg-gray-300 rounded"></div> {/* Placeholder for image */}
                  </div>
                  <div className="w-4/5">
                    <div className="flex justify-between w-full">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div> {/* Placeholder for name */}
                      <div className="h-6 bg-gray-200 rounded w-1/2 text-right"></div> {/* Placeholder for apartment ID */}
                    </div>
                    <div className="h-4 bg-gray-300 rounded mt-4"></div> {/* Placeholder for address */}
                  </div>
                </div>
              ))}
            </div>
      ) : (
        <div>
          {properties?.length < 1 ? (
            <div className="p-8 w-full">
              <div className="w-full h-screen flex justify-center items-center">
                <div className="">
                  <EmptyState />
                  <p className="text-nrvLightGrey m-2">No Rented Apartment</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:mx-auto mt-8 mx-4">
              {properties?.map((property: any) => (
                <div
                  key={property.id}
                  className="bg-white p-8 rounded rounded-lg w-full mt-8 flex justify-between"
                  onClick={() => {
                    router.push(
                      `/dashboard/tenant/rented-properties/${property.propertyId._id}`
                    );
                  }}
                >
                  <div className="w-full">
                    <div className="flex gap-2 ">
                      <div className="w-1/7">
                      <FcHome size={24} />
                      </div>

                      <p className="w-6/7 text-sm text-nrvDarkGrey font-light">
                        {property.propertyId.propertyId?.streetAddress}
                      </p>
                    </div>
                  </div>
                  {/* <div className="w-2/5 text-end flec flex-col justify-between h-full">
                    <Button
                      size="small"
                      className="text-nrvPrimaryGreen border border-nrvPrimaryGreen rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div
                        className="flex gap-3"
                   
                      >
                        View details
                      </div>
                    </Button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentedPropertiesScreen;
