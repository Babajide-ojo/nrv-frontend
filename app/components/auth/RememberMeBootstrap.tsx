"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { restoreSessionFromRememberMe } from "@/lib/rememberMe";

/**
 * On first load, if there is no nrv-user session, try restoring from the
 * httpOnly remember-me cookie. If restored while on sign-in, redirect home.
 */
export function RememberMeBootstrap({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const existing = localStorage.getItem("nrv-user");
        if (!existing) {
          const session = await restoreSessionFromRememberMe();
          if (
            !cancelled &&
            session?.accessToken &&
            (pathname === "/sign-in" || pathname === "/forgot-password")
          ) {
            const accountType = String(
              session.user?.accountType || "",
            ).toLowerCase();
            if (accountType === "tenant") {
              router.replace("/dashboard/tenant");
            } else {
              router.replace("/dashboard/landlord");
            }
          }
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
