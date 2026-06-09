"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdOutlineKey, MdOutlineMail } from "react-icons/md";

const Carousel = dynamic(() => import("./Carousel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gradient-to-br from-[#03442C] to-[#022419]" />
  ),
});

interface FormData {
  token: string;
  newPassword: string;
}

const ResetPasswordScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    token: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!formData.token.trim()) {
      nextErrors.token = "Confirmation code is required";
    }

    if (!formData.newPassword.trim()) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(resetPassword(formData) as any).unwrap();
      toast.success("Password reset successfully");
      router.push("/sign-in");
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-jakarta flex flex-col lg:flex-row min-h-screen min-h-[100dvh] bg-gray-100 overflow-x-hidden">
      <div className="hidden lg:block lg:shrink-0 lg:w-1/2 lg:max-w-[50%]">
        <Carousel />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-md mx-auto w-full min-w-0">
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/nrvlogo.jpg"
                alt="NaijaRentVerify"
                width={200}
                height={50}
                className="h-9 sm:h-10 w-auto max-w-[min(240px,88vw)] object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 font-light leading-relaxed">
            Enter the code we sent to your email and choose a new password.
          </p>

          <div className="mt-6 space-y-4">
            <InputField
              label="Confirmation Code"
              placeholder="Enter your confirmation code"
              inputType="text"
              name="token"
              value={formData.token}
              onChange={handleInputChange}
              error={errors.token}
              icon={<MdOutlineMail size={20} color="#999999" />}
            />

            <InputField
              label="New Password"
              placeholder="Enter a new password"
              inputType="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.password}
              password={true}
              icon={<MdOutlineKey size={20} color="#999999" />}
            />
          </div>

          <Button
            size="large"
            className="block w-full mt-6 font-medium text-[16px]"
            variant="darkPrimary"
            showIcon={false}
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>

          <p className="text-center mt-4 text-sm text-gray-500">
            Back to{" "}
            <Link
              href="/sign-in"
              className="font-medium text-nrvPrimaryGreen hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
