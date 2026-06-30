"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiLock, FiLogOut, FiMail, FiPhone, FiUser } from "react-icons/fi";
import Button from "../../shared/buttons/Button";
import InputField from "../../shared/input-fields/InputFields";
import { clearAllStoredData } from "../../../../helpers/utils";
import { updateUser } from "@/redux/slices/userSlice";

type SettingsTab = "profile" | "security";

const SettingsMainScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [userId, setUserId] = useState("");
  const [accountType, setAccountType] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    homeAddress: "",
    nin: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("nrv-user") || "{}");
      const user = stored?.user ?? {};
      setUserId(user._id ?? "");
      setAccountType(user.accountType ?? "");
      setStatus(user.status ?? "");
      setProfileForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        homeAddress: user.homeAddress ?? "",
        nin: user.nin ?? "",
      });
    } catch {
      // ignore
    }
  }, []);

  const displayName = useMemo(() => {
    const name = `${profileForm.firstName} ${profileForm.lastName}`.trim();
    return name || "Your profile";
  }, [profileForm.firstName, profileForm.lastName]);

  const initials = useMemo(() => {
    const a = profileForm.firstName?.charAt(0) ?? "";
    const b = profileForm.lastName?.charAt(0) ?? "";
    return (a + b).toUpperCase() || "?";
  }, [profileForm.firstName, profileForm.lastName]);

  const accountLabel =
    accountType === "landlord"
      ? "Property owner"
      : accountType === "tenant"
        ? "Tenant"
        : accountType || "Account";

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!userId) {
      toast.error("Could not find your account. Please sign in again.");
      return;
    }
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateUser({
          id: userId,
          payload: {
            firstName: profileForm.firstName.trim(),
            lastName: profileForm.lastName.trim(),
            phoneNumber: profileForm.phoneNumber.trim(),
            homeAddress: profileForm.homeAddress.trim(),
          },
        }) as any,
      ).unwrap();

      const stored = JSON.parse(localStorage.getItem("nrv-user") || "{}");
      const updatedUser = {
        ...stored.user,
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        homeAddress: profileForm.homeAddress.trim(),
      };
      localStorage.setItem(
        "nrv-user",
        JSON.stringify({ ...stored, user: updatedUser }),
      );
      window.dispatchEvent(new Event("nrv-user-updated"));
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAllStoredData();
    router.push("/sign-in");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your profile and account security.
        </p>
      </header>

      {/* Tab switcher */}
      <div
        className="mb-8 inline-flex w-full max-w-md rounded-xl bg-gray-100 p-1 sm:w-auto"
        role="tablist"
        aria-label="Settings sections"
      >
        {(
          [
            { id: "profile" as const, label: "My profile", icon: FiUser },
            { id: "security" as const, label: "Security", icon: FiLock },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors sm:flex-initial sm:px-6 ${
              activeTab === id
                ? "bg-white text-[#03442C] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Profile summary */}
          <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#03442C]/5 to-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#03442C] text-xl font-semibold text-white"
                aria-hidden
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {displayName}
                </h2>
                <p className="text-sm text-gray-600 truncate">{profileForm.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex rounded-full bg-[#03442C]/10 px-2.5 py-0.5 text-xs font-medium capitalize text-[#03442C]">
                    {accountLabel}
                  </span>
                  {status && (
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Editable details */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">
              Personal details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Update the name and contact information shown on your account.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InputField
                label="First name"
                name="firstName"
                placeholder="First name"
                value={profileForm.firstName}
                onChange={handleProfileChange}
              />
              <InputField
                label="Last name"
                name="lastName"
                placeholder="Last name"
                value={profileForm.lastName}
                onChange={handleProfileChange}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Phone number"
                name="phoneNumber"
                placeholder="e.g. 08012345678"
                inputType="phone"
                value={profileForm.phoneNumber}
                onChange={handleProfileChange}
                icon={<FiPhone className="text-gray-400" />}
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Email address"
                name="email"
                value={profileForm.email}
                disabled
                readOnly
                icon={<FiMail className="text-gray-400" />}
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Your sign-in email cannot be changed here. Contact support if you
                need to update it.
              </p>
            </div>

            <div className="mt-4">
              <InputField
                label="Home address"
                name="homeAddress"
                placeholder="Street, city, state"
                value={profileForm.homeAddress}
                onChange={handleProfileChange}
              />
            </div>

            {profileForm.nin?.trim() && (
              <div className="mt-4">
                <InputField
                  label="NIN"
                  name="nin"
                  value={profileForm.nin}
                  disabled
                  readOnly
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Identity numbers are read-only for security.
                </p>
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiLogOut aria-hidden />
              Log out
            </button>
            <Button
              variant="darkPrimary"
              size="large"
              showIcon={false}
              isLoading={isSaving}
              disabled={isSaving}
              onClick={handleSaveProfile}
              className="w-full sm:w-auto"
            >
              Save changes
            </Button>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-base font-semibold text-gray-900">Password</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              For your security, password changes are handled through email
              verification. We&apos;ll send a reset code to{" "}
              <strong className="text-gray-900">{profileForm.email || "your email"}</strong>.
            </p>
            <Link
              href="/verify-email"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#03442C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#022f21] transition-colors sm:w-auto"
            >
              Reset password
            </Link>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="text-base font-semibold text-amber-950">
              Keep your account safe
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-amber-900/90 list-disc list-inside">
              <li>Use a strong, unique password you don&apos;t reuse elsewhere.</li>
              <li>Never share your login details with anyone.</li>
              <li>Log out on shared or public devices.</li>
            </ul>
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiLogOut aria-hidden />
            Log out of this device
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsMainScreen;
