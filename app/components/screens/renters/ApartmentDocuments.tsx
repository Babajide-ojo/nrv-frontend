"use client";

import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Progress } from "@/components/ui/progress";
import { Eye } from "lucide-react";
import {
  fetchUploadedDocuments,
  uploadDocument,
} from "@/redux/slices/documentSlice";

const uploadSections = [
  { title: "Upload Lease Agreement", category: "Tenant Lease Agreement" },
  { title: "Upload Landlord Insurance Policy", category: "Landlord Insurance Policy" },
  { title: "Update Your Utility & Maintenance", category: "Utility & Maintenance" },
  { title: "Upload Other Documents", category: "Other Documents" },
];

const categoryToDtoKey: Record<string, string> = {
  "Tenant Lease Agreement": "file",
  "Landlord Insurance Policy": "landlordInsurancePolicy",
  "Utility & Maintenance": "utilityAndMaintenance",
  "Other Documents": "otherDocuments",
};

export default function DocumentUpload({ propertyId }: { propertyId: any }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // **Select only the documents slice** :contentReference[oaicite:3]{index=3}
  const uploadedFiles = useSelector((state: any) => state.document);
  console.log({uploadedFiles, propertyId});
  

  // **Fetch on mount and when propertyId changes**, guard against undefined :contentReference[oaicite:4]{index=4}
  useEffect(() => {
    dispatch(fetchUploadedDocuments(propertyId) as any);
  }, [dispatch, propertyId]);

  const handleFileSelect = (category: string) => {
    setSelectedSection(category);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSection) return;
    setSelectedFiles((prev) => ({ ...prev, [selectedSection]: file }));
    setUploadProgress((prev) => ({ ...prev, [selectedSection]: 0 }));
    setSelectedSection(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // **Upload all at once with async/await & try/catch** :contentReference[oaicite:5]{index=5}
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("property", propertyId);
    Object.entries(selectedFiles).forEach(([category, file]) => {
      const key = categoryToDtoKey[category];
      formData.append(key, file);
    });

    try {
      await dispatch(uploadDocument(formData) as any).unwrap();
      setSelectedFiles({});
      setUploadProgress({});
      alert("Uploaded successfully");
      dispatch(fetchUploadedDocuments(propertyId) as any);
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.message || err));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-white rounded-xl shadow">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf,image/*"
      />

      {/* Upload Sections */}
      <div className="w-full lg:w-2/3 space-y-6">
        <h2 className="text-xl font-semibold">Apartment Documentations</h2>
        {uploadSections.map(({ title, category }) => (
          <div
            key={category}
            className="flex justify-between rounded-lg p-4"
          >
            <div className="w-1/2">
              <h3 className="font-medium text-sm">{title}</h3>
            </div>
            <div className="w-1/2">
              {selectedFiles[category] ? (
                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                  <div>
                    <p className="font-medium">{selectedFiles[category].name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFiles[category].size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => handleFileSelect(category)}
                    className="text-green-600 underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleFileSelect(category)}
                  className="w-full h-20 border-dashed border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-green-700 font-medium">Click to upload</span>
                    <span className="text-xs text-gray-400">or drag & drop</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Documents
        </button>
      </div>

      {/* Uploaded Files List */}
        {

          uploadedFiles &&       <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-lg font-semibold">
            Uploaded Files ({uploadedFiles?.length ?? 0})
          </h2>
          <div className="space-y-3">
        {uploadedFiles?.data?.map((file: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.category}</p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                >
                  <Eye className="h-5 w-5" />
                </a>
              </div>
            )) ?? <p>No documents uploaded yet.</p>}
          </div>
        </div>
        }
    </div>
  );
}
