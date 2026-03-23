"use client";

import React from "react";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import TenantLayout from "@/app/components/layout/TenantLayout";
import TenantApplications from "@/app/components/screens/renters/TenantApplications";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          <TenantApplications />
        </TenantLayout>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
 