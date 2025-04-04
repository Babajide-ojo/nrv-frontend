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
    <div className="">
      <div className="bg-white max-w-full w-120 h-40 rounded rounded-2xl p-4">
        <div className="flex justify-between border-b border-b-1 mb-4">
          <div className="font-medium text-nrvPrimaryGreen text-sm">Apartments</div>
          <div>
            <Button
              size="small"
              className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvPrimaryGreen"
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
        <div className="grid grid-col-1 md:grid-cols-3 gap-4">
          {data &&
            data?.rooms?.map((item: any, index: any) => (
              // <div
              //   key={index}
              //   className="cursor-pointer"
              //   onClick={() => {
              //     router.push(
              //       `/dashboard/landlord/properties/rooms/${item._id}`
              //     );
              //   }}
              // >
              //   <div className="h-10 w-10 text-sm bg-nrvLightGreyBg flex items-center border rounded rounded-2xl justify-center">
              //     {item?.roomId}
              //   </div>
              // </div>
              <div
              key={item._id}
              className="bg-white border border-[#F0F2F5] rounded-lg p-4 transition relative cursor-pointer"
              onClick={() => {
                router.push(`/dashboard/landlord/properties/room/${item._id}`)
              }}
            >
              <div className="flex w-full justify-between">
                <div>
                  <img
                    src={item.file}
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
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-md text-[#101928] w-4/5 h-14">
                  {item.streetAddress}
                </p>
                <p className="text-xs text-gray-400">
                  Added on {item.createdAt}
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
