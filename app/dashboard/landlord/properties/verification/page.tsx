// "use client";
// import { useState, useEffect } from "react";
// import LoadingPage from "../../../../components/loaders/LoadingPage";
// import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
// import LandLordLayout from "../../../../components/layout/LandLordLayout";
// import Button from "../../../../components/shared/buttons/Button";
// import { useDispatch } from "react-redux";
// import { tenantRentalHistory } from "../../../../../redux/slices/propertySlice";
// import { Form, Formik, FormikHelpers } from "formik";
// import FormikInputField from "@/app/components/shared/input-fields/FormikInputField";
// import * as yup from "yup";
// import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHouse } from "react-icons/fa6";
// import {
//   FcBusinessContact,
//   FcCallback,
//   FcContacts,
//   FcHome,
//   FcInvite,
//   FcVoicemail,
// } from "react-icons/fc";
// import { formatDateToWords, calculateDateDifference } from "@/helpers/utils";
// import { AnyARecord } from "dns";
// import { FaArrowCircleLeft, FaArrowLeft } from "react-icons/fa";
// const VerificationScreen = () => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const [tenantHistory, setTenantHistory] = useState<any[]>([]);
//   const [view, setView] = useState<"form" | "history">("form"); // Manage which view to display
//   const [user, setUser] = useState<any>({});
//   // Define a type for the function parameters
//   type AddTenantFunction = (
//     values: any,
//     formikHelpers: FormikHelpers<any>,
//     dispatch: ThunkDispatch<any, any, AnyAction>
//   ) => Promise<void>;

//   const getTenantHistory: AddTenantFunction = async (
//     values,
//     { resetForm, setSubmitting },
//     dispatch
//   ) => {
//     try {
//       const result = (await dispatch(tenantRentalHistory(values))) as any;

//       if (result.error) {
//         toast.error(
//           result.payload || "Failed to fetch tenant history. Please try again."
//         );
//       } else {
//         toast.success("Tenant history retrieved successfully");
//         setTenantHistory(result.payload.data || []); // Set tenant history data
//         setView("history"); // Switch to history view
//         resetForm(); // Reset form fields after successful submission
//       }
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || "An unexpected error occurred."
//       );
//     } finally {
//       setSubmitting(false); // Reset submitting state
//     }
//   };

//   const fetchVerifiedNin = async (values: Record<string, any>) => {
//     try {
//       const result: any = await dispatch(tenantRentalHistory(values) as any);
//       if (result.error) {
//         toast.error(
//           result.payload || "Failed to fetch tenant history. Please try again."
//         );
//       } else {
//         toast.success("Tenant history retrieved successfully");
//         setTenantHistory(result.payload?.data || []); // Set tenant history data
//         setView("history"); // Switch to history view
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   };

//   const fetchData = async () => {
//     const user = JSON.parse(localStorage.getItem("nrv-user") as any);
//     setUser(user?.user);
//   };

//   const validationSchema = yup.object({
//     nin: yup
//       .string()
//       .required("NIN is required")
//       .length(11, "NIN must be 11 characters long"),
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       fetchData();
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen">
//       {isLoading ? (
//         <LoadingPage />
//       ) : (
//         <ProtectedRoute>
//           <ToastContainer />
//           <LandLordLayout>
//             <div className="container mx-auto md:p-8 p-2 rounded-lg w-full block md:gap-8 justify-center">
//               {view === "form" ? (
//                 <div className="w-full md:p-8 block md:flex gap-8">
//                   <div className="md:w-1/2 w-full p-2">
//                     <Formik
//                       initialValues={{ nin: "", userId: user?._id }}
//                       validationSchema={validationSchema}
//                       onSubmit={(values, formikHelpers) =>
//                         getTenantHistory(values, formikHelpers, dispatch)
//                       }
//                     >
//                       {({ isSubmitting, isValid, dirty }) => (
//                         <Form>
//                           <div className="mb-8">
//                             <h1 className="md:text-2xl text-sm text-center font-medium">
//                               Tenant Verification with NIN
//                             </h1>
//                           </div>
//                           <div className="mb-6">
//                             <FormikInputField
//                               css="bg-[#eef0f2]"
//                               name="nin"
//                               placeholder="Enter National Identification Number"
//                               className="w-full p-3 rounded border border-gray-300"
//                             />
//                           </div>
//                           <Button
//                             type="submit"
//                             size="large"
//                             className="w-full"
//                             variant="lightGrey" 
//                             showIcon={false}
//                             disabled={isSubmitting || true || false}
//                           >
//                           Submit
//                           </Button>
//                         </Form>
//                       )}
//                     </Formik>
//                   </div>
//                   <div className="md:w-1/2 w-full mt-4 md:mt-0">
//                     <div className="md:text-lg text-sm text-center">
//                       {" "}
//                       Tenant Verification History
//                     </div>
//                     <div className="space-y-4 mt-8">
//                       {user.tenantVerficationHistory.length > 0 ? (
//                         user.tenantVerficationHistory?.map((item: any) => (
//                           <div
//                             key={item._id}
//                             className="bg-white shadow-lg rounded-lg p-4 mb-4 w-full max-w-md mx-auto border border-gray-200"
//                           >
//                             <div className="">
//                               <div className="flex justify-between">
//                                 <h2 className="text-[14px] font-medium text-gray-700">
//                                   Date Verified :{" "}
//                                   {item.timestamp.slice(0, 10) ||
//                                     "Timestamp not available"}
//                                 </h2>
//                                 <p
//                                   className="text-[14px] font-light text-gray-600 underline cursor-pointer"
//                                   onClick={() => {
//                                     fetchVerifiedNin({
//                                       nin: item.nin,
//                                       userId: user?._id,
//                                     });
//                                   }}
//                                 >
//                                   {item.nin || "NIN not available"}
//                                 </p>
//                               </div>
//                               <p className="text-[14px] font-normal text-gray-600 mt-4">
//                                 {item.details || "No additional details"}
//                               </p>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-center text-gray-500 text-sm">
//                           No history available.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="w-full">
//                     <div className="font-medium text-nrvGreyBlack text-md  whitespace-nowrap mb-4 flex gap-4">
//                       <p>
//                         <FaArrowLeft color="red" size={15} className="cursor-pointer mt-1" onClick={() => {
//                           setView("form")
//                         }} />
//                       </p>
//                       <p> Tenant Screening Report</p>
//                     </div>

