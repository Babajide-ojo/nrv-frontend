"use client";

import { useState, useEffect } from "react";
import LandLordSideBar from "../shared/navigations/LandLordSideBar";
import { FaMessage, FaPerson } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome, IoMdMore } from "react-icons/io";
import {
  IoBackspace,
  IoPeopleCircleOutline,
  IoPeopleOutline,
  IoSettings,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaBell, FaCheck, FaCog } from "react-icons/fa";
import Image from "next/image";

interface LandLordLayoutProps {
  children: React.ReactNode;
  mainPath?: string;
  subMainPath?: string;
}

const LandLordLayout: React.FC<LandLordLayoutProps> = ({
  children,
  mainPath,
  subMainPath,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeLink, setActiveLink] = useState<string>("");
  const router = useRouter();

  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    setActiveLink(window.location.pathname);
    const storedUser = localStorage.getItem("nrv-user");
    if (storedUser) {
      const userInfo = JSON.parse(storedUser);
      setUser({
        name:
          `${userInfo?.user?.firstName} ${userInfo?.user?.lastName}` || "User",
        role: userInfo?.user?.accountType || "Property Owner",
      });
    }
  }, []);

  const handleToggle = () => {
    setShowMore((prev) => !prev);
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
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md 2xl:hidden xl:hidden lg:hidden z-50">
        <div className="flex gap-4 space-between p-2">
          {/* Conditionally render buttons based on showMore state */}
          {!showMore ? (
            <>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/landlord")}
              >
                <RxDashboard size={24} color="white" />
                <span className="text-[11px] text-white">Dashboard</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/landlord/properties")}
              >
                <IoMdHome size={24} color="white" />
                <span className="text-[11px] text-white">Properties</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() =>
                  router.push("/dashboard/landlord/properties/renters")
                }
              >
                <IoPeopleCircleOutline size={24} color="white" />
                <span className="text-[11px] text-white">Renters</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/landlord/messages")}
              >
                <IoPeopleCircleOutline size={24} color="white" />
                <span className="text-[11px] text-white">Messages</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={handleToggle}
              >
                <IoMdMore size={24} color="white" />
                <span className="text-[11px] text-white">More</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={handleToggle}
              >
                <IoBackspace size={24} color="white" />
                <span className="text-[11px] text-white">Go Back</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() =>
                  router.push("/dashboard/landlord/properties/maintenance")
                }
              >
                <IoSettings size={24} color="white" />
                <span className="text-[11px] text-white">Maintenance</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() =>
                  router.push("/dashboard/landlord/properties/verification")
                }
              >
                <FaCheck size={24} color="white" />
                <span className="text-[11px] text-white">Verification</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/landlord/settings")}
              >
                <IoSettings size={24} color="white" />
                <span className="text-[11px] text-white">Settings</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className="flex w-full min-h-screen bg-white"
        style={{ paddingBottom: "40px" }}
      >
        <div className={isSidebarOpen ? "w-1/5" : "hidden md:block w-1/10"}>
          <LandLordSideBar isOpen={isSidebarOpen} />
        </div>
        <div
          className={
            isSidebarOpen
              ? "w-9/10  flex-1 overflow-y-auto"
              : "w-full flex-1 overflow-y-auto"
          }
        >
          <div className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Breadcrumbs */}
            <nav className="text-gray-500 text-sm flex items-center">
              <svg
                width="25"
                height="21"
                viewBox="0 0 25 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0298 4.09045C11.1116 3.44772 9.88947 3.44771 8.97129 4.09045L4.38624 7.29998C3.61382 7.84067 3.18434 8.74905 3.25666 9.68913L3.72667 15.7993C3.81531 16.9517 4.85945 17.7892 6.00362 17.6258L8.1167 17.3239C9.10199 17.1832 9.83385 16.3393 9.83385 15.344V14.5004C9.83385 14.1322 10.1323 13.8338 10.5005 13.8338C10.8687 13.8338 11.1672 14.1322 11.1672 14.5004V15.344C11.1672 16.3393 11.899 17.1832 12.8843 17.3239L14.9974 17.6258C16.1416 17.7892 17.1857 16.9517 17.2744 15.7993L17.7444 9.68913C17.8167 8.74905 17.3872 7.84067 16.6148 7.29998L12.0298 4.09045ZM9.7359 5.18276C10.195 4.86139 10.806 4.86139 11.2651 5.18276L15.8502 8.39229C16.2364 8.66264 16.4511 9.11683 16.415 9.58686L15.945 15.697C15.9154 16.0812 15.5674 16.3603 15.186 16.3059L13.0729 16.004C12.7445 15.9571 12.5005 15.6758 12.5005 15.344V14.5004C12.5005 13.3959 11.6051 12.5004 10.5005 12.5004C9.39595 12.5004 8.50052 13.3959 8.50052 14.5004V15.344C8.50052 15.6758 8.25657 15.9571 7.92813 16.004L5.81506 16.3059C5.43367 16.3603 5.08562 16.0812 5.05607 15.697L4.58606 9.58686C4.5499 9.11683 4.76465 8.66264 5.15085 8.39229L9.7359 5.18276Z"
                  fill="#667185"
                />
              </svg>

              <span className="mx-2">&gt;</span>
              <a href="/properties" className="hover:text-gray-900">
                {mainPath}
              </a>
             {subMainPath &&  <span className="mx-2">/</span>}
              <span className="text-gray-900">{subMainPath}</span>
            </nav>

            {/* Right Side Icons & User */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-gray-700 text-xs font-bold">NGN</span>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
              </div>

              <button className="text-gray-500 hover:text-gray-900">
                <FaCog size={18} />
              </button>
              <button className="text-gray-500 hover:text-gray-900">
                <FaBell size={18} />
              </button>

              <div className="flex items-center space-x-2">
                <FaPerson />
                <span className="text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
          <main className="bg-white w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default LandLordLayout;
