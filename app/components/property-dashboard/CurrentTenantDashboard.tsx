import Button from "../shared/buttons/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createUploadAgreement, getCurrentTenantForProperty } from "../../../redux/slices/propertySlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Form, Formik, FormikHelpers } from "formik";
import Modal from "../shared/modals/Modal";
import CustomDatePicker from "../shared/CustomDatePicker";
import {
  assignDateTenancyTenure,
  endTenancyTenure,
  extendTenancyTenure,
} from "@/redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import CenterModal from "../shared/modals/CenterModal";
import FileUploader from "../shared/upload/FileUploader";

interface Data {
  data: any;
}

type AddTenantFunction = (
  values: any,
  formikHelpers: FormikHelpers<any>,
  dispatch: ThunkDispatch<any, any, AnyAction>
) => Promise<void>;

const CurrentTenantDashboard: React.FC<Data> = ({ data }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [tenantDetails, setTenantDetails] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);
  const [openAddTenantModal, setOpenAddTenantModal] = useState(false);
  const [openAssignDateModal, setOpenAssignDateModal] = useState(false);
  const [openUploadAgreementDocsModal, setOpenUploadAgreementDocsModal] =
    useState(false);
  const [openEndTenancyModal, setOpenTenancyModal] = useState(false);
  const [unsignedDocument, setUnsignedDocuments] = useState<File[]>([]);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    try {
      const tenant = await dispatch(
        getCurrentTenantForProperty(id) as any
      ).unwrap();
      setTenantDetails(tenant);
    } catch (error) {}

    return () => clearTimeout(timer);
  };

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

    // Ensure the end date is after the start date
    if (endDate < startDate) {
      throw new Error("End date must be after start date.");
    }

    // Calculate difference
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    // Adjust months and years if necessary
    if (days < 0) {
      months--;
      days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate(); // days in the previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Return formatted difference
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }, and ${days} day${days !== 1 ? "s" : ""}`;
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
        fetchData();
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
            result.payload || "Failed to extend tenancy. Please try again."
          );
        } else {
          toast.error("Failed to extend tenancy. Please try again.");
        }
      } else {
        toast.success("Tenant tenure extended successfully");
        resetForm();
        fetchData();
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

  const uploadTenantAgreement: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(createUploadAgreement(values))) as any;
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to upload agreement documents. Please try again."
          );
        } else {
          toast.error("Failed to upload agreement documents. Please try again.");
        }
      } else {
        toast.success("Agreement document uploaded successfully");
        resetForm();
        fetchData();
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

  const endTenancy: AddTenantFunction = async (
    values,
    { resetForm, setSubmitting },
    dispatch
  ) => {
    try {
      const result = (await dispatch(endTenancyTenure(values))) as any;
      if (result.error) {
        if (result.error.message === "Rejected") {
          toast.error(
            result.payload || "Failed to end tenancy. Please try again."
          );
        } else {
          toast.error("Failed to end tenancy. Please try again.");
        }
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
      setOpenTenancyModal(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    setUnsignedDocuments(files);
  };

  const handleRemoveFile = (index: number) => {
    setUnsignedDocuments((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = (values: any) => {
    const errors: { rentEndDate?: string } = {};
    if (tenantDetails?.data?.activeTenant?.rentEndDate) {
      const currentEndDate = new Date(tenantDetails?.data?.activeTenant?.rentEndDate);
      const newEndDate = new Date(values.rentEndDate);
      if (newEndDate <= currentEndDate) {
        errors.rentEndDate =
          "End date must be later than current rent end date.";
      }
    }
    return errors;
  };

  const validateTenancyDateAssignment = (values: any) => {
    const errors: { rentEndDate?: string; rentStartDate?: string } = {};

    if (tenantDetails?.data?.activeTenant?.rentEndDate) {
      const currentEndDate = new Date(tenantDetails?.data?.activeTenant?.rentEndDate);
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

  return (
    <div className="pb-4 md:pb-0">
      <ToastContainer />
      <div>
        {tenantDetails.data != null ? (
          <div>
            <div className="w-full rounded rounded-2xl p-4">
              <div className="md:flex md:gap-8">
                <div className="md:w-1/3 w-full bg-white shadow-md rounded-lg p-3">
                  <div className="mb-2 text-md text-nrvDarkBlue font-medium">
                    Tenant Personal Information
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-nrvGreyBlack">
                      {tenantDetails?.data?.activeTenant?.applicant?.firstName}{" "}
                      {tenantDetails?.data?.activeTenant?.applicant?.lastName}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-nrvDarkBlue underline">
                      {tenantDetails?.data?.activeTenant?.applicant?.email}
                    </p>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm text-nrvGreyBlack">
                      {tenantDetails?.data?.activeTenant?.applicant?.phoneNumber ||
                        "No phone number provided yet"}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-sm font-medium text-nrvDarkBlue">
                      NIN
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-md text-nrvGreyBlack">
                        {isVisible
                          ? tenantDetails?.data?.activeTenant?.applicant?.nin
                          : "****************"}
                      </span>
                      <button
                        onClick={toggleVisibility}
                        className="text-blue-500"
                      >
                        {isVisible ? (
                          <IoEyeOff className="w-5 h-5 text-nrvDarkBlue" />
                        ) : (
                          <IoEye className="w-5 h-5 text-nrvDarkBlue" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/3 w-full bg-white shadow-md rounded-lg p-3 relative">
                  <div className="mb-8 text-md text-nrvDarkBlue font-medium">
                    Rent Tenure
                  </div>
                  {tenantDetails?.data?.activeTenant?.rentStartDate ? (
                    <div>
                      <div className="relative flex items-center justify-between">
                        <div className="date-section text-center flex-grow">
                          <p className="text-xs font-medium">Rent Start Date</p>
                          <hr className="my-2 border-t-2 border-gray-300" />
                          <p className="text-xs text-nrvGreyBlack">
                            {formatDateToWords(
                              tenantDetails?.data?.activeTenant.rentStartDate
                            )}
                          </p>
                        </div>
                        <div className="absolute inset-x-0 flex justify-center">
                          <div className="arrow"></div>
                        </div>
                        <div className="date-section text-center flex-grow">
                          <p className="text-xs font-medium">Rent End Date</p>
                          <hr className="my-2 border-t-2 border-gray-300" />
                          <p className="text-xs text-red-500">
                            {formatDateToWords(
                              tenantDetails?.data?.activeTenant?.rentEndDate
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-nrvDarkBlue text-center font-medium">
                        {calculateDateDifference(
                          tenantDetails?.data?.activeTenant?.rentStartDate,
                          tenantDetails?.data?.activeTenant?.rentEndDate
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className=""
                      onClick={() => {
                        setOpenAssignDateModal(true);
                      }}
                    >
                      <div className="text-red-600 text-sm underline text-center">
                        Click here to set up the rent period for this tenant
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:w-1/3 w-full bg-white shadow-lg rounded-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div
                      onClick={() => setOpenAddTenantModal(true)}
                      className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                    >
                      <span className="text-xs font-medium text-nrvGreyBlack">
                        Extend Rent Tenure
                      </span>
                      <span className="text-blue-500 hover:underline text-sm">
                        click here
                      </span>
                    </div>
                    <div
                      onClick={() => setOpenTenancyModal(true)}
                      className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                    >
                      <span className="text-xs font-medium text-nrvGreyBlack">
                        End Rent Tenure
                      </span>
                      <span className="text-blue-500 hover:underline text-sm ">
                        click here
                      </span>
                    </div>
                    {
                      tenantDetails?.data?.activeTenant.agreementDocument === null ?
                      <div
                      onClick={() => setOpenUploadAgreementDocsModal(true)}
                      className="flex justify-between items-center p-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
                    >
                      <span className="text-xs font-medium text-nrvGreyBlack">
                        Upload Agreement Documents
                      </span>
                      <span className="text-blue-500 text-sm  hover:underline">
                        click here
                      </span>
                    </div>: "Agreement document uploaded"
                    }

        
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">No Active Tenancy</div>
        )}
      </div>

      <Modal
        isOpen={openAddTenantModal}
        onClose={() => {
          setOpenAddTenantModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvDarkBlue font-semibold text-2xl">
            Extend Tenant Tenure
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will extend the tenancy tenure
          </p>
          <Formik
            initialValues={{
              id: tenantDetails?.data?.activeTenant._id,
              rentEndDate: "",
            }}
            validate={validate}
            onSubmit={(values, formikHelpers) =>
              extendTenancy(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values, errors }) => (
              <Form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="w-full md:flex flex-row gap-3">
                    <CustomDatePicker
                      label="Rent End Date"
                      name="rentEndDate"
                      errorMessage={errors.rentEndDate}
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

      <Modal
        isOpen={openAssignDateModal}
        onClose={() => {
          setOpenAssignDateModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvDarkBlue font-semibold text-2xl">
            Assign Rent Start and End Date
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will assign a tenancy date frame to this
            tenant.
          </p>
          <Formik
            initialValues={{
              id: tenantDetails?.data?.activeTenant._id,
              rentStartDate: "",
              rentEndDate: "",
            }}
            validate={validateTenancyDateAssignment}
            onSubmit={(values, formikHelpers) =>
              assignDateToTenancy(values, formikHelpers, dispatch)
            }
          >
            {({ isSubmitting, resetForm, values, errors }) => (
              <Form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="w-full md:flex flex-row gap-3">
                    <CustomDatePicker
                      label="Rent Start Date"
                      name="rentStartDate"
                      errorMessage={errors.rentStartDate}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="w-full md:flex flex-row gap-3">
                    <CustomDatePicker
                      label="Rent End Date"
                      name="rentEndDate"
                      errorMessage={errors.rentEndDate}
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

      <Modal
        isOpen={openUploadAgreementDocsModal}
        onClose={() => {
          setOpenUploadAgreementDocsModal(false);
        }}
      >
        <div className="mx-auto md:p-16 p-8 w-full h-full">
          <h2 className="text-nrvDarkBlue font-semibold text-2xl">
            Upload Agreement Document
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will assign a tenancy date frame to this
            tenant.
          </p>
          <Formik
            initialValues={{
              ownerId: tenantDetails?.data?.activeTenant.ownerId,
              propertyId: tenantDetails?.data?.activeTenant.propertyId?._id,
              applicant: tenantDetails?.data?.activeTenant.applicant?._id,
              unsignedDocument:null,
            }}
            validate={(values) => {
              const errors: any = validateTenancyDateAssignment(values);

              if (!values.unsignedDocument ) {
                errors.unsignedDocument =
                  "Please upload at least one document.";
              }

              return errors;
            }}
            onSubmit={
              (values, formikHelpers) => {
                console.log({ values });
                uploadTenantAgreement(values, formikHelpers, dispatch)
              }


            }
          >
            {({ isSubmitting, resetForm, values, errors, setFieldValue }) => (
              <Form>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <FileUploader
                    file={values.unsignedDocument} // Single file
                    onFileChange={(newFile) =>
                      setFieldValue("unsignedDocument", newFile)
                    } 
                    label="Upload your document"
                  />

                  {errors.unsignedDocument && (
                    <div className="text-red-500 text-sm mt-2">
                      {errors.unsignedDocument}
                    </div>
                  )}
                </div>

                <div className="mt-4 mx-auto w-full mt-8 flex gap-4 justify-between">
                  <Button
                    type="button"
                    size="large"
                    className="block w-full"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      resetForm();
                      setOpenUploadAgreementDocsModal(false);
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

      <CenterModal
        isOpen={openEndTenancyModal}
        onClose={() => {
          setOpenTenancyModal(false);
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
              id: tenantDetails?.data?.activeTenant?._id,
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
                    size="large"
                    className="block w-full"
                    variant="lightGrey"
                    showIcon={false}
                    onClick={() => {
                      resetForm();
                      setOpenTenancyModal(false);
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
      </CenterModal>
    </div>
  );
};

export default CurrentTenantDashboard;
