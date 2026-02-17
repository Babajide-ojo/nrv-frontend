"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { FaCheck, FaTimes, FaClock, FaUserCircle, FaCheckCircle, FaFilePdf, FaDownload, FaEye } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineUser, HiOutlineCalendar, HiOutlineUserGroup } from "react-icons/hi";
import { apiService } from "@/lib/api";
import LandLordLayout from "@/app/components/layout/LandLordLayout";

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
}

const VerificationResponsePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = params;
  const email = searchParams.get('email');
  
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationData = async () => {
      setLoading(true);
      try {
        if (!id || !email) {
          setError("Missing verification ID or email");
          return;
        }
        
        const res = await apiService.get(`/verification/response/by-request/${id}?email=${encodeURIComponent(email)}`);
        setVerificationData(res?.data?.data || res?.data || null);
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheck className="text-green-500" size={16} />;
      case 'rejected':
        return <FaTimes className="text-red-500" size={16} />;
      case 'pending':
        return <FaClock className="text-yellow-500" size={16} />;
      default:
        return <FaClock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  if (!verificationData) {
    return (
      <LandLordLayout path="Verification" mainPath="/ Verification Response">
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
      <div className="m-6 py-6 px-1 md:px-0 bg-[#FAFAFA] min-h-screen">
        <div className="max-w-[1300px] mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-fit flex gap-1 items-center text-[#98A2B3] pr-3 border-r border-gray-100 text-xs">
              <MdArrowBackIos size={16} />
              <button onClick={() => router.back()} className="hover:underline">Back</button>
            </div>
            <p className="text-[16px] font-bold text-[#101828]">View Tenant Verification Details</p>
          </div>

          {/* Main Grid */}
          <div className="md:flex gap-4">
            {/* Profile Card */}
            <div className="md:w-1/3 w-full col-span-1 bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center border border-gray-100">
              <div className="mb-2">
                <FaUserCircle size={64} className="text-gray-200" />
              </div>
              <div className="text-[13px] font-semibold text-center mb-1 text-[#101828]">{verificationData.fullName || "-"}</div>
              <div className="w-full flex flex-col gap-2 mt-2">
                <div className="flex flex-col gap-0.5 mt-2">
                  <div className="text-[10px] text-[#98A2B3]">Phone Number</div>
                  <div className="font-medium text-[12px] text-[#344054]">{verificationData.phone || "-"}</div>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[10px] text-[#98A2B3]">Email Address</div>
                  <div className="font-medium text-[12px] text-[#344054]">{verificationData.email || "-"}</div>
                </div>
              </div>
              {verificationData.previousLandlordComments && verificationData.previousLandlordComments.length > 0 && (
                <div className="w-full mt-4">
                  <div className="bg-[#F9FAFB] rounded-xl p-3 flex flex-col gap-2 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1 text-[12px] font-semibold text-[#101828]">
                      <span className="text-lg">😍</span>
                      Previous Overall Experience with this Tenant!
                    </div>
                    <div className="text-[10px] text-[#344054] flex flex-col gap-2">
                      {verificationData.previousLandlordComments.map((item, idx) => (
                        <div key={idx}>
                          <span className="font-medium text-[#98A2B3]">Previous Landlord Comments</span>
                          <div className="text-[#667085]">{item.comment}{item.landlordName ? ` – ${item.landlordName}` : ""}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Cards Section - matches reference image */}
            <div className="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col min-h-[180px] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[13px] text-[#101828]">Personal Information</span>
                  <BsThreeDotsVertical className="text-gray-400 text-base" />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <HiOutlineUser className="text-gray-400 text-lg" />
                    <div>
                      <div className="text-[10px] text-[#667085]">Marital Status</div>
                      <div className="font-semibold text-[12px] text-[#101828]">{verificationData.maritalStatus || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HiOutlineUserGroup className="text-gray-400 text-lg" />
                    <div>
                      <div className="text-[10px] text-[#667085]">Gender</div>
                      <div className="font-semibold text-[12px] text-[#101828]">{verificationData.gender || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <HiOutlineCalendar className="text-gray-400 text-lg" />
                    <div>
                      <div className="text-[10px] text-[#667085]">Date Birth</div>
                      <div className="font-semibold text-[12px] text-[#101828]">{formatDate(verificationData.dateOfBirth || "")}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Identity Verification - only show items with backend data */}
              {(verificationData.videoSelfieVerified || verificationData.personalReport?.status || verificationData.documentsReport?.status || verificationData.identificationDocumentUrl || verificationData.phoneVerificationStatus) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col min-h-[180px] relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[13px] text-[#101828]">Identity Verification</span>
                    <BsThreeDotsVertical className="text-gray-400 text-base" />
                  </div>
                  <div className="flex flex-col gap-4 mt-1">
                    {verificationData.videoSelfieVerified && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#101828]">Video Selfie Identification</span>
                        <span className={`flex items-center gap-1 font-medium text-[11px] ${verificationData.videoSelfieVerified?.toLowerCase() === "approved" || verificationData.videoSelfieVerified?.toLowerCase() === "verified" ? "text-green-600" : "text-gray-600"}`}>
                          {getStatusIcon(verificationData.videoSelfieVerified)}
                          {verificationData.videoSelfieVerified}
                        </span>
                      </div>
                    )}
                    {(verificationData.documentsReport?.status || verificationData.identificationDocumentUrl) && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#101828]">Identification Documents</span>
                        <span className={`flex items-center gap-1 font-medium text-[11px] ${(verificationData.documentsReport?.status || "")?.toLowerCase() === "approved" ? "text-green-600" : "text-gray-600"}`}>
                          {getStatusIcon(verificationData.documentsReport?.status || "pending")}
                          {verificationData.documentsReport?.status || "-"}
                        </span>
                      </div>
                    )}
                    {(verificationData.personalReport?.status || verificationData.ninVerificationStatus || verificationData.phoneVerificationStatus) && (
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#101828]">Personal / NIN Verification</span>
                        <span className={`flex items-center gap-1 font-medium text-[11px] ${(verificationData.personalReport?.status || verificationData.ninVerificationStatus || verificationData.phoneVerificationStatus || "")?.toLowerCase() === "approved" || (verificationData.ninVerificationStatus || verificationData.phoneVerificationStatus || "")?.toLowerCase() === "completed" ? "text-green-600" : "text-gray-600"}`}>
                          {getStatusIcon(verificationData.personalReport?.status || verificationData.ninVerificationStatus || verificationData.phoneVerificationStatus || "pending")}
                          {verificationData.personalReport?.status || verificationData.ninVerificationStatus || verificationData.phoneVerificationStatus || "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Employment Information - spans both columns */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col col-span-1 md:col-span-2 min-h-[180px] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[13px] text-[#101828]">Employment Information</span>
                  <BsThreeDotsVertical className="text-gray-400 text-base" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <div className="text-[10px] text-[#667085]">Employment Status</div>
                    <div className="font-semibold text-[12px] text-[#101828]">{verificationData.employmentStatus || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Name of Company</div>
                    <div className="font-semibold text-[12px] text-[#101828]">{verificationData.companyName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Role in the Company</div>
                    <div className="font-normal text-[12px] text-[#101828]">{verificationData.roleInCompany || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Employer Name</div>
                    <div className="font-normal text-[12px] text-[#101828]">{verificationData.employerName || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Company Address</div>
                    <div className="font-normal text-[12px] text-[#101828]">{verificationData.companyAddress || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Monthly Income Range /annum</div>
                    <div className="font-semibold text-[12px] text-[#101828]">{verificationData.monthlyIncome ? formatCurrency(verificationData.monthlyIncome) : "-"}</div>
                  </div>
                </div>
              </div>
              {/* Guarantor Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col min-h-[180px] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[13px] text-[#101828]">Guarantor Information</span>
                  <BsThreeDotsVertical className="text-gray-400 text-base" />
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="text-[10px] text-[#667085]">Guarantor's Full Name</div>
                    <div className="font-semibold text-[12px] text-[#101828]">{[verificationData.guarantorFirstName, verificationData.guarantorLastName].filter(Boolean).join(" ") || "-"}</div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[10px] text-[#667085]">Phone Number</div>
                      <div className="font-normal text-[12px] text-[#101828]">{verificationData.guarantorPhone || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#667085]">Email Address</div>
                      <div className="font-normal text-[12px] text-[#101828]">{verificationData.guarantorEmail || "-"}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085]">Guarantor Home Address</div>
                    <div className="font-normal text-[12px] text-[#101828]">{verificationData.guarantorAddress || "-"}</div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[10px] text-[#667085]">Employment Status</div>
                      <div className="font-normal text-[12px] text-[#101828]">{verificationData.guarantorEmploymentStatus || "-"}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#667085]">Company</div>
                      <div className="font-normal text-[12px] text-[#101828]">{verificationData.guarantorCompany || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Affordability Check */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col min-h-[180px] relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[13px] text-[#101828]">Affordability Check</span>
                  <BsThreeDotsVertical className="text-gray-400 text-base" />
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-[10px] text-[#667085] mb-1">Proof of Income (For the last 3 Months)</div>
                    {verificationData.bankStatementUrl ? (
                      <div className="flex items-center bg-[#F9FAFB] rounded-lg px-3 py-2 gap-3">
                        <FaFilePdf className="text-[#F04438]" size={16}/>
                        <div className="flex-1">
                          <div className="font-semibold text-[12px] text-[#101828]">Bank Statement</div>
                          <div className="text-[10px] text-[#667085] truncate max-w-[200px]">{verificationData.bankStatementUrl}</div>
                        </div>
                        <a href={verificationData.bankStatementUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded-full"><FaEye className="text-[#667085]" size={13}/></a>
                        <a href={verificationData.bankStatementUrl} download className="p-1 hover:bg-gray-100 rounded-full"><FaDownload className="text-[#667085]" size={13}/></a>
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#667085] py-2">No document uploaded</div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-[#667085] mb-1">Utility Bills (For the last 3 Months)</div>
                    {verificationData.utilityBillUrl ? (
                      <div className="flex items-center bg-[#F9FAFB] rounded-lg px-3 py-2 gap-3">
                        <FaFilePdf className="text-[#F04438]" size={16}/>
                        <div className="flex-1">
                          <div className="font-semibold text-[12px] text-[#101828]">Utility Bill</div>
                          <div className="text-[10px] text-[#667085] truncate max-w-[200px]">{verificationData.utilityBillUrl}</div>
                        </div>
                        <a href={verificationData.utilityBillUrl} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded-full"><FaEye className="text-[#667085]" size={13}/></a>
                        <a href={verificationData.utilityBillUrl} download className="p-1 hover:bg-gray-100 rounded-full"><FaDownload className="text-[#667085]" size={13}/></a>
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#667085] py-2">No document uploaded</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandLordLayout>
  );
};

export default VerificationResponsePage; 