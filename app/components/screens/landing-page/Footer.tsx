"use client";

import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

const FOOTER_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/careers", label: "Careers" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/legal", label: "Legal Notices" },
  { href: "/privacy", label: "Privacy Notice" },
] as const;

const FOOTER_ACTIONS = [
  { href: "/dashboard/landlord/properties/create", label: "Add a Property" },
  { href: "/dashboard/landlord/properties/create", label: "List Your Property for Rent" },
  { href: "/dashboard/landlord/properties/renters", label: "Screen Applicants" },
  { href: "/dashboard/landlord/properties/create", label: "Create Rental" },
  { href: "/sign-in", label: "Customer Portal" },
] as const;

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#03442C] text-white flex justify-center items-center py-12 sm:py-16 md:py-24 lg:py-32 w-full overflow-x-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:w-4/5">
        <div className="max-w-9xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-48 gap-8 sm:gap-10 p-2 sm:p-4">
          {/* Newsletter Section */}
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-[42px] font-medium">Explore with Us Now!</h3>
            <p className="mt-2 font-light text-[#FFFFFFB2] leading-8 text-[16px] max-w-xs">
              Stay updated with <strong>NaijaRentVerify</strong> by subscribing
              to our newsletter for updates and tips!
            </p>
            <div className="flex items-center bg-white rounded-full px-6 py-3 w-full max-w-sm shadow-md mt-8">
              <Mail className="text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Enter Your Email"
                className="font-light flex-grow bg-transparent text-gray-600 text-sm placeholder-gray-400 focus:outline-none px-2"
              />
              <button className="bg-lime-300 text-black rounded-full w-8 h-8 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <ul className="mt-2 flex flex-col gap-3 text-[14px] font-light text-[#FFFFFFB2] list-none">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={true}
                    className="block py-1 pr-2 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-2 flex flex-col gap-3 text-[14px] font-light text-[#FFFFFFB2] list-none">
              {FOOTER_ACTIONS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    prefetch={true}
                    className="block py-1 pr-2 text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-white mt-8">

          {/* Footer */}
          <footer className="text-center text-gray-400 text-sm py-6">
            Copyright © 2025{" "}
            <span className="text-white font-semibold">NaijaRentVerify</span>{" "}
            All rights reserved
          </footer>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
