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
    <div className="w-full md:w-full md:h-32 h-32 bg-white border border-nrvLightGray rounded-2xl p-2 cursor-pointer relative overflow-hidden">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <div>{imageLink}</div>
          <p className="font-semibold text-nrvGreyBlack text-xs mt-4 text-center">
            {title}
          </p>
          {isMetric ? (
            <p className="font-semibold text-nrvGreyBlack text-md">{number}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigationCard;
