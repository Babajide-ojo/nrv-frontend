// MobileNavBar.tsx
"use client";

import React from "react";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IoClose, IoPersonCircle } from "react-icons/io5";
import NavLink from "./NavLink";
import Button from "../buttons/Button";
import { useRouter } from "next/navigation";

interface NavItem {
  text: string;
  route: string;
}

const navItems: NavItem[] = [
  { text: "Home", route: "/" },
  { text: "Feature", route: "/about" },
  { text: "How it works", route: "/services" },
  { text: "FAQs", route: "/contact" },
];

const MobileNavBar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<any>(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user?.user);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white z-50 pt-4 pb-4 ${
        isOpen ? "h-screen" : ""
      }`}
    >
      <div className="flex justify-between items-center px-4">
        <NavLink href="/">
          <img src="/images/nrv-logo.png" alt="Logo" className="w-28 h-auto" />
        </NavLink>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-nrvDarkBlue">
            {isOpen ? <IoClose /> : <FaBars />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="px-4 overflow-y-auto">
          <nav>
            {navItems.map(({ text, route }, index) => (
              <div key={index}>
                <div>
                  <NavLink href={route} className="text-nrvDarkBlue py-3 block">
                    {text}
                  </NavLink>
                </div>
              </div>
            ))}
          </nav>
          {isLoggedIn ? (
            <div
              onClick={() => {
                if (currentUser.accountType === "landlord") {
                  router.push("/dashboard/landlord");
                }
                if (currentUser.accountType === "tenant") {
                  router.push("/dashboard/tenant");
                }
              }}
              className="cursor-pointer"
            >
              <IoPersonCircle size={50} color="#153969" />
            </div>
          ) : (
            <div className="flex justify-between mt-4">
              <NavLink href="/sign-in" className="text-nrvDarkBlue mr-4 mt-4">
                Sign In
              </NavLink>
              <Button size="large" variant="primary" showIcon={false}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileNavBar;
