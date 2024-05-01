// DesktopNavBar.tsx
import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import NavLink from "./NavLink";
import Logo from "../../../../public/images/nrv-logo.png";
import Image from "next/image";

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
          <div className="md:flex gap-10 justify-end">
            <NavLink className="pt-2" href="/sign-in">
              Sign In
            </NavLink>
            <Button size="large" variant="primary" showIcon={false}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopNavBar;
