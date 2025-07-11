"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { FiX } from "react-icons/fi";
import { apiService } from "@/lib/api";

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
  onDocumentTypeChange?: (type: string) => void;
}

interface IncomeAssessmentVerificationProps {
  initialData?: any;
}

const FileUpload = ({
  id,
  label,
  file,
  onFileChange,
  error,
  showDocumentType,
  documentType,
  onDocumentTypeChange,
}: FileUploadProps) => {
  const documentTypeOptions = [
    { label: "Select Document Type", value: "" },
    { label: "Bank Statement", value: "bank_statement" },
    { label: "Utility Bill", value: "utility_bill" },
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
      <p className="text-nrvGreyBlack mb-2 text-sm">{label}</p>
      
      {/* Document Type Dropdown */}
      {showDocumentType && (
        <div className="mb-3">
          <select
            value={documentType || ""}
            onChange={(e) => onDocumentTypeChange?.(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            {documentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className="text-center w-full"
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div
          className={`w-full border rounded-lg ${
            error ? "border-red-300" : "border-nrvLightGrey"
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
            <div className="flex items-center justify-center gap-2 p-2">
              <span className="text-sm text-gray-700 truncate max-w-xs">
                {file.name}
              </span>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={16} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <label htmlFor={id} className="cursor-pointer block w-full">
              <div className="p-2 bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3 inline-block rounded-md">
                <div className="text-center flex justify-center mb-2">
                  <SlCloudUpload size={30} />
                </div>
                Click to upload or drag and drop
              </div>
            </label>
          )}

          {error && <p className="text-red-500 text-xs mt-1 px-2">{error}</p>}
        </div>
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
    <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
      {documentType && (
        <p className="text-sm text-gray-600 mb-2">Type: {documentType}</p>
      )}
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        View Document
      </a>
    </div>
  );
};

const IncomeAssessmentVerification = ({ initialData }: IncomeAssessmentVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const idFromQuery = searchParams.get("verificationId");
    if (idFromQuery) {
      setVerificationResponseId(idFromQuery);
    }
    if (initialData) {
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

    if (!formData.bankStatement) {
      newErrors.bankStatement = "Bank statement is required";
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
    return formData.bankStatement && 
           formData.utilityBill && 
           formData.identificationDocument &&
           formData.identificationDocumentType;
  }, [formData]);

  const handleSubmit = async () => {
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
    console.log('Form data before submission:', formData);
    const fd = new FormData();
    if (formData.bankStatement) {
      fd.append('bankStatement', formData.bankStatement);
      console.log('Added bankStatement to FormData');
    }
    if (formData.utilityBill) {
      fd.append('utilityBill', formData.utilityBill);
      console.log('Added utilityBill to FormData');
    }
    if (formData.identificationDocument) {
      fd.append('identificationDocument', formData.identificationDocument);
      fd.append('identificationDocumentType', formData.identificationDocumentType);
      console.log('Added identificationDocument to FormData');
    }
    console.log('FormData entries:');
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }
    try {
      await apiService.post(`/verification/${verificationResponseId}/affordability`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Optionally navigate or show success
    } catch (error: any) {
      alert(error.message || 'Failed to upload documents.');
    }
  };

  return (
    <div className="">
      <div className="pb-4 border-b border-gray-200 mb-5">
        <h3 className="font-medium">Verify your Affordability Check</h3>
        <p className="text-xs text-[#667085] mt-1">
          Upload your bank statement and utility bill to verify your income.
        </p>
      </div>

      <div className="">
        <div className="bg-[#FDFDFC] border border-[#ECECEE] rounded-lg p-5 flex flex-col gap-6">
          {isPrefilled ? (
            // Show uploaded documents
            <>
              <UploadedDocumentDisplay 
                title="Bank Statement" 
                url={uploadedDocuments?.bankStatementUrl} 
              />
              <UploadedDocumentDisplay 
                title="Utility Bill" 
                url={uploadedDocuments?.utilityBillUrl} 
              />
              <UploadedDocumentDisplay 
                title="Identification Document" 
                url={uploadedDocuments?.identificationDocumentUrl} 
                documentType={uploadedDocuments?.identificationDocumentType}
              />
            </>
          ) : (
            // Show upload fields
            <>
              <FileUpload
                id="bankStatement"
                label="Upload Bank Statement"
                file={formData.bankStatement}
                onFileChange={handleFileChange}
                error={errors.bankStatement}
                showDocumentType={false}
              />

              <FileUpload
                id="utilityBill"
                label="Upload Utility Bill"
                file={formData.utilityBill}
                onFileChange={handleFileChange}
                error={errors.utilityBill}
                showDocumentType={false}
              />

              <FileUpload
                id="identificationDocument"
                label="Upload Identification Document"
                file={formData.identificationDocument}
                onFileChange={handleFileChange}
                error={errors.identificationDocument}
                showDocumentType={true}
                documentType={formData.identificationDocumentType}
                onDocumentTypeChange={(type) => setFormData((prev) => ({ ...prev, identificationDocumentType: type }))}
              />
            </>
          )}
        </div>

        <div className="mt-10 flex justify-end gap-4">
          {!isPrefilled && (
            <Button
              onClick={handleSubmit}
              className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10"
              disabled={!allFieldsFilled}
            >
              Save and Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeAssessmentVerification;
