"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { apiService } from "@/lib/api";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { toast } from "react-toastify";

interface VerificationResponse {
  _id: string;
  verificationId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  address?: string;
  employmentStatus?: string;
  roleInCompany?: string;
  companyName?: string;
  companyAddress?: string;
  monthlyIncome?: number;
  dateJoined?: string;
  guarantorFirstName?: string;
  guarantorLastName?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;
  guarantorAddress?: string;
  guarantorEmploymentStatus?: string;
  guarantorCompany?: string;
  guarantorRelationship?: string;
  bankStatementUrl?: string;
  utilityBillUrl?: string;
  identificationDocumentUrl?: string;
  identificationDocumentType?: string;
  gender?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  maritalStatus?: string;
  employerName?: string;
  previousLandlordComments?: Array<{ comment: string; landlordName: string }>;
  videoSelfieConfirmed?: string;
  personalReport?: { status: string; comment?: string };
  employmentReport?: { status: string; comment?: string };
  guarantorReport?: { status: string; comment?: string };
  documentsReport?: { status: string; comment?: string };
  phoneVerificationStatus?: string;
  nin?: string;
  ninVerificationStatus?: string;
  ninVerificationDate?: string;
  ninVerificationResult?: Record<string, unknown>;
  /** Saved credit summary snapshot (from admin checks). */
  creditSummary?: Record<string, unknown> | null;
  /** AML screening result (PEP, sanctions, adverse media). */
  amlScreeningResult?: Record<string, unknown> | null;
  /** Backend analysis result for ID document. */
  identificationDocumentAnalysis?: Record<string, unknown> | null;
  /** Backend analysis result for utility bill. */
  utilityBillAnalysis?: Record<string, unknown> | null;
  /** Privacy-safe summary (no PII). Shown in landlord dashboard when present. */
  landlordReport?: {
    generatedAt: string;
    nin: string;
    aml: string;
    phone: string;
    creditSummary: string;
    idDocument: string;
    utilityBill: string;
    personalSection: string;
    employmentSection: string;
    guarantorSection: string;
    documentsSection: string;
    riskScore?: number;
    riskCategory?: string;
    recommendation?: string;
  };
}

/** Output shape from manualReviewEmploymentGuarantorCopy (employment / guarantor rows). */
type SectionReviewLine = { result: string; notes: string };

/** Align with backend mapReportSectionToLandlordSummary (verification.service.ts). */
function normalizedManualReviewState(
  report: { status?: string } | null | undefined,
  landlordSection?: string,
): "completed" | "rejected" | "pending" | "not_reviewed" {
  const fromReport =
    report?.status != null && String(report.status).trim() !== ""
      ? String(report.status).trim().toLowerCase()
      : "";
  const s =
    fromReport ||
    String(landlordSection ?? "not_reviewed")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  if (["approved", "verified", "completed", "complete"].includes(s)) return "completed";
  if (["rejected", "failed", "declined"].includes(s)) return "rejected";
  if (["pending", "under_review"].includes(s)) return "pending";
  if (["not_reviewed", ""].includes(s)) return "not_reviewed";
  return "pending";
}

type RiskBand = "low" | "moderate" | "elevated" | "high";
type CheckTone = "good" | "warn" | "bad" | "neutral";

function riskBandFromScore(score: number | undefined): RiskBand {
  if (score == null || Number.isNaN(score)) return "moderate";
  if (score >= 80) return "low";
  if (score >= 65) return "moderate";
  if (score >= 45) return "elevated";
  return "high";
}

