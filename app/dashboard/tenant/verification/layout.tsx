"use client";

import { ReactNode } from "react";
import VerificationRouteGuard from "@/app/components/guard/VerificationRouteGuard";

export default function TenantVerificationLayout({ children }: { children: ReactNode }) {
  return <VerificationRouteGuard>{children}</VerificationRouteGuard>;
}
