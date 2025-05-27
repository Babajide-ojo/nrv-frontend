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
    <div className="mx-2 my-4">
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
        <Button onClick={() => handleAppApproval("activeTenant")}>
          Accept Application
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white rounded-md p-4">
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

          <div className="text-center">
            <img
              src="/images/verified-user-icon.svg"
              alt="Profile"
              className="w-48 h-48 mx-auto rounded-full"
            />
            <div className="text-green-700 text-xs font-medium mt-1">
              Account Verified
            </div>
            <div className="text-md font-semibold mt-1">
              {application?.applicant?.firstName}{" "}
              {application?.applicant?.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {application?.applicant?.email}
            </div>

            <div className="mt-4 bg-gray-100 p-2 rounded flex justify-between items-center">
              <span>{application?.applicant?.phoneNumber}</span>
              <button className="text-sm text-green-600">Show NIN</button>
            </div>

            <div className="mt-4 text-sm text-gray-700">
              {application?.applicant?.phoneNumber}
            </div>
            <div className="flex gap-2 mt-3 justify-center">
              <Button
                className="bg-nrvPrimaryGreen text-white text-xs px-4 py-2"
                onClick={() => {}}
              >
                Send Message
              </Button>
              <Button
                className="bg-nrvGreyMediumBg text-xs px-4 py-2"
                onClick={() => {}}
              >
                Send Offer
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard
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

          {/* <InfoCard title="Recent Rental History" data={[
            ['Previous Address', application?.rental?.previousAddress],
            ['Reason for Moving', application?.rental?.reasonForMoving],
            ['Landlord Reference', application?.rental?.landlordReference]
          ]} />

          <InfoCard title="Background Check Status" data={[
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
