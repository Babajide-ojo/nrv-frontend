"use client";

import ProtectedRoute from "@/app/components/guard/TenantProtectedRoute";
import TenantLayout from "@/app/components/layout/TenantLayout";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createMaintenance } from "@/redux/slices/maintenanceSlice";
import { useParams, useRouter } from "next/navigation";
import BackIcon from "@/app/components/shared/icons/BackIcon";
import {
  Building2,
  FileImage,
  Info,
  Loader2,
  MapPin,
  UploadCloud,
  Wrench,
  X,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/config/constant";

const MAX_FILES = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

type MaintenanceForm = {
  title: string;
  description: string;
};

type MaintenanceFormErrors = Partial<Record<keyof MaintenanceForm, string>>;

type ApartmentContext = {
  roomId: string;
  title: string;
  address: string;
  unitNumber?: string | number;
};

const RequestMaintainance = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<MaintenanceForm>({
    title: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<MaintenanceFormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [apartment, setApartment] = useState<ApartmentContext | null>(null);
  const [apartmentError, setApartmentError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    if (formErrors[name as keyof MaintenanceForm]) {
      setFormErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleFiles = (files: File[]) => {
    setFileError("");
    if (files.length === 0) {
      return;
    }

    const invalidType = files.find(
      (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
    );
    if (invalidType) {
      setFileError("Only JPG and PNG images are supported.");
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFile) {
      setFileError("Each image must be 5 MB or smaller.");
      return;
    }

    if (files.length > MAX_FILES) {
      setFileError(`You can upload up to ${MAX_FILES} images.`);
      return;
    }

    setSelectedFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(Array.from(e.target.files ?? []));
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    const nextErrors: MaintenanceFormErrors = {};
    if (formData.title.trim().length < 3) {
      nextErrors.title = "Enter a clear issue title (at least 3 characters).";
    }
    if (formData.description.trim().length < 10) {
      nextErrors.description =
        "Add at least 10 characters describing the issue and its location.";
    }
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const user = JSON.parse(localStorage.getItem("nrv-user") || "{}");
    const routeId = Array.isArray(id) ? id[0] : id;
    const roomId = apartment?.roomId || routeId;
    if (!roomId || !user?.user?._id) {
      toast.error("Unable to identify this apartment. Please refresh and retry.");
      return;
    }

    const payload = new FormData();

    payload.append("title", formData.title.trim());
    payload.append("description", formData.description.trim());
    selectedFiles.forEach((file) => {
      payload.append("file", file);
    });
    payload.append("roomId", roomId);
    payload.append("createdBy", user.user._id);

    try {
      setLoading(true);
      await dispatch(createMaintenance(payload) as any).unwrap();
      setFormData({
        title: "",
        description: "",
      });
      setSelectedFiles([]);
      toast.success("Maintenance request created successfully.");
      router.push(
        `/dashboard/tenant/rented-properties/maintenance/${roomId}`,
      );
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Failed to create maintenance request.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadApartment = async () => {
      const routeId = Array.isArray(id) ? id[0] : id;
      if (!routeId) {
        setApartmentError("Apartment details could not be loaded.");
        setIsLoading(false);
        return;
      }

      try {
        let room: any = null;

        try {
          const applicationResponse = await axios.get(
            `${API_URL}/properties/single-application/${routeId}`,
          );
          room = applicationResponse?.data?.data?.propertyId;
        } catch {
          // This route can also receive a room id directly.
        }

        if (!room?._id) {
          const roomResponse = await axios.get(
            `${API_URL}/rooms/single/${routeId}`,
          );
          room = roomResponse?.data?.data;
        }

        if (!room?._id) {
          throw new Error("Apartment not found");
        }

        const listing = room?.propertyId;
        const address = [
          listing?.streetAddress ?? room?.streetAddress,
          listing?.city ?? room?.city,
          listing?.state ?? room?.state,
        ]
          .filter(Boolean)
          .join(", ");

        setApartment({
          roomId: String(room._id),
          title:
            room?.apartmentStyle ||
            room?.apartmentType ||
            room?.description ||
            "Apartment",
          address: address || "Address unavailable",
          unitNumber: room?.roomId,
        });
        setApartmentError("");
      } catch {
        setApartmentError(
          "We couldn’t load this apartment’s details. You can go back and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadApartment();
  }, [id]);

  return (
    <ProtectedRoute>
      <TenantLayout>
        {isLoading ? (
          <div className="mx-auto max-w-3xl animate-pulse px-4 py-8 sm:px-6">
            <div className="h-7 w-72 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-gray-100" />
            <div className="mt-8 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 sm:p-8">
              <div className="h-12 rounded-xl bg-gray-100" />
              <div className="h-36 rounded-xl bg-gray-100" />
              <div className="h-44 rounded-xl bg-gray-100" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        ) : (
          <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-1 rounded-md p-1 text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#03442C]/30"
                aria-label="Go back"
              >
                <BackIcon />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <Wrench
                    className="h-5 w-5 text-[#03442C]"
                    aria-hidden="true"
                  />
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    Report a maintenance issue
                  </h1>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                  Tell your landlord what needs attention. Include the exact
                  location and add clear photos when possible.
                </p>
              </div>
            </div>

            {apartment ? (
              <section
                className="mt-7 rounded-2xl border border-[#03442C]/15 bg-[#F7FAF8] p-4 sm:p-5"
                aria-label="Apartment for this maintenance request"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E9F4E7] text-[#03442C]">
                    <Building2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Request for
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {apartment.title}
                      </h2>
                      {apartment.unitNumber != null && (
                        <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs font-medium text-[#03442C] shadow-sm">
                          Unit {apartment.unitNumber}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-gray-600">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{apartment.address}</span>
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <div
                className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {apartmentError}
              </div>
            )}

            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-start gap-3 border-b border-gray-100 bg-[#F7FAF8] px-5 py-4 sm:px-7">
                <Info
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#03442C]"
                  aria-hidden="true"
                />
                <p className="text-sm text-gray-700">
                  Fields marked <span className="text-red-600">*</span> are
                  required. Photos are optional, but they help your landlord
                  assess the issue faster.
                </p>
              </div>

              <form
                className="space-y-6 p-5 sm:p-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSubmit();
                }}
                noValidate
              >
                <div>
                  <label
                    htmlFor="maintenance-title"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Issue title <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="maintenance-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Leaking kitchen sink"
                    maxLength={100}
                    aria-invalid={Boolean(formErrors.title)}
                    aria-describedby={
                      formErrors.title ? "maintenance-title-error" : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-[#03442C]/15 ${
                      formErrors.title
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#03442C]"
                    }`}
                  />
                  <div className="mt-1.5 flex justify-between gap-3">
                    {formErrors.title ? (
                      <p
                        id="maintenance-title-error"
                        className="text-xs text-red-600"
                      >
                        {formErrors.title}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 text-xs text-gray-400">
                      {formData.title.length}/100
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="maintenance-description"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <p className="mb-2 text-xs leading-5 text-gray-500">
                    Describe what happened, where it is, and when you first
                    noticed it.
                  </p>
                  <textarea
                    id="maintenance-description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="The pipe beneath the kitchen sink started leaking this morning. Water is collecting inside the cabinet..."
                    maxLength={1000}
                    aria-invalid={Boolean(formErrors.description)}
                    aria-describedby={
                      formErrors.description
                        ? "maintenance-description-error"
                        : undefined
                    }
                    className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-[#03442C]/15 ${
                      formErrors.description
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-[#03442C]"
                    }`}
                  />
                  <div className="mt-1.5 flex justify-between gap-3">
                    {formErrors.description ? (
                      <p
                        id="maintenance-description-error"
                        className="text-xs text-red-600"
                      >
                        {formErrors.description}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 text-xs text-gray-400">
                      {formData.description.length}/1000
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <label
                        htmlFor="maintenance-images"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Add photos
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG or PNG · up to {MAX_FILES} images · 5 MB each
                      </p>
                    </div>
                    {selectedFiles.length > 0 && (
                      <span className="text-xs font-medium text-[#03442C]">
                        {selectedFiles.length}/{MAX_FILES} selected
                      </span>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    id="maintenance-images"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png"
                    onChange={handleFileInputChange}
                    multiple
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={handleFileDrop}
                    aria-label="Upload maintenance issue photos"
                    className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center outline-none transition focus:ring-2 focus:ring-[#03442C]/20 ${
                      isDragging
                        ? "border-[#03442C] bg-[#E9F4E7]"
                        : "border-gray-300 bg-gray-50 hover:border-[#03442C]/60 hover:bg-[#F7FAF8]"
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9F4E7] text-[#03442C]">
                      <UploadCloud className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-800">
                      Drop photos here or{" "}
                      <span className="text-[#03442C]">browse files</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Clear, well-lit photos work best
                    </p>
                  </div>

                  {fileError && (
                    <p className="mt-2 text-xs text-red-600" role="alert">
                      {fileError}
                    </p>
                  )}

                  {selectedFiles.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={`${file.name}-${file.lastModified}`}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                            <FileImage
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(1)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteFile(index);
                            }}
                            className="rounded-md p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !apartment}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#03442C] px-6 text-sm font-semibold text-white transition hover:bg-[#023522] focus:outline-none focus:ring-2 focus:ring-[#03442C]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && (
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    {loading ? "Submitting request…" : "Submit request"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        )}
      </TenantLayout>
    </ProtectedRoute>
  );
};

export default RequestMaintainance;
