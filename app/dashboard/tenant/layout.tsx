"use client";

import TenantProtectedRoute from "@/app/components/guard/TenantProtectedRoute";

/**
 * Applies tenant role + session checks to every /dashboard/tenant/* page.
 */
export default function TenantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantProtectedRoute>{children}</TenantProtectedRoute>;
}
