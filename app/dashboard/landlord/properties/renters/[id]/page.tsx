import LandLordLayout from "@/app/components/layout/LandLordLayout"
import ApplicationDetails from "@/app/components/screens/renters/ApplicantDetails"

const Page = () => {
    return (
  <LandLordLayout subMainPath="Application Details" mainPath="Leads & Applications">
    <ApplicationDetails />
  </LandLordLayout>
    )
}

export default Page;