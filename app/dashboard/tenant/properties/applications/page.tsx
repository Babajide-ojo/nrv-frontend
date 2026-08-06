"use client";

import React from "react";
import TenantLayout from "@/app/components/layout/TenantLayout";
import TenantApplications from "@/app/components/screens/renters/TenantApplications";

const Page = () => {
  return (
    <div>
      <TenantLayout>
        <TenantApplications />
      </TenantLayout>
    </div>
  );
};

export default Page;
