import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import { createUser } from "../../../../redux/slices/userSlice";
import SignUppVerifyAccountScreen from "./SignUpVerifyAccountScreen";
import Button from "@/app/components/shared/buttons/Button";
import CheckBox from "@/app/components/shared/input-fields/CheckBox";
import { IoPersonCircleSharp, IoCheckmarkCircleSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import InputField from "@/app/components/shared/input-fields/InputFields";

// Validation schema using yup
const validationSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  nin: yup.string().required("NIN is required"),
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
  phoneNumber: yup.string().required("Phone Number is required"),
  homeAddress: yup.string().required("Home Address is required"),
  accountType: yup.string().required("Account Type is required"),
});

// Custom InputField component
const CustomInputField = ({ name , type,  ...props }: any) => {
  console.log({type});
  
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  const handleBlur = (event: any) => {
    const { name } = event.target;
    setFieldTouched(name, true);
  };

  return (
    <div className="w-full mt-4">
      <InputField
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        inputType={type}
        {...props}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
  );
};

const SignUpMultiForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
 // const { loading, error, data } = useSelector((state: any) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [accountType, setAccountType] = useState<string>("");

  const handleItemClick = (index: number) =>
    setActiveIndex(index === activeIndex ? null : index);
  const handleAccountType = (text: string) => setAccountType(text);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(createUser(values) as any).unwrap();
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="container">

      {currentStep === 1 && (
        <div
          style={{
            minHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="max-w-md mx-auto pt-8 flex-grow w-full">
            <div className="text-2xl text-nrvGreyBlack font-semibold">
              Welcome user 🚀
            </div>
            <div className="pt-2 text-nrvGrayText text-md font-light">
              What will you be joining naijarentverify as?
            </div>
            <div
              className={`mt-4 text-sm flex bg-white border border-nrvLightGrey rounded rounded-2xl p-3 ${
                activeIndex === 0 ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                handleItemClick(0);
                handleAccountType("landlord");
                setCurrentStep(2)
              }}
            >
              <div className="flex items-center justify-center">
                <IoPersonCircleSharp color="#153969" size={40} />
              </div>
              <div className="p-1.5">
                <div className="text-nrvGreyBlack text-lg font-medium pb-2">
                  Sign up as a landlord
                </div>
                <div className="text-nrvGreyBlack text-md font-medium">
                  Explore our powerful tools for thorough tenant screening.
                </div>
              </div>
              {activeIndex === 0 && (
                <div className="top-0 right-0">
                  <IoCheckmarkCircleSharp color="#153969" size={25} />
                </div>
              )}
            </div>
            <div
              className={`mt-4 text-sm flex bg-white border border-nrvLightGrey rounded rounded-2xl p-3 ${
                activeIndex === 1 ? "bg-gray-100" : ""
              }`}
              onClick={() => {
                handleItemClick(1);
                handleAccountType("tenant");
                setCurrentStep(2)
              }}
            >
              <div className="flex items-center justify-center">
                <IoPersonCircleSharp color="#153969" size={40} />
              </div>
              <div className="p-2">
                <div className="text-nrvGreyBlack text-lg font-medium pb-2">
                  Sign up as a tenant
                </div>
                <div className="text-nrvGreyBlack text-md font-medium">
                  Explore our powerful tools for thorough tenant screening.
                </div>
              </div>
              {activeIndex === 1 && (
                <div className="top-0 right-0">
                  <IoCheckmarkCircleSharp color="#153969" size={25} />
                </div>
              )}
            </div>
            <div className="w-full justify-center flex gap-3 mt-4">
              <div className="text-sm text-nrvLightGrey">
                Already have an account?
              </div>
              <Link
                href="/sign-in"
                className="text-sm underline font-light text-[#153969]"
              >
                Log in
              </Link>
            </div>
          </div>
          {/* <div className="flex justify-center max-w-lg mx-auto w-full">
            <Button
              disabled={!accountType}
              size="large"
              className="block w-full"
              variant="bluebg"
              showIcon={false}
              onClick={() => setCurrentStep(2)}
            >
              Next
            </Button>
          </div> */}
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <div className="max-w-lg mx-auto pt-8 flex-grow w-full">
            <div className="text-2xl text-nrvGreyBlack font-semibold flex gap-2">
              <span>
                <IoIosArrowBack
                  className="mt-1 hover:cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                />
              </span>{" "}
              Sign up as a {accountType} 🚀
            </div>

            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                nin: "",
                password: "",
                phoneNumber: "",
                homeAddress: "",
                accountType: accountType,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div
                    style={{
                      minHeight: "70vh",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div>
                      <div className="w-full md:flex flex-row gap-3">
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="firstName"
                           // placeholder="Enter First Name"
                            label="Enter first name"
                          />
                        </div>
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="lastName"
                         //   placeholder="Enter Last Name"
                            label="Enter Last Name"
                          />
                        </div>
                      </div>
                      <div className="w-full md:flex flex-row gap-3">
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="email"
                         //   placeholder="Enter Email Address"
                            label="Enter Email Address"
                          />
                        </div>
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="nin"
                           // placeholder="Enter NIN"
                            label="Enter NIN"
                          />
                        </div>
                      </div>
                      <div className="w-full mt-4">
                        <CustomInputField
                          name="homeAddress"
                         // placeholder="Enter Home Address"
                          label="Enter Home Address"
                        />
                      </div>
                      <div className="w-full mt-6 md:flex flex-row gap-3">
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="phoneNumber"
                           // placeholder="Enter Phone Number"
                            label="Enter Phone Number"
                          />
                        </div>
                        <div className="md:w-1/2 w-full mt-4 md:mt-0">
                          <CustomInputField
                            name="password"
                          //  placeholder="Enter Password"
                            label="Enter Password"
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="grid:col-3 gap-2 mt-16">
                        {/* Password strength requirements buttons */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 max-w-lg mx-auto w-full">
                    <div className="w-full mb-2">
                      <CheckBox label="I agree to the terms of use and privacy policy" />
                    </div>
                    <Button
                      type="submit"
                      size="minLarge"
                      className="block w-full"
                      variant="bluebg"
                      showIcon={false}
                      disabled={isSubmitting}
                      isLoading={isSubmitting ? true : false}
                    >
                      {isSubmitting ? "Loading..." : "Submit"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
      {currentStep === 3 && <SignUppVerifyAccountScreen />}
    </div>
  );
};

export default SignUpMultiForm;
