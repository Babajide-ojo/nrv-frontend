"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import TenantLayout from "@/app/components/layout/TenantLayout";
import RentersListScreen from "@/app/components/dashboard/tenant/RentersListScreen";
import MessagingDetailsScreen from "@/app/components/screens/message/MessagingDetailsScreen";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          <MessagingDetailsScreen source="sender" />
        </TenantLayout>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
