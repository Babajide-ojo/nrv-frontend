"use client";

import { useEffect, useState } from "react";
import Button from "../../shared/buttons/Button";
import ToggleSwitch from "../../shared/input-fields/ToggleSwitch";

const SettingsMainScreen = () => {
  const [notificationSettings, setNotificationSettings] = useState<any>(null);
  const handleToggleChange = (checked: boolean) => {
    console.log("Toggle is now:", checked);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
      console.log({ p: user.notificationSettings });

      setNotificationSettings(user.notificationSettings);
    }
  }, []);
  return (
    <div>
      <div className="mt-8 ml-8">
        <p className="text-lg font-medium text-nrvDarkBlue">Account Settings</p>
        <p className="text-sm text-nrvLightGrey">
          Control Your Account Settings
        </p>
      </div>

      <div className="flex justify-center gap-3 mt-8 bg-[#E0E1E2] p-2">
        <Button
          className="p-3"
          size="minLarge"
          variant="ordinary"
          showIcon={false}
        >
          Notifications
        </Button>
        <Button
          className="p-3"
          size="minLarge"
          variant="ordinary"
          showIcon={false}
        >
          Security
        </Button>
      </div>
      <div className="inline-flex gap-1 mt-4 p-1 bg-[#eef0f2] border border-[#153969] rounded-xl mx-6">
        <Button
          className="p-3"
          size="small"
          variant="ordinary"
          showIcon={false}
        >
          Updates
        </Button>
        <Button
          className="p-3"
          size="small"
          variant="ordinary"
          showIcon={false}
        >
          Account
        </Button>
        <Button
          className="p-3"
          size="small"
          variant="ordinary"
          showIcon={false}
        >
          More
        </Button>
      </div>
      <div className="mx-6 mt-2">
        {notificationSettings && (
          <div>
            <div className="mt-8">
              <ToggleSwitch
                initialChecked={notificationSettings?.platformUpdates}
                onChange={handleToggleChange}
                title="Platform Updates"
                description="Learn about new features, improvements, and ways to better use NaijaRentVerify."
              />
            </div>

            <div className="mt-8">
              <ToggleSwitch
                initialChecked={notificationSettings?.promotions}
                onChange={handleToggleChange}
                title="Promotions"
                description="Receive special offers from NaijaRentVerify and our partners that can save you time and money."
              />
            </div>

            <div className="mt-8">
              <ToggleSwitch
                initialChecked={notificationSettings?.weeklyOpportunities}
                onChange={handleToggleChange}
                title="Weekly Newsletter"
                description="Get impactful resources to manage your rental property and announcements about NaijaRentVerify."
              />
            </div>

            <div className="mt-8">
              <ToggleSwitch
                initialChecked={notificationSettings?.feedbackOpportunities}
                onChange={handleToggleChange}
                title="Feedback Opportunities"
                description="Get contacted about feedback opportunities to improve NaijaRentVerify."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsMainScreen;
