import React, { useState } from "react";
import InputField from "./input-fields/InputFields";
import SelectField from "./input-fields/SelectField";
import Button from "./buttons/Button";
import MultiImageUploader from "./MultiImageUploader";
import { toast } from "react-toastify";
import { formatDisplayValue } from "@/helpers/utils";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface RoomFormData {
  description: string;
  rentAmountMetrics: string;
  rentAmount: string;
  noOfRooms: string;
  noOfBaths: string;
  noOfPools: string;
  apartmentStyle: string;
  apartmentType: string;
  leaseTerms: string;
  paymentOption: string;
  otherAmentities: string[];
  images: File[];
  propertyId: string;
}

interface RoomFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<RoomFormData>;
  propertyId?: string;
}

const RoomForm: React.FC<RoomFormProps> = ({ 
  onSubmit, 
  loading = false, 
  initialData = {},
  propertyId = ""
}) => {
  const [showDescription, setShowDescription] = useState(false);
  const [roomData, setRoomData] = useState<RoomFormData>({
    description: "",
    rentAmountMetrics: "",
    rentAmount: "",
    noOfRooms: "",
    noOfBaths: "",
    noOfPools: "",
    apartmentStyle: "",
    apartmentType: "",
    leaseTerms: "",
    paymentOption: "",
    otherAmentities: [],
    images: [],
    propertyId: propertyId,
    ...initialData
  });

  console.log('RoomForm roomData:', roomData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeWithComma = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Remove commas for thousands separators
    const cleanedValue = value.replace(/,/g, "");

    // Allow empty input, decimal point, or valid decimal numbers
    if (cleanedValue === "" || /^-?\d*\.?\d{0,}$/.test(cleanedValue)) {
      setRoomData((prevData) => ({
        ...prevData,
        [name]: cleanedValue,
      }));
    }
  };

  const handleSelectChange = (selectedOption: any, name: string) => {
    setRoomData((prev) => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = roomData.otherAmentities;
    const updated = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];

    setRoomData((prev) => ({
      ...prev,
      otherAmentities: updated,
    }));
  };

  const handleImagesChange = (files: File[]) => {
    console.log('RoomForm handleImagesChange called with:', files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const fileType = file.type.toLowerCase();
      return fileType.startsWith('image/');
    });
    
    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped. Only image files are allowed.");
    }
    
    setRoomData((prevData) => ({
      ...prevData,
      images: validFiles,
    }));
    console.log('RoomForm roomData.images updated to:', validFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { description, rentAmount, noOfRooms, noOfBaths, propertyId } = roomData;

    if (!description || !rentAmount || !noOfRooms || !noOfBaths || !propertyId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Optional: Validate that at least one image is uploaded
    if (roomData.images.length === 0) {
      toast.error("Please upload at least one image for the room.");
      return;
    }

    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.entries(roomData).forEach(([key, value]: any) => {
      if (key === "otherAmentities") {
        formData.append("otherAmentities", JSON.stringify(value));
      } else if (key === "images") {
        // Handle images separately
        value.forEach((file: File) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    // Debug: Log all FormData entries
    console.log('RoomForm FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  const amenityOptions = [
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
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-6xl mx-auto border rounded-md py-8 rounded-[#ECECEE] bg-[#FDFDFC]">
        <div className="md:flex md:justify-between block p-4 md:p-4 max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-semibold mb-2">Apartment Information</h2>
            <p className="text-sm text-gray-500 mb-6">
              These details are used to help you identify the rental. It is not
              connected to Rent Payments or Lease Agreements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Description"
                required
                icon={
                  <div className="relative">
                    <IoMdInformationCircleOutline
                      onMouseEnter={() => setShowDescription(true)}
                      onMouseLeave={() => setShowDescription(false)}
                      size={20}
                    />
                    {showDescription && (
                      <div className="absolute text-start -right-3 bottom-full p-2 text-xs mb-1 rounded-md bg-white border w-[250px]">
                        Describe the apartment, its features, and any unique
                        selling points.
                      </div>
                    )}
                  </div>
                }
                placeholder="Spacious 2-bedroom apartment with sea view"
                value={roomData.description}
                onChange={handleInputChange}
                name="description"
              />

              <InputField
                label="Rent Amount"
                required
                placeholder="250,000"
                value={formatDisplayValue(roomData.rentAmount)}
                onChange={handleInputChangeWithComma}
                name="rentAmount"
              />

              <InputField
                label="Bedrooms"
                required
                placeholder="2"
                value={roomData.noOfRooms}
                onChange={handleInputChange}
                name="noOfRooms"
              />

              <InputField
                label="Bathrooms"
                required
                placeholder="2"
                value={roomData.noOfBaths}
                onChange={handleInputChange}
                name="noOfBaths"
              />

              <InputField
                label="Pools"
                placeholder="1"
                value={roomData.noOfPools}
                onChange={handleInputChange}
                name="noOfPools"
              />

              <SelectField
                label="Apartment Style"
                value={{
                  label: roomData.apartmentStyle,
                  value: roomData.apartmentStyle,
                }}
                required
                onChange={(val: any) =>
                  handleSelectChange(val, "apartmentStyle")
                }
                options={[
                  { label: "Modern", value: "Modern" },
                  { label: "Contemporary", value: "Contemporary" },
                  { label: "Classic", value: "Classic" },
                ]}
                name="apartmentStyle"
              />

              <SelectField
                label="Apartment Type"
                value={{
                  label: roomData.apartmentType,
                  value: roomData.apartmentType,
                }}
                required
                onChange={(val: any) =>
                  handleSelectChange(val, "apartmentType")
                }
                options={[
                  { label: "Studio", value: "Studio" },
                  { label: "1 Bedroom", value: "1 Bedroom" },
                  { label: "2 Bedroom", value: "2 Bedroom" },
                  { label: "3 Bedroom", value: "3 Bedroom" },
                  { label: "4 Bedroom", value: "4 Bedroom" },
                  { label: "5 Bedroom", value: "5 Bedroom" },
                ]}
                name="apartmentType"
              />

              <SelectField
                label="Lease Terms"
                value={{
                  label: roomData.leaseTerms,
                  value: roomData.leaseTerms,
                }}
                required
                onChange={(val: any) =>
                  handleSelectChange(val, "leaseTerms")
                }
                options={[
                  { label: "1-Year Lease, Renewable", value: "1-Year Lease, Renewable" },
                  { label: "2-Year Lease, Renewable", value: "2-Year Lease, Renewable" },
                  { label: "3-Year Lease, Renewable", value: "3-Year Lease, Renewable" },
                  { label: "6-Month Lease", value: "6-Month Lease" },
                  { label: "Month-to-Month", value: "Month-to-Month" },
                ]}
                name="leaseTerms"
              />

              <SelectField
                label="Rent Amount Metrics"
                value={{
                  label: roomData.rentAmountMetrics,
                  value: roomData.rentAmountMetrics,
                }}
                required
                onChange={(val: any) =>
                  handleSelectChange(val, "rentAmountMetrics")
                }
                options={[
                  { label: "Monthly", value: "Monthly" },
                  { label: "Quarterly", value: "Quarterly" },
                  { label: "Annually", value: "Annually" },
                ]}
                name="rentAmountMetrics"
              />

              <SelectField
                label="Payment Option"
                value={{
                  label: roomData.paymentOption,
                  value: roomData.paymentOption,
                }}
                required
                onChange={(val: any) =>
                  handleSelectChange(val, "paymentOption")
                }
                options={[
                  { label: "Full Payment", value: "Full Payment" },
                  { label: "Installment", value: "Installment" },
                  { label: "Flexible Payment", value: "Flexible Payment" },
                ]}
                name="paymentOption"
              />
            </div>

            <div className="mt-6 max-w-4xl mx-auto">
              <p className="text-sm font-medium mb-2">Other Amenities</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenityOptions.map((amenity, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={roomData.otherAmentities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="peer hidden"
                    />
                    <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center peer-checked:bg-green-600 transition">
                      {roomData.otherAmentities.includes(amenity) && (
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
                    <span className="text-[12px] text-[#67667A]">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 max-w-4xl mx-auto">
              <MultiImageUploader 
                label="Room Images" 
                onChange={handleImagesChange} 
                value={roomData.images}
                maxFiles={10}
                acceptedTypes=".png, .jpg, .jpeg, .gif"
              />
              {roomData.images.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {roomData.images.length} image(s) selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          type="submit"
          size="minLarge"
          className="w-full mb-8"
          disabled={loading}
          variant="darkPrimary"
          isLoading={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm; 