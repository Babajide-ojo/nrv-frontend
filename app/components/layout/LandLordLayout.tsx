"use client";

import { useState, useEffect } from "react";
import LandLordSideBar from "../shared/navigations/LandLordSideBar";
import { FaMessage } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome, IoMdMore } from "react-icons/io";
import { IoBackspace, IoPeopleCircleOutline, IoPeopleOutline, IoSettings } from "react-icons/io5";
import {useRouter} from "next/navigation";
import { FaCheck } from "react-icons/fa";

interface LandLordLayoutProps {
  children: React.ReactNode;
}

const LandLordLayout: React.FC<LandLordLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore(prev => !prev);
  };

 

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSidebarOpen(screenWidth > 1110); 
    };

   
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed bottom-0 left-0 w-full bg-nrvPrimaryGreen shadow-md 2xl:hidden xl:hidden lg:hidden z-50">
      <div className="flex gap-4 space-between p-2">
      {/* Conditionally render buttons based on showMore state */}
      {!showMore ? (
        <>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord")}>
            <RxDashboard size={24} color="white" />
            <span className="text-[11px] text-white">Dashboard</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/properties")}>
            <IoMdHome size={24} color="white" />
            <span className="text-[11px] text-white">Properties</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/properties/renters")}>
            <IoPeopleCircleOutline size={24} color="white" />
            <span className="text-[11px] text-white">Renters</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/messages")}>
            <IoPeopleCircleOutline size={24} color="white" />
            <span className="text-[11px] text-white">Messages</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={handleToggle}>
            <IoMdMore size={24} color="white" />
            <span className="text-[11px] text-white">More</span>
          </button>
        </>
      ) : (
        <>
          <button className="py-3 w-full flex flex-col items-center" onClick={handleToggle}>
            <IoBackspace size={24} color="white" />
            <span className="text-[11px] text-white">Go Back</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/properties/maintenance")}>
            <IoSettings size={24} color="white" />
            <span className="text-[11px] text-white">Maintenance</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/properties/verification")}>
            <FaCheck size={24} color="white" />
            <span className="text-[11px] text-white">Verification</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => router.push("/dashboard/landlord/settings")}>
            <IoSettings size={24} color="white" />
            <span className="text-[11px] text-white">Settings</span>
          </button>
        </>
      )}
    </div>
      </div>
      <div className="flex w-full min-h-screen bg-nrvLightGreyBg" style={{ paddingBottom: "40px" }}>
        <div className={isSidebarOpen ? "w-1/5 bg-white" : "hidden md:block w-1/10"}>
          <LandLordSideBar isOpen={isSidebarOpen} />
        </div>
        <div className={isSidebarOpen ? "w-9/10  flex-1 overflow-y-auto flex" : "w-full flex-1 overflow-y-auto"}>
          <main className="bg-nrvLightGreyBg w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LandLordLayout;
