"use client";

import { useState } from "react";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Carousel from "./Carousel";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetPassword } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineKey } from "react-icons/md";

interface FormData {
 token: string,
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};


    if (!formData.newPassword.trim()) {
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
          <div className="text-2xl text-nrvGreyBlack font-semibold">
             Reset Password
          </div>
          <div className="pt-2 text-nrvLightGrey text-md">
          Enter and confirm your new password, don’t forget this one again :)
          </div>
          <div className="pt-1 text-nrvLightGrey text-md flex gap-2">
    
          </div>
    
          <div className="flex items-center w-full mt-6">

          </div>
          <div className="mt-2">
            <InputField
              label="Confirmation Code"
              placeholder="Enter your confirmation code"
              inputType="text"
              name="token"
              onChange={handleInputChange}
              error={errors.token}
              icon={<MdOutlineMail size={20} color="#999999" />}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Password"
              placeholder="Enter a new password"
              inputType={showPassword ? "text" : "password"}
              name="newPassword"
              onChange={handleInputChange}
              error={errors.password}
              password={true}
              icon={<MdOutlineKey size={20} color="#999999" />}
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
         
          </div>
        </div>
      </div>
      <Carousel />
    </div>
  );
};

export default ResetPasswordScreen;
