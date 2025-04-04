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
import { FcHome } from "react-icons/fc";

const ApplicantScreenForDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({});
  const [properties, setProperties] = useState<any[]>([]);
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
      page: 1,
      id: user?.user?._id,
      status: "New",
    };

    try {
      // Simulating a delay of 5 seconds for the preloader
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await dispatch(
        getApplicationsByLandlordId(formData) as any
      );
      setProperties(response?.payload?.data);
    } catch (error) {
      toast.error("Failed to load applications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer />
      {isLoading ? (
        <div className="w-full mx-auto">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="flex bg-gray-200 mt-4 rounded-2xl p-4">
              <div className="w-1/5">
                <div className="h-20 bg-gray-300 rounded"></div> {/* Placeholder for image */}
              </div>
              <div className="w-4/5">
                <div className="flex justify-between w-full">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div> {/* Placeholder for name */}
                  <div className="h-6 bg-gray-200 rounded w-1/2 text-right"></div> {/* Placeholder for apartment ID */}
                </div>
                <div className="h-4 bg-gray-300 rounded mt-4"></div> {/* Placeholder for address */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {currentStep === 1 && (
            <div>
              {properties && properties.length < 6 ? (
                <div className="w-full mx-auto">
                  {properties?.map((item, index) => (
                    <div key={index}>
                      <div className="flex bg-white mt-4 rounded-2xl p-4 cursor-pointer hover:bg-gray-50">
                        <div className="w-1/5 flex justify-center items-center">
                     <FcHome size={24} />
                        </div>
                        <div className="w-4/5">
                          <div className="flex justify-between w-full">
                            <div className="text-nrvPrimaryGreen font-medium text-xs w-1/2">
                              {item?.applicant?.firstName} {item?.applicant?.lastName}
                            </div>
                            <div
                              className="cursor-pointer text-xs text-nrvGrayText underline text-end w-1/2"
                              onClick={() =>
                                router.push(`landlord/properties/rooms/${item?.propertyId?._id}`)
                              }
                            >
                              Apartment ID: {item?.propertyId?.roomId}
                            </div>
                          </div>
                          <div className="text-nrvPrimaryGreen md:text-xs text-xs mt-4">
                            {item?.propertyId?.propertyId.streetAddress},{" "}
                            {item?.propertyId?.propertyId.city},{" "}
                            {item?.propertyId?.propertyId.state}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-full w-120 rounded-2xl p-4 mt-8 text-center">
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
                    className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-8 rounded-md mb-2 hover:text-white hover:bg-nrvPrimaryGreen"
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
      )}
    </div>
  );
};

export default ApplicantScreenForDashboard;
