"use client";

import { useEffect } from "react";
import {
  tenantDashboardMetrics
} from "../../../../helpers/data";
import Button from "../../shared/buttons/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TenantDashboardNavigationCard from "../../shared/cards/TenantDashboardNavigationCard";

const TenantDashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  const router = useRouter()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
  }, []);
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
              ({ title, imageLink, number }, index) => (
                <div key={index} className="w-1/3">
                  <TenantDashboardNavigationCard
                    title={title}
                    imageLink={imageLink}
                    number={number}
                    isMetric={true}
                  />
                </div>
              )
            )}
          </div>
          {/* <div>
            <h2 className="text-lg my-4 text-nrvDarkGrey font-medium">Manage Apartments</h2>
            <div className="flex gap-6 w-full md:w-3/5">
              <div className="w-full md:h-30 h-30 bg-white border border-nrvLightGray hover:border-black rounded-2xl m-1 p-2 cursor-pointer light flex flex-col justify-end p-4 text-center hover:bg-nrvLightGreyBg">
                <div className="text-center flex justify-center mb-2">
                  <svg
                    width="28"
                    height="30"
                    viewBox="0 0 31 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.39258 19.6352V13.3652C1.39258 7.45378 1.39258 4.49808 3.22901 2.66163C5.06547 0.825195 8.02116 0.825195 13.9326 0.825195H17.0676C22.9789 0.825195 25.9348 0.825195 27.7711 2.66163C29.6076 4.49808 29.6076 7.45378 29.6076 13.3652V19.6352C29.6076 25.5466 29.6076 28.5024 27.7711 30.3387C25.9348 32.1752 22.9789 32.1752 17.0676 32.1752H13.9326C8.02116 32.1752 5.06547 32.1752 3.22901 30.3387C1.39258 28.5024 1.39258 25.5466 1.39258 19.6352Z"
                      stroke="#141B34"
                      stroke-width="1.5"
                    />
                    <path
                      d="M14.4554 14.4103C16.1091 16.0638 18.2872 17.7443 18.2872 17.7443L21.2728 14.7586C21.2728 14.7586 19.5924 12.5805 17.9389 10.9269C16.2852 9.27326 14.1071 7.59283 14.1071 7.59283L11.1214 10.5785C11.1214 10.5785 12.8019 12.7566 14.4554 14.4103ZM14.4554 14.4103L9.23047 19.6352M21.7705 14.2609L17.7895 18.2419M14.6048 7.09521L10.6238 11.0762"
                      stroke="#141B34"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.23047 25.9053H21.7705"
                      stroke="#141B34"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div className="md:text-lg text-sm font-light">Lease Agreement Docs</div>
              </div>
              <div className="w-full md:h-30 h-30 bg-white border border-nrvLightGray hover:border-black rounded-2xl m-1 p-2 cursor-pointer light flex flex-col justify-end p-4 text-center hover:bg-nrvLightGreyBg">
                <div className="text-center flex justify-center mb-2">
                  <svg
                    width="28"
                    height="30"
                    viewBox="0 0 31 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.8135 32.0832H15.2695C9.44621 32.0832 6.5346 32.0832 4.72555 30.3746C2.9165 28.6661 2.9165 25.9162 2.9165 20.4165V14.5832C2.9165 9.08345 2.9165 6.3336 4.72555 4.62504C6.5346 2.9165 9.44622 2.9165 15.2695 2.9165H16.8135C22.6368 2.9165 25.5484 2.9165 27.3574 4.62504C29.1665 6.3336 29.1665 9.08345 29.1665 14.5832V15.3123"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.2085 10.2085H21.8752"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M10.2085 17.5H17.5002"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M26.2498 30.2085V32.0835M26.2498 30.2085C24.5628 30.2085 23.0767 29.3799 22.2049 28.1216M26.2498 30.2085C27.9368 30.2085 29.423 29.3799 30.2948 28.1216M22.2049 28.1216L20.4171 29.271M22.2049 28.1216C21.6893 27.3775 21.3888 26.4831 21.3888 25.521C21.3888 24.5589 21.6892 23.6647 22.2047 22.9206M30.2948 28.1216L32.0826 29.271M30.2948 28.1216C30.8103 27.3775 31.1109 26.4831 31.1109 25.521C31.1109 24.5589 30.8105 23.6647 30.295 22.9206M26.2498 20.8335C27.937 20.8335 29.4233 21.6622 30.295 22.9206M26.2498 20.8335C24.5627 20.8335 23.0764 21.6622 22.2047 22.9206M26.2498 20.8335V18.9585M30.295 22.9206L32.0832 21.771M22.2047 22.9206L20.4165 21.771"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div className="md:text-lg text-sm font-light">Request Maintenance</div>
              </div>
              <div className="w-full md:h-30 h-30 bg-white border border-nrvLightGray hover:border-black rounded-2xl m-1 p-2 cursor-pointer light flex flex-col justify-end p-4 text-center hover:bg-nrvLightGreyBg">
                <div className="text-center flex justify-center mb-2">
                  <svg
                    width="28"
                    height="30"
                    viewBox="0 0 31 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.2499 30.9573L10.3319 32.9849C8.23773 33.3738 7.19065 33.5681 6.58744 32.965C5.98424 32.3618 6.17867 31.3146 6.56755 29.2204L8.59497 18.3019C8.92009 16.551 9.08264 15.6756 9.65975 15.1467C10.2368 14.6177 11.2923 14.5145 13.4031 14.3081C15.4376 14.1091 17.3628 13.4117 19.3696 11.4048L28.1476 20.1836C26.1408 22.1904 25.4431 24.1146 25.2437 26.149C25.0369 28.2601 24.9335 29.3157 24.4046 29.8927C23.8757 30.4697 23.0004 30.6322 21.2499 30.9573Z"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.742 24.275C17.865 24.1327 17.0631 23.7512 16.432 23.1201M16.432 23.1201C15.8009 22.489 15.4194 21.6871 15.2771 20.8101M16.432 23.1201L7.76953 31.7826"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M19.5259 11.4051C20.5184 9.94088 22.6463 6.95512 24.638 6.71794C25.9976 6.55605 27.1239 7.68231 29.3764 9.93486L29.6174 10.1759C31.8699 12.4285 32.9962 13.5547 32.8343 14.9143C32.5971 16.9058 29.6113 19.0339 28.1471 20.0264"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.2025 11.405V2M1.5 6.7025H10.905"
                      stroke="#333333"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div className="md:text-lg text-sm font-light">E Documents</div>
              </div>
            </div>
          </div> */}
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
    </div>
  );
};

export default TenantDashboardScreen;
