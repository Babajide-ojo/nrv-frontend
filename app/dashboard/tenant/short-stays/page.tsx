"use client";

import { useEffect, useState } from "react";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { toast } from "react-toastify";
import {
  fetchMyShortStayBookings,
  payShortStayBooking,
} from "@/lib/shortletApi";
import { shortStayTitle } from "@/lib/shortStay";

const ShortStayBookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchMyShortStayBookings("booker");
      setBookings(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not load stays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handlePay = async (id: string) => {
    try {
      const result = await payShortStayBooking(id);
      const url = result?.data?.authorization_url;
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error(result?.message || "Could not start payment.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not start payment.");
    }
  };

  return (
    <TenantLayout path="Short stays">
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-medium text-[#0D3520]">Short stays</h1>
        <p className="mt-1 text-sm text-gray-600">
          Requests, payments, and confirmed stays.
        </p>
        {loading ? (
          <p className="mt-6 text-gray-500">Loading stays.</p>
        ) : bookings.length === 0 ? (
          <p className="mt-6 text-gray-500">
            You have not requested a short stay yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {bookings.map((booking) => {
              const room = booking.roomId || {};
              return (
                <li
                  key={booking._id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#0D3520]">
                    {shortStayTitle(room)}
                  </p>
                  {room.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#475467]">
                      {room.description}
                    </p>
                  ) : null}
                  <p className="text-sm text-gray-600">
                    {new Date(booking.checkIn).toLocaleDateString("en-GB")} →{" "}
                    {new Date(booking.checkOut).toLocaleDateString("en-GB")} ·{" "}
                    {booking.nights} nights · ₦
                    {Number(booking.amountNaira || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm capitalize">
                    {String(booking.status || "").replace("_", " ")}
                    {booking.identityStatus
                      ? ` · identity ${booking.identityStatus}`
                      : ""}
                  </p>
                  {booking.status === "pending_payment" ? (
                    <button
                      type="button"
                      onClick={() => handlePay(booking._id)}
                      className="mt-3 rounded-full bg-[#0D3520] px-4 py-2 text-sm text-white"
                    >
                      Pay now
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </TenantLayout>
  );
};

export default ShortStayBookingsPage;
