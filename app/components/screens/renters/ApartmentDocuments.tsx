"use client";

import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress"; // shadcn/ui progress
import { Eye } from "lucide-react";

type UploadedFile = {
  id: number;
  category: string;
  name: string;
  size: string;
  date: string;
};

const uploadSections = [
  { title: "Upload Lease Agreement", category: "Tenant Lease Agreement" },
  {
    title: "Upload Landlord Insurance Policy",
    category: "Landlord Insurance Policy",
  },
  {
    title: "Update Your Utility & Maintenance",
    category: "Utility & Maintenance",
  },
  { title: "Upload Other Documents", category: "Other Documents" },
];

export default function DocumentUpload(data: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Simulated backend uploaded files
  const hardcodedUploadedFiles: UploadedFile[] = [
    {
      id: 1,
      category: "Tenant Lease Agreement",
      name: "Signed Lease Agreement.pdf",
      size: "3MB",
      date: "11 Sep, 2023 12:24pm",
    },
    {
      id: 2,
      category: "Landlord Insurance Policy",
      name: "Insurance Policy.pdf",
      size: "5MB",
      date: "11 Sep, 2023 12:24pm",
    },
    {
      id: 3,
      category: "Utility & Maintenance",
      name: "Maintenance Doc.pdf",
      size: "1MB",
      date: "11 Sep, 2023 12:24pm",
    },
  ];

  const handleFileSelect = (category: string) => {
    setSelectedSection(category);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSection) return;

    setUploadProgress((prev) => ({
      ...prev,
      [selectedSection]: 0,
    }));

    // Fake Upload Progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const currentProgress = prev[selectedSection] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setSelectedFiles((prevFiles) => ({
            ...prevFiles,
            [selectedSection]: file,
          }));
          return { ...prev, [selectedSection]: 100 };
        }
        return { ...prev, [selectedSection]: currentProgress + 10 };
      });
    }, 100);

    fileInputRef.current!.value = ""; // Reset input
    setSelectedSection(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 bg-white rounded-xl shadow">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf,image/*"
      />

      {/* Left Side: Upload Sections */}
      <div className="w-full lg:w-2/3 flex-1 space-y-6">
        <h2 className="text-xl font-semibold">Apartment Documentations</h2>

        {uploadSections.map((section, idx) => (
          <div
            key={idx}
            className="w-full flex justify-between border border-dashed border-gray-300 rounded-lg p-6 space-y-4"
          >
            <h3 className="w-1/2 font-medium text-[12px]">{section.title}</h3>
            <div className="w-1/2">
              {selectedFiles[section.category] ? (
                // File Selected
                <div className="w-full flex items-center justify-between bg-gray-100 p-8 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      {selectedFiles[section.category]?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedFiles[section.category]?.size
                        ? (
                            selectedFiles[section.category]!.size /
                            (1024 * 1024)
                          ).toFixed(1)
                        : "0"}{" "}
                      MB
                    </p>
                  </div>
                  <button
                    className="text-green-600 hover:text-green-800 text-sm underline"
                    onClick={() => handleFileSelect(section.category)}
                  >
                    Change
                  </button>
                </div>
              ) : uploadProgress[section.category] !== undefined ? (
                <div className="w-full flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-[70%]">
                    <Progress value={uploadProgress[section.category]} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Uploading {uploadProgress[section.category]}%
                  </p>
                </div>
              ) : (
                // No File Selected Yet
                <div
                  onClick={() => handleFileSelect(section.category)}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* Upload Icon */}
                  <svg
                    width="56"
                    height="57"
                    viewBox="0 0 56 57"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="28" cy="28.5" r="28" fill="#E9F4E7" />
                    <path
                      d="M20.9954 25.5835C20.9954 22.0397 23.8683 19.1668 27.4121 19.1668C30.5513 19.1668 33.1661 21.4222 33.7203 24.4013C33.798 24.819 34.0967 25.1615 34.5 25.2953C36.8226 26.0656 38.4954 28.2557 38.4954 30.8335C38.4954 34.0552 35.8838 36.6668 32.6621 36.6668C32.0178 36.6668 31.4954 37.1892 31.4954 37.8335C31.4954 38.4778 32.0178 39.0002 32.6621 39.0002C37.1724 39.0002 40.8288 35.3438 40.8288 30.8335C40.8288 27.459 38.7827 24.565 35.8661 23.3197C34.8681 19.5845 31.4625 16.8335 27.4121 16.8335C22.5796 16.8335 18.6621 20.751 18.6621 25.5835C18.6621 25.7005 18.6644 25.817 18.669 25.933C16.5743 27.1415 15.1621 29.4048 15.1621 32.0002C15.1621 35.8662 18.2961 39.0002 22.1621 39.0002C22.8064 39.0002 23.3288 38.4778 23.3288 37.8335C23.3288 37.1892 22.8064 36.6668 22.1621 36.6668C19.5848 36.6668 17.4954 34.5775 17.4954 32.0002C17.4954 30.0666 18.6716 28.4051 20.3522 27.6971C20.8385 27.4923 21.1268 26.9865 21.0552 26.4637C21.0158 26.1765 20.9954 25.8827 20.9954 25.5835Z"
                      fill="#475367"
                    />
                    <path
                      d="M27.2204 31.1282C27.6624 30.7353 28.3285 30.7353 28.7705 31.1282L30.5205 32.6837C31.0021 33.1118 31.0455 33.8492 30.6174 34.3308C30.2429 34.7521 29.6317 34.838 29.1621 34.5663V40.1668C29.1621 40.8112 28.6398 41.3335 27.9954 41.3335C27.3511 41.3335 26.8288 40.8112 26.8288 40.1668V34.5663C26.3592 34.838 25.748 34.7521 25.3735 34.3308C24.9454 33.8492 24.9888 33.1118 25.4704 32.6837L27.2204 31.1282Z"
                      fill="#475367"
                    />
                  </svg>
                  <div className="flex flex-col items-center mt-2">
                    <p className="text-green-700 font-medium">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-400">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Side: Uploaded Files */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Uploaded Files</h2>
          <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {hardcodedUploadedFiles.length}
          </span>
        </div>

        <div className="space-y-4">
          {hardcodedUploadedFiles.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 bg-white p-4 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.date} · {file.size}
                </p>
                <p className="text-xs text-gray-400">{file.category}</p>
              </div>
              <button className="text-green-600 hover:text-green-800">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
