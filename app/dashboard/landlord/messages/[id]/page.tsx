"use client";

import LoadingPage from "../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import MessagingDetailsScreen from "@/app/components/dashboard/tenant/MessagingDetailsScreen";
import LandLordLayout from "@/app/components/layout/LandLordLayout";

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
          <LandLordLayout>
           <MessagingDetailsScreen />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Page;
