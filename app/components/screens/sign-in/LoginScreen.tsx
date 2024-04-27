"use client";

import { useState } from "react";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Link from "next/link";
import Carousel from "./Carousel";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/userSlice";
import {useRouter} from "next/navigation";


interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, data } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
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
    await dispatch(loginUser(formData) as any)
      .unwrap()
      .then((data: any) => {
        localStorage.setItem("nrv-user", JSON.stringify(data)) as any;
        const userAccountType =
        data?.user?.accountType || "";

      if (userAccountType === "landlord") {
        router.push("/dashboard/landlord");
      } else if (userAccountType === "tenant") {
        router.push("/dashboard/tenant");
      }
      })
      .catch((error: any) => {
        alert(error);
      });
  };

  return (
    <div className="flex justify-center  h-screen">
      <Carousel />
      <div className="w-full sm:w-1/2 p-16 justify-center">
        <div className="max-w-md">
          <div className="text-3xl text-nrvGreyBlack font-semibold">
            Welcome Back, Samuel 🤗,
          </div>
          <div className="pt-2 text-nrvLightGrey text-md">
            Please enter your login to access your account.
          </div>
          <div className="pt-1 text-nrvLightGrey text-md flex gap-2">
            Not a landlord?{" "}
            <Link className="underline text-nrvDarkBlue" href="/">
              sign in as tenant
            </Link>
          </div>
          <div className="mt-6">
            <InputField
              label="Email Address"
              placeholder="Enter your email address"
              inputType="email"
              name="email"
              onChange={handleInputChange}
              error={errors.email}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Password"
              placeholder="Enter your password"
              inputType="password"
              name="password"
              onChange={handleInputChange}
              error={errors.password}
            />
          </div>

          <div className="mt-10">
            <Button
              size="large"
              className="block w-full"
              variant="bluebg"
              showIcon={false}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
          <div className="w-full justify-center flex gap-3 mt-4">
            <div className="text-sm text-nrvLightGrey">
              Do not have an account?
            </div>
            <Link
              href="/sign-up"
              className="text-sm underline font-light text-[#153969]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
