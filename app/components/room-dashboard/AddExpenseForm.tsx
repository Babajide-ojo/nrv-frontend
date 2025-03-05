import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import "react-toastify/dist/ReactToastify.css";
import FormikSelectField from "../shared/input-fields/FormikSelectField";
import { createExpense } from "@/redux/slices/propertySlice";
import { SlCloudUpload } from "react-icons/sl";
import BackIcon from "../shared/icons/BackIcon";
import { ArrowBack } from "@/public/icons/iconsExport";
import { FaArrowAltCircleLeft } from "react-icons/fa";

interface User {
  user: {
    _id: string;
  };
}

interface AddExpenseProps {
  onExpenseSubmit: (data: any) => void | any; // The callback function passed from the parent
}

// Validation Schema
const validationSchema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Must be positive"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  //  file: yup.mixed().required("File is required"),
});

// Custom Input Field Component
const CustomInputField: React.FC<{
  name: string;
  label: string;
  type?: string;
  value?: string| any;
  placeholder?: string;
}> = ({ name, label, value, ...props }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setFieldTouched(name, true);
  };

  return (
    <div className="w-full mt-4">
      <InputField
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        css="bg-nrvLightGreyBg"
        label={label}
        value={value}
        {...props}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
  );
};

// Main AddExpense Component
const AddExpense: React.FC<AddExpenseProps> = ({ onExpenseSubmit }) => {
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState<string | any>(null);
  const [user, setUser] = useState<User | any>(null);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("nrv-user") || "{}");
    setUser(userData);
    setRoomId(id);
  }, [id]);

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      if (selectedFiles.length > 0) values.file = selectedFiles[0];
      await dispatch(createExpense(values) as any).unwrap();
      toast.success("Expense added successfully!");
      //resetForm();
      onExpenseSubmit;
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    let files: any = Array.from(e.dataTransfer.files);
    if (files.length <= 2) {
      setSelectedFiles(files as any);
    } else {
      alert("You can only upload a maximum of 2 files.");
    }
  };

  const handleFileInputChange = (e: any) => {
    setFileError("");
    const files: any = Array.from(e.target.files);
    if (e.target.id === "profilePicture" && e.target.files.length > 0) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();

      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError(
          "Invalid file type. Please select an image (.jpg, .jpeg, .png)."
        );
        return;
      }
    } else {
      setSelectedFiles(files as any);
    }
  };

  if (!user || !user.user) {
    return <div>Loading...</div>;
  }

  const handleFormReset = (values: any) => {
    values = {};
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="max-w-lg mx-auto flex-grow w-full">
        <div className="flex justify-between">
          <div
            className=""
            onClick={onExpenseSubmit}
          >
            <FaArrowAltCircleLeft />
          </div>

          <div className="text-xl text-nrvGreyBlack font-semibold">
            Add New Expense 🚀
          </div>
        </div>

        <Formik
          initialValues={{
            amount: "",
            category: "",
            description: "",
            file: null,
            roomId: id,
            loggedBy: user.user._id,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          onReset={handleFormReset}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <CustomInputField
                name="amount"
                placeholder="Enter Amount"
                label="Amount"
                type="number"
                value={values.amount}
              />
              <div className="w-full mt-0 md:mt-0">
                <FormikSelectField
                  name="category"
                  placeholder="Select Category"
                  label="Category"
                  options={[
                    { label: "Plumbing", value: "Plumbing" },
                    { label: "Mason Work", value: "Mason Work" },
                    { label: "Electrical Fix", value: "Electrical Fix" },
                    { label: "Roof Fix", value: "Roof Fix" },
                  ]}
                  isSearchable={true}
                  value={values.category}
                />
              </div>
              <CustomInputField
                name="description"
                placeholder="Enter Description"
                label="Description"
                value={values.description}
              />
              <div className="w-full mt-4">
                <label className="text-nrvGreyBlack mb-2 text-sm ">
                  Property Photo
                </label>
                <div
                  className="text-center w-full mt-2 bg-white"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="w-full  border border-nrvLightGrey rounded-lg  pt-4 pb-4 text-swBlack">
                    <input
                      type="file"
                      id="fileInput"
                      className="hidden"
                      accept=".png, .jpg , .jpeg"
                      onChange={handleFileInputChange}
                    />

                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer  p-2 rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
                    >
                      <div className="text-center flex justify-center">
                        {selectedFiles.length > 0 ? (
                          selectedFiles[0]?.name
                        ) : (
                          <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="28.5" cy="28.5" r="28" fill="#F0F2F5"/>
                          <path d="M21.5013 25.5836C21.5013 22.0398 24.3741 19.167 27.918 19.167C31.0571 19.167 33.672 21.4223 34.2262 24.4014C34.3039 24.8192 34.6026 25.1616 35.0059 25.2954C37.3285 26.0657 39.0013 28.2558 39.0013 30.8336C39.0013 34.0553 36.3896 36.667 33.168 36.667C32.5236 36.667 32.0013 37.1893 32.0013 37.8336C32.0013 38.478 32.5236 39.0003 33.168 39.0003C37.6783 39.0003 41.3346 35.3439 41.3346 30.8336C41.3346 27.4591 39.2886 24.5651 36.372 23.3198C35.374 19.5846 31.9683 16.8336 27.918 16.8336C23.0855 16.8336 19.168 20.7511 19.168 25.5836C19.168 25.7006 19.1703 25.8171 19.1748 25.9331C17.0802 27.1416 15.668 29.4049 15.668 32.0003C15.668 35.8663 18.802 39.0003 22.668 39.0003C23.3123 39.0003 23.8346 38.478 23.8346 37.8336C23.8346 37.1893 23.3123 36.667 22.668 36.667C20.0906 36.667 18.0013 34.5776 18.0013 32.0003C18.0013 30.0667 19.1775 28.4052 20.8581 27.6972C21.3444 27.4924 21.6326 26.9866 21.561 26.4638C21.5217 26.1766 21.5013 25.8828 21.5013 25.5836Z" fill="#475367"/>
                          <path d="M27.7262 31.1283C28.1682 30.7354 28.8344 30.7354 29.2764 31.1283L31.0264 32.6839C31.508 33.1119 31.5514 33.8494 31.1233 34.3309C30.7488 34.7522 30.1376 34.8382 29.668 34.5665V40.167C29.668 40.8113 29.1456 41.3336 28.5013 41.3336C27.857 41.3336 27.3346 40.8113 27.3346 40.167V34.5665C26.8651 34.8382 26.2538 34.7522 25.8793 34.3309C25.4513 33.8494 25.4946 33.1119 25.9762 32.6839L27.7262 31.1283Z" fill="#475367"/>
                          </svg>
                          
                        )}
                      </div>
                      {selectedFiles.length > 0
                        ? "Change file"
                        : "Click to upload"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 max-w-lg mx-auto w-full">
                <Button
                  type="submit"
                  size="minLarge"
                  className="block w-full"
                  variant="darkPrimary"
                  showIcon={false}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Add Expense"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddExpense;
