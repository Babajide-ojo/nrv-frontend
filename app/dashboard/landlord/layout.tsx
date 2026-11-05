"use client";

import LandlordProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";

/**
 * Applies landlord role + session checks to every /dashboard/landlord/* page.
 */
export default function LandlordDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LandlordProtectedRoute>{children}</LandlordProtectedRoute>;
}
