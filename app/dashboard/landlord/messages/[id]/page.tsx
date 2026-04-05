"use client";

import ProtectedRoute from "../../../../components/guard/LandlordProtectedRoute";
import MessagingDetailsScreen from "@/app/components/screens/message/MessagingDetailsScreen";
import LandLordLayout from "@/app/components/layout/LandLordLayout";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <LandLordLayout>
          <MessagingDetailsScreen source="recipent" />
        </LandLordLayout>
      </ProtectedRoute>
    </div>
  );
};

export default Page;
