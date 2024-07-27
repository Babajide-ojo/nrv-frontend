"use client";

import { useState, useEffect } from "react";
import LandlordSideBar from "../shared/navigations/LandLordSideBar";
import { FaMessage } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { IoPeopleOutline } from "react-icons/io5";
import {useRouter} from "next/navigation";
import TenantSideBar from '../shared/navigations/TenantSideBar';

interface TenantLayoutProps {
  children: React.ReactNode;
}

const TenantLayout: React.FC<TenantLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on component mount for mobile screens and on screen resize
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSidebarOpen(screenWidth > 1110); // Show sidebar if screen width > 768px
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen  bg-nrvLightGreyBg">
      <div className="fixed bottom-0 left-0 w-full bg-nrvDarkBlue shadow-md 2xl:hidden xl:hidden lg:hidden z-50">
        <div className="flex gap-4 space-between p-2">
          <button className="py-3 w-full flex flex-col items-center" onClick={() => {
            router.push("/dashboard/tenant")
          }}>
            <RxDashboard size={24} color="white" />
            <span className="text-xs text-white">Home</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center" onClick={() => {
            router.push("/dashboard/tenant/properties")
          }}>
            <IoMdHome size={24} color="white" />
            <span className="text-xs text-white">Properties</span>
          </button>

          <button className="py-3 w-full flex flex-col items-center" onClick={() => {
            router.push("/dashboard/tenant/rented-properties")
          }}>
            <IoPeopleOutline size={24} color="white" />
            <span className="text-xs text-white">Apartments</span>
          </button>
          <button className="py-3 w-full flex flex-col items-center">
            <FaMessage size={24} color="white" />
            <span className="text-xs text-white">Messages</span>
          </button>
    
          <button className="py-3 w-full flex flex-col items-center">
            <RxDashboard size={24} color="white" />
            <span className="text-xs text-white">Settings</span>
          </button>
        </div>
      </div>
      <div className="flex w-full min-h-screen bg-nrvLightGreyBg" style={{ paddingBottom: "40px" }}>
        <div className={isSidebarOpen ? "w-1/5 bg-white" : "hidden md:block w-1/10"}>
          <TenantSideBar isOpen={isSidebarOpen} />
        </div>
        <div className={isSidebarOpen ? "w-9/10  flex-1 overflow-y-auto flex" : "w-full flex-1 overflow-y-auto"}>
          <main className="bg-nrvLightGreyBg w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default TenantLayout;
