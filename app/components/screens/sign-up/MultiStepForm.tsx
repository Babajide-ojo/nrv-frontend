import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import Button from "@/app/components/shared/buttons/Button";
import { AnyComponent } from "styled-components/dist/types";
import { createProperty } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import CenterModal from "../../shared/modals/CenterModal";
import { useRouter } from "next/navigation";
import FormikSelectField from "../../shared/input-fields/FormikSelectField";
import { nigerianStatesAndLGAs } from "@/helpers/data";

const propertyTypes = [
  { value: "apartment", label: "Residential – Apartment" },
  { value: "house", label: "Residential – House" },
  { value: "commercial", label: "Commercial Property" },
];

const cities = [
  { value: "lagos-island", label: "Lagos Island" },
  { value: "ikeja", label: "Ikeja" },
];

const states = [
  { value: "abia", label: "Abia" },
  { value: "adamawa", label: "Adamawa" },
  { value: "akwaibom", label: "Akwa Ibom" },
  { value: "anambra", label: "Anambra" },
  { value: "bauchi", label: "Bauchi" },
  { value: "bayelsa", label: "Bayelsa" },
  { value: "benue", label: "Benue" },
  { value: "borno", label: "Borno" },
  { value: "crossriver", label: "Cross River" },
  { value: "delta", label: "Delta" },
  { value: "ebonyi", label: "Ebonyi" },
  { value: "edo", label: "Edo" },
  { value: "ekiti", label: "Ekiti" },
  { value: "enugu", label: "Enugu" },
  { value: "gombe", label: "Gombe" },
  { value: "imo", label: "Imo" },
  { value: "jigawa", label: "Jigawa" },
  { value: "kaduna", label: "Kaduna" },
  { value: "kano", label: "Kano" },
  { value: "katsina", label: "Katsina" },
  { value: "kebbi", label: "Kebbi" },
  { value: "kogi", label: "Kogi" },
  { value: "kwara", label: "Kwara" },
  { value: "lagos", label: "Lagos" },
  { value: "nasarawa", label: "Nasarawa" },
  { value: "niger", label: "Niger" },
  { value: "ogun", label: "Ogun" },
  { value: "ondo", label: "Ondo" },
  { value: "osun", label: "Osun" },
  { value: "oyo", label: "Oyo" },
  { value: "plateau", label: "Plateau" },
  { value: "rivers", label: "Rivers" },
  { value: "sokoto", label: "Sokoto" },
  { value: "taraba", label: "Taraba" },
  { value: "yobe", label: "Yobe" },
  { value: "zamfara", label: "Zamfara" },
  { value: "fct", label: "Federal Capital Territory (Abuja)" },
];

const rentCollectionOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

