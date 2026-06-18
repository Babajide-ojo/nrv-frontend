import { Mail } from "lucide-react";

type StepStatus = "complete" | "current" | "upcoming";

const STEPS: { title: string; description: string; status: StepStatus }[] = [
  {
    title: "Select User Type",
    description: "Choose whether you are signing up as a landlord or tenant.",
    status: "complete",
  },
  {
    title: "Create Your Account",
    description: "Register with your name, email, and password.",
    status: "complete",
  },
  {
    title: "Verify Email or Phone",
    description: "Confirm your contact details to secure your account.",
    status: "complete",
  },
  {
    title: "Add Your Property",
    description:
      "Help us personalize your experience by providing a few details about your property.",
    status: "current",
  },
  {
    title: "Set Up Your Property Preferences (Optional)",
    description:
      "Tell us more about your property to get personalized recommendations.",
    status: "upcoming",
  },
];

const CompletedIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="16" fill="white" />
    <rect x="1" y="1" width="30" height="30" rx="15" stroke="#045D23" strokeWidth="2" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.7953 9.85322L13.2487 19.0666L10.7153 16.3599C10.2487 15.9199 9.51534 15.8932 8.982 16.2666C8.462 16.6532 8.31534 17.3332 8.63534 17.8799L11.6353 22.7599C11.9287 23.2132 12.4353 23.4932 13.0087 23.4932C13.5553 23.4932 14.0753 23.2132 14.3687 22.7599C14.8487 22.1332 24.0087 11.2132 24.0087 11.2132C25.2087 9.98655 23.7553 8.90655 22.7953 9.83989V9.85322Z"
      fill="#045D23"
    />
  </svg>
);

const ActiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="16" fill="white" />
    <rect x="1" y="1" width="30" height="30" rx="15" stroke="#045D23" strokeWidth="2" />
    <circle cx="16" cy="16" r="5" fill="#045D23" />
  </svg>
);

const UpcomingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="16" fill="white" />
    <rect x="1" y="1" width="30" height="30" rx="15" stroke="#CBD5E1" strokeWidth="2" />
    <circle cx="16" cy="16" r="5" fill="#CBD5E1" />
  </svg>
);

const StepIcon = ({ status }: { status: StepStatus }) => {
  if (status === "complete") {
    return <CompletedIcon />;
  }
  if (status === "current") {
    return <ActiveIcon />;
  }
  return <UpcomingIcon />;
};

const AddPropertySideBar = () => {
  return (
    <div className="flex h-full min-h-screen w-full flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-8">
        <div className="space-y-3 px-2 sm:px-4">
          <h1 className="text-xl font-bold text-black sm:text-2xl">NaijaRentVerify</h1>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/sign-in" className="font-semibold text-green-900 hover:underline">
              Log in here.
            </a>
          </p>
        </div>

        <ol className="mt-8 space-y-6 px-2 sm:px-4">
          {STEPS.map((step) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 shrink-0">
                <StepIcon status={step.status} />
              </span>
              <div className="min-w-0">
                <h3
                  className={`font-medium ${
                    step.status === "upcoming" ? "text-gray-400" : "text-[#645D5D]"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <footer className="flex shrink-0 flex-col gap-2 border-t border-green-900/10 px-4 py-4 text-sm text-green-900 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© Naijarentverify 2025</p>
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <a href="mailto:info@naijarentverify.com" className="hover:underline">
            info@naijarentverify.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AddPropertySideBar;
