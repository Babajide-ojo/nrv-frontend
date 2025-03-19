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

const navItems = [
  { text: "Home", targetId: "home" },
  { text: "About Us", targetId: "about" },
  { text: "Services", targetId: "services" },
  { text: "How it Works", targetId: "how-it-works" },
  { text: "FAQs", targetId: "faqs" },
  { text: "Contact Us", targetId: "contact" },
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
        <NavLink targetId="/">
          <img src="/images/nrv-logo.png" alt="Logo" className="w-28 h-auto" />
        </NavLink>
        {window.innerWidth <= 1000 && (
          <div>
            <button onClick={toggleMenu} className="text-nrvPrimaryGreen">
              {isOpen ? <IoClose /> : <FaBars />}
            </button>
          </div>
        )}
      </div>
      {isOpen && (
        <div className="px-4 overflow-y-auto">
          <nav>
            {navItems.map(({ text, targetId }, index) => (
              <div key={index}>
                <div>
                  <NavLink
                    targetId={targetId}
                    className="text-nrvPrimaryGreen py-3 block"
                  >
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
              <NavLink
                targetId="/sign-in"
                className="text-nrvPrimaryGreen mr-4 mt-4"
              >
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
