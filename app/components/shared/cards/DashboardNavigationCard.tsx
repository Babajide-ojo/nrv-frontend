"use client";

import { BsExclamationCircle } from "react-icons/bs";
import { useState } from "react";

interface OnboardingCardProps {
  imageLink: string;
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
    <div className="w-28 md:w-40 md:h-28 h-28 bg-white border border-nrvLightGray rounded-2xl m-1 p-2 cursor-pointer relative overflow-hidden">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <img src={imageLink} className="w-8 h-8" alt={title} />
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
