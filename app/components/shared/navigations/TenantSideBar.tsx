"use client";

import React from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import { useRouter } from "next/navigation";

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
    name: "Messages",
    route: "/dashboard/tenant",
  },

  {
    name: "Settings",
    route: "/dashboard/tenant",
  },
];
const TenantSideBar: React.FC<TenantSideBarProps> = ({ isOpen }) => {
  const router = useRouter();
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-1/5 bg-white transition duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* TenantSideBar content */}
      <div className="mt-10" onClick={() => {
        router.push('/')
      }}>
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
                onClick={() => {
                  router.push(route);
                }}
              >
                {name}
              </li>
            </div>
          ))}
        </ul>
      </nav>

      <ul className="mt-32">
        <li
          className="px-6 py-3 cursor-pointer text-nrvGrayText text-sm m-6"
          onClick={() => {
            localStorage.removeItem("nrv-user");
            router.push("/");
          }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default TenantSideBar;
