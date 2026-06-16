"use client";
import Button from "@/app/components/shared/buttons/Button";
import SelectField from "@/app/components/shared/input-fields/SelectField";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { FiX } from "react-icons/fi";
import { apiService } from "@/lib/api";
import { toast } from "react-toastify";

interface FormData {
  bankStatement: File | null;
  utilityBill: File | null;
  identificationDocument: File | null;
  bankStatementType: string;
  utilityBillType: string;
  identificationDocumentType: string;
}

interface FileUploadProps {
  id: keyof FormData;
  label: string;
  file: File | null;
  onFileChange: (id: keyof FormData, file: File | null) => void;
  error?: string;
  showDocumentType?: boolean;
  documentType?: string;
  documentTypeError?: string;
  onDocumentTypeChange?: (type: string) => void;
}

interface IncomeAssessmentVerificationProps {
  initialData?: any;
  requestData?: {
    verificationTier?: "standard" | "premium";
  } | null;
}

const FileUpload = ({
  id,
  label,
  file,
  onFileChange,
  error,
  showDocumentType,
  documentType,
  documentTypeError,
  onDocumentTypeChange,
}: FileUploadProps) => {
  const documentTypeOptions = [
    { label: "Passport", value: "passport" },
    { label: "Driver's License", value: "drivers_license" },
    { label: "National ID", value: "national_id" },
    { label: "Voter's Card", value: "voters_card" },
    { label: "Other", value: "other" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];

      if (!allowedExtensions.includes(fileExtension || "")) {
        onFileChange(id, null);
        return;
      }
    }

    onFileChange(id, selectedFile);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      const fileExtension = droppedFile.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];

      if (allowedExtensions.includes(fileExtension || "")) {
        onFileChange(id, droppedFile);
      }
    }
  };

  const removeFile = () => {
    onFileChange(id, null);
  };

  return (
    <div className="w-full">
      <p className="text-gray-700 font-medium mb-2 text-sm">{label}</p>
      
      {/* Document Type Dropdown */}
      {showDocumentType && (
        <div className="mb-3">
          <SelectField
            label="Document Type"
            name="documentType"
            variant="nested"
            value={documentTypeOptions.find(opt => opt.value === documentType)}
            onChange={(opt: any) => onDocumentTypeChange?.(opt?.value || "")}
            options={documentTypeOptions}
            placeholder="Select document type"
            error={documentTypeError}
          />
        </div>
      )}

      <div
        className="text-center w-full"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          className={`w-full border-2 border-dashed rounded-xl transition-all duration-200 ${
            error 
              ? "border-red-300 bg-red-50/30" 
              : file 
                ? "border-green-500 bg-green-50/30" 
                : "border-gray-200 hover:border-green-400 hover:bg-gray-50/50"
          }`}
        >
          <input
            type="file"
            id={id}
            className="hidden"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
          />

          {file ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <SlCloudUpload size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <label htmlFor={id} className="cursor-pointer block w-full py-8 px-4">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
                  <SlCloudUpload size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    SVG, PNG, JPG or PDF (max. 10MB)
                  </p>
                </div>
              </div>
            </label>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2 text-left flex items-center gap-1"><FiX size={12} /> {error}</p>}
      </div>
    </div>
  );
};

const UploadedDocumentDisplay = ({ 
  title, 
  url, 
  documentType 
}: { 
  title: string; 
  url?: string; 
  documentType?: string; 
}) => {
  if (!url) return null;
  
  return (
    <div className="w-full p-5 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          {documentType && (
            <p className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block mb-2 capitalize">
              {documentType.replace(/_/g, ' ')}
            </p>
          )}
          <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            Uploaded successfully
          </p>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-semibold text-green-700 hover:text-green-800 hover:underline shrink-0"
        >
          View
        </a>
      </div>
    </div>
  );
};

