"use client";
import { dashboardMetrics } from "../../../helpers/data";
import {
  BsHouse,
  BsPlus,
  BsPlusCircle,
  BsPlusCircleFill,
} from "react-icons/bs";
import Button from "../shared/buttons/Button";
import DashboardNavigationCard from "../shared/cards/DashboardNavigationCard";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";

const PropertyDocuments = () => {
  const router = useRouter();
  const [showBadge, setShowBadge] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [fileError, setFileError] = useState("");

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    let files: any = Array.from(e.dataTransfer.files);
    if (files.length <= 2) {
      setSelectedFiles(files as any);
    } else {
      alert("You can only upload a maximum of 2 files.");
    }
  };

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
      // setPropertyData((prev) => ({ ...prev, [e.target.id]: files[0] }));
    } else {
      setSelectedFiles(files as any);
    }
  };
  return (
    <div className="pb-12 md:pb-0 md:flex gap-6">
      <div className="md:w-1/2 w-full">
        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4">
          <div className="flex justify-between mb-4">
            <div className="font-light text-nrvDarkBlue">
              Ongoing Maintenance: 0
            </div>
            <div>
              <Button
                size="normal"
                className="bg-nrvGreyMediumBg p-2 border border-nrvGreyMediumBg mt-2 rounded-md mb-2  hover:text-white hover:bg-nrvDarkBlue"
                variant="mediumGrey"
                showIcon={false}
              >
                <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                  Create Request
                </div>
              </Button>
            </div>
          </div>
          <div className="text-center flex mx-auto mt-2 text-nrvGrayText font-light text-[13px]">
            Instead of being spread across text/emails/voicemails you now have a
            centralized place to view, respond to, and track maintenance logged
            by you or your tenant.
          </div>
        </div>
        <div className="w-full mt-8">
          <label className="text-nrvGreyBlack mb-2 text-md">
            Landlord Insurance Policy
          </label>
          <div
            className="text-center w-full mt-2"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-full border border-nrvLightGrey rounded-lg  text-swBlack">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".png, .jpg , .jpeg"
                onChange={handleFileInputChange}
              />

              <label
                htmlFor="fileInput"
                className="cursor-pointer  p-1 rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
              >
                <div className="text-center flex justify-center">
                  {selectedFiles.length > 0 ? (
                    selectedFiles[0]?.name
                  ) : (
                    <SlCloudUpload size={30} fontWeight={900} />
                  )}
                </div>
                {selectedFiles.length > 0 ? (
                  "Change file"
                ) : (
                  <div>
                    <div className="text-black">There’s nothing here yet</div>
                    <div>Click to upload</div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <label className="text-nrvGreyBlack mb-2 text-md">
            Utility & Maintenance
          </label>
          <p className="text-nrvLightGrey text-sm">
            Examples include: HOA, service contracts, appliance manuals,
            property assets, invoices, receipts
          </p>
          <div
            className="text-center w-full mt-2"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-full border border-nrvLightGrey rounded-lg  text-swBlack">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".png, .jpg , .jpeg"
                onChange={handleFileInputChange}
              />

              <label
                htmlFor="fileInput"
                className="cursor-pointer  p-1 rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
              >
                <div className="text-center flex justify-center">
                  {selectedFiles.length > 0 ? (
                    selectedFiles[0]?.name
                  ) : (
                    <SlCloudUpload size={30} fontWeight={900} />
                  )}
                </div>
                {selectedFiles.length > 0 ? (
                  "Change file"
                ) : (
                  <div>
                    <div className="text-black">There’s nothing here yet</div>
                    <div>Click to upload</div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="w-full mt-8">
          <label className="text-nrvGreyBlack mb-2 text-md">
            Other Documents
          </label>
          <p className="text-nrvLightGrey text-sm">
            Examples include: property policies, home inspection reports,
            notices, covenants, property-specific templates
          </p>
          <div
            className="text-center w-full mt-2"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-full border border-nrvLightGrey rounded-lg  text-swBlack">
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".png, .jpg , .jpeg"
                onChange={handleFileInputChange}
              />

              <label
                htmlFor="fileInput"
                className="cursor-pointer  p-1 rounded-md bg-swBlue text-nrvLightGrey font-light  mx-auto mt-5 mb-3"
              >
                <div className="text-center flex justify-center">
                  {selectedFiles.length > 0 ? (
                    selectedFiles[0]?.name
                  ) : (
                    <SlCloudUpload size={30} fontWeight={900} />
                  )}
                </div>
                {selectedFiles.length > 0 ? (
                  "Change file"
                ) : (
                  <div>
                    <div className="text-black">There’s nothing here yet</div>
                    <div>Click to upload</div>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 w-full mt-4">
        <div className="bg-white rounded rounded-2xl p-4">
          <div className="text-start text-nrvDarkBlue font-semibold text-[15px]  pb-12">
            Objectives
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                List room
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Invite to apply
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Screen a tenant
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                Build a lease agreement
              </div>
            </Button>
          </div>

          <div className="w-full mt-6">
            <Button
              size="normal"
              className="bg-nrvLightGreyBg w-full block border border-nrvGreyMediumBg pt-3 pb-3 text-md rounded-md  hover:text-white hover:bg-nrvDarkBlue text-bg-nrvDarkBlue"
              variant="mediumGrey"
              showIcon={false}
            >
              <div className="text-xs md:text-md p-1 flex gap-2 font-medium">
                E-sign a document
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyDocuments;
