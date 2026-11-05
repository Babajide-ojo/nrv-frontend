"use client";

import LandLordLayout from "@/app/components/layout/LandLordLayout";
import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import HostShortStaysBoard from "@/app/components/short-stays/HostShortStaysBoard";

const LandlordShortStaysPage = () => {
  return (
    <ProtectedRoute>
      <LandLordLayout mainPath="Short stays" subMainPath="Manage shortlets">
        <HostShortStaysBoard
          createHref="/dashboard/landlord/short-stays/create"
          canRunCheck={false}
        />
      </LandLordLayout>
    </ProtectedRoute>
  );
};

export default LandlordShortStaysPage;
