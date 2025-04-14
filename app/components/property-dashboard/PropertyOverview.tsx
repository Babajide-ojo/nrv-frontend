"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate, formatDateToWords } from "@/helpers/utils";

interface Data {
  data: any;
  img?: string;
}

const PropertyOverview: React.FC<Data> = ({ data, img }) => {
  const router = useRouter();
  return (
    <div className="font-jakarta">
      <div className="bg-white max-w-full w-120 h-40 rounded rounded-2xl">
        <div className="grid grid-col-1 md:grid-cols-3 gap-4">
          {data &&
            data?.rooms?.map((item: any, index: any) => (
              <div
                key={item._id}
                className="bg-white border border-[#F0F2F5] rounded-lg p-4 transition relative cursor-pointer"
                onClick={() => {
                  router.push(
                    `/dashboard/landlord/properties/rooms/${item._id}`
                  );
                }}
              >
                <div className="flex w-full justify-between">
                  <div>
                    <img
                      src={data?.file}
                      className="h-16 w-16 rounded-lg"
                      alt="Property"
                    />
                  </div>
                  <div>
                    <button
                      className={`px-4 py-1.5 text-[12px] font-semibold rounded-full ${
                        item?.assignedToTenant
                          ? "bg-[#FFF1DA] text-[#F3A218]"
                          : "bg-[#E7F6EC] text-[#099137]"
                      }`}
                    >
                      {item?.assignedToTenant
                        ? "Occupied By Tenant"
                        : "Currently Vacant"}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">
                    {item?.propertyType}
                  </h3>
                  <p className="text-[13px] font-light text-[#101928] h-14">
                    <span className="font-semibold text-[13px]">
                      Description :
                    </span>{" "}
                    {item?.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Added on {formatDateToWords(item.createdAt)}
                  </p>
                  <div className="flex gap-2 w-full mt-4 justify-between border-t pt-2">
                    <div className="text-[13px] font-medium text-[#1D2227]">
                      ₦{item.rentAmount.toLocaleString()}{" "}
                      <span className="text-[11px] text-[#646D75]">
                        per annum
                      </span>
                    </div>
                    <div className="text-[13px] font-medium italic text-[#045D23]">
                      {" "}
                      View Details
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* 
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
          <div className="font-light text-nrvPrimaryGreen text-xs">
            Ongoing Maintenance: 0
          </div>
          <div>
            <Button
              size="normal"
              className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvPrimaryGreen"
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
      </div> */}
    </div>
  );
};
export default PropertyOverview;
