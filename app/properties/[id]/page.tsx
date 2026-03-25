"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { API_URL } from "@/config/constant";
import { ArrowLeft, Bed, Bath, Building, Home, MapPin } from "lucide-react";
import WatermarkedImage from "@/app/components/shared/WatermarkedImage";

type RoomResponse = {
  _id: string;
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
    formatted = formatted.replace(/^(?:no\.?\s+|plot\s+|block\s+)?\d+[a-zA-Z]?\s*,?\s*/i, '');
  }
  return formatted.trim() || addr;
};

export default function PublicPropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id || typeof id !== "string") {
          setRoom(null);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/rooms/single/${id}`);
        const json = await res.json();
        setRoom((json?.data as RoomResponse) ?? null);
      } catch {
        setError("Unable to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const title = useMemo(() => {
    if (!room) return "Property details";
    return (
      room.description ||
      [room.apartmentType, room.apartmentStyle].filter(Boolean).join(" • ") ||
      "Property details"
    );
  }, [room]);

  const address = useMemo(() => {
    if (!room?.propertyId) return "";
    const rawAddress = [
      room.propertyId.streetAddress,
      room.propertyId.city,
      room.propertyId.state,
    ]
      .filter(Boolean)
      .join(", ");
    return formatAddress(rawAddress);
  }, [room]);

  const rentText = useMemo(() => {
    const rent = room?.rentAmount ?? 0;
    if (!rent || rent <= 0) return "Price on request";
    const suffix = room?.rentAmountMetrics ? ` / ${room.rentAmountMetrics}` : "";
    return `₦${rent.toLocaleString()}${suffix}`;
  }, [room]);

  const mainImage = useMemo(() => {
    if (!room) return null;
    return (
      toAbsoluteImageUrl(room.imageUrls?.[0]) ||
      toAbsoluteImageUrl(room.file) ||
      toAbsoluteImageUrl(room.propertyId?.file) ||
      null
    );
  }, [room]);

  return (
    <HomePageLayout>
      <div className="bg-[#F5F5F4] text-[#031B14]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-[#03442C]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm">
              <div className="animate-pulse space-y-4">
                <div className="h-64 sm:h-80 rounded-xl bg-gray-200" />
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-20 bg-gray-50 rounded" />
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <WatermarkedImage
                      src={
                        mainImage ||
                        "/images/featured-img.svg"
                      }
                      alt={title}
                      wrapperClassName="w-full h-full"
                      imageClassName="object-cover w-full h-full"
                    />
                  </div>
                </div>

                <aside className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold text-[#031B14] mb-1">
                      {title}
                    </h1>
                    {address && (
                      <p className="flex items-start text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-gray-500 shrink-0" />
                        <span>{address}</span>
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-1">
                    <p className="text-xl font-bold text-[#03442C]">{rentText}</p>
                    <p className="text-xs text-emerald-800">
                      Pricing and availability subject to confirmation by the landlord.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-[#03442C]" />
                      <div>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="font-semibold text-gray-800">
                          {room.noOfRooms || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-[#03442C]" />
                      <div>
                        <p className="text-xs text-gray-500">Bathrooms</p>
                        <p className="font-semibold text-gray-800">
                          {room.noOfBaths || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#03442C]" />
                      <div>
                        <p className="text-xs text-gray-500">Style</p>
                        <p className="font-semibold text-gray-800">
                          {room.apartmentStyle || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#03442C]" />
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-800">
                          {room.apartmentType || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const raw = localStorage.getItem("nrv-user");
                        if (raw) {
                          const parsed = JSON.parse(raw) as any;
                          const accountType = String(parsed?.user?.accountType || "")
                            .toLowerCase();

                          if (accountType === "tenant") {
                            router.push(`/dashboard/tenant/properties/${room._id}`);
                            return;
                          }

                          if (accountType === "landlord") {
                            router.push(`/dashboard/landlord`);
                            return;
                          }

                          router.push(`/`);
                          return;
                        }
                      } catch {
                        // Fall back to sign-in redirect.
                      }

                      router.push(`/sign-in?redirect=/properties/${room._id}`);
                    }}
                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#03442C] text-white text-sm font-semibold hover:bg-[#022419] transition-colors"
                  >
                    Contact landlord / Apply
                  </button>
                  <p className="text-[11px] text-gray-500 text-center">
                    You&apos;ll be asked to sign in or create an account before sending an application or message.
                  </p>
                </aside>
              </div>

              <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
                  <h2 className="text-base font-semibold text-[#031B14]">
                    About this property
                  </h2>
                  {room.description ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {room.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      The landlord hasn&apos;t added a detailed description yet.
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {room.leaseTerms && (
                      <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                        <p className="text-xs text-gray-500 mb-1">Lease terms</p>
                        <p className="font-semibold text-gray-800">
                          {room.leaseTerms}
                        </p>
                      </div>
                    )}
                    {room.paymentOption && (
                      <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                        <p className="text-xs text-gray-500 mb-1">Payment option</p>
                        <p className="font-semibold text-gray-800">
                          {room.paymentOption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-[#031B14]">
                    Amenities
                  </h3>
                  {room.otherAmentities && room.otherAmentities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {room.otherAmentities.map((item, idx) => (
                        <span
                          key={`${item}-${idx}`}
                          className="px-3 py-1.5 rounded-full bg-emerald-50 text-xs font-medium text-[#03442C] border border-emerald-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Amenities will be shown here when the landlord adds them.
                    </p>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </HomePageLayout>
  );
}

