interface statusProps {
  status: string;
}

const Status = ({ status }: statusProps) => {
  let classNames = "px-4 py-1 text-[12px] capitalize rounded-full w-fit ";
  let displayStatus = status;

  switch (status?.toLowerCase()) {
    case "new":
      classNames += "bg-green-200 text-green-800 text-center";
      break;
    case "accepted":
      classNames += "bg-blue-100 text-blue-800 text-center";
      break;
    case "rejected":
    case "declined":
      classNames += "bg-[#FDF2FA] text-[#C11574] text-center";
      break;
    case "withdrawn":
      classNames += "bg-gray-200 text-gray-700 text-center";
      displayStatus = "Withdrawn";
      break;
    case "activetenant":
    case "active_lease":
      classNames += "bg-[#F9F5FF] text-[#6941C6] text-center";
      displayStatus = "Active Lease";
      break;
    case "approved":
      classNames += "bg-[#2B892B] text-[#E9F4E7] text-center";
      break;
    case "ended":
    case "expired":
      classNames += "bg-amber-100 text-amber-900 text-center";
      break;
    default:
      classNames += "bg-gray-400 text-white text-center";
      break;
  }
  return <div className={classNames}>{displayStatus}</div>;
};

export default Status;
