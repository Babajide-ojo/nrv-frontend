"use client";
import InputField from "@/app/components/shared/input-fields/InputFields";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";

const IdentificationVerification = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ id: null });
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [fileError, setFileError] = useState("");

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
        <div className="mt-10 flex justify-end">
          <Button
            onClick={() =>
              router.push("/dashboard/tenant/verification/income-assessment")
            }
            className="text-white bg-nrvPrimaryGreen hover:bg-nrvPrimaryGreen/80 px-10"
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentificationVerification;
