"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../shared/buttons/Button";
import {
  getApplicationsByLandlordId,
  updateApplicationStatus,
} from "../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaPlus, FaPlusCircle } from "react-icons/fa";
import CenterModal from "../../shared/modals/CenterModal";
import { Form, Formik, FormikHelpers } from "formik";
import FormikInputField from "../../shared/input-fields/FormikInputField";
import * as yup from "yup";
import FormikSelectField from "../../shared/input-fields/FormikSelectField";
import { getAllLandlordApartment } from "../../../../redux/slices/propertySlice";
import {
  createUserByLandlord,
  getTenantsOnboardedByLandlord,
} from "../../../../redux/slices/userSlice";
import { AnyAction, Dispatch, ThunkDispatch } from "@reduxjs/toolkit";
import Modal from "../../shared/modals/Modal";
import DatePickerComponent from "../../shared/CustomDatePicker";
import CustomDatePicker from "../../shared/CustomDatePicker";

const TenantScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [tenents, setTenants] = useState<object[]>([]);
  const [application, setApplication] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [openAddTenantModal, setOpenAddTenantModal] = useState(false);
  const [landlordProperties, setLandlordProperties] = useState<any>([]);
  const [toggleTenantView, setToggleTenantView] =
    useState<string>("general_tenant");

  // Define a type for the function parameters
  type AddTenantFunction = (
    values: any,
    formikHelpers: FormikHelpers<any>,
    dispatch: ThunkDispatch<any, any, AnyAction>
  ) => Promise<void>;

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      page: page,
      id: user?.user?._id,
      status: "activeTenant",
    };
    try {
      const response = await dispatch(
        getApplicationsByLandlordId(formData) as any
      );
      const _response = await dispatch(
        getAllLandlordApartment(formData) as any
      );

      const formattedOptions: any = _response?.payload?.data.map(
        (item: any) => ({
          value: item._id,
          label: (
            <div className="p-2 text-sm text-nrvDarkBlue">
              <div className="text-md">{item.propertyId.streetAddress}</div>
              Apartment ID: {item.roomId}, Property Type: {item.propertyId.propertyType}
            </div>
          ),
        })
      );
      setLandlordProperties(formattedOptions);
      setProperties(response?.payload?.data);
      setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const handleSubmit = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
    };
    try {
      setIsLoading(true);
      await dispatch(updateApplicationStatus(payload) as any).unwrap();
      toast.success("Application moved to tenant", {
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
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const addTenant: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(createUserByLandlord(values))) as any;

      // Check if there is an error in the result
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to add tenant. Please try again."
          ); // Assuming payload contains the error message
        } else {
          toast.error("Failed to add tenant. Please try again.");
        }
      } else {
        toast.success("Tenant onboarded successfully");
        resetForm(); // Reset form fields after successful submission
      }
    } catch (error: any) {
      // Catch any unexpected errors
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const fetchSelfOnboardedTenantData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") || "{}");
    const currentUser = user?.user;
    const formData = {
      page: page, // Ensure 'page' is defined or passed as a parameter
      id: currentUser?._id,
    };

    try {
      const response = await dispatch(
        getTenantsOnboardedByLandlord(formData) as any
      );
      if (response?.payload?.data) {
        setTenants(response.payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const validationSchema = yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    nin: yup.string().required("NIN is required").min(11).max(11),
    rentEndDate: yup.string().required("Rent start date is required"),
    rentStartDate: yup.string().required("Rent end date is required"),
  });

  useEffect(() => {
    fetchData();
    fetchSelfOnboardedTenantData();
  }, []);
  return (
    <div>
      <ToastContainer />

      <div className="">
        <div className=" w-full md:w-2/5  max-w-full mx-auto  flex justify-between gap-8 mt-4">
          <Button
            size="large"
            className="font-light text-sm border border-nrvDarkBlue hover:bg-nrvDarkBlue hover:text-white w-1/2"
            variant="ordinary"
            showIcon={false}
            onClick={() => {
              setToggleTenantView("onboarded_tenant");
            }}
          >
            Onboarded Tenants
          </Button>
          <Button
            size="large"
            className="font-light text-sm border border-nrvDarkBlue hover:bg-nrvDarkBlue hover:text-white w-1/2"
            variant="ordinary"
            showIcon={false}
            onClick={() => {
              setToggleTenantView("general_tenant");
            }}
          >
            General Tenant
          </Button>
        </div>

        <div className=" w-full md:w-2/5  max-w-full mx-auto  flex justify-end items-end mt-2">
          <Button
            size="large"
            className="font-light text-sm border border-nrvDarkBlue hover:bg-nrvDarkBlue hover:text-white"
            variant="ordinary"
            showIcon={false}
            onClick={() => {
              setOpenAddTenantModal(true);
            }}
          >
            <FaPlus />
          </Button>
        </div>
        <div className="">
          {toggleTenantView === "general_tenant" && (
            <div>
              {currentStep === 1 && (
                <div className=" w-full md:w-2/5  max-w-full mx-auto ">
                  {properties && properties.length > 0 ? (
                    <div>
                      {properties?.map((item, index) => {
                        return (
                          <div key={index}>
                            <div
                              className="flex gap-4 bg-white mt-4 rounded rounded-2xl p-4 w-full"
                              onClick={() => {}}
                            >
                              <div>
                                <img
                                  src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1718917936/image_17_1_y9aa8e.png"
                                  alt="photos"
                                />
                              </div>
                              <div className="w-full">
                                <div className="flex gap-3">
                                  <div className="text-nrvDarkGrey font-light text-md">
                                    {item?.applicant?.firstName}{" "}
                                    {item?.applicant?.lastName}
                                  </div>
                                  <div
                                    className="border border-nrvDarkBlue text-nrvDarkBlue py-1 px-2 rounded rounded-full text-xs cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `rooms/${item?.propertyId?._id}`
                                      )
                                    }
                                  >
                                    {item?.propertyId?.roomId}
                                  </div>
                                </div>
                                <div className="text-nrvDarkBlue text-sm mt-2">
                                  {item?.applicant?.homeAddress}
                                </div>
                                {/* <div className="text-nrvLightGrey text-sm underline mt-2 cursor-pointer">
                                  view property
                                </div> */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="max-w-full w-120 rounded rounded-2xl p-4 mt-8 text-center">
                      <div className="text-md py-2">
                        {" "}
                        Your leads at your fingertips!
                      </div>
                      <div className="text-center flex mx-auto w-2/5 mt-4 text-sm text-nrvGrayText font-light">
                        Easily manage all your leads as they automatically start
                        coming in.
                      </div>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 2 && (
                <div>
                  <div className="p-3 bg-white rounded-md mx-2 my-4 text-sm flex gap-3">
                    <div
                      className="pt-1 font-light"
                      onClick={() => {
                        setCurrentStep(1);
                      }}
                    >
                      <svg
                        width="22"
                        height="12"
                        viewBox="0 0 22 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 6.75C21.4142 6.75 21.75 6.41421 21.75 6C21.75 5.58579 21.4142 5.25 21 5.25V6.75ZM0.469669 5.46967C0.176777 5.76256 0.176777 6.23744 0.469669 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.469669 5.46967ZM21 5.25L1 5.25V6.75L21 6.75V5.25Z"
                          fill="#333333"
                        />
                      </svg>
                    </div>
                    <div> Tenant Details</div>
                  </div>
                  <div className="md:flex mx-2 bg-white p-3 rounded-md border-r ">
                    <div className="md:w-2/5 w-full md:border-r">
                      <div className="mb-4 border-b pb-4 px-2 md:mr-20 mr-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack ">
                          {" "}
                          Personal Information
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            First Name{" "}
                          </span>{" "}
                          {application?.applicant?.firstName}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Last Name{" "}
                          </span>
                          {application?.applicant?.lastName}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Phone Number{" "}
                          </span>{" "}
                          {application?.applicant?.phoneNumber}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Current Address{" "}
                          </span>{" "}
                          {application?.applicant?.homeAddress}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Date Of Birth{" "}
                          </span>{" "}
                          January 1, 1990{" "}
                        </div>
                      </div>
                      <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Employment Information
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Current Employer{" "}
                          </span>{" "}
                          {application?.currentEmployer}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Job Title{" "}
                          </span>{" "}
                          {application?.jobTitle}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Monthly Income{" "}
                          </span>{" "}
                          {application?.monthlyIncome} Naira
                        </div>
                      </div>
                      <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Rental History
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Previous Landlord{" "}
                          </span>{" "}
                          {application?.currentLandlord}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Previous Address{" "}
                          </span>{" "}
                          {application?.currentAddress}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Reason for Leaving{" "}
                          </span>{" "}
                          {application?.reasonForLeaving}{" "}
                        </div>
                      </div>
                      <div className="mb-4 pb-4 px-2 md:mr-20 mr-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Background Check Results
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Criminal Record{" "}
                          </span>{" "}
                          {application?.criminalRecord === true ? "YES" : "NO"}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Eviction History{" "}
                          </span>{" "}
                          {application?.evictionHistory === true ? "YES" : "NO"}{" "}
                        </div>
                      </div>
                    </div>

                    <div className="md:w-3/5 w-full">
                      <div className="mb-4 border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack ">
                          {" "}
                          References
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Reference Full Name
                          </span>{" "}
                          {application?.applicant?.firstName}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Phone Number
                          </span>
                          {application?.applicant?.lastName}
                        </div>
                      </div>
                      <div className="mb-4  border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Additional Information
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Desired Move-in Date
                          </span>{" "}
                          {application?.applicant?.firstName}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Number of Pets{" "}
                          </span>{" "}
                          {application?.petNumber}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Smoking
                          </span>{" "}
                          {application?.smoker === true ? "YES" : "NO"}{" "}
                        </div>
                        <div className="mt-3 text-sm font-light">
                          <span className="text-nrvGreyBlack font-medium pr-3">
                            Number of Vehicles
                          </span>{" "}
                          {application?.numberOfVehicles}{" "}
                        </div>
                      </div>
                      <div className="mb-4  border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Uploaded Documents
                        </div>
                        <div className="mt-3 text-sm font-light cursor-pointer">
                          <span className="text-nrvGreyBlack font-medium pr-3 cursor-none">
                            ID Proof
                          </span>{" "}
                          <a
                            className="underline"
                            href={application?.identificationCard}
                          >
                            View ID Card
                          </a>
                        </div>
                        <div className="mt-3 text-sm font-light cursor-pointer">
                          <span className="text-nrvGreyBlack font-medium pr-3 cursor-none">
                            Income Verification
                          </span>{" "}
                          {application?.applicant?.firstName}{" "}
                        </div>
                      </div>
                      <div className="mb-4 pb-4 px-2 mr-3 md:ml-20 ml-3">
                        <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                          {" "}
                          Actions
                        </div>
                        <div className="flex mt-4 gap-4">
                          <Button
                            onClick={() => {
                              router.push(
                                `http://localhost:3000/dashboard/landlord/properties/rooms/${application.propertyId._id}`
                              );
                            }}
                            size="normal"
                            className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg rounded-md  hover:text-white hover:bg-red-400"
                            variant="mediumGrey"
                            showIcon={false}
                          >
                            {/* <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                              View Property
                            </div> */}
                          </Button>
                          <Button
                            onClick={() => {
                              setIsOpen(true);
                            }}
                            size="normal"
                            className="p-2 border border-nrvGreyMediumBg rounded-md  hover:text-white hover:bg-nrvDarkBlue"
                            variant="bluebg"
                            showIcon={false}
                          >
                            <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                              Extend Lease Date
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {toggleTenantView === "onboarded_tenant" && (
            <div>
              {tenents && tenents.length > 0 ? (
                <div className=" w-full md:w-2/5  max-w-full mx-auto ">
                  {tenents?.map((item: any, index) => {
                    return (
                      <div key={index}>
                        <div
                          className="flex gap-4 bg-white mt-4 mrounded rounded-2xl p-4"
                          onClick={() => {
                            // setApplication(item);
                            // setCurrentStep(2);
                          }}
                        >
                          <div>
                            <img
                              src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1718917936/image_17_1_y9aa8e.png"
                              alt="photos"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <div className="text-nrvDarkGrey font-light text-md">
                                {item?.applicant?.firstName}{" "}
                                {item?.applicant?.lastName}
                              </div>
                              <div
                                className="border border-nrvDarkBlue text-nrvDarkBlue py-1 px-3 rounded rounded-full text-sm cursor-pointer"
                                onClick={() =>
                                  router.push(`rooms/${item?.propertyId?._id}`)
                                }
                              >
                                {" "}
                                {item?.propertyId?.roomId}
                              </div>
                            </div>
                            <div className="text-nrvDarkBlue text-sm mt-2">
                              {item?.propertyId?.propertyId.streetAddress},{" "}
                              {item?.propertyId?.propertyId.city} ,{" "}
                              {item?.propertyId?.propertyId.state}
                            </div>
                            {/* <div className="text-nrvLightGrey text-sm underline mt-2 cursor-pointer">
                              view property
                            </div> */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="max-w-full w-120 rounded rounded-2xl p-4 mt-8 text-center">
                  <div className="text-md py-2">
                    {" "}
                    Onboard Tenant Directly on Naija Rent Verify
                  </div>
                  <div className="text-center flex mx-auto w-2/5 mt-4 text-sm text-nrvGrayText font-light">
                    Easily manage all your pre-existing tenants by onboarding
                    them without listing your apartments!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CenterModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="mx-auto text-center p-4 w-full md:w-4/5">
          <h2 className="text-nrvDarkBlue font-semibold text-xl">
            Transfer Application as Tenant
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will make this applicant the current occupant
            of this property for the designated time
          </p>

          <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="text-white w-72 max-w-full border border-nrvDarkBlue mt-2 rounded-md"
              variant="bluebg"
              showIcon={false}
            >
              <div
                className="flex gap-3"
                onClick={() => {
                  handleSubmit("activeTenant");
                }}
              >
                Submit
              </div>
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div className="flex gap-2">Close</div>
            </Button>
          </div>
        </div>
      </CenterModal>
      <Modal
        isOpen={openAddTenantModal}
        onClose={() => {
          setOpenAddTenantModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvDarkBlue font-semibold text-2xl">
            Onboard A New Tenant
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will make this applicant the current occupant
            of this property for the designated time
          </p>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              nin: "",
              propertyId: "",
              ownerId: user?._id,
              rentEndDate: "",
              rentStartDate: "",
              accountType: "tenant",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) =>
              addTenant(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values }) => (
              <Form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="firstName"
                        placeholder="Enter First Name"
                        label="First Name"
                        value={values.firstName}
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="lastName"
                        placeholder="Last Name"
                        label="Enter Last Name"
                        value={values.lastName}
                      />
                    </div>
                  </div>
                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="email"
                        placeholder="Tenant Email"
                        label="Email"
                        value={values.email}
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <FormikInputField
                        name="nin"
                        placeholder="Tenant NIN"
                        label="National Identification Number"
                        value={values.nin}
                      />
                    </div>
                  </div>

                  <div className="w-full md:flex flex-row gap-3">
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <CustomDatePicker
                        label="Rent Start Date"
                        name="rentStartDate"
                      />
                    </div>
                    <div className="md:w-1/2 w-full mt-8 md:mt-0">
                      <CustomDatePicker
                        label="Rent End Date"
                        name="rentEndDate"
                      />
                    </div>
                  </div>
                  <div className="w-full md:flex flex-row gap-3"></div>

                  <div className="w-full mt-8 md:mt-0">
                    <FormikSelectField
                      name="propertyId"
                      placeholder="Select Property"
                      label="Select Apartment"
                      options={landlordProperties}
                      isSearchable={true}
                    />
                  </div>
                </div>
                <div className="mt-4  mx-auto w-full mt-8 flex gap-4 justify-between">
                  <Button
                    type="button"
                    size="large"
                    className="block w-full"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      resetForm();
                      setOpenAddTenantModal(false);
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
      </Modal>
    </div>
  );
};

export default TenantScreen;
