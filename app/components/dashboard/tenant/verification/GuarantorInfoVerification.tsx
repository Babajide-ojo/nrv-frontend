import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiInfo } from "react-icons/fi";

const GuarantorInfoVerification = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    company: "",
    employmentStatus: "",
    guarantorHomeAddress: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const employmentStatusOptions = [
    { label: "Employed", value: "Employed" },
    { label: "Self Employed", value: "Self Employed" },
    { label: "UnEmployed", value: "UnEmployed" },
    { label: "Student", value: "Student" },
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
        <h3 className="font-medium">Who is your guarantor?</h3>
        <p className="text-xs text-[#667085]">
          Tell us who your guarantor is and how to reach out to them
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
            <SelectField
              label="Employment Status"
              name="employmentStatus"
              value={employmentStatusOptions.find(
                (option) => option.value === formData.employmentStatus
              )}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  employmentStatus: e.value,
                }));
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  employmentStatus: "",
                }));
              }}
              options={employmentStatusOptions}
              error={errors.state}
              // css="bg-nrvLightGreyBg"
            />
            <InputField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              error={errors.company}
            />
          </div>
          <div className="pt-3 pb-6 border-t border-[#ECECEE] mt-5">
            <InputField
              label={
                <p className="flex items-center gap-1">
                  Guarantor&apos;s Home Address <FiInfo />
                </p>
              }
              name="guarantorHomeAddress"
              value={formData.guarantorHomeAddress}
              onChange={handleInputChange}
              error={errors.guarantorHomeAddress}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            onClick={() =>
              router.push("/dashboard/tenant/verification/self-id")
            }
            className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10"
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuarantorInfoVerification;
