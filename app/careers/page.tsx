"use client";

import React from "react";
import NavBar from "@/app/components/shared/navigations/NavBar";
import Footer from "@/app/components/screens/landing-page/Footer";
import Button from "@/app/components/shared/buttons/Button";

const CareersPage = () => {
  return (
    <div className="font-jakarta">
      <NavBar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <h1 className="text-3xl font-bold text-[#03442C] mb-6">Careers at NaijaRentVerify</h1>
        <div className="prose max-w-none text-gray-600">
          <p className="mb-8 text-lg">
            Join us in our mission to revolutionize the real estate and rental market in Nigeria. We are always looking for passionate, innovative, and driven individuals to join our team.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">No Open Positions Currently</h3>
            <p className="text-gray-500 mb-6">
              We don't have any open roles at the moment, but we're growing fast! Check back soon or send your resume to our HR team for future consideration.
            </p>
            <a href="mailto:careers@naijarentverify.com" className="inline-block">
              <Button variant="primary" size="normal">
                Email Your Resume
              </Button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CareersPage;
