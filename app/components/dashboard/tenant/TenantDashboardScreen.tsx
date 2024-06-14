"use client";

import { useEffect } from "react";
import { dashboardMetrics, tenantDashboardMetrics , dashboardTenantNavLinks} from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import DashboardNavigationCard from "../../shared/cards/DashboardNavigationCard";
import { useState } from "react";
import TenantDashboardNavigationCard from "../../shared/cards/TenantDashboardNavigationCard";

const TenantDashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
  }, []);
  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} 👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="">
        <div className="w-full">
          <div className="flex gap-6 w-full md:w-3/5 my-2">
            {tenantDashboardMetrics.map(({ title, imageLink, number }, index) => (
              <div key={index} className="w-1/3">
                <TenantDashboardNavigationCard
                  title={title}
                  imageLink={imageLink}
                  number={number}
                  isMetric={true}
                />
              </div>
            ))}
          </div>
          <div>
  <h2 className="text-xl font-semibold mb-4">Manage Apartments</h2>
  <div className="flex gap-4">
    <div className="p-3 bg-white h-40 rounded-md shadow-md flex-grow">
      Lease Agreement Docs
    </div>
    <div className="p-3 bg-white h-40 rounded-md shadow-md flex-grow">
      Request Maintenance
    </div>
    <div className="p-3 bg-white h-40 rounded-md shadow-md flex-grow">
      E Documents
    </div>
  </div>
</div>


          {/* <div className="mt-8 w-full bg-white rounded-lg p-3 flex justify-between mb-4">
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
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default TenantDashboardScreen;