"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { createUser } from "../../../../redux/slices/userSlice";
import SignUppVerifyAccountScreen from "./SignUpVerifyAccountScreen";
import Button from "@/app/components/shared/buttons/Button";
import CheckBox from "@/app/components/shared/input-fields/CheckBox";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Carousel from "../sign-in/Carousel";
import { CheckCircle, Smile, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AccountSideBar from "./AccountSideBar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const validationSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  nin: yup.string().optional(),
  phoneNumber: yup.string().required("Phone Number is required"),
  accountType: yup.string().required("Account Type is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .matches(/\d/, "Password must contain at least one number"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUpMultiForm = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(3);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const router = useRouter();
  const handleSubmit = async (values: any) => {
    if (!isChecked) {
      toast.error("You must agree to the Terms of Use and Privacy Policy");
      return;
    }
    const { confirmPassword, ...payload } = values;
    setIsLoading(true);
    try {
      await dispatch(createUser(payload) as any).unwrap();
      setCurrentStep(3);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const stepFromStorage = localStorage.getItem("stepToLoad");
    if (stepFromStorage) {
      try {
        const parsedStep = JSON.parse(stepFromStorage);
        setCurrentStep(parsedStep);
      } catch (error) {
        console.error("Error parsing stepToLoad from localStorage:", error);
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(1);
    }
  }, []);

  return (
    <div className="font-jakarta">
      <ToastContainer />
      {currentStep === 1 && (
        <div className="flex w-full">
          <div className="hidden md:block md:w-1/2 justify-center">
            <Carousel />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full">
              {/* <div className="md:hidden my-10">
                <Image
                  src="/images/light-green-logo.svg"
                  alt="Background"
                  width={200}
                  height={50}
                />
              </div> */}
              <h1 className="text-2xl font-bold text-green-600 md:hidden my-10">
                NaijaRentVerify
              </h1>
              <h1 className="text-2xl font-bold text-black">
                Create an Account!
              </h1>
              <p className="text-gray-500 mt-2">
                Welcome to NaijarentVerify! Choose your role to get started.
                We&apos;ll tailor your experience to meet your needs.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    role: "landlord",
                    icon: <Smile className="text-green-600" />,
                    text: "Sign Up as a Property Owner/Landlord",
                    description:
                      "Sign up as a Property owner and get to explore our powerful tools for thorough tenant screening, List, manage, and grow your rental properties with ease.",
                  },
                  {
                    role: "tenant",
                    icon: <User className="text-gray-500" />,
                    text: "Sign Up as a Tenant",
                    description:
                      "Sign up as a Tenant to Find and secure your dream home with verified listings, Complete your rental agreement and payments securely without stress and extra cost or fee.",
                  },
                ].map(({ role, icon, text, description }) => (
                  <div
                    key={role}
                    className="border rounded-xl cursor-pointer"
                    onClick={() => setSelectedRole(role)}
                  >
                    <div
                      className={`flex justify-between p-4 rounded-t-xl ${
                        selectedRole === role
                          ? "bg-[#E9F4E7]"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex space-x-2">
                        {icon}
                        <span className="font-medium text-[#045D23]">
                          {text}
                        </span>
                      </div>
                      {selectedRole === role && (
                        <CheckCircle className="text-green-600" />
                      )}
                    </div>
                    <p className="text-[#03442C] border-t border p-4 font-light text-[14px] leading-6">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                size="large"
                className="block w-full mt-6 font-medium text-[16px]"
                variant={selectedRole === null ? "light" : "darkPrimary"}
                onClick={() => setCurrentStep(2)}
                disabled={!selectedRole}
              >
                Continue
              </Button>

              <Button
                size="large"
                className="w-full mt-4"
                variant="light"
                onClick={() => router.push("/")}
              >
                Return to Home Page
              </Button>
            </div>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex w-full h-screen overflow-hidden">
          <div className="hidden lg:block w-1/2 bg-[#E9F4E7]">
            <AccountSideBar />
          </div>
          <div className="w-full lg:w-1/2 bg-white p-12 pb-20 overflow-y-auto">
            <div className="max-w-md mx-auto ">
              <h1 className="text-2xl font-bold text-green-600 lg:hidden my-10">
                NaijaRentVerify
              </h1>
              <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  phoneNumber: "",
                  nin: "",
                  password: "",
                  confirmPassword: "",
                  accountType: selectedRole,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleChange, handleBlur, values, errors }) => (
                  <Form className="space-y-4">
                    {[
                      "firstName",
                      "lastName",
                      "email",
                      "phoneNumber",
                      "nin",
                      "password",
                      "confirmPassword",
                    ].map((name) => (
                      <InputField
                        key={name}
                        placeholder="Start Typing..."
                        name={name}
                        label={name
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        inputType={
                          name.includes("password")
                            ? "password"
                            : name.includes("phoneNumber")
                            ? "phone"
                            : name.includes("nin")
                            ? "nin"
                            : name.includes("email")
                            ? "email"
                            : "text"
                        }
                        value={(values as any)[name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={(errors as any)[name]}
                        password={
                          name.includes("password") ||
                          name.includes("confirmPassword")
                        }
                      />
                    ))}
                    {/* Terms and Conditions Checkbox */}
                    <CheckBox
                      label="I agree to the Terms of Use and Privacy Policy"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <p className="text-gray-600 text-sm lg:hidden">
                      Already have an account?{" "}
                      <a
                        href="/sign-in"
                        className="font-semibold text-green-900"
                      >
                        Log in here.
                      </a>
                    </p>
                    {/* Submit Button */}
                    <Button
                      variant="darkPrimary"
                      type="submit"
                      size="large"
                      className="block w-full mt-6 font-medium text-[16px]"
                      isLoading={isLoading}
                      disabled={!isChecked} // Disable if not checked
                    >
                      Continue
                    </Button>
                    <Button
                      size="large"
                      className="w-full mt-4"
                      variant="light"
                      onClick={() => router.push("/")}
                    >
                      Return to Home Page
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
      {currentStep === 3 && <SignUppVerifyAccountScreen />}
    </div>
  );
};

export default SignUpMultiForm;
