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

interface RoomData {
  name: string;
  description: string;
  targetAudience: string;
  targetDeposit: string;
  rentAmountMetrics: string;
  rentAmount: string;
  noOfRooms: string;
  noOfBaths: string;
  noOfPools: string;
  otherAmentities: string;
  propertyId: any;
}

const CreateRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [roomData, setRoomData] = useState<any>({
    name: "",
    targetDeposit: "",
    description: "",
    targetRent: "",
    rentAmountMetrics: "",
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
      [name]: value,
    }));
  }

  const validateForm = () => {
    let errors: any = {};
  
    // Check for required fields
    if (!roomData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!roomData.targetDeposit.trim()) {
      errors.targetDeposit = "Target deposit is required";
    }
    if (!roomData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!roomData.targetRent.trim()) {
      errors.targetRent = "Target rent is required";
    }
    if (!roomData.rentAmountMetrics.trim()) {
      errors.rentAmountMetrics = "Rent amount metrics are required";
    }
    if (!roomData.rentAmount.trim()) {
      errors.rentAmount = "Rent amount is required";
    }
    if (!roomData.noOfRooms) { // Assuming noOfRooms can be 0, so just check for falsy value
      errors.noOfRooms = "Number of rooms is required";
    }
    if (!roomData.noOfBaths.trim()) {
      errors.noOfBaths = "Number of baths is required";
    }
    if (!roomData.noOfPools.trim()) {
      errors.noOfPools = "Number of pools is required";
    }
    if (!roomData.otherAmentities.trim()) {
      errors.otherAmentities = "Other amenities are required";
    }
    if (!roomData.file) {
      errors.file = "File is required";
    }
  
    // Set errors state (assuming setErrors is a function to update state)
    setErrors(errors);
  
    // Check if there are no errors
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", roomData.name);
    formData.append("description", roomData.description);
    formData.append("propertyId",  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("property") as any)._id
    : "",);
    formData.append("targetDeposit", roomData.targetDeposit);
    formData.append("targetRent", roomData.targetRent);
    formData.append("rentAmountMetrics", selectedOption?.value);
    formData.append("rentAmount", roomData.rentAmount);
    formData.append("noOfRooms", roomData.noOfRooms);
    formData.append("noOfBaths", roomData.noOfBaths);
    formData.append("noOfPools", roomData.noOfPools);
    formData.append("otherAmentities", roomData.otherAmentities);
    formData.append("file", selectedFiles[0]);
   

    try {
      setLoading(true);
      const userData = await dispatch(createRooms(formData) as any).unwrap();
      toast.success("Room added successfully");
      setLoading(false);
      router.push(
        `/dashboard/landlord/properties/${
          JSON.parse(localStorage.getItem("property") as any)._id
        }`
      );
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    } finally {
  
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
                        <div className="text-2xl flex gap-3 ">
                          {" "}
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
    <InputField
      css="bg-nrvLightGreyBg"
      label="Apartment Nick Name"
      placeholder="Enter apartment nick name"
      inputType="text"
      value={roomData.name}
      name="name"
      onChange={(e) => handleInputChange(e)}
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
      onChange={(e) => handleInputChange(e)}
    />
  </div>
  <div className="w-full mt-4 flex flex-col md:flex-row gap-3">
    <div className="w-full md:w-1/2">
      <InputField
        css="bg-nrvLightGreyBg"
        label="Target Rent"
        placeholder="100000"
        inputType="text"
        value={roomData.targetRent}
        name="targetRent"
        onChange={(e) => handleInputChange(e)}
      />
    </div>
    <div className="w-full md:w-1/2">
      <InputField
        css="bg-nrvLightGreyBg"
        label="Target Deposit"
        value={roomData.targetDeposit}
        placeholder="100000"
        inputType="text"
        name="targetDeposit"
        onChange={(e) => handleInputChange(e)}
      />
    </div>
  </div>
  <div className="w-full mt-4 flex flex-col md:flex-row gap-3">
    <div className="w-full md:w-1/2">
      <SelectField
        label="Rent Amount Metrics"
        name="rentAmountMetrics"
        value={selectedOption}
        onChange={handleChange}
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
        value={roomData.rentAmount}
        placeholder="100000"
        inputType="text"
        name="rentAmount"
        onChange={(e) => handleInputChange(e)}
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
        onChange={(e) => handleInputChange(e)}
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
        onChange={(e) => handleInputChange(e)}
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
        onChange={(e) => handleInputChange(e)}
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
        onChange={(e) => handleInputChange(e)}
      />
    </div>
  </div>

  <div className="w-full mt-4">
    <label className="text-nrvGreyBlack mb-2 text-sm">
      Property Photo
    </label>
    <div
      className="text-center w-full mt-2"
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="w-full border border-nrvLightGrey rounded-lg pt-4 pb-4 text-swBlack">
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
              <SlCloudUpload size={30} fontWeight={900} />
            )}
          </div>
          {selectedFiles.length > 0 ? "Change file" : "Click to upload"}
        </label>
      </div>
    </div>
  </div>
</div>


                      

                        <div className="flex justify-center mt-20">
                          <Button
                            type="submit"
                            size="large"
                            className="max-w-md w-full mb-8"
                            disabled={loading ? true : false}
                            variant="bluebg"
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
