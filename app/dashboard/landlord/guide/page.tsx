"use client";

import LandLordLayout from "@/app/components/layout/LandLordLayout";
import HowItWorksGuide from "@/app/components/shared/HowItWorksGuide";

const LandlordGuidePage = () => {
  return (
    <LandLordLayout path="How it works" mainPath="Guide">
      <div className="p-4 sm:p-6 lg:p-8">
        <HowItWorksGuide
          title="How Naija Rent Verify works for landlords"
          intro="A short walkthrough of the main landlord workflows—from listing a property to ending a tenancy."
          sections={[
            {
              heading: "List your property",
              steps: [
                {
                  title: "Create a property",
                  body: "Go to Properties → Create property. Add the building address, photos, and basic details.",
                },
                {
                  title: "Add apartments",
                  body: "Open the property and add one or more apartments (units). Include rent, amenities, and apartment images.",
                },
                {
                  title: "Request listing approval",
                  body: "When an apartment is ready, request approval so it can appear on the public marketplace after admin review.",
                },
              ],
            },
            {
              heading: "Manage applications and tenants",
              steps: [
                {
                  title: "Review leads and applications",
                  body: "Use Leads & Applications to see who applied. Accept, reject, or request verification as needed.",
                },
                {
                  title: "Onboard a tenant",
                  body: "From an occupied unit or Tenants, onboard a tenant with their name, email, and lease dates. They will receive login details to set a password.",
                },
                {
                  title: "Buy verification credits",
                  body: "Under Buy verification credit, purchase standard or premium credits before inviting tenants to verify.",
                },
              ],
            },
            {
              heading: "Day-to-day operations",
              steps: [
                {
                  title: "Maintenance",
                  body: "Track and assign maintenance requests from the Maintenance menu.",
                },
                {
                  title: "Messages",
                  body: "Chat with tenants from Messages—text and images are supported.",
                },
                {
                  title: "End a tenancy",
                  body: "When a lease ends, use End tenancy and choose a reason. The apartment is freed but stays unlisted until you list it again manually.",
                },
              ],
            },
          ]}
        />
      </div>
    </LandLordLayout>
  );
};

export default LandlordGuidePage;
