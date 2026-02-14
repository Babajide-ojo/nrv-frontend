import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "../../shared/buttons/Button";
import { API_URL } from "@/config/constant";

const defaultImage = "/images/featured-img.svg";

function mapRoomToProperty(room: any) {
  const prop = room?.propertyId || {};
  const address = [prop.streetAddress, prop.city, prop.state].filter(Boolean).join(", ") || "Address not specified";
  return {
    id: room._id,
    type: room.apartmentType || "Apartment",
    price: room.rentAmount != null ? `₦${Number(room.rentAmount).toLocaleString()}` : "—",
    location: address,
    description: room.description || "Listed property. Contact for details.",
    image: room.imageUrls?.[0] || room.file || prop.file || defaultImage,
    features: {
      bedrooms: room.noOfRooms ? `${room.noOfRooms} bed` : "—",
      bathrooms: room.noOfBaths ? `${room.noOfBaths} room` : "—",
      style: room.apartmentStyle || "—",
    },
  };
}

const CARD_LIMIT = 4;

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<ReturnType<typeof mapRoomToProperty>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/rooms/all?page=1&limit=${CARD_LIMIT}`);
        const list = Array.isArray(data?.data) ? data.data : [];
        const mapped = list.slice(0, CARD_LIMIT).map(mapRoomToProperty);
        if (!cancelled) setProperties(mapped);
      } catch {
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0D3520] flex items-center justify-center p-4 sm:p-5 min-h-[320px]">
        <div className="max-w-[1400px] w-full my-8 sm:my-16 text-white text-center">
          <span className="text-white font-normal rounded-full border border-[#BBFF37] px-3 py-1.5 text-sm">
            FEATURED PROPERTIES
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4">
            Find Your Ideal Living Space
          </h2>
          <p className="mt-4 text-white/80 text-sm sm:text-base">Loading featured properties...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-[#0D3520] flex items-center justify-center p-4 sm:p-5 min-h-[320px]">
        <div className="max-w-[1400px] w-full my-8 sm:my-16 text-white text-center">
          <span className="text-white font-normal rounded-full border border-[#BBFF37] px-3 py-1.5 text-sm">
            FEATURED PROPERTIES
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4">
            Find Your Ideal Living Space
          </h2>
          <p className="mt-4 text-white/80 text-sm sm:text-base">
            No listed properties at the moment. Check back later.
          </p>
          <Link href="/sign-up">
            <Button variant="lemonPrimary" className="mt-4" size="large">
              Explore Our Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D3520] flex items-center justify-center p-4 sm:p-5 overflow-hidden">
      <div className="max-w-[1400px] w-full my-8 sm:my-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <span className="text-white font-normal rounded-full border border-[#BBFF37] px-3 py-1.5 text-xs sm:text-sm inline-block">
              FEATURED PROPERTIES
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-3">
              Find Your Ideal Living Space
            </h2>
          </div>
          <Link href="/sign-up" className="shrink-0">
            <Button
              variant="lemonPrimary"
              className="w-full sm:w-auto text-sm sm:text-base"
              size="large"
            >
              Explore Our Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/dashboard/tenant/properties/${property.id}`}
              className="group block rounded-2xl border border-[#E9F4E74D] overflow-hidden bg-[#0D3520] hover:border-[#BBFF37]/50 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={property.image}
                  alt={property.type}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#0D3520]/90 text-[#BBFF37] text-xs font-medium px-2.5 py-1">
                  {property.type}
                </span>
              </div>
              <div className="p-4 sm:p-5 text-white">
                <p className="text-lime-400 text-lg sm:text-xl font-bold">
                  {property.price}
                  <span className="text-sm font-light text-white/90"> / year</span>
                </p>
                <p className="flex items-start gap-1.5 mt-2 text-white/90 text-sm min-h-[2.5rem] line-clamp-2">
                  <MapPin size={14} color="#BBFF37" className="mt-0.5 shrink-0" />
                  {property.location}
                </p>
                <p className="mt-2 text-white/80 text-xs sm:text-sm font-light line-clamp-2">
                  {property.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#E9F4E7]">
                  <span className="flex items-center gap-1">
                    <Bed size={12} /> {property.features.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={12} /> {property.features.bathrooms}
                  </span>
                  {property.features.style !== "—" && (
                    <span className="flex items-center gap-1">
                      <Ruler size={12} /> {property.features.style}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
