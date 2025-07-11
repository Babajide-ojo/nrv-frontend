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
    if (idFromQuery) {
      setVerificationResponseId(idFromQuery);
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
            employmentStatus: data.employmentStatus || "",
            nameOfCompany: data.companyName || data.nameOfCompany || "",
            role: data.roleInCompany || data.role || "",
            dateJoined: data.dateJoined ? format(new Date(data.dateJoined), "yyyy-MM-dd") : "",
            companyAddress: data.companyAddress || "",
            monthlyIncome: data.monthlyIncome ? String(data.monthlyIncome) : "",
          };
          setFormData(prefill);
          setPrefilledData(prefill);
          setIsPrefilled(!!data._id);
          setVerificationId(data.verificationId || verificationIdParam);
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
    if (allFieldsFilled && isPrefilled) {
      if (!verificationId) {
        alert('Verification ID missing.');
        return;
      }
      router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationResponseId}`);
      return;
    }
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
    // Always update employment info
    const payload = {
      employmentStatus: formData.employmentStatus,
      roleInCompany: formData.role,
      companyName: formData.nameOfCompany,
      companyAddress: formData.companyAddress,
      monthlyIncome: Number(formData.monthlyIncome),
      dateJoined: formData.dateJoined,
      verificationId: verificationId,
    };
    try {
      await apiService.put(`/verification/${verificationResponseId}/employment`, payload);
      router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationResponseId}`);
    } catch (error: any) {
      alert(error.message || "Failed to update employment info.");
    }
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
              value={formData.dateJoined}
              onClick={() => setOpenDate(true)}
              onChange={() => {}}
              error={errors.dateJoined}
              readOnly
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
              if (!verificationResponseId) {
                alert('Verification ID missing.');
                return;
              }
              router.push(`/dashboard/tenant/verification/guarantor-info?verificationId=${verificationResponseId}`);
            }}
          >
            Next
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