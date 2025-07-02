import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import SelectDate from "@/app/components/shared/SelectDate";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiInfo } from "react-icons/fi";

const PersonalInfoVerification = () => {
  const router = useRouter()
  const [openDate, setOpenDate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    maritalStatus: "",
    homeAddress: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const maritalStatusOptions = [
    { label: "Single", value: "Single" },
    { label: "Married", value: "Married" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  console.log(formData);

  return (
    <div className="">
      <div className="pb-4 border-b border-gray-200 mb-5">
        <h3 className="font-medium">
          Let&apos;s start with a few personal details
        </h3>
        <p className="text-xs text-[#667085]">
          We would like to know a few things about you
        </p>
      </div>
      <div className="">
        <div className="bg-[#FDFDFC]  border border-[#ECECEE] rounded-lg p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
            />
            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              inputType="phone"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              placeholder="Select Date of Birth"
              value={formData.dateOfBirth}
              onClick={() => setOpenDate(true)}
              onChange={() => {}}
              error={errors.dateOfBirth}
              readOnly
            />
            <SelectField
              label="Marital Status"
              name="maritalStatus"
              value={maritalStatusOptions.find(
                (option) => option.value === formData.maritalStatus
              )}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  maritalStatus: e.value,
                }));
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  maritalStatus: "",
                }));
              }}
              options={maritalStatusOptions}
              error={errors.state}
              // css="bg-nrvLightGreyBg"
            />
          </div>
          <div className="pt-3 pb-6 border-t border-[#ECECEE] mt-5">
            <InputField
              label={
                <p className="flex items-center gap-1">
                  Home Address <FiInfo />
                </p>
              }
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleInputChange}
              error={errors.homeAddress}
            />

            <p className="text-xs text-[#807F94] mt-1">
              Your address at the time of filling this form.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            onClick={() =>
              router.push("/dashboard/tenant/verification/employment-info")
            }
            className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10"
          >
            Save and Continue
          </Button>
        </div>
      </div>
      <SelectDate
        isOpen={openDate}
        onClose={() => setOpenDate(false)}
        value={formData.dateOfBirth}
        onChange={(selectedDate: any) => {
          setFormData((prevData) => ({
            ...prevData,
            dateOfBirth: format(new Date(selectedDate), "yyyy-MM-dd"),
          }));
        }}
      />
    </div>
  );
};

export default PersonalInfoVerification;
