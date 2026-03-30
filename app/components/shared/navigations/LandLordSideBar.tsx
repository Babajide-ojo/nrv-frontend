"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiTool,
  FiMessageSquare,
  FiHeadphones,
  FiSettings,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { clearAllStoredData } from "@/helpers/utils";
import { LANDLORD_NAV_ITEMS } from "@/app/config/landlordNav";

interface User {
  name: string;
  role: string;
}

interface LandLordSideBarProps {
  isOpen: boolean;
}

const ICONS: Record<string, React.ReactNode> = {
  "Dashboard": <FiHome />,
  "Properties": <FiClipboard />,
  "Leads & Applications": <FiFileText />,
  "Tenants": <FiUsers />,
  "Tenant Verification": <FiDollarSign />,
  "Maintenance": <FiTool />,
  "Messages": <FiMessageSquare />,
  "Buy verification credit": <FiSettings />,
};

const links = LANDLORD_NAV_ITEMS.map(({ name, route }) => ({
  name,
  route,
  icon: ICONS[name] ?? <FiSettings />,
}));

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    setActiveLink(window.location.pathname);
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
      // Clear invalid data
      localStorage.removeItem("nrv-user");
    }
  }, []);

  return (
    <div
      className={`h-full w-full bg-nrvPrimaryGreen text-white flex flex-col justify-between`}
    >
      {/* <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0D3520] text-white flex flex-col justify-between transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    > */}
      <div>
        {/* Logo */}
        <div
          className="text-start mt-8 lg:mt-10 px-4 w-full min-w-0 box-border flex cursor-pointer items-center"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/nrv-logo-latest.jpg"
            width={150}
            height={40}
            alt="NaijaRentVerify"
            className="h-8 sm:h-9 w-auto max-w-full object-contain"
          />
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
        </nav>
      </div>

      {/* Support, Settings, and User Info */}
      <div className="px-6 py-4 border-t border-gray-600">
        <div className="flex items-center gap-4 mb-4 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiHeadphones className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>Contact Support</span>
        </div>
        <div className="flex items-center gap-4 mb-6 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiSettings className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>System Settings</span>
        </div>
        {user && (
          <div className="flex items-center gap-4 justify-between">
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

export default LandLordSideBar;
