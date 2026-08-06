import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { AvailableListingsScreen } from "@/app/components/listings/AvailableListingsScreen";

export default function ListingsPage() {
  return (
    <HomePageLayout>
      <AvailableListingsScreen variant="public" />
    </HomePageLayout>
  );
}
