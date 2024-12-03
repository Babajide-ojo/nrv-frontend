"use client";

import Button from "../../shared/buttons/Button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createUploadAgreement,
  getCurrentTenantForProperty,
} from "../../../../redux/slices/propertySlice";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Form, Formik, FormikHelpers } from "formik";

import {
  assignDateTenancyTenure,
  endTenancyTenure,
} from "@/redux/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import CenterModal from "../../shared/modals/CenterModal";
import FileUploader from "../../shared/upload/FileUploader";
import Viewer from "react-viewer";
import { getFileExtension } from "@/helpers/utils";

interface Data {
  data: any;
}

type AddTenantFunction = (
  values: any,
  formikHelpers: FormikHelpers<any>,
  dispatch: ThunkDispatch<any, any, AnyAction>
) => Promise<void>;

const AgreementDocumentScreen: React.FC<Data> = ({ data }) => {
  console.log({ data });

  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [viewDocs, setViewDocs] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [fileUrl, setFileUrl] = useState<string>("");
  const [tenantDetails, setTenantDetails] = useState<any>({});
  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);
  const [pdf, setPdf] = useState<any>(null);
  const [openUploadAgreementDocsModal, setOpenUploadAgreementDocsModal] =
    useState(false);
  const [openEndTenancyModal, setOpenTenancyModal] = useState(false);
  const [signedDocument, setSignedDocuments] = useState<File[]>([]);

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
            result.payload ||
              "Failed to upload agreement documents. Please try again."
          );
        } else {
          toast.error(
            "Failed to upload agreement documents. Please try again."
          );
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
      // setOpenAddTenantModal(false);
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

  const closeViewer = () => {
    setViewerVisible(false);
    setViewDocs(false);
    setFileUrl(""); // Reset fileUrl
    setPdf(""); // Reset pdf state
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

  const validateTenancyDateAssignment = (values: any) => {
    const errors: { rentEndDate?: string; rentStartDate?: string } = {};

    if (data?.rentEndDate) {
      const currentEndDate = new Date(data?.rentEndDate);
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pb-4 md:pb-0">
      <ToastContainer />
      <div className="mx-auto md:p-16 p-8 w-full h-full">
        <h2 className="text-nrvDarkBlue font-semibold text-2xl">
          Upload Signed Agreement
        </h2>
        <p className="text-nrvLightGrey text-sm mb-4 mt-4">
          Performing this action will upload a signed copy of the agreement
          document
        </p>

        <div
          className="underline text-xs cursor-pointer mb-4"
          onClick={() =>
            viewDocument(data?.agreementDocument?.unsignedDocument)
          }
        >
          {" "}
          View Unsigned Agreement (Landlord)
        </div>
{
  data?.agreementDocument?.signedDocument  != null ?     <div
  className="underline text-xs cursor-pointer"
  onClick={() =>
    viewDocument(data?.agreementDocument?.unsignedDocument)
  }
>
  {" "}
  View Signed Agreement (Tenant)
</div> :         <Formik
          initialValues={{
            ownerId: data?.agreementDocument?.ownerId,
            propertyId: data?.agreementDocument?.propertyId,
            applicant: data?.agreementDocument?.applicant,
            signedDocument: null,
          }}
          validate={(values) => {
            const errors: any = validateTenancyDateAssignment(values);

            if (!values.signedDocument) {
              errors.signedDocument = "Please upload at least one document.";
            }

            return errors;
          }}
          onSubmit={(values, formikHelpers) => {
            console.log({ values });
            uploadTenantAgreement(values, formikHelpers, dispatch);
          }}
        >
          {({ isSubmitting, resetForm, values, errors, setFieldValue }) => (
            <Form>
              <div className="flex gap-4">
                <div
                  className="w-full"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <FileUploader
                    file={values.signedDocument} // Single file
                    onFileChange={(newFile) =>
                      setFieldValue("signedDocument", newFile)
                    }
                    label="Upload your document"
                  />

                  {errors.signedDocument && (
                    <div className="text-red-500 text-sm mt-2">
                      {errors.signedDocument}
                    </div>
                  )}
                </div>
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
}
    

      </div>

      {viewDocs === true ? (
        <div>
          {pdf === "image" && (
            <>
              <Viewer
                visible={viewerVisible}
                onClose={closeViewer}
                images={[{ src: fileUrl, alt: "Image" }]}
              />
            </>
          )}
          {pdf === "pdf" && (
            <div
              id="overlay"
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center"
            >
              <div className="overflow-y-scroll bg-white p-4 relative">
                <button
                  onClick={closeViewer}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-4 py-2"
                >
                  X
                </button>
                <div>
                  <iframe
                    src={fileUrl}
                    height="600"
                    width="600"
                    title="PDF Viewer"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AgreementDocumentScreen;
