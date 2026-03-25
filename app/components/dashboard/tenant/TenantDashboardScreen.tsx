"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getTenantMetrics, getRentedApartmentsForTenant, getAllPropertyForTenant } from "@/redux/slices/propertySlice";
import { FaBed, FaPaintRoller, FaBath } from "react-icons/fa";
import House from "../../icons/House";
import Notes from "../../icons/Notes";
import Users from "../../icons/Users";
import { LuMapPin } from "react-icons/lu";
import { API_URL } from "@/config/constant";
import PropertyCard from "@/app/components/shared/cards/PropertyCard";

function getRoomFromItem(item: any) {
  const room = item?.propertyId;
  if (!room) return null;
  return room;
}

function getPropertyFromItem(item: any) {
  const room = item?.propertyId;
  const prop = room?.propertyId ?? room?.property;
  return prop;
}

function toAbsoluteImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string" || !url.trim()) return null;
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}

function PropertyImage({
  imageUrl,
  title,
  className = "",
}: {
  imageUrl?: string | null;
  title: string;
  className?: string;
}) {
  const src = toAbsoluteImageUrl(imageUrl);

  if (src) {
    return <img src={src} alt={title} className={className || "w-full h-full object-cover"} />;
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-emerald-100 via-green-50 to-white flex items-center justify-center ${className}`}>
      <div className="text-center px-2">
        <div className="mx-auto w-9 h-9 rounded-full bg-emerald-200 text-emerald-800 font-semibold flex items-center justify-center mb-2">
          {(title || "A").charAt(0).toUpperCase()}
        </div>
        <p className="text-[11px] text-emerald-800/80 font-medium">Property image</p>
      </div>
    </div>
  );
}

const RentedApartments = ({
  apartments = [],
  loading = false,
  exploreProperties = [],
  exploreLoading = false,
}: {
  apartments?: any[];
  loading?: boolean;
  exploreProperties?: any[];
  exploreLoading?: boolean;
}) => {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Properties</h2>
          <button
            type="button"
            onClick={() => router.push("/dashboard/tenant/properties")}
            className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
          >
            View all properties
          </button>
        </div>

        {exploreLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-3 animate-pulse">
                <div className="h-40 rounded-lg bg-gray-200 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !exploreProperties?.length ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-700">No properties available to explore right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {exploreProperties.slice(0, 6).map((room: any, index: number) => {
              const imageUrl = room?.imageUrls?.[0] || room?.file || room?.propertyId?.file || null;
              const title = room?.name || room?.description || "Apartment";
              const property = room?.propertyId;
              const location = formatAddress(
                property?.streetAddress ||
                [property?.city, property?.state].filter(Boolean).join(", ") ||
                "—"
              );
              const rent = room?.rentAmount;
              return (
                <div
                  key={room._id ?? index}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/dashboard/tenant/properties/${room._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/dashboard/tenant/properties/${room._id}`);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <PropertyCard
                    imageUrl={imageUrl || ""}
                    address={location}
                    rentAmount={rent}
                    property={room}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Rented Apartments</h2>
          <button
            type="button"
            onClick={() => router.push("/dashboard/tenant/rented-properties")}
            className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline"
          >
            View all rented
          </button>
        </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow border animate-pulse">
              <div className="h-58 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !apartments?.length ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          <p className="font-medium">No rented apartments yet</p>
          <p className="text-sm mt-1">Your active leases will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apartments.map((item: any, index: number) => {
            const room = getRoomFromItem(item);
            const property = getPropertyFromItem(item);
            const imageUrl =
              room?.imageUrls?.[0] ||
              room?.file ||
              property?.file ||
              null;
            const title = room?.name || "Apartment";
            const address = formatAddress(
              property?.streetAddress ||
              [property?.city, property?.state].filter(Boolean).join(", ") ||
              "—"
            );
            const rent = room?.rentAmount;
            const beds = room?.noOfRooms ?? "—";
            const baths = room?.noOfBaths ?? "—";
            const style = room?.apartmentStyle ?? "—";

            return (
              <div
                key={item._id ?? index}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/tenant/rented-properties/${property?._id}`)}
              >
                <PropertyCard
                  imageUrl={imageUrl || ""}
                  address={address}
                  rentAmount={rent}
                  property={room}
                />
              </div>
            );
          })}
        </div>
      )}
      </section>
    </div>
  );
};

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

const TenantDashboardScreen = () => {
  const [user, setUser] = useState<any>({});
  const [count, setCount] = useState<any>({});
  const [rentedApartments, setRentedApartments] = useState<any[]>([]);
  const [rentedLoading, setRentedLoading] = useState(false);
  const [exploreProperties, setExploreProperties] = useState<any[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("nrv-user") as any);
    const u = stored?.user;
    setUser(u);
    const id = u?._id;
    if (!id) return;
    (async () => {
      try {
        const metricsResult = await dispatch(getTenantMetrics({ id }) as any);
        const data = metricsResult?.payload?.data;
        if (data) setCount(data);
      } catch (_) {}
    })();
    setRentedLoading(true);
    dispatch(getRentedApartmentsForTenant({ id }) as any)
      .then((res: any) => {
        const list = res?.payload?.data ?? [];
        setRentedApartments(Array.isArray(list) ? list : []);
      })
      .catch(() => setRentedApartments([]))
      .finally(() => setRentedLoading(false));

    setExploreLoading(true);
    dispatch(getAllPropertyForTenant({ page: 1, limit: 8 }) as any)
      .then((res: any) => {
        const list = res?.payload?.data ?? [];
        setExploreProperties(Array.isArray(list) ? list : []);
      })
      .catch(() => setExploreProperties([]))
      .finally(() => setExploreLoading(false));
  }, [dispatch]);

  const tenantDashboardMetrics = [
    {
      title: "Apartments",
      number: count?.totalRentedApartments ?? count?.totalNew ?? 0,
      icon: <House className="w-[20px] h-[20px]" />,
      link: "/dashboard/tenant/rented-properties",
    },
    {
      title: "Applications",
      number: (count?.totalNew ?? 0) + (count?.totalAccepted ?? 0),
      icon: <Notes className="w-[20px] h-[20px]" />,
      link: "/dashboard/tenant/applications",
    },
    {
      title: "Maintenance",
      number: count?.totalActiveTenants ?? 0,
      icon: <Users className="w-[20px] h-[20px]" />,
      link: "/dashboard/tenant/properties/maintenance",
    },
  ];
  return (
    <div className="p-4 sm:p-6 lg:p-8 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} {user?.lastName}👋,
      </p>
      <p className="mt-2 mb-8 text-sm text-gray-600">
        Welcome back. Track your rented units and discover available homes from here.
      </p>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {tenantDashboardMetrics.map(
            ({ title, number, icon, link }, index) => (
              <div
                className="p-5 rounded-2xl border border-gray-200 bg-white flex items-start justify-between shadow-sm cursor-pointer hover:shadow-md hover:border-green-300 transition-all"
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => link && router.push(link)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && link) {
                    e.preventDefault();
                    router.push(link);
                  }
                }}
              >
                <div>
                  <p className="text-gray-500 text-sm font-medium">{title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {number ?? 0}
                  </p>
                </div>
                <div
                  className={`flex items-center justify-center rounded-full h-12 w-12 ${
                    index === 0
                      ? "bg-green-100 text-green-700"
                      : index === 1
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {icon}
                </div>
              </div>
            )
          )}
        </div>
        <RentedApartments
          apartments={rentedApartments}
          loading={rentedLoading}
          exploreProperties={exploreProperties}
          exploreLoading={exploreLoading}
        />
      </div>
    </div>
  );
};

export default TenantDashboardScreen;
