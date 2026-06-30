"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import {
  FiHome,
  FiClipboard,
  FiTool,
  FiMessageSquare,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { PiFileDocDuotone } from "react-icons/pi";
import { clearAllStoredData } from "@/helpers/utils";

interface User {
  name: string;
  role: string;
}

interface TenantSideBarProps {
  isOpen: boolean;
}

const links = [
  {
    name: "Dashboard",
    route: "/dashboard/tenant",
    icon: <FiClipboard />,
  },
  {
    name: "Properties",
    route: "/dashboard/tenant/properties",
    icon: <FiHome />,
  },
  {
    name: "Applications",
    route: "/dashboard/tenant/properties/applications",
    icon: <PiFileDocDuotone />,
  },
  {
    name: "Rented Apartments",
    route: "/dashboard/tenant/rented-properties",
    icon: <FiHome />,
  },
  {
    name: "Maintenance",
    route: "/dashboard/tenant/properties/maintenance",
    icon: <FiTool />,
  },
  {
    name: "Messages",
    route: "/dashboard/tenant/messages",
    icon: <FiMessageSquare />,
  },
];

const TenantSideBar: React.FC<TenantSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const activeLink = pathname ?? "";

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nrv-user");
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        if (userInfo) {
          setUser({
            name:
              `${userInfo?.user?.firstName} ${userInfo?.user?.lastName}` || "User",
            role: userInfo?.user?.accountType || "Property Owner",
          });
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem("nrv-user");
    }
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col justify-between bg-nrvPrimaryGreen text-white">
      <div>
        {/* Logo */}
        <div
          className="text-start mt-8 lg:mt-10 px-4 w-full min-w-0 box-border flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <span className="text-white font-bold text-lg sm:text-xl tracking-tight leading-tight">
            NaijaRentVerify
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6">
          <ul className="font-lighter text-[12px] text-[#98A2B3]">
            {links.map(({ name, route, icon }, index) => (
              <li
                key={index}
                onClick={() => router.push(route)}
                className={`flex items-center gap-4 px-6 py-3 mx-4 rounded-lg cursor-pointer font-lighter text-[12px]  ${
                  activeLink === route ? "text-[#BBFF37]" : "text-[#98A2B3]"
                }`}
              >
                {icon} {name}
              </li>
            ))}
          </ul>

          {/* Verification Section */}
          <div className="mt-8 mb-2 px-6 text-xs text-[#BBFF37] font-semibold uppercase tracking-wider">Verification</div>
          <ul className="font-lighter text-[12px] text-[#98A2B3]">
            <li
              onClick={() => router.push("/dashboard/tenant/verification")}
              className={`flex items-center gap-4 px-6 py-3 mx-4 rounded-lg cursor-pointer font-lighter text-[12px] ${activeLink.startsWith("/dashboard/tenant/verification") ? "text-[#BBFF37]" : "text-[#98A2B3]"}`}
            >
              <FiCheckCircle /> My Verifications
            </li>
          </ul>
        </nav>
      </div>

      {/* Settings and user */}
      <div className="px-6 py-4 border-t border-gray-600">
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push("/dashboard/tenant/settings")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              router.push("/dashboard/tenant/settings");
            }
          }}
          className={`flex items-center gap-4 mb-6 cursor-pointer font-lighter text-[12px] rounded-lg px-0 py-1 ${
            activeLink.startsWith("/dashboard/tenant/settings")
              ? "text-[#BBFF37]"
              : "text-[#98A2B3]"
          }`}
        >
          <FiSettings className="font-lighter text-[12px]" />
          <span>Settings</span>
        </div>
        {user && (
          <div className="flex items-center gap-4 justify-between pt-0 pb-0">
            <div className="flex gap-1.5">
              <BsPersonFill />
              <div>
                <p className="text-xs font-semibold text-[#FFFFFF]">
                  {user.name}
                </p>
                <p className="text-xs text-green-400">{user.role}</p>
              </div>
            </div>
            <BiLogOut
              onClick={() => {
                clearAllStoredData();
                router.push("/sign-in");
              }}
              className="text-xl cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSideBar;
