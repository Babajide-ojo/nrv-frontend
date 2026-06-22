"use client";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import DateInputField from "@/app/components/shared/input-fields/DateInputField";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { apiService } from "@/lib/api";

interface EmploymentInfoVerificationProps {
  initialData?: any;
}

const EmploymentInfoVerification = ({ initialData }: EmploymentInfoVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    employmentStatus: "",
    nameOfCompany: "",
    role: "",
    dateJoined: "",
    companyAddress: "",
    monthlyIncome: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [verificationResponseId, setVerificationResponseId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [prefilledData, setPrefilledData] = useState(formData);

  const formKeys: (keyof typeof formData)[] = [
    "employmentStatus",
    "nameOfCompany",
    "role",
    "dateJoined",
    "companyAddress",
    "monthlyIncome",
  ];

  useEffect(() => {
    const idFromQuery = searchParams.get("verificationId");
    if (typeof window !== "undefined" && idFromQuery) {
      const storedResponseId = localStorage.getItem("verificationResponseId");
      if (storedResponseId) setVerificationResponseId(storedResponseId);
      if (idFromQuery) setVerificationId(idFromQuery);
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
          const prefill = {
            employmentStatus: data.employmentStatus || "",
            nameOfCompany: data.companyName || data.nameOfCompany || "",
            role: data.roleInCompany || data.role || "",
            dateJoined: data.dateJoined ? format(new Date(data.dateJoined), "yyyy-MM-dd") : "",
            companyAddress: data.companyAddress || "",
            monthlyIncome: data.monthlyIncome != null ? String(data.monthlyIncome) : "",
          };
          setFormData(prefill);
          setPrefilledData(prefill);
          setIsPrefilled(!!data._id);
          setVerificationId(data.verificationId || verificationIdParam);
          if (data._id) {
            setVerificationResponseId(data._id);
            localStorage.setItem("verificationResponseId", data._id);
          }
        }
      } catch {}
    };
    fetchVerification();
  }, [searchParams, verificationId]);

  const employmentStatusOptions = [
    { label: "Employed", value: "Employed" },
    { label: "Self Employed", value: "Self Employed" },
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

  const allFieldsFilled = useMemo(() => {
    return Object.values(formData).every((val) => val && val !== "");
  }, [formData]);

  const isDirty = useMemo(() => {
    return formKeys.some(key => formData[key] !== prefilledData[key]);
  }, [formData, prefilledData]);

  const handleSubmit = async () => {
    if (!verificationId) {
      alert('Verification ID missing.');
      return;
    }
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
    const monthlyIncomeNum = formData.monthlyIncome ? Number(formData.monthlyIncome) : undefined;
    const payload: Record<string, unknown> = {
      employmentStatus: formData.employmentStatus || undefined,
      roleInCompany: formData.role || undefined,
      companyName: formData.nameOfCompany || undefined,
      companyAddress: formData.companyAddress || undefined,
      dateJoined: formData.dateJoined || undefined,
    };
    if (monthlyIncomeNum != null && !Number.isNaN(monthlyIncomeNum)) payload.monthlyIncome = monthlyIncomeNum;
    try {
      await apiService.put(`/verification/${verificationResponseId}/employment`, payload);
      router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationId}`);
    } catch (error: any) {
      alert(error.message || "Failed to update employment info.");
    }
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="pb-4 border-b border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us where you work and what your role is.
        </p>
      </div>
      <div className="min-w-0 max-w-full">
        <div className="flex flex-col gap-4 rounded-xl bg-white p-1">
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
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Company Name"
              name="nameOfCompany"
              variant="nested"
              placeholder="e.g. Indigene Systems Ltd"
              value={formData.nameOfCompany}
              onChange={handleInputChange}
              error={errors.nameOfCompany}
            />
            <InputField
              label="Role / Job Title"
              name="role"
              variant="nested"
              placeholder="e.g. Software Engineer"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
            />
            <InputField
              label="Company Address"
              name="companyAddress"
              variant="nested"
              placeholder="Office or business address"
              value={formData.companyAddress}
              onChange={handleInputChange}
              error={errors.companyAddress}
            />
            <InputField
              label="Monthly Income"
              name="monthlyIncome"
              variant="nested"
              placeholder="e.g. 350000"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              error={errors.monthlyIncome}
              inputType="number"
            />
            <DateInputField
              label="Date Joined"
              name="dateJoined"
              variant="nested"
              placeholder="Select date joined"
              value={formData.dateJoined}
              disableFuture
              openTo="year"
              displayFormat="yyyy-MM-dd"
              error={errors.dateJoined}
              onChange={(selectedDate) => {
                setFormData((prevData) => ({
                  ...prevData,
                  dateJoined: format(selectedDate, "yyyy-MM-dd"),
                }));
                setErrors((prev) => ({ ...prev, dateJoined: "" }));
              }}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end sm:gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!verificationId) {
                alert('Verification link missing. Please use the link from your landlord\'s email.');
                return;
              }
              router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationId}`);
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

export default EmploymentInfoVerification;