"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { updateApplicationStatus } from "../../../../redux/slices/propertySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDateToWords } from "@/helpers/utils";
import { RefreshCcw } from "lucide-react";
// import DataTable from "../../shared/tables/DataTable";
import { API_URL } from "@/config/constant";
import { Button } from "@/components/ui/button";
import DataTable, { BaseRow } from "@/app/components/shared/tables/DataTable";
import { updateApplicationStatus } from "@/redux/slices/propertySlice";

const InfoCard = ({ title, data = [], files = [], fileUrl }: any) => (
  <div className="bg-white p-4 rounded-md">
    <div className="font-semibold text-md text-nrvGreyBlack mb-2">{title}</div>
    {data.map(([label, value]: any, idx: number) => (
      <div key={idx} className="text-sm mb-2">
        <span className="font-medium text-nrvGreyBlack">{label}:</span> {value}
      </div>
    ))}
    {files.map(([label, url]: any, idx: number) => (
      <div key={idx} className="text-sm mb-2">
        <span className="font-medium text-nrvGreyBlack">{label}:</span>{" "}
        <a
          href={url}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </a>
      </div>
    ))}
    {fileUrl && (
      <div className="text-sm">
        <a
          href={fileUrl}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Proof
        </a>
      </div>
    )}
  </div>
);

const LandlordsTenantsScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<any>({});
  const [application, setApplication] = useState<any>([]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("Active_lease");

  const handleSubmit = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
    };
    try {
      setIsLoading(true);
      await dispatch(updateApplicationStatus(payload) as any).unwrap();
      toast.success("Application accepted");
      router.push("/dashboard/landlord/properties/renters");
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleRowAction = (row: BaseRow) => {
    const leaseId = row._id ?? row.id;
    return (
      <div className="flex gap-2">
        <p
          className="text-xs text-[#2B892B] font-medium cursor-pointer"
          onClick={() => {
            if (leaseId) {
              router.push(`/dashboard/landlord/tenants/${leaseId}`);
            }
          }}
        >
          View lease details
        </p>
      </div>
    );
  };

  const handleTabClick = (status: string) => {
    setActiveTab(status);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
  }, []);

  return (
    <div>
      <ToastContainer />
      {currentStep === 1 && (
        <div>
          <ToastContainer />
          <div className="space-y-12 p-4 font-jakarta">
            {/* Header */}
            <div className="flex items-center justify-between w-full gap-5 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold">
                  Tenant Management
                </h2>
                <p className="text-gray-500 text-sm mt-2 font-lighter">
                  View and manage your tentant directory.
                </p>
              </div>
              
            </div>
            {
              <div className="grid md:grid-cols-4 grid-cols-1 gap-4  mb-6 border border-gray-300 py-4">
                {[
                  {
                    title: "Retention Rate",
                    value: `${85}%`,
                    change: "85%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Overall Rent Collection Status",
                    value: `${90}%`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Complaint Resolution Rate",
                    value: `${90}%`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Overall Tenant Satisfaction Score",
                    value: `${4.5}/5`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className={`${
                      i === 0 && "max-md:pb-4"
                    } md:border-r max-md:border-b last:border-none px-4`}
                  >
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    <h3 className="text-xl font-semibold text-green-900">
                      {card.value}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        card.trend === "up" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {card.trend === "up" ? "↑" : "↓"} {card.change}{" "}
                      {card.comparison}
                    </p>
                  </div>
                ))}
              </div>
            }

            <div className="flex gap-3 flex-wrap">
              <Button
                variant="default"
                className={`${
                  activeTab === "Active_lease"
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => handleTabClick("Active_lease")}
              >
                Active Leases/Tenants{" "}
              </Button>
              <Button
                className={`${
                  activeTab === "ended"
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => handleTabClick("ended")}
              >
                Past Leases{" "}
                <span className="ml-2 font-semibold"></span>
              </Button>
            </div>

            {/* Section Title */}
            <div className="flex-col items-center gap-4 mt-2">
              <h4 className="text-lg font-semibold">Tenants</h4>
              <span className="text-gray-400 text-sm">
                View and manage Tenants
              </span>
            </div>
          </div>

          <DataTable
            rowActions={handleRowAction}
            key={activeTab}
            endpoint={`${API_URL}/properties/applications/${
              JSON.parse(localStorage.getItem("nrv-user") as any)?.user?._id
            }`}
            status={activeTab}
            columns={[
              {
                key: "propertyId",
                label: "Apartment Name & Address",
                render: (val) => (
                  <div>
                    <div className="text-[#101828] font-medium text-[13px]">
                      {val?.apartmentStyle || "N/A"}
                    </div>
                    <div className="text-[#667085] font-light">
                      {val?.propertyId?.streetAddress}, {val?.propertyId?.state}
                      , Nigeria
                    </div>
                  </div>
                ),
              },
              // {
              //   key: "status",
              //   label: "Status",
              //   render: (val) => (
              //     <span className="font-medium italic text-[#045D23]">
              //       {val === "activeTenant" ? "Active Tenancy" : val}
              //     </span>
              //   ),
              // },
              {
                key: "rentStartDate",
                label: "Lease Start Date",
                render: (val) => <span>{formatDateToWords(val)}</span>,
              },
              {
                key: "rentEndDate",
                label: "Lease End Date",
                render: (val) => <span>{formatDateToWords(val)}</span>,
              },
            ]}
          />
        </div>
      )}
      {currentStep === 2 && (
        <div className="mx-2 my-4">
          {/* Breadcrumb and Back Button */}
          <div className="flex items-center gap-3 text-sm mb-3">
            <button
              className="text-nrvGreyBlack"
              onClick={() => setCurrentStep(1)}
            >
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 6.75C21.4142 6.75 21.75 6.41421 21.75 6C21.75 5.58579 21.4142 5.25 21 5.25V6.75ZM0.469669 5.46967C0.176777 5.76256 0.176777 6.23744 0.469669 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.469669 5.46967ZM21 5.25L1 5.25V6.75L21 6.75V5.25Z"
                  fill="#333333"
                />
              </svg>
            </button>
            <span className="text-nrvGreyBlack">Applicant Profile</span>
          </div>

          {/* Grid Layout */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Panel */}
            <div className="w-full md:w-1/3 bg-white rounded-md p-4">
              {/* Property Card */}
              <div className="mb-4">
                <img
                  src={application?.propertyId?.propertyId?.file}
                  alt="Property"
                  className="rounded-md w-full h-40 object-cover"
                />
                <div className="text-sm text-green-600 font-medium mt-2">
                  Tenant Status: Active
                </div>
                <div className="text-md font-semibold mt-1">
                  {application?.propertyTitle}
                </div>
                <div className="text-sm text-gray-500">
                  {application?.propertyLocation}
                </div>
                <div className="text-xs mt-1">
                  Applied on: {application?.appliedDate}
                </div>
              </div>

              {/* Applicant Info */}
              <div className="text-center">
                <img
                  src={application?.applicant?.photoUrl}
                  alt="Profile"
                  className="w-16 h-16 mx-auto rounded-full"
                />
                <div className="text-green-700 text-xs font-medium mt-1">
                  Account Verified
                </div>
                <div className="text-md font-semibold mt-1">
                  {application?.applicant?.fullName}
                </div>
                <div className="text-sm text-gray-500 break-all">
                  {application?.applicant?.email}
                </div>

                {/* NIN */}
                <div className="mt-4 bg-gray-100 p-2 rounded flex justify-between items-center">
                  <span>3456 **** *****</span>
                  <button className="text-sm text-green-600">Show NIN</button>
                </div>

                {/* Phone + Actions */}
                <div className="mt-4 text-sm text-gray-700">
                  {application?.applicant?.phoneNumber}
                </div>
                <div className="flex gap-2 mt-3 justify-center flex-wrap">
                  <Button className="bg-nrvPrimaryGreen text-white text-xs px-4 py-2">
                    Send Message
                  </Button>
                  <Button className="bg-nrvGreyMediumBg text-xs px-4 py-2">
                    Send Offer
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Info */}
              <InfoCard
                title="Personal Information"
                data={[
                  ["Marital Status", application?.applicant?.maritalStatus],
                  ["Gender", application?.applicant?.gender],
                  ["Date of Birth", application?.applicant?.dob],
                ]}
              />

              {/* Employment Details */}
              <InfoCard
                title="Employment Details"
                data={[
                  ["Employer", application?.employment?.employer],
                  ["Job Title", application?.employment?.jobTitle],
                  ["Salary Range", application?.employment?.salaryRange],
                ]}
              />

              {/* Rental History */}
              <InfoCard
                title="Recent Rental History"
                data={[
                  ["Previous Address", application?.rental?.previousAddress],
                  ["Reason for Moving", application?.rental?.reasonForMoving],
                  [
                    "Landlord Reference",
                    application?.rental?.landlordReference,
                  ],
                ]}
              />

              {/* Background Check */}
              <InfoCard
                title="Background Check Status"
                data={[
                  [
                    "Criminal Record",
                    application?.criminalRecord ? "Yes" : "Clear",
                  ],
                  ["Credit Score", application?.creditScore],
                  ["Interview Notes", application?.interviewNotes],
                ]}
              />

              {/* Rental Payment History */}
              <InfoCard
                title="Rental Payment History"
                data={[["Timelines", "100% On-Time Payments"]]}
                fileUrl={application?.documents?.proofOfPayment}
              />

              {/* Identification */}
              <InfoCard
                title="Identification"
                files={[
                  ["Government ID", application?.documents?.govtID],
                  ["Selfie", application?.documents?.selfie],
                ]}
              />

              {/* Submitted Docs */}
              <InfoCard
                title="Submitted Documents"
                files={[
                  ["Proof of Income", application?.documents?.bankStatement],
                  ["Reference Letter", application?.documents?.referenceLetter],
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordsTenantsScreen;
