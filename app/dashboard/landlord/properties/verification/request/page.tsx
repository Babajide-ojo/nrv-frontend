"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { toast, ToastContainer } from "react-toastify";
import { requestVerification } from "@/redux/slices/verificationSlice";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";


export default function OnboardTenant() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nin: "",
    landlordDisplayName: "",
  });
  const [verificationTier, setVerificationTier] = useState<"standard" | "premium">("standard");
  const [user, setUser] = useState<any>({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        requestedBy: user?._id,
        verificationTier,
      };

      const res = await dispatch(requestVerification(payload) as any).unwrap();
      toast.success(res?.message || "Request submitted successfully");
 
      router.push('/dashboard/landlord/properties/verification')
      // Reset form on success
      handleCancel();
    } catch (error: any) {
      toast.error(error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      nin: "",
      landlordDisplayName: "",
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
  }, []);

  useEffect(() => {
    const next: any = {};
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const email = searchParams.get("email");
    const nin = searchParams.get("nin");
    const landlordDisplayName = searchParams.get("landlordDisplayName");

    if (firstName) next.firstName = firstName;
    if (lastName) next.lastName = lastName;
    if (email) next.email = email;
    if (nin) next.nin = nin;
    if (landlordDisplayName) next.landlordDisplayName = landlordDisplayName;

    if (Object.keys(next).length) {
      setFormData((prev) => ({ ...prev, ...next }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const displayNameFromUser =
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "";
    if (displayNameFromUser) {
      setFormData((prev) =>
        prev.landlordDisplayName ? prev : { ...prev, landlordDisplayName: displayNameFromUser }
      );
    }
  }, [user?.firstName, user?.lastName]);


  return (
    <>
      <ToastContainer />
      <LandLordLayout path="Tenant Verification">
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-semibold">Verification Request</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please enter details about your tenant below so we can help you verify details about them
          </p>

          <hr className="my-4" />

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">First Name</label>
                  <Input
                    placeholder="Enter Tenant First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Last Name</label>
                  <Input
                    placeholder="Enter Tenant Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Email Address</label>
                  <Input
                    placeholder="Enter Tenant Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">NIN (National Identification Number)</label>
                  <Input
                    placeholder="Tenant NIN (optional)"
                    name="nin"
                    value={formData.nin}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Tenant will provide NIN during verification if not set</p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-1">Landlord’s Display Name</label>
                  <Input
                    placeholder="Ex. Segun Peters"
                    name="landlordDisplayName"
                    value={formData.landlordDisplayName}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Display name is the name the tenant sees is requesting their verification
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium block mb-2">Verification type</label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Choose the type of screening to run for this tenant. One credit of the selected type will be used when you run screening after they submit.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                        verificationTier === "standard"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationTier"
                        value="standard"
                        checked={verificationTier === "standard"}
                        onChange={() => setVerificationTier("standard")}
                        className="mt-1 h-4 w-4 text-green-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Standard</span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          NIN Advanced, selfie + NIN, liveness, AML, PEP & sanctions
                        </p>
                      </div>
                    </label>
                    <label
                      className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                        verificationTier === "premium"
                          ? "border-green-700 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="verificationTier"
                        value="premium"
                        checked={verificationTier === "premium"}
                        onChange={() => setVerificationTier("premium")}
                        className="mt-1 h-4 w-4 text-green-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Premium</span>
                        <p className="text-xs text-gray-600 mt-0.5">
                          All Standard checks plus credit score (BVN)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                By submitting this tenant verification request, you agree with our Terms and Conditions.
              </p>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() =>     router.push('/dashboard/landlord/properties/verification')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-900 text-white"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </LandLordLayout>
    </>
  );
}
