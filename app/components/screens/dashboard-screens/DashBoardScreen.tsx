"use client";
import { useEffect } from "react";
import { dashboardMetrics, dashboardNavLinks } from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import DashboardNavigationCard from "../../shared/cards/DashboardNavigationCard";
import { useState } from "react";

const DashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
  }, []);
  return (
    <div className="md:p-8 p-3">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} 👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="flex-row md:flex gap-12">
        <div className="md:w-1/2 w-full">
          <div className=" grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {dashboardMetrics.map(({ title, imageLink, number }, index) => (
              <div key={index}>
                <DashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={true}
                />
              </div>
            ))}
          </div>
          <div className="mt-8 w-full bg-white rounded-lg p-3 flex justify-between">
            <div className="pt-1 font-light">Ongoing Maintenance: 0</div>
            <div>
              <Button
                size="normal"
                className=""
                variant="lightGrey"
                showIcon={false}
              >
                View
              </Button>
            </div>
          </div>

          <div className="mt-8 w-full bg-white rounded-lg p-3 flex justify-between mb-4">
            <div className="pt-1 font-light">Collect Rent Online</div>
            <div>
              <Button
                size="normal"
                className=""
                variant="lightGrey"
                showIcon={false}
              >
                View
              </Button>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardNavLinks.map(({ title, imageLink, number }, index) => (
              <div key={index}>
                <DashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
