"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdArrowBackIos, MdEmail, MdPhone, MdBusiness, MdLocationOn, MdDateRange, MdPerson, MdWork, MdShield } from "react-icons/md";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";

function formatValue(value: any) {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function formatDate(value: any) {
  try {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return "—";
  }
}

function SectionRow({ icon: Icon, label, value }: { icon?: any; label: string; value: any }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{formatValue(value)}</p>
      </div>
    </div>
  );
}

function DocCard({ label, url }: { label: string; url?: string }) {
  return (
    <div className="flex items-center p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 shrink-0">
        <FaFileAlt size={14} />
      </div>
      <div className="flex-1 min-w-0 mr-2">
        <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {url ? "Uploaded" : "Not provided"}
        </p>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-green-700 hover:text-green-800 hover:underline shrink-0"
        >
          View
        </a>
      )}
    </div>
  );
}

const TenantVerificationSummaryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationIdFromUrl = searchParams.get("verificationId");
  const [response, setResponse] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [submittedRequests, setSubmittedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      // If we have verificationId from the invite link, fetch the verification request and use its email
      if (verificationIdFromUrl) {
        try {
          const reqRes = await apiService.get(`/verification/${verificationIdFromUrl}`);
          const req = reqRes?.data?.data ?? reqRes?.data ?? null;
          setRequest(req);
          if (req && typeof window !== "undefined") {
            if (req.email) sessionStorage.setItem("verification-request-email", req.email);
            if (req.firstName) sessionStorage.setItem("verification-request-firstName", req.firstName);
            if (req.lastName) sessionStorage.setItem("verification-request-lastName", req.lastName);
          }
          // Check if tenant already submitted a response for this request
          if (req?.email) {
            try {
              const resRes = await apiService.get(
                `/verification/response/by-request/${verificationIdFromUrl}?email=${encodeURIComponent(req.email)}`
              );
              const resData = resRes?.data?.data ?? resRes?.data ?? null;
              setResponse(resData);
            } catch {
              setResponse(null);
            }
          } else {
            setResponse(null);
          }
        } catch {
          setRequest(null);
          setResponse(null);
        } finally {
          setLoading(false);
          return;
        }
      }
      // No verificationId: list submitted requests for the signed-in tenant (by email)
      let userEmail: string | null = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            userEmail = userObj?.user?.email || userObj?.email || null;
          } catch {}
        }
      }
      if (!userEmail) {
        setLoading(false);
        setResponse(null);
        setSubmittedRequests([]);
        return;
      }
      try {
        const reqRes: any = await apiService.get(`/verification/by-email?email=${encodeURIComponent(userEmail)}`);
        const list = (reqRes?.data?.data ?? reqRes?.data) || [];
        const requests = Array.isArray(list) ? list : [];
        const pairs = await Promise.allSettled(
          requests.map(async (req: any) => {
            const r: any = await apiService.get(
              `/verification/response/by-request/${req._id}?email=${encodeURIComponent(userEmail as string)}`,
            );
            const data = r?.data?.data ?? r?.data ?? null;
            return { req, response: data };
          }),
        );
        const submitted = pairs
          .filter((p) => p.status === "fulfilled" && (p as any).value.response)
          .map((p: any) => ({ ...p.value.req, submission: p.value.response }));
        setSubmittedRequests(submitted);
      } catch {
        setSubmittedRequests([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [verificationIdFromUrl]);

  if (loading) {
    return (
      <TenantLayout path="Verification" mainPath=" / My Submissions">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-green-600"></div>
        </div>
      </TenantLayout>
    );
  }

  // If a specific requestId is selected, render the submission details view (or a CTA to submit).
  if (verificationIdFromUrl) {
    if (!response) {
      const startUrl = `/dashboard/tenant/verification/personal-info?verificationId=${verificationIdFromUrl}`;
      return (
        <TenantLayout path="Verification" mainPath=" / My Submissions" subMainPath="Details">
          <div className="max-w-2xl mx-auto w-full p-8 bg-white rounded-xl border border-gray-100 text-center shadow-sm mt-8">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFileAlt className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">Verification Pending</h2>
            <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto">
              {request
                ? "You haven't submitted this verification request yet. Please complete the form to proceed."
                : "This verification request hasn't been submitted yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/tenant/verification/requests")}
              >
                Back to List
              </Button>
              <Button
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => router.push(startUrl)}
              >
                Start Verification
              </Button>
            </div>
          </div>
        </TenantLayout>
      );
    }

    const justCompleted = searchParams.get("completed") === "1";

    return (
      <TenantLayout path="Verification" mainPath=" / My Submissions" subMainPath="Details">
        <div className="max-w-5xl mx-auto w-full p-4 sm:p-6">
          {justCompleted && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex gap-3 items-start">
              <FaCheckCircle className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Verification Submitted Successfully</p>
                <p className="text-sm text-green-800 mt-1">
                  Your details have been sent to our verification team. You can review your submission below.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-gray-500 hover:text-gray-900 hover:bg-transparent"
                  onClick={() => router.push("/dashboard/tenant/verification/requests")}
                >
                  <MdArrowBackIos className="mr-1" /> Back
                </Button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
              <p className="text-sm text-gray-500 mt-1">
                Reference: <span className="font-mono text-gray-700">{request?._id?.slice(-8).toUpperCase() || "—"}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></span>
                Submitted
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
                    <MdPerson className="text-gray-400" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 p-5">
                    <SectionRow label="Full Name" value={response.fullName} icon={MdPerson} />
                    <SectionRow label="Email Address" value={response.email} icon={MdEmail} />
                    <SectionRow label="Phone Number" value={response.phone} icon={MdPhone} />
                    <SectionRow label="Date of Birth" value={formatDate(response.dateOfBirth)} icon={MdDateRange} />
                    <SectionRow label="Gender" value={response.gender} icon={MdPerson} />
                    <SectionRow label="Current Address" value={response.address} icon={MdLocationOn} />
                  </div>
                </CardContent>
              </Card>

              {/* Employment Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
                    <MdWork className="text-gray-400" /> Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 p-5">
                    <SectionRow label="Employment Status" value={response.employmentStatus} icon={MdWork} />
                    <SectionRow label="Company Name" value={response.companyName} icon={MdBusiness} />
                    <SectionRow label="Job Role" value={response.roleInCompany} icon={MdPerson} />
                    <SectionRow label="Monthly Income" value={response.monthlyIncome ? `₦${Number(response.monthlyIncome).toLocaleString()}` : "—"} icon={undefined} />
                    <SectionRow label="Date Joined" value={formatDate(response.dateJoined)} icon={MdDateRange} />
                    <SectionRow label="Company Address" value={response.companyAddress} icon={MdLocationOn} />
                  </div>
                </CardContent>
              </Card>

              {/* Guarantor Info */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-900">
                    <MdShield className="text-gray-400" /> Guarantor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 p-5">
                    <SectionRow label="Guarantor Name" value={`${response.guarantorFirstName || ""} ${response.guarantorLastName || ""}`.trim()} icon={MdPerson} />
                    <SectionRow label="Email Address" value={response.guarantorEmail} icon={MdEmail} />
                    <SectionRow label="Phone Number" value={response.guarantorPhone} icon={MdPhone} />
                    <SectionRow label="Relationship" value={response.guarantorRelationship} icon={MdPerson} />
                    <SectionRow label="Occupation" value={response.guarantorEmploymentStatus} icon={MdWork} />
                    <SectionRow label="Address" value={response.guarantorHomeAddress || response.guarantorAddress} icon={MdLocationOn} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Request Details */}
              <Card className="border-gray-200 shadow-sm bg-gray-50/50">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="text-sm font-semibold text-gray-900">Request Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requested By</p>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                        {(request?.landlordDisplayName || "L")[0]}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{request?.landlordDisplayName || "Landlord"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date Requested</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(request?.dateRequested)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                      {request?.status || "Pending"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <CardTitle className="text-sm font-semibold text-gray-900">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <DocCard label="Bank Statement" url={response.bankStatementUrl} />
                  <DocCard label="Utility Bill" url={response.utilityBillUrl} />
                  <DocCard label="ID Document" url={response.identificationDocumentUrl} />
                  
                  {response.identificationDocumentType && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                      <p className="text-xs text-gray-500">ID Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">{response.identificationDocumentType.replace(/_/g, ' ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TenantLayout>
    );
  }

  // No request selected: show a list of the tenant's submitted verifications.
  if (!submittedRequests.length) {
    return (
      <TenantLayout path="Verification" mainPath=" / My Submissions">
        <div className="max-w-2xl mx-auto w-full p-8 bg-white rounded-xl border border-gray-100 text-center shadow-sm mt-8">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileAlt className="text-gray-300 text-2xl" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-900">No submissions yet</h2>
          <p className="text-sm text-gray-600 mb-8">
            You haven't submitted any verification requests yet. Check your pending requests to get started.
          </p>
          <Button
            className="bg-green-700 hover:bg-green-800 text-white"
            onClick={() => router.push("/dashboard/tenant/verification/requests")}
          >
            View Pending Requests
          </Button>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout path="Verification" mainPath=" / My Submissions">
      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
            <p className="text-sm text-gray-600 mt-1">
              History of your completed verification requests.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/tenant/verification/requests")}
          >
            View Pending
          </Button>
        </div>

        <div className="grid gap-4">
          {submittedRequests.map((req: any) => (
            <div
              key={req._id}
              className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer"
              onClick={() => router.push(`/dashboard/tenant/verification?verificationId=${req._id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <FaCheckCircle size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {req.firstName} {req.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {req.email}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MdDateRange size={14} />
                        {new Date(req.dateRequested).toLocaleDateString()}
                      </span>
                      {req.landlordDisplayName && (
                        <span className="flex items-center gap-1">
                          <MdPerson size={14} />
                          {req.landlordDisplayName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    Submitted
                  </span>
                  <MdArrowBackIos className="text-gray-300 rotate-180 group-hover:text-green-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TenantLayout>
  );
};

export default TenantVerificationSummaryPage;
