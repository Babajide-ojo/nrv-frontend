"use client";

import LoadingPage from "../../../loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../guard/LandlordProtectedRoute";
import LandLordLayout from "../../../layout/LandLordLayout";
import EmptyState from "../../../screens/empty-state/EmptyState";
import Button from "../../../shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import InputField from "../../../shared/input-fields/InputFields";
import { SlCloudUpload } from "react-icons/sl";
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
import ImageUploader from "@/app/components/shared/ImageUploader";

interface PropertyData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

const CreatePropertyScreen = () => {
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

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [propertyData, setPropertyData] = useState<PropertyData>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
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
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("file", selectedFiles);
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      const userData = await dispatch(createProperty(formData) as any).unwrap();
      setPropertyData({
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
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

  const handleImageChange = (file: File) => {
    setSelectedFiles(file);
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
                        <div className="text-2xl">Add Property 🏘️</div>
                        <p className="text-sm text-nrvLightGrey">
                          No worries, you can change the information later
                        </p>
                        <div className="mx-auto pt-8 ">
                          <div className="w-full mt-4">
                            <InputField
                              css="bg-nrvLightGreyBg"
                              label="Street Address"
                              // placeholder="Enter Street Address"
                              inputType="text"
                              name="streetAddress"
                              value={propertyData.streetAddress}
                              onChange={handleInputChange}
                              error={errors.streetAddress} // Corrected error prop name
                            />
                          </div>

                          <div className="w-full mt-4 flex gap-3">
                            <div className="w-1/2">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="City"
                                //  placeholder="Enter City"
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
                                //  placeholder="Enter State"
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
                              // placeholder="Enter Zip Code"
                              inputType="text"
                              name="zipCode"
                              value={propertyData.zipCode}
                              onChange={handleInputChange}
                              error={errors.zipCode} // Corrected error prop name
                            />
                          </div>
                          {/* <div
                            className="w-full mt-4 rounded-md bg-nrvLightGreyBg"
                            style={{
                              borderColor: "#7d7d7d",
                              borderStyle: "dotted",
                              borderWidth: "1px",
                            }}
                          >
                            <div
                              className="text-center w-full"
                              onDrop={handleFileDrop}
                              onDragOver={(e) => e.preventDefault()}
                            >
                              <div className="w-full rounded-lg pt-2 pb-2 text-swBlack">
                                <input
                                  type="file"
                                  id="fileInput"
                                  className="hidden"
                                  accept=".png, .jpg , .jpeg"
                                  onChange={handleFileInputChange}
                                />

                                <label
                                  htmlFor="fileInput"
                                  className="cursor-pointer rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
                                >
                                  <div className="text-center flex justify-center">
                                    {selectedFiles.length == 0 &&
                                      <svg
                                        width="57"
                                        height="57"
                                        viewBox="0 0 57 57"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <circle
                                          cx="28.5"
                                          cy="28.5"
                                          r="28"
                                          fill="#F0F2F5"
                                        />
                                        <path
                                          d="M21.5013 25.5836C21.5013 22.0398 24.3741 19.167 27.918 19.167C31.0571 19.167 33.672 21.4223 34.2262 24.4014C34.3039 24.8192 34.6026 25.1616 35.0059 25.2954C37.3285 26.0657 39.0013 28.2558 39.0013 30.8336C39.0013 34.0553 36.3896 36.667 33.168 36.667C32.5236 36.667 32.0013 37.1893 32.0013 37.8336C32.0013 38.478 32.5236 39.0003 33.168 39.0003C37.6783 39.0003 41.3346 35.3439 41.3346 30.8336C41.3346 27.4591 39.2886 24.5651 36.372 23.3198C35.374 19.5846 31.9683 16.8336 27.918 16.8336C23.0855 16.8336 19.168 20.7511 19.168 25.5836C19.168 25.7006 19.1703 25.8171 19.1748 25.9331C17.0802 27.1416 15.668 29.4049 15.668 32.0003C15.668 35.8663 18.802 39.0003 22.668 39.0003C23.3123 39.0003 23.8346 38.478 23.8346 37.8336C23.8346 37.1893 23.3123 36.667 22.668 36.667C20.0906 36.667 18.0013 34.5776 18.0013 32.0003C18.0013 30.0667 19.1775 28.4052 20.8581 27.6972C21.3444 27.4924 21.6326 26.9866 21.561 26.4638C21.5217 26.1766 21.5013 25.8828 21.5013 25.5836Z"
                                          fill="#475367"
                                        />
                                        <path
                                          d="M27.7262 31.1283C28.1682 30.7354 28.8344 30.7354 29.2764 31.1283L31.0264 32.6839C31.508 33.1119 31.5514 33.8494 31.1233 34.3309C30.7488 34.7522 30.1376 34.8382 29.668 34.5665V40.167C29.668 40.8113 29.1456 41.3336 28.5013 41.3336C27.857 41.3336 27.3346 40.8113 27.3346 40.167V34.5665C26.8651 34.8382 26.2538 34.7522 25.8793 34.3309C25.4513 33.8494 25.4946 33.1119 25.9762 32.6839L27.7262 31.1283Z"
                                          fill="#475367"
                                        />
                                      </svg>
}
                                  </div>
                                  {selectedFiles.length > 0 ? (
                                    <div>
                                      <div className="flex justify-center">
                                        <svg
                                          width="57"
                                          height="57"
                                          viewBox="0 0 57 57"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <circle
                                            cx="28.5"
                                            cy="28.5"
                                            r="28"
                                            fill="#E7F6EC"
                                          />
                                          <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M28.5 41.625C35.7487 41.625 41.625 35.7487 41.625 28.5C41.625 21.2513 35.7487 15.375 28.5 15.375C21.2513 15.375 15.375 21.2513 15.375 28.5C15.375 35.7487 21.2513 41.625 28.5 41.625ZM33.86 26.6588C34.4539 26.1148 34.4944 25.1923 33.9505 24.5984C33.4065 24.0044 32.484 23.9639 31.89 24.5079L26.5058 29.4391L25.11 28.1608C24.516 27.6168 23.5935 27.6573 23.0496 28.2513C22.5056 28.8452 22.5461 29.7677 23.14 30.3117L25.5208 32.4921C26.0782 33.0026 26.9333 33.0026 27.4907 32.4921L33.86 26.6588Z"
                                            fill="#0F973D"
                                          />
                                        </svg>
                                      </div>
                                      <div className="pt-2">
                                        {selectedFiles[0]?.name}
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
                                      <br></br> SVG, PNG, JPG or GIF (max.
                                      800x400px)
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                          </div> */}

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
                            isLoading={loading}
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

export default CreatePropertyScreen;
