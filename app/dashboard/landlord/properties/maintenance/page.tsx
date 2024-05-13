"use client";

import LoadingPage from "../../../../components/loaders/LoadingPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import EmptyState from "../../../../components/screens/empty-state/EmptyState";
import Button from "../../../../components/shared/buttons/Button";
import { IoAddCircle } from "react-icons/io5";

const MessageScreen = () => {
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
                <div className="">
                  <EmptyState />
                  <p className="text-nrvLightGrey m-2">No property listed yet</p>
                  <Button
                    size="small"
                    className="text-nrvDarkBlue block w-full border border-nrvDarkBlue mt-4 rounded-md"
                    variant="lightGrey"
                    showIcon={false}
                  >
    
                    <div className="flex gap-3 ">
                      <IoAddCircle size={20} className="text-nrvDarkBlue" />{" "}
                      <p className="text-nrvDarkBlue">Add New</p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </LandLordLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default MessageScreen;
