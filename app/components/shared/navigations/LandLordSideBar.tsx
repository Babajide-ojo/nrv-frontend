"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";

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
  { name: "Messages", route: "/dashboard/landlord/messages" },
];

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");

  useEffect(() => {
    // Set active link based on the current URL path
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);

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

  const handleLinkClick = (route: string) => {
    setActiveLink(route); // Update active link
    router.push(route); // Navigate to the clicked route
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white transition duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo Section */}
      <div className="mt-10" onClick={() => router.push("/")}>
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
            <li
              key={index}
              className={`w-4/5 mx-auto cursor-pointer px-6 py-3 flex justify-between text-sm font-light rounded-md m-4 ${
                activeLink === route
                  ? "bg-nrvDarkBlue text-white"
                  : "text-nrvGrayText hover:bg-nrvDarkBlue hover:text-white"
              }`}
              onClick={() => handleLinkClick(route)}
            >
              {name}
            </li>
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
