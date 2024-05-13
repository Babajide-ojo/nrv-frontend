"use client";

import LoadingPage from "../../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../../components/layout/LandLordLayout";
import EmptyState from "../../../../../components/screens/empty-state/EmptyState";
import Button from "../../../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import InputField from "../../../../../components/shared/input-fields/InputFields";
import { SlCloudUpload } from "react-icons/sl";
import { useDispatch } from "react-redux";
import {
  createProperty,
  getPropertyByUserId,
} from "../../../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import PropertySuccess from "../../../../../components/loaders/PropertySuccess";

interface PropertyData {
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
}

const CreateRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();
  const [roomData, setRoomData] = useState([
    {
      streetAddress: "",
      unit: "",
      city: "",
      state: "",
      zipCode: "",
    },
  ]);

  const handleAddRoom = () => {
    setRoomData((prevRoomData) => [
      ...prevRoomData,
      {
        streetAddress: "",
        unit: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ]);
  };

  const handleInputChange = (index: any, e: any) => {
    const { name, value } = e.target;
    const updatedRoomData: any = [...roomData];
    updatedRoomData[index][name] = value;
    setRoomData(updatedRoomData);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(roomData);
  };

//   const validateForm = () => {
//     let errors: { [key: string]: string } = {};

//     if (!propertyData.streetAddress.trim()) {
//       errors.streetAddress = "Street address is required";
//     }
//     if (!propertyData.city.trim()) {
//       errors.city = "City is required";
//     }
//     if (!propertyData.state.trim()) {
//       errors.state = "State is required";
//     }
//     if (!propertyData.zipCode.trim()) {
//       errors.zipCode = "Zip code is required";
//     }

//     setErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

  useEffect(() => {
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
                    <div className="w-full sm:w-1/2 p-8 justify-center mx-auto">
                      <div>
                        <div className="text-2xl">Add rooms 🏘️</div>
                        <p className="text-sm text-nrvLightGrey">
                          These details are used to help you identify the
                          rental. It is not connected to Rent Payments or Lease
                          Agreements.
                        </p>
                        {roomData.map((room, index) => (
                          <div className="max-w-md mx-auto pt-8 " key={index}>
                            <div className="w-full mt-4">
                              <InputField
                                css="bg-nrvLightGreyBg"
                                label="Room Name"
                                placeholder="Enter room name"
                                inputType="text"
                                name="streetAddress"
                                onChange={(e) => handleInputChange(index, e)}
                                error={errors.streetAddress} // Corrected error prop name
                              />
                            </div>
                            <div className="w-full mt-4 flex gap-3">
                              <div className="w-1/2">
                                <InputField
                                  css="bg-nrvLightGreyBg"
                                  label="Target Rent"
                                  placeholder="₦"
                                  inputType="text"
                                  name="city"
                                  onChange={(e) => handleInputChange(index, e)}
                                  error={errors.city} // Corrected error prop name
                                />
                              </div>
                              <div className="w-1/2">
                                <InputField
                                  css="bg-nrvLightGreyBg"
                                  label="Target Deposit"
                                  placeholder="₦"
                                  inputType="text"
                                  name="state"
                                  onChange={(e) => handleInputChange(index, e)}
                                  error={errors.state} // Corrected error prop name
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className=" max-w-md mx-auto pt-8 flex justify-center mt-4 gap-2">
                          <Button
                            size="large"
                            className="max-w-md w-full mb-8"
                            disabled={loading ? true : false}
                            variant="lightGrey"
                            showIcon={false}
                            onClick={handleAddRoom}
                          >
                            {loading ? "Submitting" : "Duplicate Room"}
                          </Button>
                          <Button
                            size="large"
                            className="max-w-md w-full mb-8"
                            disabled={loading ? true : false}
                            variant="lightGrey"
                            showIcon={false}
                            // onClick={handleNextAndVerify}
                          >
                            {loading ? "Submitting" : "Delete"}
                          </Button>
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
