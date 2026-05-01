"use client";

import { useParams, useRouter } from "next/navigation";
import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { PublicPropertyDetailsModal } from "@/app/components/property/PublicPropertyDetailsModal";

export default function PublicPropertyDetailsRoutePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : null;

  return (
    <HomePageLayout>
      <PublicPropertyDetailsModal
        roomId={id}
        open={!!id}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) router.push("/");
        }}
      />
    </HomePageLayout>
  );
}
