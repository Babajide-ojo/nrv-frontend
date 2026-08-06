"use client";

import TenantLayout from "@/app/components/layout/TenantLayout";
import RentersListScreen from "@/app/components/dashboard/tenant/RentersListScreen";

const Page = () => {
  return (
    <div>
      <TenantLayout>
        <RentersListScreen />
      </TenantLayout>
    </div>
  );
};

export default Page;
