"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";
import { CiLogout } from "react-icons/ci";
import { BiLogOut } from "react-icons/bi";

// Define the types for user data
interface User {
  name: string;
  role: string;
  loggedInTime: string;
}

interface TenantSideBarProps {
  isOpen: boolean;
}

const links = [
  {
    name: "Dashboard",
    route: "/dashboard/tenant",
  },
  {
    name: "Properties",
    route: "/dashboard/tenant/properties",
  },
  {
    name: "Applications",
    route: "/dashboard/tenant/properties/applications",
  },
  {
    name: "Rented Apartments",
    route: "/dashboard/tenant/rented-properties",
  },
  {
    name: "Maintenance",
    route: "/dashboard/tenant/properties/maintenance",
  },
  {
    name: "Messages",
    route: "/dashboard/tenant/messages",
  },
  {
    name: "Settings",
    route: "/dashboard/tenant/settings",
  },
];

const TenantSideBar: React.FC<TenantSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set the current path from the router
    setCurrentPath(window.location.pathname);

    // Fetch user info from localStorage
    const fetchUserInfo = () => {
      const storedUser = localStorage.getItem("nrv-user");
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        setUser({
          name: userInfo?.user?.firstName || userInfo?.firstName || "User",
          role: userInfo?.user?.accountType || userInfo?.accountType || "Role",
          loggedInTime:
            new Date(Date.now()).toLocaleString() || "Not available",
        });
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white transition duration-300 ease-in-out transform flex-col flex justify-between ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
    <div>
    <div
        className="mt-10"
        onClick={() => {
          router.push("/");
        }}
      >
        <Image
          src={Logo}
          width={200}
          height={50}
          alt="logo"
          className="object-none"
        />
      </div>
      <nav className="mt-5">
        <ul>
          {links.map(({ name, route }, index) => (
            <li
              key={index}
              className={`w-4/5 rounded-full mx-auto cursor-pointer px-6 py-3 flex justify-between text-sm font-light m-4 ${
                currentPath === route
                  ? "bg-nrvDarkBlue text-white"
                  : "text-black"
              }`}
              onClick={() => {
                router.push(route);
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </nav>

    </div>
      <div>
        {/* User Info Section */}
        {user && (
          <div className="px-6 py-4 border-gray-200 ml-6 mt-12">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-sm text-nrvDarkBlue mt-2">
              Account Type : {user.role}
            </p>
          </div>
        )}

        {/* Logout Button at the Bottom */}
        <div className="mt-auto mb-12 ml-12">
          <button
          className="w-[208px] rounded-full flex gap-2 py-3 hover:px-5 cursor-pointer hover:text-white hover:bg-nrvDarkBlue bg-white text-nrvDarkBlue font-medium"
            onClick={() => {
              localStorage.removeItem("nrv-user");
              router.push("/");
            }}
          >
          <BiLogOut className="font-bold h-[20.5px] w-[20.5px] text-cwMidGray pt-1" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantSideBar;
