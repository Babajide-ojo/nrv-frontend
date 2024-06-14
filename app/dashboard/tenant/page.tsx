"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../components/loaders/LoadingPage";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import TenantLayout from "../../components/layout/TenantLayout";
import TenantDashboardScreen from "../../components/dashboard/tenant/TenantDashboardScreen";

const SignIn = () => {
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
            <TenantDashboardScreen />
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default SignIn;
