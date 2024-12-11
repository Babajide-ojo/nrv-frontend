"use client";

import LoadingPage from "../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import Button from "../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import TenantLayout from "@/app/components/layout/TenantLayout";
import RentersListScreen from "@/app/components/dashboard/tenant/RentersListScreen";

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
            <RentersListScreen />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default Page;
