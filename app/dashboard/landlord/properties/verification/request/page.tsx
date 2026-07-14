"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { toast } from "react-toastify";
import { requestVerification } from "@/redux/slices/verificationSlice";
import { useRouter, useSearchParams } from "next/navigation";
import TierFeatureList from "@/app/components/shared/TierFeatureList";
import { getVerificationCreditBalances } from "@/helpers/verificationCredits";

const BUY_CREDITS_PATH = "/dashboard/landlord/settings/plans";

export default function OnboardTenant() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    landlordDisplayName: "",
  });
  const [verificationTier, setVerificationTier] = useState<"standard" | "premium">("standard");
  const [user, setUser] = useState<any>({});
  const [propertyContext, setPropertyContext] = useState<{
    applicationId?: string;
    roomId?: string;
    propertyId?: string;
    propertyLabel?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const creditBalances = useMemo(() => getVerificationCreditBalances(user), [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const redirectToBuyCredits = (tier: "standard" | "premium") => {
    toast.info(
      `You need ${tier} verification credits to send this request. Redirecting to purchase…`,
    );
    router.push(`${BUY_CREDITS_PATH}?tier=${tier}&reason=insufficient_credits`);
  };

  const handleSubmit = async () => {
    const available =
      verificationTier === "premium" ? creditBalances.premium : creditBalances.standard;
    if (available < 1) {
      redirectToBuyCredits(verificationTier);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        requestedBy: user?._id,
        verificationTier,
        ...(propertyContext.applicationId
          ? { applicationId: propertyContext.applicationId }
          : {}),
        ...(propertyContext.roomId ? { roomId: propertyContext.roomId } : {}),
        ...(propertyContext.propertyId
          ? { propertyId: propertyContext.propertyId }
          : {}),
        ...(propertyContext.propertyLabel
          ? { propertyLabel: propertyContext.propertyLabel }
          : {}),
      };

      const res = await dispatch(requestVerification(payload) as any).unwrap();
      toast.success(res?.message || "Verification requested successfully");

      router.push("/dashboard/landlord/properties/verification");
      handleCancel();
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong.";
      if (/credit/i.test(message)) {
        redirectToBuyCredits(verificationTier);
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      landlordDisplayName: "",
    });
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(stored?.user);
  }, []);

  useEffect(() => {
    const next: any = {};
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const landlordDisplayName = searchParams.get("landlordDisplayName");
    const tier = searchParams.get("tier");

    if (firstName) next.firstName = firstName;
    if (lastName) next.lastName = lastName;
    if (email) next.email = email;
    if (landlordDisplayName) next.landlordDisplayName = landlordDisplayName;

    if (Object.keys(next).length) {
      setFormData((prev) => ({ ...prev, ...next }));
    }
    if (tier === "premium" || tier === "standard") {
      setVerificationTier(tier);
    }

    const applicationId = searchParams.get("applicationId") || undefined;
    const roomId = searchParams.get("roomId") || undefined;
    const propertyId = searchParams.get("propertyId") || undefined;
    const propertyLabel = searchParams.get("propertyLabel") || undefined;
    if (applicationId || roomId || propertyId || propertyLabel) {
      setPropertyContext({
        applicationId,
        roomId,
        propertyId,
        propertyLabel: propertyLabel
          ? decodeURIComponent(propertyLabel)
          : undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const displayNameFromUser =
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "";
    if (displayNameFromUser) {
      setFormData((prev) =>
        prev.landlordDisplayName
          ? prev
          : { ...prev, landlordDisplayName: displayNameFromUser },
      );
    }
  }, [user?.firstName, user?.lastName]);

  const selectedCredits =
    verificationTier === "premium" ? creditBalances.premium : creditBalances.standard;

  return (
    <>
      <LandLordLayout path="Tenant Verification">
        <div className="mx-auto max-w-4xl px-2 py-3 sm:px-4 sm:py-5 md:p-6">
          <h2 className="text-2xl font-semibold mb-6">New Verification Request</h2>

          {propertyContext.propertyLabel && (
            <div className="mb-4 rounded-xl border border-[#03442C]/20 bg-[#03442C]/[0.06] px-4 py-3 text-sm text-gray-800">
              <span className="font-semibold text-[#03442C]">Linked property: </span>
              {propertyContext.propertyLabel}
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
            <span className="text-gray-600">
              {verificationTier === "premium" ? "Premium" : "Standard"} credits available:{" "}
              <strong className="text-gray-900 tabular-nums">{selectedCredits}</strong>
            </span>
            {selectedCredits < 1 && (
              <button
                type="button"
                onClick={() => redirectToBuyCredits(verificationTier)}
                className="ml-auto text-sm font-medium text-[#03442C] hover:underline"
              >
                Buy verification credits
              </button>
            )}
          </div>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">First Name</label>
                  <Input
                    placeholder="Tenant's first name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Last Name</label>
                  <Input
                    placeholder="Tenant's last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                  <Input
                    placeholder="Tenant's email address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Landlord Display Name</label>
                  <Input
                    placeholder="Name shown to tenant (e.g. Segun Peters)"
                    name="landlordDisplayName"
                    value={formData.landlordDisplayName}
                    onChange={handleChange}
                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="text-sm font-medium text-gray-700 block mb-3">Verification Tier</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setVerificationTier("standard")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setVerificationTier("standard");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Select standard verification"
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        verificationTier === "standard"
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${verificationTier === "standard" ? "text-green-700" : "text-gray-900"}`}>
                          Standard Verification
                        </span>
                        {verificationTier === "standard" && (
                          <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        Identity verification and Criminal/Fraud history checks to help you confidently screen a tenant before renting.
                      </p>
                      <TierFeatureList tier="standard" className="text-xs" />
                    </div>

                    <div
                      onClick={() => setVerificationTier("premium")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setVerificationTier("premium");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Select premium verification"
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        verificationTier === "premium"
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${verificationTier === "premium" ? "text-green-700" : "text-gray-900"}`}>
                          Premium Tenant Screening
                        </span>
                        {verificationTier === "premium" && (
                          <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        Everything in Standard verification, plus Credit Score (Affordability) to check if the tenant can realistically sustain the rent.
                      </p>
                      <TierFeatureList tier="premium" premiumAddonsOnly className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/dashboard/landlord/properties/verification")}
                  disabled={loading}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-700 hover:bg-green-800 text-white min-w-[140px]"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Sending Request..." : "Send Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LandLordLayout>
    </>
  );
}
