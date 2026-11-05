"use client";

import TenantLayout from "@/app/components/layout/TenantLayout";
import SupportContactPanel from "@/app/components/support/SupportContactPanel";

const TenantSupportPage = () => {
  return (
    <TenantLayout path="Contact us" mainPath="Support">
      <div className="p-4 sm:p-6 lg:p-8">
        <SupportContactPanel embedded />
      </div>
    </TenantLayout>
  );
};

export default TenantSupportPage;
