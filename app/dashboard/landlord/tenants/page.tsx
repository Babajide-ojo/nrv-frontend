"use client";

import LandlordsTenantsScreen from "@/app/components/dashboard/landlord/tenants/LandlordsTenantsScreen";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import LandLordLayout from "@/app/components/layout/LandLordLayout";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import ApplicantScreen from "@/app/components/screens/renters/ApplicantScreen";
import { getApplicationCount } from "@/redux/slices/propertySlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


const LandlordsTenantsPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout mainPath="Tenants" >
          <LandlordsTenantsScreen />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default LandlordsTenantsPage;
