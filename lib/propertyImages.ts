const DEFAULT_LISTING_IMAGE = "/images/featured-img.svg";

export const getRoomCoverImage = (
  room?: {
    file?: string | null;
    imageUrls?: string[] | null;
    propertyId?: { file?: string | null } | string | null;
  } | null,
  fallback = DEFAULT_LISTING_IMAGE,
): string => {
  if (!room) {
    return fallback;
  }
  if (typeof room.file === "string" && room.file.trim()) {
    return room.file.trim();
  }
  const listing =
    room.propertyId && typeof room.propertyId === "object"
      ? room.propertyId
      : null;
  if (listing?.file && String(listing.file).trim()) {
    return String(listing.file).trim();
  }
  const firstGallery = room.imageUrls?.find(
    (url) => typeof url === "string" && url.trim().length > 0,
  );
  if (firstGallery) {
    return firstGallery;
  }
  return fallback;
};

export const getPropertyCoverImage = (
  property?: {
    file?: string | null;
    imageUrls?: string[] | null;
  } | null,
  fallback = DEFAULT_LISTING_IMAGE,
): string => {
  if (!property) {
    return fallback;
  }
  if (typeof property.file === "string" && property.file.trim()) {
    return property.file.trim();
  }
  const firstGallery = property.imageUrls?.find(
    (url) => typeof url === "string" && url.trim().length > 0,
  );
  if (firstGallery) {
    return firstGallery;
  }
  return fallback;
};
