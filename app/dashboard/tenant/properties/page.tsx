"use client";

import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import TenantLayout from "../../../components/layout/TenantLayout";
import { AvailableListingsScreen } from "@/app/components/listings/AvailableListingsScreen";

const TenantPropertiesScreen = () => {
  return (
    <ProtectedRoute>
      <TenantLayout>
        <AvailableListingsScreen variant="dashboard" />
      </TenantLayout>
    </ProtectedRoute>
  );
};

export default TenantPropertiesScreen;
