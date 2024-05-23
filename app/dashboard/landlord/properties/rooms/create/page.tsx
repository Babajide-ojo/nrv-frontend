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

interface RoomData {
  name: string;
  targetAudience: string;
  targetDeposit: string;
  description: string;
  propertyId: any;
}

const CreateRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();
  const [roomData, setRoomData] = useState<RoomData[]>([
    {
      name: "",
      targetAudience: "",
      targetDeposit: "",
      description: "null",
      propertyId: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("property") as any)._id : '',
    },
  ]);

  const handleAddRoom = () => {
    setRoomData((prevRoomData) => [
      ...prevRoomData,
      {
        name: "",
        targetAudience: "",
        targetDeposit: "",
        description: "null",
        propertyId: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("property") as any)._id : '',
      },
    ]);
  };

  const handleDeleteRoom = (index: number) => {
    setRoomData((prevRoomData) => prevRoomData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: any, e: any) => {
    const { name, value } = e.target;
    const updatedRoomData: any = [...roomData];
    updatedRoomData[index][name] = value;
    setRoomData(updatedRoomData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isValid = roomData.every((room) => {
      return (
        room.name.trim() &&
        room.targetAudience.trim() &&
        room.targetDeposit.trim()
      );
    });

    if (isValid) {
      try {
        setLoading(true);
        const userData = await dispatch(createRooms(roomData) as any).unwrap();
        toast.success("Room added successfully");
        setLoading(false);
        router.push(`/dashboard/landlord/properties/${JSON.parse(localStorage.getItem("property") as any)._id}`);
      } catch (error: any) {
        setLoading(false);
        toast.error(error);
      }
    } else {
      const errors: any = roomData.map((room, index) => ({
        name: !room.name.trim() ? "Room name is required" : "",
        targetAudience: !room.targetAudience.trim()
          ? "Target rent is required"
          : "",
        targetDeposit: !room.targetDeposit.trim()
          ? "Target deposit is required"
          : "",
      }));
      setErrors(errors);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
                                value={roomData[index].name}
                                name="name"
                                onChange={(e) => handleInputChange(index, e)}
                                error={errors[index]?.name}
                              />
                            </div>
                            <div className="w-full mt-4 flex gap-3">
                              <div className="w-1/2">
                                <InputField
                                  css="bg-nrvLightGreyBg"
                                  label="Target Rent"
                                  placeholder="₦"
                                  inputType="text"
                                  value={roomData[index].targetAudience}
                                  name="targetAudience"
                                  onChange={(e) => handleInputChange(index, e)}
                                  error={errors[index]?.targetAudience}
                                />
                              </div>
                              <div className="w-1/2">
                                <InputField
                                  css="bg-nrvLightGreyBg"
                                  label="targetDeposit"
                                  value={roomData[index].targetDeposit}
                                  placeholder="₦"
                                  inputType="text"
                                  name="targetDeposit"
                                  onChange={(e) => handleInputChange(index, e)}
                                  error={errors[index]?.targetDeposit}
                                />
                              </div>
                            </div>
                            {roomData.length > 1 && (
                              <div className="w-full mt-4 flex gap-2">
                                <Button
                                  size="small"
                                  variant="lightGrey"
                                  onClick={() => handleDeleteRoom(index)}
                                  showIcon={false}
                                  className="border-red"
                                >
                                  Delete
                                </Button>
                              </div>
                            )}
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
