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
    if (initialData) {
      if (initialData._id) setVerificationResponseId(initialData._id);
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
      let tenantEmail: string | null = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            tenantEmail = userObj?.user?.email || userObj?.email || null;
          } catch {}
        }
        if (!tenantEmail) tenantEmail = sessionStorage.getItem("verification-request-email");
      }
      if (!tenantEmail || !verificationIdParam) return;
      try {
        const res = await apiService.get(`/verification/response/by-request/${verificationIdParam}?email=${encodeURIComponent(tenantEmail)}`);
        const data = res?.data?.data || res?.data || null;
        if (data) {
          if (data._id) setVerificationResponseId(data._id);
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
    if (allFieldsFilled && isPrefilled) {
      if (!verificationId) {
        alert('Verification ID missing.');
        return;
      }
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationId}`);
      return;
    }
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
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
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationId}`);
    } catch (error: any) {
      alert(error.message || "Failed to update guarantor info.");
    }
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="pb-6 border-b border-gray-100 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Guarantor Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us who your guarantor is and how to reach out to them.
        </p>
      </div>
      <div className="min-w-0 max-w-full">
        <div className="rounded-xl bg-white p-1">
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
            <InputField
              label="First Name"
              name="firstName"
              variant="nested"
              placeholder="Guarantor's first name"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              name="lastName"
              variant="nested"
              placeholder="Guarantor's last name"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
            />
            <InputField
              label="Email Address"
              name="email"
              variant="nested"
              placeholder="e.g. guarantor@email.com"
              inputType="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              variant="nested"
              placeholder="e.g. 08012345678"
              inputType="phone"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
            />
            <SelectField
              label="Employment Status"
              name="employmentStatus"
              variant="nested"
              placeholder="Select employment status"
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
              error={errors.employmentStatus}
            />
            <InputField
              label="Company"
              name="company"
              variant="nested"
              placeholder="Guarantor's employer or business"
              value={formData.company}
              onChange={handleInputChange}
              error={errors.company}
            />
          </div>
          <div className="mt-8 border-t border-gray-100 pt-6">
            <InputField
              label="Guarantor's Home Address"
              name="guarantorHomeAddress"
              variant="nested"
              placeholder="Full residential address"
              value={formData.guarantorHomeAddress}
              onChange={handleInputChange}
              error={errors.guarantorHomeAddress}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end sm:gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!verificationId) {
                alert('Verification ID missing.');
                return;
              }
              router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationId}`);
            }}
            className="h-auto w-full rounded-lg border-gray-200 px-6 py-2.5 text-gray-700 hover:bg-gray-50 sm:w-auto"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-auto w-full rounded-lg bg-green-700 px-8 py-2.5 text-white shadow-sm transition-all hover:bg-green-800 hover:shadow sm:w-auto"
            disabled={isPrefilled && allFieldsFilled && !isDirty}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuarantorInfoVerification;