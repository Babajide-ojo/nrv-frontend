"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import Button from "@/app/components/shared/buttons/Button";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { toast } from "react-toastify";
import {
  acceptShortStayBooking,
  declineShortStayBooking,
  fetchMyShortStayBookings,
  fetchOwnerShortStayListings,
} from "@/lib/shortletApi";
import { getRoomCoverImage } from "@/lib/propertyImages";
import { shortStayAddress, shortStayTitle } from "@/lib/shortStay";
import { formatDateToWords } from "@/helpers/utils";

const listingLabel = (room: any) => {
  if (room?.approved && room?.listRoom) {
    return { text: "Listed", className: "bg-[#E7F6EC] text-[#099137]" };
  }
  if (room?.approvalRequested) {
    return { text: "Awaiting approval", className: "bg-[#FFF4E6] text-[#B54708]" };
  }
  return { text: "Unlisted", className: "bg-gray-100 text-[#475467]" };
};

const bookingLabel = (status: string) => {
  const value = String(status || "").replace("_", " ");
  if (status === "confirmed") {
    return { text: "Confirmed", className: "bg-[#E7F6EC] text-[#099137]" };
  }
  if (status === "requested") {
    return { text: "Requested", className: "bg-[#FFF4E6] text-[#B54708]" };
  }
  if (status === "pending_payment") {
    return { text: "Awaiting payment", className: "bg-[#E7F2EA] text-[#03442C]" };
  }
  if (status === "declined" || status === "expired" || status === "cancelled") {
    return { text: value, className: "bg-red-50 text-red-700" };
  }
  return { text: value || "Unknown", className: "bg-gray-100 text-[#475467]" };
};

