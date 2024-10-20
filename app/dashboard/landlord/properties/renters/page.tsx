"use client";

import LoadingPage from "../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import EmptyState from "../../../../components/screens/empty-state/EmptyState";
import Button from "../../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";
import LeadsScreen from "../../../../components/screens/renters/LeadsScreen";
import ApplicantScreen from "../../../../components/screens/renters/ApplicantScreen";
import TenantScreen from "../../../../components/screens/renters/TenantScreen";
import { useDispatch } from "react-redux";
import { getApplicationCount } from "../../../../../redux/slices/propertySlice";



const MessageScreen = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [currentState, setCurrentState] = useState<number>(1);
  const [user, setUser] = useState<any>({});
  const [count, setCount] = useState<any>({});

  const fetchData = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") as any);
    setUser(user?.user);
    const formData = {
      id: user?.user?._id,
    };

    try {
      const response = await dispatch(getApplicationCount(formData) as any);
      setCount(response.payload.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    fetchData();
    return () => clearTimeout(timer);
  }, []);
  const propertyDashboardLinks: any = [
    {
      id: 1,
      name: `Applicants(${count.totalNew})`,
    },
    {
      id: 2,
      name: `Leads(${count.totalAccepted})`,
    },

    {
      id: 3,
      name:`Tenants(${count.totalActiveTenants})`,
    },
  ];
  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout>
            {showEmptyState === true ? (
              <div className="p-8 w-full">
                <div className="text-xl">Properties 🏘️</div>
                <p className="text-xs text-nrvLightGrey">
                  Let’s add another property :)
                </p>
                <div className="w-full h-screen flex justify-center items-center">
                  <div className="">
                    <EmptyState />
                    <p className="text-nrvLightGrey m-2">
                      No property listed yet
                    </p>
                    <Button
                      size="normal"
                      className="text-nrvDarkBlue block w-full border border-nrvDarkBlue mt-4 rounded-md"
                      variant="lightGrey"
                      showIcon={false}
                    >
                      <div
                        className="flex gap-3"
                        onClick={() => {
                          setShowEmptyState(false);
                        }}
                      >
                        {/* <IoAddCircle size={20} className="text-nrvDarkBlue" />{" "} */}
                        <p className="text-nrvDarkBlue">Add New</p>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex w-full gap-1 md:gap-6 bg-nrvGreyMediumBg overflow-scroll justify-center">
                  {propertyDashboardLinks.map((item: any) => (
                    <div key={item.id}>
                      <Button
                        size="large"
                        className={`text-nrvDarkBlue border border-nrvGreyMediumBg mt-2 rounded-md mb-2 font-medium text-md ${
                          currentState === item.id
                            ? "bg-nrvDarkBlue text-white"
                            : "bg-nrvGreyMediumBg"
                        }`}
                        variant="ordinary"
                        showIcon={false}
                        onClick={() => {
                          setCurrentState(item.id);
                        }}
                      >
                        <div className="text-xs  md:text-md p-2">
                          {item.name}
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="m-4 w-full md:w-2/5 mx-auto">
                  {currentState === 1 && <ApplicantScreen />}
                  {currentState === 2 && <LeadsScreen />}
                  {currentState === 3 && <TenantScreen />}
                </div>
              </div>
            )}
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default MessageScreen;
