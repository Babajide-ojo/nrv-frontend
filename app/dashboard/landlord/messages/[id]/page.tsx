"use client";

import LoadingPage from "../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import TenantLayout from "@/app/components/layout/TenantLayout";
import RentersListScreen from "@/app/components/dashboard/tenant/RentersListScreen";
import MessagingDetailsScreen from "@/app/components/dashboard/tenant/MessagingDetailsScreen";

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
           <MessagingDetailsScreen />
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Page;
