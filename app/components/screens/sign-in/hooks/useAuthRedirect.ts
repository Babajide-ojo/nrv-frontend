import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserData } from "../types";
import { ROUTES } from "../constants";

export const useAuthRedirect = () => {
  const router = useRouter();

  const redirectUser = useCallback((userData: UserData) => {
    console.log({j: userData})
    const userAccountType = userData?.user?.accountType || "";
    const userStatus = userData?.user?.status || "";

    // Handle inactive users
    if (userStatus === "inactive") {
      // Keep verification inside the sign-in flow (not the sign-up onboarding).
      // Ensure the verification screen can read the email.
      if (userData?.user?.email) {
        localStorage.setItem("emailToVerify", JSON.stringify({ data: { email: userData.user.email } }));
      }
      router.push(ROUTES.VERIFY_ACCOUNT);
      return;
    }

    // Handle active users based on account type
    if (userStatus === "active") {
      switch (userAccountType) {
        case "landlord":
          router.push(ROUTES.LANDLORD_DASHBOARD);
          break;
        case "tenant":
          router.push(ROUTES.TENANT_DASHBOARD);
          break;
        default:
          // Fallback to home page for unknown account types
          router.push(ROUTES.HOME);
          break;
      }
    }
  }, [router]);

  return {
    redirectUser,
  };
}; 