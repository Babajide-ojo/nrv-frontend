import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_COOKIE = "nrv_role";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Chrome DevTools – return empty JSON so the request doesn't 404
  if (pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
    return NextResponse.json({});
  }

  // react-toastify source maps – return 204 so the request doesn't 404
  if (
    pathname.endsWith(".map") &&
    (pathname.includes("react-toastify") || pathname.includes("ReactToastify"))
  ) {
    return new NextResponse(null, { status: 204 });
  }

  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const isLandlordPath =
    pathname.startsWith("/dashboard/landlord") ||
    pathname.startsWith("/onboard/landlord");
  const isTenantPath =
    pathname.startsWith("/dashboard/tenant") ||
    pathname.startsWith("/onboard/tenant");

  // Enforce role cookie when present (set on login / session restore).
  if (role === "tenant" && isLandlordPath) {
    return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
  }
  if (role === "landlord" && isTenantPath) {
    return NextResponse.redirect(new URL("/dashboard/landlord", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboard/:path*",
    "/.well-known/appspecific/com.chrome.devtools.json",
  ],
};
