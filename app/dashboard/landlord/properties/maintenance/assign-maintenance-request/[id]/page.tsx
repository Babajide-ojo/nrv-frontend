import LandLordLayout from "@/app/components/layout/LandLordLayout"
import AssignMaintenanceRequest from "@/app/components/maintainance/AssignMaintenanceRequest"

const Page = () => {
    return (
        <LandLordLayout path="Maintenance" mainPath="View Maintenance" subMainPath="Assignment" >
            <AssignMaintenanceRequest />
        </LandLordLayout>
    )
}

export default Page;