import LandLordLayout from "@/app/components/layout/LandLordLayout"
import ApplicationDetails from "@/app/components/screens/renters/ApplicantDetails"
import TenantScreen from "@/app/components/screens/renters/TenantScreen";

const Page = () => {
    return (
  <LandLordLayout subMainPath="Application Details" mainPath="Leads & Applications">
    <TenantScreen />
  </LandLordLayout>
    )
}

export default Page;