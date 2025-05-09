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
  FiBell,
  FiHeadphones,
  FiSettings,
} from "react-icons/fi";
import Logo from "../../../../public/images/nrv-logo.png";
import { FaPerson } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";

interface User {
  name: string;
  role: string;
}

interface LandLordSideBarProps {
  isOpen: boolean;
}

const links = [
  { name: "Dashboard", route: "/dashboard/landlord", icon: <FiHome /> },
  {
    name: "Properties",
    route: "/dashboard/landlord/properties",
    icon: <FiClipboard />,
  },
  {
    name: "Leads & Applications",
    route: "/dashboard/landlord/properties/renters",
    icon: <FiFileText />,
  },
  { name: "Tenants", route: "/dashboard/landlord/properties/renters", icon: <FiUsers /> },
  {
    name: "Rent Collection",
    route: "/dashboard/landlord/rent",
    icon: <FiDollarSign />,
  },
  {
    name: "Financial Reports",
    route: "/dashboard/landlord/reports",
    icon: <FiFileText />,
  },
  {
    name: "Maintenance",
    route: "/dashboard/landlord/properties/maintenance",
    icon: <FiTool />,
  },
  {
    name: "Messages",
    route: "/dashboard/landlord/messages",
    icon: <FiMessageSquare />,
  },
  {
    name: "Notifications",
    route: "/dashboard/landlord/notifications",
    icon: <FiBell />,
  },
];

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");

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

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#0D3520] text-white flex flex-col justify-between transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
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

        {/* Search Bar */}
        <div className="px-4 mt-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 rounded-md bg-[#1C3B2A] text-white placeholder-gray-400"
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
                localStorage.removeItem("nrv-user");
                router.push("/");
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
