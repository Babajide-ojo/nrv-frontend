import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { FiInfo } from "react-icons/fi";
import { apiService } from "@/lib/api";

interface GuarantorInfoVerificationProps {
  initialData?: any;
}

const GuarantorInfoVerification = ({ initialData }: GuarantorInfoVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    employmentStatus: "",
    company: "",
    guarantorHomeAddress: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [verificationResponseId, setVerificationResponseId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [prefilledData, setPrefilledData] = useState(formData);

  const employmentStatusOptions = [
    { label: "Employed", value: "Employed" },
    { label: "Self Employed", value: "Self Employed" },
    { label: "UnEmployed", value: "UnEmployed" },
    { label: "Student", value: "Student" },
  ];

  useEffect(() => {
    const idFromQuery = searchParams.get("verificationId");
    if (idFromQuery) {
      setVerificationResponseId(idFromQuery);
    }
    if (initialData) {
      const prefill = {
        firstName: initialData.guarantorFirstName || "",
        lastName: initialData.guarantorLastName || "",
        email: initialData.guarantorEmail || "",
        phoneNumber: initialData.guarantorPhone || "",
        employmentStatus: initialData.guarantorEmploymentStatus || "",
        company: initialData.guarantorCompany || "",
        guarantorHomeAddress: initialData.guarantorAddress || initialData.guarantorHomeAddress || "",
      };
      const hasGuarantorData = [
        initialData.guarantorFirstName,
        initialData.guarantorLastName,
        initialData.guarantorEmail,
        initialData.guarantorPhone,
        initialData.guarantorEmploymentStatus,
        initialData.guarantorCompany,
        initialData.guarantorAddress || initialData.guarantorHomeAddress
      ].some(val => val && val !== "");
      setFormData(prefill);
      setPrefilledData(prefill);
      setIsPrefilled(!!initialData._id && hasGuarantorData);
      setVerificationId(initialData.verificationId || idFromQuery || verificationId);
      return;
    }
    const fetchVerification = async () => {
      let verificationIdParam = idFromQuery || verificationId || "";
      let tenantEmail = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            tenantEmail = userObj?.user?.email || userObj?.email;
          } catch {}
        }
      }
      if (!tenantEmail || !verificationIdParam) return;
      try {
        const res = await apiService.get(`/verification/response/by-request/${verificationIdParam}?email=${encodeURIComponent(tenantEmail)}`);
        const data = res?.data?.data || res?.data || null;
        if (data) {
          const prefill = {
            firstName: data.guarantorFirstName || "",
            lastName: data.guarantorLastName || "",
            email: data.guarantorEmail || "",
            phoneNumber: data.guarantorPhone || "",
            employmentStatus: data.guarantorEmploymentStatus || "",
            company: data.guarantorCompany || "",
            guarantorHomeAddress: data.guarantorAddress || data.guarantorHomeAddress || "",
          };
          const hasGuarantorData = [
            data.guarantorFirstName,
            data.guarantorLastName,
            data.guarantorEmail,
            data.guarantorPhone,
            data.guarantorEmploymentStatus,
            data.guarantorCompany,
            data.guarantorAddress || data.guarantorHomeAddress
          ].some(val => val && val !== "");
          setFormData(prefill);
          setPrefilledData(prefill);
          setIsPrefilled(!!data._id && hasGuarantorData);
          setVerificationId(data.verificationId || verificationIdParam);
        }
      } catch {}
    };
    fetchVerification();
  }, [searchParams, verificationId, initialData]);

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

  const allFieldsFilled = useMemo(() => {
    // ...check all required fields for this step
    return Object.values(formData).every((val) => val && val !== "");
  }, [formData]);

  const formKeys: (keyof typeof formData)[] = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "employmentStatus",
    "company",
    "guarantorHomeAddress",
  ];

  const isDirty = useMemo(() => {
    return formKeys.some(key => formData[key] !== prefilledData[key]);
  }, [formData, prefilledData]);

  const handleSubmit = async () => {
    console.log({ allFieldsFilled, isPrefilled });
    if (allFieldsFilled && isPrefilled) {
      if (!verificationId) {
        alert('Verification ID missing.');
        return;
      }
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationResponseId}`);
      return;
    }
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
    // Always update guarantor info
    const payload = {
      guarantorFirstName: formData.firstName,
      guarantorLastName: formData.lastName,
      guarantorEmail: formData.email,
      guarantorPhone: formData.phoneNumber,
      guarantorEmploymentStatus: formData.employmentStatus,
      guarantorCompany: formData.company,
      guarantorAddress: formData.guarantorHomeAddress,
      verificationId: verificationId,
    };
    try {
      await apiService.put(`/verification/${verificationResponseId}/guarantor`, payload);
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationResponseId}`);
    } catch (error: any) {
      alert(error.message || "Failed to update guarantor info.");
    }
  };

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

        <div className="mt-10 flex justify-end gap-4">
          <Button
            onClick={handleSubmit}
            className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10"
            disabled={isPrefilled && allFieldsFilled && !isDirty}
          >
            Save and Continue
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!verificationId) {
                alert('Verification ID missing.');
                return;
              }
              router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationResponseId}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuarantorInfoVerification;