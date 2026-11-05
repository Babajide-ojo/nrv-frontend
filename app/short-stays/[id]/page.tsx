import HomePageLayout from "@/app/components/layout/HomePageLayout";
import ShortStayDetail from "@/app/components/short-stays/ShortStayDetail";

export default function ShortStayDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <HomePageLayout showFooter={false}>
      <ShortStayDetail roomId={params.id} />
    </HomePageLayout>
  );
}
