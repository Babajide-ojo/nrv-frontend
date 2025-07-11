"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";

const TenantVerificationSummaryPage = () => {
  const router = useRouter();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user email from localStorage
    let userEmail = null;
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("nrv-user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          userEmail = userObj?.user?.email || userObj?.email;
        } catch {}
      }
    }
    if (!userEmail) {
      setLoading(false);
      setResponse(null);
      return;
    }
    fetchResponse(userEmail);
    // eslint-disable-next-line
  }, []);

  const fetchResponse = async (email: string) => {
    setLoading(true);
    try {
      const res = await apiService.get(`/verification/response/user/${email}`);
      setResponse(res?.data || null);
    } catch (error) {
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!response) {
    return (
      <div className="max-w-xl mx-auto w-full p-3 bg-white rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">No Verification Found</h2>
        <p className="mb-4">You have not started or completed a verification yet.</p>
        <button
          className="bg-nrvPrimaryGreen text-white px-6 py-2 rounded"
          onClick={() => router.push("/dashboard/tenant/verification/personal-info")}
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
