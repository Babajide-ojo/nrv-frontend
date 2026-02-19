"use client";

import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../../components/layout/LandLordLayout";
import Button from "../../../../../components/shared/buttons/Button";
import { useEffect, useState } from "react";
import PropertyMarketing from "../../../../../components/property-dashboard/PropertyMarketing";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRoomById } from "../../../../../../redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import PropertyUnitDetails from "../../../../../components/property-dashboard/PropertyUnitDetails";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import { updateRoomStatus } from "../../../../../../redux/slices/propertySlice";
import CurrentTenantDashboard from "../../../../../components/property-dashboard/CurrentTenantDashboard";
import PropertyExpenses from "@/app/components/room-dashboard/PropertyExpenses";
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDateToWords } from "@/helpers/utils";
import ApartmentDocuments from "@/app/components/screens/renters/ApartmentDocuments";
import BackIcon from "@/app/components/shared/icons/BackIcon";

const SingleRoom = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      fetchData();

    } catch (error) {
      toast.error("An error occurred while performing update");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
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
              <div className="px-4 py-12 md:px-12 md:py-6">
                {currentState === 3 && <PropertyMarketing data={singleRoom} />}
                {currentState === 1 && (
                  <div>
                    <div className="mb-4">
                      <div className="text-lg font-medium text-gray-900 flex gap-4">
                        <BackIcon />
                        View Apartment Details
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {singleRoom?.propertyId?.streetAddress},{" "}
                        {singleRoom?.propertyId?.city},{" "}
                        {singleRoom?.propertyId?.state}
                      </div>
                    </div>
                    <div className="bg-[#E9F4E7] border-t border-l border-r border-[#E9F4E7] rounded-l rounded-r p-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                      <div className="flex gap-2">
                        <div></div>

                        <div className="pt-1">
                          <p className="font-medium text-sm text-[#101928]">
                            Property Type : {singleRoom.propertyType}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Apartment ID: {singleRoom.roomId}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 flex-wrap w-full md:w-auto">
                        <button
                          className={`px-4 py-1.5 text-[12px] font-semibold rounded-full w-full md:w-auto ${
                            singleRoom?.assignedToTenant
                              ? "bg-[#FFF1DA] text-[#F3A218]"
                              : "text-[#E7F6EC] bg-[#099137]"
                          }`}
                        >
                          {singleRoom?.assignedToTenant
                            ? "Occupied By Tenant"
                            : "Currently Vacant"}
                        </button>
                        <button
                          className="px-4 py-1.5 text-[12px] font-semibold rounded-full text-[#E7F6EC] bg-[#099137] w-full md:w-auto"
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="flex gap-3 p-1.5 text-swBlue justify-center">
                            {singleRoom.listRoom === false
                              ? "List Apartment"
                              : "Unlist Apartment"}
                          </div>
                        </button>
                      </div>
                    </div>

                    <Tabs defaultValue="details" className="w-full mt-4">
                      <TabsList className="w-full bg-gray-50 border-b border-gray-200 overflow-x-auto flex whitespace-nowrap hide-scrollbar">
                        <TabsTrigger
                          className="text-[14px] font-medium p-4 md:p-6 text-[#344054] border-b-2 border-transparent data-[state=active]:text-[#2B892B] data-[state=active]:border-[#2B892B] flex-shrink-0"
                          value="details"
                        >
                          Apartment Details
                        </TabsTrigger>
                        <TabsTrigger
                          className="text-[14px] font-medium p-4 md:p-6 text-[#344054] border-b-2 border-transparent data-[state=active]:text-[#2B892B] data-[state=active]:border-[#2B892B] flex-shrink-0"
                          value="maintenance"
                        >
                          Ongoing Maintenance
                        </TabsTrigger>
                        <TabsTrigger
                          className="text-[14px] font-medium p-4 md:p-6 text-[#344054] border-b-2 border-transparent data-[state=active]:text-[#2B892B] data-[state=active]:border-[#2B892B] flex-shrink-0"
                          value="document"
                        >
                          Apartment Documents
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="details">
                        <PropertyUnitDetails data={singleRoom} />
                        <CurrentTenantDashboard data={singleRoom} />
                      </TabsContent>
                      <TabsContent value="maintenance">
                        <DataTable
                          rowActions={(row: BaseRow) => {
                            return (
                              <div className="flex gap-2">
                                <p
                                  className="text-xs text-[#2B892B] font-medium cursor-pointer"
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/landlord/properties/maintenance/${row._id}`
                                    )
                                  }
                                >
                                  view
                                </p>
                              </div>
                            );
                          }}
                          endpoint={`${API_URL}/maintenance/get-apartment-maintenance/${singleRoom?._id}`}
                          columns={[
                            {
                              key: "maintenanceId",
                              label: "Maintenance ID",
                              render: (val) => (
                                <span className="font-medium italic text-[#045D23]">
                                  MR-{val}
                                </span>
                              ),
                            },
                            {
                              key: "title",
                              label: "Title",
                            },
                            {
                              key: "createdAt",
                              label: "Reported On",
                              render: (val) => (
                                <span>{formatDateToWords(val)}</span>
                              ),
                            },
                            {
                              key: "status",
                              label: "Status",
                              render: (val) => (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    val === "Resolved"
                                      ? "bg-[#F7F6F2] text-green-700"
                                      : "bg-[#F7F6F2] text-yellow-700"
                                  }`}
                                >
                                  {val || "Pending"}
                                </span>
                              ),
                            },
                          ]}
                        />
                      </TabsContent>
                      <TabsContent value="document">
                        <ApartmentDocuments propertyId={id} />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {currentState === 5 && <PropertyExpenses />}
              </div>
            </div>
          </div>
        </LandLordLayout>
        <CenterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
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
                  setIsModalOpen(false);
                }}
              >
                <div className="flex gap-3">Close</div>
              </Button>
              <Button
                size="large"
                className="text-white border border-nrvPrimaryGreen mt-2 rounded-md"
                variant="bluebg"
                showIcon={false}
                isLoading={isLoading}
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
