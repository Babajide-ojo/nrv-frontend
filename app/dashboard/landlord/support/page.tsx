"use client";

import LandLordLayout from "@/app/components/layout/LandLordLayout";
import SupportContactPanel from "@/app/components/support/SupportContactPanel";

const LandlordSupportPage = () => {
  return (
    <LandLordLayout path="Contact us" mainPath="Support">
      <div className="p-4 sm:p-6 lg:p-8">
        <SupportContactPanel embedded />
      </div>
    </LandLordLayout>
  );
};

export default LandlordSupportPage;
