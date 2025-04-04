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
import ImageUploader from "@/app/components/shared/ImageUploader";

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
    rentAmount: 0,
    noOfRooms: "",
    noOfBaths: "",
    noOfPools: "",
    otherAmentities: "",
    file: null,
    propertyId:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("property") as any)?._id
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
    console.log({ roomData });

    // Validate required fields
    if (!description || !rentAmount || !noOfRooms || !noOfBaths) {
      toast.error("Please fill in all required fields.");
      return;
    }
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
    formData.append("file", selectedFiles);

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

  const handleImageChange = (file: File) => {
    setSelectedFiles(file);
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
                                placeholder="1"
                                inputType="number"
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

                     
                          <ImageUploader
                            label="Upload Image"
                            onChange={handleImageChange}
                          />
                        </div>

                        <div className="flex justify-center mt-8">
                          <Button
                            type="submit"
                            size="minLarge"
                            className="w-full mb-8"
                            disabled={loading ? true : false}
                            variant="darkPrimary"
                            showIcon={false}
                            isLoading={loading}
                          >
                            {loading ? "Submitting" : "Submit"}
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
