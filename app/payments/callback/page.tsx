"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config/constant";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const run = async () => {
      const reference = searchParams.get("reference");
      if (!reference) {
        toast.error("Missing payment reference.");
        router.push("/dashboard/landlord/settings/plans");
        return;
      }

      try {
        await axios.post(`${API_URL}/payments/verify/${reference}`);

        // Refresh user data so balances update in localStorage
        const stored = localStorage.getItem("nrv-user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const userId = parsed?.user?._id ?? parsed?._id;
            const token = parsed?.accessToken;
            if (userId && token) {
              const res = await axios.get(`${API_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const updatedUser = res.data?.data || res.data;
              localStorage.setItem(
                "nrv-user",
                JSON.stringify({
                  ...parsed,
                  user: updatedUser,
                }),
              );
            }
          } catch {
            // ignore refresh errors, balances will still update on next login
          }
        }

        toast.success("Payment successful. Your credits have been updated.");
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Could not verify payment.",
        );
      } finally {
        setVerifying(false);
        setTimeout(
          () => router.push("/dashboard/landlord/settings/plans"),
          1500,
        );
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-xl px-6 py-8 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-2">Verifying payment…</h1>
        <p className="text-gray-600 mb-4">
          Please wait while we confirm your transaction with Paystack.
        </p>
        <div className="flex justify-center">
          {verifying ? (
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-green-600" />
          ) : (
            <p className="text-sm text-gray-500">
              Redirecting you back to your plans…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

