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
import { FcBusinessContact, FcCallback, FcContacts, FcHome, FcInvite, FcVoicemail } from "react-icons/fc";

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
            <div className="container mx-auto md:p-8 p-2 rounded-lg w-full block md:gap-8 justify-center">
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
                          <h1 className="text-md font-semibold text-nrvDarkBlue">
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
                <>
            
                  <div className="w-full">
                  {/* <p className="font-medium text-nrvGreyBlack text-md  whitespace-nowrap">
                    Tenant Screening Report
                  </p> */}
                 
                    <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-8">
                      {tenantHistory.length > 0 ? (
                        tenantHistory.map((item) => (
                          <div
                          key={item._id}
                          className="mx-auto p-4 mb-2  bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl w-full"
                        >
                          <div className="">
             
                              <h2 className="md:text-xs text-[10px] font-normal text-center text-gray-600">
                                {item.propertyId.propertyId.streetAddress}, {item.propertyId.propertyId.city}, {item.propertyId.propertyId.state}
                              </h2>
                    
                        
                            <div className="grid grid-cols-2 gap-3 mb-3 mt-4">
                              <div className="text-center">
                                <p className="text-xs text-gray-600">Rent Start Date</p>
                                <p className="text-[10px] font-normal text-[#187bca]">{formatDateToWords(item.rentStartDate)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-600">Rent End Date</p>
                                <p className="text-[10px] font-normal text-[#187bca]">{formatDateToWords(item.rentEndDate)}</p>
                              </div>
                            </div>
                        
                            <div className="mt-3 text-center">
                              <p className="text-xs text-gray-600">Rent Duration</p>
                              <p className="text-[10px] font-normal text-[#187bca]">
                                {calculateDateDifference(item.rentStartDate, item.rentEndDate)}
                              </p>
                            </div>
                        
                            <div className="mt-3">
                              <p className="text-xs text-gray-800 font-medium mb-2">Landlord Details</p>
                              <div className="text-xs text-gray-800 mt-1">
                                <div className="flex gap-1"><FcContacts size={16} /> {item.ownerId.firstName} {item.ownerId.lastName}</div>
                             
                              
                                <div className="flex gap-4 mt-1">
                                <div className="w-1/2 flex gap-1"> <FcInvite size={16} /> {item.ownerId.email} </div>
                                <div className="w-1/2 flex gap-1 justify-end"> <FcCallback size={16} />  {item.ownerId.phoneNumber} </div>
                                </div>
                         
                           
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        
                        
                        ))
                      ) : (
                        <p className="text-center text-gray-500 text-nrvDarkBlue">
                          No Tenant history Available.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default VerificationScreen;
