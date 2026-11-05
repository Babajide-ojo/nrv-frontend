"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import RentersListForLandlordScreen from "@/app/components/dashboard/tenant/RentersListForLandlordScreen";

export default function ManagerMessagesPage() {
  return (
    <ManagerLayout mainPath="Messages">
      <RentersListForLandlordScreen />
    </ManagerLayout>
  );
}
