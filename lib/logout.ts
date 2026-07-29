import { clearAllStoredData } from "@/helpers/utils";
import { clearAuthSession } from "@/lib/sessionIdle";
import { logoutRememberMe } from "@/lib/rememberMe";

/**
 * Full logout: revoke remember-me cookie on the server, then clear local session.
 */
export const performLogout = async (): Promise<void> => {
  await logoutRememberMe();
  clearAuthSession();
  clearAllStoredData();
};
