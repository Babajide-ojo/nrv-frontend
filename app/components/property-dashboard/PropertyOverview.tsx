"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useRouter } from "next/navigation";
import {useState} from 'react';


interface Data {
  data: any;
}

const PropertyOverview: React.FC<Data> = ({ data }) => {

 

  const router = useRouter();
  return (
    <div className="pb-12 md:pb-0">
      <div className="bg-white max-w-full w-120 h-40 rounded rounded-2xl p-4">
        <div className="flex justify-between border-b border-b-1 mb-4">
          <div className="font-medium text-nrvDarkBlue text-sm">Apartments</div>
          <div>
            <Button
              size="small"
              className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
              onClick={() => {
                router.push("/dashboard/landlord/properties/rooms/create");
              }}
            >
              <div className="text-xs md:text-md flex gap-2 font-medium">
                <BsPlusCircleFill size={15} />
                Add Apartment
              </div>
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          {data &&
            data?.rooms?.map((item: any, index: any) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  router.push(
                    `/dashboard/landlord/properties/rooms/${item._id}`
                  );
                }}
              >
                <div className="h-10 w-10 text-sm bg-nrvLightGreyBg flex items-center border rounded rounded-2xl justify-center">
                  {item?.roomId}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-8 md:w-full lg:w-full 2xl:w-1/2 xl:w-1/2 sm:w-full xs:w-full mx-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
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

      <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4 mt-8">
        <div className="flex justify-between mb-4">
          <div className="font-light text-nrvDarkBlue text-xs">
            Ongoing Maintenance: 0
          </div>
          <div>
            <Button
              size="normal"
              className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Create Request
              </div>
            </Button>
          </div>
        </div>
        <div className="text-center text-[13px] flex mx-auto w-4/5 mt-4 text-nrvGrayText font-light">
          Instead of being spread across text/emails/voicemails you now have a
          centralized place to view, respond to, and track maintenance logged by
          you or your tenant.
        </div>
      </div>
   
    </div>
  );
};
export default PropertyOverview;
