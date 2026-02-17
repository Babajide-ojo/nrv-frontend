"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { toast, ToastContainer } from "react-toastify";
import { requestVerification } from "@/redux/slices/verificationSlice";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";


export default function OnboardTenant() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nin: "",
    landlordDisplayName: "",
  });
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
                    placeholder="Enter your First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Last Name</label>
                  <Input
                    placeholder="Enter your Last Name"
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
