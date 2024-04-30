"use client"

import { BsExclamationCircle } from "react-icons/bs";
import { useState } from "react";

interface OnboardingCardProps {
  imageLink: string;
  title: string;
  description: string;
  onReceiveData: (data: any) => void;
}




const OnboardingCard: React.FC<OnboardingCardProps>  = ({ imageLink, title, description ,onReceiveData }) => {

    const sendDataToParent = (data: any) => {
    
        onReceiveData(data);
      };
    
  return (
    <div 
      className="w-32 h-28 bg-white border border-nrvLightGray rounded-2xl m-4 p-2 cursor-pointer relative overflow-hidden"
      onClick={() => {
        sendDataToParent({imageLink, title, description})
      }}
    >
      <div className="mb-2 flex justify-end">
        <BsExclamationCircle />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <img src={imageLink} className="w-8 h-8" alt={title} />
          <p className="font-semibold text-nrvGreyBlack text-xs mt-4">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;

