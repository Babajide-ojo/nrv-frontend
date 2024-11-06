"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";
// Importing icons (you can add icons to links later if needed)
import { FaCheck, FaCpanel, FaDashcube } from "react-icons/fa";
import { IoBatteryCharging, IoPeopleCircleOutline, IoSettings } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { FaPlug } from "react-icons/fa6";
import { FcMenu } from "react-icons/fc";

// Define the types for user data
interface User {
  name: string;
  role: string;
  loggedInTime: string;
}

interface LandLordSideBarProps {
  isOpen: boolean;
}

const links = [
  { name: "Dashboard", route: "/dashboard/landlord" },
  { name: "Properties", route: "/dashboard/landlord/properties" },
  { name: "Renters", route: "/dashboard/landlord/properties/renters" },
  { name: "Maintenance", route: "/dashboard/landlord/properties/maintenance" },
  { name: "Verification", route: "/dashboard/landlord/properties/verification" },
  { name: "Settings", route: "/dashboard/landlord/settings" },
];

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    // Retrieve the active link from localStorage and set the state
    const storedActiveLink = localStorage.getItem("activeLink");
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }

    // Fetch or retrieve user information
    const fetchUserInfo = () => {
      const storedUser = localStorage.getItem("nrv-user");
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        setUser({
          name: userInfo?.user?.firstName || userInfo?.firstName || "User",
          role: userInfo?.user?.accountType || userInfo?.accountType || "Role",
          loggedInTime: new Date(Date.now()).toLocaleString() || "Not available",
        });
      }
    };

    fetchUserInfo();
  }, []);

  // Handle link click and set active link
  const handleLinkClick = (route: string) => {
    setActiveLink(route);
    localStorage.setItem("activeLink", route); // Store active link in localStorage
    router.push(route); // Navigate to the clicked route
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white transition duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="mt-10" onClick={() => router.push('/')}>
        <Image
          src={Logo}
          width={200}
          height={50}
          alt="logo"
          className="object-none"
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-5">
        <ul>
          {links.map(({ name, route }, index) => (
            <div key={index}>
              <li
                className={`w-4/5 mx-auto cursor-pointer px-6 py-3 flex justify-between text-nrvGrayText text-xs hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md font-light ${
                  activeLink === route ? "bg-nrvDarkBlue text-white" : ""
                }`}
                onClick={() => handleLinkClick(route)}
              >
                <span>{name}</span>
              </li>
            </div>
          ))}
        </ul>
      </nav>

      {/* User Info Section */}
      {user && (
        <div className="px-6 py-4 border-gray-200 ml-6 mt-12">
          <p className="text-xs font-semibold">{user.name}</p>
          <p className="text-xs text-nrvDarkBlue mt-2">Account Type : {user.role}</p>
          <p className="text-xs text-gray-500 mt-2">Current Time: {user.loggedInTime}</p>
          <div>
            <Button
              className="cursor-pointer text-nrvGrayText text-xs mt-4"
              onClick={() => {
                localStorage.removeItem("nrv-user");
                router.push("/");
              }}
              variant="whitebg"
              size="small"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandLordSideBar;
