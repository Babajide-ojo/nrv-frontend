"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchShortStayRooms } from "@/lib/shortletApi";
import { getRoomCoverImage } from "@/lib/propertyImages";
import {
  shortStayAddress,
  shortStayGallery,
  shortStayHeadline,
} from "@/lib/shortStay";

const SAMPLE_NIGHTS = 7;

const formatRange = (nights: number) => {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + nights);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const from = start.toLocaleDateString("en-GB", opts);
  const to = end.toLocaleDateString("en-GB", { day: "numeric" });
  return `${from}–${to}`;
};

const isNewListing = (createdAt?: string) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 21 * 24 * 60 * 60 * 1000;
};

const mapQueryFor = (room?: any) => {
  const city = room?.city || room?.propertyId?.city;
  const state = room?.state || room?.propertyId?.state;
  const parts = [city, state, "Nigeria"].filter(Boolean);
  return parts.length ? parts.join(", ") : "Lagos, Nigeria";
};

function ShortStayCard({
  room,
  active,
  onHover,
}: {
  room: any;
  active: boolean;
  onHover: () => void;
}) {
  const [photos, setPhotos] = useState(() => shortStayGallery(room));
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = photos[photoIndex] || getRoomCoverImage(room);

  const skipBrokenPhoto = () => {
    if (!photos.includes(photo)) return;
    setPhotos((current) => current.filter((url) => url !== photo));
    setPhotoIndex(0);
  };
  const nightly = Number(room.pricePerNight || room.rentAmount || 0);
  const minNights = Math.max(1, Number(room.minimumNights) || 1);
  const nights = Math.max(SAMPLE_NIGHTS, minNights);
  const guests =
    Number(room.noOfRooms) > 0
      ? `${Number(room.noOfRooms) === 1 ? "1 bedroom" : `${room.noOfRooms} bedrooms`}`
      : null;
  const favorite = photos.length > 1;
  const fresh = isNewListing(room.createdAt);

  const showPhoto = (event: React.MouseEvent, next: number) => {
    event.preventDefault();
    event.stopPropagation();
    if (!photos.length) return;
    setPhotoIndex((next + photos.length) % photos.length);
  };

  return (
    <Link
      href={`/short-stays/${room._id}`}
      onMouseEnter={onHover}
      className={`group block ${active ? "opacity-100" : ""}`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={photo}
          alt={shortStayHeadline(room)}
          onError={skipBrokenPhoto}
          className="h-[210px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-[230px]"
        />
        {favorite ? (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#222]">
            Guest favorite
          </span>
        ) : null}
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(event) => showPhoto(event, photoIndex - 1)}
              className="absolute left-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm text-[#222] shadow group-hover:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(event) => showPhoto(event, photoIndex + 1)}
              className="absolute right-2 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm text-[#222] shadow group-hover:flex"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {photos.slice(0, 5).map((url, index) => (
                <span
                  key={url}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === photoIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      <div className="mt-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-5 text-[#222]">
            {shortStayHeadline(room)}
          </p>
          {fresh ? (
            <span className="shrink-0 text-[12px] font-medium text-[#222]">
              ★ New
            </span>
          ) : null}
        </div>
        {room.description ? (
          <p className="mt-0.5 line-clamp-1 text-[13px] leading-5 text-[#6A6A6A]">
            {room.description}
          </p>
        ) : (
          <p className="mt-0.5 line-clamp-1 text-[13px] leading-5 text-[#6A6A6A]">
            {shortStayAddress(room) || "Nigeria"}
          </p>
        )}
        {guests ? (
          <p className="text-[13px] leading-5 text-[#6A6A6A]">{guests}</p>
        ) : null}
        <p className="text-[13px] leading-5 text-[#6A6A6A]">
          {formatRange(nights)}
        </p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#222]">
          ₦{(nightly * nights).toLocaleString()}{" "}
          <span className="font-normal">for {nights} nights</span>
        </p>
      </div>
    </Link>
  );
}

export default function ShortStaysBrowse() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchShortStayRooms({ page: 1, limit: 24, search: "" });
        const list = Array.isArray(result?.data) ? result.data : [];
        setRooms(list);
        setTotal(Number(result?.total) || list.length);
        if (list[0]?._id) setActiveId(list[0]._id);
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const activeRoom = useMemo(
    () => rooms.find((room) => room._id === activeId) || rooms[0],
    [rooms, activeId],
  );
  const mapQuery = encodeURIComponent(mapQueryFor(activeRoom));
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&z=11&output=embed`;

  return (
    <section className="min-h-[calc(100vh-6rem)] bg-white">
      <div className="flex items-start">
        <div className="w-full px-6 py-6 sm:px-8 lg:w-[56%] lg:px-12 xl:w-[58%] xl:pl-16 xl:pr-10">
          <p className="text-sm font-semibold text-[#222]">
            {loading ? "Loading stays" : `${total || rooms.length} places`}
          </p>
          {loading ? (
            <p className="mt-8 text-sm text-gray-500">Loading short stays.</p>
          ) : rooms.length === 0 ? (
            <p className="mt-8 text-sm text-gray-500">
              No short stays are listed yet. Check back after an owner lists one
              and an admin approves it.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              {rooms.map((room) => (
                <ShortStayCard
                  key={room._id}
                  room={room}
                  active={room._id === activeId}
                  onHover={() => setActiveId(room._id)}
                />
              ))}
            </div>
          )}
        </div>
        <aside className="hidden shrink-0 lg:block lg:w-[44%] xl:w-[42%]">
          <div className="pointer-events-none fixed top-24 right-6 z-10 h-[calc(100vh-6rem)] w-[calc(44%-1.5rem)] overflow-hidden rounded-tl-2xl sm:right-8 lg:right-10 xl:right-12 xl:w-[calc(42%-3rem)]">
            <iframe
              title="Short stay map"
              src={mapSrc}
              className="h-full w-full border-0"
              loading="lazy"
              tabIndex={-1}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
