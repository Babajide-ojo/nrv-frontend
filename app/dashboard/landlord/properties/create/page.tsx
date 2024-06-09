"use client";

import LoadingPage from "../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import EmptyState from "../../../../components/screens/empty-state/EmptyState";
import Button from "../../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import InputField from "../../../../components/shared/input-fields/InputFields";
import { SlCloudUpload } from "react-icons/sl";
import { useDispatch } from "react-redux";
import {
  createProperty,
  getPropertyByUserId,
} from "../../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import PropertySuccess from "../../../../components/loaders/PropertySuccess";
import SelectField from "@/app/components/shared/input-fields/SelectField";

interface PropertyData {
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
}

const PropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<any>(null);

  
  const handleChange = (selectedOption : any) => {
    setSelectedOption(selectedOption);
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<PropertyData>({
    streetAddress: "",
    unit: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "",
  });

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
    if (!propertyData.state.trim()) {
      errors.state = "State is required";
    }
    if (!propertyData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    // if (!propertyData.propertyType.trim()) {
    //   errors.propertyType = "Zip code is required";
    // }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();

    formData.append("streetAddress", propertyData.streetAddress);
    formData.append("unit", propertyData.unit);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("propertyType", selectedOption?.value);
    formData.append("file", selectedFiles[0]);
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      const userData = await dispatch(createProperty(formData) as any).unwrap();
      setPropertyData({
        streetAddress: "",
        unit: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "",
      });

      setLoading(false);
      setCurrentStep(1);
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

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    let files: any = Array.from(e.dataTransfer.files);
    if (files.length <= 2) {
      setSelectedFiles(files as any);
    } else {
      alert("You can only upload a maximum of 2 files.");
    }
  };

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
      setPropertyData((prev) => ({ ...prev, [e.target.id]: files[0] }));
    } else {
      setSelectedFiles(files as any);
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

                  <form
                    onSubmit={handleNextAndVerify}
                    encType="multipart/form-data"
                  >
                    <div className="w-full sm:w-1/2 p-8 justify-center mx-auto">
                      <div>
                        <div className="text-2xl">Properties 🏘️,</div>
                        <p className="text-sm text-nrvLightGrey">
                          No worries, you can change the information later
                        </p>
                        <div className="max-w-md mx-auto pt-8 ">
                          <div className="w-full mt-4">
                            <SelectField
                              label="Property Type"
                              name="propertyType"
                              value={selectedOption}
                              onChange={handleChange}
                              options={[
                                { value: "office", label: "Office" },
                                { value: "duplex", label: "Duplex" },
                                { value: "flat", label: "Flat" },
                              ]}
                              placeholder="Select Property Type"
                            />
                          </div>
                          <div className="w-full mt-4">
                            <InputField
                              css="bg-nrvLightGreyBg"
                              label="Street Address"
                              placeholder="Enter Street Address"
                              inputType="text"
                              name="streetAddress"
                              value={propertyData.streetAddress}
                              onChange={handleInputChange}
                              error={errors.streetAddress} // Corrected error prop name
                            />
                          </div>
                          <div className="w-full mt-4">
                            <InputField
                              css="bg-nrvLightGreyBg"
                              label="Unit (Optional)"
                              placeholder="Enter Unit"
                              inputType="text"
                              name="unit"
                              value={propertyData.unit}
                              onChange={handleInputChange}
                              error={errors.unit} // Corrected error prop name
                            />
                          </div>

                          <div className="w-full mt-4 flex gap-3">
                            <div className="w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="City"
                                placeholder="Enter City"
                                inputType="text"
                                name="city"
                                value={propertyData.city}
                                onChange={handleInputChange}
                                error={errors.city} // Corrected error prop name
                              />
                            </div>
                            <div className="w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="State"
                                placeholder="Enter State"
                                inputType="text"
                                name="state"
                                value={propertyData.state}
                                onChange={handleInputChange}
                                error={errors.state} // Corrected error prop name
                              />
                            </div>
                          </div>
                          <div className="w-full mt-4">
                            <InputField
                              css="bg-nrvLightGreyBg"
                              label="Zip Code"
                              placeholder="Enter Zip Code"
                              inputType="text"
                              name="zipCode"
                              value={propertyData.zipCode}
                              onChange={handleInputChange}
                              error={errors.zipCode} // Corrected error prop name
                            />
                          </div>
                          <div className="w-full mt-4">
                            <label className="text-nrvGreyBlack mb-2 text-sm ">
                              Property Photo
                            </label>
                            <div
                              className="text-center w-full mt-2"
                              onDrop={handleFileDrop}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <div className="w-full border border-nrvLightGrey rounded-lg  pt-4 pb-4 text-swBlack">
                                <input
                                  type="file"
                                  id="fileInput"
                                  className="hidden"
                                  accept=".png, .jpg , .jpeg"
                                  onChange={handleFileInputChange}
                                />

                                <label
                                  htmlFor="fileInput"
                                  className="cursor-pointer  p-2 rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
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

                        <div className="flex justify-center mt-20">
                          <Button
                            type="submit"
                            size="large"
                            className="max-w-md w-full mb-8"
                            disabled={loading ? true : false}
                            variant="bluebg"
                            showIcon={false}
                            // onClick={handleNextAndVerify}
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

export default PropertiesScreen;
