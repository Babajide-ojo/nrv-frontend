"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchPlans } from "../../../../../redux/slices/plansSlice";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import { RootState } from "../../../../../redux/store";
import { API_URL } from "../../../../../config/constant";
import { getVerificationCreditBalances } from "@/helpers/verificationCredits";

const MAX_CREDIT_QTY = 999;

function fallbackUnitPrice(plan: { slug?: string; unitPriceNaira?: number }) {
  if (plan.unitPriceNaira != null && plan.unitPriceNaira > 0) return plan.unitPriceNaira;
  return plan.slug === "premium" ? 400 : 200;
}

function friendlyPlanDescription(isPremium: boolean) {
  if (isPremium) {
    return "Everything in Standard verification, plus Credit Score (Affordability) to check if the tenant can realistically sustain the rent.";
  }
  return "Identity verification and Criminal/Fraud history checks to help you confidently screen a tenant before renting.";
}

interface PaymentRecord {
  _id: string;
  planId?: string;
  planName?: string;
  amountNaira: number;
  quantity?: number;
  status: string;
  paidAt?: string;
  createdAt?: string;
}

const PlansPage = () => {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state: RootState) => state.plans);
  const user = useSelector((state: RootState) => state.user.data);
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);
  const [quantityByPlanId, setQuantityByPlanId] = useState<Record<string, number>>({});
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const userDoc = user?.user ?? user;
  const userId = userDoc?._id ?? (user as any)?._id;

  const creditBalances = useMemo(() => {
    if (userDoc && (userDoc as { _id?: string })?._id) {
      return getVerificationCreditBalances(userDoc);
    }
    if (typeof window === "undefined") return { standard: 0, premium: 0 };
    try {
      const raw = localStorage.getItem("nrv-user");
      return getVerificationCreditBalances(raw ? JSON.parse(raw)?.user : null);
    } catch {
      return { standard: 0, premium: 0 };
    }
  }, [user, userDoc]);

  useEffect(() => {
    dispatch(fetchPlans() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!userId) return;
    setHistoryLoading(true);
    axios
      .get(`${API_URL}/payments/history/${userId}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setPaymentHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => setPaymentHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [userId]);

  const getQuantity = (planId: string) => quantityByPlanId[planId] ?? 1;
  const setQuantity = (planId: string, value: number) => {
    const q = Math.max(1, Math.min(MAX_CREDIT_QTY, Math.floor(value)));
    setQuantityByPlanId((prev) => ({ ...prev, [planId]: q }));
  };

  const handlePurchase = async (
    planId: string,
    unitPriceNaira: number,
    creditsPerUnit: number,
  ) => {
    if (!userId) return;
    const quantity = getQuantity(planId);
    const amountNaira = quantity * unitPriceNaira;
    if (quantity * creditsPerUnit < 1) {
      toast.error("Invalid plan configuration.");
      return;
    }
    setPurchasingPlanId(planId);
    try {
      const res = await axios.post(`${API_URL}/payments/initialize-pack`, {
        userId,
        planId,
        amountNaira,
        quantity,
      });
      const data = res.data?.data || res.data;
      const authUrl = data?.authorization_url;
      if (!authUrl) {
        throw new Error("Could not get Paystack authorization URL.");
      }
      window.location.href = authUrl;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to start payment.",
      );
      setPurchasingPlanId(null);
    }
  };

  return (
    <ProtectedRoute>
      <LandLordLayout path="Buy verification credit" mainPath="Settings" subMainPath="Buy verification credit">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Verification credits
            </h1>
            <p className="text-gray-600">
              Choose Standard for a full tenant check, or Premium for the same plus affordability.
              Price is per credit; totals update when you change quantity.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-[#03442C]/20 bg-[#03442C]/[0.06] px-4 py-3 text-sm text-gray-800">
              <span className="font-semibold text-[#03442C]">Your verification credits</span>
              <span className="text-gray-700">
                Standard{" "}
                <strong className="text-gray-900 tabular-nums">{creditBalances.standard}</strong>
                <span className="text-gray-400 mx-2">·</span>
                Premium{" "}
                <strong className="text-gray-900 tabular-nums">{creditBalances.premium}</strong>
              </span>
            </div>
          </div>

          {loading === "pending" ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-green-600"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {plans.map((plan: any) => {
                const isPremium = plan.slug === "premium";
                const stdAdd = plan.standardVerificationAdded ?? 0;
                const premAdd = plan.premiumVerificationAdded ?? 0;
                const creditsPerUnit = isPremium ? premAdd || 1 : stdAdd || 1;
                const unitPrice = fallbackUnitPrice(plan);
                const quantity = getQuantity(plan._id);
                const totalCredits = quantity * creditsPerUnit;
                const totalPrice = quantity * unitPrice;

                return (
                  <div
                    key={plan._id}
                    className={`relative flex flex-col rounded-xl border p-6 border-gray-200 bg-white ${isPremium ? "border-green-300" : ""}`}
                  >
                    {isPremium && (
                      <span className="inline-block text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded mb-3">
                        Recommended
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      {friendlyPlanDescription(isPremium)}
                    </p>

                    <div className="mt-auto space-y-3">
                      <div className="rounded-xl border border-[#03442C]/20 bg-[#03442C]/[0.06] px-4 py-3 text-sm text-gray-800">
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600">Price / credit</span>
                          <span className="font-semibold">₦{unitPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-2 mt-1">
                          <span className="text-gray-600">Credits</span>
                          <span className="font-semibold">
                            {totalCredits.toLocaleString()}
                            <span className="font-normal text-gray-600">
                              {" "}
                              ({quantity.toLocaleString()} × {creditsPerUnit})
                            </span>
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#03442C]/15 flex justify-between items-center">
                          <span className="font-medium text-[#03442C]">Total</span>
                          <span className="text-lg font-bold text-gray-900">
                            ₦{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Quantity</span>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            disabled={purchasingPlanId === plan._id || quantity <= 1}
                            onClick={() => setQuantity(plan._id, quantity - 1)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={MAX_CREDIT_QTY}
                            disabled={purchasingPlanId === plan._id}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(plan._id, Number(e.target.value) || 1)
                            }
                            className="w-14 text-center font-medium border-0 focus:ring-0 bg-transparent py-1.5 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            disabled={
                              purchasingPlanId === plan._id || quantity >= MAX_CREDIT_QTY
                            }
                            onClick={() => setQuantity(plan._id, quantity + 1)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={purchasingPlanId === plan._id}
                        onClick={() =>
                          handlePurchase(plan._id, unitPrice, creditsPerUnit)
                        }
                        className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {purchasingPlanId === plan._id
                          ? "Processing…"
                          : `Pay ₦${totalPrice.toLocaleString()}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Purchase history</h2>
            {historyLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-green-600"></div>
              </div>
            ) : paymentHistory.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No purchases yet.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Qty</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((p) => (
                      <tr key={p._id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 text-gray-600">
                          {p.paidAt
                            ? new Date(p.paidAt).toLocaleDateString()
                            : p.createdAt
                              ? new Date(p.createdAt).toLocaleDateString()
                              : "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-900">{p.planName ?? "Pack"}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{p.quantity ?? 1}</td>
                        <td className="py-3 px-4 text-right text-gray-900">₦{(p.amountNaira ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              p.status === "success"
                                ? "bg-green-100 text-green-800"
                                : p.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default PlansPage;
