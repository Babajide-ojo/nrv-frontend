"use client";

import { useState } from "react";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Link from "next/link";
import Carousel from "./Carousel";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import { FaCheck } from "react-icons/fa";

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
  const [rememberMe, setRememberMe] = useState<boolean>(false);

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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const userData = await dispatch(loginUser(formData) as any).unwrap();
      localStorage.setItem("nrv-user", JSON.stringify(userData));
      localStorage.setItem("emailToVerify", JSON.stringify(userData));
      const userAccountType = userData?.user?.accountType || "";
      //const userData = await dispatch(loginUser(formData) as any).unwrap();
      if(userData.user.status === "inactive"){
        localStorage.setItem("stepToLoad", JSON.stringify(3));
        router.push("/sign-up")
      }
      if (userAccountType === "landlord" && userData.user.status === "active") {
        router.push("/dashboard/landlord");
      } else if (userAccountType === "tenant" && userData.user.status === "active") {
        router.push("/dashboard/tenant");
      }
    } catch (error: any) {


      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-jakarta flex justify-center h-screen bg-gray-100">
      <ToastContainer />
      <Carousel />
      <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-semibold">Welcome back!</h1>
          <p className="text-gray-500 text-[16px] mt-2 font-light leading-8">
            Nice having you here again, Kindly enter the email address and password you used to create your account with us. 🔐
          </p>
          <div className="mt-6">
            <InputField
              label="Email Address"
              inputType="email"
              name="email"
              onChange={handleInputChange}
              error={errors.email}
            />
          </div>
          <div className="mt-4 relative">
            <InputField
              label="Password"
              inputType={showPassword ? "text" : "password"}
              name="password"
              onChange={handleInputChange}
              error={errors.password}
              password={true}
              startIcon="/images/password-icon.svg"
            />
          </div>
          <div className="flex items-center mt-4">
            <button
              className={`w-5 h-5 flex items-center justify-center border rounded-md transition-all ${
                rememberMe ? "bg-[#03442C] border-[#03442]" : "border-gray-400"
              }`}
              onClick={() => setRememberMe(!rememberMe)}
            ><FaCheck size={10} color={rememberMe ? "white": "#03442"} /></button>
            <label htmlFor="rememberMe" className="ml-2 text-sm cursor-pointer">
              Remember this Device
            </label>
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
            {isLoading ? "Loading..." : "Login"}
          </Button>
          <div className="text-center mt-4">
            <Link href="/forgot-password" className="text-sm text-[#645D5D] font-light">
              Forgot Password? <span className="font-medium text-nrvPrimaryGreen">Recover</span>
            </Link>
          </div>
          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-3 border py-2 rounded-md">
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/sign-up" className="text-sm text-[#645D5D] font-light">
              Are you new here? <span className="font-medium text-nrvPrimaryGreen">Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
