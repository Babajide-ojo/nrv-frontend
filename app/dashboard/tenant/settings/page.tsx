import LandLordLayout from "@/app/components/layout/LandLordLayout";
import TenantLayout from "@/app/components/layout/TenantLayout";
import SettingsMainScreen from "@/app/components/screens/settings/SettingsMainScreen";


const SettingsMainPage = () => {
  return (
    <div>
      <TenantLayout>
        <SettingsMainScreen />
      </TenantLayout>
    </div>
  );
};

export default SettingsMainPage;
