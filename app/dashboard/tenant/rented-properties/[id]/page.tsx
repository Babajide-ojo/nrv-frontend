"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../../components/loaders/LoadingPage";
import Spinner from "@/app/components/loaders/Spinner";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  getApplicationsById,
  getPropertyByIdForTenant,
  withdrawApplication,
} from "../../../../../redux/slices/propertySlice";
import TenantLayout from "@/app/components/layout/TenantLayout";
import Link from "next/link";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import { MdAddHomeWork } from "react-icons/md";
import { FaPersonShelter } from "react-icons/fa6";
import { GrWorkshop } from "react-icons/gr";
import { IoDocuments } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { RiGitPullRequestFill } from "react-icons/ri";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import ConfirmationModal from "@/app/components/shared/modals/ConfirmationModal";
import Button from "@/app/components/shared/buttons/Button";
import AgreementDocumentScreen from "@/app/components/dashboard/tenant/AgreementDocumentScreen";
import Modal from "@/app/components/shared/modals/Modal";
import Image from "next/image";
import CheckMark from "@/app/components/icons/CheckMark";
import MessageIcon from "@/app/components/icons/MessageIcon";
import PdfIcon from "@/app/components/icons/PdfIcon";
import EyeIcon from "@/app/components/icons/EyeIcon";
import { DownloadIcon, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import Status from "@/app/components/shared/Status";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formatAddress = (addr: string) => {
  if (!addr) return "—";
  let formatted = addr;
  let prev = "";
  while (formatted !== prev) {
    prev = formatted;
    formatted = formatted.replace(/^(?:no\.?\s+|plot\s+|block\s+)?\d+[a-zA-Z]?\s*,?\s*/i, '');
  }
  return formatted.trim() || addr;
};

const hasDisplayValue = (value: unknown) => {
  if (value == null) {
    return false;
  }
  const text = String(value).trim();
  return text.length > 0 && text !== "—";
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:p-4">
    <p className="text-[11px] font-medium uppercase tracking-wide text-[#667085]">
      {label}
    </p>
    <div className="mt-1.5 text-sm font-semibold text-gray-900 break-words">
      {value}
    </div>
  </div>
);

const RentedPropertiesScreen = () => {
  const pathname = usePathname();
  const isApplicationMode = pathname.includes("applications");
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLandLordOpen, setIsLandLordOpen] = useState<boolean>(false);
  const [isUploadSignedDocsOpen, setIsUploadSignedDocsOpen] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    const formData = {
      id: id,
      tenantId: user?.user?._id,
    };

    try {
      const response = await dispatch(getApplicationsById(formData) as any);
      setProperty(response?.payload?.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  };

  const room = property?.propertyId;
  const listing = room?.propertyId;
  const propertyAddress = [
    formatAddress(listing?.streetAddress ?? room?.streetAddress ?? ""),
    listing?.city,
    listing?.state,
  ]
    .filter(Boolean)
    .join(", ");
  const unitTitle =
    room?.apartmentType ??
    room?.apartmentStyle ??
    listing?.propertyType?.label ??
    "Apartment";
  const applicationDetails = isApplicationMode
    ? [
        { label: "Job Title", value: property?.jobTitle ?? "—" },
        { label: "Current Employer", value: property?.currentEmployer ?? "—" },
        {
          label: "Monthly Income",
          value: property?.monthlyIncome
            ? `₦${Number(property.monthlyIncome).toLocaleString()}`
            : "—",
        },
        { label: "Reason for Moving", value: property?.reasonForLiving ?? "—" },
        { label: "Current Residence", value: property?.currentResidence ?? "—" },
        { label: "Payment Option", value: room?.paymentOption ?? "—" },
        { label: "Lease Terms", value: room?.leaseTerms ?? "—" },
        {
          label: "Property Owner",
          value: property?.ownerId
            ? `${property.ownerId.firstName ?? ""} ${property.ownerId.lastName ?? ""}`.trim()
            : "—",
        },
      ].filter((item) => hasDisplayValue(item.value))
    : [];

  const handleWithdrawApplication = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as string);
    const tenantId = user?.user?._id;
    if (!tenantId || !id) {
      toast.error("Could not verify your account.");
      return;
    }

    setIsWithdrawing(true);
    try {
      await dispatch(
        withdrawApplication({ id: String(id), tenantId }) as any,
      ).unwrap();
      setShowWithdrawConfirm(false);
      toast.success("Application withdrawn.");
      router.push("/dashboard/tenant/properties/applications");
    } catch (error: any) {
      toast.error(error || "Could not withdraw application.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const canWithdrawApplication =
    isApplicationMode &&
    ["New", "Accepted"].includes(property?.status) &&
    property?.status !== "Withdrawn";

  const rentDetails = isApplicationMode
    ? [
        {
          name: "Application Status",
          value: <Status status={property?.status} />,
        },
        {
          name: "Application Date",
          value: property?.createdAt
            ? format(new Date(property?.createdAt), "dd MMM yyyy")
            : "—",
        },
        {
          name: "Rent Amount",
          value: `₦${(room?.rentAmount ?? 0).toLocaleString()}`,
        },
        {
          name: "Apartment Type",
          value: room?.apartmentType ?? listing?.apartmentType ?? "—",
        },
        {
          name: "Last Updated",
          value: property?.updatedAt
            ? format(new Date(property?.updatedAt), "dd MMM yyyy")
            : "—",
        },
      ]
    : [
        {
          name: "Rent Status",
          value:
            property?.status === "activeTenant" ? "Active" : property?.status,
        },
        {
          name: "Rent Start Date",
          value: property?.rentStartDate
            ? format(new Date(property?.rentStartDate), "dd-MM-yyyy")
            : "NIL",
        },
        {
          name: "Rent End Date",
          value: property?.rentEndDate
            ? format(new Date(property?.rentEndDate), "dd-MM-yyyy")
            : "NIL",
        },
        {
          name: "Rent Amount",
          value: `₦${property?.propertyId?.rentAmount?.toLocaleString() ?? 0}`,
        },
        {
          name: "Landlord Contact",
          value: property?.ownerId?.phoneNumber,
        },
      ];
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="w-full min-w-0">
      <ProtectedRoute>
        <TenantLayout
          path={
            isApplicationMode ? "Applications" : "Rented Apartments"
          }
          mainPath={
            isApplicationMode ? "Track application" : "Apartment"
          }
        >
          {isLoading ? (
            <div className="space-y-4 p-3 animate-pulse sm:space-y-6 sm:p-4 md:p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="mt-5 flex flex-col border border-nrvLightGray rounded-2xl bg-white overflow-hidden">
                <div className="px-10 py-4 bg-[#E4E7EC] flex items-center gap-5">
                  <div className="rounded-full h-12 w-12 bg-gray-300"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-300 rounded w-40"></div>
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
                <div className="px-4 py-4 gap-5 md:gap-0 flex flex-col md:flex-row">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center w-60 md:border-r last:border-0 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-5 flex flex-col border border-nrvLightGray rounded-2xl bg-white overflow-hidden">
                <div className="p-4 pt-7 border-b">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex flex-col-reverse md:flex-row px-4">
                  <div className="md:border-r w-full md:w-[70%] py-4 space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col sm:flex-row border-b pb-4 space-y-4 sm:space-y-0">
                        <div className="w-60 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-5 bg-gray-200 rounded w-32"></div>
                        </div>
                        <div className="sm:border-l sm:pl-5 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-5 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full md:w-[30%] p-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-32 bg-gray-200 rounded-xl w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isPageLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <Spinner size={28} className="text-white" />
              </div>
            )}

            {property && (
              <div
                className={`w-full min-w-0 max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-4 ${
                  isApplicationMode && canWithdrawApplication
                    ? "pb-28 md:pb-6"
                    : "pb-6"
                }`}
              >
                <div className="flex items-start gap-3 mb-5 sm:mb-6 text-nrvGreyBlack">
                  <BackIcon />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-nrvPrimaryGreen leading-snug">
                      {isApplicationMode
                        ? "Track Your Application"
                        : "Manage Your Apartment"}
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-600 break-words">
                      {propertyAddress || "—"}
                    </p>
                  </div>
                </div>

                {isApplicationMode && property?.status === "Withdrawn" && (
                  <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                    This application has been withdrawn and is no longer under review.
                  </div>
                )}

                {/* Property hero — top of page on mobile */}
                <div className="mb-4 md:hidden rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                  <div className="relative aspect-[16/10] w-full bg-gray-100">
                    <Image
                      src={
                        listing?.file ??
                        room?.file ??
                        "/images/featured-img.svg"
                      }
                      alt="Apartment"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  {isApplicationMode && (
                    <div className="flex items-center justify-between gap-3 p-3 text-sm">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Rent per annum</p>
                        <p className="font-semibold text-gray-900 tabular-nums">
                          ₦{(room?.rentAmount ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Status status={property?.status} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <div className="grid md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="px-4 py-5 sm:px-6 sm:py-6 border-b md:border-b-0 md:border-r border-gray-100">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                              {unitTitle}
                            </h4>
                            {isApplicationMode && <Status status={property?.status} />}
                          </div>
                          <p className="mt-1 text-sm text-gray-600 break-words">
                            {propertyAddress || "—"}
                          </p>
                          <p className="mt-3 text-xs text-gray-500">
                            Application ID{" "}
                            <span className="font-mono font-medium text-gray-700">
                              {property?._id?.slice(-8)?.toUpperCase()}
                            </span>
                            {room?.roomId ? (
                              <>
                                {" "}
                                · Unit{" "}
                                <span className="font-medium text-gray-700">
                                  {room.roomId}
                                </span>
                              </>
                            ) : null}
                          </p>
                        </div>
                        <Button
                          variant="darkPrimary"
                          className="w-full sm:w-auto shrink-0 text-sm"
                          onClick={() => setIsModalOpen(true)}
                        >
                          View owner contact
                        </Button>
                      </div>

                      {room?.description && (
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
                          {room.description}
                        </p>
                      )}
                    </div>

                    <div className="relative hidden md:block min-h-[220px] bg-gray-100">
                      <Image
                        src={
                          listing?.file ??
                          room?.file ??
                          "/images/featured-img.svg"
                        }
                        alt="Apartment"
                        fill
                        className="object-cover"
                        sizes="220px"
                      />
                    </div>
                  </div>

                  <div className="px-3 py-4 sm:px-5 grid grid-cols-2 lg:grid-cols-4 gap-3 border-t border-gray-100 bg-[#FAFAFA]">
                    {rentDetails
                      .filter((detail) => detail.name !== "Application Status")
                      .map((detail, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white bg-white p-3 shadow-sm"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#667085]">
                          {detail.name}
                        </p>
                        <div className="mt-1.5 text-sm font-semibold text-gray-900 break-words">
                          {detail.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 sm:mt-5 flex flex-col border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
                  <p className="px-4 py-4 sm:px-5 text-sm sm:text-base font-semibold border-b bg-white">
                    {isApplicationMode
                      ? "Application & Property Details"
                      : "Apartment Information"}
                  </p>
                  {isApplicationMode && applicationDetails.length > 0 && (
                    <div className="px-4 py-5 sm:px-5 border-b">
                      <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#03442C]">
                        Your application
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {applicationDetails.map(({ label, value }) => (
                          <DetailItem key={label} label={label} value={value} />
                        ))}
                      </div>
                    </div>
                  )}
                  {isApplicationMode && applicationDetails.length === 0 && (
                    <div className="px-4 py-5 sm:px-5 border-b text-sm text-gray-500">
                      No additional application details were provided.
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row px-3 sm:px-4">
                    <div className="md:border-r w-full md:w-[70%] min-w-0">
                      {isApplicationMode && (
                        <div className="px-1 py-4 border-b">
                          <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#03442C]">
                            Unit information
                          </h5>
                        </div>
                      )}
                      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b px-1">
                        <DetailItem
                          label="Apartment Style"
                          value={room?.apartmentStyle ?? listing?.apartmentStyle ?? "—"}
                        />
                        <DetailItem
                          label="Apartment Address"
                          value={`${formatAddress(listing?.streetAddress ?? "")} ${listing?.city ?? ""} ${listing?.state ?? ""}`.trim() || "—"}
                        />
                      </div>
                      <div className="py-4 px-1 grid grid-cols-2 sm:grid-cols-3 gap-3 border-b">
                        <DetailItem label="Flat Number" value={room?.roomId ?? "—"} />
                        <DetailItem
                          label="Bedrooms"
                          value={room?.noOfRooms ?? listing?.noOfRooms ?? "—"}
                        />
                        <DetailItem
                          label="Bathrooms"
                          value={room?.noOfBaths ?? listing?.noOfBaths ?? "—"}
                        />
                      </div>
                      <div className="py-4 px-1 border-b md:border-b-0">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#667085]">
                          Facilities / Amenities
                        </p>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {room?.otherAmentities?.length > 0 ? (
                            room.otherAmentities.map(
                              (amenity: string, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-1.5 bg-[#E9F4E7] px-3 py-1 text-xs font-medium rounded-full"
                                >
                                  <CheckMark height={14} width={14} />
                                  {amenity}
                                </div>
                              ),
                            )
                          ) : (
                            <p className="text-sm text-gray-500">No amenities listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block w-full md:w-[30%] md:pl-4 pb-5 shrink-0">
                      <div className="w-full aspect-square rounded-lg p-3 bg-[#F9FAFB]">
                        <div className="h-full w-full rounded-lg overflow-hidden relative">
                          <Image
                            src={
                              listing?.file ??
                              room?.file ??
                              "/images/featured-img.svg"
                            }
                            alt="Apartment Image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 30vw"
                          />
                        </div>
                      </div>
                      {isApplicationMode ? (
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between text-sm gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div className="flex flex-col min-w-0">
                              <p className="text-sm text-[#475467]">
                                Apartment Style
                              </p>
                              <p className="font-semibold truncate">
                                {room?.apartmentStyle ??
                                  listing?.apartmentStyle ??
                                  "—"}
                              </p>
                            </div>
                            <div className="flex flex-col text-right shrink-0">
                              <p className="text-sm text-[#475467]">
                                Price / year
                              </p>
                              <p className="font-semibold tabular-nums">{`₦${(room?.rentAmount ?? 0).toLocaleString()}`}</p>
                            </div>
                          </div>
                          {canWithdrawApplication && (
                            <Button
                              variant="orangeOutline"
                              className="h-10 rounded-md w-full"
                              disabled={isWithdrawing}
                              onClick={() => setShowWithdrawConfirm(true)}
                            >
                              Withdraw Application
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 flex flex-col gap-2">
                          <Button
                            variant="darkPrimary"
                            className="h-10 rounded-md w-full"
                            onClick={() =>
                              window.open(
                                `mailto:${property?.propertyId?.owner?.email}`
                              )
                            }
                          >
                            <div className="flex gap-2 items-center">
                              <MessageIcon />
                              Contact Landlord
                            </div>
                          </Button>
                          <Button
                            variant="orangeOutline"
                            className="h-10 rounded-md w-full"
                            onClick={() =>
                              router.push(
                                `/dashboard/tenant/rented-properties/maintenance/request-maintainance/${id}`
                              )
                            }
                          >
                            Request Maintainance
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isApplicationMode && canWithdrawApplication && (
                  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] md:hidden">
                    <Button
                      variant="orangeOutline"
                      className="h-11 rounded-xl w-full text-sm font-semibold"
                      disabled={isWithdrawing}
                      onClick={() => setShowWithdrawConfirm(true)}
                    >
                      Withdraw Application
                    </Button>
                  </div>
                )}
              </div>
            )}
            </>
          )}
          </TenantLayout>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact Information
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {property?.ownerId?.firstName}{" "}
                      {property?.ownerId?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{property?.ownerId?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">
                      {property?.ownerId?.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Link
                  className="flex-1"
                  href={`tel:${property?.ownerId?.phoneNumber}`}
                >
                  <Button
                    // variant="outline"
                    className="w-full"
                  >
                    <div className="flex items-center gap-2 py-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </div>
                  </Button>
                </Link>
                <Link
                  className="flex-1"
                  href={`mailto:${property?.ownerId?.email}`}
                >
                  <Button
                    className="w-full"
                    // onClick={() => window.open(`mailto:${property?.owner?.email}`)}
                  >
                    <div className="flex items-center gap-2 py-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </div>
                  </Button>
                </Link>
              </div>
            </DialogContent>
          </Dialog>

          <ConfirmationModal
            isOpen={showWithdrawConfirm}
            tone="warning"
            heading="Withdraw application?"
            message="Are you sure you want to withdraw this application?"
            subMessage="This action cannot be undone. You will need to submit a new application if you change your mind."
            confirmLabel="Withdraw application"
            cancelLabel="Keep application"
            confirmLoading={isWithdrawing}
            onCancel={() => {
              if (!isWithdrawing) {
                setShowWithdrawConfirm(false);
              }
            }}
            onConfirm={handleWithdrawApplication}
          />
        </ProtectedRoute>
    </div>
  );
};

export default RentedPropertiesScreen;
