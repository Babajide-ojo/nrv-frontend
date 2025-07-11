import InputField from "@/app/components/shared/input-fields/InputFields";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import SelectDate from "@/app/components/shared/SelectDate";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { FiInfo } from "react-icons/fi";
import { apiService } from "@/lib/api";

interface PersonalInfoVerificationProps {
  verificationId: string | string[];
  initialData?: any;
}

const PersonalInfoVerification = ({ verificationId: verificationIdProp, initialData }: PersonalInfoVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDate, setOpenDate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [verificationResponseId, setVerificationResponseId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string>(
    Array.isArray(verificationIdProp) ? verificationIdProp.join("") : (verificationIdProp as string)
  );
  const [prefilledData, setPrefilledData] = useState(formData);

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
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
          let firstName = data.firstName || "";
          let lastName = data.lastName || "";
          if ((!firstName || !lastName) && data.fullName) {
            const [first, ...rest] = data.fullName.split(" ");
            firstName = first || "";
            lastName = rest.join(" ") || "";
          }
          const prefill = {
            firstName,
            lastName,
            email: data.email || "",
            phoneNumber: data.phone || "",
            dateOfBirth: data.dateOfBirth ? format(new Date(data.dateOfBirth), "yyyy-MM-dd") : "",
            gender: data.gender || "",
            address: data.address || "",
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

  const formKeys = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "dateOfBirth",
    "gender",
    "address",
  ] as const;

  const isDirty = useMemo(() => {
    return formKeys.some(key => formData[key] !== prefilledData[key]);
  }, [formData, prefilledData]);

  const allFieldsFilled = useMemo(() => {
    return Object.values(formData).every((val) => val && val !== "");
  }, [formData]);

  const handleSubmit = async () => {
    if (allFieldsFilled && isPrefilled) {
      if (!verificationId) {
        alert('Verification ID missing.');
        return;
      }
      router.push(`/dashboard/tenant/verification/employment-info?verificationId=${verificationResponseId}`);
      return;
    }
    // Always create a new verification response
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    let dateOfBirthISO = "";
    if (formData.dateOfBirth) {
      const date = new Date(formData.dateOfBirth);
      dateOfBirthISO = date.toISOString();
    }
    const createdBy = JSON.parse(localStorage.getItem("nrv-user") as any).user?._id || "";
    const payload = {
      fullName,
      dateOfBirth: dateOfBirthISO,
      email: formData.email,
      phone: formData.phoneNumber,
      gender: formData.gender,
      address: formData.address,
      verificationId: verificationId,
      createdBy,
    };
    try {
      const response: any = await apiService.post("/verification", payload);
      const returnedVerificationId = response?.data?._id || response?._id;
      if (returnedVerificationId) {
        localStorage.setItem("verificationResponseId", returnedVerificationId);
        router.push(`/dashboard/tenant/verification/employment-info?verificationId=${returnedVerificationId}`);
      } else {
        alert("Verification ID not returned from server.");
      }
    } catch (error: any) {
      alert(error.message || "Failed to submit verification.");
    }
  };

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
              disabled={isPrefilled}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              disabled={isPrefilled}
            />
            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              disabled={isPrefilled}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              inputType="phone"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              disabled={isPrefilled}
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
              disabled={isPrefilled}
            />
            <SelectField
              label="Gender"
              name="gender"
              value={genderOptions.find(
                (option) => option.value === formData.gender
              )}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  gender: e.value,
                }));
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  gender: "",
                }));
              }}
              options={genderOptions}
              error={errors.gender}
              disabled={isPrefilled}
              // css="bg-nrvLightGreyBg"
            />
          </div>
          <div className="pt-3 pb-6 border-t border-[#ECECEE] mt-5">
            <InputField
              label={
                <p className="flex items-center gap-1">
                  Address <FiInfo />
                </p>
              }
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              disabled={isPrefilled}
            />

            <p className="text-xs text-[#807F94] mt-1">
              Your address at the time of filling this form.
            </p>
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
              router.push(`/dashboard/tenant/verification/employment-info?verificationId=${verificationId}`);
            }}
          >
            Next
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
