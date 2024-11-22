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
              className={`w-full  text-md ${
                status === "Resolved"
                  ? "bg-[#107E4B] text-white"
                  : "bg-nrvDarkBlue text-white"
              }`}
              variant="ordinary"
              size="large"
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
            size="large"
            className="px-5"
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
