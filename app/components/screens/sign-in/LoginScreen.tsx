"use client";

import { useState } from "react";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Link from "next/link";
import Carousel from "./Carousel";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckBox from "../../shared/input-fields/CheckBox";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    setIsLoading(true); // Set loading state to true when starting the request
    try {
      const userData = await dispatch(loginUser(formData) as any).unwrap();
      localStorage.setItem("nrv-user", JSON.stringify(userData));
      const userAccountType = userData?.user?.accountType || "";

      if (userAccountType === "landlord" && userData.user.isOnboarded === true) {
        router.push("/dashboard/landlord");
      } else if (userAccountType === "landlord" && userData.user.isOnboarded === false) {
        router.push("/onboard/landlord")
      } else if (userAccountType === "tenant") {
        router.push("/dashboard/tenant");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center h-screen"
      style={{
        minHeight: "85vh",
      }}
    >
      <ToastContainer />
      <Carousel />
      <div
        className="w-full sm:w-1/2 p-8 justify-center h-screen"
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="max-w-md mx-auto w-full flex-grow">
          <div className="text-3xl text-nrvGreyBlack font-semibold">
            Welcome back 🤗
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
          <div className="pt-4">
            <Button
              className="w-full block"
              size="large"
              variant="whitebg"
              showIcon={false}
            >
              <div className="flex gap-1">
                <FaApple color="black" size={22} /> Sign in with Apple
              </div>
            </Button>
          </div>
          <div className="pt-4">
            <Button
              className="w-full block"
              size="large"
              variant="whitebg"
              showIcon={false}
            >
              {" "}
              <div className="flex gap-1">
                <FcGoogle size={22} /> Sign in with Google
              </div>
            </Button>
          </div>
          <div className="flex items-center w-full mt-6">
            <div className="w-5/12 border-b border-nrvLightGrey"></div>
            <div className="w-2/12 text-center text-nrvLightGrey text-sm">
              OR
            </div>
            <div className="w-5/12 border-b border-nrvLightGrey"></div>
          </div>
          <div className="mt-2">
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
              inputType={showPassword ? "text" : "password"}
              name="password"
              onChange={handleInputChange}
              error={errors.password}
            />
          </div>
          <div
            className="w-full mt-8"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            <CheckBox label="Show Password" />
          </div>
        </div>
        <div>
          <div className="max-w-md w-full flex-grow mx-auto">
            <Button
              size="large"
              className="block w-full"
              variant="bluebg"
              showIcon={false}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
            <div className="justify-center flex gap-3 mt-4">
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
    </div>
  );
};

export default LoginScreen;
