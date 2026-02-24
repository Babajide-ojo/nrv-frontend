"use client";

import { useState, useEffect } from "react";
import { FaMessage } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome, IoMdMore } from "react-icons/io";
import { IoBackspace, IoPeopleOutline, IoSettings } from "react-icons/io5";
import { useRouter } from "next/navigation";
import TenantSideBar from "../shared/navigations/TenantSideBar";
import { FaBuilding } from "react-icons/fa";
import { PiFileDocDuotone } from "react-icons/pi";
import { FiTool, FiCheckCircle } from "react-icons/fi";

interface TenantLayoutProps {
  children: React.ReactNode;
  path?: string;
  mainPath?: string;
  subMainPath?: string;
}

const TenantLayout: React.FC<TenantLayoutProps> = ({ children, path, mainPath, subMainPath }) => {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  // Function to toggle more options (similar to Landlord layout)
  const handleToggle = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="fixed bottom-0 left-0 w-full bg-nrvPrimaryGreen shadow-md lg:hidden z-50">
        <div className="flex gap-4 space-between p-2">
          {!showMore ? (
            <>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant")}
              >
                <RxDashboard size={24} color="white" />
                <span className="text-xs text-white">Home</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/properties")}
              >
                <FaBuilding size={24} color="white" />
                <span className="text-xs text-white">Properties</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() =>
                  router.push("/dashboard/tenant/rented-properties")
                }
              >
                <IoMdHome size={24} color="white" />
                <span className="text-xs text-white">Apartments</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={handleToggle}
              >
                <IoMdMore size={24} color="white" />
                <span className="text-xs text-white">More</span>
              </button>
            </>
          ) : (
            <div className="grid grid-cols-4 gap-2 w-full">
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={handleToggle}
              >
                <IoBackspace size={24} color="white" />
                <span className="text-[10px] text-white">Go Back</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/properties/applications")}
              >
                <PiFileDocDuotone size={24} color="white" />
                <span className="text-[10px] text-white">Applications</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/properties/maintenance")}
              >
                <FiTool size={24} color="white" />
                <span className="text-[10px] text-white">Maintenance</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/verification/requests")}
              >
                <FiCheckCircle size={24} color="white" />
                <span className="text-[10px] text-white">Verifications</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/verification")}
              >
                <FiCheckCircle size={24} color="white" />
                <span className="text-[10px] text-white">Submissions</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/messages")}
              >
                <FaMessage size={24} color="white" />
                <span className="text-[10px] text-white">Messages</span>
              </button>
              <button
                className="py-3 w-full flex flex-col items-center"
                onClick={() => router.push("/dashboard/tenant/settings")}
              >
                <IoSettings size={24} color="white" />
                <span className="text-[10px] text-white">Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full h-screen overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0 h-full bg-nrvPrimaryGreen">
          <TenantSideBar isOpen={true} />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto w-full relative">
          {/* Header */}
          <div className="p-4 bg-white shadow-sm sticky top-0 z-30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Breadcrumbs */}
              <nav className="text-gray-500 text-sm flex flex-wrap items-center">
                <svg
                  width="25"
                  height="21"
                  viewBox="0 0 25 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0298 4.09045C11.1116 3.44772 9.88947 3.44771 8.97129 4.09045L4.38624 7.29998C3.61382 7.84067 3.18434 8.74905 3.25666 9.68913L3.72667 15.7993C3.81531 16.9517 4.85945 17.7892 6.00362 17.6258L8.1167 17.3239C9.10199 17.1832 9.83385 16.3393 9.83385 15.344V14.5004C9.83385 14.1322 10.1323 13.8338 10.5005 13.8338C10.8687 13.8338 11.1672 14.1322 11.1672 14.5004V15.344C11.1672 16.3393 11.899 17.1832 12.8843 17.3239L14.9974 17.6258C16.1416 17.7892 17.1857 16.9517 17.2744 15.7993L17.7444 9.68913C17.8167 8.74905 17.3872 7.84067 16.6148 7.29998L12.0298 4.09045ZM9.7359 5.18276C10.195 4.86139 10.806 4.86139 11.2651 5.18276L15.8502 8.39229C16.2364 8.66264 16.4511 9.11683 16.415 9.58686L15.945 15.697C15.9154 16.0812 15.5674 16.3603 15.186 16.3059L13.0729 16.004C12.7445 15.9571 12.5005 15.6758 12.5005 15.344V14.5004C12.5005 13.3959 11.6051 12.5004 10.5005 12.5004C9.39595 12.5004 8.50052 13.3959 8.50052 14.5004V15.344C8.50052 15.6758 8.25657 15.9571 7.92813 16.004L5.81506 16.3059C5.43367 16.3603 5.08562 16.0812 5.05607 15.697L4.58606 9.58686C4.5499 9.11683 4.76465 8.66264 5.15085 8.39229L9.7359 5.18276Z"
                    fill="#667185"
                  />
                </svg>

                <span className="mx-2 hidden sm:inline">&gt;</span>
                {path && <span className="text-sm text-[#333333]">{path}</span>}
                {subMainPath && (
                  <span className="mx-2 hidden sm:inline">/</span>
                )}
                <a
                  href="#"
                  className="text-sm hover:text-gray-900 text-[#333333]"
                >
                  {mainPath}
                </a>
                {subMainPath && (
                  <>
                    <span className="mx-2 hidden sm:inline">/</span>
                    <span className="text-sm text-[#333333]">
                      {subMainPath}
                    </span>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content Body */}
          <main className="bg-white w-full p-4 pb-24 lg:pb-4 min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TenantLayout;
