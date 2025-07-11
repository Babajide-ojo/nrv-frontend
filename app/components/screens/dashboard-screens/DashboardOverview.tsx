import { Avatar } from "@mui/material";
import React, { useState, useMemo } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AvatarGenerator } from "random-avatar-generator";

// Types
interface Activity {
  name: string;
  details: string;
  time: string;
}

interface QuickLink {
  title: string;
  description: string;
  buttonText: string;
}

// Constants
const RECENT_ACTIVITIES: Activity[] = [
  {
    name: "New Tenant Approved",
    details: "Tunde Adeyemi approved for Property A",
    time: "3 hours ago",
  },
  {
    name: "Rent Payment Received",
    details: "₦200,000 received for Property B",
    time: "4 hours ago",
  },
  {
    name: "Maintenance Request Submitted",
    details: "Plumbing issue reported for Property C",
    time: "4 hours ago",
  },
  {
    name: "Rent Payment Received",
    details: "₦2,700,000 received for Property G",
    time: "4 hours ago",
  },
];

const QUICK_LINK: QuickLink = {
  title: "Tenant Verification",
  description: "Verify your tenants with ease.",
  buttonText: "Proceed",
};

// Components
const ProgressCircle: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-20 h-20">
    <CircularProgressbar
      value={progress}
      text={`${progress}%`}
      styles={buildStyles({
        textSize: "24px",
        pathColor: "#15803d",
        textColor: "#166534",
        trailColor: "#e5e7eb",
      })}
    />
  </div>
);

const PropertySetupBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <div className="p-4 bg-[#E9F4E7] rounded-sm flex items-center justify-between gap-8">
    <div>
      <h3 className="text-[#03442C] font-medium">
        Your Property Setup is 80% Complete!
      </h3>
      <p className="text-[#67667A] font-light text-xs leading-6">
        Complete your property setup by adding apartments and start
        managing rentals with ease.
      </p>
      <div className="flex gap-8 mt-4">
        <button
          className="text-sm text-[#98A2B3] hover:text-[#6B7280] transition-colors"
          onClick={onDismiss}
        >
          Dismiss
        </button>
        <button className="text-[#045D23] text-sm font-medium flex items-center hover:text-[#03442C] transition-colors">
          Complete Setup →
        </button>
      </div>
    </div>
    <ProgressCircle progress={80} />
  </div>
);

const QuickLinksSection: React.FC = () => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h3 className="font-medium text-[#101828]">Quick Links</h3>
    <div className="mt-2 flex items-start justify-between rounded-lg">
      <div className="flex items-center gap-2">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#E9F4E7" />
          <path
            d="M18 22C18 21.4477 18.4477 21 19 21H24C24.5523 21 25 21.4477 25 22C25 22.5523 24.5523 23 24 23H19C18.4477 23 18 22.5523 18 22Z"
            fill="#045D23"
          />
          <path
            d="M19 25C18.4477 25 18 25.4477 18 26C18 26.5523 18.4477 27 19 27H28C28.5523 27 29 26.5523 29 26C29 25.4477 28.5523 25 28 25H19Z"
            fill="#045D23"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34C23.1677 34 22.3578 33.8981 21.5827 33.7056L16.0388 33.0126C14.8405 32.8628 14.0077 31.7459 14.2063 30.5547L14.5491 28.4974C14.5511 28.4854 14.5514 28.4733 14.5499 28.4613L14.2944 26.4173C14.1019 25.6422 14 24.8323 14 24ZM24 16C19.5817 16 16 19.5817 16 24C16 24.6866 16.0863 25.3515 16.248 25.9853L16.2636 26.0462L16.5344 28.2132C16.5599 28.4171 16.5557 28.6235 16.5219 28.8262L16.179 30.8835C16.1674 30.9536 16.2164 31.0193 16.2868 31.0281L21.9538 31.7364L22.0147 31.752C22.6485 31.9137 23.3135 32 24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16Z"
            fill="#045D23"
          />
        </svg>

        <div>
          <div className="text-sm font-medium text-[#101928]">
            {QUICK_LINK.title}
          </div>
          <div className="text-sm mt-2 font-light text-[#475367]">
            {QUICK_LINK.description}
          </div>
        </div>
      </div>
      <button className="px-3 py-1 text-sm border border-1 text-[#03442C] rounded-lg hover:bg-[#E9F4E7] transition-colors">
        {QUICK_LINK.buttonText}
      </button>
    </div>
  </div>
);

const ActivityItem: React.FC<Activity> = ({ name, details, time }) => (
  <li className="flex items-start gap-3">
    <div>
      <p className="font-normal text-[13px]">
        {name}{" "}
        <span className="text-[12px] text-[#344054]">{time}</span>
      </p>
      <p className="text-sm text-gray-600 font-light text-[12px] mt-2">
        {details}
      </p>
    </div>
  </li>
);

const RecentActivitiesSection: React.FC = () => (
  <div className="p-4 border rounded-lg shadow-sm">
    <h3 className="font-semibold">Recent Activities</h3>
    <ul className="mt-3 space-y-6">
      {RECENT_ACTIVITIES.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </ul>
  </div>
);

const DashboardOverview: React.FC = () => {
  const [showVerification, setShowVerification] = useState<boolean>(false);

  // Memoized avatar generator to prevent unnecessary re-renders
  const avatarGenerator = useMemo(() => new AvatarGenerator(), []);

  const handleDismissVerification = () => {
    setShowVerification(false);
  };

  return (
    <div className="space-y-4 font-jakarta">
      {/* Property Setup Progress - Currently commented out but improved */}
      {showVerification && (
        <PropertySetupBanner onDismiss={handleDismissVerification} />
      )}

      {/* Quick Links */}
      <QuickLinksSection />

      {/* Recent Activities */}
      <RecentActivitiesSection />
    </div>
  );
};

export default DashboardOverview;
