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
    <div className="">
      <div className="pb-6 border-b border-gray-100 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Guarantor Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us who your guarantor is and how to reach out to them.
        </p>
      </div>
      <div className="">
        <div className="bg-white rounded-xl p-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            />
            <InputField
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              error={errors.company}
            />
          </div>
          <div className="pt-6 border-t border-gray-100 mt-8">
            <InputField
              label="Guarantor's Home Address"
              name="guarantorHomeAddress"
              value={formData.guarantorHomeAddress}
              onChange={handleInputChange}
              error={errors.guarantorHomeAddress}
            />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!verificationId) {
                alert('Verification ID missing.');
                return;
              }
              router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationId}`);
            }}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 px-6 h-auto py-2.5 rounded-lg"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white bg-green-700 hover:bg-green-800 px-8 py-2.5 h-auto rounded-lg shadow-sm hover:shadow transition-all"
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