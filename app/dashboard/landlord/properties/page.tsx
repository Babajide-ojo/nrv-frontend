"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import Button from "../../../components/shared/buttons/Button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyByUserId } from "../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import { formatDate, formatDateToWords } from "@/helpers/utils";

const PropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [singleProperty, setSingleProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsPageLoading(true);
        const storedUser = JSON.parse(
          localStorage.getItem("nrv-user") || "null"
        );
        if (!storedUser?.user?._id) return;
        setUser(storedUser.user);

        const response = await dispatch(
          getPropertyByUserId({ id: storedUser.user._id, page }) as any
        );

        setProperties(response?.payload?.data || []);
        setTotalPages(response?.payload?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setIsLoading(false);
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, [dispatch, page]);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout>
            <ToastContainer />
            {isPageLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white">Loading...</div>
              </div>
            )}
            <div className="p-4 w-full">
              <h2 className="text-xl">Properties 🏘️</h2>
              {properties.length === 0 ? (
                <div className="w-full h-screen flex flex-col justify-center items-center">
                  <EmptyState />
                  <p className="text-nrvLightGrey m-2">
                    No property listed yet
                  </p>
                  <Button
                    size="normal"
                    className="text-nrvDarkBlue border border-nrvDarkBlue mt-4 rounded-md"
                    variant="lightGrey"
                    onClick={() =>
                      router.push("/dashboard/landlord/properties/create")
                    }
                  >
                    Add New
                  </Button>
                </div>
              ) : (
                <div className="max-w-2xl min-w-lg md:mx-auto mt-8 mx-4">
                  <div className="flex justify-between">
                    <p className="text-md text-nrvLightGrey">
                      Manage your properties below
                    </p>
                    <Button
                      size="small"
                      className="text-nrvDarkBlue border border-nrvDarkBlue rounded-md hover:text-white text-sm"
                      variant="lightGrey"
                      onClick={() =>
                        router.push("/dashboard/landlord/properties/create")
                      }
                    >
                      Add Property
                    </Button>
                  </div>
                  {properties.map((property, index) => (
                    <div key={index} className="bg-white p-2 rounded-lg mt-8  shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                      <div className="">
                        <div className="flex gap-4 w-full">
                          <img
                            src={property.file}
                            className="h-20 w-20 rounded-lg object-cover"
                            alt="Property"
                          />
                          <div className="w-full">
                            <p className="text-sm font-normal text-nrvDarkGrey">
                              {property.streetAddress}
                            </p>
                            <p className="text-sm font-normal text-nrvLightGrey mt-2">
                             Added on {formatDateToWords(property.createdAt)}
                            </p>
                          </div>
                    
                        </div>
 
                      </div>
                      <div className="flex justify-end">
                      <Button
                        size="small"
                        className="mt-2 text-nrvDarkBlue text-sm font-normal border border-white rounded-md py-1 px-2 hover:bg-nrvLightBlue hover:text-white transition-colors duration-300"
                        variant="lightGrey"
                        onClick={() => {
                          localStorage.setItem(
                            "property",
                            JSON.stringify(property)
                          );
                          setSingleProperty(property);
                          router.push(
                            `/dashboard/landlord/properties/${property._id}`
                          );
                        }}
                      >
                        View
                      </Button>
                      </div>

                     
                    </div>
                  ))}

                  <div className="flex justify-between mt-4">
                    <Button
                      size="small"
                      className="text-nrvDarkBlue text-sm border border-nrvDarkBlue rounded-md"
                      variant="lightGrey"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      size="small"
                      className="text-nrvDarkBlue text-sm border border-nrvDarkBlue rounded-md"
                      variant="lightGrey"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <CenterModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
              <div className="mx-auto text-center p-4">
                <h2 className="text-nrvDarkBlue font-semibold text-xl">
                  Contact Info
                </h2>
                <p className="text-nrvLightGrey text-sm">
                  View your property full details
                </p>
                <p className="text-nrvLightGrey underline mt-4 text-md">
                  {singleProperty.streetAddress}
                </p>
                <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
                  <Button
                    size="small"
                    className="text-white w-72 border border-nrvDarkBlue rounded-md"
                    variant="bluebg"
                    onClick={() =>
                      router.push(
                        `/dashboard/landlord/properties/${singleProperty._id}`
                      )
                    }
                  >
                    View full details
                  </Button>
                  <Button
                    size="small"
                    className="text-nrvDarkBlue w-72 border border-nrvDarkBlue rounded-md"
                    variant="lightGrey"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </CenterModal>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default PropertiesScreen;
