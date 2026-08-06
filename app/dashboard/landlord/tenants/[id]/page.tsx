import LandLordLayout from "@/app/components/layout/LandLordLayout";
import TenantScreen from "@/app/components/screens/renters/TenantScreen";

export default function LeaseDetailsPage() {
  return (
    <LandLordLayout mainPath="Tenants" subMainPath="Lease Details">
      <TenantScreen />
    </LandLordLayout>
  );
}
