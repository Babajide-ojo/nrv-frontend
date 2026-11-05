export const SHORT_STAY_LEASE = "Short stay";

export const shortStayAddress = (room?: {
  streetAddress?: string;
  city?: string;
  state?: string;
  propertyId?: {
    streetAddress?: string;
    city?: string;
    state?: string;
  };
} | null) =>
  [
    room?.streetAddress || room?.propertyId?.streetAddress,
    room?.city || room?.propertyId?.city,
    room?.state || room?.propertyId?.state,
  ]
    .filter(Boolean)
    .join(", ");

export const shortStayTitle = (room?: {
  apartmentType?: string;
  description?: string;
} | null) => {
  if (room?.apartmentType) return room.apartmentType;
  const firstLine = String(room?.description || "")
    .split(/[.!\n]/)[0]
    .trim();
  if (firstLine.length > 48) return `${firstLine.slice(0, 45)}...`;
  return firstLine || "Short stay";
};

export const shortStayHeadline = (room?: {
  apartmentType?: string;
  city?: string;
  propertyId?: { city?: string };
  description?: string;
} | null) => {
  const type = room?.apartmentType || "Stay";
  const city = room?.city || room?.propertyId?.city;
  if (city) return `${type} in ${city}`;
  return shortStayTitle(room);
};

export const shortStayGallery = (room?: {
  file?: string | null;
  imageUrls?: string[] | null;
} | null) => {
  const urls = [
    typeof room?.file === "string" ? room.file : "",
    ...(Array.isArray(room?.imageUrls) ? room.imageUrls : []),
  ]
    .map((url) => String(url || "").trim())
    .filter(Boolean);
  return Array.from(new Set(urls));
};

export const isShortStay = (leaseTerms?: string, stayType?: string) => {
  const stay = String(stayType || "").trim().toLowerCase();
  const lease = String(leaseTerms || "").trim().toLowerCase();
  return stay === "short_stay" || lease === "short stay";
};

export const LONG_LET_LEASE_OPTIONS = [
  { label: "1-Year Lease, Renewable", value: "1-Year Lease, Renewable" },
  { label: "6 Months Lease", value: "6 Months Lease" },
];

export const LEASE_TERM_OPTIONS = [
  ...LONG_LET_LEASE_OPTIONS,
  { label: SHORT_STAY_LEASE, value: SHORT_STAY_LEASE },
];
