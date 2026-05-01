"use client";
import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import SelectDate from "@/app/components/shared/SelectDate";
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
  const [openDate, setOpenDate] = useState(false);
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
    <div className="">
      <div className="pb-6 border-b border-gray-100 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">Employment Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us where you work and what your role is.
        </p>
      </div>
      <div className="">
        <div className="bg-white rounded-xl p-1 flex flex-col gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Company Name"
              name="nameOfCompany"
              value={formData.nameOfCompany}
              onChange={handleInputChange}
              error={errors.nameOfCompany}
            />
            <InputField
              label="Role / Job Title"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              error={errors.role}
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
              inputType="number"
            />
            <InputField
              label="Date Joined"
              name="dateJoined"
              value={formData.dateJoined}
              onClick={() => setOpenDate(true)}
              onChange={() => {}}
              error={errors.dateJoined}
              readOnly
              placeholder="Select date"
            />
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!verificationId) {
                alert('Verification link missing. Please use the link from your landlord\'s email.');
                return;
              }
              router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationId}`);
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