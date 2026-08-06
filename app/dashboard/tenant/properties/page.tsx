"use client";

import TenantLayout from "../../../components/layout/TenantLayout";
import { AvailableListingsScreen } from "@/app/components/listings/AvailableListingsScreen";

const TenantPropertiesScreen = () => {
  return (
    <TenantLayout>
      <AvailableListingsScreen variant="dashboard" />
    </TenantLayout>
  );
};

export default TenantPropertiesScreen;
