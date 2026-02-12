"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import TenantLayout from "@/app/components/layout/TenantLayout";

function formatValue(value: any) {
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function formatDate(value: any) {
  try {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString();
  } catch {
    return "—";
  }
}

function DocLink({ label, url }: { label: string; url?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="text-sm font-medium text-gray-800">{label}</div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-nrvPrimaryGreen hover:underline"
        >
          View
        </a>
      ) : (
        <div className="text-sm text-gray-500">—</div>
      )}
    </div>
  );
}

function KVGrid({ items }: { items: Array<{ label: string; value: any }> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="text-xs font-medium text-gray-500">{it.label}</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 break-words">
            {formatValue(it.value)}
          </div>
        </div>
      ))}
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
        <div className="p-8 text-center text-gray-600">Loading...</div>
      </TenantLayout>
    );
  }

  // If a specific requestId is selected, render the submission details view (or a CTA to submit).
  if (verificationIdFromUrl) {
    if (!response) {
      const startUrl = `/dashboard/tenant/verification/personal-info?verificationId=${verificationIdFromUrl}`;
      return (
        <TenantLayout path="Verification" mainPath=" / My Submissions" subMainPath="Details">
          <div className="max-w-2xl mx-auto w-full p-5 bg-white rounded-xl border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">No submission found</h2>
            <p className="text-sm text-gray-600 mb-6">
              {request
                ? "You haven’t submitted this verification yet. Complete the form to submit it to your landlord."
                : "You haven’t submitted this verification yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="bg-nrvPrimaryGreen text-white px-6 py-2.5 rounded-lg font-semibold"
                onClick={() => router.push(startUrl)}
              >
                Start / Continue verification
              </button>
              <button
                className="border border-gray-200 px-6 py-2.5 rounded-lg font-semibold text-gray-800 hover:bg-gray-50"
                onClick={() => router.push("/dashboard/tenant/verification/requests")}
              >
                Back to My Verifications
              </button>
            </div>
          </div>
        </TenantLayout>
      );
    }

    return (
      <TenantLayout path="Verification" mainPath=" / My Submissions" subMainPath="Details">
        <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My verification submission</h1>
              <p className="text-sm text-gray-600 mt-1">
                {request?.landlordDisplayName ? (
                  <>
                    Requested by <span className="font-semibold">{request.landlordDisplayName}</span>
                  </>
                ) : (
                  "Submission details"
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="border border-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-800 hover:bg-gray-50"
                onClick={() => router.push("/dashboard/tenant/verification/requests")}
              >
                Back to My Verifications
              </button>
              <button
                className="bg-nrvPrimaryGreen text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() =>
                  router.push(`/dashboard/tenant/verification/personal-info?verificationId=${verificationIdFromUrl}`)
                }
              >
                Open in form
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Personal</h2>
                  <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">
                    Submitted
                  </span>
                </div>
                <KVGrid
                  items={[
                    { label: "Full name", value: response.fullName },
                    { label: "Email", value: response.email },
                    { label: "Phone", value: response.phone },
                    { label: "Date of birth", value: formatDate(response.dateOfBirth) },
                    { label: "Gender", value: response.gender },
                    { label: "Address", value: response.address },
                  ]}
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Employment</h2>
                <KVGrid
                  items={[
                    { label: "Employment status", value: response.employmentStatus },
                    { label: "Company name", value: response.companyName },
                    { label: "Role in company", value: response.roleInCompany },
                    { label: "Company address", value: response.companyAddress },
                    { label: "Monthly income", value: response.monthlyIncome },
                    { label: "Date joined", value: response.dateJoined },
                  ]}
                />
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Guarantor</h2>
                <KVGrid
                  items={[
                    { label: "Name", value: `${response.guarantorFirstName || ""} ${response.guarantorLastName || ""}`.trim() },
                    { label: "Email", value: response.guarantorEmail },
                    { label: "Phone", value: response.guarantorPhone },
                    { label: "Company", value: response.guarantorCompany },
                    { label: "Employment status", value: response.guarantorEmploymentStatus },
                    { label: "Address", value: response.guarantorHomeAddress || response.guarantorAddress },
                  ]}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Documents</h2>
                <div className="mt-3">
                  <DocLink label="Bank statement" url={response.bankStatementUrl} />
                  <DocLink label="Utility bill" url={response.utilityBillUrl} />
                  <DocLink label="Identification document" url={response.identificationDocumentUrl} />
                </div>
                <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="text-xs font-medium text-gray-500">ID type</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {formatValue(response.identificationDocumentType)}
                  </div>
                </div>
              </div>

              {request && (
                <div className="bg-white border border-gray-100 rounded-xl p-5">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Request</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-semibold capitalize">{formatValue(request.status)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Requested on</span>
                      <span className="font-semibold">{request.dateRequested ? new Date(request.dateRequested).toLocaleString() : "—"}</span>
                    </div>
                  </div>
                </div>
              )}
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
        <div className="max-w-2xl mx-auto w-full p-5 bg-white rounded-xl border border-gray-100 text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">No submissions yet</h2>
          <p className="text-sm text-gray-600 mb-6">
            You don’t have any submitted verifications yet.
          </p>
          <button
            className="bg-nrvPrimaryGreen text-white px-6 py-2.5 rounded-lg font-semibold"
            onClick={() => router.push("/dashboard/tenant/verification/requests")}
          >
            Go to My Verifications
          </button>
        </div>
      </TenantLayout>
    );
  }

  return (
    <TenantLayout path="Verification" mainPath=" / My Submissions">
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My submissions</h1>
            <p className="text-sm text-gray-600 mt-1">
              View submissions you’ve completed for landlord verification requests.
            </p>
          </div>
          <button
            className="border border-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-800 hover:bg-gray-50"
            onClick={() => router.push("/dashboard/tenant/verification/requests")}
          >
            My Verifications
          </button>
        </div>

        <div className="grid gap-4">
          {submittedRequests.map((req: any) => (
            <button
              key={req._id}
              className="text-left border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow bg-white"
              onClick={() => router.push(`/dashboard/tenant/verification?verificationId=${req._id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="font-semibold text-gray-900">
                  {req.firstName} {req.lastName}
                </div>
                <span className="w-fit text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1">
                  Submitted
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {req.email} · {req.phone}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Requested on: {req.dateRequested ? new Date(req.dateRequested).toLocaleString() : "—"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </TenantLayout>
  );
};

export default TenantVerificationSummaryPage;
