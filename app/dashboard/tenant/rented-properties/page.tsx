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

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [singleProperty, setSingleProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
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
            {properties?.length < 1 ? (
              <div className="p-8 w-full">
                <div className="text-2xl">Rented Apartments 🏘️,</div>

                <div className="w-full h-screen flex justify-center items-center">
                  <div className="">
                    <EmptyState />
                    <p className="text-nrvLightGrey m-2">No Rented Apartment</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl min-w-lg md:mx-auto mt-8 mx-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-2xl">Rented Apartment 🏘️</div>
                  </div>
                </div>
                {properties?.map((property: any) => (
                  <div
                    key={property.id}
                    className="bg-white p-3 rounded rounded-lg w-full mt-8 flex justify-between"
                  >
                    <div className="w-3/5">
                      <div className="flex gap-2 ">
                        <div className="md:w-1/5 w-2/5">
                          <img
                            src={property.propertyId.file}
                            className="h-20 w-20 rounded-sm"
                            alt="Property"
                          />
                        </div>

                        <p className="md:w-4/5 w-3/5 text-md  text-nrvDarkGrey font-light">
                          {property.propertyId.propertyId?.streetAddress}
                        </p>
                      </div>
                    </div>
                    <div className="w-2/5 text-end">
                      <Button
                        size="small"
                        className="text-nrvDarkBlue text-xs rounded border border-nrvDarkBlue mt-8"
                        variant="lightGrey"
                        showIcon={false}
                      >
                        <div
                          className="flex gap-3"
                          onClick={() => {
                            router.push(
                              `/dashboard/tenant/rented-properties/${property.propertyId._id}`
                            );
                          }}
                        >
                          <p className="text-nrvDarkBlue text-sm p-1">
                            View details
                          </p>
                        </div>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <Button
                    size="small"
                    className="text-nrvDarkBlue border border-nrvDarkBlue rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    className="text-nrvDarkBlue border border-nrvDarkBlue rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
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
