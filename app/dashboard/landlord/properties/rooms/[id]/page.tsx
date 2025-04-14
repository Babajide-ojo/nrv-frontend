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
import { getRoomById } from "../../../../../../redux/slices/propertySlice";
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
        <LandLordLayout
          path="Properties"
          mainPath="Manage Property"
          subMainPath="View Apartment Details"
        >
          <div className="font-jakarta">
            <div>
              {/* 
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
              </div> */}
              <div className="px-4 py-12 md:px-12 md:py-6">
                {currentState === 3 && <PropertyMarketing data={singleRoom} />}
                {currentState === 1 && (
                  <div>
                    {/* Header Section */}
                    <div className="mb-4">
                      <div className="text-lg font-medium text-gray-900">
                        View Apartment Details
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {singleRoom?.propertyId?.streetAddress},{" "}
                        {singleRoom?.propertyId?.city},{" "}
                        {singleRoom?.propertyId?.state}
                      </div>
                    </div>

                    {/* Tenant Section */}
                    <div className="bg-[#E9F4E7] border-t border-l border-r border-[#E9F4E7] rounded-l rounded-r p-2 flex flex-col md:flex-row items-start md:items-center justify-between">
                      <div className="flex gap-2">
                        <div>
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g filter="url(#filter0_dd_1137_39466)">
                              <rect
                                x="6"
                                y="2"
                                width="48"
                                height="48"
                                rx="24"
                                fill="#429634"
                              />
                              <rect
                                x="6.5"
                                y="2.5"
                                width="47"
                                height="47"
                                rx="23.5"
                                stroke="white"
                              />
                            </g>
                            <path
                              d="M37.8334 34.4585H21.1667C20.8251 34.4585 20.5417 34.1752 20.5417 33.8335C20.5417 33.4918 20.8251 33.2085 21.1667 33.2085H37.8334C38.1751 33.2085 38.4584 33.4918 38.4584 33.8335C38.4584 34.1752 38.1751 34.4585 37.8334 34.4585Z"
                              fill="white"
                            />
                            <path
                              opacity="0.4"
                              d="M36.9994 23.8166V33.8333H21.9578L21.9994 23.8082C21.9994 23.2999 22.2328 22.8166 22.6411 22.4999L28.4744 17.9666C29.0744 17.4916 29.9244 17.4916 30.5244 17.9666L31.6411 18.8332L35.3328 21.6999L36.3578 22.4999C36.7661 22.8166 36.9994 23.2999 36.9994 23.8166Z"
                              fill="white"
                            />
                            <path
                              d="M30.3334 29.6665H28.6667C27.9751 29.6665 27.4167 30.2248 27.4167 30.9165V33.8332H31.5834V30.9165C31.5834 30.2248 31.0251 29.6665 30.3334 29.6665Z"
                              fill="white"
                            />
                            <path
                              d="M27.4167 26.9582H25.7501C25.2917 26.9582 24.9167 26.5832 24.9167 26.1248V24.8748C24.9167 24.4165 25.2917 24.0415 25.7501 24.0415H27.4167C27.8751 24.0415 28.2501 24.4165 28.2501 24.8748V26.1248C28.2501 26.5832 27.8751 26.9582 27.4167 26.9582Z"
                              fill="white"
                            />
                            <path
                              d="M33.25 26.9582H31.5833C31.125 26.9582 30.75 26.5832 30.75 26.1248V24.8748C30.75 24.4165 31.125 24.0415 31.5833 24.0415H33.25C33.7083 24.0415 34.0833 24.4165 34.0833 24.8748V26.1248C34.0833 26.5832 33.7083 26.9582 33.25 26.9582Z"
                              fill="white"
                            />
                            <path
                              d="M35.3335 21.7002L31.6418 18.8335H34.4835C34.9418 18.8335 35.3168 19.2002 35.3168 19.6585L35.3335 21.7002Z"
                              fill="white"
                            />
                            <defs>
                              <filter
                                id="filter0_dd_1137_39466"
                                x="0"
                                y="0"
                                width="60"
                                height="60"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                              >
                                <feFlood
                                  flood-opacity="0"
                                  result="BackgroundImageFix"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feMorphology
                                  radius="2"
                                  operator="erode"
                                  in="SourceAlpha"
                                  result="effect1_dropShadow_1137_39466"
                                />
                                <feOffset dy="2" />
                                <feGaussianBlur stdDeviation="2" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="BackgroundImageFix"
                                  result="effect1_dropShadow_1137_39466"
                                />
                                <feColorMatrix
                                  in="SourceAlpha"
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                  result="hardAlpha"
                                />
                                <feMorphology
                                  radius="2"
                                  operator="erode"
                                  in="SourceAlpha"
                                  result="effect2_dropShadow_1137_39466"
                                />
                                <feOffset dy="4" />
                                <feGaussianBlur stdDeviation="4" />
                                <feComposite in2="hardAlpha" operator="out" />
                                <feColorMatrix
                                  type="matrix"
                                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                                />
                                <feBlend
                                  mode="normal"
                                  in2="effect1_dropShadow_1137_39466"
                                  result="effect2_dropShadow_1137_39466"
                                />
                                <feBlend
                                  mode="normal"
                                  in="SourceGraphic"
                                  in2="effect2_dropShadow_1137_39466"
                                  result="shape"
                                />
                              </filter>
                            </defs>
                          </svg>
                        </div>

                        <div className="pt-1">
                          <p className="font-medium text-sm text-[#101928]">
                            Property Type : {singleRoom.propertyType}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Apartment ID: {singleRoom.roomId}
                          </p>
                        </div>
                      </div>
                      <button
                      className={`px-4 py-1.5 text-[12px] font-semibold rounded-full ${
                        singleRoom?.assignedToTenant
                          ? "bg-[#FFF1DA] text-[#F3A218]"
                          : "text-[#E7F6EC] bg-[#099137]"
                      }`}
                    >
                      {singleRoom?.assignedToTenant
                        ? "Occupied By Tenant"
                        : "Currently Vacant"}
                    </button>
                    </div>

                    <PropertyUnitDetails data={singleRoom} />
                    <CurrentTenantDashboard data={singleRoom} />
                  </div>
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
