"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../shared/buttons/Button";
import {
  getApplicationsByLandlordId,
  inviteApplicant,
  updateApplicationStatus,
} from "../../../../redux/slices/propertySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CenterModal from "../../shared/modals/CenterModal";
import InputField from "../../shared/input-fields/InputFields";

const ApplicantScreenForDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
  const [application, setApplication] = useState<any>([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState<any>({
    fullName: "",
    email: "",
  });

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      page: page,
      id: user?.user?._id,
      status: "New",
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
      setIsPageLoading(false);
    }
  };

  const handleSubmit = async (status: any) => {
    const payload = {
      id: application?._id,
      status: status,
    };
    try {
      setIsLoading(true);
      await dispatch(updateApplicationStatus(payload) as any).unwrap();
      toast.success("Application accepted");
      router.push('/dashboard/landlord/properties/renters')
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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <ToastContainer />
      {currentStep === 1 && (
        <div>
          {properties && properties.length < 6 ? (
                <div className=" w-full mx-auto ">
              {properties?.map((item, index) => {
                return (
                  <div key={index}>
                        <div
                          className="flex bg-white mt-4 mrounded rounded-2xl p-4 cursor-pointer hover:bg-gray-50"
    
                        >
                          <div className="w-1/5">
                          <img
                          src="https://res.cloudinary.com/dzv98o7ds/image/upload/v1718917936/image_17_1_y9aa8e.png"
                          alt="photos"
                        />
                          </div>
                          <div className="w-4/5">
                            <div className="flex justify-between w-full">
                              <div className="text-nrvDarkGrey font-light text-md w-1/2">
                                {item?.applicant?.firstName}{" "}
                                {item?.applicant?.lastName}
                              </div>
                              <div
                                    className="cursor-pointer text-sm underline text-end w-1/2 text-end"
                                    onClick={() =>
                                      router.push(
                                        `rooms/${item?.propertyId?._id}`
                                      )
                                    }
                                  >
                                   Aparment ID : {item?.propertyId?.roomId}
                                  </div>
                            </div>
                            <div className="text-nrvDarkBlue text-sm mt-4">
                              {item?.propertyId?.propertyId.streetAddress},{" "}
                              {item?.propertyId?.propertyId.city} ,{" "}
                              {item?.propertyId?.propertyId.state}
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
                Collect Rental Applications. Free for Landlords
              </div>
              <div className="text-center flex mx-auto w-4/5 mt-4 text-sm text-nrvGrayText font-light">
                Invite renters to complete our online, industry-standard
                application. We’ll send you their responses and a screening
                report in one easy-to-read profile. Demo the application from
                the renter’s perspective.
              </div>

              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-8 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                variant="mediumGrey"
                showIcon={false}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  Invite to Apply
                </div>
              </Button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ApplicantScreenForDashboard;
