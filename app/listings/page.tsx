import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { AvailableListingsScreen } from "@/app/components/listings/AvailableListingsScreen";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Available rooms and apartments",
  "Browse available rooms and apartments in Nigeria. Sign in or create an account to apply.",
  "/listings",
);

export default function ListingsPage() {
  return (
    <HomePageLayout>
      <AvailableListingsScreen variant="public" />
    </HomePageLayout>
  );
}
