"use client";

import { BsHouse } from "react-icons/bs";
import ProtectedRoute from "../../guard/LandlordProtectedRoute";
import LandLordLayout from "../../layout/LandLordLayout";
import { PiPencilSimpleLight } from "react-icons/pi";
import Button from "../../shared/buttons/Button";
import { useEffect, useState } from "react";
import PropertyOverview from "../../property-dashboard/PropertyOverview";
import PropertyMarketing from "../../property-dashboard/PropertyMarketing";
import PropertyMaintenance from "../../property-dashboard/PropertyMaintenance";
import PropertyDocuments from "../../property-dashboard/PropertyDocuments";
import PropertyExpenses from "../../room-dashboard/PropertyExpenses";
import { getPropertyByUserId } from "../../../../redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import {
  getPropertyById,
  updateProperty,
  deletePropertyById,
} from "../../../../redux/slices/propertySlice";
import { SlCloudUpload } from "react-icons/sl";

import SelectField from "../../shared/input-fields/SelectField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin7Line } from "react-icons/ri";
import SingleRoom from "../../../dashboard/landlord/properties/rooms/[id]/page";
import React from "react";
import InputField from "../../shared/input-fields/InputFields";
import BackIcon from "../../shared/icons/BackIcon";
const propertyDashboardLinks: any = [
  {
    id: 1,
    name: "Overview",
  },
  {
    id: 4,
    name: "Documents",
  },
];

