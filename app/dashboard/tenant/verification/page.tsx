"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";

const TenantVerificationSummaryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationIdFromUrl = searchParams.get("verificationId");
  const [response, setResponse] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
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
      // No verificationId: use logged-in user email
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
        return;
      }
      try {
        const res = await apiService.get(`/verification/response/user/${userEmail}`);
        setResponse(res?.data ?? null);
      } catch {
        setResponse(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [verificationIdFromUrl]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!response) {
    const startUrl = verificationIdFromUrl
      ? `/dashboard/tenant/verification/personal-info?verificationId=${verificationIdFromUrl}`
      : "/dashboard/tenant/verification/personal-info";
    return (
      <div className="max-w-xl mx-auto w-full p-3 bg-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">No Verification Found</h2>
        <p className="mb-4">
          {request
            ? "Complete the form below to submit your verification to your landlord."
            : "You have not started or completed a verification yet."}
        </p>
        <button
          className="bg-nrvPrimaryGreen text-white px-6 py-2 rounded"
          onClick={() => router.push(startUrl)}
        >
          Start Verification
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full p-3 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">My Verification Submission</h2>
      <div className="space-y-2 text-left">
        <div><strong>Full Name:</strong> {response.fullName}</div>
        <div><strong>Email:</strong> {response.email}</div>
        <div><strong>Phone:</strong> {response.phone}</div>
        <div><strong>Date of Birth:</strong> {response.dateOfBirth ? new Date(response.dateOfBirth).toLocaleDateString() : '-'}</div>
        <div><strong>Address:</strong> {response.address}</div>
        <div><strong>Employment Status:</strong> {response.employmentStatus}</div>
        <div><strong>Company Name:</strong> {response.companyName}</div>
        <div><strong>Role in Company:</strong> {response.roleInCompany}</div>
        <div><strong>Current Employer:</strong> {response.currentEmployer}</div>
        <div><strong>Company Address:</strong> {response.companyAddress}</div>
        <div><strong>Monthly Income:</strong> {response.monthlyIncome}</div>
        <div><strong>Date Joined:</strong> {response.dateJoined}</div>
        <div><strong>Guarantor Name:</strong> {response.guarantorFirstName} {response.guarantorLastName}</div>
        <div><strong>Guarantor Email:</strong> {response.guarantorEmail}</div>
        <div><strong>Guarantor Phone:</strong> {response.guarantorPhone}</div>
        <div><strong>Guarantor Company:</strong> {response.guarantorCompany}</div>
        <div><strong>Guarantor Address:</strong> {response.guarantorHomeAddress || response.guarantorAddress}</div>
        <div><strong>Bank Statement:</strong> {response.bankStatementUrl ? <a href={response.bankStatementUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a> : '-'}</div>
        <div><strong>Utility Bill:</strong> {response.utilityBillUrl ? <a href={response.utilityBillUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a> : '-'}</div>
      </div>
      {response._id && (
        <div className="mt-6 text-center">
          <a
            href={`/verification/response/${response._id}`}
            className="text-nrvPrimaryGreen underline text-lg font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Detailed Verification Response
          </a>
        </div>
      )}
    </div>
  );
};

export default TenantVerificationSummaryPage;
