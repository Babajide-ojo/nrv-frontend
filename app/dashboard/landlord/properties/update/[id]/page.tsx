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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAmountStep, setCurrentAmountStep] = useState(0);
  const [rentCollection, setRentCollection] = useState({ label: "", value: "" });
  const [buildingType, setBuildingType] = useState<any>({
    label: "Residential",
    value: "Residential",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState({
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
              streetAddress: data.streetAddress || "",
              city: data.city || "",
              state: matchedState || { label: "", value: "" },
              zipCode: data.zipCode || "",
            });

            setBuildingType({
              label: data.buildingType || "Residential",
              value: data.buildingType || "Residential",
            });

            setRentCollection(data.rentCollection || { label: "", value: "" });
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

    if (!propertyData.streetAddress.trim()) {
      errors.streetAddress = "Street address is required";
    }
    if (!propertyData.city.trim()) {
      errors.city = "City is required";
    }
    if (!propertyData.zipCode.trim()) {
      errors.zipCode = "Zip code is required";
    }
    if (!propertyData.state.value) {
      errors.state = "State is required";
    }
    if (!selectedFile) {
      errors.file = "A file is required";
    }
    if (!rentCollection.value) {
      errors.rentCollection = "Rent collection method is required";
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
    formData.append("zipCode", propertyData.zipCode);
    formData.append("rentCollection", JSON.stringify(rentCollection));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("createdBy", user?._id);

    try {
      setLoading(true);
      await dispatch(updateProperty({ id, formData }) as any).unwrap();
      setPropertyData({
        streetAddress: "",
        city: "",
        state: { label: "", value: "" },
        zipCode: "",
      });
      setRentCollection({ label: "", value: "" });
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

  const handleRentCollectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setRentCollection({ label: value, value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      rentCollection: "",
    }));
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
                  <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <InputField
                      label="Street Address"
                      name="streetAddress"
                      value={propertyData.streetAddress}
                      onChange={handleInputChange}
                      error={errors.streetAddress}
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
                      onChange={(val: any) => handleSelectChange("state", val)}
                      options={nigerianStates}
                      error={errors.state}
                    />
                    <InputField
                      label="Zip Code"
                      name="zipCode"
                      value={propertyData.zipCode}
                      onChange={handleInputChange}
                      error={errors.zipCode}
                      css="bg-nrvLightGreyBg"
                    />
                    <div className="col-span-2">
                      <InputField
                        label="Rent Collection Method"
                        name="rentCollection"
                        value={rentCollection.label}
                        onChange={handleRentCollectionChange}
                        error={errors.rentCollection}
                        css="bg-nrvLightGreyBg"
                      />
                    </div>
                    <ImageUploader
                      label="Upload Property Image"
                      onChange={handleImageChange}
                     // error={errors.file || fileError}
                    />
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      className="bg-nrvPrimaryGreen text-nrvPrimaryGreen"
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