interface Property {
  id: string;
  file: string;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PropertyData {
  _id: any;
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
}

const SinglePropertyScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const [currentState, setCurrentState] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [singleProperty, setSingleProperty] = useState<any>({});
  const [showEditProperty, setShowEditProperty] = useState<boolean>(false);
  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const [propertyData, setPropertyData] = useState<PropertyData>({
    _id: "",
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
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextAndVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = {
      body: {
        streetAddress: propertyData.streetAddress,
        unit: propertyData.unit,
        city: propertyData.city,
        state: propertyData.state,
        zipCode: propertyData.zipCode,
        propertyType: selectedOption.value,
      },
      id: propertyData._id,
    };
    try {
      setLoading(true);
      await dispatch(updateProperty(formData) as any).unwrap();
      setPropertyData({
        _id: "",
        streetAddress: "",
        unit: "",
        city: "",
        state: "",
        zipCode: "",
        propertyType: "",
      });
      const properties = await dispatch(getPropertyById(id) as any).unwrap();
      setPropertyData(properties?.data);
      setSingleProperty(properties?.data);
      const selectedPropertyType = [
        { value: "office", label: "Office" },
        { value: "duplex", label: "Duplex" },
        { value: "flat", label: "Flat" },
      ].filter((item) => item.value == properties?.data?.propertyType);
      setSelectedOption(selectedPropertyType);
      setLoading(false);
      toast.success("Property updated successfully");
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
      dispatch,
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

  const showProperty = () => {
    setShowEditProperty(true);
  };

  const deleteProperty = async () => {
    try {
      setLoading(true);
      await dispatch(deletePropertyById(id) as any);
      toast.success("Property deleted successfully");
      setLoading(false);
      router.push("/dashboard/landlord/properties");
    } catch (error) {
      toast.error("An error occured while uploding document");
      setLoading(false);
    }
  };

  const openDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
    setShowEditProperty(false);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setShowEditProperty(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      setUser(user?.user);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      try {
        const properties = await dispatch(getPropertyById(id) as any).unwrap();
        setPropertyData(properties?.data);
        setSingleProperty(properties?.data);
        const selectedPropertyType = [
          { value: "office", label: "Office" },
          { value: "duplex", label: "Duplex" },
          { value: "flat", label: "Flat" },
        ].filter((item) => item.value == properties?.data?.propertyType);
        setSelectedOption(selectedPropertyType);
      } catch (error) {}
      return () => clearTimeout(timer);
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <ToastContainer />
          <div>
            <div className="flex justify-between px-4 py-12 md:px-12 md:py-12">
              <div>
                <div className="flex gap-2">
                  <div>
                    <BackIcon />
                  </div>

                  <p className="text-sm font-medium text-nrvDarkBlue text-nrvDarkGrey font-light">
                    {singleProperty?.streetAddress}
                  </p>
                </div>
              </div>

              <div>
                <div
                  className="p-2 border border-gray-500 rounded rounded-full"
                  onClick={() => {
                    showProperty();
                  }}
                >
                  <PiPencilSimpleLight />
                </div>
              </div>
            </div>
            <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg mt-1 md:pl-12 pl-4 overflow-scroll">
              {propertyDashboardLinks.map((item: any) => (
                <div key={item.id}>
                  <Button
                    size="smaller"
                    className={` text-nrvDarkBlue p-1 border border-nrvGreyMediumBg mt-2 rounded-md mb-2 ${
                      currentState === item.id
                        ? "bg-nrvDarkBlue text-white"
                        : "bg-nrvGreyMediumBg"
                    }`}
                    variant="ordinary"
                    showIcon={false}
                    onClick={() => {
                      setCurrentState(item.id);
                    }}
                  >
                    <div className="text-[11px] p-2">{item.name}</div>
                  </Button>
                </div>
              ))}
            </div>

            <div className="px-4 py-4 md:px-12 md:py-6">
              {currentState === 1 && singleProperty && (
                <PropertyOverview data={singleProperty} />
              )}
              {currentState === 3 && <PropertyMaintenance />}
              {currentState === 4 && <PropertyDocuments />}
              {currentState === 5 && <PropertyExpenses />}
            </div>
          </div>
          {showEditProperty && (
            <div
              id="overlay"
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center"
            >
              <div className="bg-white w-4/5 md:w-3/5 p-4 relative mt-32 rounded-t-3xl overflow-auto max-h-full">
                <button
                  className="absolute top-2 right-2 text-lg  bg-nrvLightGreyBg border border-nrvDarkBlue rounded-full px-2.5 py-2.5"
                  onClick={() => {
                    openDeleteConfirmation();
                  }}
                >
                  <RiDeleteBin7Line className="text-nrvDarkBlue" />
                </button>

                <form onSubmit={handleNextAndVerify}>
                  <div className="w-full md:w-1/2 mx-auto p-0 md:p-8 justify-center">
                    <div>
                      <div className="mx-auto pt-8">
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
                            css="bg-white"
                            label="Street Address"
                            placeholder="Enter Street Address"
                            inputType="text"
                            name="streetAddress"
                            value={propertyData.streetAddress}
                            onChange={handleInputChange}
                            error={errors.streetAddress}
                          />
                        </div>
                        <div className="w-full mt-4">
                          <InputField
                            css="bg-white"
                            label="Unit (Optional)"
                            placeholder="Enter Unit"
                            inputType="text"
                            name="unit"
                            value={singleProperty.propertyType}
                            onChange={handleInputChange}
                            error={errors.unit} // Corrected error prop name
                          />
                        </div>
                        <div className="w-full mt-4 flex gap-3">
                          <div className="w-1/2">
                            <InputField
                              css="bg-white"
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
                              css="bg-white"
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
                            css="bg-white"
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
                          <label className="text-nrvGreyBlack mb-2 text-sm">
                            Property Photo
                          </label>
                          <div
                            className="text-center w-full mt-2"
                            onDrop={handleFileDrop}
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
                                {selectedFiles.length > 0
                                  ? "Change file"
                                  : "Click to upload"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center mt-4 gap-4">
                        <Button
                          type="submit"
                          size="large"
                          className="max-w-md w-full mb-8"
                          disabled={loading ? true : false}
                          variant="bluebg"
                          showIcon={false}
                        >
                          {loading ? "Submitting" : "Save"}
                        </Button>
                        <Button
                          onClick={() => {
                            setShowEditProperty(false);
                          }}
                          type="button"
                          size="large"
                          className="max-w-md w-full mb-8"
                          disabled={loading ? true : false}
                          variant="lightGrey"
                          showIcon={false}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteConfirmation && (
            <div
              id="overlay"
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center"
            >
              <div className="bg-white p-8 rounded shadow-md text-center">
                <p>Are you sure you want to delete this property?</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={deleteProperty}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeDeleteConfirmation}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default SinglePropertyScreen;
