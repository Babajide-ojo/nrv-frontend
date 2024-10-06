import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import "react-toastify/dist/ReactToastify.css";
import { cls } from '../../../helpers/utils';
import FormikSelectField from "../shared/input-fields/FormikSelectField";

// Validation schema using yup
const validationSchema = yup.object({
  amount: yup.number().required("Amount is required").positive("Must be positive"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  file: yup.mixed().required("File is required"),
});

// Custom InputField component
const CustomInputField = ({ name, ...props }: any) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();


  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFieldValue(name, value);
  };

  const handleBlur = (event: any) => {
    const { name } = event.target;
    setFieldTouched(name, true);
  };



  return (
    <div className="w-full mt-4">
      <InputField
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
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

const AddExpense = () => {
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState<any>({})
  const {id} = useParams();

  useEffect(() => {
    setRoomId(id)
}, [])

  const handleSubmit = async (values: any) => {
    try {
        console.log({values});
        
   //   await dispatch(createExpense(values) as any).unwrap();
      toast.success("Expense added successfully!");
    //  router.push("/expenses"); // Redirect after successful submission
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="container">
      <div className="max-w-lg mx-auto flex-grow w-full">
        <div className="text-xl text-nrvGreyBlack font-semibold">
          Add New Expense 🚀
        </div>

        <Formik
          initialValues={{
            amount: "",
            category: "",
            description: "",
            file: null,
            roomId: id
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="">
                <CustomInputField
                cls="bg-nrvLightGreyBg"
                  name="amount"
                  placeholder="Enter Amount"
                  label="Amount"
                  type="number"
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
                        { label: "Roof Fix", value: "Roof Fix" }
                      ]}
                      isSearchable={true}
                    />
                  </div>
         
                <CustomInputField
                  name="description"
                  placeholder="Enter Description"
                  label="Description"
                  cls="mt-4"
                />
                <div className="w-full mt-4">
                  <label htmlFor="file" className="block text-sm">
                    Upload Receipt
                  </label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event: any) => {
                      setFieldValue("file", event.currentTarget.files[0]);
                    }}
                    className="border border-nrvLightGrey p-2 rounded-md w-full text-sm text-nrvLightGrey mt-4 "
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-red-500 text-xs"
                  />
                </div>
              </div>
              <div className="mt-4 max-w-lg mx-auto w-full">
                <Button
                  type="submit"
                  size="large"
                  className="block w-full"
                  variant="bluebg"
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
      <ToastContainer />
    </div>
  );
};

export default AddExpense;
