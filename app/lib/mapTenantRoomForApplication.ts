import { API_URL } from "@/config/constant";

function toAbsoluteImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}

export type TenantPropertyApplicationView = {
  title: string;
  apartmentType?: string;
  apartmentName?: string;
  apartmentStyle?: string;
  address: string;
  price?: number;
  rentAmountMetrics?: string;
  paymentOption?: string;
  flatNumber?: string | number;
  hasApplied: boolean;
  owner: {
    name: string;
    email?: string;
    phoneNumber?: string;
    id?: string;
    reviews: null;
    imageUrl: string;
  };
};

export function mapTenantRoomForApplication(
  raw: any,
  hasApplied: boolean
): TenantPropertyApplicationView | null {
  if (!raw) return null;
  const apt = raw?.apartmentType;
  const createdBy = raw?.propertyId?.createdBy;
  const title =
    [apt, raw?.apartmentStyle].filter(Boolean).join(" • ").trim() || "Listing";
  return {
    title,
    apartmentType: apt,
    apartmentName: apt,
    apartmentStyle: raw?.apartmentStyle,
    address:
      [raw?.propertyId?.city, raw?.propertyId?.state].filter(Boolean).join(", ") || "—",
    price: raw?.rentAmount,
    rentAmountMetrics: raw?.rentAmountMetrics,
    paymentOption: raw?.paymentOption,
    flatNumber: raw?.roomId,
    hasApplied,
    owner: {
      name: `${createdBy?.firstName ?? ""} ${createdBy?.lastName ?? ""}`.trim() || "Owner",
      email: createdBy?.email,
      phoneNumber: createdBy?.phoneNumber,
      id: createdBy?._id,
      reviews: null,
      imageUrl: "/owner.jpg",
    },
  };
}

export function mapTenantRoomImageUrls(raw: any): string[] {
  if (!raw) return [];
  const fromArray = Array.isArray(raw?.imageUrls)
    ? raw.imageUrls.map((u: string) => toAbsoluteImageUrl(u)).filter(Boolean)
    : [];
  if (fromArray.length > 0) return fromArray as string[];
  return [raw?.file].map((u) => toAbsoluteImageUrl(u)).filter(Boolean) as string[];
}
