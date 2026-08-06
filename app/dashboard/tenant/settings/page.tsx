import TenantLayout from "@/app/components/layout/TenantLayout";
import SettingsMainScreen from "@/app/components/screens/settings/SettingsMainScreen";


const SettingsMainPage = () => {
  return (
    <TenantLayout path="Settings" mainPath="Account">
      <SettingsMainScreen />
    </TenantLayout>
  );
};

export default SettingsMainPage;
