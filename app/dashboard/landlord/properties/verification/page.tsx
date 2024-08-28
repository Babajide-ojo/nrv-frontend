"use client";
import { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import Button from "../../../../components/shared/buttons/Button";
import { useDispatch } from "react-redux";
import { tenantRentalHistory } from "../../../../../redux/slices/propertySlice";
import { Form, Formik, FormikHelpers } from "formik";
import FormikInputField from "@/app/components/shared/input-fields/FormikInputField";
import * as yup from "yup";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHouse } from "react-icons/fa6";

const VerificationScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [tenantHistory, setTenantHistory] = useState<any[]>([]);
  const [view, setView] = useState<"form" | "history">("form"); // Manage which view to display

  // Define a type for the function parameters
  type AddTenantFunction = (
    values: any,
    formikHelpers: FormikHelpers<any>,
    dispatch: ThunkDispatch<any, any, AnyAction>
  ) => Promise<void>;

  const getTenantHistory: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(tenantRentalHistory(values))) as any;

      if (result.error) {
        toast.error(
          result.payload || "Failed to fetch tenant history. Please try again."
        );
      } else {
        toast.success("Tenant history retrieved successfully");
        setTenantHistory(result.payload.data || []); // Set tenant history data
        setView("history"); // Switch to history view
        resetForm(); // Reset form fields after successful submission
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  const validationSchema = yup.object({
    nin: yup
      .string()
      .required("NIN is required")
      .length(11, "NIN must be 11 characters long"),
  });

  const formatDateToWords = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const calculateDateDifference = (
    startDateString: string,
    endDateString: string
  ) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (endDate < startDate) {
      throw new Error("End date must be after start date.");
    }

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }, and ${days} day${days !== 1 ? "s" : ""}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <ToastContainer />
          <LandLordLayout>
            <div className="container mx-auto p-8 rounded-lg w-full md:flex block md:gap-8 justify-center">
              {view === "form" ? (
                <div className="md:w-1/2 w-full md:p-8">
                  <Formik
                    initialValues={{ nin: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, formikHelpers) =>
                      getTenantHistory(values, formikHelpers, dispatch)
                    }
                  >
                    {({ isSubmitting, isValid, dirty }) => (
                      <Form>
                        <div className="text-center mb-8">
                          <h1 className="text-lg font-semibold text-nrvDarkBlue">
                            Tenant Verification with NIN
                          </h1>
                        </div>
                        <div className="mb-6">
                          <FormikInputField
                            css="bg-[#eef0f2]"
                            name="nin"
                            placeholder="Enter National Identification Number"
                            className="w-full p-3 rounded border border-gray-300"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="large"
                          className="w-full"
                          variant="lightGrey"
                          showIcon={false}
                          disabled={isSubmitting || !isValid || !dirty}
                        >
                          {isSubmitting ? "Loading..." : "Submit"}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              ) : (
                <div className="mt-8 w-full flex">
                  <div className="w-2/5">
                    <div className="mb-8">
                      <p className="text-md font-medium text-nrvDarkBlue">
                        Applicant Personal Information
                      </p>
                      <p className="text-xs mt-2 text-nrvGrayText text-light">
                        {tenantHistory[0].applicant.firstName}{" "}
                        {tenantHistory[0].applicant.lastName}
                      </p>
                      <p className="text-xs mt-2 text-nrvGrayText text-light">
                        {tenantHistory[0].applicant.email}{" "}
                        {tenantHistory[0].applicant?.phoneNumber || " "}
                      </p>
                      <p className="text-xs mt-2 text-nrvGrayText text-light">
                       National Identification Number : {tenantHistory[0].applicant.nin}
                      </p>
                    </div>
                  </div>
                  <div className="w-4/5">
                    {/* <p className="text-md font-medium mb-4 text-nrvDarkBlue">
                      Applicant Rental History
                    </p> */}
                    {tenantHistory.length > 0 ? (
                      tenantHistory.map((item) => (
                        <div
                          key={item._id}
                          className=" p-4 mb-4 rounded-lg bg-white "
                        >
                          <div>
                            <div className="text-[14px] font-light text-nrvGrayText mb-4 text-center">
                            <FaHouse className="text-nrvDarkBlue" />  {item.propertyId.propertyId.streetAddress},{" "}
                              {item.propertyId.propertyId.city},{" "}
                              {item.propertyId.propertyId.state}
                            </div>
                            <div className="relative flex items-center justify-between">
                              <div className="date-section text-center flex-grow">
                                <p className="text-xs text-nrvDarkBlue font-medium">
                                  Rent Start Date
                                </p>
                                {/* <hr className="my-2 border-t-2 border-gray-300" /> */}
                                <p className="text-xs text-nrvGrayText">
                                  {formatDateToWords(item.rentStartDate)}
                                </p>
                              </div>
                              <div className="absolute inset-x-0 flex justify-center">
                                <div className="arrow"></div>
                              </div>
                              <div className="date-section text-center flex-grow">
                                <p className="text-xs text-nrvDarkBlue  font-medium">
                                  Rent End Date
                                </p>
                                {/* <hr className="my-2 border-t-2 border-gray-300" /> */}
                                <p className="text-xs text-nrvGrayText">
                                  {formatDateToWords(item.rentEndDate)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 text-xs text-nrvGrayText text-center font-light">
                              Rent Duration :{" "}
                              {calculateDateDifference(
                                item.rentStartDate,
                                item.rentEndDate
                              )}
                            </div>
                          </div>
                          <div className="date-section text-center flex-grow mt-4">
                            <p className="text-xs text-nrvDarkBlue  font-medium">
                              Landlord Details
                            </p>
                            <hr></hr>
                            <div className="text-xs text-nrvGrayText mt-2">
                              {item.ownerId.firstName} {item.ownerId.firstName}
                              <br></br>
                              {item.ownerId.email} | {item.ownerId.phoneNumber}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 text-nrvDarkBlue">
                        No tenant history available.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default VerificationScreen;