const LandlordShortStaysPage = () => {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const [ownerListings, ownerBookings] = await Promise.all([
        fetchOwnerShortStayListings(),
        fetchMyShortStayBookings("owner"),
      ]);
      setListings(Array.isArray(ownerListings) ? ownerListings : []);
      setBookings(Array.isArray(ownerBookings) ? ownerBookings : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not load short stays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = useMemo(() => {
    const listed = listings.filter((room) => room?.approved && room?.listRoom).length;
    const pending = listings.filter(
      (room) => room?.approvalRequested && !(room?.approved && room?.listRoom),
    ).length;
    const openRequests = bookings.filter((item) => item.status === "requested").length;
    return { listed, pending, openRequests, total: listings.length };
  }, [listings, bookings]);

  const handleAccept = async (id: string) => {
    try {
      setActingId(id);
      await acceptShortStayBooking(id);
      toast.success("Request accepted. The guest can pay now.");
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not accept.");
    } finally {
      setActingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setActingId(id);
      await declineShortStayBooking(id);
      toast.success("Request declined.");
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not decline.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <LandLordLayout mainPath="Short stays" subMainPath="Manage shortlets">
        <div className="w-full min-w-0 max-w-full px-3 py-4 font-jakarta sm:p-6">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#101828]">
                View & Manage Your Shortlets
              </h2>
              <p className="mt-2 text-sm font-light text-[#475467]">
                List stays by address, then accept or decline booking requests.
                A stay is confirmed only after payment.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                variant="light"
                className="flex w-full items-center justify-center rounded-md px-6 py-2 sm:w-auto"
                onClick={() => void load()}
              >
                Refresh
              </Button>
              <Button
                variant="darkPrimary"
                className="w-full rounded-md px-6 py-2 sm:w-auto"
                onClick={() =>
                  router.push("/dashboard/landlord/short-stays/create")
                }
              >
                + Add Shortlet
              </Button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-300 text-center sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total shortlets", value: String(stats.total) },
              { label: "Awaiting approval", value: String(stats.pending) },
              { label: "Listed publicly", value: String(stats.listed) },
              { label: "Open requests", value: String(stats.openRequests) },
            ].map((stat) => (
              <div
                key={stat.label}
                className="space-y-2.5 border-b bg-white p-4 text-start sm:border-b-0 sm:border-r last:border-0"
              >
                <p className="text-sm font-medium text-[#67667A]">{stat.label}</p>
                <p className="text-xl font-medium text-[#03442C]">{stat.value}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <LoadingPage />
          ) : (
            <>
              <h3 className="mb-4 text-base font-semibold text-[#101828]">
                Your shortlets
              </h3>
              {listings.length === 0 ? (
                <div className="mb-10 flex h-48 flex-col items-center justify-center rounded-lg border border-[#F0F2F5] bg-white">
                  <p className="text-gray-500">No shortlets listed yet.</p>
                  <Button
                    variant="darkPrimary"
                    className="mt-4 rounded-md px-6 py-2"
                    onClick={() =>
                      router.push("/dashboard/landlord/short-stays/create")
                    }
                  >
                    + Add Shortlet
                  </Button>
                </div>
              ) : (
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
                  {listings.map((room) => {
                    const status = listingLabel(room);
                    return (
                      <div
                        key={room._id}
                        className="relative rounded-lg border border-[#F0F2F5] bg-white p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <img
                            src={getRoomCoverImage(room)}
                            alt={shortStayTitle(room)}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-sm font-semibold text-[#101828]">
                            {shortStayTitle(room)}
                          </h3>
                          <p className="mt-1 text-xs font-light text-gray-400">
                            {shortStayAddress(room) || "Nigeria"}
                          </p>
                          {room.description ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#475467]">
                              {room.description}
                            </p>
                          ) : null}
                          <div className="mt-4 flex items-center justify-between border-t pt-3">
                            <div>
                              <p className="text-sm font-medium text-[#03442C]">
                                ₦
                                {Number(
                                  room.pricePerNight || room.rentAmount || 0,
                                ).toLocaleString()}
                                <span className="font-normal text-[#67667A]">
                                  {" "}
                                  / night
                                </span>
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                Min {Math.max(1, Number(room.minimumNights) || 1)}{" "}
                                night
                                {Number(room.minimumNights) === 1 ? "" : "s"}
                                {room.createdAt
                                  ? ` · Added ${formatDateToWords(room.createdAt)}`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <h3 className="mb-4 text-base font-semibold text-[#101828]">
                Booking requests
              </h3>
              {bookings.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-[#F0F2F5] bg-white">
                  <p className="text-gray-500">No booking requests yet.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-[#F0F2F5] bg-white">
                  {bookings.map((booking, index) => {
                    const room = booking.roomId || {};
                    const booker = booking.bookerId || {};
                    const status = bookingLabel(booking.status);
                    return (
                      <div
                        key={booking._id}
                        className={`flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between ${
                          index !== bookings.length - 1
                            ? "border-b border-[#F0F2F5]"
                            : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#101828]">
                            {shortStayTitle(room)}
                          </p>
                          <p className="mt-1 text-xs text-[#475467]">
                            {booker.firstName || "Guest"}
                            {booker.lastName ? ` ${booker.lastName}` : ""}
                            {booker.phoneNumber ? " · Identity confirmed" : ""}
                          </p>
                          <p className="mt-1 text-sm text-[#67667A]">
                            {new Date(booking.checkIn).toLocaleDateString(
                              "en-GB",
                            )}{" "}
                            →{" "}
                            {new Date(booking.checkOut).toLocaleDateString(
                              "en-GB",
                            )}{" "}
                            · {booking.nights} night
                            {Number(booking.nights) === 1 ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium text-[#03442C]">
                            ₦
                            {Number(booking.amountNaira || 0).toLocaleString()}
                          </p>
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ${status.className}`}
                          >
                            {status.text}
                          </span>
                          {booking.status === "requested" ? (
                            <div className="flex gap-2">
                              <Button
                                variant="darkPrimary"
                                className="rounded-md px-4 py-1.5"
                                disabled={actingId === booking._id}
                                onClick={() => handleAccept(booking._id)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="light"
                                className="rounded-md px-4 py-1.5"
                                disabled={actingId === booking._id}
                                onClick={() => handleDecline(booking._id)}
                              >
                                Decline
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default LandlordShortStaysPage;
