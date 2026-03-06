"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { FaFilePdf, FaDownload } from "react-icons/fa";
import { apiService } from "@/lib/api";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  documentsReport?: { status: string; comment?: string };
  phoneVerificationStatus?: string;
  nin?: string;
  ninVerificationStatus?: string;
  ninVerificationDate?: string;
  ninVerificationResult?: Record<string, unknown>;
  /** Saved Dojah credit summary snapshot (from admin checks). */
  creditSummary?: Record<string, unknown> | null;
  /** AML screening result (PEP, sanctions, adverse media) from Dojah. */
  amlScreeningResult?: Record<string, unknown> | null;
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
          apiService.get(`/verification/response/by-request/${id}?email=${encodeURIComponent(email)}`),
          apiService.get(`/verification/${id}`).catch(() => ({ data: {} })),
        ]);
        setVerificationData(res?.data?.data || res?.data || null);
        const req = reqRes?.data?.data ?? reqRes?.data ?? null;
        setVerificationRequest(req || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load verification data");
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
        <ToastContainer />
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
        <ToastContainer />
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

  if (!verificationData) {
    return (
      <LandLordLayout path="Verification" mainPath="/ Verification Response">
        <ToastContainer />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <p className="text-gray-600 text-lg">No verification data found</p>
          </div>
        </div>
      </LandLordLayout>
    );
  }

  return (
    <LandLordLayout path="Verification" mainPath="/ Verification Response">
      <ToastContainer />
      <div className="m-6 py-6 px-1 md:px-0 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-[1300px] mx-auto" ref={reportRef}>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-fit flex gap-1 items-center text-[#98A2B3] pr-3 border-r border-gray-100 text-xs">
                <MdArrowBackIos size={16} />
                <button onClick={() => router.back()} className="hover:underline">
                  Back
                </button>
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#101828]">View Tenant Verification Details</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPdf}
                  disabled={pdfExportLoading}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-[#101828] hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2"
                >
                  <FaFilePdf size={14} />
                  {pdfExportLoading ? "Exporting…" : "Export PDF"}
                </button>
              </div>
            </div>
          </div>

          {/* Reports & verification outcomes – NIN, AML, phone, credit summary, ID document, utility bill */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <p className="text-sm font-semibold text-[#101828]">Reports & verification outcomes</p>
            <p className="text-xs text-[#667085]">
              NIN, AML, phone, credit summary, ID document and utility bill status are included alongside the details below.
            </p>
            {verificationData.landlordReport ? (
              <>
                <p className="text-xs text-[#667085]">Generated at {formatDate(verificationData.landlordReport.generatedAt)}.</p>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="text-[#667085]">NIN:</span> <span className="capitalize">{verificationData.landlordReport.nin.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">AML risk:</span> <span className="capitalize">{verificationData.landlordReport.aml.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Phone:</span> <span className="capitalize">{verificationData.landlordReport.phone.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Credit summary:</span> <span className="capitalize">{verificationData.landlordReport.creditSummary.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">ID document:</span> <span className="capitalize">{verificationData.landlordReport.idDocument.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Utility bill:</span> <span className="capitalize">{verificationData.landlordReport.utilityBill.replace(/_/g, " ")}</span></p>
                </div>
                {((verificationData.ninVerificationResult as any)?.namesMatch !== undefined || (verificationData.ninVerificationResult as any)?.dobMatch !== undefined) && (
                  <div className="grid gap-2 text-sm sm:grid-cols-2 border-t border-gray-200 pt-2">
                    <p>
                      <span className="text-[#667085]">Name on NIN matches tenant:</span>{" "}
                      <span className={(verificationData.ninVerificationResult as any)?.namesMatch ? "text-green-600 font-medium" : (verificationData.ninVerificationResult as any)?.namesMatch === false ? "text-amber-600 font-medium" : ""}>
                        {(verificationData.ninVerificationResult as any)?.namesMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.namesMatch === false ? "No" : "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#667085]">DOB on NIN matches tenant:</span>{" "}
                      <span className={(verificationData.ninVerificationResult as any)?.dobMatch ? "text-green-600 font-medium" : (verificationData.ninVerificationResult as any)?.dobMatch === false ? "text-amber-600 font-medium" : ""}>
                        {(verificationData.ninVerificationResult as any)?.dobMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.dobMatch === false ? "No" : "—"}
                      </span>
                    </p>
                  </div>
                )}
                <div className="grid gap-2 text-sm sm:grid-cols-2 border-t border-gray-200 pt-2">
                  <p><span className="text-[#667085]">Personal section:</span> <span className="capitalize">{verificationData.landlordReport.personalSection.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Employment section:</span> <span className="capitalize">{verificationData.landlordReport.employmentSection.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Guarantor section:</span> <span className="capitalize">{verificationData.landlordReport.guarantorSection.replace(/_/g, " ")}</span></p>
                  <p><span className="text-[#667085]">Documents section:</span> <span className="capitalize">{verificationData.landlordReport.documentsSection.replace(/_/g, " ")}</span></p>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p><span className="text-[#667085]">NIN:</span> <span className="capitalize">{(verificationData.ninVerificationStatus || (verificationData.ninVerificationResult as any)?.status) || "—"}</span></p>
                  <p><span className="text-[#667085]">AML risk:</span> <span className="capitalize">{verificationData.amlScreeningResult ? ((verificationData.amlScreeningResult as any)?.entity?.risk_level ? String((verificationData.amlScreeningResult as any).entity.risk_level).replace(/_/g, " ") : "Completed") : "—"}</span></p>
                  <p><span className="text-[#667085]">Phone:</span> <span className="capitalize">{verificationData.phoneVerificationStatus || "—"}</span></p>
                  <p><span className="text-[#667085]">Credit summary:</span> <span className="capitalize">{verificationData.creditSummary ? "Available" : "—"}</span></p>
                  <p><span className="text-[#667085]">ID document:</span> <span className="capitalize">{verificationData.identificationDocumentUrl ? "Submitted" : "—"}</span></p>
                  <p><span className="text-[#667085]">Utility bill:</span> <span className="capitalize">{verificationData.utilityBillUrl ? "Submitted" : "—"}</span></p>
                </div>
                {((verificationData.ninVerificationResult as any)?.namesMatch !== undefined || (verificationData.ninVerificationResult as any)?.dobMatch !== undefined) && (
                  <div className="grid gap-2 text-sm sm:grid-cols-2 border-t border-gray-200 pt-2 mt-2">
                    <p>
                      <span className="text-[#667085]">Name on NIN matches tenant:</span>{" "}
                      <span className={(verificationData.ninVerificationResult as any)?.namesMatch ? "text-green-600 font-medium" : (verificationData.ninVerificationResult as any)?.namesMatch === false ? "text-amber-600 font-medium" : ""}>
                        {(verificationData.ninVerificationResult as any)?.namesMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.namesMatch === false ? "No" : "—"}
                      </span>
                    </p>
                    <p>
                      <span className="text-[#667085]">DOB on NIN matches tenant:</span>{" "}
                      <span className={(verificationData.ninVerificationResult as any)?.dobMatch ? "text-green-600 font-medium" : (verificationData.ninVerificationResult as any)?.dobMatch === false ? "text-amber-600 font-medium" : ""}>
                        {(verificationData.ninVerificationResult as any)?.dobMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.dobMatch === false ? "No" : "—"}
                      </span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Content grid – same structure as admin hub */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Personal Information */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#667085]">Full Name</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.fullName || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Email</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.email || "—"}</p>
                </div>
                {verificationData.phone && (
                  <div>
                    <p className="text-sm text-[#667085]">Phone</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#667085]">Date of birth</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.dateOfBirth ? formatDate(verificationData.dateOfBirth) : "—"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-[#667085]">Address</p>
                <p className="text-sm font-medium text-[#101828]">{verificationData.address || "—"}</p>
              </div>
              {verificationData.gender && (
                <div className="mt-4">
                  <p className="text-sm text-[#667085]">Gender</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.gender}</p>
                </div>
              )}
              {/* NIN verification status and alignment with applicant */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="text-sm font-medium text-[#101828]">NIN verification</span>
                  <span className={`text-sm font-medium ${(verificationData.ninVerificationStatus || (verificationData.ninVerificationResult as any)?.status) === "completed" || (verificationData.ninVerificationResult as any)?.status === "success" ? "text-green-600" : (verificationData.ninVerificationResult as any)?.status === "failed" ? "text-amber-600" : "text-[#667085]"}`}>
                    {(verificationData.ninVerificationResult as any)?.status === "failed" ? "Not verified" : verificationData.ninVerificationStatus === "completed" || (verificationData.ninVerificationResult as any)?.status === "success" ? "Verified" : "—"}
                  </span>
                </div>
                {(verificationData.ninVerificationResult as any)?.namesMatch !== undefined || (verificationData.ninVerificationResult as any)?.dobMatch !== undefined ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-2 text-sm">
                    <p className="font-medium text-[#101828]">NIN vs tenant submission</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#667085]">Name submitted by tenant matches name on NIN</span>
                      <span className={`font-medium ${(verificationData.ninVerificationResult as any)?.namesMatch ? "text-green-600" : "text-amber-600"}`}>
                        {(verificationData.ninVerificationResult as any)?.namesMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.namesMatch === false ? "No" : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#667085]">DOB submitted by tenant matches DOB on NIN</span>
                      <span className={`font-medium ${(verificationData.ninVerificationResult as any)?.dobMatch ? "text-green-600" : "text-amber-600"}`}>
                        {(verificationData.ninVerificationResult as any)?.dobMatch === true ? "Yes" : (verificationData.ninVerificationResult as any)?.dobMatch === false ? "No" : "—"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* AML screening – show when AML was carried out */}
            {verificationData.amlScreeningResult && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
                <h3 className="text-lg font-semibold text-[#101828] mb-4">AML screening</h3>
                <p className="text-sm text-[#667085] mb-3">PEP, sanctions and adverse media check has been carried out.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2">
                    <span className="text-[#667085]">Risk level</span>
                    <span className={`font-medium capitalize ${((verificationData.amlScreeningResult as any)?.entity?.risk_level === "low" && "text-green-600") || ((verificationData.amlScreeningResult as any)?.entity?.risk_level === "medium" && "text-amber-600") || ((verificationData.amlScreeningResult as any)?.entity?.risk_level === "high" && "text-red-600") || ""}`}>
                      {(verificationData.amlScreeningResult as any)?.entity?.risk_level ? String((verificationData.amlScreeningResult as any).entity.risk_level).replace(/_/g, " ") : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2">
                    <span className="text-[#667085]">Status</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                </div>
              </div>
            )}

            {/* Employment */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Employment</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-[#667085]">Employment Status</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.employmentStatus || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Role</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.roleInCompany || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Company</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.companyName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Date Joined</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.dateJoined ? formatDate(verificationData.dateJoined) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#667085]">Monthly Income</p>
                    <p className="text-sm font-medium text-[#101828]">{verificationData.monthlyIncome ? formatCurrency(verificationData.monthlyIncome) : "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Work Address</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.companyAddress || "—"}</p>
                </div>
              </div>
            </div>

            {/* Guarantor */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Guarantor</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#667085]">Name</p>
                  <p className="text-sm font-medium text-[#101828]">{[verificationData.guarantorFirstName, verificationData.guarantorLastName].filter(Boolean).join(" ") || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Phone</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.guarantorPhone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Email</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.guarantorEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Address</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.guarantorAddress || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Employment Status</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.guarantorEmploymentStatus || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#667085]">Company</p>
                  <p className="text-sm font-medium text-[#101828]">{verificationData.guarantorCompany || "—"}</p>
                </div>
              </div>
            </div>

            {/* Credit summary – included alongside reports */}
            {verificationData.creditSummary && (verificationData.creditSummary as any).entity && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 lg:col-span-2">
                <h3 className="text-lg font-semibold text-[#101828] mb-4">Credit summary</h3>
                {(() => {
                  const cs = verificationData.creditSummary as any;
                  const entity = cs.entity as { score?: { bureauStatus?: unknown; totalBorrowed?: { source?: string; value?: number }[]; totalOutstanding?: { source?: string; value?: number }[]; totalNoOfActiveLoans?: { source?: string; value?: number }[]; totalNoOfLoans?: { source?: string; value?: number }[] } } | undefined;
                  const score = entity?.score;
                  if (!score) return <p className="text-sm text-[#667085]">Credit report on file.</p>;
                  return (
                    <div className="space-y-2 text-sm">
                      {score.bureauStatus != null && (
                        <p className="text-[#667085]">Bureaus: {typeof score.bureauStatus === "object" ? Object.entries(score.bureauStatus as Record<string, unknown>).map(([k, v]) => `${k}: ${v}`).join(" · ") : String(score.bureauStatus)}</p>
                      )}
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(score.totalBorrowed ?? []).map((x, i) => (
                          <p key={i}><span className="text-[#667085]">Total borrowed ({x.source}):</span> {x.value != null ? formatCurrency(Number(x.value)) : "—"}</p>
                        ))}
                        {(score.totalOutstanding ?? []).map((x, i) => (
                          <p key={i}><span className="text-[#667085]">Total outstanding ({x.source}):</span> {x.value != null ? formatCurrency(Number(x.value)) : "—"}</p>
                        ))}
                        {(score.totalNoOfActiveLoans ?? []).map((x, i) => (
                          <p key={i}><span className="text-[#667085]">Active loans ({x.source}):</span> {x.value ?? "—"}</p>
                        ))}
                        {(score.totalNoOfLoans ?? []).map((x, i) => (
                          <p key={i}><span className="text-[#667085]">Total loans ({x.source}):</span> {x.value ?? "—"}</p>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Documents – check ID documents and other files (View / Download) */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-5 lg:col-span-2">
              <h3 className="text-lg font-semibold text-[#101828] mb-1">ID documents & other files</h3>
              <p className="text-sm text-[#667085] mb-4">Check and preview the identification document, bank statement and utility bill below. Use View to open or Download to save.</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#667085] mb-1">Identification Document</p>
                  {verificationData.identificationDocumentUrl ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                      <FaFilePdf className="text-red-500" size={16} />
                      <a href={verificationData.identificationDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#101828] hover:underline truncate flex-1">View</a>
                      <a href={verificationData.identificationDocumentUrl} download className="text-[#667085] hover:text-[#101828]"><FaDownload size={14} /></a>
                    </div>
                  ) : (
                    <p className="text-sm text-[#667085]">No document uploaded</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#667085] mb-1">Bank Statement</p>
                  {verificationData.bankStatementUrl ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                      <FaFilePdf className="text-red-500" size={16} />
                      <a href={verificationData.bankStatementUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#101828] hover:underline truncate flex-1">View</a>
                      <a href={verificationData.bankStatementUrl} download className="text-[#667085] hover:text-[#101828]"><FaDownload size={14} /></a>
                    </div>
                  ) : (
                    <p className="text-sm text-[#667085]">No document uploaded</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#667085] mb-1">Utility Bill</p>
                  {verificationData.utilityBillUrl ? (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-3">
                      <FaFilePdf className="text-red-500" size={16} />
                      <a href={verificationData.utilityBillUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#101828] hover:underline truncate flex-1">View</a>
                      <a href={verificationData.utilityBillUrl} download className="text-[#667085] hover:text-[#101828]"><FaDownload size={14} /></a>
                    </div>
                  ) : (
                    <p className="text-sm text-[#667085]">No document uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {verificationData.previousLandlordComments && verificationData.previousLandlordComments.length > 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
              <p className="text-sm font-semibold text-[#101828] mb-2">Previous landlord experience</p>
              <div className="space-y-2">
                {verificationData.previousLandlordComments.map((item, idx) => (
                  <p key={idx} className="text-sm text-[#344054]">{item.comment}{item.landlordName ? ` – ${item.landlordName}` : ""}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </LandLordLayout>
  );
};

export default VerificationResponsePage; 