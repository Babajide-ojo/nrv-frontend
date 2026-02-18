"use client";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import Button from "@/app/components/shared/buttons/Button";
import { useDispatch } from "react-redux";
import {
  updateProperty,
  getPropertyById,
} from "../../../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation";
import PropertySuccess from "@/app/components/loaders/PropertySuccess";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { nigerianStates } from "@/helpers/data";
import ImageUploader from "@/app/components/shared/ImageUploader";

// ...imports

const UpdatePropertyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAmountStep, setCurrentAmountStep] = useState(0);
  const [buildingType, setBuildingType] = useState<any>({
    label: "Residential",
    value: "Residential",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState({
    propertyName: "",
    streetAddress: "",
    city: "",
    state: { label: "", value: "" },
    zipCode: "",
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (id) {
        try {
          const response = await dispatch(getPropertyById(id) as any).unwrap();
          const data = response?.data;
          if (data) {
            const matchedState = nigerianStates.find(
              (state) =>
                state.label.toLowerCase() === data.state?.toLowerCase() ||
                state.value.toLowerCase() === data.state?.toLowerCase()
            );

            setPropertyData({
              propertyName: data.propertyName || "",
              streetAddress: data.streetAddress || "",
              city: data.city || "",
              state: matchedState || { label: "", value: "" },
              zipCode: data.zipCode || "",
            });

            setBuildingType({
              label: data.propertyType?.label || data.propertyType || "Residential",
              value: data.propertyType?.value || data.propertyType || "Residential",
            });

            // Show current saved property image (if any)
            const current =
              (typeof data.file === "string" && data.file.trim() ? data.file.trim() : null) ||
              (Array.isArray(data.imageUrls) && data.imageUrls.length > 0 ? data.imageUrls[0] : null) ||
              null;
            setExistingImageUrl(current);
          }
        } catch (error) {
          toast.error("Error fetching property data");
        }
      }
    };

    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      fetchPropertyData();
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, id]);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!propertyData.propertyName.trim()) {
      errors.propertyName = "Property name is required";
    }
    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
    // if (!propertyData.zipCode.trim()) {
    //   errors.zipCode = "Zip code is required";
    // }
    if (!propertyData.state.value) {
      errors.state = "State is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      toast.error("All fields are required");
      return false;
    }

    return true;
  };

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("propertyName", propertyData.propertyName);
    formData.append("streetAddress", propertyData.streetAddress);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state.value);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("propertyType", JSON.stringify(buildingType));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      await dispatch(updateProperty({ id, body: formData }) as any).unwrap();
      setPropertyData({
        propertyName: "",
        streetAddress: "",
        city: "",
        state: { label: "", value: "" },
        zipCode: "",
      });
      setSelectedFile(null);
      setLoading(false);
      setCurrentAmountStep(1);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message || "Error updating property");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
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

  const handleSelectChange = (name: string, value: any) => {
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleImageChange = (file: File) => {
    setSelectedFile(file);
    setFileError("");
  };

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout
            path="Properties"
            mainPath="Manage Properties"
            subMainPath="Update Property"
          >
            <ToastContainer />
            {currentAmountStep === 0 && (
              <form onSubmit={handleNextAndVerify} encType="multipart/form-data">
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm font-jakarta">
                  <div className="md:flex md:justify-between block">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Update Property
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Update the property information to keep it accurate and up-to-date.
                      </p>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        variant="light"
                        type="button"
                        className="px-6 py-1.5 rounded-md"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="darkPrimary"
                        className="px-6 py-1.5 rounded-md !text-white"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Property"}
                      </Button>
                    </div>
                  </div>

                  <div className="mx-auto border rounded-md py-4 mt-16">
                    <div className="max-w-4xl mx-auto flex gap-8 w-full flex-col md:flex-row">
                      <div className="w-full md:w-1/2">
                        <p className="text-[#344054] font-medium">
                          Your Property Photo
                        </p>
                        <div className="pt-2 text-[#667085] text-sm">
                          This will be displayed to others as the property thumbnail.
                        </div>
                      </div>
                      <div className="w-full md:w-1/2">
                        {existingImageUrl && (
                          <div className="mb-3">
                            <p className="text-[#344054] text-sm font-medium mb-2">Current Image</p>
                            <div className="w-full rounded-lg overflow-hidden border border-[#ECECEE] bg-[#F8FAFC]">
                              <img
                                src={existingImageUrl}
                                alt="Current property"
                                className="w-full h-[180px] object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                        <ImageUploader label="" onChange={handleImageChange} />
                      </div>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <InputField
                        label="Name of Property"
                        name="propertyName"
                        required
                        value={propertyData.propertyName}
                        onChange={handleInputChange}
                        error={errors.propertyName}
                        css="bg-nrvLightGreyBg"
                      />
                      <InputField
                        label="Property Address/Location"
                        name="streetAddress"
                        required
                        value={propertyData.streetAddress}
                        onChange={handleInputChange}
                        error={errors.streetAddress}
                        css="bg-nrvLightGreyBg"
                      />
                      <SelectField
                        label="Building Type"
                        required
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
                        name="state"
                        value={propertyData.state}
                        onChange={(val: any) => handleSelectChange("state", val)}
                        options={nigerianStates}
                        error={errors.state}
                      />
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

export default UpdatePropertyScreen;


