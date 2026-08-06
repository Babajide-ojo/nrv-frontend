"use client";

import TenantLayout from "../../components/layout/TenantLayout";
import TenantDashboardScreen from "../../components/dashboard/tenant/TenantDashboardScreen";

/**
 * Role/session checks are applied by app/dashboard/tenant/layout.tsx.
 * Do not wrap with LandlordProtectedRoute here — that caused an infinite redirect loop.
 */
const TenantDashboardPage = () => {
  return (
    <TenantLayout>
      <TenantDashboardScreen />
    </TenantLayout>
  );
};

export default TenantDashboardPage;
