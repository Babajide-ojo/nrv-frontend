"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/helpers/utils";

interface Data {
  data: any;
}

const PropertyUnitDetails: React.FC<Data> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="pb-12 md:pb-0 md:flex block gap-4">

      <div className="max-w-full md:w-1/2 w-full rounded rounded-2xl p-4">
        <div className="flex justify-between border-b border-b-1 mb-4">
          <div className="font-semibold text-nrvPrimaryGreen ">
            Apartment Details
          </div>
        </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-sm">
             Property Type :<span className="text-nrvPrimaryGreen"> {data.propertyType}</span>
          </h2>

        </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-sm">
            Description
          </h2>
          <div className="text-[14px] leading-8 text-nrvGreyBlack font-light">{data.description}</div>
        </div>
        <div className="mt-6">
        <h2 className="text-sm font-medium text-nrvGreyBlack">Property Specifics</h2>
        <div className="flex gap-5 mt-4">
          <Button
            size="smaller"
            className="rounded-md rounded bg-nrvPrimaryGreen"
            variant="light"
            showIcon={false}
          >
            {data.noOfRooms} Bedrooms
          </Button>
          <Button
            size="smaller"
            className="rounded-md rounded bg-nrvPrimaryGreen"
            variant="light"
            showIcon={false}
          >
            {data.noOfPools} Pools
          </Button>
          <Button
            size="smaller"
            className="rounded-md rounded bg-nrvPrimaryGreen"
            variant="light"
            showIcon={false}
          >
            {data.noOfBaths} Baths
          </Button>
          
        </div>
    </div>
    <div className="flex gap-8">
    <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-sm">
            Rent Amount
          </h2>
          <div className="text-sm text-nrvGreyBlack">₦ {formatNumber(data.rentAmount) }/{data.rentAmountMetrics}</div>
        </div>
        {/* <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-sm">
         Target Deposit
          </h2>
          <div className="text-xs text-nrvGreyBlack">₦ { formatNumber(data.targetDeposit)}/{data.rentAmountMetrics}</div>
        </div> */}
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-sm">
        Other Amenities
          </h2>
          <div className="text-sm text-nrvGreyBlack">{data.otherAmentities}</div>
        </div>
    </div>

 
      </div>
      <div className="pb-4 pt-4 md:w-1/2 w-full h-80">
        <img
          src={data?.file}
          alt="photo"
          className="h-100 w-full rounded rounded-lg"
        />
      </div>
    </div>
  );
};
export default PropertyUnitDetails;
