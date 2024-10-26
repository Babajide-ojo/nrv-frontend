"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../shared/buttons/Button";
import { getApplicationsByLandlordId, updateApplicationStatus } from "../../../../redux/slices/propertySlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CenterModal from "../../shared/modals/CenterModal";

const LeadScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [application, setApplication] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      page: page,
      id: user?.user?._id,
      status: "Accepted",
    };

    try {
      const response = await dispatch(
        getApplicationsByLandlordId(formData) as any
      );
      setProperties(response?.payload?.data);
      setTotalPages(response?.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
      setIsPageLoading(false); // Stop page loading after fetch
    }
  };

  const handleSubmit = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
      roomId: application?.propertyId?._id
    };

   
    
    try {
      setIsLoading(true);
      const data = await dispatch(updateApplicationStatus(payload) as any).unwrap();
      if (data.response.statusCode === 400){
        toast.error(data.response.message);
      }
  
      router.push('/dashboard/landlord/properties/renters')
    } catch (error: any) {
      toast.error(error);
    } finally {
      setIsOpen(false)
    }
  };

  const handleInvitation = async () => {
    // const payload = {
    //   name: applicantDetails.fullName,
    //   email: applicantDetails.email,
    // };
    // try {
    //   setIsLoading(true);
    //   await dispatch(inviteApplicant(payload) as any).unwrap();
    //   toast.success("Invitation sent successfully");
    //   setIsOpen(false);
    // } catch (error: any) {
    //   toast.error(error);
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <ToastContainer />
      {currentStep === 1 && (
        <div>
          {properties && properties.length > 0 ? (
            <div>
              {properties?.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      className="flex gap-4 w-full bg-white max-w-full mt-4 mx-auto rounded rounded-2xl p-2"
                      onClick={() => {
                        setApplication(item);
                        setCurrentStep(2);
                      }}
                    >
                      <div>
                        <img
                          src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1718917936/image_17_1_y9aa8e.png"
                          alt="photos"
                        />
                      </div>
                      <div>
                        <div className="text-nrvDarkBlue text-sm">
                          {item?.applicant?.firstName}{" "}
                          {item?.applicant?.lastName}
                        </div>
                        <div className="text-nrvDarkBlue text-xs">
                          {item?.applicant?.homeAddress}
                        </div>
                        <div className="text-nrvLightGrey text-[12px]">
                          Applied 2 days ago
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-full w-120 rounded rounded-2xl p-4 mt-8 text-center">
              <div className="text-md py-2">
                {" "}
                Your leads at your fingertips!
              </div>
              <div className="text-center flex mx-auto w-2/5 mt-4 text-sm text-nrvGrayText font-light">
                Easily manage all your leads as they automatically start coming
                in.
              </div>
            </div>
          )}
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
            <div> Applicant Details</div>
          </div>
          <div className="md:flex mx-2 bg-white p-3 rounded-md border-r ">
            <div className="md:w-2/5 w-full md:border-r">
              <div className="mb-4 border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack ">
                  {" "}
                  Personal Information
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    First Name{" "}
                  </span>{" "}
                  {application?.applicant?.firstName}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Last Name{" "}
                  </span>
                  {application?.applicant?.lastName}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Phone Number{" "}
                  </span>{" "}
                  {application?.applicant?.phoneNumber}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Current Address{" "}
                  </span>{" "}
                  {application?.applicant?.homeAddress}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Date Of Birth{" "}
                  </span>{" "}
                  January 1, 1990{" "}
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Employment Information
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Current Employer{" "}
                  </span>{" "}
                  {application?.currentEmployer}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Job Title{" "}
                  </span>{" "}
                  {application?.jobTitle}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Monthly Income{" "}
                  </span>{" "}
                  {application?.monthlyIncome}{" "} Naira
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 md:mr-20 mr-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Rental History
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Previous Landlord{" "}
                  </span>{" "}
                  {application?.currentLandlord}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Previous Address{" "}
                  </span>{" "}
                  {application?.currentAddress}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Reason for Leaving{" "}
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
            <div className="mb-4 border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack ">
                  {" "}
                  References
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Reference Full Name
                  </span>{" "}
                  {application?.applicant?.firstName}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
              Phone Number
                  </span>
                  {application?.applicant?.lastName}
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Additional Information
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Desired Move-in Date
                  </span>{" "}
                  {application?.applicant?.firstName}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Number of Pets{" "}
                  </span>{" "}
                  {application?.petNumber}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Smoking
                  </span>{" "}
                  {application?.smoker === true ? "YES" : "NO"}{" "}
                </div>
                <div className="mt-3 text-sm font-light">
                  <span className="text-nrvGreyBlack font-medium pr-3">
                    Number of Vehicles
                  </span>{" "}
                  {application?.numberOfVehicles}{" "}
                </div>
              </div>
              <div className="mb-4  border-b pb-4 px-2 mr-3 md:ml-20 ml-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Uploaded Documents
                </div>
                <div className="mt-3 text-sm font-light cursor-pointer">
                  <span className="text-nrvGreyBlack font-medium pr-3 cursor-none">
                    ID Proof
                  </span>{" "}
                  <a className="underline" href={application?.identificationCard}>View ID Card</a>
              
                </div>
                <div className="mt-3 text-sm font-light cursor-pointer">
                  <span className="text-nrvGreyBlack font-medium pr-3 cursor-none">
                    Income Verification
                  </span>{" "}
                  {application?.applicant?.firstName}{" "}
                </div>
              </div>
              <div className="mb-4 pb-4 px-2 mr-3 md:ml-20 ml-3">
                <div className="mt-4 font-medium text-md text-nrvGreyBlack">
                  {" "}
                  Actions
                </div>
                <div className="flex mt-4 gap-4">
                  <Button
                    onClick={() => {
                      handleSubmit("Rejected");
                    }}
                    size="normal"
                    className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg rounded-md  hover:text-white hover:bg-red-400"
                    variant="mediumGrey"
                    showIcon={false}
                  >
                    <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                      Reject Applicant
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                    setIsOpen(true)
                    }}
                    size="normal"
                    className="p-2 border border-nrvGreyMediumBg rounded-md  hover:text-white hover:bg-nrvDarkBlue"
                    variant="bluebg"
                    showIcon={false}
                  >
                    <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                      Convert to Tenant
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
          <h2 className="text-nrvDarkBlue font-semibold text-xl">
            Transfer Application as Tenant
          </h2>
          <p className="text-nrvLightGrey text-sm mb-4 mt-4">
            Performing this action will make this applicant the current occupant of this property for the designated time
          </p>

          <div className="mt-8 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="text-white w-72 max-w-full border border-nrvDarkBlue mt-2 rounded-md"
              variant="bluebg"
              showIcon={false}
            >
              <div
                className="flex gap-3"
                onClick={() => {
                  handleSubmit("activeTenant")
                }}
              >
                Submit
              </div>
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-1 justify-center text-center items-center">
            <Button
              size="large"
              className="w-72 bg-nrvGreyMediumBg border border-nrvGreyMediumBg rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
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

export default LeadScreen;
