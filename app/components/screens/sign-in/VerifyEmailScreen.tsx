"use client";

import { useState } from "react";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Link from "next/link";
import Carousel from "./Carousel";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, verifyEmail } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineKey } from "react-icons/md";

interface FormData {
  email: string;
}

const VerifyEmailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, data } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState<FormData>({
    email: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
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
      const userData = await dispatch(verifyEmail(formData) as any).unwrap();
      localStorage.setItem("nrv-user", JSON.stringify(userData));
      //const userAccountType = userData?.user?.accountType || "";

      toast.success("Password reset code sent");
      setFormData({
        email: ""
      })
      router.push('/reset-password')
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
    
      <div
        className="w-full sm:w-1/2 p-8 justify-center h-screen"
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="max-w-md mx-auto w-full">
          <div className="text-md text-nrvGreyBlack font-semibold">
            Welcome to NaijaRentVerify
          </div>
          <div className="pt-2 text-nrvLightGrey text-sm font-light">
            Please enter your login to access your account.
          </div>
          <div className="pt-1 text-nrvLightGrey text-md flex gap-2">
    
          </div>
    
          <div className="flex items-center w-full mt-6">

          </div>
          <div className="mt-2">
            <InputField
              label="Email Address"
              placeholder="Enter your email address"
              inputType="email"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              error={errors.email}
              icon={<MdOutlineMail size={20} color="#999999" />}
            />
          </div>

      
        </div>
        <div>
          <div className="max-w-md w-full flex-grow mx-auto mt-4">
            <Button
              size="large"
              className="block w-full"
              variant="bluebg"
              showIcon={false}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
            <div className="justify-center flex gap-3 mt-4">
              <div className="text-sm text-nrvLightGrey font-light">
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
      <Carousel />
    </div>
  );
};

export default VerifyEmailScreen;
