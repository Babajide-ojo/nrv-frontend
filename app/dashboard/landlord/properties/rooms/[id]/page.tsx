"use client";

import { BsHouse } from "react-icons/bs";
import { IoPencilOutline } from "react-icons/io5";
import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../../components/layout/LandLordLayout";
import { PiPencilSimpleLight } from "react-icons/pi";
import Button from "../../../../../components/shared/buttons/Button";
import { useEffect, useState } from "react";
import PropertyOverview from "../../../../../components/property-dashboard/PropertyOverview";
import PropertyMarketing from "../../../../../components/property-dashboard/PropertyMarketing";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getRoomById,
} from "../../../../../../redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import RoomOverview from "../../../../../components/room-dashboard/RoomOverview";
import PropertyUnitDetails from "../../../../../components/property-dashboard/PropertyUnitDetails";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import { updateRoomStatus } from "../../../../../../redux/slices/propertySlice";
import CurrentTenantDashboard from "../../../../../components/property-dashboard/CurrentTenantDashboard";
import PropertyExpenses from "@/app/components/room-dashboard/PropertyExpenses";
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";
import BackIcon from "@/app/components/shared/icons/BackIcon";

const propertyDashboardLinks: any = [
  {
    id: 1,
    name: "Overview",
  },
  {
    id: 5,
    name: "Expenses",
  },
  {
    id: 3,
    name: "Marketing",
  },
  {
    id: 4,
    name: "Tenant",
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

const SingleRoom = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
 // const [isOpen, setIsOpen] = useState(false);
  const [currentState, setCurrentState] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [singleRoom, setRoomDetails] = useState<any>({});

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    try {
      const properties = await dispatch(getRoomById(id) as any).unwrap();
      setRoomDetails(properties?.data);
    } catch (error) {}

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // Fetch data on mount
    fetchData();

    // Retrieve currentState from localStorage if it exists
    const savedState = localStorage.getItem("currentRoomState");
    if (savedState) {
      setCurrentState(parseInt(savedState, 10));
    }
  }, []);

  const handleTabChange = (newState: number) => {
    setCurrentState(newState);
    localStorage.setItem("currentRoomState", newState.toString()); // Save current state
  };

  const updateRoom = async () => {
    const payload = {
      id: id,
      status: true,
    };
    try {
      setIsLoading(true);
      const properties = await dispatch(
        updateRoomStatus(payload) as any
      ).unwrap();
      setRoomDetails(properties?.data);
    } catch (error) {
      toast.error("An error occurred while performing update");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const copyToClipboard = (text: any) => {
    let copyText = text;
    let isCopy = copy(copyText);
    if (isCopy) {
      toast.success(
        "Link copied, you can share this on your social media handle.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          style: {
            background: "#ffffff",
            color: "#153969",
          },
          progressStyle: {
            background: "#153969",
          },
          icon: <FaCheckCircle size={25} style={{ color: "#153969" }} />,
        }
      );
    }
  };

  return (
    <div>
      <ProtectedRoute>
      <ToastContainer />
        <LandLordLayout>
          <div className="">
            <div>
              <div className="flex justify-between px-4 py-12 md:px-24 md:py-12">
                <div>
                  <div className="flex gap-2">
                   <div> <BackIcon /></div>
                    {/* <div className="h-16 w-16  bg-nrvPrimaryGreen rounded rounded-lg flex justify-center flex-col items-center">
                      <BsHouse color="white" size={35} />
                    </div> */}

                    <p className="text-md font-medium text-nrvPrimaryGreen text-nrvDarkGrey font-light">
                      {singleRoom?.propertyId?.streetAddress}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      size="normal"
                      className="text-nrvPrimaryGreen font-medium border border-nrvPrimaryGreen mt-2 rounded-md"
                      variant="primary"
                      showIcon={false}
                    >
                      <div className="flex gap-3 p-1.5 text-swBlue">
                        Apartment ID: {singleRoom?.roomId}
                      </div>
                    </Button>
                    <Button
                      size="normal"
                      className="text-nrvPrimaryGreen font-medium border border-nrvPrimaryGreen mt-2 rounded-md"
                      variant="primary"
                      showIcon={false}
                    //  disabled={singleRoom.listRoom === false ? false : true}
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      <div className="flex gap-3 p-1.5 text-swBlue">
                        {singleRoom.listRoom === false
                          ? "List Apartment"
                          : "Apartment Listed"}
                      </div>
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="p-2 border border-gray-500 rounded rounded-full">
                    <PiPencilSimpleLight />
                  </div>
                </div>
              </div>

              <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg mt-1 overflow-scroll justify-center text-md">
                {propertyDashboardLinks.map((item: any) => (
                  <div key={item.id}>
                    <Button
                      size="normal"
                      className={`text-[#153969] p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2 ${
                        currentState === item.id
                          ? "bg-nrvPrimaryGreen text-white"
                          : "bg-nrvGreyMediumBg"
                      }`}
                      variant="lightGrey"
                      showIcon={false}
                      onClick={() => handleTabChange(item.id)}
                    >
                      <div className="text-xs md:text-md p-2">{item.name}</div>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="px-4 py-12 md:px-12 md:py-6">
                {currentState === 3 && <PropertyMarketing data={singleRoom} />}
                {currentState === 1 && (
                  <PropertyUnitDetails data={singleRoom} />
                )}
                {currentState === 4 && (
                  <CurrentTenantDashboard data={singleRoom} />
                )}
                {currentState === 5 && <PropertyExpenses />}
              </div>
            </div>
          </div>
        </LandLordLayout>
        <CenterModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <div className="mx-auto text-center p-4">
            <p className="text-nrvLightGrey text-md">
              Listing this property will make it visible to tenant for
              applications.
            </p>
            <p className="text-red-500 text-lg font-medium">
              Are you sure you want to continue?
            </p>

            <div className="mt-8 flex gap-3 justify-center text-center items-center">
              <Button
                size="large"
                className="text-red-500  border border-red-500 mt-2 rounded-md"
                variant="ordinary"
                showIcon={false}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <div className="flex gap-3">Close</div>
              </Button>
              <Button
                size="large"
                className="text-white border border-nrvPrimaryGreen mt-2 rounded-md"
                variant="bluebg"
                showIcon={false}
              >
                <div className="flex gap-3" onClick={updateRoom}>
                  Continue
                </div>
              </Button>
            </div>
          </div>
        </CenterModal>

      </ProtectedRoute>
    </div>
  );
};

export default SingleRoom;
