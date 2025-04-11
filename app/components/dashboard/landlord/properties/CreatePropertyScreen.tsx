"use client";

import LoadingPage from "../../../loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../guard/LandlordProtectedRoute";
import LandLordLayout from "../../../layout/LandLordLayout";
import Button from "../../../shared/buttons/Button";
import { useDispatch } from "react-redux";
import {
  createProperty,
  getPropertyByUserId,
} from "../../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import PropertySuccess from "../../../loaders/PropertySuccess";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { nigerianStates } from "@/helpers/data";
import ImageUploader from "@/app/components/shared/ImageUploader";

interface UnitData {
  name: string;
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

const CreatePropertyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentAmountStep, setCurrentAmountStep] = useState(0);
  const [buildingType, setBuildingType] = useState<any>({
    label: "Residential",
    value: "Residential",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<PropertyData>({
    nameOfProperty: "",
    location: "",
    buildingType: "Residential",
    city: "",
    state: "",
    zipCode: "",
    units: [
      {
        name: "",
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
        if (!unit.name?.trim() || !unit.rentAmount?.trim()) {
          errors[`unit-${index}`] = `Room ${index + 1}: Name and rent are required`;
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
  
  
  

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
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
    formData.append("createdBy", user?._id);
    formData.append("units", JSON.stringify(propertyData.units));

    try {
      setLoading(true);
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
            name: "",
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
      setLoading(false);
      setCurrentAmountStep(1);
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
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
          name: "",
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const fetchProperties = async () => {
        const properties = await dispatch(
          getPropertyByUserId(user?.user?._id) as any
        ).unwrap();
        setProperties(properties?.data);
      };
      fetchProperties();
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout
            path="Properties"
            mainPath="Manage Properties"
            subMainPath="Add Property"
          >
            <ToastContainer />
            {currentAmountStep === 0 && (
              <form
                onSubmit={handleNextAndVerify}
                encType="multipart/form-data"
              >
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm font-jakarta">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Add New Property
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Add the correct property information to keep it accurate
                        and up-to-date.
                      </p>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        variant="light"
                        className="px-6 py-1.5 rounded-md"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="darkPrimary"
                        className="px-6 py-1.5 rounded-md"
                        isLoading={loading}
                        disabled={loading}
                        type="submit"
                      >
                        {loading ? "Submitting" : "Submit"}
                      </Button>
                    </div>
                  </div>

                  <div className="mx-auto border rounded-md py-4 mt-16">
                    <div className="max-w-4xl mx-auto flex gap-8 w-full">
                      <div className="w-1/2">
                        <p className="text-[#344054] font-medium">
                          Your Property Photo
                        </p>
                        <div className="pt-2 text-[#667085] text-sm">
                          This will be displayed to others as the property
                          thumbnail.
                        </div>
                      </div>
                      <div className="w-1/2">
                        <ImageUploader label="" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          setPropertyData({ ...propertyData, state: val?.value })
                        }
                        options={nigerianStates}
                        placeholder="Select State"
                        error={errors.state}
                        name={"state"}
                      />
                    </div>

                    <div className="mt-6">
                      <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl font-semibold mb-2">
                          Add Units
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                          Add one or more units
                        </p>
                        {propertyData.units.map((unit, index) => (
                          <div
                            key={index}
                            className="border p-4 rounded-xl mb-6 bg-white shadow-sm"
                          >
                       <div className="flex justify-between">
                       <h3 className="font-semibold mb-2">
                              Unit {index + 1}
                            </h3>

                            {index > 0 && (
                                <Button
                                variant="light"
                                className="text-red-500"
                                type="button"
                                onClick={()=>removeUnit(index)}
                              >
                                - Remove Unit
                              </Button>
                            )}
                       </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                              <InputField
                                label="Description"
                                value={unit?.name}
                                onChange={(e) =>
                                  handleUnitChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                name={`name-${index}`}
                              />

                              <InputField
                                label="Rent Amount"
                                value={unit.rentAmount}
                                onChange={(e) =>
                                  handleUnitChange(
                                    index,
                                    "rentAmount",
                                    e.target.value
                                  )
                                }
                                name={`rentAmount-${index}`}
                              />

                              <InputField
                                label="Bedrooms"
                                value={unit.noOfRooms}
                                onChange={(e) =>
                                  handleUnitChange(
                                    index,
                                    "noOfRooms",
                                    e.target.value
                                  )
                                }
                                name={`noOfRooms-${index}`}
                              />

                              <InputField
                                label="Bathrooms"
                                value={unit.noOfBaths}
                                onChange={(e) =>
                                  handleUnitChange(
                                    index,
                                    "noOfBaths",
                                    e.target.value
                                  )
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
                                  handleUnitChange(
                                    index,
                                    "apartmentStyle",
                                    val?.value
                                  )
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
                                  handleUnitChange(
                                    index,
                                    "leaseTerms",
                                    val?.value
                                  )
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
                                  handleUnitChange(
                                    index,
                                    "rentAmountMetrics",
                                    val?.value
                                  )
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
                                  handleUnitChange(
                                    index,
                                    "paymentOption",
                                    val.value
                                  )
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

                            <p className="text-sm font-medium mb-2">
  Other Amenities
</p>
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
    const amenities = Array.isArray(unit.otherAmentities) ? unit.otherAmentities : [];

    return (
      <label key={i} className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={amenities.includes(amenity)}
          onChange={(e) => {
            const updatedAmenities = e.target.checked
              ? [...amenities, amenity]
              : amenities.filter((a) => a !== amenity);
            handleUnitChange(index, "otherAmentities", updatedAmenities);
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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

                        <Button
                          variant="light"
                          className="mt-4"
                          onClick={addUnit}
                          type="button"
                        >
                          + Add Another Unit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
            {currentAmountStep === 1 && <PropertySuccess />}
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default CreatePropertyScreen;
