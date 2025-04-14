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
} from "../../../../../redux/slices/propertySlice"; // Assuming `updateProperty` action is available
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from "next/navigation"; // Use useParams to get the property id
import PropertySuccess from "../../../loaders/PropertySuccess";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { nigerianStates } from "@/helpers/data";
import ImageUploader from "@/app/components/shared/ImageUploader";

const UpdatePropertyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
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
  const { propertyId } = useParams(); // Get the property ID from the URL
  const [propertyData, setPropertyData] = useState({
    nameOfProperty: "",
    location: "",
    buildingType: "Residential",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (propertyId) {
        try {
          // Fetch the property details to update
          const response = await dispatch(getPropertyById(propertyId) as any).unwrap();
          const data = response?.data;
          if (data) {
            setPropertyData({
              nameOfProperty: data.nameOfProperty || "",
              location: data.location || "",
              buildingType: data.buildingType || "Residential",
              city: data.city || "",
              state: data.state || "",
              zipCode: data.zipCode || "",
            });
            setBuildingType({
              label: data.buildingType || "Residential",
              value: data.buildingType || "Residential",
            });
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
  }, [dispatch, propertyId]);

  const validateForm = () => {
    let errors: { [key: string]: string } = {};

    if (!propertyData.nameOfProperty.trim()) {
      errors.nameOfProperty = "Property name is required";
    }
    if (!propertyData.location.trim()) {
      errors.location = "Address/Location is required";
    }
    if (!propertyData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
    if (!propertyData.state.trim()) {
      errors.state = "State is required";
    }
    if (!selectedFiles || selectedFiles.length === 0) {
      errors.file = "A file is required";
    }

    if (Object.keys(errors).length > 0) {
      toast.error("All fields are required");
      return false;
    }

    return true;
  };

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("nameOfProperty", propertyData.nameOfProperty);
    formData.append("location", propertyData.location);
    formData.append("buildingType", buildingType.value);
    formData.append("city", propertyData.city);
    formData.append("state", propertyData.state);
    formData.append("zipCode", propertyData.zipCode);
    formData.append("file", selectedFiles);
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      await dispatch(updateProperty({ propertyId, formData }) as any).unwrap();
      setPropertyData({
        nameOfProperty: "",
        location: "",
        buildingType: "Residential",
        city: "",
        state: "",
        zipCode: "",
      });
      setSelectedFiles([]);
      setLoading(false);
      setCurrentAmountStep(1);
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

  const handleImageChange = (file: File) => {
    setSelectedFiles(file);
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
              <form
                onSubmit={handleNextAndVerify}
                encType="multipart/form-data"
              >
                <div className="max-w-6xl mx-auto bg-white p-8 rounded-md shadow-sm font-jakarta">
                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField
                      label="Name of Property"
                      name="nameOfProperty"
                      value={propertyData.nameOfProperty}
                      onChange={handleInputChange}
                      error={errors.nameOfProperty}
                      css="bg-nrvLightGreyBg"
                    />
                    <InputField
                      label="Location"
                      name="location"
                      value={propertyData.location}
                      onChange={handleInputChange}
                      error={errors.location}
                      css="bg-nrvLightGreyBg"
                    />
                    <InputField
                      label="City"
                      name="city"
                      value={propertyData.city}
                      onChange={handleInputChange}
                      error={errors.city}
                      css="bg-nrvLightGreyBg"
                    />
                    <SelectField
                      label="State"
                      name="state"
                      value={propertyData.state}
                      onChange={handleInputChange}
                      options={nigerianStates}
                      error={errors.state}
                     // css="bg-nrvLightGreyBg"
                    />
                    <InputField
                      label="Zip Code"
                      name="zipCode"
                      value={propertyData.zipCode}
                      onChange={handleInputChange}
                      error={errors.zipCode}
                      css="bg-nrvLightGreyBg"
                    />
                    <SelectField
                      label="Building Type"
                      name="buildingType"
                      value={buildingType.value}
                      onChange={(e) =>
                        setBuildingType({ label: e.target.value, value: e.target.value })
                      }
                      options={[
                        { label: "Residential", value: "Residential" },
                        { label: "Commercial", value: "Commercial" },
                      ]}
                      error={errors.buildingType}
                      //css="bg-nrvLightGreyBg"
                    />
                    <ImageUploader
                      label="Upload Property Image"
                      //selectedFiles={selectedFiles}
                      onChange={handleImageChange}
                     // error={errors.file}
                    />
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      className="bg-nrvGreen text-white"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Property"}
                    </Button>
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
