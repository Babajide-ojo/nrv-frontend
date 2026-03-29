"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { API_URL } from "@/config/constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Home,
  MapPin,
  Shield,
  AlertTriangle,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WatermarkedImage from "@/app/components/shared/WatermarkedImage";
import { TenantPropertyApplicationPanel } from "@/app/components/tenant/TenantPropertyApplicationPanel";
import {
  mapTenantRoomForApplication,
  type TenantPropertyApplicationView,
} from "@/app/lib/mapTenantRoomForApplication";

type RoomResponse = {
  _id: string;
  roomId?: number;
  description?: string;
  apartmentType?: string;
  apartmentStyle?: string;
  rentAmount?: number;
  rentAmountMetrics?: string;
  noOfRooms?: string;
  noOfBaths?: string;
  leaseTerms?: string;
  paymentOption?: string;
  otherAmentities?: string[];
  file?: string;
  imageUrls?: string[];
  propertyId?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    file?: string;
  };
};

function toAbsoluteImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}

const formatAddress = (addr: string) => {
  if (!addr) return "—";
  let formatted = addr;
  let prev = "";
  while (formatted !== prev) {
    prev = formatted;
    formatted = formatted.replace(/^(?:no\.?\s+|plot\s+|block\s+)?\d+[a-zA-Z]?\s*,?\s*/i, "");
  }
  return formatted.trim() || addr;
};

/** Derive monthly & annual figures from stored rent + metrics (Monthly / Quarterly / Annually). */
function deriveMonthlyYearly(rent: number, metrics?: string) {
  const m = (metrics || "").toLowerCase();
  if (m.includes("month")) {
    return { monthly: rent, yearly: rent * 12 };
  }
  if (m.includes("quarter")) {
    return { monthly: Math.round(rent / 3), yearly: rent * 4 };
  }
  if (m.includes("annual") || m.includes("annually")) {
    return { monthly: Math.round(rent / 12), yearly: rent };
  }
  if (rent >= 300_000) {
    return { monthly: Math.round(rent / 12), yearly: rent };
  }
  return { monthly: rent, yearly: rent * 12 };
}

