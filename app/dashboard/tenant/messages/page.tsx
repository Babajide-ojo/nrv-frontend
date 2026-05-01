"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import Button from "../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import TenantLayout from "@/app/components/layout/TenantLayout";
import RentersListScreen from "@/app/components/dashboard/tenant/RentersListScreen";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <TenantLayout>
          <RentersListScreen />
        </TenantLayout>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
