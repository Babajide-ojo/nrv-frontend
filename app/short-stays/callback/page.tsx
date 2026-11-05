"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { verifyShortStayPayment } from "@/lib/shortletApi";

type CallbackState = "verifying" | "success" | "error";

export default function ShortStayCallbackPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>("verifying");
  const [message, setMessage] = useState("Checking your payment.");

  useEffect(() => {
    const run = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        setState("error");
        setMessage("Missing payment reference.");
        return;
      }
      try {
        const result = await verifyShortStayPayment(reference);
        if (result?.status === "success") {
          setState("success");
          setMessage("Payment received. Your stay is confirmed.");
          return;
        }
        setState("error");
        setMessage(
          result?.message || "Payment was not completed. Try Pay now again.",
        );
      } catch (err: any) {
        setState("error");
        setMessage(
          err?.response?.data?.message ||
            "Payment could not be confirmed. Try again from your bookings.",
        );
      }
    };
    void run();
  }, [searchParams]);

  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-medium text-[#0D3520]">Short stay payment</h1>
      <p className="mt-4 text-gray-600">{message}</p>
      <Link
        href="/dashboard/tenant/short-stays"
        className="mt-8 inline-block rounded-full bg-[#0D3520] px-6 py-3 text-white"
      >
        View my stays
      </Link>
      {state === "verifying" ? null : null}
    </main>
  );
}
