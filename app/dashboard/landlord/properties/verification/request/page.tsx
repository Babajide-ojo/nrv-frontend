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
    const landlordDisplayName = searchParams.get("landlordDisplayName");

    if (firstName) next.firstName = firstName;
    if (lastName) next.lastName = lastName;
    if (email) next.email = email;
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
          <h2 className="text-2xl font-semibold mb-6">New Verification Request</h2>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
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
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        verificationTier === "standard"
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${verificationTier === "standard" ? "text-green-700" : "text-gray-900"}`}>
                          Standard
                        </span>
                        {verificationTier === "standard" && (
                          <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        NIN Advanced, selfie + NIN, liveness check, AML screening, PEP & sanctions list.
                      </p>
                    </div>

                    <div
                      onClick={() => setVerificationTier("premium")}
                      className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        verificationTier === "premium"
                          ? "border-green-600 bg-green-50/50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${verificationTier === "premium" ? "text-green-700" : "text-gray-900"}`}>
                          Premium
                        </span>
                        {verificationTier === "premium" && (
                          <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Includes all Standard checks plus comprehensive credit score (BVN) analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard/landlord/properties/verification')}
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
