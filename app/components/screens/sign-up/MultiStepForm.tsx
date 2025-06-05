import React, { useState } from "react";
// import { Formik, Form } from "formik";
import * as yup from "yup";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import Button from "@/app/components/shared/buttons/Button";
// import { AnyComponent } from "styled-components/dist/types";
import { createProperty } from "@/redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import CenterModal from "../../shared/modals/CenterModal";
import { useRouter } from "next/navigation";
// import FormikSelectField from "../../shared/input-fields/FormikSelectField";
// import { nigerianStatesAndLGAs } from "@/helpers/data";
import ImageUploader from "../../shared/ImageUploader";
import { toast } from "react-toastify";
import { nigerianStates } from "@/helpers/data";

// const propertyTypes = [
//   { value: "apartment", label: "Residential – Apartment" },
//   { value: "house", label: "Residential – House" },
//   { value: "commercial", label: "Commercial Property" },
// ];

// const cities = [
//   { value: "lagos-island", label: "Lagos Island" },
//   { value: "ikeja", label: "Ikeja" },
// ];

// const states = [
//   { value: "abia", label: "Abia" },
//   { value: "adamawa", label: "Adamawa" },
//   { value: "akwaibom", label: "Akwa Ibom" },
//   { value: "anambra", label: "Anambra" },
//   { value: "bauchi", label: "Bauchi" },
//   { value: "bayelsa", label: "Bayelsa" },
//   { value: "benue", label: "Benue" },
//   { value: "borno", label: "Borno" },
//   { value: "crossriver", label: "Cross River" },
//   { value: "delta", label: "Delta" },
//   { value: "ebonyi", label: "Ebonyi" },
//   { value: "edo", label: "Edo" },
//   { value: "ekiti", label: "Ekiti" },
//   { value: "enugu", label: "Enugu" },
//   { value: "gombe", label: "Gombe" },
//   { value: "imo", label: "Imo" },
//   { value: "jigawa", label: "Jigawa" },
//   { value: "kaduna", label: "Kaduna" },
//   { value: "kano", label: "Kano" },
//   { value: "katsina", label: "Katsina" },
//   { value: "kebbi", label: "Kebbi" },
//   { value: "kogi", label: "Kogi" },
//   { value: "kwara", label: "Kwara" },
//   { value: "lagos", label: "Lagos" },
//   { value: "nasarawa", label: "Nasarawa" },
//   { value: "niger", label: "Niger" },
//   { value: "ogun", label: "Ogun" },
//   { value: "ondo", label: "Ondo" },
//   { value: "osun", label: "Osun" },
//   { value: "oyo", label: "Oyo" },
//   { value: "plateau", label: "Plateau" },
//   { value: "rivers", label: "Rivers" },
//   { value: "sokoto", label: "Sokoto" },
//   { value: "taraba", label: "Taraba" },
//   { value: "yobe", label: "Yobe" },
//   { value: "zamfara", label: "Zamfara" },
//   { value: "fct", label: "Federal Capital Territory (Abuja)" },
// ];

// const rentCollectionOptions = [
//   { value: "monthly", label: "Monthly" },
//   { value: "quarterly", label: "Quarterly" },
//   { value: "annually", label: "Annually" },
// ];

// const validationSchema = yup.object({
//   propertyName: yup.string().required("Property Name is required"),
//   address: yup.string().required("Address is required"),
//   propertyType: yup.string().required("Property Type is required"),
//   city: yup.string().required("City is required"),
//   state: yup.string().required("State is required"),
//   rentCollection: yup.string().required("Rent collection cycle is required"),
// });

interface UnitData {
  description: string;
  rentAmount: string;
  noOfRooms: string;
  noOfBaths: string;
  apartmentStyle: string;
  leaseTerms: string;
  rentAmountMetrics: string;
  paymentOption: string;
  otherAmentities: string[];
}

interface PropertyData {
  nameOfProperty: string;
  location: string;
  buildingType: string;
  city: string;
  state: string;
  zipCode: string;
  units: UnitData[];
}

const MultiStepForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<any>(false);
  // const [selectedState, setSelectedState] = useState<string | null>(null);
  // const [lgaOptions, setLgaOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [buildingType, setBuildingType] = useState<any>({
    label: "Residential",
    value: "Residential",
  });
  const [propertyData, setPropertyData] = useState<PropertyData>({
    nameOfProperty: "",
    location: "",
    buildingType: "Residential",
    city: "",
    state: "",
    zipCode: "",
    units: [
      {
        description: "",
        rentAmount: "",
        noOfRooms: "",
        noOfBaths: "",
        apartmentStyle: "",
        leaseTerms: "",
        rentAmountMetrics: "",
        paymentOption: "",
        otherAmentities: [],
      },
    ],
  });

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!propertyData.nameOfProperty.trim()) {
      errors.nameOfProperty = "Property name is required";
    }
    if (!propertyData.location.trim()) {
      errors.location = "Address/Location is required";
    }
    if (!propertyData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
    if (!propertyData.state.trim()) {
      errors.state = "State is required";
    }
    if (!selectedFiles || selectedFiles.length === 0) {
      errors.file = "A file is required";
    }

    if (!propertyData.units || propertyData.units.length === 0) {
      errors.units = "At least one room/unit must be added";
    } else {
      propertyData.units.forEach((unit, index) => {
        if (!unit.description?.trim() || !unit.rentAmount?.trim()) {
          errors[`unit-${index}`] = `Room ${
            index + 1
          }: Name and rent are required`;
        }
      });
    }

    // ✅ Show a single toast if any errors exist
    if (Object.keys(errors).length > 0) {
      toast.error("All fields are required");
      return false;
    }

    return true;
  };

  const handleNextAndVerify = async (e: any) => {

    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("nameOfProperty", propertyData.nameOfProperty);
    formData.append("location", propertyData.location);
    formData.append("buildingType", buildingType.value);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("file", selectedFiles);
    formData.append(
      "createdBy",
      JSON.parse(localStorage.getItem("nrv-user") as string)?.user?._id
    );
    formData.append("units", JSON.stringify(propertyData.units));

    try {
      setIsLoading(true);
      await dispatch(createProperty(formData) as any).unwrap();
      setPropertyData({
        nameOfProperty: "",
        location: "",
        buildingType: "Residential",
        city: "",
        state: "",
        zipCode: "",
        units: [
          {
            description: "",
            rentAmount: "",
            noOfRooms: "",
            noOfBaths: "",
            apartmentStyle: "",
            leaseTerms: "",
            rentAmountMetrics: "",
            paymentOption: "",
            otherAmentities: [],
          },
        ],
      });
      setSelectedFiles([]);
      setShowModal(true);
      setIsLoading(false);
    } catch (error: any) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUnitChange = (
    index: number,
    field: keyof UnitData,
    value: UnitData[keyof UnitData]
  ) => {
    const updatedUnits = [...propertyData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value,
    };
    setPropertyData((prevData) => ({
      ...prevData,
      units: updatedUnits,
    }));
  };

  const addUnit = () => {
    setPropertyData((prevData) => ({
      ...prevData,
      units: [
        ...prevData.units,
        {
          description: "",
          rentAmount: "",
          noOfRooms: "",
          noOfBaths: "",
          apartmentStyle: "",
          leaseTerms: "",
          rentAmountMetrics: "",
          paymentOption: "",
          otherAmentities: [],
        },
      ],
    }));
  };

  const removeUnit = (index: number) => {
    const updatedUnits = [...propertyData.units];
    updatedUnits.splice(index, 1);
    setPropertyData((prevData) => ({
      ...prevData,
      units: updatedUnits,
    }));
  };

  const handleImageChange = (file: File) => {
    setSelectedFiles(file);
  };

  return (
    <div className="mx-auto mt-10 p-8 bg-white w-full">
      <form onSubmit={handleNextAndVerify} encType="multipart/form-data">
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <button
                className="text-center text-gray-500 mt-2 cursor-pointer"
                onClick={() => router.push("/dashboard/landlord")}
              >
                Skip for Now →
              </button>
            </div>
            <h2 className="text-2xl font-bold">Add Your Property</h2>
            <p className="text-gray-500">
              Help us personalize your experience by providing more details.
            </p>

            <InputField
              label="Name of Property"
              name="nameOfProperty"
              value={propertyData.nameOfProperty}
              onChange={handleInputChange}
              error={errors.nameOfProperty}
              css="bg-nrvLightGreyBg"
            />
            <InputField
              label="Property Address/Location"
              name="location"
              value={propertyData.location}
              onChange={handleInputChange}
              error={errors.location}
              css="bg-nrvLightGreyBg"
            />

            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Building Type"
                value={buildingType}
                onChange={(val: any) => setBuildingType(val)}
                options={[
                  { label: "Residential", value: "Residential" },
                  { label: "Commercial", value: "Commercial" },
                ]}
                placeholder="Select Building Type"
                name={"buildingType"}
              />

              <InputField
                label="Zip Code"
                name="zipCode"
                value={propertyData.zipCode}
                onChange={handleInputChange}
                error={errors.zipCode}
                css="bg-nrvLightGreyBg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="City"
                name="city"
                value={propertyData.city}
                onChange={handleInputChange}
                error={errors.city}
                css="bg-nrvLightGreyBg"
              />
              <SelectField
                label="State"
                value={{
                  label: propertyData.state,
                  value: propertyData.state,
                }}
                onChange={(val: any) =>
                  setPropertyData({
                    ...propertyData,
                    state: val?.value,
                  })
                }
                options={nigerianStates}
                placeholder="Select State"
                error={errors.state}
                name={"state"}
              />
            </div>

            {/* <div className="mx-auto border rounded-md py-4 mt-16"> */}
            <div className="max-w-4xl mx-auto flex gap-8 w-full">
              <div className="w-full">
                <ImageUploader label="" onChange={handleImageChange} />
              </div>
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between">
              {" "}
              <h2 className="text-2xl font-bold">
                Set Up Your Property Preferences
              </h2>
            </div>
            <p className="text-gray-500">
              Tell us more about what you&apos;re looking for.
            </p>

            {propertyData.units.map((unit, index) => (
              <div key={index} className="rounded-xl mb-6 bg-white">
                <div className="flex justify-between">
                  <h3 className="font-semibold mb-2">Unit {index + 1}</h3>

                  {index > 0 && (
                    <Button
                      variant="light"
                      className="text-red-500"
                      type="button"
                      onClick={() => removeUnit(index)}
                    >
                      - Remove Unit
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  <InputField
                    label="Description"
                    value={unit?.description}
                    onChange={(e) =>
                      handleUnitChange(index, "description", e.target.value)
                    }
                    name={`descriotion-${index}`}
                  />

                  <InputField
                    label="Rent Amount"
                    value={unit.rentAmount}
                    onChange={(e) =>
                      handleUnitChange(index, "rentAmount", e.target.value)
                    }
                    name={`rentAmount-${index}`}
                  />

                  <InputField
                    label="Bedrooms"
                    value={unit.noOfRooms}
                    onChange={(e) =>
                      handleUnitChange(index, "noOfRooms", e.target.value)
                    }
                    name={`noOfRooms-${index}`}
                  />

                  <InputField
                    label="Bathrooms"
                    value={unit.noOfBaths}
                    onChange={(e) =>
                      handleUnitChange(index, "noOfBaths", e.target.value)
                    }
                    name={`noOfBaths-${index}`}
                  />
                  <SelectField
                    label="Apartment Style"
                    value={{
                      label: unit.apartmentStyle,
                      value: unit.apartmentStyle,
                    }}
                    onChange={(val: any) =>
                      handleUnitChange(index, "apartmentStyle", val?.value)
                    }
                    options={[
                      { label: "Modern", value: "Modern" },
                      {
                        label: "Contemporary",
                        value: "Contemporary",
                      },
                      { label: "Classic", value: "Classic" },
                    ]}
                    name={`apartmentStyle-${index}`}
                  />

                  <SelectField
                    label="Lease Terms"
                    value={{
                      label: unit.leaseTerms,
                      value: unit.leaseTerms,
                    }}
                    onChange={(val: any) =>
                      handleUnitChange(index, "leaseTerms", val?.value)
                    }
                    options={[
                      {
                        label: "1-Year Lease, Renewable",
                        value: "1-Year Lease, Renewable",
                      },
                      {
                        label: "6 Months Lease",
                        value: "6 Months Lease",
                      },
                    ]}
                    name={`leaseTerms-${index}`}
                  />

                  <SelectField
                    label="Rent Collection Preference"
                    value={{
                      label: unit.rentAmountMetrics,
                      value: unit.rentAmountMetrics,
                    }}
                    onChange={(val: any) =>
                      handleUnitChange(index, "rentAmountMetrics", val?.value)
                    }
                    options={[
                      { label: "Annually", value: "Annually" },
                      { label: "Monthly", value: "Monthly" },
                      { label: "Quarterly", value: "Quarterly" },
                    ]}
                    name={`rentAmountMetrics-${index}`}
                  />

                  <SelectField
                    label="Payment Option"
                    value={{
                      label: unit.paymentOption,
                      value: unit.paymentOption,
                    }}
                    onChange={(val: any) =>
                      handleUnitChange(index, "paymentOption", val.value)
                    }
                    options={[
                      {
                        label: "Full Payment",
                        value: "Full Payment",
                      },
                      {
                        label: "Installment",
                        value: "Installment",
                      },
                    ]}
                    name={`paymentOption-${index}`}
                  />
                </div>

                <p className="text-sm font-medium my-2">Other Amenities</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "Parking Space",
                    "Wi-Fi/Internet",
                    "Gym/Fitness Centre",
                    "Outdoor living area",
                    "Security",
                    "Spa",
                    "Power Backup",
                    "Swimming Pool",
                    "Major appliances",
                    "Smart Technology",
                    "Smart Wine Cellar",
                    "Home Theatres",
                    "Elevator",
                  ].map((amenity, i) => {
                    const amenities = Array.isArray(unit.otherAmentities)
                      ? unit.otherAmentities
                      : [];

                    return (
                      <label
                        key={i}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(amenity)}
                          onChange={(e) => {
                            const updatedAmenities = e.target.checked
                              ? [...amenities, amenity]
                              : amenities.filter((a) => a !== amenity);
                            handleUnitChange(
                              index,
                              "otherAmentities",
                              updatedAmenities
                            );
                          }}
                          className="peer hidden"
                        />
                        <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center peer-checked:bg-green-600 transition">
                          {amenities.includes(amenity) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center mb-5">
              <Button
                variant="light"
                className="mt-4"
                onClick={addUnit}
                type="button"
              >
                + Add Another Unit
              </Button>
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
                className="text-center text-sm text-red-500 mt-2 cursor-pointer"
                onClick={() => setStep(1)}
              >
                {" "}
                Go Back
              </p>
            </div>
          </div>
        )}
      </form>

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
