"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import Button from "../../../../components/shared/buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import TenantLayout from "../../../../components/layout/TenantLayout";
import {
  applyForProperty,
  getPropertyByIdForTenant,
} from "../../../../../redux/slices/propertySlice";
import GoogleMapReact from "google-map-react";
import CenterModal from "../../../../components/shared/modals/CenterModal";
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";

const TenantPropertiesScreen = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [property, setProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<any>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [selectedSmokerOption, setSelectedSmokerOption] = useState<any>(null);
  const [selectedCriminalOption, setSelectedCriminalOption] =
    useState<any>(null);
  const [selectedEvictionOption, setSelectedEvictionOption] =
    useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>({
    currentEmployer: "",
    jobTitle: "",
    monthlyIncome: "",
    jobStartDate: "",
    criminalRecord: "",
    criminalRecordDetails: "",
    numberOfVehicles: "",
    petNumber: "",
    smoker: "",
    evictionHistory: "",
    evictionDetails: "",
    currentLandlord: "",
    currentAddress: "",
    reasonForLeaving: "",
    leaseStartDate: "",
    leaseEndDate: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!applicationData.currentEmployer.trim()) {
      errors.currentEmployer = "Current employer is required";
    }
    if (!applicationData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }
    if (!applicationData.monthlyIncome.trim()) {
      errors.monthlyIncome = "Monthly income is required";
    }
    if (!applicationData.jobStartDate.trim()) {
      errors.jobStartDate = "Job start date is required";
    }
    if (!applicationData.criminalRecord.trim()) {
      errors.criminalRecord = "Criminal record status is required";
    }
    if (
      applicationData.criminalRecord &&
      !applicationData.criminalRecordDetails.trim()
    ) {
      errors.criminalRecordDetails = "Criminal record details are required";
    }
    if (!applicationData.numberOfVehicles.trim()) {
      errors.numberOfVehicles = "Number of vehicles is required";
    }
    if (!applicationData.petNumber.trim()) {
      errors.petNumber = "Number of pets is required";
    }
    if (!applicationData.smoker.trim()) {
      errors.smoker = "Smoker status is required";
    }
    if (!applicationData.evictionHistory.trim()) {
      errors.evictionHistory = "Eviction history is required";
    }
    if (
      applicationData.evictionHistory &&
      !applicationData.evictionDetails.trim()
    ) {
      errors.evictionDetails = "Eviction details are required";
    }
    if (!applicationData.currentLandlord.trim()) {
      errors.currentLandlord = "Current landlord is required";
    }
    if (!applicationData.currentAddress.trim()) {
      errors.currentAddress = "Current address is required";
    }
    if (!applicationData.reasonForLeaving.trim()) {
      errors.reasonForLeaving = "Reason for leaving is required";
    }
    if (!applicationData.leaseStartDate.trim()) {
      errors.leaseStartDate = "Lease start date is required";
    }
    if (!applicationData.leaseEndDate.trim()) {
      errors.leaseEndDate = "Lease end date is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const body = {
      id: id,
      tenantId: user?.user?._id,
    };
    try {
      const response = await dispatch(getPropertyByIdForTenant(body) as any); // Pass page parameter
      setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeForSmoker = (selectedOption: any) => {
    setSelectedSmokerOption(selectedOption);
  };

  const handleChangeForCriminal = (selectedOption: any) => {
    setSelectedCriminalOption(selectedOption);
  };

  const handleChangeForEviction = (selectedOption: any) => {
    setSelectedEvictionOption(selectedOption);
  };

  const copyToClipboard = (text: any) => {
    let copyText = text;
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success(
        "Link copied, you can share this on your social media handle.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          style: {
            background: "#ffffff",
            color: "#153969",
          },
          progressStyle: {
            background: "#153969",
          },
          icon: <FaCheckCircle size={25} style={{ color: "#153969" }} />,
        }
      );
    }
  };

  const handleFileInputChange = (e: any) => {
    const files: any = Array.from(e.target.files);
    if (e.target.id === "file" && e.target.files.length > 0) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();

      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
      if (!allowedExtensions.includes(fileExtension)) {
        setApplicationData((prev: any) => ({
          ...prev,
          [e.target.id]: files[0],
        }));
        return;
      }
      setApplicationData((prev: any) => ({ ...prev, [e.target.id]: files[0] }));
    } else {
    }
  };

  const handleSubmit = async () => {
    const formData: any = new FormData();


    formData.append("propertyId", property?._id);
    formData.append("applicant", user?._id);
    formData.append("status", "New");
    formData.append("ownerId", property?.createdBy?._id);
    formData.append("currentEmployer", applicationData.currentEmployer);
    formData.append("jobTitle", applicationData.jobTitle);
    formData.append("monthlyIncome", applicationData.monthlyIncome);
    formData.append("jobStartDate", applicationData.jobStartDate);
    formData.append(
      "criminalRecordDetails",
      applicationData.criminalRecordDetails
    );
    formData.append("numberOfVehicles", applicationData.numberOfVehicles);
    formData.append("petNumber", applicationData.petNumber);
    formData.append("evictionHistory", selectedEvictionOption.value);
    formData.append("smoker", selectedSmokerOption.value);
    formData.append("criminalRecord", selectedCriminalOption.value);
    formData.append("evictionDetails", applicationData.evictionDetails);
    formData.append("currentLandlord", applicationData.currentLandlord);
    formData.append("currentAddress", applicationData.currentAddress);
    formData.append("reasonForLeaving", applicationData.reasonForLeaving);
    formData.append("leaseStartDate", applicationData.leaseStartDate);
    formData.append("leaseEndDate", applicationData.leaseEndDate);
    formData.append("file", applicationData.file);

    try {
      setLoading(true);
      await dispatch(applyForProperty(formData) as any).unwrap();
      toast.success("Your property application has been sent to the landlord");
      setApplicationData({
        currentEmployer: "",
        jobTitle: "",
        monthlyIncome: "",
        jobStartDate: "",
        criminalRecord: "",
        criminalRecordDetails: "",
        numberOfVehicles: "",
        petNumber: "",
        smoker: "",
        evictionHistory: "",
        evictionDetails: "",
        currentLandlord: "",
        currentAddress: "",
        reasonForLeaving: "",
        leaseStartDate: "",
        leaseEndDate: "",
      });
      setTimeout(() => {
        router.push("/dashboard/tenant/properties");
      }, 2000);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <ToastContainer />
            {currentStep === 1 && (
              <div className="md:p-8 p-4">
                <div>
                  <div className="text-2xl text-nrvGreyBlack mb-4 flex gap-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        router.push("/dashboard/tenant/properties");
                      }}
                    >
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.6548 5L10.8333 13.8215C10.2778 14.377 10 14.6548 10 15C10 15.3452 10.2778 15.623 10.8333 16.1785L19.6548 25"
                          stroke="#333333"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div> Property Details</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    <div className="pb-4 h-60">
                      <img
                        src={property?.property?.file}
                        alt="photo"
                        className="h-60 w-full rounded rounded-lg"
                      />
                    </div>
                    <div className="pb-4 h-60">
                      <img
                        src={property?.property?.file}
                        alt="photo"
                        className="h-60 w-full rounded rounded-lg"
                      />
                    </div>
                    <div className="pb-4 h-60">
                      <img
                        src={property?.property?.file}
                        alt="photo"
                        className="h-60 w-full rounded rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="pt-4">
                      <h2 className="text-2xl font-medium text-nrvGreyBlack pt-2">
                        {property?.property.propertyId.city},{" "}
                        {property?.property.propertyId.state}
                      </h2>
                    </div>

                    <div
                      className="flex-col flex justify-end"
                      onClick={() => setIsOpen(true)}
                    >
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M36.458 4.1665H16.6663C12.064 4.1665 8.33301 7.89746 8.33301 12.4998V37.4998C8.33301 42.1022 12.064 45.8332 16.6663 45.8332H36.458C41.0604 45.8332 44.7913 42.1022 44.7913 37.4998V12.4998C44.7913 7.89746 41.0604 4.1665 36.458 4.1665Z"
                          fill="#153969"
                          stroke="#153969"
                          stroke-width="2"
                        />
                        <path
                          d="M22.0625 28.6263C20.7526 29.5038 17.3179 31.2957 19.4099 33.5377C20.4318 34.633 21.57 35.4163 23.0008 35.4163H31.1658C32.5967 35.4163 33.735 34.633 34.7569 33.5377C36.8487 31.2957 33.4142 29.5038 32.1042 28.6263C29.0323 26.5686 25.1344 26.5686 22.0625 28.6263Z"
                          stroke="#EEF0F2"
                          stroke-width="2"
                        />
                        <path
                          d="M31.2503 18.7497C31.2503 21.0509 29.3849 22.9163 27.0837 22.9163C24.7824 22.9163 22.917 21.0509 22.917 18.7497C22.917 16.4485 24.7824 14.583 27.0837 14.583C29.3849 14.583 31.2503 16.4485 31.2503 18.7497Z"
                          stroke="#EEF0F2"
                          stroke-width="2"
                        />
                        <path
                          d="M10.4163 12.5H5.20801M10.4163 25H5.20801M10.4163 37.5H5.20801"
                          stroke="#EEF0F2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="">
                    <div className="pt-4">
                      <div className="text-md font-400 text-nrvLightGrey pt-2 flex gap-2">
                        <div>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0003 8.33317C11.8413 8.33317 13.3337 6.84079 13.3337 4.99984C13.3337 3.15889 11.8413 1.6665 10.0003 1.6665C8.15938 1.6665 6.66699 3.15889 6.66699 4.99984C6.66699 6.84079 8.15938 8.33317 10.0003 8.33317Z"
                              stroke="#999999"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.16667 13.3335C3.12433 13.8607 2.5 14.5322 2.5 15.2633C2.5 16.9589 5.85787 18.3335 10 18.3335C14.1422 18.3335 17.5 16.9589 17.5 15.2633C17.5 14.5322 16.8757 13.8607 15.8333 13.3335"
                              stroke="#999999"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M10 8.3335V15.0002"
                              stroke="#999999"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div>{property?.property.propertyId.streetAddress}</div>
                      </div>
                    </div>
                    <div
                      className="pt-2"
                      style={{ maxHeight: "50px", minHeight: "50px" }}
                    >
                      <div className="flex gap-2">
                        <Button
                          size="smaller"
                          className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                          variant="ordinary"
                          showIcon={false}
                        >
                          {property?.property.propertyId.propertyType}
                        </Button>
                        <Button
                          size="smaller"
                          className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                          variant="ordinary"
                          showIcon={false}
                        >
                          {property?.property.noOfRooms} Rooms
                        </Button>
                        <Button
                          size="smaller"
                          className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                          variant="ordinary"
                          showIcon={false}
                        >
                          {property?.property.noOfPools} Pools
                        </Button>
                        <Button
                          size="smaller"
                          className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                          variant="ordinary"
                          showIcon={false}
                        >
                          {property?.property.noOfBaths} Baths
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-xl font-medium text-nrvGreyBlack pt-4">
                      {property?.property?.rentAmount}/
                      {property?.property?.rentAmountMetrics}
                    </div>

                    <div>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        size="large"
                        className=""
                        variant="bluebg"
                        showIcon={false}
                        disabled={property?.hasApplied == true ? true : false}
                      >
                        {property?.hasApplied == true
                          ? " Applied"
                          : " Apply Now"}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-12">
                    <h2 className="mb-2 text-nrvGreyBlack font-semibold">
                      Description:
                    </h2>
                    <div className="text-md text-nrvGreyBlack">
                      {property?.property?.description}
                    </div>
                  </div>
                  <div
                    style={{ height: "30vh", width: "100%", marginTop: "30px" }}
                  >
                    <GoogleMapReact
                      // style={{borderRadius: "20px"}}
                      bootstrapURLKeys={{ key: "" }}
                      defaultCenter={defaultProps.center}
                      defaultZoom={defaultProps.zoom}
                    ></GoogleMapReact>
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="p-3 md:p-8 mb-20 md:m-4">
                <div className="flex gap-4">
                  <div onClick={() => setCurrentStep(1)}>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.6548 5L10.8333 13.8215C10.2778 14.377 10 14.6548 10 15C10 15.3452 10.2778 15.623 10.8333 16.1785L19.6548 25"
                        stroke="#333333"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="text-2xl">Tenant Screening Report 🏘️</div>
                </div>
                <p className="text-sm text-nrvLightGrey mt-4">
                  Kindly fill the necessary boxes, this is the tenant
                  application process.
                </p>

                <div className="">
                  <p className="mt-8">Applicant Details</p>
                  <div className="w-full md:flex block gap-4">
                    <div className="w-full mt-2">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Current Address"
                        inputType="text"
                        name="currentAddress"
                        value={applicationData.currentAddress}
                        onChange={handleInputChange}
                        error={errors.currentAddress} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-2">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Desired Move In Date"
                        inputType="text"
                        name="moveInDate"
                        value={applicationData.moveInDate}
                        onChange={handleInputChange}
                        error={errors.moveInDate} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-2">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Upload ID Card"
                        inputType="file"
                        name="file"
                        //value={applicationData.file}
                        onChange={handleFileInputChange}
                        error={errors.file} // Corrected error prop name
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="mt-8">Employment Verification</p>
                  <div className="w-full gap-4 md:flex block">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Current Employer"
                        inputType="text"
                        name="currentEmployer"
                        value={applicationData.currentEmployer}
                        onChange={handleInputChange}
                        error={errors.currentEmployer} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Position/Job Title"
                        inputType="text"
                        name="jobTitle"
                        value={applicationData.jobTitle}
                        onChange={handleInputChange}
                        error={errors.jobTitle} // Corrected error prop name
                      />
                    </div>
                  </div>
                  <div className="w-full gap-4 md:flex block">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Employment Start Date"
                        inputType="date"
                        name="employmentStartDate"
                        value={applicationData.employmentStartDate}
                        onChange={handleInputChange}
                        error={errors.employmentStartDate} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Monthly Income"
                        inputType="text"
                        name="monthlyIncome"
                        value={applicationData.monthlyIncome}
                        onChange={handleInputChange}
                        error={errors.monthlyIncome} // Corrected error prop name
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="mt-8">Rental History</p>
                  <div className="w-full gap-4 md:flex block">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Current Landlord"
                        inputType="text"
                        name="currentLandlord"
                        value={applicationData.currentLandlord}
                        onChange={handleInputChange}
                        error={errors.currentLandlord} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Current Address"
                        inputType="text"
                        name="currentAddress"
                        value={applicationData.currentAddress}
                        onChange={handleInputChange}
                        error={errors.currentAddress} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Lease Start Date"
                        inputType="date"
                        name="leaseStartDate"
                        value={applicationData.leaseStartDate}
                        onChange={handleInputChange}
                        error={errors.leaseStartDate} // Corrected error prop name
                      />
                    </div>
                  </div>
                  <div className="w-full gap-4 md:flex block">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Lease End Date"
                        inputType="text"
                        name="leaseEndDate"
                        value={applicationData.leaseEndDate}
                        onChange={handleInputChange}
                        error={errors.leaseEndDate} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Reason for Living"
                        inputType="text"
                        name="reasonForLeaving"
                        value={applicationData.reasonForLeaving}
                        onChange={handleInputChange}
                        error={errors.reasonForLeaving} // Corrected error prop name
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  <p className="mt-8">Criminal Background Check</p>
                  <div className="w-full md:flex block  gap-4">
                    <div className="w-full mt-5">
                      <SelectField
                        label="Do you have any criminal record?"
                        name="criminalRecord"
                        onChange={handleChangeForCriminal}
                        options={[
                          { value: "true", label: "YES" },
                          { value: "false", label: "NO" },
                        ]}
                        placeholder="[Yes/No]"
                        value={selectedCriminalOption}
                      />
                    </div>

                    <div className="w-full mt-4">
                      <InputField
                        label="Enter Criminal Details"
                        css="bg-nrvLightGreyBg"
                        placeholder="Criminal Record Details"
                        inputType="text"
                        name="criminalRecordDetails"
                        value={applicationData.criminalRecordDetails}
                        onChange={handleInputChange}
                        // error={errors.streetAddress} // Corrected error prop name
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="mt-8">Referencees</p>
                  <div className="w-full md:flex block  gap-4">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Full Name"
                        inputType="text"
                        name="referenceFullName"
                        value={applicationData.referenceFullName}
                        onChange={handleInputChange}
                        // error={errors.streetAddress} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Phone Number"
                        inputType="text"
                        name="referencePhoneNumber"
                        value={applicationData.referencePhoneNumber}
                        onChange={handleInputChange}
                        // error={errors.streetAddress} // Corrected error prop name
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="mt-8">Eviction History</p>
                  <div className="w-full md:flex block  gap-4">
                    <div className="w-full mt-5">
                      <SelectField
                        label="Any Eviction Records?"
                        name="evictionHistory"
                        onChange={handleChangeForEviction}
                        options={[
                          { value: "true", label: "YES" },
                          { value: "false", label: "NO" },
                        ]}
                        placeholder="[Yes/No]"
                        value={selectedEvictionOption}
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Eviction Record Details"
                        inputType="text"
                        name="evictionDetails"
                        value={applicationData.evictionDetails}
                        onChange={handleInputChange}
                        label="Enter Eviction Details"
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <p className="mt-8">General Information</p>

                  <div className="w-full md:flex block  gap-4">
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg"
                        placeholder="Enter number of pets"
                        label="How many pets do you have?"
                        inputType="text"
                        name="petNumber"
                        value={applicationData.petNumber}
                        onChange={handleInputChange}
                        // error={errors.streetAddress} // Corrected error prop name
                      />
                    </div>
                    <div className="w-full mt-5">
                      <SelectField
                        label="Do you Smoke?"
                        name="smoker"
                        onChange={handleChangeForSmoker}
                        options={[
                          { value: "true", label: "YES" },
                          { value: "false", label: "NO" },
                        ]}
                        placeholder="[Yes/No]"
                        value={selectedSmokerOption}
                      />
                    </div>
                    <div className="w-full mt-4">
                      <InputField
                        css="bg-nrvLightGreyBg h-30"
                        placeholder="Number of Vehicles"
                        inputType="text"
                        name="numberOfVehicles"
                        label="How many vehicles do you have? "
                        value={applicationData.numberOfVehicles}
                        onChange={handleInputChange}
                        // error={errors.streetAddress} // Corrected error prop name
                      />
                    </div>
                  </div>
                  <div className="flex mt-4 justify-center">
                    <Button
                      onClick={() => handleSubmit()}
                      size="large"
                      className=""
                      variant="bluebg"
                      showIcon={false}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TenantLayout>
          <CenterModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <div className="flex justify-end" onClick={() => {}}>
              <svg
                onClick={() => {
                  copyToClipboard(
                    `https://nrv-frontend.vercel.app/dashboard/tenant/properties/${property._id}`
                  );
                }}
                className="cursor-pointer"
                width="54"
                height="54"
                viewBox="0 0 54 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1.25"
                  y="1.25"
                  width="51.5"
                  height="51.5"
                  rx="25.75"
                  stroke="#153969"
                  stroke-width="1.5"
                />
                <path
                  d="M22.5 31.5001C22.5 27.2574 22.5 25.1361 23.818 23.818C25.1361 22.5 27.2574 22.5 31.5001 22.5H33.0001C37.2427 22.5 39.364 22.5 40.6821 23.818C42.0001 25.1361 42.0001 27.2574 42.0001 31.5001V33.0001C42.0001 37.2427 42.0001 39.364 40.6821 40.6821C39.364 42.0001 37.2427 42.0001 33.0001 42.0001H31.5001C27.2574 42.0001 25.1361 42.0001 23.818 40.6821C22.5 39.364 22.5 37.2427 22.5 33.0001V31.5001Z"
                  stroke="#153969"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M34.5 22.5001C34.4964 18.0644 34.4294 15.7668 33.1381 14.1937C32.8888 13.8898 32.6103 13.6113 32.3065 13.3619C30.6469 12 28.1814 12 23.2501 12C18.3188 12 15.8532 12 14.1937 13.3619C13.8898 13.6113 13.6113 13.8898 13.3619 14.1937C12 15.8532 12 18.3188 12 23.2501C12 28.1814 12 30.6469 13.3619 32.3065C13.6113 32.6103 13.8898 32.8888 14.1937 33.1381C15.7668 34.4294 18.0644 34.4964 22.5001 34.5"
                  stroke="#153969"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div className="mx-auto text-center p-4 md:w-4/5 w-full">
              <div className="flex justify-center">
                <svg
                  width="38"
                  height="37"
                  viewBox="0 0 38 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.75 1L1.5 9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 2.75V36H10.25C6.95017 36 5.30025 36 4.27513 34.9748C3.25 33.9497 3.25 32.2998 3.25 29V9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19 9.75L36.5 18.5"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.5 35.9995H27.75C31.0498 35.9995 32.6997 35.9995 33.7248 34.9743C34.75 33.9492 34.75 32.2993 34.75 28.9995V17.625"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M29.5 15V9.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.25 16.75H12M10.25 23.75H12"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26 22H27.75"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26.875 36V29"
                    stroke="#153969"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-nrvDarkBlue font-semibold text-xl">
                Contact Info
              </h2>
              <p className="text-nrvLightGrey text-md">
                Here are the contact details of this landlord
              </p>

              <ul className="list-disc">
                <li className="mb-2 flex md:items-center items-start mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue md:text-md text-sm pr-3 font-medium">
                    Phone Number :
                    <span className="text-nrvLightGrey pl-1.5">
                      {property?.property.propertyId.createdBy?.phoneNumber}
                    </span>
                  </div>
                </li>

                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvDarkBlue rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvDarkBlue md:text-md text-sm pr-3 font-medium">
                    Mail Address :
                    <span className="text-nrvLightGrey pl-1.5">
                      {property?.property.propertyId.createdBy?.email}
                    </span>
                  </div>
                </li>
                <div className="mt-4">
                  <Button
                    size="large"
                    variant="primary"
                    showIcon={false}
                    className="block w-full"
                  >
                    Message
                  </Button>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    size="large"
                    variant="lightGrey"
                    showIcon={false}
                    className="block w-full"
                  >
                    Close
                  </Button>
                </div>
              </ul>
            </div>
          </CenterModal>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default TenantPropertiesScreen;
