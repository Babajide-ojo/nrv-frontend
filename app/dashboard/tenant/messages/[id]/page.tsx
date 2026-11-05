"use client";

import TenantLayout from "@/app/components/layout/TenantLayout";
import MessagingDetailsScreen from "@/app/components/screens/message/MessagingDetailsScreen";

const Page = () => {
  return (
    <div>
      <TenantLayout>
        <MessagingDetailsScreen source="sender" />
      </TenantLayout>
    </div>
  );
};

export default Page;
