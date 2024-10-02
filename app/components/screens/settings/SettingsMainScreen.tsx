"use client";

import { useEffect, useState } from "react";
import Button from "../../shared/buttons/Button";
import ToggleSwitch from "../../shared/input-fields/ToggleSwitch";
import VerifyEmailScreen from "../sign-in/VerifyEmailScreen";
import InputField from "../../shared/input-fields/InputFields";
import { cls } from "../../../../helpers/utils";

const SettingsMainScreen = () => {
  const [notificationSettings, setNotificationSettings] = useState<any>(null);
  const [mainToggle, setMainToggle] = useState<number>(0);
  const [notificationTab, setNotificationTab] = useState<any>(0);
  const handleToggleChange = (checked: boolean) => {};

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("nrv-user") as any);
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
             className={`p-3 ${
              mainToggle === 0 ? "bg-nrvDarkBlue text-white" : ""
            }`}
          size="minLarge"
          variant="ordinary"
          showIcon={false}
          onClick={() => setMainToggle(0)}
        >
          Notifications
        </Button>
        <Button
          className={`p-3 ${
            mainToggle === 1 ? "bg-nrvDarkBlue text-white" : ""
          }`}
          size="minLarge"
          variant="ordinary"
          showIcon={false}
          onClick={() => setMainToggle(1)}
        >
          Security
        </Button>
      </div>

      {mainToggle === 0 && (
        <div>
          <div className="inline-flex gap-1 mt-4 p-1 bg-[#eef0f2] border border-[#153969] rounded-xl mx-6">
            <Button
              className={`p-3 ${
                notificationTab === 0 ? "bg-nrvDarkBlue text-white" : ""
              }`}
              size="small"
              variant="ordinary"
              showIcon={false}
              onClick={() => setNotificationTab(0)}
            >
              Updates
            </Button>
            <Button
              className={`p-3 ${
                notificationTab === 1 ? "bg-nrvDarkBlue text-white" : ""
              }`}
              size="small"
              variant="ordinary"
              showIcon={false}
              onClick={() => setNotificationTab(1)}
            >
              Account
            </Button>
            <Button
              className={`p-3 ${
                notificationTab === 2 ? "bg-nrvDarkBlue text-white" : ""
              }`}
              size="small"
              variant="ordinary"
              showIcon={false}
              onClick={() => setNotificationTab(2)}
            >
              More
            </Button>
          </div>
          <div className="mx-6 mt-2">
            {notificationTab === 0 && notificationSettings && (
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
          <div className="mx-6 mt-2">
            {notificationTab === 1 && notificationSettings && (
              <div>
                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.platformUpdates}
                    onChange={handleToggleChange}
                    title="Messages from Renters"
                    description="Learn about new features, improvements, and ways to better use NaijaRentVerify."
                  />
                </div>

                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.promotions}
                    onChange={handleToggleChange}
                    title="Property"
                    description="Property
Know when your property is sent to listing sites, when marketing is going to end, or when your property documents are going to expire."
                  />
                </div>

                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.weeklyOpportunities}
                    onChange={handleToggleChange}
                    title="Leads"
                    description="Find out when you have a new lead or completed pre-screeners."
                  />
                </div>

                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.feedbackOpportunities}
                    onChange={handleToggleChange}
                    title="Applicants"
                    description="
Be notified when you receive a new application and when a screening report is available."
                  />
                </div>

                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.feedbackOpportunities}
                    onChange={handleToggleChange}
                    title="Leases"
                    description="Get notified about the status of your lease, your tenants' renters insurance policy, and incomplete forms."
                  />
                </div>
                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.feedbackOpportunities}
                    onChange={handleToggleChange}
                    title="Check-ins & Maintenance Feedback"
                    description="Know when your tenants complete check-ins and when they share input on how a maintenance issue was resolved."
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mx-6 mt-2">
            {notificationTab === 2 && notificationSettings && (
              <div>
                <div className="mt-8">
                  <ToggleSwitch
                    initialChecked={notificationSettings?.platformUpdates}
                    onChange={handleToggleChange}
                    title="Maintenance Reminder"
                    description="Get timely reminders for scheduled maintenance tasks, ensuring your property remains in excellent condition"
                  />
                </div>
              </div>
            )}
          </div>
          <Button
            className="p-3 mx-6 mt-8"
            size="small"
            variant="bluebg"
            showIcon={false}
            onClick={() => {}}
          >
            Save updates
          </Button>
        </div>
      )}

      {mainToggle === 1 && (
        <div className="mt-2 md:w-1/3 w-full p-4">
          <div className="mt-4">
            <InputField
              label="Current Password"
              placeholder="Enter Current Password"
              inputType="email"
              css="bg-nrvLightGreyBg"
              name="email"
            />
          </div>
          <div className="mt-4">
            <InputField
              label="New Password"
              placeholder="Enter New Password"
              inputType="email"
              css="bg-nrvLightGreyBg"
              name="email"
         
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Confirm New Password"
              placeholder="Confirm New Password"
              inputType="email"
              css="bg-nrvLightGreyBg"
              name="email"
            />
          </div>
          <Button
            className="p-3 mx-6 mt-8"
            size="small"
            variant="bluebg"
            showIcon={false}
            onClick={() => {}}
          >
            Save updates
          </Button>
        </div>
      )}
    </div>
  );
};

export default SettingsMainScreen;
