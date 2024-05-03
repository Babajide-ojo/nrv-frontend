"use client";

import LoadingPage from "../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../components/layout/LandLordLayout";
import EmptyState from "../../components/screens/empty-state/EmptyState";

const PropertiesScreen = () => {
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
          <LandLordLayout>
            <div className="p-8 w-full">
              <div className="text-2xl">Properties 🏘️,</div>
              <p className="text-sm text-nrvLightGrey">
                Let’s add another property :)
              </p>
              <div className="w-full h-screen flex justify-center items-center">
                <EmptyState />
              </div>
            </div>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default PropertiesScreen;
