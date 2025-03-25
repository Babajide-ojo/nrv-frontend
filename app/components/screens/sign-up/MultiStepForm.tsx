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
  { value: "lagos", label: "Lagos State" },
  { value: "abuja", label: "Abuja" },
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
  zipCode: yup.string().optional(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  file: yup
    .mixed()
    .test("fileSize", "File size is too large", (file: any) =>
      file ? file.size <= 8000000 : true
    ) // Optional file validation (max 8MB)
    .test("fileType", "Unsupported file format", (file: any) =>
      file
        ? ["image/png", "image/jpeg", "image/gif", "image/svg+xml"].includes(
            file.type
          )
        : true
    ),
});




const MultiStepForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<any>(false);
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

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        file: file,
      }));
    }
  };
  
  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData();
    formData.append("streetAddress", propertyData.streetAddress);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
  
    // Append file (if any selected files)
    if (propertyData.file) {
      formData.append("file", propertyData.file);
    }
  
    // Append createdBy (user ID)
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    formData.append("createdBy", user?.user?._id);
  
    // Handle optional fields and arrays (e.g., preferredTenants, landlordInsurancePolicy)
    if (propertyData.preferredTenants) {
      propertyData.preferredTenants.forEach((tenant: any) => {
        formData.append("preferredTenants[]", tenant); // Using '[]' to indicate an array
      });
    }
  
    if (propertyData.propertyName) {
      formData.append("propertyName", propertyData.propertyName);
    }
  
    if (propertyData.propertyType) {
      formData.append("propertyType", JSON.stringify(propertyData.propertyType)); // Assuming propertyType is an object
    }
  
    if (propertyData.rentCollection) {
      formData.append("rentCollection", JSON.stringify(propertyData.rentCollection)); // Assuming rentCollection is an object
    }
  
    // Handle landlordInsurancePolicy, utilityAndMaintenance, and otherDocuments (all are arrays)
    if (propertyData.landlordInsurancePolicy) {
      propertyData.landlordInsurancePolicy.forEach((document: any) => {
        formData.append("landlordInsurancePolicy[]", document);
      });
    }
  
    if (propertyData.utilityAndMaintenance) {
      propertyData.utilityAndMaintenance.forEach((document: any) => {
        formData.append("utilityAndMaintenance[]", document);
      });
    }
  
    if (propertyData.otherDocuments) {
      propertyData.otherDocuments.forEach((document: any) => {
        formData.append("otherDocuments[]", document);
      });
    }
  
    try {

      const userData = await dispatch(createProperty(formData) as any).unwrap();
      setFormData({
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        preferredTenants: [],
        propertyName: "",
        propertyType: { value: '', label: '' },
        rentCollection: { value: '', label: '' },
        landlordInsurancePolicy: [],
        utilityAndMaintenance: [],
        otherDocuments: [],
      });
      setShowModal(true)
    } catch (error: any) {
      alert(error)
    }
  };
  return (
    <div className="mx-auto mt-10 p-8 bg-white w-full">
      {step === 1 && (
        <Formik
          initialValues={propertyData}
          // validationSchema={validationSchema}
          onSubmit={handleNext}
        >
          {() => (
            <Form className="space-y-8">
              <h2 className="text-2xl font-bold">Add Your Property</h2>
              <p className="text-gray-500">
                Help us personalize your experience by providing more details.
              </p>

              <InputField
                label="Name of Property"
                name="propertyName"
                value={propertyData.propertyName}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    propertyName: e.target.value,
                  }))
                }
                placeholder="Luxury Apartment, Lekki Phase 1"
              />

              <InputField
                label="Property Street Address/Location"
                name="address"
                value={propertyData.address}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                placeholder="12 Admiralty Way, Lekki, Lagos"
              />

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Property Type"
                  name="propertyType"
                  value={propertyData.propertyType} // Use formData.propertyType here
                  onChange={(selected) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      propertyType: selected, // Make sure to pass selected.value here
                    }));
                  }}
                  options={propertyTypes}
                  placeholder="Select Property Type"
                />

                <InputField
                  label="Zip Code"
                  name="zipCode"
                  value={propertyData.zipCode}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      zipCode: e.target.value,
                    }))
                  }
                  placeholder="Enter Zip Code"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="City"
                  name="city"
                  value={propertyData.city} // Use formData.city here
                  onChange={(selected) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      city: selected, // Ensure selected.value is set here
                    }));
                  }}
                  options={cities}
                  placeholder="Select City"
                />

                <SelectField
                  label="State"
                  name="state"
                  value={propertyData.state} // Use formData.state here
                  onChange={(selected) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      state: selected, // Ensure selected.value is set here
                    }));
                  }}
                  options={states}
                  placeholder="Select State"
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
                type="submit"
                variant="darkPrimary"
                size="large"
                className="w-full p-4"
              >
                Save and Continue
              </Button>

              <p className="text-center text-gray-500 mt-2 cursor-pointer">
                Skip for Now →
              </p>
            </Form>
          )}
        </Formik>
      )}

      {step === 2 && (
        <Formik
          initialValues={propertyData}
          // validationSchema={validationSchema[1]}
          onSubmit={handleNextAndVerify}
        >
          {() => (
            <Form className="space-y-4">
              <h2 className="text-2xl font-bold">
                Set Up Your Property Preferences
              </h2>
              <p className="text-gray-500">
                Tell us more about what you&apos;re looking for.
              </p>

              <SelectField
                label="Rent Collection Preference"
                name="rentCollection"
                value={propertyData.rentCollection}
                onChange={(selected) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    rentCollection: selected, // Make sure to pass selected.value here
                  }));
                }}
                options={rentCollectionOptions}
                placeholder="Select Preference"
              />

              <div>
                <label className="block font-medium">
                  Preferred Tenant Type
                </label>
                <div className="flex space-x-4 mt-2">
                  {["Families", "Professionals", "Students", "Singles"].map(
                    (type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={type}
                          checked={propertyData.preferredTenants.includes(type)}
                          onChange={() => {
                            setFormData((prev: any) => ({
                              ...prev,
                              preferredTenants: prev.preferredTenants.includes(
                                type
                              )
                                ? prev.preferredTenants.filter(
                                    (t: string) => t !== type
                                  ) // Remove if already selected
                                : [...prev.preferredTenants, type], // Add if not selected
                            }));
                          }}
                        />
                        <span>{type}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="darkPrimary"
                size="large"
                className="w-full p-4"
              >
                Save Preferences
              </Button>

              <p className="text-center text-gray-500 mt-2 cursor-pointer">
                Skip for Now →
              </p>
            </Form>
          )}
        </Formik>
      )}

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
