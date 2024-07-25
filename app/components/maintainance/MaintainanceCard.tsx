import Image from "next/image";
import { formatDate } from "../../../helpers/utils";
import Button from "../shared/buttons/Button";

interface MaintenanceCardProps {
  title: string;
  description: number;
  dateLogged: string;
  status: any;
}
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const MaintainanceCard: React.FC<MaintenanceCardProps> = ({
  title,
  description,
  dateLogged,
  status,
}) => {
  return (
    <div className="max-w-sm w-full rounded-lg border border-nrvGreyMediumBg bg-white p-5 mb-8 h-50">
      <div className="flex gap-3 items-center">
        <div className="w-full flex gap-4 justify-between space-between">
          <div className="flex justify-between space-around text-nrvLightGrey">
            <div className="text-md text-nrvDarkBlue">{title}</div>
          </div>
          <button className="text-sm font-medium rounded-md py-1 px-6 bg-nrvLightGreyBg h-8">
            {status}
          </button>
        </div>
      </div>

      <div>
        {/* <div className="mb-1 mt-4 text-sm font-medium">Description:</div> */}
        <div className="mb-4 font-light text-sm truncate">{description}</div>
        <div className="text-[11px] font-light text-nrvLightGrey">
          {formatDate(dateLogged.slice(0, 10))}
        </div>
        <div className="flex gap-4 w-full justify-center items-center mt-2">
          <Button
            size="small"
            className="px-5"
            variant="whitebg"
            showIcon={false}
            onClick={() => {
              // router.push('/dashboard/tenant/properties')
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            className="px-5"
            variant="whitebg"
            showIcon={false}
            onClick={() => {
              // router.push('/dashboard/tenant/properties')
            }}
          >
            Open
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaintainanceCard;
