"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_URL, LANDLORD_VERIFICATION_REQUEST_PATH } from "@/config/constant";
import { toast } from "react-toastify";
import { setUserFromPayment } from "@/redux/slices/userSlice";

type CallbackState = "verifying" | "success" | "error";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [state, setState] = useState<CallbackState>("verifying");
  const [verificationUrl, setVerificationUrl] = useState<string>(
    LANDLORD_VERIFICATION_REQUEST_PATH,
  );

  useEffect(() => {
    const run = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        toast.error("Missing payment reference.");
        setState("error");
        return;
      }

      try {
        const res = await axios.post(`${API_URL}/payments/verify/${reference}`);
        const payload = res.data?.data ?? res.data;
        const updatedUser = payload?.user ?? res.data?.user;
        const nextUrl =
          payload?.verificationRequestUrl ?? LANDLORD_VERIFICATION_REQUEST_PATH;
        setVerificationUrl(nextUrl);

        if (updatedUser) {
          const stored = localStorage.getItem("nrv-user");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              localStorage.setItem(
                "nrv-user",
                JSON.stringify({
                  ...parsed,
                  user: updatedUser,
                }),
              );
            } catch {
              // ignore
            }
          }
          dispatch(setUserFromPayment({ user: updatedUser }));
        }

        toast.success("Payment successful. Your credits have been updated.");
        setState("success");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Could not verify payment.",
        );
        setState("error");
      }
    };

    run();
  }, [searchParams, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl px-6 py-8 max-w-md w-full text-center">
        {state === "verifying" && (
          <>
            <h1 className="text-xl font-semibold mb-2">Verifying payment…</h1>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your transaction with Paystack.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-green-600" />
            </div>
          </>
        )}

        {state === "success" && (
          <>
            <h1 className="text-xl font-semibold mb-2 text-[#03442C]">
              Payment successful
            </h1>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Your verification credits are on your account. You can start a tenant
              verification right away.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={verificationUrl}
                className="inline-flex items-center justify-center rounded-xl bg-[#03442C] text-white font-semibold py-3 px-4 hover:bg-[#022f21] transition-colors"
              >
                Start verification
              </Link>
              <Link
                href="/dashboard/landlord/settings/plans"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-800 font-medium py-3 px-4 hover:bg-gray-50 transition-colors text-sm"
              >
                Back to credits
              </Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6 text-sm">
              We could not complete verification. You can return to credits or try again
              from your bank receipt.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/landlord/settings/plans")}
              className="w-full rounded-xl bg-[#03442C] text-white font-semibold py-3 px-4 hover:bg-[#022f21] transition-colors"
            >
              Back to credits
            </button>
          </>
        )}
      </div>
    </div>
  );
}
