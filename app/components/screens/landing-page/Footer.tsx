import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

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
            <div>
              <ul className="mt-2 space-x-8 text-[14px] font-light text-[#FFFFFFB2]">
                <Link href="#">
                  {" "}
                  <li>About Us</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Careers</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Contact Us</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Legal Notices</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Privacy Notice</li>
                </Link>
              </ul>
            </div>

            <div>
              <ul className="mt-2 space-x-8 text-[14px] font-light text-[#FFFFFFB2]">
                <Link href="#">
                  {" "}
                  <li>Add a Property</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>List Your Property for Rent</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Screen Applicants</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Create Rental</li>
                </Link>
                <Link href="#">
                  {" "}
                  <li>Customer Portal</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-white mt-8">
          <nav className="md:flex hidden justify-between items-center px-10 py-6 rounded-full bg-[#03442C] max-w-7xl mx-auto mt-6 bg-[#0D3520] opacity-80">
            <h1 className="text-lg font-bold">NaijaRentVerify</h1>
            <ul className="flex space-x-8 text-sm">
              <li className="cursor-pointer hover:text-gray-300">About Us</li>
              <li className="cursor-pointer hover:text-gray-300">Management</li>
              <li className="cursor-pointer hover:text-gray-300">Project</li>
              <li className="cursor-pointer hover:text-gray-300">FAQs</li>
            </ul>
          </nav>

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
