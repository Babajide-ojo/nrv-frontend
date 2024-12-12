"use client";

import LoadingPage from "../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import RentersListForLandlordScreen from "@/app/components/dashboard/tenant/RentersListForLandlordScreen";

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
         <RentersListForLandlordScreen />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Page;
