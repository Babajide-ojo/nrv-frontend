import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { pageMetadata } from "@/lib/seo";
import ShortStaysBrowse from "@/app/components/short-stays/ShortStaysBrowse";

export const metadata = pageMetadata(
  "Short stays",
  "Browse short stays in Nigeria. Request dates after you confirm your account.",
  "/short-stays",
);

export default function ShortStaysPage() {
  return (
    <HomePageLayout showFooter={false}>
      <ShortStaysBrowse />
    </HomePageLayout>
  );
}
