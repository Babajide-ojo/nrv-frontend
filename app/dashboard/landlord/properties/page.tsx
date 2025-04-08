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
import { formatDate } from "@/helpers/utils";

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
  const [summaryData, setSummaryData] = useState({
    occupancyRate: 0,
    avgLeaseDuration: 0,
    tenantTurnoverRate: 0,
    vacancyRate: 0,
  });

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

  useEffect(() => {
    const calculateSummaryData = () => {
      let totalUnits = 0;
      let totalOccupied = 0;
      let totalVacant = 0;
      let totalTenants = 0;
      let tenantTurnover = 0;
      let totalLeaseDuration = 0;

      properties.forEach((property) => {
        totalUnits += property.apartmentCount;
        totalOccupied += property.apartmentCount - property.unitsLeft;
        totalVacant += property.unitsLeft;

        // Assuming tenantTurnover and leaseDuration are available on the property
        tenantTurnover += property.tenantTurnover || 0;
        totalTenants += property.apartmentCount;

        if (property.leaseDuration) {
          totalLeaseDuration += property.leaseDuration;
        }
      });

      const avgLeaseDuration = properties.length;

      setSummaryData({
        occupancyRate: (totalOccupied / totalUnits) * 100,
        avgLeaseDuration,
        tenantTurnoverRate: totalUnits,
        vacancyRate: (totalVacant / totalUnits) * 100,
      });
    };

    if (properties.length > 0) {
      calculateSummaryData();
    }
  }, [properties]);

  return (
    <ProtectedRoute>
      <LandLordLayout mainPath="Properties" subMainPath="Manage Properties">
        <ToastContainer />
        <div className="p-6 w-full font-jakarta">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
            <div className="w-full md:w-auto">
              <h2 className="text-xl font-semibold text-[#101828]">
                View & Manage Your Properties
              </h2>
              <p className="text-sm font-light mt-2 text-[#475467]">
                View and update your property information to keep it accurate
                and up-to-date.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
              <Button
                variant="light"
                className="px-6 py-2 rounded-md flex justify-center items-center gap-2 w-full sm:w-auto"
                onClick={() =>
                  router.push("/dashboard/landlord/properties/create")
                }
              >
                <div className="flex gap-2">
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 20 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.1666 2.33331V7.33332M19.1666 7.33332H14.1666M19.1666 7.33332L15.2999 3.69998C14.4043 2.80391 13.2963 2.14932 12.0792 1.79729C10.8622 1.44527 9.57584 1.40727 8.34016 1.68686C7.10447 1.96645 5.95975 2.55451 5.01281 3.39616C4.06586 4.23782 3.34756 5.30564 2.92492 6.49998M0.833252 15.6666V10.6666M0.833252 10.6666H5.83325M0.833252 10.6666L4.69992 14.3C5.59554 15.1961 6.70356 15.8506 7.92059 16.2027C9.13762 16.5547 10.424 16.5927 11.6597 16.3131C12.8954 16.0335 14.0401 15.4455 14.987 14.6038C15.934 13.7621 16.6523 12.6943 17.0749 11.5"
                      stroke="#03442C"
                      strokeWidth="1.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Refresh</span>
                </div>
              </Button>

              <Button
                variant="darkPrimary"
                className="px-6 py-2 rounded-md w-full sm:w-auto"
                onClick={() =>
                  router.push("/dashboard/landlord/properties/create")
                }
              >
                + Add New Property
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 grid-cols-1 gap-4 text-center mb-6 border border-gray-300 ">
            {[
              {
                label: "Total Number of Properties",
                value: `${summaryData.avgLeaseDuration.toFixed(0)}`,
                color: "text-green-600",
              },
              {
                label: "Total Number of Apartments/Units",
                value: `${summaryData.tenantTurnoverRate.toFixed(0)}`,
                color: "text-green-600",
              },
              {
                label: "Overall Occupancy Rate",
                value: `${summaryData.occupancyRate.toFixed(2)}%`,
                color: "text-green-600",
              },
   
              {
                label: "Vacancy Rate",
                value: `${summaryData.vacancyRate.toFixed(2)}%`,
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
                // Calculate the lease progress based on unitsLeft and apartmentCount
                const occupiedProgress =
                  ((property.apartmentCount - property.unitsLeft) /
                    property.apartmentCount) *
                  100;
                const unoccupiedProgress =
                  (property.unitsLeft / property.apartmentCount) * 100;

                return (
                  <div
                    key={property._id}
                    className="bg-white border border-[#F0F2F5] rounded-lg p-2 transition relative cursor-pointer"
                    onClick={() => {
                      localStorage.setItem(
                        "property",
                        JSON.stringify(property)
                      );
                      router.push(
                        `/dashboard/landlord/properties/${property._id}`
                      );
                    }}
                  >
                    <div className="flex w-full justify-between">
                      <div>
                        <img
                          src={property.file}
                          className="h-14 w-14 rounded-lg"
                          alt="Property"
                        />
                      </div>
                      <div>
                        {property.apartmentCount > 0 && (
                          <button className="bg-[#E7F6EC] px-3 py-1.5 text-[#099137] text-[10px] font-semibold rounded-full Cursor-none">
                            {property.apartmentCount} Unit(s)
                          </button>
                        )}

                        {property.apartmentCount === 0 && (
                          <button className="bg-red-100 px-3 py-1.5 text-red-700 text-[10px] font-semibold rounded-full">
                            No Apartment Added Yet
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-md font-semibold">{property.name}</h3>
                      <p className="text-md text-[#101928] w-4/5 h-14">
                        {property.streetAddress}
                      </p>
                      <p className="text-xs text-gray-400 font-light">
                        Added on {formatDate(property.createdAt.slice(0, 10))}
                      </p>
                      <div className="flex gap-2 w-full mt-4 border-t pt-2">
                        <div className="w-1/12">
                          {property?.unitsLeft !== property.apartmentCount && (
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
                          )}

                          {property?.unitsLeft === property.apartmentCount && (
                            <svg
                              width="33"
                              height="33"
                              viewBox="0 0 33 33"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.882324"
                                y="0.5"
                                width="32"
                                height="32"
                                rx="16"
                                fill="#FFEAE9"
                              />
                              <path
                                d="M23.549 23.6665H10.2157C9.94236 23.6665 9.7157 23.4398 9.7157 23.1665C9.7157 22.8932 9.94236 22.6665 10.2157 22.6665H23.549C23.8224 22.6665 24.049 22.8932 24.049 23.1665C24.049 23.4398 23.8224 23.6665 23.549 23.6665Z"
                                fill="#F70901"
                              />
                              <path
                                opacity="0.4"
                                d="M22.8818 15.153V23.1663H10.8485L10.8818 15.1463C10.8818 14.7396 11.0685 14.353 11.3952 14.0997L16.0618 10.473C16.5418 10.093 17.2218 10.093 17.7018 10.473L18.5952 11.1663L21.5485 13.4596L22.3685 14.0997C22.6952 14.353 22.8818 14.7396 22.8818 15.153Z"
                                fill="#F70901"
                              />
                              <path
                                d="M17.549 19.8335H16.2157C15.6624 19.8335 15.2157 20.2802 15.2157 20.8335V23.1668H18.549V20.8335C18.549 20.2802 18.1024 19.8335 17.549 19.8335Z"
                                fill="#F70901"
                              />
                              <path
                                d="M15.2157 17.6668H13.8824C13.5157 17.6668 13.2157 17.3668 13.2157 17.0002V16.0002C13.2157 15.6335 13.5157 15.3335 13.8824 15.3335H15.2157C15.5824 15.3335 15.8824 15.6335 15.8824 16.0002V17.0002C15.8824 17.3668 15.5824 17.6668 15.2157 17.6668Z"
                                fill="#F70901"
                              />
                              <path
                                d="M19.8823 17.6668H18.549C18.1823 17.6668 17.8823 17.3668 17.8823 17.0002V16.0002C17.8823 15.6335 18.1823 15.3335 18.549 15.3335H19.8823C20.249 15.3335 20.549 15.6335 20.549 16.0002V17.0002C20.549 17.3668 20.249 17.6668 19.8823 17.6668Z"
                                fill="#F70901"
                              />
                              <path
                                d="M21.5492 13.4598L18.5958 11.1665H20.8692C21.2358 11.1665 21.5358 11.4598 21.5358 11.8265L21.5492 13.4598Z"
                                fill="#F70901"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="w-7/12">
                          <div className="text-[12px] font-medium">
                            Total Number of Available Units :{" "}
                            {property?.unitsLeft} / {property.apartmentCount}
                          </div>
                          {property?.unitsLeft !== property.apartmentCount && (
                            <div className="relative w-full h-2 bg-[#E7F6EC] rounded-full mt-2">
                              {/* Dark Shade for Occupied Units */}
                              <div
                                className="absolute h-full bg-[#2B892B] rounded-full"
                                style={{ width: `${occupiedProgress}%` }}
                              />
                              {/* Light Shade for Unoccupied Units */}
                              <div
                                className="absolute h-full bg-[#2B892B] rounded-full"
                                style={{ width: `${unoccupiedProgress}%` }}
                              />
                            </div>
                          )}

                          {property?.unitsLeft === property.apartmentCount && (
                            <div className="relative w-full h-2 bg-red-500 rounded-full mt-2"></div>
                          )}
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
