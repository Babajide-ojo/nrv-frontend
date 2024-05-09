"use client";

import React, { useEffect, useState } from "react";
import logo from "./../../../public/images/property-success.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingPage from "./LoadingPage";

const PropertySuccess = () => {
  const router = useRouter();
  const [showContent, setShowContent] = useState<
    "propertyListed" | "otherContent"
  >("propertyListed");

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setShowContent("otherContent");
    }, 3000);

    const secondTimer = setTimeout(() => {
      router.push("/dashboard/properties");
    }, 6000);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="">
        {showContent === "otherContent" && (
          <>
            <Image src={logo} alt="Logo" width={100} height={100} />
            <p className="mt-2 ">Property Listed 🎉</p>
          </>
        )}
        {showContent === "propertyListed" && <LoadingPage />}
      </div>
    </div>
  );
};

export default PropertySuccess;
