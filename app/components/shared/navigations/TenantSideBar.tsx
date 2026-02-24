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
  FiCheckCircle,
} from "react-icons/fi";
import Logo from "../../../../public/images/nrv-logo.png";
import { FaPerson } from "react-icons/fa6";
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
      <div>
        {/* Logo */}
        <div
          className="text-white text-start mt-10 ml-4 italic flex cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* <Image src={Logo} width={150} height={40} alt="logo" /> */}
          NaijaRentVerify
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
              onClick={() => router.push("/dashboard/tenant/verification/requests")}
              className={`flex items-center gap-4 px-6 py-3 mx-4 rounded-lg cursor-pointer font-lighter text-[12px] ${activeLink === "/dashboard/tenant/verification/requests" ? "text-[#BBFF37]" : "text-[#98A2B3]"}`}
            >
              <FiCheckCircle /> My Verifications
            </li>
            <li
              onClick={() => router.push("/dashboard/tenant/verification")}
              className={`flex items-center gap-4 px-6 py-3 mx-4 rounded-lg cursor-pointer font-lighter text-[12px] ${activeLink === "/dashboard/tenant/verification" ? "text-[#BBFF37]" : "text-[#98A2B3]"}`}
            >
              <FiCheckCircle /> My Submissions
            </li>
          </ul>
        </nav>
      </div>

      {/* Support, Settings, and User Info */}
      <div className="px-6 pt-4 pb-1 border-t border-gray-600">
        <div className="flex items-center gap-4 mb-3 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiHeadphones className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>Contact Support</span>
        </div>
        <div className="flex items-center gap-4 mb-3 cursor-pointer font-lighter text-[12px] text-[#98A2B3]">
          <FiSettings className="font-lighter text-[12px] text-[#98A2B3]" />{" "}
          <span>System Settings</span>
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
