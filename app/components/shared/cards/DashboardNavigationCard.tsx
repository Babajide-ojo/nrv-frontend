"use client";
interface OnboardingCardProps {
  imageLink: any;
  title: string;
  number: number;
  isMetric: boolean;
}

const DashboardNavigationCard: React.FC<OnboardingCardProps> = ({
  imageLink,
  title,
  number,
  isMetric,
}) => {
  return (
    <div className="w-full md:h-32 h-32 bg-white border border-nrvLightGray rounded-2xl p-2 cursor-pointer relative overflow-hidden flex items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <div>{imageLink}</div>
      <p className="font-medium text-nrvGreyBlack text-xs mt-1.5">
        {title}
      </p>
      {isMetric && (
        <p className="font-semibold text-nrvGreyBlack text-xs">{number}</p>
      )}
    </div>
  </div>
  
  );
};

export default DashboardNavigationCard;
