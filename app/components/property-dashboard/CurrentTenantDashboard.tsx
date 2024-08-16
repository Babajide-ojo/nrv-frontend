"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentTenantForProperty } from "../../../redux/slices/propertySlice";
import { IoAddCircleOutline, IoEye, IoEyeOff } from "react-icons/io5";

interface Data {
  data: any;
}

const CurrentTenantDashboard: React.FC<Data> = ({ data }) => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [tenantDetails, setTenantDetails] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    try {
      const tenant = await dispatch(
        getCurrentTenantForProperty(id) as any
      ).unwrap();
      setTenantDetails(tenant);
    } catch (error) {}

    return () => clearTimeout(timer);
  };

  const formatDateToWords = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const calculateDateDifference = (
    startDateString: string,
    endDateString: string
  ) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Ensure the end date is after the start date
    if (endDate < startDate) {
      throw new Error("End date must be after start date.");
    }

    // Calculate difference
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust months and years if necessary
    if (days < 0) {
      months--;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate(); // days in the previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Return formatted difference
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }, and ${days} day${days !== 1 ? "s" : ""}`;
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="pb-4 md:pb-0">
      {tenantDetails.data != null ? (
        <div>
          <div className="w-full rounded rounded-2xl p-4">
            <div className="md:flex md:gap-8">
              <div className="md:w-1/3 w-full bg-white shadow-md rounded-lg p-3">
                <div className="mb-2 text-md text-nrvDarkBlue font-medium">
                  Tenant Personal Information
                </div>
                <div className="mb-2">
                  <p className="text-sm text-nrvGreyBlack">
                    {tenantDetails?.data?.applicant?.firstName}{" "}
                    {tenantDetails?.data?.applicant?.lastName}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-nrvDarkBlue underline">
                    {tenantDetails?.data?.applicant?.email}
                  </p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-nrvGreyBlack">
                    {tenantDetails?.data?.applicant?.phoneNumber ||
                      "No phone number provided yet"}
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-nrvDarkBlue">NIN</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-md text-nrvGreyBlack">
                      {isVisible
                        ? tenantDetails?.data?.applicant?.nin
                        : "****************"}
                    </span>
                    <button
                      onClick={toggleVisibility}
                      className="text-blue-500"
                    >
                      {isVisible ? (
                        <IoEyeOff className="w-5 h-5 text-nrvDarkBlue" />
                      ) : (
                        <IoEye className="w-5 h-5 text-nrvDarkBlue" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:w-1/3 w-full bg-white shadow-md rounded-lg p-3 relative">
                <div className="mb-8 text-md text-nrvDarkBlue font-medium">
                  Rent Tenure
                </div>
                {tenantDetails?.data?.rentStartDate ? (
                  <div>
                    <div className="relative flex items-center justify-between">
                      <div className="date-section text-center flex-grow">
                        <p className="text-xs font-medium">Rent Start Date</p>
                        <hr className="my-2 border-t-2 border-gray-300" />
                        <p className="text-xs text-nrvGreyBlack">
                          {formatDateToWords(
                            tenantDetails?.data?.rentStartDate
                          )}
                        </p>
                      </div>
                      <div className="absolute inset-x-0 flex justify-center">
                        <div className="arrow"></div>
                      </div>
                      <div className="date-section text-center flex-grow">
                        <p className="text-xs font-medium">Rent End Date</p>
                        <hr className="my-2 border-t-2 border-gray-300" />
                        <p className="text-xs text-red-500">
                          {formatDateToWords(tenantDetails?.data?.rentEndDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-nrvDarkBlue text-center font-medium">
                      {calculateDateDifference(
                        tenantDetails?.data?.rentStartDate,
                        tenantDetails?.data?.rentEndDate
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="text-red-600 text-sm underline text-center">
          Click here to set up the rent period for this tenant
                    </div>
                 
                  </div>
                )}
              </div>

              <div className="md:w-1/3 w-full bg-white shadow-lg rounded-lg p-6">
                <div className="flex flex-col gap-4">
                  <div
                    onClick={() => alert("Extend Rent Tenure")}
                    className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <span className="text-xs font-medium text-nrvGreyBlack">
                      Extend Rent Tenure
                    </span>
                    <span className="text-blue-500 hover:underline text-sm">
                      click here
                    </span>
                  </div>
                  <div
                    onClick={() => alert("End Rent Tenure")}
                    className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <span className="text-xs font-medium text-nrvGreyBlack">
                      End Rent Tenure
                    </span>
                    <span className="text-blue-500 hover:underline text-sm ">
                      click here
                    </span>
                  </div>

                  <div
                    onClick={() => alert("Upload Agreement Documents")}
                    className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <span className="text-xs font-medium text-nrvGreyBlack">
                      Upload Agreement Documents
                    </span>
                    <span className="text-blue-500 text-sm  hover:underline">
                      click here
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="md:w-1/2 w-full">
                <div className="">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Current Employer
                  </h2>
                  <div className="text-sm text-nrvGreyBlack">
                    {tenantDetails?.data?.currentEmployer},{" "}
                    {tenantDetails?.data?.jobTitle}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Employer's Address
                  </h2>

                  <p className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.currentAddress}
                  </p>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Monthly Income:
                  </h2>
                  <div className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.monthlyIncome} naira only
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Phone Number:
                  </h2>
                  <div className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.applicant?.phoneNumber}
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">No Active Tenancy</div>
      )}
    </div>
  );
};
export default CurrentTenantDashboard;