export type PublicPropertyDetailsModalProps = {
  roomId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PublicPropertyDetailsModal({
  roomId,
  open,
  onOpenChange,
}: PublicPropertyDetailsModalProps) {
  const router = useRouter();

  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [contactOpen, setContactOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactOwner, setContactOwner] = useState<{
    name: string;
    email?: string;
    phone?: string;
  } | null>(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applyProperty, setApplyProperty] = useState<TenantPropertyApplicationView | null>(null);
  const [applyUser, setApplyUser] = useState<{ _id?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("nrv-user") : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { user?: { accountType?: string } };
        setAccountType(String(parsed?.user?.accountType || "").toLowerCase());
      } else {
        setAccountType(null);
      }
    } catch {
      setAccountType(null);
    }
  }, []);

  useEffect(() => {
    if (!open || !roomId) {
      if (!open) {
        setRoom(null);
        setError(null);
      }
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/rooms/single/${roomId}`);
        const json = await res.json();
        setRoom((json?.data as RoomResponse) ?? null);
      } catch {
        setError("Unable to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, open]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [roomId]);

  const galleryUrls = useMemo(() => {
    if (!room) return [];
    const fromArray = Array.isArray(room.imageUrls)
      ? room.imageUrls.map((u) => toAbsoluteImageUrl(u)).filter(Boolean)
      : [];
    if (fromArray.length > 0) return fromArray as string[];
    const fallbacks = [room.file, room.propertyId?.file]
      .map((u) => toAbsoluteImageUrl(u))
      .filter(Boolean);
    return fallbacks as string[];
  }, [room]);

  const currentImageUrl = galleryUrls[selectedImageIndex] ?? galleryUrls[0];

  useEffect(() => {
    if (!galleryUrls.length) {
      setImageLoading(false);
      setImageError(false);
      return;
    }
    setImageLoading(true);
    setImageError(false);
  }, [currentImageUrl, galleryUrls.length]);

  useEffect(() => {
    if (!galleryUrls.length || !imageLoading) return;
    const t = setTimeout(() => {
      setImageLoading(false);
      setImageError(true);
    }, 10000);
    return () => clearTimeout(t);
  }, [galleryUrls.length, selectedImageIndex, imageLoading]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const subtitle = useMemo(() => {
    if (!room) return "";
    const a = room.apartmentType?.trim() || "";
    const b = room.apartmentStyle?.trim() || "";
    if (a && b) return `${a} • ${b}`;
    return a || b || "";
  }, [room]);

  const isAuthenticated =
    accountType === "tenant" || accountType === "landlord";
  const isTenant = accountType === "tenant";

  /** City & state only — guests and tenants (no street). */
  const publicLocation = useMemo(() => {
    if (!room?.propertyId) return "";
    const { city, state } = room.propertyId;
    return [city, state].filter(Boolean).join(", ");
  }, [room]);

  /** Full formatted address — landlords only in this modal. */
  const fullAddress = useMemo(() => {
    if (!room?.propertyId) return "";
    const raw = [
      room.propertyId.streetAddress,
      room.propertyId.city,
      room.propertyId.state,
    ]
      .filter(Boolean)
      .join(", ");
    return formatAddress(raw);
  }, [room]);

  const displayLocation = useMemo(() => {
    if (isTenant) return publicLocation;
    if (isAuthenticated && fullAddress.trim() && fullAddress !== "—") {
      return fullAddress;
    }
    return publicLocation;
  }, [isTenant, isAuthenticated, fullAddress, publicLocation]);

  const mapSearchQuery = useMemo(() => {
    if (isAuthenticated && !isTenant) {
      const a = fullAddress.trim();
      if (a && a !== "—") {
        return a.toLowerCase().includes("nigeria") ? a : `${a}, Nigeria`;
      }
    }
    if (!publicLocation.trim()) return "Lagos, Nigeria";
    return publicLocation.includes("Nigeria") ? publicLocation : `${publicLocation}, Nigeria`;
  }, [isAuthenticated, isTenant, fullAddress, publicLocation]);

  const mapEmbedSrc = useMemo(() => {
    const q = encodeURIComponent(mapSearchQuery);
    return `https://www.google.com/maps?q=${q}&z=13&output=embed`;
  }, [mapSearchQuery]);

  const mapsOpenHref = useMemo(() => {
    const q = encodeURIComponent(mapSearchQuery);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }, [mapSearchQuery]);

  const pricePerAnnum = useMemo(() => {
    const rent = room?.rentAmount ?? 0;
    if (!rent || rent <= 0) return 0;
    return deriveMonthlyYearly(rent, room?.rentAmountMetrics).yearly;
  }, [room]);

  const rentParts = useMemo(() => {
    const rent = room?.rentAmount ?? 0;
    if (!rent || rent <= 0) return null;
    const { monthly, yearly } = deriveMonthlyYearly(rent, room?.rentAmountMetrics);
    return {
      monthlyLabel: `₦${monthly.toLocaleString()}/mo`,
      yearlyLabel: `₦${yearly.toLocaleString()}/yr`,
    };
  }, [room]);

  const unitNumberDisplay = useMemo(() => {
    if (room?.roomId != null && room.roomId !== undefined) return String(room.roomId);
    return "—";
  }, [room]);

  /** Mongo room id — prefer API payload, fall back to modal prop so routes never use `undefined`. */
  const listingId = useMemo(() => room?._id ?? roomId ?? null, [room?._id, roomId]);

  const listingShareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!listingId) return "";
    return `${window.location.origin}/properties/${listingId}`;
  }, [listingId]);

  const copyListingLink = useCallback(() => {
    const url = listingShareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;
    const ok = copy(url);
    if (ok) {
      toast.success("Link copied — you can share this listing anywhere.");
    } else {
      toast.error("Could not copy link.");
    }
  }, [listingShareUrl]);

  const fetchTenantContact = useCallback(async () => {
    if (!listingId) return;
    setContactLoading(true);
    setContactError(null);
    setContactOwner(null);
    try {
      const raw = localStorage.getItem("nrv-user");
      const parsed = raw ? (JSON.parse(raw) as { user?: { _id?: string } }) : null;
      const tenantId = parsed?.user?._id;
      if (!tenantId) {
        setContactError("Sign in as a tenant to view contact details.");
        setContactLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/rooms/single/tenant/${listingId}/${tenantId}`);
      const json = await res.json();
      const payload = json?.data;
      const roomDoc = payload?.property;
      const createdBy = roomDoc?.propertyId?.createdBy;
      if (!createdBy || typeof createdBy !== "object") {
        setContactError("Contact details are not available for this listing.");
        setContactLoading(false);
        return;
      }
      const first = String(createdBy.firstName || "").trim();
      const last = String(createdBy.lastName || "").trim();
      setContactOwner({
        name: [first, last].filter(Boolean).join(" ") || "Property owner",
        email: createdBy.email,
        phone: createdBy.phoneNumber,
      });
    } catch {
      setContactError("Could not load contact details. Please try again.");
    } finally {
      setContactLoading(false);
    }
  }, [listingId]);

  const fetchTenantApplyContext = useCallback(async () => {
    if (!listingId) return;
    setApplyLoading(true);
    setApplyError(null);
    setApplyProperty(null);
    try {
      const raw = localStorage.getItem("nrv-user");
      const parsed = raw ? (JSON.parse(raw) as { user?: { _id?: string } }) : null;
      const tenantId = parsed?.user?._id;
      if (!tenantId) {
        setApplyError("Sign in as a tenant to apply.");
        setApplyLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/rooms/single/tenant/${listingId}/${tenantId}`);
      const json = await res.json();
      if (json?.status === "error" || !json?.data?.property) {
        setApplyError(
          typeof json?.message === "string" ? json.message : "Could not load this listing to apply.",
        );
        setApplyLoading(false);
        return;
      }
      const hasApplied = Boolean(json.data.hasApplied);
      const mapped = mapTenantRoomForApplication(json.data.property, hasApplied);
      setApplyProperty(mapped);
    } catch {
      setApplyError("Could not load application. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  }, [listingId]);

  const openTenantApplyModal = useCallback(() => {
    if (!listingId) return;
    try {
      const raw = localStorage.getItem("nrv-user");
      const parsed = raw ? (JSON.parse(raw) as { user?: { _id?: string } }) : null;
      setApplyUser(parsed?.user ?? null);
    } catch {
      setApplyUser(null);
    }
    setApplyOpen(true);
    void fetchTenantApplyContext();
  }, [listingId, fetchTenantApplyContext]);

  const handleContactClick = useCallback(() => {
    if (!room || !listingId) return;
    if (accountType === "tenant") {
      setContactOpen(true);
      void fetchTenantContact();
      return;
    }
    if (accountType === "landlord") {
      onOpenChange(false);
      router.push("/dashboard/landlord");
      return;
    }
    router.push(`/sign-up?redirect=/properties/${listingId}`);
  }, [room, listingId, accountType, router, onOpenChange, fetchTenantContact]);

  const handleApplyClick = useCallback(() => {
    if (!listingId) return;
    try {
      const raw = localStorage.getItem("nrv-user");
      if (raw) {
        const parsed = JSON.parse(raw) as { user?: { accountType?: string } };
        const type = String(parsed?.user?.accountType || "").toLowerCase();

        if (type === "tenant") {
          openTenantApplyModal();
          return;
        }
        if (type === "landlord") {
          onOpenChange(false);
          router.push(`/dashboard/landlord`);
          return;
        }
        onOpenChange(false);
        router.push(`/`);
        return;
      }
    } catch {
      // fall through
    }
    router.push(`/sign-up?redirect=/properties/${listingId}`);
  }, [listingId, router, onOpenChange, openTenantApplyModal]);

  const contactOwnerLabel = useMemo(() => {
    if (accountType === "tenant") return "Contact owner";
    if (accountType === "landlord") return "Go to dashboard";
    return "Sign up to contact owner";
  }, [accountType]);

  const applyLabel = useMemo(() => {
    if (accountType === "tenant") return "Apply now";
    if (accountType === "landlord") return "Go to dashboard";
    return "Sign up to apply";
  }, [accountType]);

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed left-1/2 top-[3vh] z-50 flex max-h-[94vh] w-[calc(100vw-1rem)] max-w-[min(80rem,calc(100vw-1rem))] -translate-x-1/2 translate-y-0 flex-col gap-0 overflow-y-auto overflow-x-hidden border border-gray-200 bg-gray-50 p-0 shadow-2xl sm:rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-4 pt-12 md:p-8 md:pt-14 max-w-7xl mx-auto w-full text-[#031B14] pb-6">
          <div className="mb-4 md:hidden">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#03442C]"
            >
              <ArrowLeft className="w-4 h-4" />
              Close
            </button>
          </div>

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                  <div className="h-80 bg-gray-200 rounded-2xl" />
                  <div className="flex gap-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-40 bg-white rounded-2xl border border-gray-100" />
                  <div className="h-32 bg-white rounded-2xl border border-gray-100" />
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white border border-red-100 p-6 sm:p-8 shadow-sm text-center">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          ) : !room ? (
            <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm text-center">
              <p className="text-gray-700 font-medium">
                Property not found or is no longer available.
              </p>
            </div>
          ) : (
            <>
              {/* Header — matches tenant dashboard */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                  <div className="flex items-start md:items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="hidden md:inline-flex p-1 rounded-lg hover:bg-gray-100 text-gray-700"
                      aria-label="Close"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="border-l h-8 mx-1 hidden md:block border-gray-200" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-800 mb-1">
                        View Property Details
                      </h1>
                      {subtitle ? (
                        <p className="text-gray-600 text-base">{subtitle}</p>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyListingLink}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                    aria-label="Copy listing link"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main grid — gallery (1 col) + details (2 cols), same as tenant */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: gallery + apply CTA */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative">
                      <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-100">
                        {imageLoading && galleryUrls.length > 0 && (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
                          </div>
                        )}

                        {imageError && galleryUrls.length > 0 && (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
                            <div className="text-center text-gray-500 px-4">
                              <p className="text-sm font-medium">Image failed to load</p>
                            </div>
                          </div>
                        )}

                        {!galleryUrls.length ? (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                            No images available
                          </div>
                        ) : (
                          <WatermarkedImage
                            src={galleryUrls[selectedImageIndex]}
                            alt="Property"
                            wrapperClassName="w-full h-full"
                            imageClassName={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                              imageLoading || imageError ? "opacity-0" : "opacity-100"
                            }`}
                            overlayClassName={imageLoading || imageError ? "opacity-0" : ""}
                            variant="default"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                          />
                        )}

                        {galleryUrls.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((prev) =>
                                  prev === 0 ? galleryUrls.length - 1 : prev - 1,
                                );
                              }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((prev) =>
                                  prev === galleryUrls.length - 1 ? 0 : prev + 1,
                                );
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-20"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                          </>
                        )}
                      </div>

                      {galleryUrls.length > 1 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {galleryUrls.map((imageUrl, index) => (
                              <button
                                key={`${imageUrl}-${index}`}
                                type="button"
                                onClick={() => setSelectedImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                  index === selectedImageIndex
                                    ? "border-green-500 ring-2 ring-green-200"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <WatermarkedImage
                                  src={imageUrl}
                                  alt={`Thumbnail ${index + 1}`}
                                  wrapperClassName="w-full h-full"
                                  imageClassName="w-full h-full object-cover"
                                  variant="compact"
                                />
                              </button>
                            ))}
                          </div>
                          <p className="text-center text-sm text-gray-600 mt-2">
                            {selectedImageIndex + 1} of {galleryUrls.length} images
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={handleApplyClick}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-4 rounded-xl font-semibold transition-colors shadow-lg"
                      >
                        {applyLabel}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: price, specs, location, description, amenities */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-1">Price (Per Annum)</p>
                        {pricePerAnnum > 0 ? (
                          <>
                            <h2 className="text-3xl font-bold text-green-700">
                              ₦{pricePerAnnum.toLocaleString()}
                            </h2>
                            {rentParts ? (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-semibold text-[#03442C]">
                                  {rentParts.monthlyLabel}
                                </span>
                                <span className="text-gray-400 mx-2">·</span>
                                <span>{rentParts.yearlyLabel}</span>
                              </p>
                            ) : null}
                          </>
                        ) : (
                          <h2 className="text-xl font-bold text-gray-800">Price on request</h2>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleContactClick}
                        className="shrink-0 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full sm:w-auto"
                      >
                        {contactOwnerLabel}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-center mb-2">
                          <Home className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Style</p>
                        <p className="text-gray-800 font-semibold">
                          {room.apartmentStyle || "—"}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-center mb-2">
                          <Bed className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Bedrooms</p>
                        <p className="text-gray-800 font-semibold">{room.noOfRooms || "—"}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-center mb-2">
                          <Bath className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Bathrooms</p>
                        <p className="text-gray-800 font-semibold">{room.noOfBaths || "—"}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-center mb-2">
                          <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-gray-500 text-xs font-medium mb-1">Unit #</p>
                        <p className="text-gray-800 font-semibold">{unitNumberDisplay}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="md:w-1/3">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                            <p className="text-gray-500 text-sm font-medium">Location</p>
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {displayLocation || "—"}
                          </p>
                          {!isAuthenticated || isTenant ? (
                            <p className="text-xs text-gray-500 mt-2">
                              Full street address is shared by the landlord after verification.
                            </p>
                          ) : null}
                        </div>
                        <div className="md:flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-green-600 shrink-0" />
                            <p className="text-gray-500 text-sm font-medium">Lease terms</p>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {room.leaseTerms || "—"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm font-medium mb-3">Description</p>
                        <p className="text-gray-800 leading-relaxed text-sm">
                          {room.description?.trim() ||
                            "The landlord hasn’t added a detailed description yet."}
                        </p>
                      </div>

                      {room.paymentOption ? (
                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-sm">
                          <p className="text-xs text-gray-500 mb-1">Payment option</p>
                          <p className="font-semibold text-gray-800">{room.paymentOption}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-3 shrink-0" />
                      Apartment Facilities &amp; Amenities
                    </h3>
                    {room.otherAmentities && room.otherAmentities.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {room.otherAmentities.map((amenity, idx) => (
                          <Badge
                            key={`${amenity}-${idx}`}
                            variant="outline"
                            className="text-green-700 border-green-400 bg-green-50 px-4 py-2 text-sm font-medium"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Amenities will appear here when the landlord adds them.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Guests: security notice. Safety + map for everyone (map uses full address when logged in). */}
              <div className="mt-8 space-y-6 max-w-4xl mx-auto lg:max-w-none">
                {!isAuthenticated ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 flex gap-3">
                    <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden />
                    <p className="text-sm text-amber-950 leading-relaxed">
                      For security, the exact address is shared only after identity verification.{" "}
                      <Link
                        href={`/sign-up?redirect=/properties/${listingId}`}
                        className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
                      >
                        Sign up
                      </Link>{" "}
                      or{" "}
                      <Link
                        href={`/sign-in?redirect=/properties/${listingId}`}
                        className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
                      >
                        log in
                      </Link>{" "}
                      to request full property details.
                    </p>
                  </div>
                ) : null}

                <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" aria-hidden />
                  <div className="text-sm text-sky-950 leading-relaxed">
                    <p className="font-semibold text-sky-950 mb-1">Stay safe when renting</p>
                    <p>
                      Never send money before verifying a landlord&apos;s identity. Always inspect
                      the property in person and use NaijaRentVerify to confirm listings.{" "}
                      <Link
                        href="/legal/safety-tips"
                        className="font-semibold text-sky-900 underline underline-offset-2 hover:text-sky-950"
                      >
                        Read our full safety tips.
                      </Link>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 pt-4 pb-2 sm:px-5">
                    <h3 className="text-base font-semibold text-gray-800">Location map</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isAuthenticated && !isTenant
                        ? "Map search uses the full address on file (pin may be approximate)."
                        : "Approximate area based on city and state. Full street address is shared by the landlord when appropriate."}
                    </p>
                  </div>
                  <div className="relative aspect-[16/10] sm:aspect-[2/1] min-h-[220px] bg-gray-100">
                    <iframe
                      title={isAuthenticated && !isTenant ? "Property location map" : "Approximate property location"}
                      src={mapEmbedSrc}
                      className="absolute inset-0 z-0 h-full w-full border-0 grayscale-[0.15]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
                      <div className="pointer-events-auto p-3">
                        <a
                          href={mapsOpenHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open in Maps
                        </a>
                      </div>
                      <div className="flex flex-1 items-start justify-center pt-4 sm:pt-8">
                        <span className="rounded-md bg-gray-900/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg whitespace-nowrap">
                          {isAuthenticated && !isTenant
                            ? "Property location"
                            : "Approximate property location"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                    {isAuthenticated && !isTenant
                      ? "Verify the location in person before paying rent or signing a lease."
                      : "Approximate location (city / area). Street address is shared by the landlord after verification."}
                  </p>
                </div>

                {accountType !== "tenant" && accountType !== "landlord" && (
                  <p className="text-center text-sm text-gray-600 pb-2">
                    Already have an account?{" "}
                    <Link
                      href={`/sign-in?redirect=/properties/${listingId}`}
                      className="font-semibold text-[#03442C] hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
      open={contactOpen}
      onOpenChange={(next) => {
        setContactOpen(next);
        if (!next) {
          setContactOwner(null);
          setContactError(null);
        }
      }}
    >
      <DialogContent className="fixed left-1/2 top-[50%] z-[100] max-h-[85vh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-gray-200 bg-white p-6 shadow-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900">
            <User className="h-5 w-5 text-green-600" />
            Contact owner
          </DialogTitle>
          <DialogDescription className="text-left text-gray-600">
            Reach out using the details below. You can still submit an application from your tenant
            dashboard when you&apos;re ready.
          </DialogDescription>
        </DialogHeader>

        {contactLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
          </div>
        ) : contactError ? (
          <p className="text-sm text-red-600 py-4">{contactError}</p>
        ) : contactOwner ? (
          <div className="space-y-3 py-2">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
              <User className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{contactOwner.name}</p>
              </div>
            </div>
            {contactOwner.email ? (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <Mail className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Email</p>
                  <a
                    href={`mailto:${contactOwner.email}`}
                    className="font-semibold text-[#03442C] hover:underline break-all"
                  >
                    {contactOwner.email}
                  </a>
                </div>
              </div>
            ) : null}
            {contactOwner.phone ? (
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <Phone className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <a
                    href={`tel:${contactOwner.phone}`}
                    className="font-semibold text-gray-900 hover:underline"
                  >
                    {contactOwner.phone}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => setContactOpen(false)}
            className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog
      open={applyOpen}
      onOpenChange={(next) => {
        setApplyOpen(next);
        if (!next) {
          setApplyProperty(null);
          setApplyError(null);
          setApplyUser(null);
        }
      }}
    >
      <DialogContent className="fixed left-1/2 top-[50%] z-[101] flex max-h-[min(90vh,900px)] w-[calc(100vw-1rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-gray-200 bg-gray-50 p-0 shadow-2xl sm:rounded-2xl">
        <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg text-gray-900">Apply for this listing</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Complete your application here — same steps as in your tenant dashboard, without leaving
              this listing.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-4">
          {applyLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600" />
            </div>
          ) : applyError ? (
            <p className="px-2 py-6 text-center text-sm text-red-600">{applyError}</p>
          ) : (
            <TenantPropertyApplicationPanel
              variant="modal"
              property={applyProperty}
              propertyId={listingId ?? ""}
              user={applyUser}
              onBack={() => setApplyOpen(false)}
              onSuccess={() => {
                setApplyOpen(false);
                setApplyProperty(null);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
