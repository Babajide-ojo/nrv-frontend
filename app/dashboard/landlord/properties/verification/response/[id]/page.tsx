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
  videoSelfieVerified?: string;
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

const VerificationResponsePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;
  const email = searchParams.get('email');
  
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null);
  const [verificationRequest, setVerificationRequest] = useState<{ verificationTier?: "standard" | "premium" } | null>(null);
  const [landlord, setLandlord] = useState<{ firstName?: string; lastName?: string; email?: string; _id?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfExportLoading, setPdfExportLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nrv-user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setLandlord(parsed?.user ?? parsed ?? null);
      }
    } catch {
      setLandlord(null);
    }
  }, []);

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

  /** ID document status from backend: landlordReport.idDocument or derived from analysis. */
  const getIdDocumentStatus = (): string => {
    if (verificationData.landlordReport?.idDocument) {
      return String(verificationData.landlordReport.idDocument).replace(/_/g, " ");
    }
    if (!verificationData.identificationDocumentUrl) return "Not provided";
    const analysis = verificationData.identificationDocumentAnalysis as { status?: string } | undefined;
    if (analysis?.status === "failed") return "Failed";
    if (analysis?.status) return "Verified";
    return "Not run";
  };

  /** Utility bill status from backend: landlordReport.utilityBill or derived from analysis. */
  const getUtilityBillStatus = (): string => {
    if (verificationData.landlordReport?.utilityBill) {
      return String(verificationData.landlordReport.utilityBill).replace(/_/g, " ");
    }
    if (!verificationData.utilityBillUrl) return "Not provided";
    const analysis = verificationData.utilityBillAnalysis as { status?: string } | undefined;
    if (analysis?.status === "failed") return "Failed";
    if (analysis?.status) return "Verified";
    return "Not run";
  };

  /** Use actual admin review status when present; only show "Not reviewed" when no review exists. */
  const getSectionDisplay = (
    report: { status?: string } | null | undefined,
    landlordSection?: string
  ): string => {
    const raw = report?.status ?? landlordSection ?? "not_reviewed";
    const formatted = String(raw).replace(/_/g, " ").toLowerCase();
    if (formatted === "not reviewed" || formatted === "not_reviewed") return "Not reviewed";
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
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
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pageW = 210; // A4 width mm
      const imgW = pageW;
      const imgH = (canvas.height * pageW) / canvas.width;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: imgH > 297 ? [pageW, imgH] : "a4",
      });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, w, imgH);
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
              <p className="text-gray-600 text-lg">No verification data found</p>
            </div>
          </div>
        </div>
      </LandLordLayout>
    );
  }

  return (
    <LandLordLayout path="Verification" mainPath="/ Verification Response">
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-[1300px] mx-auto" ref={reportRef}>
          {/* Back + Export – responsive nav */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => router.push(verificationListPath)}
              className="inline-flex items-center justify-center gap-2 text-sm text-[#667085] hover:text-[#101828] py-2.5 px-3 rounded-lg border border-gray-200 bg-white sm:border-0 sm:bg-transparent sm:py-0 sm:px-0 min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              <MdArrowBackIos size={18} className="shrink-0" />
              <span>Back to Tenant Verification</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={pdfExportLoading}
              className="inline-flex items-center justify-center gap-2 text-sm text-[#667085] hover:text-[#101828] border border-gray-200 rounded-lg px-4 py-2.5 bg-white disabled:opacity-60 min-h-[44px] touch-manipulation"
            >
              <FaFilePdf size={14} className="shrink-0" />
              {pdfExportLoading ? "Exporting…" : "Export PDF"}
            </button>
          </div>

          {/* Report header + recipient */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#101828] text-center mb-4 sm:mb-6">Naija Rent Verify</h1>
            <h2 className="text-base sm:text-lg font-semibold text-[#101828] text-center mb-4 sm:mb-6">Landlord Decision Summary</h2>
            
            <div className="border rounded-lg overflow-hidden mb-6 sm:mb-8 overflow-x-auto">
              <table className="w-full min-w-[280px] text-sm text-left">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600 w-1/3 min-w-[120px]">Verification ID</th>
                    <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.verificationId ? verificationData.verificationId.slice(-5).toUpperCase() : "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Tenant Name</th>
                    <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.fullName || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Property</th>
                    <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{(verificationData as any).propertyAddress || "—"}</td>
                  </tr>
                  <tr>
                    <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Report Date</th>
                    <td className="px-3 sm:px-4 py-3 text-gray-900">
                      {verificationData.landlordReport?.generatedAt 
                        ? formatDate(verificationData.landlordReport.generatedAt) 
                        : formatDate(new Date().toISOString())}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Overall Tenant Risk Assessment */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-[#101828] mb-3">Overall Tenant Risk Assessment</h3>
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[280px] text-sm text-left">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600 w-1/3 min-w-[120px]">Tenant Risk Score</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{verificationData.landlordReport?.riskScore != null ? `${verificationData.landlordReport.riskScore} / 100` : "—"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Risk Category</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{verificationData.landlordReport?.riskCategory || "—"}</td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Recommendation</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.landlordReport?.recommendation || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Verification Results */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-[#101828] mb-3">Key Verification Results</h3>
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[320px] text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 font-medium text-gray-600 min-w-[100px]">Category</th>
                      <th className="px-3 sm:px-4 py-3 font-medium text-gray-600 min-w-[80px]">Result</th>
                      <th className="px-3 sm:px-4 py-3 font-medium text-gray-600">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 sm:px-4 py-3 text-gray-900">Identity Verification</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{((verificationData.ninVerificationResult as any)?.namesMatch && (verificationData.ninVerificationResult as any)?.dobMatch) ? "Verified" : "Partial Match"}</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs sm:text-sm">{(verificationData.ninVerificationResult as any)?.namesMatch && (verificationData.ninVerificationResult as any)?.dobMatch ? "NIN verified and matches tenant details" : "NIN verified but name/DOB mismatch"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 sm:px-4 py-3 text-gray-900">Phone Verification</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{verificationData.phoneVerificationStatus === "valid" ? "Verified" : "Invalid"}</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs sm:text-sm">{verificationData.phoneVerificationStatus === "valid" ? "Phone number verified" : "Phone not verified"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-3 sm:px-4 py-3 text-gray-900">Address Verification</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{getUtilityBillStatus() === "Verified" ? "Verified" : "Pending"}</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs sm:text-sm">{getUtilityBillStatus() === "Verified" ? "Utility bill confirmed" : "Utility bill review pending or failed"}</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">Employment Verification</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{getSectionDisplay(verificationData.employmentReport, verificationData.landlordReport?.employmentSection) === "Verified" ? "Verified" : "Pending"}</td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs sm:text-sm">{getSectionDisplay(verificationData.employmentReport, verificationData.landlordReport?.employmentSection) === "Verified" ? "Active employment confirmed" : "Employment review pending"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Important Flags Detected */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-[#101828] mb-3">Important Flags Detected</h3>
              <p className="text-sm text-gray-900 break-words">
                {((verificationData.ninVerificationResult as any)?.namesMatch === false || (verificationData.ninVerificationResult as any)?.dobMatch === false)
                  ? "Identity Data Mismatch: Tenant submitted personal details that do not fully match NIN records. Landlords are advised to request clarification before lease approval."
                  : "No critical identity mismatch flags detected."}
              </p>
            </div>

            {/* Financial Capacity */}
            <div className="mb-0">
              <h3 className="text-base sm:text-lg font-bold text-[#101828] mb-3">Financial Capacity</h3>
              <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[280px] text-sm text-left">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600 w-1/3 min-w-[120px]">Employment Status</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.employmentStatus || "—"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Company</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.companyName || "—"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Monthly Income</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900">{verificationData.monthlyIncome ? formatCurrency(verificationData.monthlyIncome) : "—"}</td>
                    </tr>
                    <tr>
                      <th className="bg-gray-50 px-3 sm:px-4 py-3 font-medium text-gray-600">Affordability Estimate</th>
                      <td className="px-3 sm:px-4 py-3 text-gray-900 break-words">{verificationData.monthlyIncome && verificationData.monthlyIncome > 500000 ? "Supports mid-range rental payments" : "Income verification recommended"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </LandLordLayout>
  );
};

export default VerificationResponsePage; 