"use client";
import PersonalInfoVerification from "@/app/components/dashboard/tenant/verification/PersonalInfoVerification";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import EmploymentInfoVerification from "@/app/components/dashboard/tenant/verification/EmploymentInfoVerification";
import GuarantorInfoVerification from "@/app/components/dashboard/tenant/verification/GuarantorInfoVerification";
import IdentificationVerification from "@/app/components/dashboard/tenant/verification/IdentificationVerification";
import IncomeAssessmentVerification from "@/app/components/dashboard/tenant/verification/IncomeAssessmentVerifivation";
import { apiService } from "@/lib/api";
import TenantLayout from "@/app/components/layout/TenantLayout";

const TenantVerificationIdPage = () => {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      setLoading(true);
      try {
        let tenantEmail = null;
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("nrv-user");
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              tenantEmail = userObj?.user?.email || userObj?.email;
            } catch {}
          }
        }
        if (!tenantEmail) {
          setVerificationData(null);
          setLoading(false);
          setError("Tenant email not found. Please sign in again.");
          return;
        }
        const res = await apiService.get(`/verification/response/by-request/${id}?email=${encodeURIComponent(tenantEmail)}`);
        setVerificationData(res?.data?.data || res?.data || null);
      } catch (err: any) {
        setVerificationData(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVerificationData();
  }, [id]);

  const stages = [
    { label: "Personal Information", value: "personal-info" },
    { label: "Employment Information", value: "employment-info" },
    { label: "Guarantor", value: "guarantor-info" },
    { label: "Income Assessment", value: "income-assessment" },
  ];

  const currentStageIndex = stages.findIndex((stage) => stage.value === id);

  // Dynamic title function
  const getTitle = () => {
    switch (id) {
      case "personal-info":
        return "Your Personal Information";
      case "employment-info":
        return "Your Employment Information";
      case "guarantor-info":
        return "Your Guarantor Information";
      case "income-assessment":
        return "Income Assessment";
      default:
        return "Verification";
    }
  };

  // Ensure verificationId is always a string
  const verificationId = Array.isArray(id) ? id.join("") : id;

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (

  <TenantLayout path="Verification" mainPath=" / Verification Details">
      <div>
      <div className="p-5 -m-5 bg-white mb-5">
        <div className="max-w-[1300px] mx-auto w-full md:px-5">
          <div className="flex items-center gap-3">
            <div className="w-fit flex gap-1 items-center text-[#667185] pr-3 border-r border-gray-100">
              <MdArrowBackIos />
              <button onClick={() => router.back()}>Back</button>
            </div>
            <p className="text-[18px] font-semibold">
              {getTitle()}
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto w-full py-10 px-5 rounded-lg bg-white">
        <div className="max-w-[900px] mx-auto w-full">
          <div className="flex items-center mb-8 flex-wrap gap-2">
            {stages.map((stage, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center gap-1 border py-1.5 px-3 rounded-full ${
                    index <= currentStageIndex
                      ? "border-[#2B892B]"
                      : "border-gray-200"
                  }`}
                >
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex items-center border justify-center text-[10px] font-medium ${
                      index < currentStageIndex
                        ? "border-[#2B892B] bg-[#2B892B] text-white"
                        : index === currentStageIndex
                        ? "border-[#2B892B] text-[#2B892B]"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStageIndex ? (
                      <FaCheck size={10} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1 text-center ${
                      index === currentStageIndex
                        ? "text-[#2B892B] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ml-2 ${
                      index < currentStageIndex ? "bg-[#2B892B]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {!["employment-info", "guarantor-info", "income-assessment"].includes(verificationId) && (
            <PersonalInfoVerification verificationId={verificationId} initialData={verificationData} />
          )}
          {id === "employment-info" && <EmploymentInfoVerification initialData={verificationData} />}
          {id === "guarantor-info" && <GuarantorInfoVerification initialData={verificationData} />}
          {id === "income-assessment" && <IncomeAssessmentVerification initialData={verificationData} />}
        </div>
      </div>
    </div>
  </TenantLayout>
  );
};

export default TenantVerificationIdPage;
