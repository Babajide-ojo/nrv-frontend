"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import Button from "../../../components/shared/buttons/Button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getPropertyByUserId } from "../../../../redux/slices/propertySlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
        {...props}
      >
        <div
          className="absolute h-full bg-green-500 transition-all"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";


const PropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };
    fetchData();
  }, [dispatch, page]);

  return (
    <ProtectedRoute>
      <LandLordLayout mainPath="Properties" subMainPath="Manage Properties">
        <ToastContainer />
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#101828]">
                View & Manage Your Properties
              </h2>
              <p className="text-sm font-light mt-4 text-[#475467]">
                View and update your property information to keep it accurate
                and up-to-date.
              </p>
            </div>
            <Button
              variant="darkPrimary"
              className="px-6 py-2 rounded-md"
              onClick={() =>
                router.push("/dashboard/landlord/properties/create")
              }
            >
              + Add New Property
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 grid-cols-1 gap-4 text-center mb-6 border border-gray-300 ">
            {[
              {
                label: "Occupancy Rate",
                value: "85% Occupied",
                detail: "12 out of 14 units occupied",
                color: "text-green-600",
              },
              {
                label: "Average Lease Duration",
                value: "12 months",
                detail: "0% compared to last 6 months",
                color: "text-green-600",
              },
              {
                label: "Tenant Turnover Rate",
                value: "10%",
                detail: "2 tenants moved out this year",
                color: "text-green-600",
              },
              {
                label: "Vacancy Rate",
                value: "15%",
                detail: "2 out of 14 units vacant",
                color: "text-green-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-start p-4 bg-white my-2 space-y-2.5 border-r"
              >
                <p className="text-[#67667A] font-medium text-sm">
                  {stat.label}
                </p>
                <p className={`text-xl text-[#03442C] font-medium`}>
                  {stat.value}
                </p>
                <p className="text-[#8D9196] text-xs font-lighter">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Property Listings */}
          {isLoading ? (
            <LoadingPage />
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-2">
              <p className="text-gray-500">No properties listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-col-1 md:grid-cols-3 gap-4">
              {properties.map((property) => {
                const isFullyOccupied = property.availableUnits === 0;
                const leaseProgress =
                  (property.availableUnits / property.totalUnits) * 100;

                return (
                  <div
                    key={property._id}
                    className="bg-white border border-[#F0F2F5] rounded-lg p-4 transition relative cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("property", JSON.stringify(property));
                      router.push(`/dashboard/landlord/properties/${property._id}`)
                    }}
                  >
                    <div className="flex w-full justify-between">
                      <div>
                        <img
                          src={property.file}
                          className="h-16 w-16 rounded-lg"
                          alt="Property"
                        />
                      </div>
                      <div>
                        <button className="bg-[#E7F6EC] px-4 py-1.5 text-[#099137] text-[12px] font-semibold rounded-full">
                          Active
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                      <p className="text-md text-[#101928] w-4/5 h-14">
                        {property.streetAddress}
                      </p>
                      <p className="text-xs text-gray-400">
                        Added on {property.createdAt}
                      </p>
                      <div className="flex gap-2 w-full mt-4">
                        <div className="w-1/12">
                          <svg
                            width="32"
                            height="33"
                            viewBox="0 0 32 33"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              y="0.5"
                              width="32"
                              height="32"
                              rx="16"
                              fill="#E9F4E7"
                            />
                            <path
                              d="M22.6666 23.6665H9.33331C9.05998 23.6665 8.83331 23.4398 8.83331 23.1665C8.83331 22.8932 9.05998 22.6665 9.33331 22.6665H22.6666C22.94 22.6665 23.1666 22.8932 23.1666 23.1665C23.1666 23.4398 22.94 23.6665 22.6666 23.6665Z"
                              fill="#2B892B"
                            />
                            <path
                              opacity="0.4"
                              d="M21.9995 15.153V23.1663H9.96613L9.99946 15.1463C9.99946 14.7396 10.1861 14.353 10.5128 14.0997L15.1795 10.473C15.6595 10.093 16.3395 10.093 16.8195 10.473L17.7128 11.1663L20.6661 13.4596L21.4861 14.0997C21.8128 14.353 21.9995 14.7396 21.9995 15.153Z"
                              fill="#2B892B"
                            />
                            <path
                              d="M16.6666 19.8335H15.3333C14.78 19.8335 14.3333 20.2802 14.3333 20.8335V23.1668H17.6666V20.8335C17.6666 20.2802 17.22 19.8335 16.6666 19.8335Z"
                              fill="#2B892B"
                            />
                            <path
                              d="M14.3333 17.6668H13C12.6333 17.6668 12.3333 17.3668 12.3333 17.0002V16.0002C12.3333 15.6335 12.6333 15.3335 13 15.3335H14.3333C14.7 15.3335 15 15.6335 15 16.0002V17.0002C15 17.3668 14.7 17.6668 14.3333 17.6668Z"
                              fill="#2B892B"
                            />
                            <path
                              d="M19 17.6668H17.6667C17.3 17.6668 17 17.3668 17 17.0002V16.0002C17 15.6335 17.3 15.3335 17.6667 15.3335H19C19.3667 15.3335 19.6667 15.6335 19.6667 16.0002V17.0002C19.6667 17.3668 19.3667 17.6668 19 17.6668Z"
                              fill="#2B892B"
                            />
                            <path
                              d="M20.6669 13.4598L17.7136 11.1665H19.9869C20.3536 11.1665 20.6536 11.4598 20.6536 11.8265L20.6669 13.4598Z"
                              fill="#2B892B"
                            />
                          </svg>
                        </div>
                        <div className="w-7/12">
                          <div className="text-sm">
                           Total Number of Units : 10
                          </div>
                          <Progress
                            value={leaseProgress}
                            className={`h-2 mt-2 rounded-full w-full ${
                              isFullyOccupied
                                ? "bg-red-500"
                                : leaseProgress < 30
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default PropertiesScreen;
