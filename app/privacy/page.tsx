"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";

const PrivacyPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-6">Privacy Notice</h1>
        <div className="prose max-w-none text-gray-600 space-y-6">
          <p>
            At NaijaRentVerify, we value your privacy and are committed to protecting your personal data. This Privacy Notice explains how we collect, use, disclosure, and safeguard your information when you visit our website or use our services.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and identification documents when you register for an account, verify your identity, or use our property management services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and manage your account and our services.</li>
              <li>To verify your identity and conduct background checks (with your consent).</li>
              <li>To process payments and transactions.</li>
              <li>To communicate with you regarding your account, updates, and support.</li>
              <li>To improve our platform and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share your data with trusted third-party service providers who assist us in operating our platform, conducting business, or serving our users, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#03442C] mb-3">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may also object to the processing of your data or request data portability. To exercise these rights, please contact our support team.
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

export default PrivacyPage;
