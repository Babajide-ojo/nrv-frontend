"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ProtectedRoute from "../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../components/layout/LandLordLayout";
import EmptyState from "../../../components/screens/empty-state/EmptyState";
import Button from "../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getPropertyByUserId,
  getRentedApartmentsForTenant,
} from "../../../../redux/slices/propertySlice";
import CenterModal from "@/app/components/shared/modals/CenterModal";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { FcHome } from "react-icons/fc";
import { LuMapPin } from "react-icons/lu";
import { FaBed, FaBath, FaPaintRoller } from "react-icons/fa";
import { API_URL } from "@/config/constant";

/** Ensure image URL is absolute so it loads from backend/Cloudinary when relative */
function toAbsoluteImageUrl(url: string | null | undefined): string | null {
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
    return (
      <img
        src={src}
        alt={title}
        className={className || "w-full h-full object-cover"}
      />
    );
  }
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-emerald-100 via-green-50 to-white flex items-center justify-center ${
        className || ""
      }`}
    >
      <div className="text-center px-2">
        <div className="mx-auto w-9 h-9 rounded-full bg-emerald-200 text-emerald-800 font-semibold flex items-center justify-center mb-2">
          {(title || "A").charAt(0).toUpperCase()}
        </div>
        <p className="text-[11px] text-emerald-800/80 font-medium">
          Property image
        </p>
      </div>
    </div>
  );
}

const RentedPropertiesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const dispatch = useDispatch();
  const router = useRouter();

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
      page: page,
    };

    try {
      const response = await dispatch(
        getRentedApartmentsForTenant(formData) as any
      ); // Pass page parameter
      setProperties(response?.payload?.data);
      setTotalPages(response?.totalPages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]); // Reload properties when page changes

  const handleNextPage = () => {
    if (page) {
      setIsPageLoading(true);
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setIsPageLoading(true);
      setPage(page - 1);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow border animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {properties?.length < 1 ? (
            <div className="p-8 w-full">
              <div className="w-full h-[60vh] flex justify-center items-center">
                <div className="text-center">
                  <EmptyState />
                  <p className="text-nrvLightGrey m-2">No Rented Apartment yet</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {properties?.map((item: any, index: number) => {
                const room = item?.roomId || item;
                const property = item?.propertyId || item;
                const imageUrl =
                  room?.imageUrls?.[0] ||
                  room?.file ||
                  property?.file ||
                  null;
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
                    className="rounded-xl overflow-hidden shadow border bg-white cursor-pointer hover:shadow-md transition-all"
                    onClick={() => {
                      router.push(
                        `/dashboard/tenant/rented-properties/${property._id}`
                      );
                    }}
                  >
                    <div className="relative h-48">
                      <PropertyImage imageUrl={imageUrl} title={title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                        <h3 className="text-white text-lg font-semibold line-clamp-1">{title}</h3>
                        <p className="text-white text-sm flex items-center gap-1 line-clamp-1">
                          <LuMapPin className="shrink-0" /> {address}
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
                      <div className="flex justify-between text-xs text-[#03442C] mt-2 p-3 bg-[#ECECEE] rounded-lg">
                        <div>
                          <p className="font-medium text-[9px] text-gray-500 uppercase tracking-wider">BEDROOM</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <FaBed className="text-gray-400" />
                            <p className="text-xs font-semibold">{beds}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-[9px] text-gray-500 uppercase tracking-wider">BATHROOM</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <FaBath className="text-gray-400" />
                            <p className="text-xs font-semibold">{baths}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-[9px] text-gray-500 uppercase tracking-wider">STYLE</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <FaPaintRoller className="text-gray-400" />
                            <p className="text-xs font-semibold line-clamp-1">{style}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentedPropertiesScreen;
