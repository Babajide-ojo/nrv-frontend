"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  createUploadAgreement,
  getApplicationsById,
  updateApplicationStatus,
} from "@/redux/slices/propertySlice";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { format, startOfToday } from "date-fns";
`import PdfIcon from "../../icons/PdfIcon";
import { DownloadIcon, EyeIcon } from "lucide-react";`;
import { Form, Formik, FormikHelpers } from "formik";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
  assignDateTenancyTenure,
  endTenancyTenure,
  extendTenancyTenure,
} from "@/redux/slices/userSlice";
import "react-toastify/dist/ReactToastify.css";
import { ApplicationStatus, getFileExtension } from "@/helpers/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Label } from "@/components/ui/label";
import BackIcon from "../../shared/icons/BackIcon";
import Modal from "../../shared/modals/Modal";
import CustomDatePicker from "../../shared/CustomDatePicker";

const TenantScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id }: any = useParams();
  const [showNIN, setShowNIN] = useState(false);
  const application = useSelector((state: any) => state?.property?.data?.data);
  const [isLoading, setIsLoading] = useState(false);
  const [openAssignDateModal, setOpenAssignDateModal] = useState(false);
  const [openUploadAgreementDocsModal, setOpenUploadAgreementDocsModal] =
    useState(false);

  const [openEndTenancyModal, setOpenTenancyModal] = useState(false);
  const [viewDocs, setViewDocs] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [tenantDetails, setTenantDetails] = useState<any>({});
  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);
  const [pdf, setPdf] = useState<any>(null);
  const [openAddTenantModal, setOpenAddTenantModal] = useState(false);


  const statusStyles: Record<ApplicationStatus, { bg: string; text: string }> =
    {
      [ApplicationStatus.NEW]: { bg: "bg-[#FFF4E5]", text: "text-[#D97706]" },
      [ApplicationStatus.ACCEPTED]: {
        bg: "bg-[#E5F6FD]",
        text: "text-[#0369A1]",
      },
      [ApplicationStatus.ACTIVE_LEASE]: {
        bg: "bg-[#E9F4E7]",
        text: "text-[#099137]",
      },
      [ApplicationStatus.EXPIRED]: {
        bg: "bg-[#FEE2E2]",
        text: "text-[#B91C1C]",
      },
      [ApplicationStatus.ENDED]: { bg: "bg-[#F3F4F6]", text: "text-[#4B5563]" },
      [ApplicationStatus.REJECTED]: {
        bg: "bg-[#FEE2E2]",
        text: "text-[#B91C1C]",
      },
    };

  const status = application?.status as ApplicationStatus;
  const style = statusStyles[status];

  const endTenancy: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    const formData = { id };
  
    const refreshApplication = () => {
      if (id) dispatch(getApplicationsById(formData as any) as any);
    };
  
    try {
      const result = await dispatch(endTenancyTenure(values)) as any;
  
      if (result.error) {
        const errorMessage = result.payload || "Failed to end tenancy. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.success("Tenant ended successfully");
        resetForm();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
      setOpenAddTenantModal(false);
      refreshApplication();
    }
  };
  


  const validateTenancyDateAssignment = (values: any) => {
    const errors: { rentEndDate?: string; rentStartDate?: string } = {};

    if (tenantDetails?.data?.finalResult?.rentEndDate) {
      const currentEndDate = new Date(
        tenantDetails?.data?.finalResult?.rentEndDate
      );
      const newEndDate = new Date(values.rentEndDate);

      if (newEndDate <= currentEndDate) {
        errors.rentEndDate =
          "End date must be later than the current rent end date.";
      }
    }

    const newStartDate = new Date(values.rentStartDate);
    const newEndDate = new Date(values.rentEndDate);

    if (newStartDate && newEndDate && newStartDate >= newEndDate) {
      errors.rentStartDate = "Start date must be earlier than the end date.";
      errors.rentEndDate = "End date must be later than the start date.";
    }

    return errors;
  };

  const formatDateToWords = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })?.format(date);
  };

  const extendTenancy: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(extendTenancyTenure(values))) as any;
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to extend tenancy. Please try again."
          );
        } else {
          toast.error("Failed to extend tenancy. Please try again.");
        }
      } else {
        toast.success("Tenant tenure extended successfully");
        resetForm();
        // fetchData();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
      setOpenAddTenantModal(false);
    }
  };

  const viewDocument = (item: string) => {
    const fileType = getFileExtension(item);
    if (
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "png" ||
      fileType === "gif"
    ) {
      setPdf("image");
    } else if (fileType === "pdf") {
      setPdf("pdf");
    }
    setFileUrl(item);
    setViewDocs(true);
    setViewerVisible(true); // Ensure viewer is visible when a document is viewed
  };

  type AddTenantFunction = (
    values: any,
    formikHelpers: FormikHelpers<any>,
    dispatch: ThunkDispatch<any, any, AnyAction>
  ) => Promise<void>;

  const assignDateToTenancy: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(assignDateTenancyTenure(values))) as any;
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to activate lease. Please try again."
          );
        } else {
          toast.error("Failed to activate lease. Please try again.");
        }
      } else {
        toast.success("Active lease activated");
        resetForm();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
      setOpenAddTenantModal(false);
      setOpenAssignDateModal(false);
    }
  };

  const handleApplicationStatus = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
    };
    try {
      setIsLoading(true);
      await dispatch(updateApplicationStatus(payload) as any).unwrap();
      if (payload.status == "Accepted") {
        toast.success("Application accepted");
      } else {
        toast.error("Application declined");
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsLoading(false);
      const formData = { id: application?._id };
      if (id) {
        dispatch(getApplicationsById(formData as any) as any);
      }
    }
  };

  const handleVerifyTenant = () => {
    const sp = new URLSearchParams();
    const applicant = application?.applicant;
    if (applicant?.firstName) sp.set("firstName", applicant.firstName);
    if (applicant?.lastName) sp.set("lastName", applicant.lastName);
    if (applicant?.email) sp.set("email", applicant.email);
    if (applicant?.nin) sp.set("nin", applicant.nin);
    router.push(
      `/dashboard/landlord/properties/verification/request${
        sp.toString() ? `?${sp.toString()}` : ""
      }`
    );
  };

  useEffect(() => {
    const formData = { id: id };
    if (id) {
      dispatch(getApplicationsById(formData as any) as any);
    }
  }, [id, dispatch]);

  if (!application) return <div className="p-4">Loading lease details...</div>;

  return (
    <div className="mx-4 sm:mx-5 my-4">
      <ToastContainer />
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between gap-5 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <button
            type="button"
            className="text-nrvGreyBlack"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <span className="text-nrvGreyBlack font-medium">Tenant Profile</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full md:w-full bg-white rounded-md">
          <div className="border rounded-lg flex flex-col sm:flex-row overflow-hidden">
            {/* <div className="h-[168px] aspect-square" ></div> */}
            <Image
              height={168}
              width={168}
              src={application?.propertyId?.propertyId?.file}
              alt="property"
              className="object-cover w-full h-[200px] sm:h-full sm:w-[168px] sm:aspect-square"
            />
            <div className="px-5 py-3">
              <div
                className={`${style?.bg} ${style?.text} w-fit text-xs py-1 px-4 rounded-full`}
              >
                {status === ApplicationStatus.ACTIVE_LEASE
                  ? "Active Lease"
                  : status}
              </div>
              <div className="text-lg sm:text-[20px] font-semibold mt-2 leading-snug">
                {application?.propertyId?.description}
              </div>
              <p className="text-sm sm:text-base text-[#101928] mt-1">
                {application?.propertyId?.propertyId?.streetAddress},{" "}
                {application?.propertyId?.propertyId?.city},{" "}
                {application?.propertyId?.propertyId?.state}
              </p>
              <p className="text-sm text-[#807F94] mt-1">
                Applied on{" "}
                {application?.createdAt
                  ? format(new Date(application?.createdAt), "do, MMM yyyy")
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mt-5">
            <div className="w-full text-center border rounded-lg">
              <div className="flex flex-col items-center">
                <p className="text-xl sm:text-2xl text-[#03442C] font-semibold mt-3">
                  {application?.applicant?.firstName}{" "}
                  {application?.applicant?.lastName}
                </p>
                <p className="text-sm sm:text-base text-gray-500 mt-1 break-words px-4">
                  {application?.applicant?.email}
                </p>

                <p className="text-sm sm:text-base text-gray-700 mt-1">
                  {application?.applicant?.phoneNumber}
                </p>
              </div>

              <div className="mt-4 bg-[#E9F4E7] p-3 sm:p-4 text-base sm:text-2xl font-semibold rounded flex justify-between items-center gap-3">
                <span className="truncate">
                  {showNIN ? application?.applicant?.nin : "**********"}
                </span>
                <button
                  onClick={() => setShowNIN(!showNIN)}
                  className="underline text-sm sm:text-base text-green-700 shrink-0"
                >
                  {!showNIN ? "Show NIN" : "Hide NIN"}
                </button>
              </div>

              {!(
                application?.status == "Accepted" ||
                application?.status == "activeTenant" ||
                application?.status == "Ended" ||
                application?.status == "Active_lease"
              ) && (
                <div className="flex flex-col sm:flex-row gap-2 mt-5 justify-center px-4 pb-4">
                  <Button
                    className="bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 text-white text-xs px-4 py-2 w-full"
                    disabled={isLoading}
                    onClick={handleVerifyTenant}
                  >
                    Verify Tenant
                  </Button>
                  <Button
                    className="bg-white hover:bg-black/10 border border-red-500 text-red-500 text-xs px-4 py-2 w-full"
                    onClick={() => handleApplicationStatus("Rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
              {application?.status == "Accepted" && (
                <Button
                  className="mt-4 bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 text-white text-xs px-4 py-2 w-full"
                  disabled={isLoading}
                  onClick={() => setOpenAssignDateModal(true)}
                >
                  Set Lease Period
                </Button>
              )}

              {application?.status == "Active_lease" && (
               <div className="flex flex-col md:flex-row gap-4 mt-6 w-full">
               <div
                 onClick={() => setOpenAddTenantModal(true)}
                 className="flex-1 flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition duration-300"
               >
                 <span className="text-sm font-medium text-nrvGreyBlack">
                   End Lease Tenure
                 </span>
                 <span className="text-nrvPrimaryGreen hover:underline text-sm">
                   Click here
                 </span>
               </div>
           
             </div>
              )}

       
            </div>
            <div className="w-full p-4 border rounded-lg">
              <div className="flex">
                <p className="text-lg font-semibold">Employment Details</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full mt-4 text-sm text-start">
                  <p className="text-[#475467]">Employer</p>
                  <p className="font-semibold">
                    {application?.currentEmployer ?? "N/A"}
                  </p>
                </div>

                <div className="w-full mt-4 text-sm flex flex-col  text-start">
                  <p className=" text-[#475467]">Salary</p>
                  <p className="font-semibold">{`₦${application?.monthlyIncome?.toLocaleString()}`}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg mt-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Lease Period</p>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="w-full text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div>
                  <p className="text-sm font-semibold">Lease Start Date</p>
                  <p>
                    {application?.rentStartDate &&
                      formatDateToWords(
                        application?.rentStartDate?.slice(0, 10)
                      )}
                  </p>
                </div>
              </div>
              <div className="w-full text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div>
                  <p className="text-sm font-semibold">Lease End Date</p>
                  <p>
                    {application?.rentStartDate &&
                      formatDateToWords(application?.rentEndDate.slice(0, 10))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-fit"></div>
      </div>

      <Modal
        isOpen={openAssignDateModal}
        onClose={() => setOpenAssignDateModal(false)}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvPrimaryGreen font-semibold text-2xl">
            Assign Rent Start and End Date
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will assign a tenancy date frame to this
            tenant.
          </p>

          <Formik
            initialValues={{
              id: tenantDetails?.data?.finalResult?._id || id,
              rentStartDate: null,
              rentEndDate: null,
            }}
            validate={validateTenancyDateAssignment}
            onSubmit={(values, formikHelpers) =>
              assignDateToTenancy(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values, errors, setFieldValue }) => (
              <Form>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div>
                    <Label>Lease Start Date</Label>

                    <div className="w-full h-11 rounded-sm border border-[#E0E0E6] mt-2 px-2">
                      <DatePicker
                        value={values.rentStartDate}
                        onChange={(newValue) =>
                          setFieldValue("rentStartDate", newValue)
                        }
                        minDate={startOfToday()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            variant: "standard",
                            InputProps: { disableUnderline: true },
                            sx: {
                              fontSize: "12px",
                              backgroundColor: "white",
                              border: "red",
                              boxShadow: "none",
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
                                backgroundColor: "#007443",
                                color: "#ffffff",
                              },
                              "&.MuiPickersDay-today": {
                                border: "1px solid #3B82F6",
                                backgroundColor: "#007443",
                              },
                              "&.MuiPickersDay-today.Mui-selected": {
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
                    </div>
                  </div>
                  <div className="pt-4">
                    <Label>Lease End Date</Label>
                    <div className="w-full h-11 rounded-sm border border-[#E0E0E6] mt-2 px-2">
                      <DatePicker
                        value={values.rentEndDate}
                        onChange={(newValue) =>
                          setFieldValue("rentEndDate", newValue)
                        }
                        minDate={values.rentStartDate || startOfToday()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            variant: "standard",
                            InputProps: { disableUnderline: true },
                            sx: {
                              fontSize: "12px",
                              backgroundColor: "white",
                              boxShadow: "none",
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
                                backgroundColor: "#007443",
                                color: "#ffffff",
                              },
                              "&.MuiPickersDay-today": {
                                border: "1px solid #3B82F6",
                                backgroundColor: "#007443",
                              },
                              "&.MuiPickersDay-today.Mui-selected": {
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
                    </div>
                  </div>
                </LocalizationProvider>

                <div className="mt-8 flex gap-4 justify-between w-full">
                  <Button
                    type="button"
                    className="block w-full"
                    onClick={() => {
                      resetForm();
                      setOpenAssignDateModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="block w-full"
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

      <Modal
        isOpen={openAddTenantModal}
        onClose={() => {
          setOpenAddTenantModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-red-500 font-semibold text-2xl">
            End Tenancy Tenure
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will end the tenancy tenure
          </p>
          <Formik
            initialValues={{
              id:  tenantDetails?.data?.finalResult?._id || id,
            }}
            onSubmit={(values, formikHelpers) =>
              endTenancy(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values, errors }) => (
              <Form>
                <div className="mt-4  mx-auto w-full mt-8 flex gap-4 justify-between">
                  <Button
                    type="button"
                    className="block w-full"
                    onClick={() => {
                      setOpenAddTenantModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="block w-full"
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
