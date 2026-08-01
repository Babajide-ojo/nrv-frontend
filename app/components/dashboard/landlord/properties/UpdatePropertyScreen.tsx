"use client";

import LoadingPage from "../../../loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../guard/LandlordProtectedRoute";
import LandLordLayout from "../../../layout/LandLordLayout";
import Button from "../../../shared/buttons/Button";
import { useDispatch } from "react-redux";
import {
  updateProperty,
  getPropertyById,
} from "../../../../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import PropertySuccess from "../../../loaders/PropertySuccess";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { nigerianStates } from "@/helpers/data";
import ImageUploader from "@/app/components/shared/ImageUploader";
import MultiImageUploader from "../../../shared/MultiImageUploader";

const UpdatePropertyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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
  const params = useParams();
  const id = (params?.id ?? params?.propertyId) as string | undefined;
  const [propertyData, setPropertyData] = useState({
    streetAddress: "",
    city: "",
    state: { label: "", value: "" },
  });

  const resolveImageUrl = (data: any): string | null => {
    if (!data) return null;
    if (typeof data.file === "string" && data.file.trim()) {
      return data.file.trim();
    }
    if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
      return data.imageUrls[0];
    }
    return null;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
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
              streetAddress: data.streetAddress || data.location || "",
              city: data.city || "",
              state: matchedState || { label: "", value: "" },
            });
            setBuildingType({
              label:
                data.propertyType?.label ||
                data.buildingType ||
                data.propertyType ||
                "Residential",
              value:
                data.propertyType?.value ||
                data.buildingType ||
                data.propertyType ||
                "Residential",
            });
            setExistingImageUrl(resolveImageUrl(data));
          }
        } catch (error) {
          toast.error("Error fetching property data");
        }
      }
      setIsLoading(false);
    };
    fetchPropertyData();
  }, [dispatch, id]);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = "Address/Location is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
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
    formData.append("streetAddress", propertyData.streetAddress);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state.value);
    formData.append("propertyType", JSON.stringify(buildingType));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    if (selectedImages.length > 0) {
      formData.append("replaceImages", "true");
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });
    }
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      const response = await dispatch(
        updateProperty({ id, body: formData }) as any
      ).unwrap();
      const updated = response?.data ?? response;
      const returnedUrl = resolveImageUrl(updated);

      if (returnedUrl) {
        setExistingImageUrl(returnedUrl);
      } else if (selectedFile) {
        setExistingImageUrl(URL.createObjectURL(selectedFile));
      } else if (id) {
        try {
          const refetched = await dispatch(getPropertyById(id) as any).unwrap();
          setExistingImageUrl(resolveImageUrl(refetched?.data));
        } catch {
          // keep previous preview
        }
      }

      setSelectedFile(null);
      setSelectedImages([]);
      setLoading(false);
      toast.success("Property updated successfully");
      setCurrentAmountStep(1);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message || error || "Error updating property");
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
    if (file) {
      setExistingImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
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
            {currentAmountStep === 0 && (
              <form
                onSubmit={handleNextAndVerify}
                encType="multipart/form-data"
              >
                <div className="mx-auto max-w-6xl rounded-md bg-white p-3 shadow-sm font-jakarta sm:p-6 md:p-8">
                  <div className="md:flex md:justify-between block">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Update Property
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Update the property information to keep it accurate and
                        up-to-date.
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

                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField
                      label="Location"
                      name="streetAddress"
                      placeholder="e.g. 27 Olarenwaju Street, Lekki"
                      value={propertyData.streetAddress}
                      onChange={handleInputChange}
                      error={errors.streetAddress}
                      css="bg-nrvLightGreyBg"
                    />
                    <InputField
                      label="City"
                      name="city"
                      placeholder="e.g. Lagos"
                      value={propertyData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      css="bg-nrvLightGreyBg"
                    />
                    <SelectField
                      label="State"
                      name="state"
                      placeholder="Select state"
                      value={propertyData.state}
                      onChange={(val: any) => handleSelectChange("state", val)}
                      options={nigerianStates}
                      error={errors.state}
                    />
                    <SelectField
                      label="Building Type"
                      name="buildingType"
                      placeholder="Select building type"
                      value={buildingType}
                      onChange={(val: any) => setBuildingType(val)}
                      options={[
                        { label: "Residential", value: "Residential" },
                        { label: "Commercial", value: "Commercial" },
                      ]}
                      error={errors.buildingType}
                    />
                    <div className="md:col-span-2">
                      {existingImageUrl && (
                        <div className="mb-3">
                          <p className="text-[#344054] text-sm font-medium mb-2">
                            {selectedFile ? "New Image Preview" : "Current Image"}
                          </p>
                          <div className="w-full max-w-md rounded-lg overflow-hidden border border-[#ECECEE] bg-[#F8FAFC]">
                            <img
                              src={existingImageUrl}
                              alt="Current property"
                              className="w-full h-[180px] object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}
                      <ImageUploader
                        label="Upload Property Image"
                        onChange={handleImageChange}
                        error={fileError || errors.file}
                      />
                    </div>
                  </div>

                  <div className="max-w-4xl mx-auto mt-8">
                    <MultiImageUploader
                      label="Additional Property Images"
                      onChange={handleImagesChange}
                      value={selectedImages}
                      maxFiles={10}
                    />
                    {selectedImages.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-2">
                        New gallery images will replace existing ones.
                      </p>
                    ) : null}
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
