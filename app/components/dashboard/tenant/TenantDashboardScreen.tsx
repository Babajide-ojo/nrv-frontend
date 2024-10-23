"use client";

import { useEffect } from "react";
import {
  tenantDashboardMetrics
} from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TenantDashboardNavigationCard from "../../shared/cards/TenantDashboardNavigationCard";
import RentedPropertiesScreen from "./RentedPropertiesScreen";
import { useDispatch } from "react-redux";
import { getTenantMetrics } from "@/redux/slices/propertySlice";
import { FcComboChart, FcHome, FcParallelTasks } from "react-icons/fc";
//import RentedPropertiesScreen from "@/app/dashboard/tenant/rented-properties/page";

const TenantDashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  const [count, setCount] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    fetchData();
  }, []);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
    };
    try {
      const response = await dispatch(getTenantMetrics(formData) as any);
      setCount(response.payload.data);
    } catch (error) {
    } finally {
    }
  };

   const tenantDashboardMetrics = [
    {
      imageLink:
      <FcHome color="#004B95"  size={35} />,
      title: "Apartments",
      number: count.totalNew,
      link: '/dashboard/tenant/rented-properties'
    },
    {
      imageLink:
      <FcComboChart color="#004B95"  size={35} />,
      title: "Applications",
      number: count.totalAccepted,
      link: '/dashboard/tenant/properties/applications'
    },
    {
      imageLink:
      <FcParallelTasks color="#004B95"  size={35} />,
      title: "Maintenance",
      number: count.totalActiveTenants,
      link: '/dashboard/tenant/properties/maintenance'
    },
  ];
  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} {user?.lastName}👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="">
        <div className="w-full">
          <div className="flex gap-6 w-full md:w-3/5 my-2">
            {tenantDashboardMetrics.map(
              ({ title, imageLink, number, link }, index) => (
                <div key={index} className="w-1/3">
                  <TenantDashboardNavigationCard
                    title={title}
                    imageLink={imageLink}
                    number={number}
                    isMetric={true}
                    link={link}
                  />
                </div>
              )
            )}
          </div>
          
          <h2 className="text-lg my-4 text-nrvDarkGrey font-medium">Other Properties</h2>
          <div className="w-full md:w-3/5 bg-white rounded-lg p-3 flex justify-between mb-4">
            <div className="pt-1 font-light">
              <p className="font-medium">Explore Properties</p>
              <p className="text-nrvLightGrey text-sm font-medium">Want to view other properties?</p>
            </div>
            <div>
              <Button
                size="large"
                className=""
                variant="lightGrey"
                showIcon={false}
                onClick={() => {
                  router.push('/dashboard/tenant/properties')
                }}
              >
                View
              </Button>
            </div>
          </div>
       
        </div>
      </div>
      <div className="w-full md:w-3/5">
            <RentedPropertiesScreen />
          </div>
    </div>
  );
};

export default TenantDashboardScreen;
