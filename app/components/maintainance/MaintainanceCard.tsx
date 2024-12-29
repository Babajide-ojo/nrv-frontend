"use client";

import Image from "next/image";
import { formatDate } from "../../../helpers/utils";
import Button from "../shared/buttons/Button";
import { useRouter } from "next/navigation";

interface MaintenanceCardProps {
  title: string;
  description: number;
  dateLogged: string;
  status: any;
  id: string;
  type: string;
  propertyId?: string;
  name?: string;
}

const MaintainanceCard: React.FC<MaintenanceCardProps> = ({
  title,
  description,
  dateLogged,
  status,
  type,
  id,
  propertyId,
  name,
}) => {
  const router = useRouter();
  return (
    <div className="md:w-4/5 w-full rounded-lg border border-nrvGreyMediumBg bg-white p-5 mb-8 h-50">
      <div className="flex gap-3 items-center">
        <div className="w-full flex gap-4 justify-between space-between">
          <div className="flex justify-between space-around">
            <div className="text-sm font-medium text-nrvDarkBlue">
              {name} (Property ID - {propertyId})
            </div>
          </div>
          <div>
            <Button
              className={`w-full text-md ${
                status === "Resolved" 
                  ? "font-medium border border-[#107E4B] hover:bg-[#107E4B] hover:text-white text-green-500 bg-white"
                  : status === "New"
                  ? "font-medium border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 bg-white"
                  : status === "Acknowleged"
                  ? "font-medium border border-yellow-500 hover:bg-yellow-500 hover:text-white text-yellow-500 bg-white"
                  : status === "Declined"
                  ? "font-medium border border-red-500 hover:bg-red-500 hover:text-white text-red-500 bg-white"
                  : "font-medium border border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 bg-white" // Default case
              }`}
              variant="ordinary"
              size="small"
              showIcon={false}
            >
              {status}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 font-medium text-sm truncate mt-4">{title}</div>
        <div className="mb-2 font-light text-sm truncate mt-2">
          {description}
        </div>
        <div className="flex justify-between">
          <div className="text-sm font-normal text-nrvLightGrey text-end">
            {formatDate(dateLogged.slice(0, 10))}
          </div>
        </div>
        <div className="flex gap-4 w-full justify-center items-center mt-4">
          <Button
            size="small"
            className="px-5 text-xs"
            variant="whitebg"
            showIcon={false}
            onClick={() => {
              if (type === "tenant") {
                router.push(
                  `/dashboard/tenant/rented-properties/maintenance/single/${id}`
                );
              }

              if (type === "landlord") {
                router.push(
                  `/dashboard/landlord/properties/maintenance/single/${id}`
                );
              }
            }}
          >
            Open Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaintainanceCard;
