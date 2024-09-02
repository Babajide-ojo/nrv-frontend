"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";

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
  {
    name: "Dashboard",
    route: "/dashboard/landlord",
  },
  {
    name: "Properties",
    route: "/dashboard/landlord/properties",
  },
  {
    name: "Renters",
    route: "/dashboard/landlord/properties/renters",
  },
  {
    name: "Maintenance",
    route: "/dashboard/landlord/properties/maintenance",
  },
  {
    name: "Verification",
    route: "/dashboard/landlord/properties/verification",
  },
  // {
  //   name: "Reports",
  //   route: "/dashboard/landlord",
  // },
  // {
  //   name: "Messages",
  //   route: "/dashboard/landlord",
  // },
  // {
  //   name: "Settings",
  //   route: "/dashboard/landlord",
  // },
];

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch or retrieve user information
    const fetchUserInfo = () => {
      // Simulate fetching user info (replace this with actual logic)
      const storedUser = localStorage.getItem("nrv-user");
      if (storedUser) {
        const userInfo = JSON.parse(storedUser);
        setUser({
          name: userInfo?.user?.firstName ||  userInfo?.firstName || "User",
          role: userInfo?.user?.accountType || userInfo?.accountType|| "Role",
          loggedInTime: new Date(Date.now()).toLocaleString() || "Not available",
        });
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white transition duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LandLordSideBar content */}
      <div className="mt-10" onClick={() => router.push('/')}>
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
            <div key={index}>
              <li
                className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md"
                onClick={() => router.push(route)}
              >
                {name}
              </li>
            </div>
          ))}
        </ul>
      </nav>

       {/* User Info Section */}
       {user && (
        <div className="px-6 py-4  border-gray-200 ml-6 mt-16">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-sm text-nrvDarkBlue mt-2">Account Type : {user.role}</p>
          <p className="text-sm text-gray-500 mt-2">Current Time: {user.loggedInTime}</p>
     <div>
     <Button
          className="cursor-pointer text-nrvGrayText text-sm mt-4"
          onClick={() => {
            localStorage.removeItem("nrv-user");
            router.push("/");
          }}
          variant="whitebg"
          size="small"
        >
          Take A Break
        </Button>
     </div>
        </div>
      )}

      {/* <ul className="mt-16 ml-4">
  
      </ul> */}
    </div>
  );
};

export default LandLordSideBar;
