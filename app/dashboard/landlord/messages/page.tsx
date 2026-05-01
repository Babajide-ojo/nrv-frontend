"use client";

import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import RentersListForLandlordScreen from "@/app/components/dashboard/tenant/RentersListForLandlordScreen";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <RentersListForLandlordScreen />
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
