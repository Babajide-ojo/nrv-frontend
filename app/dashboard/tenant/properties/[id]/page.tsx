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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Copy,
  Facebook,
  Linkedin,
  Star,
  Twitter,
} from "lucide-react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Label } from "@/components/ui/label";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfToday } from "date-fns";

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
      const response = await dispatch(getPropertyByIdForTenant(body) as any);
      const raw = response?.payload?.data?.property; // Pass page parameter
      console.log({ raw });

      let mapped = {
        title: raw?.apartmentType + " • " + raw?.apartmentStyle,
        imageUrl: raw?.propertyId.file,
        price: raw?.rentAmount,
        apartmentName: raw?.apartmentType,
        address: `${raw?.propertyId.streetAddress}, ${raw?.propertyId.city}, ${raw.propertyId.state}`,
        description: raw?.description,
        flatNumber: raw?.roomId,
        bedrooms: raw?.noOfRooms,
        bathrooms: raw?.noOfBaths,
        amenities: raw?.otherAmentities,
        owner: {
          name: `${raw?.propertyId.createdBy.firstName} ${raw?.propertyId.createdBy.lastName}`,
          email: raw?.propertyId.createdBy.email,
          phoneNumber: raw?.propertyId.createdBy.phoneNumber,
          id: raw?.propertyId.createdBy._id, 
          reviews: 345,
          imageUrl: "/owner.jpg", // placeholder
        },
      };

      console.log({ mapped });

      setProperty(mapped);
      //setProperty(response?.payload?.data);
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


  const handleSubmit = async (value: any) => {
    console.log({property});
    
    const formData: any = new FormData();

    formData.append("propertyId", id);
    formData.append("applicant", user?._id);
    formData.append("status", "New");
    formData.append("ownerId", property?.owner.id);
    formData.append("currentEmployer", value.currentEmployer);

    formData.append("monthlyIncome", value.monthlyIncome);

    formData.append("currentAddress", value.currentResidence);
    formData.append("reasonForLeaving", value.reasonForLeaving);
    formData.append("file", selectedFiles);

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
              <div className="p-6 max-w-6xl mx-auto">
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row p-6 border-b border-gray-200">
                  {/* Left Side: Back + Titles */}
                  <div className="flex items-start md:items-center gap-4">
                    <BackIcon />
                    <div className="border-l h-6 mx-2 hidden md:block"></div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        View Property Listings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Two Master Bedroom All En–Suite Apartment
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <Button
                      variant="ordinary"
                      className="text-green-700 border-green-600"
                    >
                      Add to Favourite
                    </Button>

                    <Copy className="w-4 h-4" />

                    <Twitter className="w-4 h-4 text-gray-500" />

                    <Facebook className="w-4 h-4 text-gray-500" />

                    <Linkedin className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="rounded-2xl">
                    <img
                      src={property.imageUrl}
                      alt="property"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="mt-[-60px] flex justify-center">
                      <div className="w-3/5">
                        <Button
                          className="w-full mt-4 bg-white text-black text-lg py-2"
                          onClick={() => setCurrentStep(2)}
                        >
                          Apply Now!
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-[#475367] text-[13px] font-light">
                          Price (Per Annum):
                        </p>
                        <h3 className="text-[#1D2739] text-[14px]">
                          ₦{property?.price?.toLocaleString()}
                        </h3>
                      </div>
                      <div>
                        <p className="text-[#475367] text-[13px] font-light">
                          Property Owner Contact Info
                        </p>
                        <Button
                          variant="ordinary"
                          className="p-0 text-green-600"
                        >
                          View Contact Information
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <p className="text-[#475367] text-[13px] font-light">
                          Apartment Name
                        </p>
                        <p className="text-[#1D2739] text-[14px]">
                          {property?.apartmentName}
                        </p>
                      </div>
                      <div className="w-2/3">
                        <p className="text-[#475367] text-[13px] font-light">
                          Apartment Address/Location
                        </p>
                        <p className="text-[#1D2739] text-[14px]">
                          {property?.address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#475367] text-[13px] font-light">
                        Description
                      </p>
                      <p className="text-[#1D2739] text-[14px] leading-8">
                        {property?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[#475367] text-[13px] font-light">
                          Flat Number
                        </p>
                        <p className="text-[#1D2739] text-[14px]">
                          {property?.flatNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#475367] text-[13px] font-light">
                          Number of Bedrooms
                        </p>
                        <p className="text-[#1D2739] text-[14px]">
                          {property?.bedrooms}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#475367] text-[13px] font-light">
                          Number of Bathrooms
                        </p>
                        <p className="text-[#1D2739] text-[14px]">
                          {property?.bathrooms}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#475367] text-[13px] font-light mb-2">
                        Apartment Facilities/Amenities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {property?.amenities?.map((amenity: any, idx: any) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-green-700 border-green-400"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Card className="flex items-center gap-4 p-4 mt-4">
                      <img
                        src={property?.owner?.imageUrl}
                        alt="owner"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{property?.owner?.name}</p>
                        <p className="text-sm text-gray-600">
                          {property?.owner?.email}
                        </p>
                        <div className="flex items-center text-sm text-yellow-500">
                          <Star className="w-4 h-4 mr-1" fill="currentColor" />
                          {property?.owner?.reviews} Reviews
                        </div>
                      </div>
                    </Card>
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
                    desiredMoveInDate: new Date(),
                    currentEmployer: "",
                    reasonForLeaving: "",
                    ownerId: user?._id,
                  }}
                  // validationSchema={validationSchema}
                  onSubmit={(values, formikHelpers) => handleSubmit(values)}
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
                        <div className="text-2xl">
                          Tenant Screening Report 🏘️
                        </div>
                      </div>
                      <p className="text-sm text-nrvLightGrey mt-4">
                        Kindly fill the necessary boxes, this is the tenant
                        application process.
                      </p>
                      <div
                        className=""
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <div className="w-full gap-3">
                          <div className="w-full mt-8 md:mt-0">
                            <div>
                              <Label>Desired Move In Date</Label>
                              <div className="h-11 rounded-sm border border-[#E0E0E6] mt-4 px-2">
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DatePicker
                                    value={values.desiredMoveInDate}
                                    minDate={startOfToday()}
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        size: "small",
                                        variant: "standard",
                                        InputProps: {
                                          disableUnderline: true,
                                        },
                                        sx: {
                                          fontSize: "12px",
                                         // backgroundColor: "white",
                                          boxShadow: "none",
                                          "&:hover": {
                                            boxShadow: "none",
                                            borderColor: "#E0E0E6",
                                          },
                                          "& .Mui-focused": {
                                            boxShadow: "none",
                                          },
                                          "& input": {
                                            color: "#807F94",
                                            padding: "8px 4px",
                                          },
                                        },
                                      },
                                      day: {
                                        sx: {
                                          backgroundColor: "#F5F5F5",
                                          "&.Mui-selected": {
                                            backgroundColor: "#007443", // selected day
                                            color: "#ffffff",
                                          },
                                          "&.MuiPickersDay-today": {
                                            border: "1px solid #3B82F6",
                                            backgroundColor: "#007443",
                                          },
                                          "&.MuiPickersDay-today.Mui-selected":
                                            {
                                              backgroundColor: "#007443",
                                              color: "#fff",
                                            },
                                          "&:hover": {
                                            backgroundColor: "#007443",
                                            color: "#ffffff",
                                          },
                                        },
                                      },
                                    }}
                                  />
                                </LocalizationProvider>
                              </div>
                            </div>
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
                          {/* <div className="w-full mt-4">
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
                                      <SlCloudUpload
                                        size={30}
                                        fontWeight={900}
                                      />
                                    )}
                                  </div>
                                  {selectedFiles
                                    ? "Change file"
                                    : "Click to upload"}
                                </label>
                              </div>
                            </div>
                          </div> */}
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
                      {property?.owner?.phoneNumber}
                    </span>
                  </div>
                </li>

                <li className="mb-2 flex items-center mt-4">
                  <div className="h-2 w-2 bg-nrvPrimaryGreen rounded-full mr-2 text-sm"></div>
                  <div className="text-nrvPrimaryGreen md:text-md text-sm pr-3 font-medium">
                    Mail Address :
                    <span className="text-nrvLightGrey pl-1.5">
                      {property?.owner?.email}
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
