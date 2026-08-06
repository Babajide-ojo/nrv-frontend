"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Spinner from "../loaders/Spinner";

interface VerificationRouteGuardProps {
  children: ReactNode;
}

/**
 * Session handling for tenant verification:
 * - Requires a signed-in session (JWT) so report/response APIs stay authorized.
 * - Invite links without a session redirect to sign-in with returnUrl.
 */
const VerificationRouteGuard: React.FC<VerificationRouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userStr = localStorage.getItem("nrv-user");
    let hasSession = false;
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        hasSession = !!(parsed?.accessToken && (parsed?.user || parsed?.email));
      } catch {
        hasSession = false;
      }
    }

    if (hasSession) {
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
        <Spinner size={26} className="text-nrvPrimaryGreen" />
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
