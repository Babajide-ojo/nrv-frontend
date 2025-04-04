"use client";

import React, { useState, useEffect } from "react";
import LoadingPage from "../../components/loaders/LoadingPage";
import LandLordLayout from "../../components/layout/LandLordLayout";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import DashboardScreen from "../../components/screens/dashboard-screens/DashBoardScreen";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <LandLordLayout mainPath="Dashboard">
            <DashboardScreen />
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default SignIn;
