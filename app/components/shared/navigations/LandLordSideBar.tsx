"use client";

import React from "react";
import Image from "next/image";
import Logo from "../../../../public/images/nrv-logo.png";
import {useRouter} from "next/navigation";
interface LandLordSideBarProps {
  isOpen: boolean;
}

const LandLordSideBar: React.FC<LandLordSideBarProps> = ({ isOpen }) => {

    const router = useRouter();
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LandLordSideBar content */}
      <div className="mt-10">
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
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Dashboard
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Properties
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Message
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Rentals
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Maintenance
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Reports
          </li>
          <li className="px-6 py-3 text-nrvGrayText text-sm hover:bg-nrvDarkBlue hover:text-white m-6 hover:rounded-md">
            Settings
          </li>
        </ul>
      </nav>

      <ul className="mt-32">
        <li className="px-6 py-3 cursor-pointer text-nrvGrayText text-sm m-6" onClick={() => {
            localStorage.removeItem("nrv-user");
            router.push('/')
        }}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default LandLordSideBar;
