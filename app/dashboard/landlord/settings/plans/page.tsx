"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchPlans } from "../../../../../redux/slices/plansSlice";
import { addCredits } from "../../../../../redux/slices/userSlice";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import { RootState } from "../../../../../redux/store";
import { IoCheckmarkCircle } from "react-icons/io5";
import { API_URL } from "../../../../../config/constant";

type AddingType = "standardVerification" | "premiumVerification" | null;

const PlansPage = () => {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state: RootState) => state.plans);
  const user = useSelector((state: RootState) => state.user.data);
  const userLoading = useSelector((state: RootState) => state.user.loading);
  const [addingType, setAddingType] = useState<AddingType>(null);
  const [purchasingPlanId, setPurchasingPlanId] = useState<string | null>(null);

  const userDoc = user?.user ?? user;
  const userId = userDoc?._id ?? (user as any)?._id;
  const standardBalance = userDoc?.standardVerificationBalance ?? 0;
  const standardUsed = userDoc?.standardVerificationUsed ?? 0;
  const premiumBalance = userDoc?.premiumVerificationBalance ?? 0;
  const premiumUsed = userDoc?.premiumVerificationUsed ?? 0;

  useEffect(() => {
    dispatch(fetchPlans() as any);
  }, [dispatch]);

  const handleAddOne = async (type: AddingType) => {
    if (!userId || !type) return;
    setAddingType(type);
    const payload =
      type === "standardVerification"
        ? { userId, standardVerification: 1 }
        : { userId, premiumVerification: 1 };
    try {
      const updated = await dispatch(addCredits(payload) as any).unwrap();
      localStorage.setItem("nrv-user", JSON.stringify(updated));
      toast.success("1 credit added.");
    } catch (err: any) {
      toast.error(err || "Failed to add credit.");
    } finally {
      setAddingType(null);
    }
  };

  const handlePurchase = async (planId: string, amountNaira: number) => {
    if (!userId) return;
    setPurchasingPlanId(planId);
    try {
      const res = await axios.post(`${API_URL}/payments/initialize-pack`, {
        userId,
        planId,
        amountNaira,
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
      <ToastContainer />
      <LandLordLayout path="Plans" mainPath="Settings" subMainPath="Plans">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Verification credits
            </h1>
            <p className="text-gray-600 mb-4">
              Buy verification credits one at a time or in packs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Standard verification</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{standardUsed} / {standardBalance} used</p>
                <button
                  type="button"
                  disabled={addingType !== null}
                  onClick={() => handleAddOne("standardVerification")}
                  className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-60"
                >
                  {addingType === "standardVerification" ? "Adding…" : "Add 1"}
                </button>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Premium verification</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{premiumUsed} / {premiumBalance} used</p>
                <button
                  type="button"
                  disabled={addingType !== null}
                  onClick={() => handleAddOne("premiumVerification")}
                  className="text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-60"
                >
                  {addingType === "premiumVerification" ? "Adding…" : "Add 1"}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500">Or buy a verification pack below for 5 credits at once.</p>
          </div>

          {loading === "pending" ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-green-600"></div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {plans.map((plan: any) => {
                const isPremium = plan.slug === "premium";
                const stdAdd = plan.standardVerificationAdded ?? (isPremium ? 20 : 5);
                const premAdd = plan.premiumVerificationAdded ?? (isPremium ? 20 : 5);
                const packPrice = isPremium ? 2000 : 1000; // in Naira

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

                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Per purchase you get:</p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                        <p className="text-xs text-gray-500">Standard verification</p>
                        <p className="text-lg font-bold text-gray-900">+{stdAdd}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                        <p className="text-xs text-gray-500">Premium verification</p>
                        <p className="text-lg font-bold text-gray-900">+{premAdd}</p>
                      </div>
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

                    <div className="mt-auto">
                      <button
                        type="button"
                        disabled={purchasingPlanId !== null}
                        onClick={() => handlePurchase(plan._id, packPrice)}
                        className="w-full py-2.5 px-4 rounded-lg font-medium bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {purchasingPlanId === plan._id ? "Processing…" : `Purchase ₦${packPrice.toLocaleString()}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default PlansPage;
