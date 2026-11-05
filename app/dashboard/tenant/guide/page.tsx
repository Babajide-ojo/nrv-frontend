"use client";

import TenantLayout from "@/app/components/layout/TenantLayout";
import HowItWorksGuide from "@/app/components/shared/HowItWorksGuide";

const TenantGuidePage = () => {
  return (
    <TenantLayout path="How it works">
      <div className="p-4 sm:p-6 lg:p-8">
        <HowItWorksGuide
          title="How Naija Rent Verify works for tenants"
          intro="A simple guide to finding an apartment, applying, verification, and managing your rental."
          sections={[
            {
              heading: "Find and apply",
              steps: [
                {
                  title: "Browse properties",
                  body: "Open Properties to see available apartments. Filter by location and rent if needed.",
                },
                {
                  title: "View details and apply",
                  body: "Open a listing for photos, rent, and amenities, then submit an application to the landlord.",
                },
                {
                  title: "Track applications",
                  body: "Use Applications to see status updates—new, accepted, active lease, or ended.",
                },
              ],
            },
            {
              heading: "Verification and your rental",
              steps: [
                {
                  title: "Complete verification",
                  body: "If your landlord invites you, go to My Verifications and complete the form so they can review your trust report.",
                },
                {
                  title: "Rented apartments",
                  body: "After your lease is active, open Rented Apartments for lease details, documents, and related actions.",
                },
              ],
            },
            {
              heading: "Stay in touch",
              steps: [
                {
                  title: "Maintenance requests",
                  body: "From Maintenance, report issues for your rented apartment and follow progress.",
                },
                {
                  title: "Messages",
                  body: "Message your landlord from Messages for questions about the lease, visits, or repairs.",
                },
              ],
            },
          ]}
        />
      </div>
    </TenantLayout>
  );
};

export default TenantGuidePage;
