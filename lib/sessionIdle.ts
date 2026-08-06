import { clearRoleCookie } from "@/lib/authSession";

export const SESSION_IDLE_MS = 30 * 60 * 1000;
export const SESSION_LAST_ACTIVE_KEY = "nrv-last-active";
export const REMEMBER_ME_FLAG_KEY = "rememberMe";

export const isRememberMeEnabled = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(REMEMBER_ME_FLAG_KEY) === "true";
};

export const touchSessionActivity = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(SESSION_LAST_ACTIVE_KEY, String(Date.now()));
};

export const getLastSessionActivity = (): number | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = localStorage.getItem(SESSION_LAST_ACTIVE_KEY);
  if (!raw) {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

export const isSessionIdleExpired = (): boolean => {
  // Persistent remember-me sessions are restored via cookie; skip idle force-logout.
  if (isRememberMeEnabled()) {
    return false;
  }
  const lastActive = getLastSessionActivity();
  if (!lastActive) {
    return false;
  }
  return Date.now() - lastActive > SESSION_IDLE_MS;
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem("nrv-user");
  localStorage.removeItem(SESSION_LAST_ACTIVE_KEY);
  localStorage.removeItem(REMEMBER_ME_FLAG_KEY);
  localStorage.removeItem("rememberedEmail");
  clearRoleCookie();
};

export const expireIdleSession = (message?: string) => {
  if (isRememberMeEnabled()) {
    return;
  }
  clearAuthSession();
  if (typeof window === "undefined") {
    return;
  }
  const params = new URLSearchParams();
  params.set(
    "reason",
    message || "Your session expired due to inactivity. Please sign in again.",
  );
  window.location.href = `/sign-in?${params.toString()}`;
};
