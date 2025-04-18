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
import BackIcon from "@/app/components/shared/icons/BackIcon";

import CustomDatePicker from "@/app/components/shared/CustomDatePicker";
import { Form, Formik } from "formik";
import FormikInputField from "@/app/components/shared/input-fields/FormikInputField";

import { SlCloudUpload } from "react-icons/sl";



const TenantPropertiesScreen = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [property, setProperty] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<any>(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [applicationData, setApplicationData] = useState<any>({
    currentEmployer: "",
    monthlyIncome: "",
    currentResidence: "",
    reasonForLeaving: "",
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
    console.log({files: e.target.id});
    
    if (e.target.id === "file" && e.target.files.length > 0) {
      console.log("hello");
      
      const fileExtension = files[0].name.split(".").pop().toLowerCase();

      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
      if (!allowedExtensions.includes(fileExtension)) {
        setApplicationData((prev: any) => ({
          ...prev,
          [e.target.id]: files,
        }));
        return;
      }
      setSelectedFiles(files[0]);

    } else {
    }
  };

  const handleSubmit = async (value: any) => {

    
    const formData: any = new FormData();

    formData.append("propertyId", id);
    formData.append("applicant", user?._id);
    formData.append("status", "New");
    formData.append("ownerId", property?.property.propertyId.createdBy?._id);
    formData.append("currentEmployer", value.currentEmployer);

    formData.append("monthlyIncome", value.monthlyIncome);

    formData.append("currentAddress", value.currentResidence);
    formData.append("reasonForLeaving", value.reasonForLeaving);
    formData.append("file", selectedFiles);

    console.log({formData});

    // // Check if any field in formData is empty
    // const values = Array.from(formData.values());

    // if (values.some((value) => !value)) {
    //   toast.error("Please fill in all required fields.");
    //   return;
    // }

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
                    <BackIcon />
                    <div className="text-lg text-nrvDarkGrey font-medium">
                      {" "}
                      Property Details
                    </div>
                  </div>
                  <div className="md:flex md:gap-8 block">
                    <div className="pb-4 h-100 md:w-1/2 w-full">
                      <img
                        src={property?.property?.file}
                        alt="photo"
                        className="h-100 w-full rounded rounded-lg"
                      />
                    </div>
                    <div className="md:w-1/2 w-full h-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <div className="">
                            <h2 className="text-2xl font-medium text-nrvGreyBlack">
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
                              <div>
                                {property?.property.propertyId.streetAddress}
                              </div>
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
                                variant="lightGrey"
                                showIcon={false}
                              >
                                {property?.property.propertyId.propertyType}
                              </Button>
                              <Button
                                size="smaller"
                                className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                                variant="lightGrey"
                                showIcon={false}
                              >
                                {property?.property.noOfRooms} Rooms
                              </Button>
                              <Button
                                size="smaller"
                                className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg"
                                variant="lightGrey"
                                showIcon={false}
                              >
                                {property?.property.noOfPools} Pools
                              </Button>
                              <Button
                                size="smaller"
                                className="rounded-md rounded text-nrvGreyBlack bg-nrvLightGreyBg border border-nrvDarkGrey"
                                variant="lightGrey"
                                showIcon={false}
                              >
                                {property?.property.noOfBaths} Baths
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xl font-medium text-nrvGreyBlack pt-4">
                          ₦{" "}
                          {parseInt(
                            property?.property?.rentAmount
                          ).toLocaleString()}
                          /{property?.property?.rentAmountMetrics}
                        </div>

                        <div>
                          <Button
                            onClick={() => setCurrentStep(2)}
                            size="large"
                            className=""
                            variant="bluebg"
                            showIcon={false}
                            disabled={
                              property?.hasApplied == true ? true : false
                            }
                          >
                            {property?.hasApplied == true
                              ? " Applied"
                              : " Apply Now"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12">
                    <h2 className="mb-2 text-nrvGreyBlack font-semibold">
                      Description:
                    </h2>
                    <div className="text-sm text-nrvGreyBlack font-light leading-8">
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
       

                <Formik
                  initialValues={{
                    currentResidence: "",
                    monthlyIncome: "",
                    desiredMoveInDate: "",
                    currentEmployer: "",
                    reasonForLeaving: "",
                    ownerId: user?._id,
        
                  }}
                  // validationSchema={validationSchema}
                   onSubmit={(values, formikHelpers) =>
                    handleSubmit(values)
                   }
                >
                  {({ isSubmitting, resetForm, values }) => (
                    <Form className="w-1/2 mx-auto">
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
                      <div className="" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="w-full gap-3">
                          <div className="w-full mt-8 md:mt-0">
                            <CustomDatePicker
                              name="desiredMoveInDate"
                              label="Desired Move In Date"
                              cls="bg-nrvLightGreyBg"
                            />
                          </div>
                          <div className="w-full mt-8 md:mt-0">
                            <FormikInputField
                              name="currentResidence"
                              placeholder="Current Residence Address"
                              label="Current Residence Address"
                              value={values.currentResidence}
                              css="bg-nrvLightGreyBg"
                            />
                          </div>
                        </div>
                        <div className="w-full gap-3">
                          <div className=" w-full mt-8 md:mt-0">
                            <FormikInputField
                              name="currentEmployer"
                              placeholder="Current Employer"
                              label="Current Employer"
                              value={values.currentEmployer}
                              css="bg-nrvLightGreyBg"
                            />
                          </div>
       
                          <div className="w-full mt-8 md:mt-0">
                            <FormikInputField
                              name="monthlyIncome"
                              placeholder="Current Salary Per Month"
                              label="Current Salary Per Month"
                              value={values.monthlyIncome}
                              css="bg-nrvLightGreyBg"
                            />
                          </div>

                          <div className="w-full mt-8 md:mt-0">
                            <FormikInputField
                              name="reasonForLeaving"
                              placeholder="Reason for leaving"
                              label="Reason for Leaving/Relocation"
                              value={values.reasonForLeaving}
                              css="bg-nrvLightGreyBg"
                            />
                          </div>
                          <div className="w-full mt-4">
                          <label className="text-nrvGreyBlack mb-2 text-sm">
                         Upload an Identification Card
                          </label>
                          <div
                            className="text-center w-full mt-2"
                            //onDrop={handleFileDrop}
                            onDragOver={(e) => e.preventDefault()}
                          >
                            <div className="w-full border border-nrvLightGrey rounded-lg pt-4 pb-4 text-swBlack">
                              <input
                                type="file"
                                id="file"
                                className="hidden"
                                accept=".png, .jpg , .jpeg"
                                name="file"
                                onChange={handleFileInputChange}
                              />
                              <label
                                htmlFor="file"
                                className="cursor-pointer p-2 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
                              >
                                <div className="text-center flex justify-center">
                                  {selectedFiles ? (
                                  selectedFiles.name
                                  ) : (
                                    <SlCloudUpload size={30} fontWeight={900} />
                                  )}
                                </div>
                                {selectedFiles 
                                  ? "Change file"
                                  : "Click to upload"}
                              </label>
                            </div>
                          </div>
                        </div>
                        </div>

                        <div className="w-full md:flex flex-row gap-3"></div>
                      </div>
                      <div className="mt-4  mx-auto md:w-1/2 w-full mt-8 flex gap-4 justify-between">
                        <Button
                          type="button"
                          size="large"
                          className="block w-full"
                          variant="lightGrey"
                          showIcon={false}
                          onClick={() => {
                            resetForm();
                            // setOpenAddTenantModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="large"
                          className="block w-full"
                          variant="lightGrey"
                          showIcon={false}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Loading..." : "Submit"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
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
              <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
                Contact Info
              </h2>
              <p className="text-nrvLightGrey text-md">
                Here are the contact details of this landlord
              </p>

              <ul className="list-disc">
                <li className="mb-2 flex md:items-center items-start mt-4">
                  <div className="h-2 w-2 bg-nrvPrimaryGreen rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvPrimaryGreen md:text-md text-sm pr-3 font-medium">
                    Phone Number :
                    <span className="text-nrvLightGrey pl-1.5">
                      {property?.property.propertyId.createdBy?.phoneNumber}
                    </span>
                  </div>
                </li>

                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvPrimaryGreen rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvPrimaryGreen md:text-md text-sm pr-3 font-medium">
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
