"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  isSessionIdleExpired,
} from "@/lib/sessionIdle";
import { restoreSessionFromRememberMe } from "@/lib/rememberMe";
import {
  getSessionAccountType,
  getStoredSession,
  isAccessTokenExpired,
  isLandlordAccount,
  isTenantAccount,
} from "@/lib/authSession";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Tenant-only dashboard guard.
 * Requires a valid access token and tenant accountType.
 */
const TenantProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const deny = (reason?: string) => {
      clearAuthSession();
      const params = new URLSearchParams();
      if (reason) {
        params.set("reason", reason);
      }
      router.replace(`/sign-in${params.toString() ? `?${params}` : ""}`);
    };

    const run = async () => {
      let session = getStoredSession();

      if (!session?.accessToken || isAccessTokenExpired(session.accessToken)) {
        const restored = await restoreSessionFromRememberMe();
        if (!restored?.accessToken) {
          if (!cancelled) {
            deny(
              "Your session expired. Please sign in again to continue.",
            );
          }
          return;
        }
        session = restored;
      }

      if (isSessionIdleExpired()) {
        if (!cancelled) {
          deny(
            "Your session expired due to inactivity. Please sign in again.",
          );
        }
        return;
      }

      const accountType = getSessionAccountType(session);
      if (isLandlordAccount(accountType)) {
        if (!cancelled) {
          setAllowed(false);
          router.replace("/dashboard/landlord");
        }
        return;
      }
      if (!isTenantAccount(accountType)) {
        if (!cancelled) {
          deny("You do not have access to the tenant dashboard.");
        }
        return;
      }

      if (!cancelled) {
        setAllowed(true);
      }
    };

    void run().catch(() => {
      if (!cancelled) {
        deny("Unable to verify your session. Please sign in again.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!allowed) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#03442C]" />
      </div>
    );
  }

  return <>{children}</>;
};

export default TenantProtectedRoute;
