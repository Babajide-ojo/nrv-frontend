"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { FiX } from "react-icons/fi";

interface FormData {
  bankStatement: File | null;
  utilityBill: File | null;
}

interface FileUploadProps {
  id: keyof FormData;
  label: string;
  file: File | null;
  onFileChange: (id: keyof FormData, file: File | null) => void;
  error?: string;
}

const FileUpload = ({
  id,
  label,
  file,
  onFileChange,
  error,
}: FileUploadProps) => {
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

const IncomeAssessmentVerification = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    bankStatement: null,
    utilityBill: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      if (formData.bankStatement) {
        submitFormData.append("bankStatement", formData.bankStatement);
      }

      if (formData.utilityBill) {
        submitFormData.append("utilityBill", formData.utilityBill);
      }

      // API call would go here
      console.log("Submitting:", {
        bankStatement: formData.bankStatement?.name,
        utilityBill: formData.utilityBill?.name,
      });

      // Navigate to next step
      // router.push("/dashboard/tenant/verification/next-step");
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
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
          <FileUpload
            id="bankStatement"
            label="Upload Bank Statement"
            file={formData.bankStatement}
            onFileChange={handleFileChange}
            error={errors.bankStatement}
          />

          <FileUpload
            id="utilityBill"
            label="Upload Utility Bill"
            file={formData.utilityBill}
            onFileChange={handleFileChange}
            error={errors.utilityBill}
          />
        </div>

        <div className="mt-10 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save and Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeAssessmentVerification;
