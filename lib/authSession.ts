/**
 * Client-side session helpers for dashboard route guards.
 */

export const NRV_ROLE_COOKIE = "nrv_role";

export type NrvSessionUser = {
  _id?: string;
  id?: string;
  email?: string;
  accountType?: string;
  status?: string;
};

export type NrvSession = {
  accessToken?: string;
  user?: NrvSessionUser;
};

export type NrvRole = "landlord" | "tenant";

export const getStoredSession = (): NrvSession | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem("nrv-user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as NrvSession;
  } catch {
    return null;
  }
};

export const getSessionAccountType = (session?: NrvSession | null): string =>
  String(session?.user?.accountType || "")
    .trim()
    .toLowerCase();

export const getSessionUserId = (session?: NrvSession | null): string => {
  const user = session?.user;
  return String(user?._id || user?.id || "").trim();
};

/** Returns true when JWT is missing, malformed, or past exp. */
export const isAccessTokenExpired = (token?: string | null): boolean => {
  if (!token || typeof token !== "string") {
    return true;
  }
  const parts = token.split(".");
  if (parts.length < 2) {
    return true;
  }
  try {
    const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadJson) as { exp?: number };
    if (!payload.exp) {
      return false;
    }
    // 15s skew
    return payload.exp * 1000 <= Date.now() - 15_000;
  } catch {
    return true;
  }
};

export const isLandlordAccount = (accountType?: string | null): boolean => {
  const t = String(accountType || "")
    .trim()
    .toLowerCase();
  return t === "landlord" || t === "property owner" || t === "propertyowner";
};

export const isTenantAccount = (accountType?: string | null): boolean =>
  String(accountType || "")
    .trim()
    .toLowerCase() === "tenant";

export const resolveNrvRole = (
  accountType?: string | null,
): NrvRole | null => {
  if (isTenantAccount(accountType)) {
    return "tenant";
  }
  if (isLandlordAccount(accountType)) {
    return "landlord";
  }
  return null;
};

const getCookieMaxAgeSeconds = (): number => 60 * 60 * 24 * 30;

/** Readable role cookie for Next middleware (not httpOnly). */
export const setRoleCookie = (accountType?: string | null): void => {
  if (typeof document === "undefined") {
    return;
  }
  const role = resolveNrvRole(accountType);
  if (!role) {
    clearRoleCookie();
    return;
  }
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${NRV_ROLE_COOKIE}=${role}; Path=/; Max-Age=${getCookieMaxAgeSeconds()}; SameSite=Lax${secure}`;
};

export const clearRoleCookie = (): void => {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${NRV_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const syncRoleCookieFromSession = (
  session?: NrvSession | null,
): NrvRole | null => {
  const role = resolveNrvRole(getSessionAccountType(session));
  if (!role) {
    clearRoleCookie();
    return null;
  }
  setRoleCookie(role);
  return role;
};

export const getDashboardHomeForRole = (role: NrvRole): string =>
  role === "tenant" ? "/dashboard/tenant" : "/dashboard/landlord";

export const isPathAllowedForRole = (
  pathname: string,
  role: NrvRole,
): boolean => {
  if (role === "tenant") {
    return (
      pathname.startsWith("/dashboard/tenant") ||
      pathname.startsWith("/onboard/tenant")
    );
  }
  return (
    pathname.startsWith("/dashboard/landlord") ||
    pathname.startsWith("/onboard/landlord")
  );
};
