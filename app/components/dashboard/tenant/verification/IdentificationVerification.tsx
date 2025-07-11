"use client";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { apiService } from "@/lib/api";

interface IdentificationVerificationProps {
  initialData?: any;
}

const IdentificationVerification = ({ initialData }: IdentificationVerificationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    id: null,
    bankStatement: null,
    utilityBill: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [fileError, setFileError] = useState("");
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [verificationResponseId, setVerificationResponseId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [prefilledData, setPrefilledData] = useState(formData);

  const formKeys: (keyof typeof formData)[] = [
    "id",
    "bankStatement",
    "utilityBill",
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
            id: data._id || null,
            bankStatement: data.bankStatementUrl || null,
            utilityBill: data.utilityBillUrl || null,
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

  const handleFileInputChange = (e: any) => {
    setFileError("");
    const files: any = Array.from(e.target.files);
    if (e.target.id === "profilePicture" && e.target.files.length > 0) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();

      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(fileExtension)) {
        setFileError(
          "Invalid file type. Please select an image (.jpg, .jpeg, .png)."
        );
        return;
      }
      setFormData((prev) => ({ ...prev, [e.target.id]: files[0] }));
    } else {
      setSelectedFiles(files as any);
    }
  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    let files: any = Array.from(e.dataTransfer.files);
    if (files.length <= 2) {
      setSelectedFiles(files as any);
    } else {
      alert("You can only upload a maximum of 2 files.");
    }
  };

  const allFieldsFilled = useMemo(() => {
    // ...check all required fields for this step
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
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationResponseId}`);
      return;
    }
    if (!verificationResponseId) {
      alert('Verification response ID missing.');
      return;
    }
    // Always upload files to affordability endpoint
    const formData: any = new FormData();
    if (formData.bankStatement) formData.append('bankStatement', formData.bankStatement);
    if (formData.utilityBill) formData.append('utilityBill', formData.utilityBill);
    try {
      await apiService.post(`/verification/${verificationResponseId}/affordability`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push(`/dashboard/tenant/verification/income-assessment?verificationId=${verificationResponseId}`);
    } catch (error: any) {
      alert(error.message || 'Failed to upload documents.');
    }
  };

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
          <label
            className="w-full mt-4 cursor-pointer"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="text-nrvGreyBlack mb-2 text-sm">
              Upload Government Approved Doc
            </p>
            <div className="text-center w-full mt-2">
              <div className="w-full border border-nrvLightGrey rounded-lg pt-4 pb-4 text-swBlack">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept=".png, .jpg , .jpeg"
                  onChange={handleFileInputChange}
                />
                <label
                  htmlFor="fileInput"
                  className=" p-2 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
                >
                  <div className="text-center flex justify-center">
                    {selectedFiles.length > 0 ? (
                      selectedFiles[0]?.name
                    ) : (
                      <SlCloudUpload size={30} fontWeight={900} />
                    )}
                  </div>
                  {selectedFiles.length > 0 ? "Change file" : "Click to upload"}
                </label>
              </div>
            </div>
          </label>
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
              router.push(`/dashboard/tenant/verification/self-id?verificationId=${verificationResponseId}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentificationVerification;  