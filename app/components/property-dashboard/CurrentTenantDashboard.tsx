"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentTenantForProperty } from "../../../redux/slices/propertySlice";

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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="pb-12 md:pb-0">
      {tenantDetails.data != null ? (
        <div>
          <div className="w-full rounded rounded-2xl p-4">
            <div className="md:flex md:gap-8">
              <div className="md:w-1/2 w-full">
                <div className="">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Full Name
                  </h2>
                  <div className="text-md text-nrvGreyBlack">
                    {tenantDetails?.data?.applicant?.firstName}{" "}
                    {tenantDetails?.data?.applicant?.lastName}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Email
                  </h2>
                  <div className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.applicant?.email}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    Phone Number
                  </h2>
                  <div className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.applicant?.phoneNumber}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
                    National Identification Number
                  </h2>
                  <div className="text-sm text-nrvGreyBlack font-light">
                    {tenantDetails?.data?.applicant?.nin}
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 w-full">
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
              </div>
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
