export type StoredUserProfile = {
  name: string;
  role: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
};

export const readStoredUserProfile = (): StoredUserProfile | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem("nrv-user");
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const user = parsed?.user ?? {};
    const firstName = String(user.firstName || "").trim();
    const lastName = String(user.lastName || "").trim();
    const name = `${firstName} ${lastName}`.trim() || "User";
    return {
      name,
      role: String(user.accountType || "Account"),
      avatarUrl: String(user.file || "").trim(),
      firstName,
      lastName,
      email: String(user.email || "").trim(),
    };
  } catch {
    return null;
  }
};
