"use client";

import ProtectedRoute from "@/app/components/guard/LandlordProtectedRoute";
import TenantLayout from "@/app/components/layout/TenantLayout";
import LoadingPage from "@/app/components/loaders/LoadingPage";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import InputField from "@/app/components/shared/input-fields/InputFields";
import Button from "@/app/components/shared/buttons/Button";
import { useDispatch } from "react-redux";
import { createMaintenance } from "@/redux/slices/maintenanceSlice";
import { useParams, useRouter } from "next/navigation";
import { SlCloudUpload } from "react-icons/sl";
import "react-toastify/dist/ReactToastify.css";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import { Router } from "next/router";

const RequestMaintainance = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [_formData, setFormData] = useState<any>({
    title: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ..._formData, [name]: value });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFilesArray = Array.from(files);
    const allowedExtensions = ["jpg", "jpeg", "png"];

    const validFiles = selectedFilesArray.filter((file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      return allowedExtensions.includes(fileExtension || "");
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
    } else {
      setFileError("Please select valid image files (jpg, jpeg, png).");
      e.target.value = "";
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("nrv-user") || "{}");
    const formData :any = new FormData();

    formData.append("title", _formData.title);
    formData.append("description", _formData.description);
    selectedFiles.forEach((file) => {
      formData.append(`file`, file);
    });
    formData.append("roomId", id);
    formData.append("createdBy", user?.user?._id);

    try {
      setLoading(true);
      await dispatch(createMaintenance(formData) as any).unwrap();
      setFormData({
        title: "",
        description: "",
      });
      setSelectedFiles([]);
      setLoading(false);
      toast.success("Maintenance request created successfully.");
      router.push(`/dashboard/tenant/rented-properties/maintenance/${id}`)
    } catch (error) {
      setLoading(false);
      toast.error("Failed to create maintenance request.");
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ProtectedRoute>
          <TenantLayout>
            <ToastContainer />
            <div className="py-10 md:px-20 px-4">
              <div>
                <div className="flex gap-4">
                <div className="text-nrvGreyBlack mb-4 flex gap-3">
                  <BackIcon />
                  <div className="md:text-xl text-md font-medium text-nrvDarkGrey">
                    Log Maintenance Request/Complain
                  </div>
                </div>
                </div>
              
                <p className="text-nrvLightGrey font-light max-w-[25rem]">
                  Create a request yourself to stay organized and keep accurate
                  records.
                </p>
              </div>
              <div className="flex gap-5 flex-col justify-center items-center h-full mt-10 max-w-md w-full mx-auto">
                <div className="w-full">
                <p className="text-sm">Issue Title</p>
                  <InputField
                    css="bg-nrvLightGreyBg"
                    label=""
                    name="title"
                    value={_formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className="text-sm">Description</p>
                  <p className="text-nrvLightGrey text-sm font-light">
                    Add as much detail as possible including the specific
                    location.
                  </p>
                  <textarea
                    name="description"
                    className="w-full rounded-lg border border-nrvLightGrey font-light w-full px-3 py-2 bg-white focus:outline-none"
                    onChange={handleInputChange}
                    rows={5}
                    value={_formData.description}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <div className="w-full">
                    <label className="text-nrvGreyBlack mb-2 text-sm">
                      Upload an Image as a proof
                    </label>
                    <div
                      className="text-center w-full mt-2"
                      //onDrop={handleFileDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className="w-full border border-nrvLightGrey rounded-lg p-4 text-swBlack">
                        <input
                          type="file"
                          id="fileInput"
                          className="hidden"
                          accept=".png, .jpg, .jpeg"
                          onChange={handleFileInputChange}
                          multiple
                        />
                        <label
                          htmlFor="fileInput"
                          className="cursor-pointer p-2 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
                        >
                          <div className="text-center flex justify-center">
                            {selectedFiles.length > 0 ? (
                              selectedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center w-full mt-2"
                                >
                                  <p>{file.name}</p>
                                  <button
                                    onClick={() => handleDeleteFile(index)}
                                    className="font-bold text-red-500"
                                  >
                                    X
                                  </button>
                                </div>
                              ))
                            ) : (
                              <SlCloudUpload size={30} fontWeight={900} />
                            )}
                          </div>
                          {selectedFiles.length > 0
                            ? "Change files"
                            : "Click to upload"}
                        </label>
                      </div>
                    </div>
                  </div>
                  {fileError && (
                    <p className="text-sm font-light text-red-500">
                      {fileError}
                    </p>
                  )}
                  <div className="mt-4">
                    <Button
                      disabled={loading ? true : false}
                      className="w-full  text-md"
                      variant="roundedRec"
                      size="large"
                      showIcon={false}
                      onClick={handleSubmit}
                    >
                      {loading ? "Submitting" : "Submit Request"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TenantLayout>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default RequestMaintainance;
