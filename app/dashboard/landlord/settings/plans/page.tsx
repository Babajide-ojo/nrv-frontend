"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchPlans } from "../../../../../redux/slices/plansSlice";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import { RootState } from "../../../../../redux/store";
import { IoCheckmarkCircle } from "react-icons/io5";
import { API_URL } from "../../../../../config/constant";

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
    const q = Math.max(1, Math.min(99, Math.floor(value)));
    setQuantityByPlanId((prev) => ({ ...prev, [planId]: q }));
  };

  const handlePurchase = async (planId: string, packPriceNaira: number) => {
    if (!userId) return;
    const quantity = getQuantity(planId);
    const amountNaira = packPriceNaira * quantity;
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
              Buy verification packs below.
            </p>
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
                const packPrice = isPremium ? 2000 : 1000; // in Naira
                const quantity = getQuantity(plan._id);
                const totalPrice = packPrice * quantity;

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
                    <p className="text-sm text-gray-600 mb-4">
                      {plan.description}
                    </p>

                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Credits per pack:</p>
                    <div className="mb-6">
                      {isPremium ? (
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <p className="text-xs text-gray-500">Premium verification</p>
                          <p className="text-lg font-bold text-gray-900">+{premAdd}</p>
                        </div>
                      ) : (
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <p className="text-xs text-gray-500">Standard verification</p>
                          <p className="text-lg font-bold text-gray-900">+{stdAdd}</p>
                        </div>
                      )}
                    </div>

                    {plan.features?.length > 0 && (
                      <ul className="space-y-2 mb-6 flex-1">
                        {plan.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <IoCheckmarkCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-600">Quantity</span>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            disabled={purchasingPlanId === plan._id}
                            onClick={() => setQuantity(plan._id, quantity - 1)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
                          <button
                            type="button"
                            disabled={purchasingPlanId === plan._id}
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
                        onClick={() => handlePurchase(plan._id, packPrice)}
                        className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {purchasingPlanId === plan._id
                          ? "Processing…"
                          : `Purchase ${quantity} pack${quantity > 1 ? "s" : ""} · ₦${totalPrice.toLocaleString()}`}
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