const validationSchema = yup.object({
  propertyName: yup.string().required("Property Name is required"),
  address: yup.string().required("Address is required"),
  propertyType: yup.string().required("Property Type is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  rentCollection: yup.string().required("Rent collection cycle is required"),
});

const MultiStepForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<any>(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [lgaOptions, setLgaOptions] = useState<string[]>([]);
  const [propertyData, setFormData] = useState<any>({
    propertyName: "",
    address: "",
    propertyType: "",
    zipCode: "",
    city: "",
    state: "",
    rentCollection: "",
    preferredTenants: [],
    file: null,
  });


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const handleNextAndVerify = async (values: any) => {
    const formData = new FormData();

    // Helper function to append array fields
    const appendArrayFields = (fieldName: string, fieldValues: any[]) => {
      if (fieldValues) {
        fieldValues.forEach((value) =>
          formData.append(`${fieldName}[]`, value)
        );
      }
    };

    // Append all form fields in a clean and scalable way
    const formFields = [
      { name: "streetAddress", value: values.streetAddress },
      { name: "city", value: values.city },
      { name: "state", value: values.state },
      { name: "zipCode", value: values.zipCode },
      { name: "propertyName", value: values.propertyName },
      { name: "propertyType", value: values.propertyType?.value },
      { name: "rentCollection", value: values.rentCollection?.value },
      {
        name: "createdBy",
        value: JSON.parse(localStorage.getItem("nrv-user") as string)?.user
          ?._id,
      },
    ];

    // Append each field to the FormData
    formFields.forEach((field) => {
      if (field.value) formData.append(field.name, field.value);
    });

    // Handle array-based fields
    appendArrayFields("preferredTenants", values.preferredTenants);
    appendArrayFields(
      "landlordInsurancePolicy",
      values.landlordInsurancePolicy
    );
    appendArrayFields(
      "utilityAndMaintenance",
      propertyData.utilityAndMaintenance
    );
    appendArrayFields("otherDocuments", propertyData.otherDocuments);

    // Handle file input (if present)
    if (propertyData.file) {
      formData.append("file", propertyData.file);
    }

    try {
      setIsLoading(true);
      await dispatch(createProperty(formData) as any).unwrap();

      // Reset form data
      setFormData({
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        preferredTenants: [],
        propertyName: "",
        propertyType: { value: "", label: "" },
        rentCollection: { value: "", label: "" },
        landlordInsurancePolicy: [],
        utilityAndMaintenance: [],
        otherDocuments: [],
      });
      setShowModal(true);
      setIsLoading(false);
    } catch (error: any) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 p-8 bg-white w-full">
      <Formik
        initialValues={{
          propertyName: "",
          address: "",
          propertyType: "",
          zipCode: "",
          city: "",
          state: "",
          rentCollection: "",
          preferredTenants: [] as string[],
          file: propertyData.file,
        }}
        validationSchema={validationSchema}
        onSubmit={handleNextAndVerify}
      >
        {({ values, errors, handleChange, setValues }) => (
          <div>
            {step === 1 && (
              <Form className="space-y-8">
                <h2 className="text-2xl font-bold">Add Your Property</h2>
                <p className="text-gray-500">
                  Help us personalize your experience by providing more details.
                </p>

                <InputField
                  label="Name of Property"
                  name="propertyName"
                  value={(values as any)["propertyName"]}
                  onChange={handleChange}
                  error={errors["propertyName"] as any}
                  placeholder="Luxury Apartment, Lekki Phase 1"
                />

                <InputField
                  label="Property Street Address/Location"
                  name="address"
                  value={(values as any)["address"]}
                  onChange={handleChange}
                  placeholder="12 Admiralty Way, Lekki, Lagos"
                  error={errors["address"] as any}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormikSelectField
                    label="Property Type"
                    name="propertyType"
                    value={(values as any)["propertyType"]}
                    onChange={handleChange}
                    options={propertyTypes}
                    placeholder="Select Property Type"
                    error={errors["propertyType"] as any}
                  />

                  <InputField
                    label="Zip Code"
                    name="zipCode"
                    value={(values as any)["zipCode"]}
                    onChange={handleChange}
                    error={errors["zipCode"] as any}
                    placeholder="Enter Zip Code"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormikSelectField
                    label="State"
                    name="state"
                    value={(values as any)["state"]}
                    onChange={handleChange}
                    options={Object.keys(nigerianStatesAndLGAs).map((stateKey) => ({
                      value: stateKey,
                      label: stateKey.charAt(0).toUpperCase() + stateKey.slice(1),
                    }))}
                    placeholder="Select State"
                    error={errors["state"] as any}
                  />

                  

                  <InputField
                    label="City"
                    name="city"
                    value={(values as any)["city"]}
                    onChange={handleChange}
                    // options={cities}
                    placeholder="Select City"
                    error={errors["city"] as any}
                  />
                </div>

                <div className="border-dashed border-2 p-6 text-center rounded-lg mb-6 relative">
                  {propertyData.file ? (
                    <div>
                      <div className="flex justify-center">
                        <img
                          src={URL.createObjectURL(propertyData.file)}
                          alt="Profile Preview"
                          className="h-20 w-20 rounded-full"
                        />
                      </div>
                      <p className="text-gray-500 mt-2 text-sm">
                        <span className="text-nrvPrimaryGreen font-medium">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        SVG, PNG, JPG, GIF (max. 800×400px)
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <img
                          src="/icons/Upload.svg"
                          alt="Profile Preview"
                          className=""
                        />
                      </div>
                      <p className="text-gray-500 mt-2">
                        <span className="text-nrvPrimaryGreen">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        SVG, PNG, JPG, GIF (max. 800×400px)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="darkPrimary"
                  size="large"
                  className="w-full p-4"
                >
                  Save and Continue
                </Button>

                <p
                  className="text-center text-gray-500 mt-2 cursor-pointer"
                  onClick={() => router.push("/dashboard/landlord")}
                >
                  Skip for Now →
                </p>
              </Form>
            )}

            {step === 2 && (
              <Form className="space-y-4">
                <div className="flex justify-between">
                  {" "}
                  <h2 className="text-2xl font-bold">
                    Set Up Your Property Preferences
                  </h2>
                </div>
                <p className="text-gray-500">
                  Tell us more about what you&apos;re looking for.
                </p>

                <FormikSelectField
                  label="Rent Collection Preference"
                  name="rentCollection"
                  value={(values as any)["rentCollection"]}
                  onChange={handleChange}
                  options={rentCollectionOptions}
                  placeholder="Select Preference"
                  error={errors["rentCollection"] as any}
                />

                <div>
                  <label className="block font-medium">
                    Preferred Tenant Type
                  </label>
                  <div className="flex space-x-4 mt-2">
                    {["Families", "Professionals", "Students", "Singles"].map(
                      (type: any) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            className="bg-red"
                            value={type}
                            checked={values.preferredTenants.includes(type)}
                            onChange={() => {
                              const updatedTenants =
                                values.preferredTenants.includes(type)
                                  ? values.preferredTenants.filter(
                                      (t: string) => t !== type
                                    )
                                  : [...values.preferredTenants, type];

                              setValues({
                                ...values,
                                preferredTenants: updatedTenants,
                              });
                            }}
                          />
                          <div> {type}</div>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  variant="darkPrimary"
                  size="large"
                  className="w-full p-4"
                >
                  Save Preferences
                </Button>

                <div className="flex justify-between mt-16">
                  <p
                    className="text-center text-sm text-gray-500 mt-2 cursor-pointer"
                    onClick={() => router.push("/dashboard/landlord")}
                  >
                    Skip for Now →
                  </p>

                  <p
                    className="text-center text-sm text-red-500 mt-2 cursor-pointer"
                    onClick={() => setStep(1)}
                  >
                    {" "}
                    Go Back
                  </p>
                </div>
              </Form>
            )}
          </div>
        )}
      </Formik>

      <CenterModal isOpen={showModal} onClose={() => !showModal}>
        <div>
          <div className="flex justify-center items-center">
            <div className="rounded-2xl p-8 w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Welcome to NaijaRentVerify
                </h2>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Thank you for creating an account with NaijaRentVerify! We are
                excited to have you on board.
              </p>
              <p className="mt-4 text-gray-600 text-sm">
                You can now proceed to your dashboard to complete your Account
                configuration. Its Secure, and Hassle-Free.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end bg-gray-100 p-4">
            <button
              className="bg-green-600 text-white py-2 px-6 rounded-full text-sm font-medium shadow-md hover:bg-green-700"
              onClick={() => router.push("/dashboard/landlord")}
            >
              Proceed to Dashboard
            </button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default MultiStepForm;
