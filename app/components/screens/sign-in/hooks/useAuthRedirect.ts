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
      localStorage.setItem("stepToLoad", JSON.stringify(3));
      router.push(ROUTES.SIGN_UP);
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