"use client";
interface OnboardingCardProps {
  imageLink: string;
  title: string;
  number: any;
  isMetric: boolean;
}

const TenantDashboardNavigationCard: React.FC<OnboardingCardProps> = ({
  imageLink,
  title,
  number,
  isMetric,
}) => {
  return (
    <div className="w-full md:h-44 h-36 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer relative overflow-hidden  flex flex-col justify-end p-4">
    <div className="flex flex-col">
      <img src={imageLink} className="w-8 h-8" alt={title} />
      <p className=" text-nrvGreyBlack md:text-lg text-xs mt-4">
        {title}
      </p>
      {isMetric ? (
        <p className="font-semibold text-nrvGreyBlack md:text-md text-sm">{number}</p>
      ) : null}
    </div>
  </div>
  
  );
};

export default TenantDashboardNavigationCard;
