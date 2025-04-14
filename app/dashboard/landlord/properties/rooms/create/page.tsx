"use client";

import LoadingPage from "../../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../../components/layout/LandLordLayout";
import Button from "../../../../../components/shared/buttons/Button";
import InputField from "../../../../../components/shared/input-fields/InputFields";
import { useDispatch } from "react-redux";
import {
  getPropertyByUserId,
  createRooms,
} from "../../../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import SelectField from "@/app/components/shared/input-fields/SelectField";

const CreateRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<any>({
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
    propertyId:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("property") as any)?._id
        : "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption: any, name: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(fileExtension || "")) {
        toast.error("Invalid file type. Only JPG, JPEG, PNG allowed.");
        return;
      }
      setRoomData((prev: any) => ({ ...prev, file }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = roomData.otherAmentities;
    const updated = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a: string) => a !== amenity)
      : [...currentAmenities, amenity];
  
    setRoomData((prev: any) => ({
      ...prev,
      otherAmentities: updated,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { description, rentAmount, noOfRooms, noOfBaths, file, propertyId } =
      roomData;

    if (
      !description ||
      !rentAmount ||
      !noOfRooms ||
      !noOfBaths ||
      !propertyId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]: any) => {
      if (key === "otherAmentities") {
        formData.append("otherAmentities", JSON.stringify(value));
      } else if (key === "file" && value) {
        formData.append("file", value);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      setLoading(true);
      await dispatch(createRooms(formData) as any).unwrap();
      toast.success("Room added successfully");
      router.push(`/dashboard/landlord/properties/${propertyId}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      // dispatch(getPropertyByUserId(user?.user?._id));
      const timer = setTimeout(() => setIsLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

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
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout    path="Apartment"
          mainPath="Manage Apartment"
          subMainPath="Add New Apartment">
            <ToastContainer />
            <form onSubmit={handleSubmit}>
              <div className="max-w-6xl w-full mx-auto p-8">
                <div className="text-2xl flex gap-3 mb-4">
                  <span
                    onClick={() =>
                      router.push("/dashboard/landlord/properties")
                    }
                  >
                    <FaArrowLeft size={20} className="mt-1 cursor-pointer" />
                  </span>
                  Add New Apartment
                </div>
                <p className="text-sm text-nrvLightGrey mb-6">
                  These details are used to help you identify the rental. It is
                  not connected to Rent Payments or Lease Agreements.
                </p>
                <div className="max-w-6xl mx-auto border rounded-md py-8 rounded-[#ECECEE] bg-[#FDFDFC]">
                <div className="md:flex md:justify-between block p-4 md:p-4 max-w-4xl mx-auto">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                      Apartment Information
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
                  <div className="p-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SelectField
                      placeholder="Select Apartment Type"
                      label="Apartment Type"
                      value={
                        roomData.apartmentType
                          ? {
                              label: roomData.apartmentType,
                              value: roomData.apartmentType,
                            }
                          : null
                      }
                      onChange={(val) =>
                        handleSelectChange(val, "apartmentType")
                      }
                      options={[
                        { label: "Self-contained", value: "Self-contained" },
                        {
                          label: "Shared Apartment",
                          value: "Shared Apartment",
                        },
                        { label: "Mini Flat", value: "Mini Flat" },
                        { label: "1 Bedroom Flat", value: "1 Bedroom Flat" },
                        { label: "2 Bedroom Flat", value: "2 Bedroom Flat" },
                        { label: "3 Bedroom Flat", value: "3 Bedroom Flat" },
                        { label: "4 Bedroom Flat", value: "4 Bedroom Flat" },
                        { label: "Bungalow", value: "Bungalow" },
                        { label: "Duplex", value: "Duplex" },
                        { label: "Terraced Duplex", value: "Terraced Duplex" },
                        {
                          label: "Semi-detached Duplex",
                          value: "Semi-detached Duplex",
                        },
                        { label: "Detached Duplex", value: "Detached Duplex" },
                        { label: "Penthouse", value: "Penthouse" },
                        { label: "Maisonette", value: "Maisonette" },
                        {
                          label: "Studio Apartment",
                          value: "Studio Apartment",
                        },
                        {
                          label: "Co-living Apartment",
                          value: "Co-living Apartment",
                        },
                        {
                          label: "Serviced Apartment",
                          value: "Serviced Apartment",
                        },
                        {
                          label: "Luxury Apartment",
                          value: "Luxury Apartment",
                        },
                        {
                          label: "Boys' Quarters (BQ)",
                          value: "Boys' Quarters (BQ)",
                        },
                      ]}
                      name={""}
                    />

                    <SelectField
                      placeholder="Select Apartment Style"
                      label="Apartment Style"
                      value={
                        roomData.apartmentStyle
                          ? {
                              label: roomData.apartmentStyle,
                              value: roomData.apartmentStyle,
                            }
                          : null
                      }
                      onChange={(val) =>
                        handleSelectChange(val, "apartmentStyle")
                      }
                      options={[
                        { label: "Modern", value: "Modern" },
                        { label: "Contemporary", value: "Contemporary" },
                        { label: "Classic", value: "Classic" },
                      ]}
                      name={""}
                    />
                    <InputField
                      label="Description"
                      placeholder="Spacious 2-bedroom apartment with sea view"
                      value={roomData.description}
                      onChange={handleInputChange}
                      name="description"
                    />

                    <InputField
                      label="Rent Amount"
                      placeholder="250000"
                      value={roomData.rentAmount}
                      onChange={handleInputChange}
                      name="rentAmount"
                    />

                    <InputField
                      label="Bedrooms"
                      placeholder="2"
                      value={roomData.noOfRooms}
                      onChange={handleInputChange}
                      name="noOfRooms"
                    />

                    <InputField
                      label="Bathrooms"
                      placeholder="2"
                      value={roomData.noOfBaths}
                      onChange={handleInputChange}
                      name="noOfBaths"
                    />

                    <SelectField
                      label="Lease Terms"
                      placeholder="Select Lease Terms"
                      value={
                        roomData.leaseTerms
                          ? {
                              label: roomData.leaseTerms,
                              value: roomData.leaseTerms,
                            }
                          : null
                      }
                      onChange={(val) => handleSelectChange(val, "leaseTerms")}
                      options={[
                        {
                          label: "1-Year Lease, Renewable",
                          value: "1-Year Lease, Renewable",
                        },
                        { label: "6 Months Lease", value: "6 Months Lease" },
                      ]}
                      name=""
                    />

                    <SelectField
                      label="Rent Collection Preference"
                      placeholder="Select Rent Collection Preference"
                      value={
                        roomData.rentAmountMetrics
                          ? {
                              label: roomData.rentAmountMetrics,
                              value: roomData.rentAmountMetrics,
                            }
                          : null
                      }
                      onChange={(val) =>
                        handleSelectChange(val, "rentAmountMetrics")
                      }
                      options={[
                        { label: "Annually", value: "Annually" },
                        { label: "Monthly", value: "Monthly" },
                        { label: "Quarterly", value: "Quarterly" },
                      ]}
                      name=""
                    />

                    <SelectField
                      label="Payment Option"
                      placeholder="Select Payment Option"
                      value={
                        roomData.paymentOption
                          ? {
                              label: roomData.paymentOption,
                              value: roomData.paymentOption,
                            }
                          : null
                      }
                      onChange={(val) =>
                        handleSelectChange(val, "paymentOption")
                      }
                      options={[
                        { label: "Full Payment", value: "Full Payment" },
                        { label: "Installment", value: "Installment" },
                      ]}
                      name=""
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
                </div>

                {/* <div className="flex justify-center mt-8">
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
                </div> */}
              </div>
            </form>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default CreateRoom;
