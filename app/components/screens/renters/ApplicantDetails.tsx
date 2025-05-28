"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import {
  getApplicationsById,
  updateApplicationStatus,
} from "@/redux/slices/propertySlice";
import { toast } from "react-toastify";
import Image from "next/image";
import { format } from "date-fns";
import PdfIcon from "../../icons/PdfIcon";
import { DownloadIcon, EyeIcon } from "lucide-react";

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

const ApplicationDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id }: any = useParams();
  const [showNIN, setShowNIN] = useState(false);
  const application = useSelector((state: any) => state?.property?.data?.data);
  const [isLoading, setIsLoading] = useState(false);

  console.log({ application });

  const handleAppApproval = async (status: any) => {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const formData = { id: id };
    if (id) {
      dispatch(getApplicationsById(formData as any) as any);
    }
  }, [id, dispatch]);

  if (!application)
    return <div className="p-4">Loading application details...</div>;

  return (
    <div className="mx-5 my-4">
      {/* Breadcrumb and Back Button */}
      <div className="flex items-center justify-between gap-5 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <button className="text-nrvGreyBlack">
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
      </div>

      <div className="flex flex-col md:flex-row flex-start gap-4">
        <div className="w-full md:w-1/2 bg-white rounded-md">
          <div className="border rounded-lg flex flex-col sm:flex-row overflow-hidden">
            {/* <div className="h-[168px] aspect-square" ></div> */}
            <Image
              height={168}
              width={168}
              src={application?.propertyId?.propertyId?.file}
              alt="property"
              className="object-cover aspect-square h-full"
            />
            <div className="px-5 py-3">
              <div className="bg-[#E9F4E7] text-[#099137] w-fit text-xs py-1 px-4 rounded-full">
                Application Status: {application?.status}
              </div>
              <div className="text-[20px] font-semibold mt-1">
                {application?.propertyId?.description}
              </div>
              <p>
                {application?.propertyId?.propertyId?.streetAddress},{" "}
                {application?.propertyId?.propertyId?.city},{" "}
                {application?.propertyId?.propertyId?.state}
              </p>
              <p className="text-sm text-[#807F94] mt-1">
                Applied on{" "}
                {application?.createdAt
                  ? format(new Date(application?.createdAt), "do, MMM yyyy")
                  : ""}
              </p>
            </div>
          </div>
          {/* <div className="mb-4">
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
          </div> */}

          <div className="text-center mt-5 border rounded-lg p-5">
            <div className="flex flex-col items-center">
              <Image
                src="/images/verified-user-icon.svg"
                alt="Profile"
                height={160}
                width={160}
                className="object-cover aspect-square rounded-lg"
              />
              <p className="text-[24px] text-[#03442C] font-semibold mt-3">
                {application?.applicant?.firstName}{" "}
                {application?.applicant?.lastName}
              </p>
              <p className="text-lg text-gray-500">
                {application?.applicant?.email}
              </p>
            </div>

            <div className="mt-4 bg-[#E9F4E7] p-4 text-[24px] font-semibold rounded flex justify-between items-center">
              <span>
                {showNIN ? application?.applicant?.nin : "**********"}
              </span>
              <button
                onClick={() => setShowNIN(!showNIN)}
                className="underline text-lg text-green-600"
              >
                {!showNIN ? "Show NIN" : "Hide NIN"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4 px-4">
              <p>Phone Number</p>
              <p className=" text-gray-700">
                {application?.applicant?.phoneNumber}
              </p>
            </div>
            <div className="flex gap-2 mt-5 justify-center">
              <Button
                className="bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 text-white text-xs px-4 py-2 w-full"
                disabled={isLoading}
                onClick={() => handleAppApproval("activeTenant")}
              >
                Accept
              </Button>
              <Button
                className="bg-white hover:bg-black/10 border border-red-500 text-red-500 text-xs px-4 py-2 w-full"
                onClick={() => {}}
              >
                Reject
              </Button>
            </div>
          </div>
          <div className="p-4 border rounded-lg  mt-5">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Rental Payment History</p>
            </div>
            <div className="mt-4 flex flex-col">
              <p className="text-xs text-[#475467]">Timelines</p>
              <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                  <PdfIcon width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Proof of Payment.pdf</p>
                  <p className="text-xs text-[#475467]">
                    11 Sep, 2023 | 12:24pm • 2MB
                  </p>
                </div>
                <EyeIcon width={29} height={20} color="#475367" />
                <DownloadIcon width={23.33} height={24.5} color="#475367" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          <div className="p-4 border rounded-lg h-fit">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Personal Information</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className="text-[#475467]">Marital Status</p>
              <p className="font-semibold">Single*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Gender</p>
              <p className="font-semibold">Male*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Date of Birth</p>
              <p className="font-semibold">Friday, Sep 25, 1990*</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg h-fit">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Employment Details</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className="text-[#475467]">Employer</p>
              <p className="font-semibold">
                {application?.currentEmployer ?? "N/A"}
              </p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Job Title</p>
              <p className="font-semibold">Engineer*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Salary</p>
              <p className="font-semibold">{`₦${application?.monthlyIncome?.toLocaleString()}`}</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg h-fit">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Rental History</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className="text-[#475467]">Previous Address</p>
              <p className="font-semibold">
                12 Adeola Odeku Street, Victoria Island*
              </p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Reason for moving</p>
              <p className="font-semibold">Relocation for work*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Landlord/Agent Reference</p>
              <p className="font-semibold">Name: Mrs. Adebayo - 08029876543*</p>
            </div>
          </div>
          <div className="p-4 border rounded-lg h-fit">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Background Check Status</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className="text-[#475467]">Criminal Record</p>
              <p className="font-semibold">Clear*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Credit Score</p>
              <p className="font-semibold">Excellent*</p>
            </div>
            <div className="mt-4 text-sm flex flex-col">
              <p className=" text-[#475467]">Interview Notes</p>
              <p className="font-semibold">
                Tenant is reliable and has a stable income.*
              </p>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Identification</p>
            </div>
            <div className="mt-4 flex flex-col">
              <p className="text-xs text-[#475467]">Government ID</p>
              <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                  <PdfIcon width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Government NIN.pdf</p>
                  <p className="text-xs text-[#475467]">
                    11 Sep, 2023 | 12:24pm • 2MB
                  </p>
                </div>
                <EyeIcon width={29} height={20} color="#475367" />
                <DownloadIcon width={23.33} height={24.5} color="#475367" />
              </div>
            </div>
            <div className="mt-6 flex flex-col">
              <p className="text-xs text-[#475467]">Selfie for Verification</p>
              <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                  <PdfIcon width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Selfie.pdf</p>
                  <p className="text-xs text-[#475467]">
                    11 Sep, 2023 | 12:24pm • 2MB
                  </p>
                </div>
                <EyeIcon width={29} height={20} color="#475367" />
                <DownloadIcon width={23.33} height={24.5} color="#475367" />
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Submitted</p>
            </div>
            <div className="mt-4 flex flex-col">
              <p className="text-xs text-[#475467]">Proof of Income</p>
              <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                  <PdfIcon width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Banks Statement.pdf</p>
                  <p className="text-xs text-[#475467]">
                    11 Sep, 2023 | 12:24pm • 2MB
                  </p>
                </div>
                <EyeIcon width={29} height={20} color="#475367" />
                <DownloadIcon width={23.33} height={24.5} color="#475367" />
              </div>
            </div>
            <div className="mt-6 flex flex-col">
              <p className="text-xs text-[#475467]">Reference Letter</p>
              <div className="text-sm flex items-center gap-2 justify-between border rounded-md p-2">
                <div className="h-[32px] w-[32px] rounded-full bg-[#E7F6EC] flex items-center justify-center">
                  <PdfIcon width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Reference Letter.pdf</p>
                  <p className="text-xs text-[#475467]">
                    11 Sep, 2023 | 12:24pm • 2MB
                  </p>
                </div>
                <EyeIcon width={29} height={20} color="#475367" />
                <DownloadIcon width={23.33} height={24.5} color="#475367" />
              </div>
            </div>
          </div>
          {/* <InfoCard
            title="Employment Details"
            data={[
              ["Employer", application?.currentEmployer],
              ["Job Title", application?.jobTitle || "null"],
              [
                "Monthly Income",
                application?.monthlyIncome?.toLocaleString() + " NGN",
              ],
            ]}
          />

          <InfoCard
            title="Recent Rental History"
            data={[
              ["Previous Address", application?.rental?.previousAddress],
              ["Reason for Moving", application?.rental?.reasonForMoving],
              ["Landlord Reference", application?.rental?.landlordReference],
            ]}
          /> */}

          {/*<InfoCard title="Background Check Status" data={[
            ['Criminal Record', application?.criminalRecord ? 'Yes' : 'Clear'],
            ['Credit Score', application?.creditScore],
            ['Interview Notes', application?.interviewNotes]
          ]} />

          <InfoCard title="Rental Payment History" data={[
            ['Timelines', '100% On-Time Payments']
          ]} fileUrl={application?.documents?.proofOfPayment} />

          <InfoCard title="Identification" files={[
            ['Government ID', application?.documents?.govtID],
            ['Selfie', application?.documents?.selfie]
          ]} />

          <InfoCard title="Submitted Documents" files={[
            ['Proof of Income', application?.documents?.bankStatement],
            ['Reference Letter', application?.documents?.referenceLetter]
          ]} /> */}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
