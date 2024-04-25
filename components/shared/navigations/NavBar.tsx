"use client";
import Button from "../buttons/Button";
import NavLink from "./NavLink";
import Logo from "../../../public/images/nrv-logo.png";
import Image from "next/image";
import { Bs0Circle } from "react-icons/bs";
const navItems = [
  { text: "Home", route: "/" },
  { text: "Feature", route: "/about" },
  { text: "How it works", route: "/services" },
  { text: "FAQs", route: "/contact" },
];

// Create a component to render the navigation items
const Navigation = () => (
  <nav className="flex justify-center gap-10">
    {navItems.map(({ text, route }, index) => (
      <div key={index}>
        <div>
          <NavLink href={route}>{text}</NavLink>
        </div>
      </div>
    ))}
  </nav>
);

const NavBar = () => {
  return (
    <div className="w-full gap-2 flex py-4 px-12">
      <div className="w-1/4 h-20">
        <Image src={Logo} width={200} height={50} alt="logo" className="object-none" />
      </div>
      <div className="w-2/4 pt-2">
        <Navigation />
      </div>
      <div className="w-1/4 ">
        <div className="flex gap-10 justify-end">
          <NavLink className="pt-2" href="/sign-in">
            Sign In
          </NavLink>
          <Button size="large" variant="primary" showIcon={false} >Get Started</Button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
