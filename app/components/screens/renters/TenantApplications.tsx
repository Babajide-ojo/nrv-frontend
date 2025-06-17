"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getApplicationsByTenantId,
  inviteApplicant,
  updateApplicationStatus,
} from "../../../../redux/slices/propertySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CenterModal from "../../shared/modals/CenterModal";
import InputField from "../../shared/input-fields/InputFields";
import { RefreshCcw } from "lucide-react";
import DataTable from "../../shared/tables/DataTable";
import { formatDateToWords } from "@/helpers/utils";
import LoadingPage from "../../loaders/LoadingPage";
import { API_URL } from "@/config/constant";
import { Button } from "@/components/ui/button";
import Status from "../../shared/Status";

const TenantApplications = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [application, setApplication] = useState<any>([]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("New");
  const [isOpen, setIsOpen] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState<any>({
    fullName: "",
    email: "",
  });

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

  const handleInvitation = async () => {
    const payload = {
      name: applicantDetails.fullName,
      email: applicantDetails.email,
    };
    try {
      setIsLoading(true);
      await dispatch(inviteApplicant(payload) as any).unwrap();
      toast.success("Invitation sent successfully");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicantDetails((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRowAction = (id: string) => {
    return (
      <div className="flex gap-2">
        <p
          className="text-xs text-[#2B892B] font-medium cursor-pointer"
          onClick={() =>
            // setCurrentStep(2)
            router.push(`/dashboard/tenant/properties/applications/${id}`)
          }
        >
          view
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
    <div className="pb-16">
      <ToastContainer />
      {currentStep === 1 && (
        <div>
          <ToastContainer />
          <div className="space-y-12 p-4 font-jakarta">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <div>
                <h2 className="text-xl font-semibold">
                  View Rental Applications
                </h2>
                <p className="text-gray-500 font-light">
                  View and update your rental applications
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
            {
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 border">
                {[
                  {
                    title: "Active Applications",
                    value: `${18}`,
                    change: "0%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Approved Applications",
                    value: `${0}`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Pending (Under Review)",
                    value: `${0}`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                  {
                    title: "Rejected Applications",
                    value: `${0}`,
                    change: "10%",
                    trend: "up",
                    comparison: "compared to the last 6 months",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="border-b md:border-b-0 pb-4 md:pb-0 md:border-r last:border-none px-4"
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

            <div className="flex gap-3">
              <Button
                variant="default"
                className={`${
                  activeTab === ""
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => handleTabClick("")}
              >
                All Applications{" "}
                <span className="ml-2 font-semibold">
                  {/* {maintenance?.summary?.New} */}
                </span>
              </Button>
              <Button
                className={`${
                  activeTab === "New"
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => handleTabClick("New")}
              >
                Pending Applications{" "}
                <span className="ml-2 font-semibold">
                  {/* {maintenance?.summary?.InProgress} */}
                </span>
              </Button>
              <Button
                className={`${
                  activeTab === "activeTenant"
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800 border"
                }`}
                onClick={() => handleTabClick("activeTenant")}
              >
                Approved Applications{" "}
                <span className="ml-2 font-semibold">
                  {/* {maintenance?.summary?.Approved} */}
                </span>
              </Button>
            </div>

            {/* Section Title */}
            <div className="flex-col items-center gap-4 mt-2">
              <h4 className="text-lg font-semibold">Active Application</h4>
              <span className="text-gray-400 text-sm">
                View and manage active applications
              </span>
            </div>
          </div>

          <DataTable
            rowActions={handleRowAction}
            key={activeTab}
            endpoint={`${API_URL}/properties/tenant-applications/${
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
              {
                key: "status",
                label: "Status",
                render: (val) => <Status status={val} />,
              },
              {
                key: "createdAt",
                label: "Applied Date & Time",
                render: (val) => <span>{formatDateToWords(val)}</span>,
              },
              {
                key: "status",
                label: "Next Step",
                render: (val) => (
                  <span
                    className={`font-medium italic ${
                      val === "New" ? "text-[#045D23]" : ""
                    }`}
                  >
                    {val === "New" ? "Background Check" : "Null"}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <div className="p-3 bg-white rounded-md mx-2 my-4 text-sm flex gap-3">
            <div
              className="pt-1 font-light"
              onClick={() => {
                setCurrentStep(1);
              }}
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
            </div>
            <div> Application Details</div>
          </div>
          <div className="md:flex mx-2 bg-white p-3 rounded-md border-r ">
            <div className="md:w-2/5 w-full md:border-r">
              <div className="mb-4 border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack ">
                  {" "}
                  Landlord Information
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Name of Property Poster:
                  </span>
                  {application?.ownerId?.firstName}{" "}
                  {application?.ownerId?.lastName}
                </div>

                <div className="mt-3 text-sm font-light flex">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Phone Number :{" "}
                  </span>{" "}
                  <div className=" underline text-nrvPrimaryGreen font-medium">
                    {" "}
                    {application?.ownerId?.phoneNumber}
                  </div>
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Current Address :{" "}
                  </span>{" "}
                  {application?.ownerId?.homeAddress}
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Property Details
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Property Address :{" "}
                  </span>{" "}
                  {application?.propertyId?.propertyId.streetAddress},{" "}
                  {application?.propertyId?.propertyId.city},{" "}
                  {application?.propertyId?.propertyId.state}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Property Type :{" "}
                  </span>{" "}
                  {application?.propertyId?.propertyId.propertyType}
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Rental History
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Previous Landlord :{" "}
                  </span>{" "}
                  {application?.currentLandlord}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Previous Address :{" "}
                  </span>{" "}
                  {application?.currentAddress}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Reason for Leaving :{" "}
                  </span>{" "}
                  {application?.reasonForLeaving}{" "}
                </div>
              </div>
              <div className="mb-4 pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Background Check Results
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Criminal Record{" "}
                  </span>{" "}
                  {application?.criminalRecord === true ? "YES" : "NO"}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Eviction History{" "}
                  </span>{" "}
                  {application?.evictionHistory === true ? "YES" : "NO"}{" "}
                </div>
              </div>
            </div>

            <div className="md:w-3/5 w-full">
              <div className="mb-4 pb-4 px-2 mr-3 md:ml-20 ml-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Actions
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => {
                      handleSubmit("Rejected");
                    }}
                    //size="normal"
                    className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg rounded-md  hover:text-white hover:bg-nrvPrimaryGreen"
                    //variant="mediumGrey"
                    //showIcon={false}
                  >
                    <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                      Withdraw Application
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CenterModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="mx-auto text-center p-4 w-full md:w-4/5">
          <h2 className="text-nrvPrimaryGreen font-semibold text-xl">
            Invite to apply
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4">
            Input the details of the person you want to apply
          </p>
          <div className="w-full mt-8 text-start">
            <InputField
              label="Full Name"
              placeholder="Enter Full Name"
              inputType="text"
              name="fullName"
              onChange={handleInputChange}
              value={applicantDetails.name}
            />
          </div>
          <div className="w-full mt-8 text-start">
            <InputField
              label="Email"
              placeholder="Enter Email"
              inputType="text"
              name="email"
              onChange={handleInputChange}
              value={applicantDetails.email}
            />
          </div>

          <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              //size="large"
              className="text-white w-72 max-w-full border border-nrvPrimaryGreen mt-2 rounded-md"
              //variant="bluebg"
              //showIcon={false}
            >
              <div
                className="flex gap-3"
                onClick={() => {
                  handleInvitation();
                }}
              >
                Send
              </div>
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              //size="large"
              className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2  hover:text-white hover:bg-nrvPrimaryGreen"
              // variant="mediumGrey"
              //showIcon={false}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <div className="flex gap-2">Close</div>
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
};

export default TenantApplications;
