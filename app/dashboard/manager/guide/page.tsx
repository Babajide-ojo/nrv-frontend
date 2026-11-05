"use client";

import ManagerLayout from "@/app/components/layout/ManagerLayout";
import HowItWorksGuide from "@/app/components/shared/HowItWorksGuide";

export default function ManagerGuidePage() {
  return (
    <ManagerLayout path="How it works">
      <div className="p-4 sm:p-6 lg:p-8">
        <HowItWorksGuide
          title="How shortlet bookings work"
          intro="List a stay, wait for a guest request, run a NIN and phone check, then collect payment only if the check passes."
          sections={[
            {
              heading: "List a short stay",
              steps: [
                {
                  title: "Add the stay",
                  body: "Go to Listings and add the address, nightly rate, photos, and house rules. Admin approval is required before it appears publicly.",
                },
              ],
            },
            {
              heading: "Guest check, then pay",
              steps: [
                {
                  title: "Buy shortlet identity credits",
                  body: "Each guest check uses one shortlet credit. Tenant screening packs are not used here.",
                },
                {
                  title: "Run check",
                  body: "When a guest requests dates, run the NIN and phone check. A failed check stops payment. A passed check opens a 30-minute pay window.",
                },
                {
                  title: "Confirm the stay",
                  body: "The stay is confirmed only after Paystack payment succeeds.",
                },
              ],
            },
          ]}
        />
      </div>
    </ManagerLayout>
  );
}
