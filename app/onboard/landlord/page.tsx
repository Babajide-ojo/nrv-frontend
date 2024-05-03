import ProtectedRoute from "../../components/guard/LandlordProtectedRoute";
import OnboardingScreen from "../../components/screens/onboarding/OnboardingScreen";

const Page = () => {
  return (
    <div>
      <ProtectedRoute>
        <OnboardingScreen />
      </ProtectedRoute>
    </div>
  );
};

export default Page;
