"use client";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import SelectDate from "@/app/components/shared/SelectDate";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";

const EmploymentInfoVerification = () => {
  const [openDate, setOpenDate] = useState(false);
  const [formData, setFormData] = useState({
    employmentStatus: "",
    nameOfCompany: "",
    role: "",
    currentEmployer: "",
    dateJoined: "",
    companyAddress: "",
    monthlyIncome: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const employmentStatusOptions = [
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
        <h3 className="font-medium">What do you do for work?</h3>
        <p className="text-xs text-[#667085]">
          Tell us where you work and what your role is.
        </p>
      </div>
      <div className="">
        <div className="bg-[#FDFDFC]  border border-[#ECECEE] rounded-lg p-5 flex flex-col gap-5">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField
              label="Name of Company"
              name="nameOfCompany"
              value={formData.nameOfCompany}
              onChange={handleInputChange}
              error={errors.nameOfCompany}
            />
            <InputField
              label="Your Role in the Company"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
            />
            <InputField
              label="Current Employer"
              name="currentEmployer"
              value={formData.currentEmployer}
              onChange={handleInputChange}
              error={errors.currentEmployer}
            />
            <InputField
              label="Company Address"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              error={errors.companyAddress}
            />
            <InputField
              label="Monthly Income"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              error={errors.monthlyIncome}
            />
            <InputField
              label="Date Joined"
              name="dateJoined"
              placeholder="Select Date of Birth"
              value={formData.dateJoined}
              onClick={() => setOpenDate(true)}
              onChange={() => {}}
              error={errors.dateJoined}
              readOnly
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <Button className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10">
            Save and Continue
          </Button>
        </div>
      </div>
      <SelectDate
        isOpen={openDate}
        onClose={() => setOpenDate(false)}
        value={formData.dateJoined}
        onChange={(selectedDate: any) => {
          setFormData((prevData) => ({
            ...prevData,
            dateJoined: format(new Date(selectedDate), "yyyy-MM-dd"),
          }));
        }}
      />
    </div>
  );
};

export default EmploymentInfoVerification;
