"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import Button from "@/app/components/shared/buttons/Button";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { useDispatch } from "react-redux";
import { getRoomById, updateRoom } from "@/redux/slices/propertySlice";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import { formatDisplayValue } from "@/helpers/utils";
import {
  blockNonPositiveRentKeys,
  isValidPositiveRentAmount,
  sanitizePositiveRentInput,
} from "@/lib/rentAmount";
import { IoMdInformationCircleOutline } from "react-icons/io";
import MultiImageUploader from "@/app/components/shared/MultiImageUploader";

const UpdateRoomPage = () => {
  const [showDescription, setShowDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
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
    images: [],
    propertyId: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const roomId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const load = async () => {
      if (!roomId) return;
      try {
        const response = await dispatch(getRoomById(roomId) as any).unwrap();
        const room = response?.data;
        if (!room) {
          toast.error("Apartment not found");
          router.back();
          return;
        }
        const propId =
          typeof room.propertyId === "object"
            ? room.propertyId?._id
            : room.propertyId;
        setExistingImageUrls(
          Array.isArray(room.imageUrls)
            ? room.imageUrls
                .map((u: any) =>
                  typeof u === "string" ? u : u?.secure_url || u?.url || "",
                )
                .filter(Boolean)
            : [],
        );
        setRoomData({
          description: room.description || "",
          rentAmountMetrics: room.rentAmountMetrics || "",
          rentAmount: room.rentAmount != null ? String(room.rentAmount) : "",
          noOfRooms: room.noOfRooms != null ? String(room.noOfRooms) : "",
          noOfBaths: room.noOfBaths != null ? String(room.noOfBaths) : "",
          noOfPools: room.noOfPools != null ? String(room.noOfPools) : "",
          apartmentStyle: room.apartmentStyle || "",
          apartmentType: room.apartmentType || "",
          leaseTerms: room.leaseTerms || "",
          paymentOption: room.paymentOption || "",
          otherAmentities: Array.isArray(room.otherAmentities)
            ? room.otherAmentities
            : [],
          images: [],
          propertyId: String(propId || ""),
        });
      } catch {
        toast.error("Failed to load apartment");
        router.back();
      } finally {
        setLoadingRoom(false);
      }
    };
    void load();
  }, [roomId, dispatch, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeWithComma = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const cleanedValue = sanitizePositiveRentInput(value);
    setRoomData((prevData: any) => ({
      ...prevData,
      [name]: cleanedValue,
    }));
  };

  const handleSelectChange = (selectedOption: any, name: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      [name]: selectedOption?.value || "",
    }));
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

  const handleImagesChange = (files: File[]) => {
    const validFiles = files.filter((file) =>
      file.type.toLowerCase().startsWith("image/"),
    );
    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped. Only image files are allowed.");
    }
    setRoomData((prevData: any) => ({
      ...prevData,
      images: validFiles,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) return;

    const {
      description,
      rentAmount,
      noOfRooms,
      noOfBaths,
      propertyId,
      apartmentStyle,
      leaseTerms,
      paymentOption,
      apartmentType,
      rentAmountMetrics,
    } = roomData;

    if (
      !description ||
      !rentAmount ||
      !noOfRooms ||
      !noOfBaths ||
      !propertyId ||
      !apartmentStyle ||
      !leaseTerms ||
      !paymentOption ||
      !apartmentType ||
      !rentAmountMetrics
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isValidPositiveRentAmount(rentAmount)) {
      toast.error("Rent amount must be greater than zero.");
      return;
    }

    const formData = new FormData();
    Object.entries(roomData).forEach(([key, value]: any) => {
      if (key === "otherAmentities") {
        formData.append("otherAmentities", JSON.stringify(value));
      } else if (key === "images") {
        // handled below
      } else {
        formData.append(key, value as string);
      }
    });

    roomData.images.forEach((file: File) => {
      formData.append("images", file);
    });
    if (roomData.images.length > 0) {
      formData.append("replaceImages", "true");
    }

    try {
      setLoading(true);
      await dispatch(updateRoom({ id: roomId, formData }) as any).unwrap();
      toast.success(
        "Apartment updated. It is unlisted and awaiting admin approval before it appears publicly again."
      );
      router.push(`/dashboard/landlord/properties/rooms/${roomId}`);
    } catch (error: any) {
      toast.error(error?.message || error || "Something went wrong.");
    } finally {
      setLoading(false);
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
    <div>
      <ProtectedRoute>
        <LandLordLayout
          path="Apartment"
          mainPath="Manage Apartment"
          subMainPath="Edit Apartment"
        >
          {loadingRoom ? (
            <div className="p-6 text-sm text-gray-500">Loading apartment…</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mx-auto w-full max-w-6xl p-3 sm:p-6 md:p-8">
                <div className="text-2xl flex gap-3 mb-4">
                  <span
                    onClick={() =>
                      router.push(
                        `/dashboard/landlord/properties/rooms/${roomId}`,
                      )
                    }
                  >
                    <FaArrowLeft size={20} className="mt-1 cursor-pointer" />
                  </span>
                  Edit Apartment
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
                        Update the apartment information to keep it accurate
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
                        {loading ? "Saving" : "Save changes"}
                      </Button>
                    </div>
                  </div>
                  <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 p-2 sm:gap-6 md:grid-cols-2 md:gap-8 md:p-4">
                    <SelectField
                      placeholder="Select Apartment Type"
                      label="Apartment Type"
                      required
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
                      required
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
                      required
                      icon={
                        <div className="relative ">
                          <IoMdInformationCircleOutline
                            onMouseEnter={() => setShowDescription(true)}
                            onMouseLeave={() => setShowDescription(false)}
                            size={20}
                          />
                          {showDescription && (
                            <div className="absolute text-start -right-3 bottom-full p-2 text-xs mb-1 rounded-md bg-white border w-[250px]">
                              Describe the apartment, its features, and any
                              unique selling points.
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
                      onKeyPress={blockNonPositiveRentKeys}
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

                    <SelectField
                      label="Lease Terms"
                      placeholder="Select Lease Terms"
                      required
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
                      required
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
                      required
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

                  <div className="mt-6 max-w-4xl mx-auto">
                    {existingImageUrls.length > 0 &&
                      roomData.images.length === 0 && (
                        <div className="mb-4">
                          <p className="mb-2 text-sm font-medium text-[#344054]">
                            Current apartment images
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {existingImageUrls.map((url) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={url}
                                src={url}
                                alt="Apartment"
                                className="h-20 w-20 rounded-md object-cover border"
                              />
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Upload new images below only if you want to replace
                            these.
                          </p>
                        </div>
                      )}
                    <MultiImageUploader
                      label="Apartment Images"
                      onChange={handleImagesChange}
                      value={roomData.images}
                      maxFiles={10}
                      acceptedTypes=".png, .jpg, .jpeg, .gif"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default UpdateRoomPage;
