"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import TenantLayout from "@/app/components/layout/TenantLayout";
import TenantApplications from "@/app/components/screens/renters/TenantApplications";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
           <TenantApplications />
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Page;
 