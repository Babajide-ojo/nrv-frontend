"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";
import ContactSection from "@/app/components/screens/landing-page/ContactSection";

const ContactUsPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-[#03442C] mb-4">Contact Us</h1>
            <p className="text-gray-600">
                Have questions or need assistance? We're here to help. Reach out to our support team or use the form below.
            </p>
        </div>
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