function gaugeColor(band: RiskBand): string {
  switch (band) {
    case "low":
      return "#16a34a";
    case "moderate":
      return "#ca8a04";
    case "elevated":
      return "#ea580c";
    case "high":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}

function toneClass(t: CheckTone): string {
  switch (t) {
    case "good":
      return "text-emerald-600 font-semibold";
    case "warn":
      return "text-amber-600 font-semibold";
    case "bad":
      return "text-red-600 font-semibold";
    default:
      return "text-gray-500 font-medium";
  }
}

function identityNinCheck(v: VerificationResponse): { label: string; tone: CheckTone } {
  const lr = v.landlordReport;
  const meta = lr?.nin;
  const res = v.ninVerificationResult as { namesMatch?: boolean; dobMatch?: boolean; status?: string } | undefined;
  if (meta === "not_provided" || (!v.nin && meta !== "verified" && meta !== "failed")) {
    return { label: "Not provided", tone: "neutral" };
  }
  if (meta === "failed" || res?.status === "failed") {
    return { label: "Failed", tone: "bad" };
  }
  const match = res?.namesMatch === true && res?.dobMatch === true;
  if (meta === "verified" && match) {
    return { label: "Verified", tone: "good" };
  }
  if (res && (res.namesMatch === false || res.dobMatch === false)) {
    return { label: "Partial", tone: "warn" };
  }
  if (meta === "verified") {
    return { label: "Partial", tone: "warn" };
  }
  return { label: "Pending", tone: "warn" };
}

function phoneCheck(v: VerificationResponse): { label: string; tone: CheckTone } {
  const lr = v.landlordReport?.phone;
  if (lr === "not_provided" || (!v.phone && lr !== "valid" && lr !== "invalid")) {
    return { label: "Not provided", tone: "neutral" };
  }
  if (lr === "valid" || v.phoneVerificationStatus === "valid") {
    return { label: "Confirmed", tone: "good" };
  }
  if (lr === "invalid") {
    return { label: "Invalid", tone: "bad" };
  }
  return { label: "Pending", tone: "warn" };
}

function addressCheck(v: VerificationResponse): { label: string; tone: CheckTone } {
  const u = v.landlordReport?.utilityBill;
  if (u === "not_provided" && !v.utilityBillUrl) {
    return { label: "Not provided", tone: "neutral" };
  }
  if (u === "verified") {
    return { label: "Verified", tone: "good" };
  }
  if (u === "failed") {
    return { label: "Failed", tone: "bad" };
  }
  return { label: "Pending", tone: "warn" };
}

function employmentCheckShort(empReview: SectionReviewLine): { label: string; tone: CheckTone } {
  if (empReview.result === "Verification completed") return { label: "Verified", tone: "good" };
  if (empReview.result === "Could not verify") return { label: "Unconfirmed", tone: "bad" };
  if (empReview.result === "Pending") return { label: "Pending", tone: "warn" };
  return { label: "Not reviewed", tone: "warn" };
}

function guarantorCheckShort(v: VerificationResponse, guReview: SectionReviewLine): { label: string; tone: CheckTone } {
  const hasGuarantor = !!(
    v.guarantorFirstName ||
    v.guarantorLastName ||
    v.guarantorPhone ||
    v.guarantorEmail
  );
  if (!hasGuarantor) {
    return { label: "Not provided", tone: "neutral" };
  }
  if (guReview.result === "Verification completed") return { label: "Verified", tone: "good" };
  if (guReview.result === "Could not verify") return { label: "Unconfirmed", tone: "bad" };
  if (guReview.result === "Pending") return { label: "Pending", tone: "warn" };
  return { label: "Not reviewed", tone: "warn" };
}

function criticalAlertCopy(
  band: RiskBand,
  v: VerificationResponse,
): { title: string; body: string } | null {
  if (band === "high") {
    return {
      title: "Multiple critical failures",
      body: "Identity may not be fully verified, the phone may be invalid, address checks may have failed, and employment may be unconfirmed. Do not proceed without significant further investigation.",
    };
  }
  const res = v.ninVerificationResult as { namesMatch?: boolean; dobMatch?: boolean } | undefined;
  if (res && (res.namesMatch === false || res.dobMatch === false)) {
    return {
      title: "Identity mismatch detected",
      body: "The NIN may be confirmed but name and date of birth do not fully match records. Request clarification before signing any lease.",
    };
  }
  return null;
}

function landlordSummaryParagraphs(v: VerificationResponse, band: RiskBand): string[] {
  const lr = v.landlordReport;
  const score = lr?.riskScore;
  const category = lr?.riskCategory ?? "";
  const rec = lr?.recommendation?.trim() ?? "";
  const out: string[] = [];
  if (score != null) {
    out.push(
      `The full picture: This tenant has a trust score of ${score}/100${category ? ` (${category})` : ""}. ${rec}`.trim(),
    );
  } else if (rec) {
    out.push(rec);
  }
  const id = identityNinCheck(v);
  if (id.tone === "bad" || id.tone === "warn") {
    out.push(
      id.label === "Partial"
        ? "The concern: Identity data shows a partial match — confirm original documents in person."
        : "Identity could not be verified reliably against official records.",
    );
  } else if (id.tone === "good") {
    out.push("Identity: NIN and submitted details align with verification records.");
  }
  const ph = phoneCheck(v);
  out.push(
    ph.tone === "good"
      ? "Communication: Phone number passed automated validation."
      : "Communication: Phone could not be fully confirmed — validate with a direct call or message.",
  );
  const ad = addressCheck(v);
  out.push(
    ad.tone === "good"
      ? "Address: Supporting documentation supports the stated address."
      : "Address: Verification is incomplete or failed — confirm tenancy history separately.",
  );
  const emp = normalizedManualReviewState(v.employmentReport, lr?.employmentSection);
  out.push(
    emp === "completed"
      ? "Employment: A reviewer has completed verification of employment details."
      : emp === "rejected"
        ? "Employment: Reviewer could not verify employment — treat stated income cautiously."
        : "Employment: Reviewer assessment is still pending or was not recorded.",
  );
  const hasGu = !!(v.guarantorFirstName || v.guarantorLastName || v.guarantorPhone);
  if (hasGu) {
    const gu = normalizedManualReviewState(v.guarantorReport, lr?.guarantorSection);
    out.push(
      gu === "completed"
        ? "Guarantor: A reviewer has completed verification of guarantor details."
        : gu === "rejected"
          ? "Guarantor: Reviewer could not verify the guarantor."
          : "Guarantor: Reviewer assessment is still pending or was not recorded.",
    );
  }
  if (v.monthlyIncome && v.monthlyIncome > 0) {
    out.push(
      `Financial context: Stated monthly income is on file. ${band === "low" ? "Capacity appears supportive for typical rent levels, subject to your asking price." : "Cross-check against rent and obtain documentation where checks are open."}`,
    );
  }
  out.push(
    band === "low"
      ? "Bottom line: Major checks are favourable — you may proceed toward lease discussions while keeping standard protections (deposit, written lease)."
      : band === "high"
        ? "Bottom line: Risk indicators are elevated — resolve gaps or decline unless you complete extra due diligence."
        : "Bottom line: Do not rush — close open verification items before finalising a lease.",
  );
  return out;
}

function recommendedNextSteps(band: RiskBand, v: VerificationResponse): string[] {
  const company = v.companyName?.trim() || "the employer on file";
  const lr = v.landlordReport;
  const employmentReviewerVerified =
    normalizedManualReviewState(v.employmentReport, lr?.employmentSection) === "completed";
  const addressReviewerOrDocVerified = addressCheck(v).tone === "good";

  if (band === "high") {
    return [
      "Do not proceed without meeting in person. Request all original government-issued documents — NIN slip, passport, or voter's card.",
      "Contact a previous landlord directly. Ask for a reference and speak with that person before making any decision.",
      "Consider declining the application. If the tenant cannot resolve identity and contact issues, declining may better protect your property.",
      "Document everything. Keep records of all interactions with this applicant in case of future disputes.",
    ];
  }
  if (band === "low") {
    return [
      "Proceed to lease discussions — major automated and review checks have passed.",
      "Collect a standard security deposit (typically 1–2 months' rent) for protection.",
      "Keep copies of verified documents on file (NIN confirmation, employment verification where applicable).",
    ];
  }

  const steps: string[] = [
    "Request the original NIN document. Compare name and date of birth yourself against the physical slip or NIMC digital ID.",
    "Verify the phone number directly. Call or WhatsApp — if it is unreachable or belongs to someone else, treat that as a red flag.",
  ];

  if (!employmentReviewerVerified) {
    steps.push(
      `Request proof of employment — offer letter, payslip, or HR contact from Indigene Systems (or directly from ${company}) to confirm the income claim.`,
    );
  }

  if (!addressReviewerOrDocVerified || !employmentReviewerVerified) {
    const parts: string[] = [];
    if (!addressReviewerOrDocVerified) parts.push("address (utility bill) verification");
    if (!employmentReviewerVerified) parts.push("employment verification");
    steps.push(
      `Wait for ${parts.join(" and ")} to complete before finalising any lease or relying on offer letter, payslip, or HR contact from Indigene Systems to confirm income.`,
    );
  } else {
    steps.push(
      "Address and employment are already verified on this report — you do not need further offer letter, payslip, or Indigene Systems HR steps to confirm income unless you see conflicting information.",
    );
  }

  return steps;
}

function affordabilityHeadline(v: VerificationResponse, band: RiskBand): string {
  const inc = v.monthlyIncome;
  if (!inc) return "Unconfirmed affordability estimate";
  if (band === "low" && inc >= 500_000) return "High capacity for typical rent bands";
  if (band === "moderate" || band === "elevated") return "Mid-range — confirm against your asking rent";
  if (band === "high") return "Unconfirmed until open checks close";
  return "Income on file — validate against rent";
}

function capacityBarPercent(v: VerificationResponse): number {
  const inc = v.monthlyIncome;
  if (!inc) return 15;
  const pct = Math.min(100, Math.round((inc / 2_000_000) * 100));
  return Math.max(20, pct);
}

function statusHeadline(band: RiskBand): { icon: string; text: string; className: string } {
  if (band === "low") {
    return {
      icon: "✓",
      text: "Verification completed — low risk tenant",
      className: "text-emerald-700",
    };
  }
  if (band === "moderate") {
    return {
      icon: "⚠",
      text: "Proceed with caution",
      className: "text-amber-700",
    };
  }
  if (band === "elevated") {
    return {
      icon: "⚠",
      text: "Proceed with caution — several items need attention",
      className: "text-orange-700",
    };
  }
  return {
    icon: "✕",
    text: "High risk — do not proceed",
    className: "text-red-700",
  };
}

function manualReviewEmploymentGuarantorCopy(
  kind: "employment" | "guarantor",
  state: ReturnType<typeof normalizedManualReviewState>,
): SectionReviewLine {
  if (state === "completed") {
    return {
      result: "Verification completed",
      notes:
        kind === "employment"
          ? "Employment details reviewed and confirmed."
          : "Guarantor details reviewed and confirmed.",
    };
  }
  if (state === "rejected") {
    return {
      result: "Could not verify",
      notes:
        kind === "employment"
          ? "Employment could not be verified."
          : "Guarantor could not be verified.",
    };
  }
  if (state === "pending") {
    return {
      result: "Pending",
      notes:
        kind === "employment"
          ? "Employment review in progress."
          : "Guarantor review in progress.",
    };
  }
  return {
    result: "Not reviewed",
    notes: "Awaiting reviewer assessment.",
  };
}

const VerificationResponsePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;
  const email = searchParams.get('email');
  
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null);
  const [verificationRequest, setVerificationRequest] = useState<{ verificationTier?: "standard" | "premium" } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      setLoading(true);
      try {
        if (!id || !email) {
          setError("Missing verification ID or email");
          return;
        }
        const [res, reqRes] = await Promise.all([
          apiService.get(`/verification/response/by-request/${id}?email=${encodeURIComponent(email)}`, { timeout: 60000 }),
          apiService.get(`/verification/${id}`, { timeout: 15000 }).catch(() => ({ data: {} })),
        ]);
        const data = res?.data?.data ?? res?.data ?? null;
        setVerificationData(data || null);
        const req = reqRes?.data?.data ?? reqRes?.data ?? null;
        setVerificationRequest(req || null);
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? err?.response?.data?.error ?? err?.message;
        setError(msg && typeof msg === "string" ? msg : "Failed to load verification data");
      } finally {
        setLoading(false);
      }
    };

    if (id && email) {
      fetchVerificationData();
    }
  }, [id, email]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  /** Initials only (e.g. "B. O.") for data privacy. */
  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setPdfExportLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      // JPEG + lower canvas scale keeps PDFs much smaller than PNG @ 2× with minimal visible loss for reports.
      const JPEG_QUALITY = 0.82;
      const imgData = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      const pageW = 210; // A4 width mm
      const imgH = (canvas.height * pageW) / canvas.width;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: imgH > 297 ? [pageW, imgH] : "a4",
        compress: true,
      });
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "JPEG", 0, 0, w, imgH, undefined, "MEDIUM");
      const name = (verificationData?.fullName || "tenant").replace(/\s+/g, "_");
      pdf.save(`Verification_Report_${name}.pdf`);
      toast.success("PDF downloaded.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to export PDF.");
    } finally {
      setPdfExportLoading(false);
    }
  };

  if (loading) {
    return (
      <LandLordLayout path="Verification" mainPath="/ Verification Response">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading verification details...</p>
          </div>
        </div>
      </LandLordLayout>
    );
  }

  if (error) {
    return (
      <LandLordLayout path="Verification" mainPath="/ Verification Response">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg mb-2">Error Loading Data</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </LandLordLayout>
    );
  }

  const verificationListPath = "/dashboard/landlord/properties/verification";

  if (!verificationData) {
    return (
      <LandLordLayout path="Verification" mainPath="/ Verification Response">
        <div className="m-6">
          <button
            onClick={() => router.push(verificationListPath)}
            className="flex items-center gap-2 text-sm text-[#667085] hover:text-[#101828] mb-6"
          >
            <MdArrowBackIos size={16} />
            Back to Tenant Verification
          </button>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <p className="text-gray-800 text-lg font-medium">Verification still pending</p>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                The report will appear here once your tenant finishes verification.
              </p>
            </div>
          </div>
        </div>
      </LandLordLayout>
    );
  }

  const empReview = manualReviewEmploymentGuarantorCopy(
    "employment",
    normalizedManualReviewState(
      verificationData.employmentReport,
      verificationData.landlordReport?.employmentSection,
    ),
  );
  const guReview = manualReviewEmploymentGuarantorCopy(
    "guarantor",
    normalizedManualReviewState(
      verificationData.guarantorReport,
      verificationData.landlordReport?.guarantorSection,
    ),
  );

  const riskScore = verificationData.landlordReport?.riskScore;
  const band = riskBandFromScore(riskScore);
  const headline = statusHeadline(band);
  const alertBox = criticalAlertCopy(band, verificationData);
  const idCh = identityNinCheck(verificationData);
  const phCh = phoneCheck(verificationData);
  const adCh = addressCheck(verificationData);
  const empCh = employmentCheckShort(empReview);
  const guCh = guarantorCheckShort(verificationData, guReview);
  const summaryParas = landlordSummaryParagraphs(verificationData, band);
  const nextSteps = recommendedNextSteps(band, verificationData);
  const aff = affordabilityHeadline(verificationData, band);
  const capPct = capacityBarPercent(verificationData);
  const strokeCol = gaugeColor(band);
  const gaugeR = 44;
  const circum = 2 * Math.PI * gaugeR;
  const dashLen = riskScore != null ? (riskScore / 100) * circum : 0;
  const tierLabel =
    verificationRequest?.verificationTier === "premium"
      ? "Premium screening"
      : verificationRequest?.verificationTier === "standard"
        ? "Standard screening"
        : null;

  return (
    <LandLordLayout path="Verification" mainPath="/ Verification Response">
      <div className="min-h-screen bg-[#F4F6F4] px-2 py-3 sm:px-6 sm:py-6 print:bg-white">
        <div className="max-w-[960px] mx-auto">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 mb-4 sm:mb-6 print:hidden">
            <button
              type="button"
              onClick={() => router.push(verificationListPath)}
              className="inline-flex items-center justify-center gap-2 text-sm text-[#667085] hover:text-[#101828] py-2.5 px-3 rounded-lg border border-gray-200 bg-white sm:border-0 sm:bg-transparent sm:py-0 sm:px-0 min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              <MdArrowBackIos size={18} className="shrink-0" />
              <span>Back to Tenant Verification</span>
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={pdfExportLoading}
              className="inline-flex items-center justify-center gap-2 text-sm text-nrvPrimaryGreen border border-nrvPrimaryGreen/30 rounded-lg px-4 py-2.5 bg-white disabled:opacity-60 min-h-[44px] touch-manipulation"
            >
              <FaFilePdf size={14} className="shrink-0" />
              {pdfExportLoading ? "Exporting…" : "Export PDF"}
            </button>
          </div>

          <div ref={reportRef} className="rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-hidden print:shadow-none print:border-gray-300">
            <div className="border-b border-gray-100 bg-gradient-to-b from-white to-[#FAFAFA] px-3 pb-4 pt-5 sm:px-8 sm:pb-6 sm:pt-8">
              <p className="text-center text-xs font-semibold tracking-[0.2em] text-nrvPrimaryGreen uppercase mb-1">
                NaijaRentVerify
              </p>
              <h1 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
                Tenant verification report
              </h1>
              <p className="text-center text-sm text-gray-500 mt-2 max-w-xl mx-auto">
                Landlord decision summary · Confidential
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600 border border-gray-100 rounded-xl py-3 px-4 bg-white/80">
                <span>
                  <span className="text-emerald-600 font-medium">✓</span> Low risk —{" "}
                  <span className="font-medium text-gray-800">Verification completed</span>
                </span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span>
                  <span className="text-amber-600 font-medium">⚠</span> Moderate — Caution
                </span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span>
                  <span className="text-red-600 font-medium">✕</span> High risk — Decline
                </span>
              </div>
            </div>

            <div className="space-y-5 px-3 py-4 sm:space-y-8 sm:px-8 sm:py-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
                <div className="relative w-[7.5rem] h-[7.5rem] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden>
                    <circle
                      cx="50"
                      cy="50"
                      r={gaugeR}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="9"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={gaugeR}
                      fill="none"
                      stroke={strokeCol}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${dashLen} ${circum}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 tabular-nums">
                      {riskScore ?? "—"}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gray-500">out of 100</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-lg sm:text-xl font-semibold text-gray-900">
                    {verificationData.fullName || "Tenant"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {verificationData.companyName || "—"}
                    {verificationData.monthlyIncome
                      ? ` · ${formatCurrency(verificationData.monthlyIncome)} / month`
                      : ""}
                  </p>
                  {tierLabel && (
                    <p className="text-xs text-nrvPrimaryGreen font-medium mt-2">{tierLabel}</p>
                  )}
                  <p
                    className={`mt-4 text-base font-semibold flex flex-wrap items-center justify-center sm:justify-start gap-2 ${headline.className}`}
                  >
                    <span aria-hidden>{headline.icon}</span>
                    <span>{headline.text}</span>
                  </p>
                  <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500 text-left max-w-md mx-auto sm:mx-0">
                    <div className="flex justify-between sm:block">
                      <dt className="text-gray-400">Reference</dt>
                      <dd className="font-mono text-gray-800">
                        {verificationData.verificationId
                          ? verificationData.verificationId.slice(-5).toUpperCase()
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between sm:block">
                      <dt className="text-gray-400">Report date</dt>
                      <dd className="text-gray-800">
                        {verificationData.landlordReport?.generatedAt
                          ? formatDate(verificationData.landlordReport.generatedAt)
                          : formatDate(new Date().toISOString())}
                      </dd>
                    </div>
                    <div className="flex justify-between sm:block sm:col-span-2">
                      <dt className="text-gray-400">Property</dt>
                      <dd className="text-gray-800">{(verificationData as { propertyAddress?: string }).propertyAddress || "—"}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {alertBox && (
                <div
                  className={`rounded-xl border-l-4 py-4 px-4 sm:px-5 ${
                    band === "high"
                      ? "bg-red-50 border-red-500"
                      : "bg-amber-50 border-amber-500"
                  }`}
                >
                  <p className="font-bold text-gray-900">{alertBox.title}</p>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{alertBox.body}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
                <div>
                  <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                    Verification checks
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700">Identity (NIN)</span>
                      <span className={toneClass(idCh.tone)}>{idCh.label}</span>
                    </li>
                    <li className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700">Phone number</span>
                      <span className={toneClass(phCh.tone)}>{phCh.label}</span>
                    </li>
                    <li className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700">Address</span>
                      <span className={toneClass(adCh.tone)}>{adCh.label}</span>
                    </li>
                    <li className="flex justify-between gap-4 text-sm border-b border-gray-100 pb-2">
                      <span className="text-gray-700">Employment</span>
                      <span className={toneClass(empCh.tone)}>{empCh.label}</span>
                    </li>
                    <li className="flex justify-between gap-4 text-sm pb-1">
                      <span className="text-gray-700">Guarantor</span>
                      <span className={toneClass(guCh.tone)}>{guCh.label}</span>
                    </li>
                  </ul>
                  <div className="mt-5 rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-600 space-y-2">
                    <p>
                      <span className="font-semibold text-gray-800">Employment (review):</span> {empReview.notes}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Guarantor (review):</span> {guReview.notes}
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                    Financial capacity
                  </h2>
                  <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-5">
                    <p className="text-2xl font-bold text-gray-900">
                      {verificationData.monthlyIncome
                        ? formatCurrency(verificationData.monthlyIncome)
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Monthly income (as stated)</p>
                    <p className="text-sm font-medium text-gray-800 mt-4">{aff}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-wide text-gray-400 mb-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all bg-nrvPrimaryGreen/80"
                          style={{ width: `${capPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Employment status</dt>
                      <dd className="text-gray-900 font-medium text-right">
                        {verificationData.employmentStatus || "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Company</dt>
                      <dd className="text-gray-900 font-medium text-right break-words max-w-[60%]">
                        {verificationData.companyName || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                  Landlord summary
                </h2>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  {summaryParas.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 print:break-inside-avoid">
                <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                  Recommended next steps
                </h2>
                <ol className="list-decimal list-outside ml-4 space-y-3 text-sm text-gray-700 leading-relaxed">
                  {nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <footer className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                <span>NaijaRentVerify · Tenant protection for Nigerian landlords</span>
                <span className="font-medium text-gray-400">Confidential report</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </LandLordLayout>
  );
};

export default VerificationResponsePage; 