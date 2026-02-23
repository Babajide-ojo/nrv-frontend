"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const AboutUsPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-6">About Us</h1>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-4">
            Welcome to <span className="font-semibold text-[#03442C]">NaijaRentVerify</span>. We are dedicated to transforming the rental experience in Nigeria by fostering trust, transparency, and efficiency between landlords and tenants.
          </p>
          <p className="mb-4">
            Our platform was born out of a critical need to address the challenges in the Nigerian rental market—from fraudulent listings and lack of verification to delayed payments and property management hurdles.
          </p>
          <h2 className="text-xl font-semibold text-[#03442C] mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            To create a seamless, secure, and stress-free rental ecosystem where property owners can maximize their returns and tenants can find verified homes with confidence.
          </p>
          <h2 className="text-xl font-semibold text-[#03442C] mt-8 mb-4">What We Do</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Comprehensive Tenant Screening & Background Checks</li>
            <li>Verified Property Listings</li>
            <li>Secure Rent Payment Processing</li>
            <li>Efficient Property Management Tools</li>
            <li>Maintenance Request Tracking</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
