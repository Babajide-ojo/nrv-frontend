"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import HostShortStaysBoard from "@/app/components/short-stays/HostShortStaysBoard";

export default function ManagerBookingsPage() {
  return (
    <ManagerLayout mainPath="Bookings">
      <HostShortStaysBoard
        createHref="/dashboard/manager/listings/create"
        canRunCheck
        mode="bookings"
      />
    </ManagerLayout>
  );
}
