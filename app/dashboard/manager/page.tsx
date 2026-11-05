"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import HostShortStaysBoard from "@/app/components/short-stays/HostShortStaysBoard";

export default function ManagerDashboardPage() {
  return (
    <ManagerLayout mainPath="Dashboard">
      <HostShortStaysBoard
        createHref="/dashboard/manager/listings/create"
        canRunCheck
      />
    </ManagerLayout>
  );
}
