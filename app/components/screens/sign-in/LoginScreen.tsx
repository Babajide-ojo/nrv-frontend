"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Carousel from "./Carousel";
import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";
import RememberMeCheckbox from "./components/RememberMeCheckbox";
import SocialLoginButton from "./components/SocialLoginButton";

// Hooks
import { useLoginForm } from "./hooks/useLoginForm";
import { useAuthRedirect } from "./hooks/useAuthRedirect";

// Types
import { LoginFormData } from "./types";

// Constants
import { ROUTES } from "./constants";

// Redux
import { loginUser } from "@/redux/slices/userSlice";

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  //const { loading, error, data } = useSelector((state: any) => state.user);
  
  // Custom hooks
  const { formData, errors, handleInputChange, validateForm, resetForm } = useLoginForm();
  const { redirectUser } = useAuthRedirect();
  
  // Local state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = await dispatch(loginUser(formData) as any).unwrap();
      console.log({p: userData})
      localStorage.setItem("nrv-user", JSON.stringify(userData));
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
      }
      
      // Redirect user based on account type and status
      redirectUser(userData);
      
    } catch (error: any) {
      const errorMessage = error?.message || error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, formData, validateForm, rememberMe, redirectUser]);

  // Handle forgot password
  const handleForgotPassword = useCallback(() => {
    router.push(ROUTES.FORGOT_PASSWORD);
  }, [router]);

  // Handle return to home
  const handleReturnHome = useCallback(() => {
    router.push(ROUTES.HOME);
  }, [router]);

  return (
    <div className="font-jakarta flex justify-center h-screen bg-gray-100">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Left side - Carousel (hidden on mobile) */}
      <div className="hidden lg:block">
        <Carousel />
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <LoginHeader />
          
          {/* Login Form */}
          <LoginForm
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
          
          {/* Remember Me Checkbox */}
          <RememberMeCheckbox
            checked={rememberMe}
            onChange={setRememberMe}
          />
          
          {/* Login Button */}
          <Button
            size="large"
            className="block w-full mt-6 font-medium text-[16px]"
            variant="darkPrimary"
            showIcon={false}
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          
          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-[#645D5D] font-light hover:text-nrvPrimaryGreen transition-colors"
            >
              Forgot Password?{" "}
              <span className="font-medium text-nrvPrimaryGreen">Recover</span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Social Login Buttons */}

          
          {/* Return to Home Button */}
          <Button
            size="large"
            className="w-full mt-4"
            variant="light"
            onClick={handleReturnHome}
          >
            Return to Home Page
          </Button>
          
          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <Link 
              href={ROUTES.SIGN_UP} 
              className="text-sm text-[#645D5D] font-light hover:text-nrvPrimaryGreen transition-colors"
            >
              Are you new here?{" "}
              <span className="font-medium text-nrvPrimaryGreen">
                Create Account
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
