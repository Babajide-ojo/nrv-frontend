"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "../../shared/buttons/Button";
import { API_URL } from "@/config/constant";
import PropertyCard from "../../shared/cards/PropertyCard";
import { PublicPropertyDetailsModal } from "@/app/components/property/PublicPropertyDetailsModal";

const CARD_LIMIT = 4;

const FeaturedProperties = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertyModalId, setPropertyModalId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/rooms/all?page=1&limit=${CARD_LIMIT}`);
        const list = Array.isArray(data?.data) ? data.data : [];
        if (!cancelled) setRooms(list.slice(0, CARD_LIMIT));
      } catch {
        if (!cancelled) setRooms([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
          <p className="mt-4 text-white/80 text-sm sm:text-base landing-body">Loading featured properties...</p>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-[#0D3520] flex items-center justify-center p-4 sm:p-5 min-h-[320px]">
        <div className="max-w-[1400px] w-full my-8 sm:my-16 text-white text-center">
          <span className="text-white font-normal rounded-full border border-[#BBFF37] px-3 py-1.5 text-sm">
            FEATURED PROPERTIES
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-4">
            Find Your Ideal Living Space
          </h2>
          <p className="mt-4 text-white/80 text-sm sm:text-base landing-body">
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
      <div className="max-w-7xl w-full my-8 sm:my-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 text-left">
          <div>
            <span className="text-white font-normal rounded-full border border-[#BBFF37] px-3 py-1.5 text-xs sm:text-sm inline-block landing-small">
              FEATURED PROPERTIES
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-3 landing-heading-2">
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

        {/* Same grid + card as /dashboard/tenant/properties (watermark via PropertyCard) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {rooms.map((room: any) => {
            const prop = room?.propertyId || {};
            const address =
              [prop?.city, prop?.state].filter(Boolean).join(", ") || "—";
            return (
              <div
                key={room._id}
                className="cursor-pointer h-full"
                role="button"
                tabIndex={0}
                onClick={() => setPropertyModalId(room._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPropertyModalId(room._id);
                  }
                }}
              >
                <PropertyCard
                  imageUrl={
                    room?.imageUrls?.[0] || room?.file || prop?.file || "/images/featured-img.svg"
                  }
                  address={address}
                  rentAmount={room?.rentAmount}
                  property={room}
                />
              </div>
            );
          })}
        </div>
      </div>

      <PublicPropertyDetailsModal
        roomId={propertyModalId}
        open={propertyModalId !== null}
        onOpenChange={(next) => {
          if (!next) setPropertyModalId(null);
        }}
      />
    </div>
  );
};

export default FeaturedProperties;
