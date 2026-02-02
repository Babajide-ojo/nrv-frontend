"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface VerificationRouteGuardProps {
  children: ReactNode;
}

/**
 * Session handling for tenant verification:
 *
 * - If the user has a session (nrv-user in localStorage) → allow access.
 * - If the user has no session but has verificationId in the URL (invite link) → allow access
 *   so they can complete verification without signing up first.
 * - If the user has no session and no verificationId → redirect to sign-in with returnUrl
 *   so they can sign in and then come back to verification (or use the link from the email).
 *
 * This supports "verification first, account optional": tenants can complete verification
 * via the email link without creating an account; we optionally prompt them to create
 * an account after completion to track applications.
 */
const VerificationRouteGuard: React.FC<VerificationRouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userStr = localStorage.getItem("nrv-user");
    let hasUser = false;
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        hasUser = !!(parsed?.user || parsed?.email);
      } catch {
        hasUser = false;
      }
    }

    const verificationId = searchParams.get("verificationId");

    if (hasUser) {
      setAllowed(true);
      return;
    }
    if (verificationId) {
      setAllowed(true);
      return;
    }
    setAllowed(false);
    const query = searchParams.toString();
    const returnUrl = encodeURIComponent(pathname + (query ? `?${query}` : ""));
    router.replace(`/sign-in?returnUrl=${returnUrl}`);
  }, [pathname, router, searchParams]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }
  if (!allowed) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-gray-500">Redirecting to sign in...</div>
      </div>
    );
  }
  return <>{children}</>;
};

export default VerificationRouteGuard;
