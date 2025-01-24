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
  value?: string;
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
                          <SlCloudUpload size={30} fontWeight={900} />
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
