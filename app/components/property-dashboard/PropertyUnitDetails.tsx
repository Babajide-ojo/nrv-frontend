"use client";
import { dashboardMetrics } from "../../../helpers/data";
import { BsPlus, BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useRouter } from "next/navigation";

interface Data {
  data: any;
}

const PropertyUnitDetails: React.FC<Data> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="pb-12 md:pb-0 md:flex block gap-4">

      <div className="max-w-full md:w-1/2 w-full rounded rounded-2xl p-4">
        <div className="flex justify-between border-b border-b-1 mb-4">
          <div className="font-semibold text-nrvDarkBlue">
            Apartment Details
          </div>
        </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
             Name:
          </h2>
          <div className="text-md text-nrvGreyBlack">{data.name}</div>
        </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
            Description:
          </h2>
          <div className="text-sm text-nrvGreyBlack font-light">{data.description}</div>
        </div>
        <div className="mt-6">
        <h2 className="text-md font-medium text-nrvGreyBlack">Property Specifics</h2>
        <div className="flex gap-5 mt-4">
          <Button
            size="small"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {data.noOfRooms} Bedrooms
          </Button>
          <Button
            size="small"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {data.noOfPools} Pools
          </Button>
          <Button
            size="small"
            className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
            variant="ordinary"
            showIcon={false}
          >
            {data.noOfBaths} Baths
          </Button>
          
        </div>
    </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
            Rent Amount:
          </h2>
          <div className="text-md text-nrvGreyBlack">₦ {data.rentAmount}/{data.rentAmountMetrics}</div>
        </div>
        <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
         Target Deposit
          </h2>
          <div className="text-md text-nrvGreyBlack">₦ {data.targetDeposit}/{data.rentAmountMetrics}</div>
        </div>

    <div className="mt-6">
          <h2 className="mb-2 text-nrvGreyBlack font-medium text-md">
        Other Amenities
          </h2>
          <div className="text-md text-nrvGreyBlack">{data.otherAmentities}</div>
        </div>
      </div>
      <div className="pb-4 pt-4 md:w-1/2 w-full h-80">
        <img
          src={data?.file}
          alt="photo"
          className="h-80 w-full rounded rounded-lg"
        />
      </div>
    </div>
  );
};
export default PropertyUnitDetails;
