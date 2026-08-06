import HomePageLayout from "@/app/components/layout/HomePageLayout";
import { ReactNode } from "react";

const TenantVerificationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <HomePageLayout showFooter={false}>
      <div className="p-5 min-h-[90vh] bg-[#f9fafb]">{children}</div>
    </HomePageLayout>
  );
};

export default TenantVerificationLayout;
