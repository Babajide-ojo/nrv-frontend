"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getTenantMetrics, getRentedApartmentsForTenant, getAllPropertyForTenant } from "@/redux/slices/propertySlice";
import { FcComboChart, FcHome, FcParallelTasks } from "react-icons/fc";
import { FaBed, FaPaintRoller, FaBath } from "react-icons/fa";
import InputField from "../../shared/input-fields/InputFields";
import House from "../../icons/House";
import Notes from "../../icons/Notes";
import Users from "../../icons/Users";
import { BiShapeSquare } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994";

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
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold">My Rented Apartments</h2>

      <div className="flex justify-between items-start gap-4">
        <div className="w-1/2">
          <InputField
            name="search"
            inputType="text"
            placeholder="Search anything or type a command"
            css="px-3 rounded-md border border-gray-300 text-[14px] h-[36px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="border border-gray-200 rounded-lg text-[#67667A]  px-4 h-[36px] text-[14px] font-medium flex gap-1 items-center">
          <IoFilter />
          Advanced Filter
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
        <div className="rounded-xl border bg-gray-50 p-8 text-center text-gray-500">
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
              DEFAULT_IMAGE;
            const title = room?.name || "Apartment";
            const address =
              property?.streetAddress ||
              [property?.city, property?.state].filter(Boolean).join(", ") ||
              "—";
            const rent = room?.rentAmount;
            const beds = room?.noOfRooms ?? "—";
            const baths = room?.noOfBaths ?? "—";
            const style = room?.apartmentStyle ?? "—";

            return (
              <div
                key={item._id ?? index}
                className="rounded-xl overflow-hidden shadow border"
              >
                <div className="relative h-58">
                  <img
                    src={imageUrl}
                    alt="Apartment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white text-lg font-semibold">{title}</h3>
                    <p className="text-white text-sm flex items-center gap-1">
                      <LuMapPin /> {address}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <p className="text-[#03442C] font-semibold text-base">
                    {rent != null ? `₦${Number(rent).toLocaleString()}` : "—"}{" "}
                    <span className="text-gray-500 text-sm">/ Per Annum</span>
                  </p>
                  <p className="text-gray-500 text-[12px] font-light -mt-2">
                    View details and manage your tenancy.
                  </p>
                  <div className="flex justify-between text-xs text-[#03442C] mt-2 p-3 bg-[#ECECEE]">
                    <div>
                      <p className="font-medium text-[8px]">Bedroom</p>
                      <div className="flex items-center gap-1">
                        <FaBed />
                        <p className="text-[10px] font-medium">{beds}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-[8px]">Bathroom</p>
                      <div className="flex items-center gap-1">
                        <FaBath />
                        <p className="text-[10px] font-medium">{baths}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-[8px]">Style</p>
                      <div className="flex items-center gap-1">
                        <FaPaintRoller />
                        <p className="text-[10px] font-medium">{style}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Explore more Properties</h3>
          <button
            type="button"
            onClick={() => router.push("/dashboard/tenant/properties")}
            className="text-green-600 text-sm font-medium hover:underline"
          >
            See all
          </button>
        </div>
        {exploreLoading ? (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[340px] max-w-[340px] h-[100px] rounded-xl border shadow p-2 flex items-center bg-white animate-pulse"
              >
                <div className="h-[83px] w-[83px] min-w-[83px] rounded-md bg-gray-200" />
                <div className="ml-3 flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !exploreProperties?.length ? (
          <p className="text-gray-500 text-sm py-4">No properties available to explore right now.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {exploreProperties.map((room: any, index: number) => {
              const imageUrl =
                room?.imageUrls?.[0] || room?.file || DEFAULT_IMAGE;
              const title = room?.name || "Apartment";
              const property = room?.propertyId;
              const location =
                property?.streetAddress ||
                [property?.city, property?.state].filter(Boolean).join(", ") ||
                "—";
              const rent = room?.rentAmount;
              return (
                <div
                  key={room._id ?? index}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/dashboard/tenant/properties?room=${room._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/dashboard/tenant/properties?room=${room._id}`);
                    }
                  }}
                  className="min-w-[340px] max-w-[340px] h-[100px] rounded-xl border shadow p-2 flex items-center bg-white hover:border-green-600/50 transition-colors cursor-pointer"
                >
                  <div className="relative h-[83px] w-[83px] min-w-[83px] rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 w-full space-y-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#263245] truncate">
                      {title}
                    </p>
                    <p className="text-[10px] font-light text-[#737D8C] flex items-center gap-1 truncate">
                      <LuMapPin /> {location}
                    </p>
                    <p className="text-[#263245] text-[14px] font-semibold">
                      {rent != null ? `₦${Number(rent).toLocaleString()}` : "—"} /{" "}
                      <span className="text-[10px] font-normal">Per Annum</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const TenantDashboardCard = ({ user }: { user: any }) => {
  return (
    <div className="max-w-md mx-auto p-4 pt-0 space-y-6">
      {/* Date Range Filter */}
      {/* <div className="flex gap-2 flex-wrap">
        {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Custom"].map(
          (label, i) => (
            <button
              key={i}
              className={`px-4 py-1 rounded-full text-sm border ${
                label === "Today"
                  ? "bg-green-800 text-white"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div> */}

      {/* Profile Card */}
      <div className="rounded-xl border shadow overflow-hidden">
        <div className="h-28 relative bg-[url('/images/user-bg.png')] bg-cover bg-center bg-no-repeat">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            className="absolute -bottom-6 left-4 w-16 h-16 rounded-full ring-4 ring-white object-cover"
            alt="Profile"
          />
        </div>
        <div className="pt-8 px-4 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
            {/* <a href="#" className="text-green-600 text-sm font-medium">
              Upgrade Account →
            </a> */}
          </div>
          {/* <div className="mt-2 text-sm">
            <span className="text-gray-600">Account Level: </span>
            <span className="bg-lime-200 text-lime-800 px-2 py-0.5 rounded-full text-xs font-medium">
              Tier 2
            </span>
          </div> */}
        </div>
      </div>

      {/* Setup Progress */}
      {/* <div className="bg-green-50 p-4 rounded-xl border flex justify-between items-center">
        <div>
          <p className="font-medium text-sm">Complete your Account Setup</p>
          <p className="text-sm text-gray-600 mt-1">
            Tell us more about yourself and what you&#39;re looking for to get
            personalized recommendations.
          </p>
          <a
            href="#"
            className="text-green-700 mt-2 inline-block text-sm font-medium"
          >
            Update Account Now →
          </a>
        </div>
      </div> */}

    </div>
  );
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
      imageLink: <FcHome color="#004B95" size={35} />,
      title: "Apartments",
      number: count?.totalRentedApartments ?? count?.totalNew ?? 0,
      link: "/dashboard/tenant/rented-properties",
      icon: <House className="w-[20px] h-[20px]" />,
    },
    {
      imageLink: <FcComboChart color="#004B95" size={35} />,
      title: "Applications",
      number: (count?.totalNew ?? 0) + (count?.totalAccepted ?? 0),
      link: "/dashboard/tenant/properties/applications",
      icon: <Notes className="w-[20px] h-[20px]" />,
    },
    {
      imageLink: <FcParallelTasks color="#004B95" size={35} />,
      title: "Maintenance",
      number: count?.totalActiveTenants ?? 0,
      link: "/dashboard/tenant/properties/maintenance",
      icon: <Users className="w-[20px] h-[20px]" />,
    },
  ];
  return (
    <div className="md:p-8 p-3 mb-16 md:mb-0">
      <p className="text-2xl font-semibold text-swGray800 flex gap-2">
        Hey {user?.firstName} {user?.lastName}👋,
      </p>
      <p className="mt-2 mb-8 text-[0.86rem] font-light mx-auto">
        <span className="">
          Welcome to your dashboard, but let’s get you started.
        </span>
      </p>
      <div className="">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {tenantDashboardMetrics.map(
                  ({ title, imageLink, number, link, icon }, index) => (
                    <div
                      className={`p-3 border bg-white flex items-start justify-between ${
                        index === 0 &&
                        "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none lg:rounded-bl-lg"
                      }
                      ${
                        index === 1 &&
                        "sm:rounded-tr-lg sm:rounded-br-lg lg:rounded-tr-none lg:rounded-br-none"
                      }
                      ${
                        index === 2 &&
                        "rounded-bl-lg rounded-br-lg lg:rounded-bl-none lg:rounded-tr-lg l:rounded-br-lg "
                      }`}
                      key={index}
                    >
                      <div>
                        <p className="text-[#767484] text-sm">{title}</p>
                        <p className="text-3xl font-semibold my-6">
                          {number ?? 0}
                        </p>
                        {/* <div className="flex items-center gap-2 mt-2 text-xs text-[#8D8B99]">
                          <FaChartLine
                            className="bg-green-100 p-1 rounded text-green-600"
                            size={18}
                          />
                        </div> */}
                      </div>
                      <div
                        className={`flex items-center justify-center rounded-full h-[40px] w-[40px] ${
                          index === 0
                            ? "bg-[#429634]"
                            : index === 1
                            ? "bg-[#4F81E5]"
                            : "bg-[#F4BE50]"
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
            <div className="w-full md:w-1/3">
              <TenantDashboardCard user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardScreen;
