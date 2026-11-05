"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import HostShortStaysBoard from "@/app/components/short-stays/HostShortStaysBoard";

export default function ManagerListingsPage() {
  return (
    <ManagerLayout mainPath="Listings">
      <HostShortStaysBoard
        createHref="/dashboard/manager/listings/create"
        canRunCheck
        mode="listings"
      />
    </ManagerLayout>
  );
}