//                     <div className="w-full grid md:grid-cols-2 grid-cols-1 md:gap-8">
//                       {tenantHistory.length > 0 ? (
//                         tenantHistory?.map((item) => (
//                           <div
//                             key={item._id}
//                             className="mx-auto p-4 mb-2  bg-white rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl w-full"
//                           >
//                             <div className="">
//                               <h2 className="md:text-xs text-[10px] font-normal text-center text-gray-600">
//                                 {item.propertyId.propertyId.streetAddress},{" "}
//                                 {item.propertyId.propertyId.city},{" "}
//                                 {item.propertyId.propertyId.state}
//                               </h2>

//                               <div className="grid grid-cols-2 gap-3 mb-3 mt-4">
//                                 <div className="text-center">
//                                   <p className="text-xs text-gray-600">
//                                     Rent Start Date
//                                   </p>
//                                   <p className="text-[10px] font-normal text-[#187bca]">
//                                     {formatDateToWords(item.rentStartDate)}
//                                   </p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-xs text-gray-600">
//                                     Rent End Date
//                                   </p>
//                                   <p className="text-[10px] font-normal text-[#187bca]">
//                                     {formatDateToWords(item.rentEndDate)}
//                                   </p>
//                                 </div>
//                               </div>

//                               <div className="mt-3 text-center">
//                                 <p className="text-xs text-gray-600">
//                                   Rent Duration
//                                 </p>
//                                 <p className="text-[10px] font-normal text-[#187bca]">
//                                   {calculateDateDifference(
//                                     item.rentStartDate,
//                                     item.rentEndDate
//                                   )}
//                                 </p>
//                               </div>

//                               <div className="mt-3">
//                                 <p className="text-xs text-gray-800 font-medium mb-2">
//                                   Landlord Details
//                                 </p>
//                                 <div className="text-xs text-gray-800 mt-1">
//                                   <div className="flex gap-1">
//                                     <FcContacts size={16} />{" "}
//                                     {item.ownerId.firstName}{" "}
//                                     {item.ownerId.lastName}
//                                   </div>

//                                   <div className="flex gap-4 mt-1">
//                                     <div className="w-1/2 flex gap-1">
//                                       {" "}
//                                       <FcInvite size={16} />{" "}
//                                       {item.ownerId.email}{" "}
//                                     </div>
//                                     <div className="w-1/2 flex gap-1 justify-end">
//                                       {" "}
//                                       <FcCallback size={16} />{" "}
//                                       {item.ownerId.phoneNumber}{" "}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-center text-gray-500 text-nrvPrimaryGreen">
//                           No Tenant history Available.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </LandLordLayout>
//         </ProtectedRoute>
//       )}
//     </div>
//   );
// };

// export default VerificationScreen;

// TenantVerification.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LandLordLayout from "@/app/components/layout/LandLordLayout";

export default function TenantVerification() {
  return (
    <LandLordLayout path="Tenant Verification">
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Verify your Tenant/New Applicant</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Verify your new applicant or tenant information.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Verify Tenant & View Screening Report</CardTitle>
          <p className="text-sm text-muted-foreground">
            Verify your tenant or applicant via NIN and have access to their screening report
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-1 block">Tenant NIN</label>
              <Input placeholder="Enter Tenant National Identification Number" />
            </div>
            <Button className="bg-green-900 text-white">Submit</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Tenant Verification Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-green-100 rounded-md">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="text-lg font-medium">-</p>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 text-sm">
            {[
              "NIN",
              "Date of Birth",
              "Nationality",
              "Sex",
              "Height",
              "Expiry",
            ].map((label) => (
              <div key={label} className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">-</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </LandLordLayout>

  );
}

