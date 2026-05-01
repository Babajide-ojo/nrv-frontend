"use client";
import { useRouter } from "next/navigation";

interface OnboardingCardProps {
  imageLink: any;
  title: string;
  number: any;
  isMetric: boolean;
  link?: string;
}

const TenantDashboardNavigationCard: React.FC<OnboardingCardProps> = ({
  imageLink,
  title,
  number,
  isMetric,
  link,
}) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <div
      className="w-full md:h-32 h-32 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer relative overflow-hidden flex flex-col justify-center p-4"
      onClick={handleClick}
    >
      <div className="flex flex-col">
       <div>{imageLink}</div>
        <p className="text-nrvGreyBlack md:text-md text-xs mt-4">{title}</p>
        {isMetric ? (
          <p className="font-semibold text-nrvGreyBlack md:text-md text-sm">
            {number}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default TenantDashboardNavigationCard;
