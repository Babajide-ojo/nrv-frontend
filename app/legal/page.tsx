"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const LegalPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-6">Legal Notices</h1>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">1. Terms of Service</h2>
            <p>
              By accessing and using the NaijaRentVerify platform, you agree to comply with and be bound by these terms and conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">2. User Responsibilities</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to provide accurate and complete information when using our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">3. Property Listings</h2>
            <p>
              Landlords and property managers warrant that they have the legal right to list and rent the properties they post on our platform. NaijaRentVerify reserves the right to remove any listing that violates our policies or local laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">4. Limitation of Liability</h2>
            <p>
              NaijaRentVerify is a platform connecting landlords and tenants. We are not a party to any rental agreement and are not liable for any disputes, damages, or losses arising from rental transactions facilitated through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">5. Intellectual Property</h2>
            <p>
              All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics, icons, and hyperlinks, are the property of NaijaRentVerify or licensed to us and are protected by law.
            </p>
          </section>
          
          <p className="text-sm text-gray-500 mt-8">
            Last updated: February 2026
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalPage;
