"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import HostShortStaysBoard from "@/app/components/short-stays/HostShortStaysBoard";

export default function ManagerGuestChecksPage() {
  return (
    <ManagerLayout mainPath="Guest checks">
      <HostShortStaysBoard
        createHref="/dashboard/manager/listings/create"
        canRunCheck
        mode="checks"
      />
    </ManagerLayout>
  );
}
