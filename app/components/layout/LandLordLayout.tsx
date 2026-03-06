"use client";

import { useState, useEffect } from "react";
import LandLordSideBar from "../shared/navigations/LandLordSideBar";
import { FaMessage, FaPerson } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome, IoMdMore } from "react-icons/io";
import { IoBackspace, IoPeopleCircleOutline, IoSettings } from "react-icons/io5";
import { FiUsers, FiFileText, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { LANDLORD_NAV_ITEMS } from "@/app/config/landlordNav";

function getMobileNavIcon(name: string, size: number) {
  const s = size;
  switch (name) {
    case "Dashboard": return <RxDashboard size={s} color="white" />;
    case "Properties": return <IoMdHome size={s} color="white" />;
    case "Leads & Applications": return <IoPeopleCircleOutline size={s} color="white" />;
    case "Tenants": return <FiUsers size={s} color="white" />;
    case "Tenant Verification": return <FiCheck size={s} color="white" />;
    case "Maintenance": return <IoSettings size={s} color="white" />;
    case "Messages": return <FaMessage size={s} color="white" />;
    case "Buy verification credit": return <FiFileText size={s} color="white" />;
    default: return <FiFileText size={s} color="white" />;
  }
}

interface LandLordLayoutProps {
  children: React.ReactNode;
  mainPath?: string;
  path?: string;
  subMainPath?: string;
  comingSoon?: boolean;
}

const LandLordLayout: React.FC<LandLordLayoutProps> = ({
  children,
  mainPath,
  path,
  subMainPath,
  comingSoon = false,
}) => {
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

  return (
    <div className="relative min-h-screen !overflow-hidden flex flex-col">
      {/* Mobile Bottom Nav – same items as desktop sidebar; spaced so links don’t look cramped */}
      <div className="fixed bottom-0 left-0 w-full bg-nrvPrimaryGreen shadow-lg lg:hidden z-50 safe-area-pb">
        <div className="flex items-stretch justify-around px-1 py-3 gap-0 max-w-full">
          {!showMore ? (
            <>
              {LANDLORD_NAV_ITEMS.slice(0, 4).map((item, index) => (
                <button
                  key={item.route}
                  className="flex flex-col items-center justify-center flex-1 min-w-0 py-1 px-2 rounded-lg active:bg-white/10 transition-colors"
                  style={{ borderRight: index < 4 ? "1px solid rgba(255,255,255,0.25)" : "none" }}
                  onClick={() => router.push(item.route)}
                >
                  {getMobileNavIcon(item.name, 24)}
                  <span className="text-[10px] sm:text-[11px] text-white truncate w-full text-center mt-1 px-0.5">{item.name === "Leads & Applications" ? "Leads" : item.name}</span>
                </button>
              ))}
              <button
                className="flex flex-col items-center justify-center flex-1 min-w-[56px] py-1 px-2 rounded-lg active:bg-white/10 transition-colors border-l border-white/20"
                onClick={handleToggle}
              >
                <IoMdMore size={24} color="white" />
                <span className="text-[10px] sm:text-[11px] text-white mt-1">More</span>
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-stretch justify-around w-full gap-2 px-2">
              <button
                className="flex flex-col items-center justify-center py-2 px-3 rounded-lg active:bg-white/10 transition-colors min-w-[64px] border border-white/20"
                onClick={handleToggle}
              >
                <IoBackspace size={22} color="white" />
                <span className="text-[9px] sm:text-[10px] text-white mt-1">Back</span>
              </button>
              {LANDLORD_NAV_ITEMS.slice(4).map((item) => (
                <button
                  key={item.route}
                  className="flex flex-col items-center justify-center py-2 px-3 rounded-lg active:bg-white/10 transition-colors flex-1 min-w-[72px] border border-white/20"
                  onClick={() => {
                    handleToggle();
                    router.push(item.route);
                  }}
                >
                  {getMobileNavIcon(item.name, 22)}
                  <span className="text-[9px] sm:text-[10px] text-white truncate w-full text-center mt-1">{item.name === "Tenant Verification" ? "Verification" : item.name === "Buy verification credit" ? "Credits" : item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Layout Content */}
      <div className="flex w-full h-screen bg-white overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0 h-full bg-nrvPrimaryGreen">
          <LandLordSideBar isOpen={true} />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto w-full relative">
          {/* Header – responsive padding */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm sticky top-0 z-30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              {/* Breadcrumbs */}
              <nav className="text-gray-500 text-sm flex flex-wrap items-center gap-x-1 gap-y-1">
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

                <span className="mx-1 text-gray-400">&gt;</span>
                {path && <span className="text-sm text-[#333333]">{path}</span>}
                {subMainPath && <span className="mx-1 text-gray-400">/</span>}
                <a
                  href="#"
                  className="text-sm hover:text-gray-900 text-[#333333]"
                >
                  {mainPath}
                </a>
                {subMainPath && (
                  <>
                    <span className="mx-1 text-gray-400">/</span>
                    <span className="text-sm text-[#333333]">
                      {subMainPath}
                    </span>
                  </>
                )}
              </nav>

              {/* User Info */}
              <div className="flex items-center justify-between md:justify-end space-x-4">
                <div className="flex items-center space-x-2">
                  <FaPerson />
                  <span className="text-gray-700 text-sm">{user?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Body – consistent padding, extra bottom on mobile for nav */}
          <main className="bg-white w-full px-4 sm:px-6 py-4 pb-24 lg:pb-6 min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LandLordLayout;
