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
    name: "All Apartments",
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
  }, [id, dispatch]);

const property = singleProperty;

const totalRooms = singleProperty?.rooms?.length;
const occupiedRooms = singleProperty?.rooms?.filter((room: any) => room?.assignedToTenant).length;
const vacantRooms = totalRooms - occupiedRooms;

const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(0);
const vacancyRate = ((vacantRooms / totalRooms) * 100).toFixed(0);

const summaryStats = [
  {
    label: "Active Tenants",
    value: `${occupancyRate}% Occupied`,
    detail: `${occupiedRooms} out of ${totalRooms} units occupied`,
    color: "text-green-600",
  },
  {
    label: "Number of Vacant Apartment",
    value: `${vacancyRate}% Vacant`,
    detail: `${vacantRooms} out of ${totalRooms} units vacant`,
    color: "text-yellow-600",
  },
  {
    label: "Number of Selected Applicants",
    value: "N/A",
    detail: "Applicant data not available",
    color: "text-gray-500",
  },
  {
    label: "Click Leads",
    value: "N/A",
    detail: "Lead tracking not enabled",
    color: "text-gray-500",
  },
];


  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout
          mainPath="Properties"
          subMainPath="Manage Properties / View Property"
        >
          <ToastContainer />
          <div className="p-8">
            <div className="flex flex-col gap-4 pb-4 md:flex-row md:justify-between">
              {/* Left Section */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                {/* Back Button */}
                <div className="flex gap-2 items-center">
                  <BackIcon />
                  <span className="text-xs">Back</span>
                </div>

                {/* Address Info */}
                <div>
                  <p className="text-[16px] font-medium text-nrvPrimaryGreen text-nrvDarkGrey font-light">
                    {singleProperty?.streetAddress}
                  </p>
                  <p className="text-[12px] font-light text-[#475467]">
                    {singleProperty?.city}, {singleProperty?.state}
                  </p>
                </div>
              </div>

              {/* Right Section (Buttons) */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <Button
                  variant="light"
                  className="px-6 py-2 rounded-md flex gap-2 justify-center"
                  onClick={() =>
                    router.push("/dashboard/landlord/properties/create")
                  }
                >
                  Update Property Info
                </Button>
                <Button
                  variant="darkPrimary"
                  className="px-6 py-2 rounded-md justify-center"
                  onClick={() => {
                    //localStorage.setItem("property", JSON.stringify(id))
                    router.push("/dashboard/landlord/properties/rooms/create");
                  }}
                >
                  + Add New Apartment
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 grid-cols-1 gap-4 text-center mb-6 border border-gray-300 ">
              {summaryStats.map((stat: any, index: any) => (
                <div
                  key={index}
                  className="text-start p-4 bg-white my-2 space-y-2.5 border-r"
                >
                  <p className="text-[#67667A] font-medium text-sm">
                    {stat.label}
                  </p>
                  <p className={`text-xl text-[#03442C] font-medium`}>
                    {stat.value}
                  </p>
                  <p className="text-[#8D9196] text-xs font-lighter">
                    {stat?.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex w-full gap-1 md:gap-6 border-b-2">
              {propertyDashboardLinks.map((item: any) => (
                <div key={item.id}>
                  <div
                    className={`text-[16px] font-medium mt-2 mb-2 cursor-pointer px-12 text-center ${
                      currentState === item.id
                        ? "text-[#2B892B]"
                        : "text-[#344054]"
                    }`}
                    onClick={() => {
                      setCurrentState(item.id);
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
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
                  className="absolute top-2 right-2 text-lg  bg-nrvLightGreyBg border border-nrvPrimaryGreen rounded-full px-2.5 py-2.5"
                  onClick={() => {
                    openDeleteConfirmation();
                  }}
                >
                  <RiDeleteBin7Line className="text-nrvPrimaryGreen" />
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
                            //  css="bg-white"
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
                            //    css="bg-white"
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
                              //    css="bg-white"
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
                            // css="bg-white"
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
