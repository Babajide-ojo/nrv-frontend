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

import ConfirmationModal from "@/app/components/shared/modals/ConfirmationModal";
import { formatDisplayValue } from "@/helpers/utils";
import { IoMdInformationCircleOutline } from "react-icons/io";



interface UnitData {
  description: string;
  rentAmount: string;
  noOfRooms: string;
  noOfBaths: string;
  apartmentStyle: string;
  leaseTerms: string;
  rentAmountMetrics: string;
  paymentOption: string;
  // availableUnits: string;
  otherAmentities: string[];
  images?: File[];
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
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentAmountStep, setCurrentAmountStep] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
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
        description: "",
        rentAmount: "",
        noOfRooms: "",
        noOfBaths: "",
        apartmentStyle: "",
        leaseTerms: "",
        rentAmountMetrics: "",
        // availableUnits: "1",
        paymentOption: "",
        otherAmentities: [],
        images: [],
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
    // if (!propertyData.zipCode.trim()) {
    //   errors.zipCode = "Zip code is required";
    // }
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

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("nameOfProperty", propertyData.nameOfProperty);
    formData.append("location", propertyData.location);
    formData.append("buildingType", buildingType.value);
    // formData.append("name", buildingType.name);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("file", selectedFiles);
    
    formData.append("createdBy", user?._id);
    
    // Create units data without images for JSON
    const unitsWithoutImages = propertyData.units.map(unit => ({
      ...unit,
      images: [] // Remove images from JSON data
    }));
    formData.append("units", JSON.stringify(unitsWithoutImages));

    // Append unit images as a separate field that backend can process
    let totalImages = 0;
    propertyData.units.forEach((unit, unitIndex) => {
      if (unit.images && unit.images.length > 0) {
        unit.images.forEach((image, imageIndex) => {
          formData.append(`unitImages`, image);
          totalImages++;
        });
      }
    });
    
    console.log(`Total unit images being sent: ${totalImages}`);
    console.log('Units data:', JSON.parse(formData.get('units') as string));

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
            description: "",
            rentAmount: "",
            noOfRooms: "",
            noOfBaths: "",
            apartmentStyle: "",
            leaseTerms: "",
            rentAmountMetrics: "",
            // availableUnits: "1",
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

  const handleUnitChangeWithComma = (
    index: number,
    field: keyof UnitData,
    value: string
  ) => {
    // Remove commas for thousands separators
    const cleanedValue = value.replace(/,/g, "");

    // Allow empty input, decimal point, or valid decimal numbers
    if (cleanedValue === "" || /^-?\d*\.?\d{0,}$/.test(cleanedValue)) {
      setPropertyData((prevData) => {
        const updatedUnits = [...prevData.units];
        updatedUnits[index] = {
          ...updatedUnits[index],
          [field]: cleanedValue,
        };
        return {
          ...prevData,
          units: updatedUnits,
        };
      });
    }
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
          // availableUnits: "1",
          paymentOption: "",
          otherAmentities: [],
          images: [],
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

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleUnitImagesChange = (index: number, files: File[]) => {
    console.log(files);
    const updatedUnits = [...propertyData.units];
    updatedUnits[index] = {
      ...updatedUnits[index],
      images: files,
    };
    console.log({updatedUnits});
    setPropertyData((prevData) => ({
      ...prevData,
      units: updatedUnits,
    }));
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
                  <div className="md:flex md:justify-between block flex-col md:flex-row gap-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Add New Property
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Add the correct property information to keep it accurate
                        and up-to-date.
                      </p>
                    </div>
                    <div className="flex justify-end gap-4 mt-4 md:mt-8 w-full md:w-auto">
                      <Button
                        variant="light"
                        className="px-6 py-1.5 rounded-md w-full md:w-auto"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="darkPrimary"
                        className="px-6 py-1.5 rounded-md w-full md:w-auto"
                        isLoading={loading}
                        disabled={loading}
                        onClick={() => setShowModal(true)}
                        // type="submit"
                      >
                        {loading ? "Submitting" : "Submit"}
                      </Button>
                    </div>
                  </div>

                  <div className="mx-auto border rounded-md py-4 mt-8 md:mt-16 px-4">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 w-full">
                      <div className="w-full md:w-1/2">
                        <p className="text-[#344054] font-medium">
                          Your Property Photo
                        </p>
                        <div className="pt-2 text-[#667085] text-sm">
                          This will be displayed to others as the property
                          thumbnail.
                        </div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <ImageUploader label="" onChange={handleImageChange} />
                      </div>
                    </div>



                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <InputField
                        label="Name of Property"
                        name="nameOfProperty"
                        required
                        value={propertyData.nameOfProperty}
                        onChange={handleInputChange}
                        error={errors.nameOfProperty}
                        css="bg-nrvLightGreyBg"
                      />
                      <InputField
                        label="Property Address/Location"
                        name="location"
                        required
                        value={propertyData.location}
                        onChange={handleInputChange}
                        error={errors.location}
                        css="bg-nrvLightGreyBg"
                      />
                      <SelectField
                        label="Building Type"
                        value={buildingType}
                        required
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
                        required
                        value={propertyData.zipCode}
                        onChange={handleInputChange}
                        error={errors.zipCode}
                        css="bg-nrvLightGreyBg"
                      />
                      <InputField
                        label="City"
                        name="city"
                        required
                        value={propertyData.city}
                        onChange={handleInputChange}
                        error={errors.city}
                        css="bg-nrvLightGreyBg"
                      />
                      <SelectField
                        label="State"
                        required
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
                                required
                                icon={
                                  <div className="relative">
                                    <IoMdInformationCircleOutline
                                      onMouseEnter={() =>
                                        setShowDescription(true)
                                      }
                                      onMouseLeave={() =>
                                        setShowDescription(false)
                                      }
                                      size={20}
                                    />
                                    {showDescription && (
                                      <div className="absolute text-start -right-3 bottom-full p-2 text-xs mb-1 rounded-md bg-white border w-[250px]">
                                        Describe the apartment, its features,
                                        and any unique selling points.
                                      </div>
                                    )}
                                  </div>
                                }
                                onChange={(e) =>
                                  handleUnitChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                name={`descriotion-${index}`}
                              />

                              <InputField
                                label="Rent Amount"
                                value={formatDisplayValue(unit.rentAmount)}
                                required
                                // onKeyPress={preventNonNumeric}
                                onChange={(e) =>
                                  handleUnitChangeWithComma(
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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
                                required
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

                              {/* <SelectField
                                label="No of Available Units"
                                value={{
                                  label: unit.availableUnits,
                                  value: unit.availableUnits,
                                }}
                                required
                                onChange={(val: any) =>
                                  handleUnitChange(
                                    index,
                                    "availableUnits",
                                    val.value
                                  )
                                }
                                options={[
                                  { label: "1", value: "1" },
                                  { label: "2", value: "2" },
                                  { label: "3", value: "3" },
                                  { label: "4", value: "4" },
                                  { label: "5", value: "5" },
                                  { label: "6", value: "6" },
                                  { label: "7", value: "7" },
                                  { label: "8", value: "8" },
                                  { label: "9", value: "9" },
                                ]}
                                name={`availableUnits-${index}`}
                              /> */}
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
                                const amenities = Array.isArray(
                                  unit.otherAmentities
                                )
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
                                        const updatedAmenities = e.target
                                          .checked
                                          ? [...amenities, amenity]
                                          : amenities.filter(
                                              (a) => a !== amenity
                                            );
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

                                                         {/* Unit Images */}
                             <div className="mt-6">
                               <div className="w-full mt-4">
                                 <label className="text-nrvInputFiledColor text-[14px] font-medium">
                                   {`Unit ${index + 1} Images`}
                                 </label>

                                 {/* Image Upload Section */}
                                 <div
                                   className="text-center w-full mt-2 w-full rounded-lg pt-4 pb-4 text-swBlack"
                                   onDragOver={(e) => e.preventDefault()}
                                   onDrop={(e) => {
                                     e.preventDefault();
                                     const files = Array.from(e.dataTransfer.files);
                                     if (files.length > 0) {
                                       const currentImages = unit.images || [];
                                       const newFiles = [...currentImages, ...files].slice(0, 5);
                                       handleUnitImagesChange(index, newFiles);
                                     }
                                   }}
                                   style={{
                                     borderColor: "#7d7d7d",
                                     borderStyle: "dotted",
                                     borderWidth: "1px",
                                   }}
                                 >
                                   {/* Selected Images Preview */}
                                   {unit.images && unit.images.length > 0 && (
                                     <div className="mb-4">
                                       <div className="text-nrvPrimaryGreen font-medium mb-2">
                                         Selected Images ({unit.images.length}/5)
                                       </div>
                                       <div className="flex flex-wrap gap-2 justify-center">
                                         {unit.images.map((file, imageIndex) => (
                                           <div key={imageIndex} className="relative group">
                                             <div
                                               className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                                               onClick={() => {
                                                 // Create overlay for preview
                                                 const overlay = document.createElement('div');
                                                 overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
                                                 overlay.onclick = () => document.body.removeChild(overlay);
                                                 
                                                 const img = document.createElement('img');
                                                 img.src = URL.createObjectURL(file);
                                                 img.className = 'w-full h-auto rounded-md shadow-lg max-w-3xl';
                                                 
                                                 const closeBtn = document.createElement('button');
                                                 closeBtn.className = 'absolute top-2 right-2 bg-white text-black rounded-full p-2';
                                                 closeBtn.textContent = 'X';
                                                 closeBtn.onclick = () => document.body.removeChild(overlay);
                                                 
                                                 const info = document.createElement('span');
                                                 info.className = 'absolute top-2 left-2 bg-white text-black rounded-full px-3 py-1 text-sm';
                                                 info.textContent = `${imageIndex + 1} of ${unit.images.length}`;
                                                 
                                                 const container = document.createElement('div');
                                                 container.className = 'relative w-auto max-w-3xl';
                                                 container.appendChild(img);
                                                 container.appendChild(closeBtn);
                                                 container.appendChild(info);
                                                 
                                                 overlay.appendChild(container);
                                                 document.body.appendChild(overlay);
                                               }}
                                             >
                                               <img
                                                 src={URL.createObjectURL(file)}
                                                 alt={`Preview ${imageIndex + 1}`}
                                                 className="w-full h-full object-cover"
                                               />
                                             </div>
                                             <button
                                               onClick={() => {
                                                 const newImages = unit.images.filter((_, i) => i !== imageIndex);
                                                 handleUnitImagesChange(index, newImages);
                                               }}
                                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                             >
                                               ×
                                             </button>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   )}

                                   {/* Upload Area */}
                                   <div className="">
                                     <input
                                       type="file"
                                       id={`multiFileInput-${index}`}
                                       className="hidden"
                                       accept=".png, .jpg, .jpeg"
                                       multiple
                                       onChange={(event) => {
                                         const files = Array.from(event.target.files || []);
                                         if (files.length > 0) {
                                           const currentImages = unit.images || [];
                                           const newFiles = [...currentImages, ...files].slice(0, 5);
                                           handleUnitImagesChange(index, newFiles);
                                         }
                                       }}
                                       disabled={(unit.images || []).length >= 5}
                                     />

                                     <label
                                       htmlFor={`multiFileInput-${index}`}
                                       className={`cursor-pointer rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3 ${
                                         (unit.images || []).length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                                       }`}
                                     >
                                       <div className="text-center flex justify-center">
                                         {(!unit.images || unit.images.length === 0) && (
                                           <svg
                                             width="57"
                                             height="57"
                                             viewBox="0 0 57 57"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg"
                                           >
                                             <circle cx="28.5" cy="28.5" r="28" fill="#F0F2F5" />
                                             <path
                                               d="M21.5013 25.5836C21.5013 22.0398 24.3741 19.167 27.918 19.167C31.0571 19.167 33.672 21.4223 34.2262 24.4014C34.3039 24.8192 34.6026 25.1616 35.0059 25.2954C37.3285 26.0657 39.0013 28.2558 39.0013 30.8336C39.0013 34.0553 36.3896 36.667 33.168 36.667C32.5236 36.667 32.0013 37.1893 32.0013 37.8336C32.0013 38.478 32.5236 39.0003 33.168 39.0003C37.6783 39.0003 41.3346 35.3439 41.3346 30.8336C41.3346 27.4591 39.2886 24.5651 36.372 23.3198C35.374 19.5846 31.9683 16.8336 27.918 16.8336C23.0855 16.8336 19.168 20.7511 19.168 25.5836C19.168 25.7006 19.1703 25.8171 19.1748 25.9331C17.0802 27.1416 15.668 29.4049 15.668 32.0003C15.668 35.8663 18.802 39.0003 22.668 39.0003C23.3123 39.0003 23.8346 38.478 23.8346 37.8336C23.8346 37.1893 23.3123 36.667 22.668 36.667C20.0906 36.667 18.0013 34.5776 18.0013 32.0003C18.0013 30.0667 19.1775 28.4052 20.8581 27.6972C21.3444 27.4924 21.6326 26.9866 21.561 26.4638C21.5217 26.1766 21.5013 25.8828 21.5013 25.5836Z"
                                               fill="#475367"
                                             />
                                             <path
                                               d="M27.7262 31.1283C28.1682 30.7354 28.8344 30.7354 29.2764 31.1283L31.0264 32.6839C31.508 33.1119 31.5514 33.8494 31.1233 34.3309C30.7488 34.7522 30.1376 34.8382 29.668 34.5665V40.167C29.668 40.8113 29.1456 41.3336 28.5013 41.3336C27.857 41.3336 27.3346 40.8113 27.3346 40.167V34.5665C26.8651 34.8382 26.2538 34.7522 25.8793 34.3309C25.4513 33.8494 25.4946 33.1119 25.9762 32.6839L27.7262 31.1283Z"
                                               fill="#475367"
                                             />
                                           </svg>
                                         )}
                                       </div>
                                       {(unit.images && unit.images.length > 0) ? (
                                         <div>
                                           <div className="flex justify-center">
                                             <svg
                                               width="57"
                                               height="57"
                                               viewBox="0 0 57 57"
                                               fill="none"
                                               xmlns="http://www.w3.org/2000/svg"
                                             >
                                               <circle cx="28.5" cy="28.5" r="28" fill="#E7F6EC" />
                                               <path
                                                 fillRule="evenodd"
                                                 clipRule="evenodd"
                                                 d="M28.5 41.625C35.7487 41.625 41.625 35.7487 41.625 28.5C41.625 21.2513 35.7487 15.375 28.5 15.375C21.2513 15.375 15.375 21.2513 15.375 28.5C15.375 35.7487 21.2513 41.625 28.5 41.625ZM33.86 26.6588C34.4539 26.1148 34.4944 25.1923 33.9505 24.5984C33.4065 24.0044 32.484 23.9639 31.89 24.5079L26.5058 29.4391L25.11 28.1608C24.516 27.6168 23.5935 27.6573 23.0496 28.2513C22.5056 28.8452 22.5461 29.7677 23.14 30.3117L25.5208 32.4921C26.0782 33.0026 26.9333 33.0026 27.4907 32.4921L33.86 26.6588Z"
                                                 fill="#0F973D"
                                               />
                                             </svg>
                                           </div>
                                           <div className="pt-2">
                                             {(unit.images || []).length >= 5 
                                               ? `Maximum 5 images selected` 
                                               : `Add more images (${unit.images.length}/5)`
                                             }
                                           </div>
                                         </div>
                                       ) : (
                                         <div className="font-light text-sm">
                                           <span className="text-nrvPrimaryGreen font-medium">
                                             Click to upload
                                           </span>{" "}
                                           <span className="font-medium text-nrvDarkGrey">
                                             or drag and drop{" "}
                                           </span>
                                           <br></br> SVG, PNG, JPG or GIF (max. 5 images)
                                         </div>
                                       )}
                                     </label>
                                   </div>
                                 </div>
                               </div>
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
                <ConfirmationModal
                  isOpen={showModal}
                  heading="Add New Property"
                  message={`Do you want to add a new property Listings?`}
                  subMessage="If you leave this page, any changes you made will be lost if you do not save them."
                  onCancel={() => setShowModal(false)}
                  onConfirm={() => handleNextAndVerify}
                />
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
