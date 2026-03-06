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
  /** Verification request (firstName, lastName, email) from parent - avoids duplicate API calls */
  requestData?: { firstName?: string; lastName?: string; email?: string } | null;
}

const PersonalInfoVerification = ({ verificationId: verificationIdProp, initialData, requestData: requestDataProp }: PersonalInfoVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openDate, setOpenDate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nin: "",
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

  const prefillFromRequest = (req: { firstName?: string; lastName?: string; email?: string }) => {
    if (!req) return;
    setFormData((prev) => ({
      ...prev,
      firstName: req.firstName || prev.firstName,
      lastName: req.lastName || prev.lastName,
      email: req.email || prev.email,
    }));
    setPrefilledData((prev) => ({
      ...prev,
      firstName: req.firstName || prev.firstName,
      lastName: req.lastName || prev.lastName,
      email: req.email || prev.email,
    }));
  };

  useEffect(() => {
    // Parent already fetched request + response: use them and skip API calls
    if (requestDataProp !== undefined) {
      // 1) Populate form first from GET /verification/:id (verification request – landlord invite)
      if (requestDataProp) {
        prefillFromRequest(requestDataProp);
      }
      // 2) Overlay GET /verification/response/by-request/:id data if present (saved submission)
      if (initialData) {
        let firstName = initialData.firstName || "";
        let lastName = initialData.lastName || "";
        if ((!firstName || !lastName) && initialData.fullName) {
          const [first, ...rest] = initialData.fullName.split(" ");
          firstName = first || "";
          lastName = rest.join(" ") || rest.join(" ");
        }
        setFormData((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: initialData.email || prev.email,
          phone: initialData.phone || prev.phone,
          nin: initialData.nin || prev.nin,
          dateOfBirth: initialData.dateOfBirth ? format(new Date(initialData.dateOfBirth), "yyyy-MM-dd") : prev.dateOfBirth,
          gender: initialData.gender || prev.gender,
          address: initialData.address || prev.address,
        }));
        setPrefilledData((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: initialData.email || prev.email,
          phone: initialData.phone || prev.phone,
          nin: initialData.nin || prev.nin,
          dateOfBirth: initialData.dateOfBirth ? format(new Date(initialData.dateOfBirth), "yyyy-MM-dd") : prev.dateOfBirth,
          gender: initialData.gender || prev.gender,
          address: initialData.address || prev.address,
        }));
        setIsPrefilled(!!initialData._id);
        setVerificationId(initialData.verificationId || verificationId);
        if (initialData._id) setVerificationResponseId(initialData._id);
      }
      return;
    }

    const idFromQuery = searchParams.get("verificationId");
    const verificationIdParam = idFromQuery || verificationId || "";

    const fetchVerification = async () => {
      let tenantEmail: string | null = null;
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            tenantEmail = userObj?.user?.email || userObj?.email || null;
          } catch {}
        }
        if (!tenantEmail) {
          tenantEmail = sessionStorage.getItem("verification-request-email");
        }
      }

      if (!verificationIdParam) return;

      // Fetch verification request once to get firstName, lastName, email for prefill (and tenantEmail if missing)
      let requestData: { firstName?: string; lastName?: string; email?: string } | null = null;
      try {
        const reqRes = await apiService.get(`/verification/${verificationIdParam}`);
        requestData = reqRes?.data?.data ?? reqRes?.data ?? null;
        if (requestData?.email) {
          if (!tenantEmail) tenantEmail = requestData.email;
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verification-request-email", requestData.email);
          }
        }
      } catch {}

      if (!tenantEmail) return;

      try {
        const res = await apiService.get(`/verification/response/by-request/${verificationIdParam}?email=${encodeURIComponent(tenantEmail)}`);
        const data = res?.data?.data ?? res?.data ?? null;
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
            phone: data.phone || "",
            nin: data.nin || "",
            dateOfBirth: data.dateOfBirth ? format(new Date(data.dateOfBirth), "yyyy-MM-dd") : "",
            gender: data.gender || "",
            address: data.address || "",
          };
          setFormData(prefill);
          setPrefilledData(prefill);
          setIsPrefilled(!!data._id);
          setVerificationId(data.verificationId || verificationIdParam);
          if (data._id) setVerificationResponseId(data._id);
        } else {
          // No existing response yet: prefill first name, last name, email from the verification request
          if (requestData) prefillFromRequest(requestData);
        }
      } catch {
        // 404 or network error: no response yet, still prefill from request
        if (requestData) prefillFromRequest(requestData);
      }
    };
    fetchVerification();
  }, [searchParams, verificationId, initialData, requestDataProp]);

  const formKeys = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "nin",
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
      // Keep REQUEST id in URL so next step can fetch by-request/requestId?email=
      router.push(`/dashboard/tenant/verification/employment-info?verificationId=${verificationId}`);
      return;
    }
    // Always create a new verification response
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    let dateOfBirthISO = "";
    if (formData.dateOfBirth) {
      const date = new Date(formData.dateOfBirth);
      dateOfBirthISO = date.toISOString();
    }
    let createdBy = "";
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("nrv-user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          createdBy = userObj?.user?._id || userObj?._id || "";
        }
      } catch {}
    }
    const payload = {
      fullName,
      dateOfBirth: dateOfBirthISO,
      email: formData.email,
      phone: formData.phone || undefined,
      nin: formData.nin,
      gender: formData.gender,
      address: formData.address,
      verificationId: verificationId,
      createdBy,
    };
    try {
      const response: any = await apiService.post("/verification", payload);
      const returnedResponseId = response?.data?._id || response?._id;
      if (returnedResponseId) {
        localStorage.setItem("verificationResponseId", returnedResponseId);
      }
      // Pass REQUEST id in URL so employment step can fetch by-request/requestId?email=
      router.push(`/dashboard/tenant/verification/employment-info?verificationId=${verificationId}`);
    } catch (error: any) {
      alert(error.message || "Failed to submit verification.");
    }
  };

  return (
    <div className="">
      <div className="pb-6 border-b border-gray-100 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">
          Personal Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Please provide your personal details to get started.
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
            <div>
              <InputField
                label="Phone Number"
                name="phone"
                placeholder="e.g. 08012345678"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                disabled={isPrefilled}
              />
        
            </div>
            <InputField
              label="NIN (National Identification Number)"
              name="nin"
              placeholder="11-digit NIN"
              value={formData.nin}
              onChange={handleInputChange}
              error={errors.nin}
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
            />
          </div>
          <div className="pt-6 border-t border-gray-100 mt-8">
            <InputField
              label="Current Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={errors.address}
              disabled={isPrefilled}
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Your address at the time of filling this form.
            </p>
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
              if (allFieldsFilled && !isPrefilled) {
                handleSubmit();
                return;
              }
              router.push(`/dashboard/tenant/verification/employment-info?verificationId=${verificationId}`);
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
