// DesktopNavBar.tsx
"use client";

import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import NavLink from "./NavLink";
import Logo from "../../../../public/images/nrv-logo.png";
import Image from "next/image";
import { IoPersonCircle } from "react-icons/io5";
import { useRouter } from 'next/navigation';


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

const DesktopNavBar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<any>(false);
  const [currentUser, setCurrentUser] = useState<any>({});
  const router =useRouter()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user?.user)
    }
  }, []);
  return (
    <div className="w-full gap-2 flex flex-row">
      <div className="md:w-1/4 flex justify-between md:justify-start">
        <Image
          src={Logo}
          width={200}
          height={50}
          alt="logo"
          className="object-none"
        />
      </div>
      <div className="md:w-2/4 pt-2">
        <nav className="flex justify-center gap-10">
          {navItems.map(({ text, route }, index) => (
            <div key={index}>
              <div>
                <NavLink href={route}>{text}</NavLink>
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="md:w-1/4">
        <div className="flex justify-end">
            {isLoggedIn ? (
              <div onClick={() => {
                  if(currentUser.accountType === 'landlord'){
                    router.push("/dashboard/landlord")
                  }
                  if(currentUser.accountType === 'tenant'){
                    router.push("/dashboard/tenant")
                  }
              }} className="cursor-pointer">
                <IoPersonCircle size={50} color="#153969"/>
              </div>
            ) : (

               <div className="md:flex gap-10 justify-end ">
                <NavLink className="pt-2" href="/sign-in">
                  Sign In
                </NavLink>
                <Button size="large" variant="primary" showIcon={false}>
                  Get Started
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNavBar;
