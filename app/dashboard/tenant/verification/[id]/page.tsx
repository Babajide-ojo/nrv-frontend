"use client";
import PersonalInfoVerification from "@/app/components/dashboard/tenant/verification/PersonalInfoVerification";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import EmploymentInfoVerification from "@/app/components/dashboard/tenant/verification/EmploymentInfoVerification";
import GuarantorInfoVerification from "@/app/components/dashboard/tenant/verification/GuarantorInfoVerification";
import IdentificationVerification from "@/app/components/dashboard/tenant/verification/IdentificationVerification";
import IncomeAssessmentVerification from "@/app/components/dashboard/tenant/verification/IncomeAssessmentVerifivation";
import { apiService } from "@/lib/api";
import TenantLayout from "@/app/components/layout/TenantLayout";

const isRequestId = (s: string | null) => s && /^[a-f0-9]{24}$/i.test(s);

const TenantVerificationIdPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stepId = Array.isArray(params.id) ? params.id[0] : params.id;
  const verificationRequestId = searchParams.get("verificationId");
  const router = useRouter();
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [verificationRequest, setVerificationRequest] = useState<any>(null);

  useEffect(() => {
    if (!stepId) {
      setLoading(false);
      setError("Invalid verification step. Please use the link from your landlord's email.");
      return;
    }
    const fetchVerificationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestIdForApi = verificationRequestId && isRequestId(verificationRequestId) ? verificationRequestId : null;
        if (!requestIdForApi) {
          setVerificationData(null);
          setVerificationRequest(null);
          setLoading(false);
          setError("Verification link required. Please use the link from your landlord's email.");
          return;
        }
        // 1) GET verification request first – populates form with landlord invite (email, names)
        let requestData: any = null;
        try {
          const reqRes = await apiService.get(`/verification/${requestIdForApi}`);
          requestData = reqRes?.data?.data ?? reqRes?.data ?? null;
          setVerificationRequest(requestData);
          if (requestData?.email && typeof window !== "undefined") {
            sessionStorage.setItem("verification-request-email", requestData.email);
          }
        } catch {
          setVerificationRequest(null);
        }
        // Allow form to render with request data first (loading done after request is set)
        setLoading(false);

        let tenantEmail: string | null = null;
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("nrv-user");
          if (userStr) {
            try {
              const userObj = JSON.parse(userStr);
              tenantEmail = userObj?.user?.email || userObj?.email || null;
            } catch {}
          }
          if (!tenantEmail) tenantEmail = sessionStorage.getItem("verification-request-email");
          if (!tenantEmail && requestData?.email) tenantEmail = requestData.email;
        }
        if (!tenantEmail) {
          setVerificationData(null);
          setError("Tenant email not found. Please use the link from your verification email or sign in.");
          return;
        }
        // 2) GET verification response by request + email (existing submission) – overlays form if present
        try {
          const res = await apiService.get(
            `/verification/response/by-request/${requestIdForApi}?email=${encodeURIComponent(tenantEmail)}`
          );
          setVerificationData(res?.data?.data || res?.data || null);
        } catch {
          setVerificationData(null);
        }
      } catch (err: any) {
        setVerificationData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVerificationData();
  }, [stepId, verificationRequestId]);

  const stages = [
    { label: "Personal Information", value: "personal-info" },
    { label: "Employment Information", value: "employment-info" },
    { label: "Guarantor", value: "guarantor-info" },
    { label: "Income Assessment", value: "income-assessment" },
  ];

  const currentStageIndex = stages.findIndex((stage) => stage.value === stepId);

  // Dynamic title function
  const getTitle = () => {
    switch (stepId) {
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

  // Use verification REQUEST id from query (for API and child). stepId is the step name (personal-info, etc.)
  const verificationId =
    verificationRequestId && isRequestId(verificationRequestId)
      ? verificationRequestId
      : stepId || "";

  const handleBack = () => {
    if (!verificationId) {
      router.push("/dashboard/tenant/verification");
      return;
    }
    if (stepId === "personal-info") {
      router.push(`/dashboard/tenant/verification?verificationId=${verificationId}`);
      return;
    }
    const prevIndex = currentStageIndex - 1;
    if (prevIndex >= 0) {
      router.push(`/dashboard/tenant/verification/${stages[prevIndex].value}?verificationId=${verificationId}`);
    } else {
      router.push(`/dashboard/tenant/verification?verificationId=${verificationId}`);
    }
  };

  const handleStepClick = (stageValue: string) => {
    if (!verificationId) return;
    if (stageValue === stepId) return;
    router.push(`/dashboard/tenant/verification/${stageValue}?verificationId=${verificationId}`);
  };

  if (loading) {
    return <div className="p-4 text-center sm:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 sm:p-8">{error}</div>;
  }

  return (

  <TenantLayout path="Verification" mainPath=" / Verification Details">
      <div className="min-w-0 max-w-full overflow-x-hidden">
      <div className="mb-5 border-b border-gray-100 bg-white py-4 sm:py-5">
        <div className="mx-auto w-full min-w-0 max-w-[1300px] md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex w-fit shrink-0 items-center gap-1 border-r border-gray-100 pr-3 text-[#667185]">
              <MdArrowBackIos />
              <button type="button" onClick={handleBack} className="hover:underline">
                Back
              </button>
            </div>
            <p className="min-w-0 truncate text-base font-semibold sm:text-[18px]">
              {getTitle()}
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full min-w-0 max-w-[1100px] rounded-lg bg-white py-6 sm:py-10 sm:px-5">
        <div className="mx-auto w-full min-w-0 max-w-[900px]">
          <div className="mb-8 w-full min-w-0 overflow-x-auto overflow-y-hidden pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full flex-nowrap items-center justify-center gap-1 sm:justify-start md:gap-2">
            {stages.map((stage, index) => (
              <div key={index} className="flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(stage.value)}
                  disabled={!verificationId}
                  aria-label={`Step ${index + 1}: ${stage.label}`}
                  aria-current={index === currentStageIndex ? "step" : undefined}
                  className={`flex items-center rounded-full border text-left transition-colors md:gap-1 md:py-1.5 md:px-3 p-1.5 ${
                    index <= currentStageIndex
                      ? "border-[#2B892B] hover:bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${!verificationId ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                >
                  <div
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border text-[10px] font-medium md:h-[18px] md:w-[18px] ${
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
                    className={`hidden text-[10px] md:inline md:mt-1 md:text-center ${
                      index === currentStageIndex
                        ? "text-[#2B892B] font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
                {index < stages.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 w-4 shrink-0 md:mx-2 md:ml-2 md:w-8 ${
                      index < currentStageIndex ? "bg-[#2B892B]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          </div>
          {stepId && !["employment-info", "guarantor-info", "income-assessment"].includes(stepId) && (
            <PersonalInfoVerification
              verificationId={verificationId}
              initialData={verificationData}
              requestData={verificationRequest}
            />
          )}
          {stepId === "employment-info" && <EmploymentInfoVerification initialData={verificationData} />}
          {stepId === "guarantor-info" && <GuarantorInfoVerification initialData={verificationData} />}
          {stepId === "income-assessment" && (
            <IncomeAssessmentVerification
              initialData={verificationData}
              requestData={verificationRequest}
            />
          )}
        </div>
      </div>
    </div>
  </TenantLayout>
  );
};

export default TenantVerificationIdPage;
