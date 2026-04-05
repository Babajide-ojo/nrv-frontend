"use client";

import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import LandLordLayout from "../../../../components/layout/LandLordLayout";
import Button from "../../../../components/shared/buttons/Button";

const MessageScreen = () => {
  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <div className="p-8 w-full">
            <div className="text-xl">Messages 🏘️.</div>

            <div className="w-full h-screen flex justify-center items-center">
              <div className="">
                <Button
                  size="normal"
                  className="text-nrvPrimaryGreen block w-full border border-nrvPrimaryGreen mt-4 rounded-md"
                  variant="lightGrey"
                  showIcon={false}
                >
                  <div className="flex gap-3 ">
                    <p className="text-nrvPrimaryGreen">Start Conversaton</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default MessageScreen;
