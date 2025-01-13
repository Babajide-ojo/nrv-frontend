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
import PropertySuccess from "../../../../../components/loaders/PropertySuccess";
import { FaArrowLeft } from "react-icons/fa6";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import { SlCloudUpload } from "react-icons/sl";
import { propertyTypeData, rentMetricsData } from "@/helpers/data";

const CreateRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const [roomData, setRoomData] = useState<any>({
    description: "",
    rentAmountMetrics: "",
    propertyType: "",
    rentAmount: "",
    noOfRooms: "",
    noOfBaths: "",
    noOfPools: "",
    otherAmentities: "",
    file: null,
    propertyId:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("property") as any)._id
        : "",
  });

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
      setRoomData((prev: any) => ({ ...prev, [e.target.id]: files[0] }));
    } else {
      setSelectedFiles(files as any);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRoomData((prevData: any) => ({
      ...prevData,
      [name]:
        name === "noOfRooms" ||
        name === "propertyType" ||
        name === "rentAmount" ||
        name === "noOfBaths" ||
        name === "targetRent" ||
        name === "targetDeposit"
          ? value.replace(/\D/g, "") // Remove non-numeric characters for numeric fields
          : value,
    }));
  };

  const getPropertyFromLocalStorage = () => {
    if (typeof window === "undefined") return null;
    const property = localStorage.getItem("property");
    return property ? JSON.parse(property) : null;
  };

  const handleChange = (selectedOption: any, name: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "", // Default to empty if no selection
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const property = getPropertyFromLocalStorage();
    if (!property) {
      toast.error("Property data not found.");
      return;
    }

    const {
      description,
      rentAmount,
      noOfRooms,
      noOfBaths,
      noOfPools,
      otherAmentities,
    } = roomData;

    // Validate required fields
    if (
      !description ||
      !rentAmount ||
      !noOfRooms ||
      !noOfBaths ||
      !selectedFiles[0]
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    console.log({ roomData });

    const formData = new FormData();
    formData.append("description", description);
    formData.append("propertyId", property._id);
    formData.append("propertyType", roomData.propertyType);
    formData.append("rentAmountMetrics", roomData.rentAmountMetrics);
    formData.append("rentAmount", rentAmount);
    formData.append("noOfRooms", noOfRooms);
    formData.append("noOfBaths", noOfBaths);
    formData.append("noOfPools", noOfPools);
    formData.append("otherAmentities", otherAmentities);
    formData.append("file", selectedFiles[0]);

    try {
      setLoading(true);
      const userData: any = await dispatch(
        createRooms(formData) as any
      ).unwrap();
      toast.success("Room added successfully");
      router.push(`/dashboard/landlord/properties/${property._id}`);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const properties = dispatch(
        getPropertyByUserId(user?.user?._id) as any
      ).unwrap();
      setProperties(properties?.data);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          {currentStep === 0 && (
            <div>
              <ProtectedRoute>
                <LandLordLayout>
                  <ToastContainer />
                  <form onSubmit={handleSubmit}>
                    <div className="max-w-2xl w-full mx-auto p-8 justify-center mx-auto">
                      <div>
                        <div className="text-2xl flex gap-3">
                          <span
                            onClick={() => {
                              router.push("/dashboard/landlord/properties");
                            }}
                          >
                            <FaArrowLeft
                              size={20}
                              className="mt-1 cursor-pointer"
                            />
                          </span>{" "}
                          Add Apartment 🏘️
                        </div>
                        <p className="text-sm text-nrvLightGrey">
                          These details are used to help you identify the
                          rental. It is not connected to Rent Payments or Lease
                          Agreements.
                        </p>

                        <div className="max-w-2xl w-full mx-auto pt-8">
                          <div className="w-full mt-4">
                            <SelectField
                              label="Property Type"
                              name="propertyType"
                              value={propertyTypeData.find(
                                (option) =>
                                  option.value === roomData.propertyType
                              )}
                              onChange={(selectedOption: any) =>
                                handleChange(selectedOption, "propertyType")
                              }
                              options={propertyTypeData}
                              placeholder="Select Property Type"
                            />
                          </div>
                          <div className="w-full mt-4">
                            <InputField
                              css="bg-nrvLightGreyBg"
                              label="Description"
                              placeholder="Enter room description"
                              inputType="text"
                              value={roomData.description}
                              name="description"
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="w-full mt-4 flex flex-col md:flex-row gap-3">
                            <div className="w-full md:w-1/2">
                              <SelectField
                                label="Rent Cycle"
                                name="rentAmountMetrics"
                                value={rentMetricsData.find(
                                  (option) =>
                                    option.value === roomData.propertyType
                                )}
                                onChange={(selectedOption: any) =>
                                  handleChange(
                                    selectedOption,
                                    "rentAmountMetrics"
                                  )
                                }
                                options={[
                                  { value: "monthly", label: "Monthly" },
                                  { value: "yearly", label: "Yearly" },
                                ]}
                                placeholder="Select amount metrics"
                              />
                            </div>
                            <div className="w-full md:w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Rent Amount"
                                value={Number(
                                  roomData.rentAmount
                                )?.toLocaleString()}
                                placeholder="100000"
                                inputType="text"
                                name="rentAmount"
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="w-full mt-4 flex flex-col md:flex-row gap-3">
                            <div className="w-full md:w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Number of rooms"
                                placeholder="1"
                                inputType="text"
                                value={roomData.noOfRooms}
                                name="noOfRooms"
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="w-full md:w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Number of Bathroom/Toilet"
                                value={roomData.noOfBaths}
                                placeholder="1"
                                inputType="text"
                                name="noOfBaths"
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="w-full mt-4 flex flex-col md:flex-row gap-3">
                            <div className="w-full md:w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Number of pools"
                                placeholder="1"
                                inputType="text"
                                value={roomData.noOfPools}
                                name="noOfPools"
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="w-full md:w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Other Amenities"
                                value={roomData.otherAmentities}
                                placeholder="Gate post, garage"
                                inputType="text"
                                name="otherAmentities"
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="w-full mt-4">
                            <label className="text-nrvGreyBlack mb-2 text-sm font-medium">
                              Property Photo
                            </label>

                            {/* Image Preview Section */}
                            {selectedFiles.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          {/* Image Icon */}
          <div className="flex items-center">
            <img
              src={URL.createObjectURL(selectedFiles[0])}
              alt="Property preview"
              className="w-20 h-20 object-cover rounded-full border-2 border-nrvLightGrey mr-2" // Small icon style
            />
            {/* Link to preview the image */}
            <a
              href={URL.createObjectURL(selectedFiles[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm underline"
            >
              Preview Image
            </a>
          </div>
        </div>
      )}

                            <div
                              className="text-center w-full mt-2"
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <div className="w-full border border-nrvLightGrey bg-white rounded-lg pt-4 pb-4 text-swBlack">
                                <input
                                  type="file"
                                  id="fileInput"
                                  className="hidden"
                                  accept=".png, .jpg , .jpeg"
                                  onChange={handleFileInputChange}
                                />
                                <label
                                  htmlFor="fileInput"
                                  className="cursor-pointer p-2 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
                                >
                                  <div className="text-center flex justify-center">
                                    {selectedFiles.length > 0 ? (
                                      selectedFiles[0]?.name
                                    ) : (
                                      <SlCloudUpload
                                        size={30}
                                        fontWeight={900}
                                      />
                                    )}
                                  </div>
                                  {selectedFiles.length > 0
                                    ? "Change file"
                                    : "Click to upload"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center mt-8">
                          <Button
                            type="submit"
                            size="minLarge"
                            className="w-full mb-8"
                            disabled={loading ? true : false}
                            variant="darkPrimary"
                            showIcon={false}
                          >
                            {loading ? "Submitting" : "Continue"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </LandLordLayout>
              </ProtectedRoute>
            </div>
          )}
          {currentStep === 1 && <PropertySuccess />}
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
