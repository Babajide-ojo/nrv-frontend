"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  fetchShortStayPayBooking,
  payShortStayBooking,
} from "@/lib/shortletApi";
import { shortStayTitle } from "@/lib/shortStay";

function GuestPayContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";
  const token = searchParams.get("token") || "";
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!bookingId || !token) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchShortStayPayBooking(bookingId, token);
        setBooking(data);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "This pay link is not valid.",
        );
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [bookingId, token]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const result = await payShortStayBooking(bookingId, token);
      const url = result?.data?.authorization_url;
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error(result?.message || "Could not start payment.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not start payment.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <p className="px-4 py-16 text-center text-gray-500">Loading stay.</p>;
  }

  if (!bookingId || !token || !booking) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-medium text-[#0D3520]">Pay for stay</h1>
        <p className="mt-4 text-gray-600">This pay link is missing or expired.</p>
        <Link href="/short-stays" className="mt-8 inline-block text-[#03442C]">
          Browse short stays
        </Link>
      </main>
    );
  }

  const room = booking.roomId || {};
  const canPay =
    booking.status === "pending_payment" && booking.identityStatus === "passed";

  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-medium text-[#0D3520]">Pay for stay</h1>
      <p className="mt-4 text-gray-600">{shortStayTitle(room)}</p>
      <p className="mt-2 text-sm text-gray-500">
        {new Date(booking.checkIn).toLocaleDateString("en-GB")} →{" "}
        {new Date(booking.checkOut).toLocaleDateString("en-GB")} ·{" "}
        {booking.nights} nights
      </p>
      <p className="mt-4 text-lg font-semibold text-[#03442C]">
        ₦{Number(booking.amountNaira || 0).toLocaleString()}
      </p>
      {canPay ? (
        <button
          type="button"
          disabled={paying}
          onClick={() => void handlePay()}
          className="mt-8 rounded-full bg-[#0D3520] px-6 py-3 text-white disabled:opacity-60"
        >
          {paying ? "Opening checkout…" : "Pay now"}
        </button>
      ) : (
        <p className="mt-8 text-sm text-gray-600">
          Payment is not open yet. Identity status:{" "}
          {booking.identityStatus || "pending"}.
        </p>
      )}
    </main>
  );
}

export default function ShortStayPayPage() {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-16 text-center text-gray-500">Loading stay.</p>
      }
    >
      <GuestPayContent />
    </Suspense>
  );
}
