import LandLordLayout from "@/app/components/layout/LandLordLayout";
import SettingsMainScreen from "@/app/components/screens/settings/SettingsMainScreen";


const SettingsMainPage = () => {
  return (
    <LandLordLayout path="Settings" mainPath="Account">
      <SettingsMainScreen />
    </LandLordLayout>
  );
};

export default SettingsMainPage;