const IncomeAssessmentVerification = ({ initialData, requestData }: IncomeAssessmentVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationIdFromQuery = searchParams.get("verificationId");
  const isPremium = requestData?.verificationTier === "premium";
  const [formData, setFormData] = useState<FormData>({
    bankStatement: null,
    utilityBill: null,
    identificationDocument: null,
    bankStatementType: "",
    utilityBillType: "",
    identificationDocumentType: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [verificationResponseId, setVerificationResponseId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any>(null);

  const maskBvn = (bvn: string) => {
    const digits = (bvn ?? "").replace(/\D/g, "");
    if (digits.length < 4) return "—";
    return `*******${digits.slice(-4)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const idFromQuery = searchParams.get("verificationId");
    if (initialData) {
      if (initialData._id) setVerificationResponseId(initialData._id);
      setFormData({
        bankStatement: null,
        utilityBill: null,
        identificationDocument: null,
        bankStatementType: "",
        utilityBillType: "",
        identificationDocumentType: initialData.identificationDocumentType || "",
      });
      setIsPrefilled(!!initialData._id && (initialData.bankStatementUrl || initialData.utilityBillUrl || initialData.identificationDocumentUrl));
      setUploadedDocuments(initialData);
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
          setFormData({
            bankStatement: null,
            utilityBill: null,
            identificationDocument: null,
            bankStatementType: "",
            utilityBillType: "",
            identificationDocumentType: data.identificationDocumentType || "",
          });
          setIsPrefilled(!!data._id && (data.bankStatementUrl || data.utilityBillUrl || data.identificationDocumentUrl));
          setUploadedDocuments(data);
          setVerificationId(data.verificationId || verificationIdParam);
        }
      } catch {}
    };
    fetchVerification();
  }, [searchParams, verificationId, initialData]);

  const handleFileChange = (id: keyof FormData, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [id]: file,
    }));

    // Clear error when file is selected
    if (file && errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (isPremium && !formData.bankStatement) {
      newErrors.bankStatement = "Salary proof is required";
    }

    if (!formData.utilityBill) {
      newErrors.utilityBill = "Utility bill is required";
    }

    if (!formData.identificationDocument) {
      newErrors.identificationDocument = "Identification document is required";
    }
    if (!formData.identificationDocumentType) {
      newErrors.identificationDocumentType = "Identification document type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const allFieldsFilled = useMemo(() => {
    if (isPremium) {
      return (
        formData.bankStatement &&
        formData.utilityBill &&
        formData.identificationDocument &&
        formData.identificationDocumentType
      );
    }

    return (
      formData.utilityBill &&
      formData.identificationDocument &&
      formData.identificationDocumentType
    );
  }, [formData]);

  const handleSubmit = async () => {
    if (!verificationResponseId) {
      toast.error("Verification response ID missing.");
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    const fd = new FormData();
    if (formData.bankStatement) {
      fd.append('bankStatement', formData.bankStatement);
    }
    if (formData.utilityBill) {
      fd.append('utilityBill', formData.utilityBill);
    }
    if (formData.identificationDocument) {
      fd.append('identificationDocument', formData.identificationDocument);
      fd.append('identificationDocumentType', formData.identificationDocumentType);
    }
    try {
      const res: any = await apiService.post(`/verification/${verificationResponseId}/affordability`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updated = res?.data?.data ?? res?.data ?? null;
      if (updated) {
        setUploadedDocuments(updated);
      }
      setIsPrefilled(true);
      toast.success("Documents submitted successfully.");
      apiService
        .post(`/verification/run-all-checks/${verificationResponseId}`, {}, { timeout: 120000 })
        .catch(() => {
          toast.info(
            "Your documents were saved. Automated checks could not finish in the background; the landlord or support may re-run verification.",
          );
        });
      const requestId = verificationId || verificationIdFromQuery;
      if (requestId) {
        router.push(
          `/dashboard/tenant/verification?verificationId=${requestId}&completed=1`
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to upload documents.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-w-0 max-w-full">
      <div className="pb-6 border-b border-gray-100 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">
          {isPremium ? "Financial Capacity (Premium)" : "Verification Documents (Standard)"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isPremium
            ? "Upload your salary proof (bank statement or payslip), utility bill, and ID to support your monthly income claim."
            : "Upload your utility bill and ID to verify address and identity."}
        </p>
      </div>

      <div className="min-w-0 max-w-full">
        <div className="flex flex-col gap-8 rounded-xl bg-white p-1">
          {isPremium && (
            <div className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Premium financial summary
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {typeof initialData?.monthlyIncome === "number" && initialData.monthlyIncome > 0
                  ? formatCurrency(initialData.monthlyIncome)
                  : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Monthly salary (as stated)</p>
              <p className="text-sm font-medium text-gray-700 mt-4">
                BVN:{" "}
                <span className="font-semibold">
                  {typeof initialData?.bvn === "string" && initialData.bvn.trim()
                    ? maskBvn(initialData.bvn)
                    : "—"}
                </span>
              </p>
            </div>
          )}

          {isPrefilled ? (
            // Show uploaded documents
            <div className="grid gap-4">
              {isPremium && (
                <UploadedDocumentDisplay
                  title="Salary Proof"
                  url={uploadedDocuments?.bankStatementUrl}
                />
              )}
              <UploadedDocumentDisplay 
                title="Utility Bill" 
                url={uploadedDocuments?.utilityBillUrl} 
              />
              <UploadedDocumentDisplay 
                title="Identification Document" 
                url={uploadedDocuments?.identificationDocumentUrl} 
                documentType={uploadedDocuments?.identificationDocumentType}
              />
            </div>
          ) : (
            // Show upload fields
            <div className="space-y-8">
              {isPremium && (
                <FileUpload
                  id="bankStatement"
                  label="Upload Salary Proof (Bank statement or payslip)"
                  file={formData.bankStatement}
                  onFileChange={handleFileChange}
                  error={errors.bankStatement}
                  showDocumentType={false}
                />
              )}

              <FileUpload
                id="utilityBill"
                label="Upload Utility Bill"
                file={formData.utilityBill}
                onFileChange={handleFileChange}
                error={errors.utilityBill}
                showDocumentType={false}
              />

              <div className="pt-4 border-t border-gray-100">
                <FileUpload
                  id="identificationDocument"
                  label="Upload Identification Document"
                  file={formData.identificationDocument}
                  onFileChange={handleFileChange}
                  error={errors.identificationDocument}
                  showDocumentType={true}
                  documentType={formData.identificationDocumentType}
                  documentTypeError={errors.identificationDocumentType}
                  onDocumentTypeChange={(type) => {
                    setFormData((prev) => ({ ...prev, identificationDocumentType: type }));
                    if (type) {
                      setErrors((prev) => ({ ...prev, identificationDocumentType: "" }));
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-end border-t border-gray-100 pt-6">
          {!isPrefilled && (
            <Button
              variant="darkPrimary"
              size="minLarge"
              className="w-full rounded-xl sm:w-auto"
              onClick={handleSubmit}
              disabled={!allFieldsFilled}
              isLoading={isSubmitting}
              loadingText="Uploading Documents..."
            >
              Submit Documents
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeAssessmentVerification;
