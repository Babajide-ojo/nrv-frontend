"use client";

import Button from "@/components/shared/buttons/Button";
import InputField from "@/components/shared/input-fields/InputFields";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { carouselData } from "@/helpers/data";

const Carousel = () => {
  const [currentItem, setCurrentItem] = useState(0);

  const handleNext = () => {
    if (currentItem < carouselData.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      setCurrentItem(0);
    }
  };

  const handleSkip = () => {};
  return (
    <div className="w-full md:w-1/2 lg:w-1/2 py-8 px-12 hidden md:block lg:block">
      <div className="w-full bg-nrvDarkBlue h-full rounded-2xl p-4">
        <div style={{ width: "100%", height: "80%", position: "relative" }}>
          <img
            src={carouselData[currentItem].image}
            alt="photo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <div className="flex justify-center text-white text-lg pt-4 text-center">
          {carouselData[currentItem].text}
        </div>
        <div className="flex gap-10 justify-between">
          <Button
            onClick={handleSkip}
            size="normal"
            variant="lightPrimary"
            showIcon={false}
          >
            {currentItem === carouselData.length - 1 ? "Get Started" : "Skip"}
          </Button>
          <Button
            onClick={handleNext}
            size="normal"
            variant="light"
            showIcon={false}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
