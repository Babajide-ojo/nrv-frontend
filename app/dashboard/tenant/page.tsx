"use client";

import React from "react";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import TenantLayout from "../../components/layout/TenantLayout";
import TenantDashboardScreen from "../../components/dashboard/tenant/TenantDashboardScreen";

const SignIn = () => {
  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          <TenantDashboardScreen />
        </TenantLayout>
      </ProtectedRoute>
    </div>
  );
};

export default SignIn;
