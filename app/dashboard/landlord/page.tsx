"use client";

import React from "react";
import LandLordLayout from "../../components/layout/LandLordLayout";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import DashboardScreen from "../../components/screens/dashboard-screens/DashBoardScreen";

const SignIn = () => {
  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout mainPath="Dashboard">
          <DashboardScreen />
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default SignIn;
