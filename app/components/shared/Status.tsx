interface statusProps {
  status: string;
}

const Status = ({ status }: statusProps) => {
  let classNames = "px-4 py-1 text-[12px] capitalize rounded-full w-fit ";
  let displayStatus = status;

  switch (status?.toLocaleLowerCase()) {
    case "new":
      classNames += "bg-green-200 text-green-800 text-center";
      break;
    case "activetenant":
      classNames += "bg-[#F9F5FF] text-[#6941C6] text-center";
      displayStatus = "Active Tenant";
      break;
    case "declined":
      classNames += "bg-[#FDF2FA] text-[#C11574] text-center";
      break;
    case "approved":
      classNames += "bg-[#2B892B] text-[#E9F4E7] text-center";
      break;
    default:
      classNames += "bg-gray-400 text-white text-center";
      break;
  }
  return <div className={classNames}>{displayStatus}</div>;
};

export default Status;
