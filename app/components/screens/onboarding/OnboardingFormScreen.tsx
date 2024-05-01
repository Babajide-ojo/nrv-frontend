"use client";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../../redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OnboardingCard from "../../shared/cards/OnboardingCard";
import Carousel from "./Carousel";
import {
  enquiryData,
  onboardingOptions,
  processData,
} from "../../../../helpers/data";
import MarketingDetailsScreen from "./MarketingDetailsScreen";
import { IoPersonCircleSharp } from "react-icons/io5";

interface FormData {
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  familyType: string;
  rentAmount: string;
  securityDeposit: string;
}

const OnboardingFormScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [receivedData, setReceivedData] = useState<any>({
    imageLink:
      "https://res.cloudinary.com/dzv98o7ds/image/upload/v1714472980/mn9p85chmr1up9gszsrj.jpg",
    title: "Marketing",
    description:
      "Effortlessly advertise your rental on multiple platforms, reaching potential tenants without any cost.",
  });

  const [formData, setFormData] = useState<FormData>({
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    familyType: "",
    securityDeposit: "",
    rentAmount: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!formData.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    if (!formData.familyType.trim()) {
      errors.familyType = "Family type is required";
    }
    if (!formData.securityDeposit.trim()) {
      errors.securityDeposit = "Security deposit is required";
    }
    if (!formData.rentAmount.trim()) {
      errors.rentAmount = "Rent amount is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
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
      console.log({ formData });
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReceiveData = (data: any) => {
    setReceivedData(data);
  };

  return (
    <div className="">
      <ToastContainer />
      <div className="h-screen">
        <div className="">
          {currentStep === 1 && (
            <div className="flex justify-center h-screen">
              <div className="w-full sm:w-1/2 p-8 justify-center">
                <div
                  style={{
                    minHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="max-w-lg mx-auto pt-8 flex-grow">
                    <div className="text-2xl text-nrvGreyBlack font-semibold">
                      Where would you like to start? 🙂
                    </div>
                    <div className="pt-1 text-nrvLightGrey text-sm font-light">
                      What will you be joining naijarentverify as?
                    </div>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {onboardingOptions.map(
                        ({ title, imageLink, description }, index) => (
                          <div key={index}>
                            <OnboardingCard
                              onReceiveData={handleReceiveData}
                              title={title}
                              imageLink={imageLink}
                              description={description}
                            />
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        size="large"
                        className="w-72"
                        variant="lightGrey"
                        showIcon={false}
                        onClick={handleNext}
                      >
                        Select All
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="large"
                      className="w-96 mb-8"
                      variant="bluebg"
                      showIcon={false}
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
              <Carousel currentItem={receivedData} />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex justify-center h-screen">
              <MarketingDetailsScreen />
              <div className="w-full sm:w-1/2 p-8 justify-center">
                <div
                  style={{
                    minHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="max-w-lg mx-auto pt-8 flex-grow">
                    <p className="text-2xl font-semibold text-swGray800 flex gap-2">
                      <span>
                        {" "}
                        <IoIosArrowBack
                          className="mt-1 hover:cursor-pointer"
                          onClick={() => {
                            setCurrentStep(1);
                          }}
                        />{" "}
                      </span>{" "}
                      Add your rental property 🏘️
                    </p>
                    <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
                      <span className="">
                        No worries, you can change the information later
                      </span>
                    </p>
                    <div className="w-full  mt-6 flex gap-3">
                      <div className="w-2/3">
                        <InputField
                          label="Street Address"
                          placeholder="Enter Street Address"
                          inputType="text"
                          name="streetAddress"
                          onChange={handleInputChange}
                          error={errors.streetAddress} // Corrected error prop name
                        />
                      </div>
                      <div className="w-1/3">
                        <InputField
                          label="Unit (Optional)"
                          placeholder="Enter Unit"
                          inputType="text"
                          name="unit"
                          onChange={handleInputChange}
                          error={errors.unit} // Corrected error prop name
                        />
                      </div>
                    </div>
                    <div className="w-full mt-4 flex gap-3">
                      <div className="w-1/3">
                        <InputField
                          label="City"
                          placeholder="Enter City"
                          inputType="text"
                          name="city"
                          onChange={handleInputChange}
                          error={errors.city} // Corrected error prop name
                        />
                      </div>
                      <div className="w-1/3">
                        <InputField
                          label="State"
                          placeholder="Enter State"
                          inputType="text"
                          name="state"
                          onChange={handleInputChange}
                          error={errors.state} // Corrected error prop name
                        />
                      </div>
                      <div className="w-1/3">
                        <InputField
                          label="Zip Code"
                          placeholder="Enter Zip Code"
                          inputType="text"
                          name="zipCode"
                          onChange={handleInputChange}
                          error={errors.zipCode} // Corrected error prop name
                        />
                      </div>
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        label="Family Type"
                        placeholder="Enter Family Type"
                        inputType="text"
                        name="familyType"
                        onChange={handleInputChange}
                        error={errors.familyType} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4 flex gap-3">
                      <div className="w-1/2">
                        <InputField
                          label="Rent Amount"
                          placeholder="₦"
                          inputType="text"
                          name="rentAmount"
                          onChange={handleInputChange}
                          error={errors.rentAmount} // Corrected error prop name
                        />
                      </div>
                      <div className="w-1/2">
                        <InputField
                          label="Security Deposit"
                          placeholder="₦"
                          inputType="text"
                          name="securityDeposit"
                          onChange={handleInputChange}
                          error={errors.securityDeposit} // Corrected error prop name
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="large"
                      className="w-96 mb-8"
                      variant="bluebg"
                      showIcon={false}
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex justify-center h-screen">
              <MarketingDetailsScreen />
              <div className="w-full sm:w-1/2 p-8 justify-center">
                <div
                  style={{
                    minHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="max-w-lg mx-auto pt-8 flex-grow">
                    <p className="text-2xl font-semibold text-swGray800 flex gap-2">
                      <span>
                        {" "}
                        <IoIosArrowBack
                          className="mt-1 hover:cursor-pointer"
                          onClick={() => {
                            setCurrentStep(2);
                          }}
                        />{" "}
                      </span>{" "}
                      Enquiry 🏘️
                    </p>
                    <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
                      <span className="">
                        What part of the rental process are you in{" "}
                        {formData.streetAddress}
                      </span>
                    </p>
                    {enquiryData.map(({ title, description }, index) => {
                      return (
                        <div
                          key={index}
                          className={`h-30 mt-4 text-sm flex bg-white border border-nrvLightGrey rounded rounded-2xl p-3 ? "bg-gray-100" : ""
                  }`}
                          onClick={() => {}}
                        >
                          <div className="w-1/5 mx-auto flex items-center justify-center mt-2">
                            <IoPersonCircleSharp color="#153969" size={40} />
                          </div>

                          <div className="w-4/5 p-1">
                            <div className="text-nrvGreyBlack text-md font-semibold">
                              {title}
                            </div>
                            <div className="text-nrvLightGrey text-sm pt-2">
                              {description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="large"
                      className="w-96 mb-8"
                      variant="bluebg"
                      showIcon={false}
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex justify-center h-screen">
              <MarketingDetailsScreen />
              <div className="w-full sm:w-1/2 p-8 justify-center">
                <div
                  style={{
                    minHeight: "95vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="max-w-lg mx-auto pt-8 flex-grow">
                    <p className="text-2xl font-semibold text-swGray800 flex gap-2">
                      <span>
                        {" "}
                        <IoIosArrowBack
                          className="mt-1 hover:cursor-pointer"
                          onClick={() => {
                            setCurrentStep(3);
                          }}
                        />{" "}
                      </span>{" "}
                      Here’s the process 🏘️
                    </p>
                    <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
                      <span className="">
                        This is just a few steps on finding the perfect tenant.
                      </span>
                    </p>
                    {processData.map(({ title, description }, index) => {
                      return (
                        <div
                          key={index}
                          className="h-24 mt-4 text-sm flex bg-white p-3 bg-gray-100"
                          onClick={() => {}}
                        >
                          <div className="w-1/10">
                            <IoPersonCircleSharp color="#153969" size={40} />
                          </div>

                          <div className="w-9/10 p-1 ml-2">
                            <div className="text-nrvDarkBlue text-md font-semibold">
                              {title}
                            </div>
                            <div className="text-nrvLightGrey text-sm pt-2">
                              {description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      size="large"
                      className="w-96 mb-8"
                      variant="bluebg"
                      showIcon={false}
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFormScreen;
