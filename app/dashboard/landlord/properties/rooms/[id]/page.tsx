"use client";

import ProtectedRoute from "../../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../../components/layout/LandLordLayout";
import Button from "../../../../../components/shared/buttons/Button";
import { useEffect, useState } from "react";
import PropertyMarketing from "../../../../../components/property-dashboard/PropertyMarketing";
import { toast } from "react-toastify";
import {
  getRoomById,
  updateRoomStatus,
} from "../../../../../../redux/slices/propertySlice";
import { useDispatch } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import PropertyUnitDetails from "../../../../../components/property-dashboard/PropertyUnitDetails";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import CurrentTenantDashboard from "../../../../../components/property-dashboard/CurrentTenantDashboard";
import PropertyExpenses from "@/app/components/room-dashboard/PropertyExpenses";
import copy from "copy-to-clipboard";
import { FaCheckCircle } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { formatDateToWords } from "@/helpers/utils";
import ApartmentDocuments from "@/app/components/screens/renters/ApartmentDocuments";

const statusPillClass =
  "inline-flex items-center justify-center px-4 py-1.5 text-[12px] font-semibold rounded-full border w-full md:w-auto";
const actionPillClass =
  "inline-flex items-center justify-center px-4 py-1.5 text-[12px] font-semibold rounded-full w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed";

const SingleRoom = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listingRoom, setListingRoom] = useState(false);
  const [currentState, setCurrentState] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [singleRoom, setRoomDetails] = useState<any>({});

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);

    try {
      const properties = await dispatch(getRoomById(id) as any).unwrap();
      setRoomDetails(properties?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
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

  const canListForTenants = singleRoom?.approved === true;

  const updateRoom = async () => {
    const nextListed = singleRoom.listRoom !== true;
    if (nextListed && !canListForTenants) {
      toast.error(
        "This unit must be approved by an admin before it can be listed."
      );
      setIsModalOpen(false);
      return;
    }
    const payload = {
      id: id,
      status: nextListed,
    };
    try {
      setListingRoom(true);
      await dispatch(updateRoomStatus(payload) as any).unwrap();
      await fetchData();
      toast.success(
        nextListed
          ? "Apartment listed successfully"
          : "Apartment unlisted successfully"
      );
    } catch (error) {
      toast.error("An error occurred while performing update");
    } finally {
      setListingRoom(false);
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
        <LandLordLayout
          path="Properties"
          mainPath="Manage Property"
          subMainPath="View Apartment Details"
        >
          <div className="font-jakarta">
            <div>
              <div className="px-3 py-6 sm:px-4 md:px-12 md:py-6">
                {currentState === 3 && <PropertyMarketing data={singleRoom} />}
                {currentState === 1 && (
                  <div>
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-base font-semibold text-gray-900 sm:text-lg">
                          View Apartment Details
                        </h1>
                        {singleRoom?.approved ? (
                          <span className="inline-flex items-center rounded-md border border-[#099137]/30 bg-[#E7F6EC] px-2 py-0.5 text-[11px] font-medium text-[#099137]">
                            Approved for listing
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                            Awaiting admin approval
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {[
                          singleRoom?.propertyId?.streetAddress,
                          singleRoom?.propertyId?.city,
                          singleRoom?.propertyId?.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-4 rounded-t-lg border border-[#D7E6D8] bg-[#E9F4E7] p-3 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs font-medium text-[#101928] sm:text-sm">
                          Apartment type:{" "}
                          {singleRoom?.apartmentType ||
                            singleRoom?.propertyId?.propertyType ||
                            "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Apartment ID: {singleRoom?.roomId || "—"}
                        </p>
                      </div>
                      <div className="flex w-full flex-wrap gap-2 md:w-auto md:justify-end">
                        <span
                          className={`${statusPillClass} ${
                            singleRoom?.assignedToTenant
                              ? "border-[#F3A218] bg-[#FFF1DA] text-[#F3A218]"
                              : "border-[#099137] bg-[#E7F6EC] text-[#099137]"
                          }`}
                        >
                          {singleRoom?.assignedToTenant
                            ? "Occupied By Tenant"
                            : "Currently Vacant"}
                        </span>
                        <button
                          type="button"
                          disabled={
                            singleRoom.listRoom === false && !canListForTenants
                          }
                          title={
                            singleRoom.listRoom === false && !canListForTenants
                              ? "Awaiting admin approval before this unit can be listed."
                              : undefined
                          }
                          className={`${actionPillClass} bg-[#099137] text-white hover:bg-[#078A30]`}
                          onClick={() => {
                            if (
                              singleRoom.listRoom === false &&
                              !canListForTenants
                            ) {
                              toast.info(
                                "This unit is awaiting admin approval. You can list it once an admin approves."
                              );
                              return;
                            }
                            setIsModalOpen(true);
                          }}
                        >
                          {singleRoom.listRoom === false
                            ? "List Apartment"
                            : "Unlist Apartment"}
                        </button>
                      </div>
                    </div>

                    <Tabs defaultValue="details" className="w-full mt-4">
                      <TabsList className="flex w-full overflow-x-auto whitespace-nowrap border-b border-gray-200 bg-gray-50 hide-scrollbar">
                        <TabsTrigger
                          className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-[#344054] data-[state=active]:border-[#2B892B] data-[state=active]:text-[#2B892B] sm:px-4 sm:text-sm"
                          value="details"
                        >
                          Apartment Details
                        </TabsTrigger>
                        <TabsTrigger
                          className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-[#344054] data-[state=active]:border-[#2B892B] data-[state=active]:text-[#2B892B] sm:px-4 sm:text-sm"
                          value="maintenance"
                        >
                          Ongoing Maintenance
                        </TabsTrigger>
                        <TabsTrigger
                          className="flex-shrink-0 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-[#344054] data-[state=active]:border-[#2B892B] data-[state=active]:text-[#2B892B] sm:px-4 sm:text-sm"
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
                className="text-red-500 border border-red-500 mt-2 rounded-md"
                variant="ordinary"
                showIcon={false}
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                size="large"
                className="mt-2 rounded-md"
                variant="darkPrimary"
                showIcon={false}
                isLoading={listingRoom}
                loadingText="Listing…"
                onClick={updateRoom}
              >
                Continue
              </Button>
            </div>
          </div>
        </CenterModal>
      </ProtectedRoute>
    </div>
  );
};

export default SingleRoom;
