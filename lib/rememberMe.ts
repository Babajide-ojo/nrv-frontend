import axios from "axios";
import { API_URL } from "@/config/constant";
import { touchSessionActivity } from "@/lib/sessionIdle";
import { syncRoleCookieFromSession } from "@/lib/authSession";

export type RestoredSession = {
  user: any;
  accessToken: string;
  notificationSettings?: any;
};

const persistSession = (userData: RestoredSession) => {
  localStorage.setItem("nrv-user", JSON.stringify(userData));
  localStorage.setItem("rememberMe", "true");
  touchSessionActivity();
  syncRoleCookieFromSession(userData);
};

/**
 * Exchange the httpOnly remember-me cookie for a fresh access session.
 * Returns null when no valid cookie/session exists.
 */
export const restoreSessionFromRememberMe = async (): Promise<RestoredSession | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/auth/session`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      timeout: 8000,
    });
    const safeUser = { ...(response.data?.user || {}) };
    delete safeUser.password;
    delete safeUser.confirmationCode;
    delete safeUser.passwordResetToken;
    delete safeUser.passwordResetExpires;

    if (!response.data?.accessToken || safeUser?.status === "inactive") {
      return null;
    }

    const userData: RestoredSession = {
      user: safeUser,
      accessToken: response.data.accessToken,
      notificationSettings: response.data.notificationSettings,
    };
    persistSession(userData);
    return userData;
  } catch {
    return null;
  }
};

export const logoutRememberMe = async (): Promise<void> => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    // Ignore network errors; still clear local session.
  }
};
