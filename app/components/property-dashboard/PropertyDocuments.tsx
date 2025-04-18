"use client";

import Button from "../shared/buttons/Button";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import { MdDelete, MdOutlineDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getPropertyById,
  updateProperty,
} from "../../../redux/slices/propertySlice";
import dynamic from "next/dynamic";
import { deleteDocumentById } from "../../../redux/slices/propertySlice";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });
const PropertyDocuments = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state: any) => state.property);
  const { id } = useParams();
  const router = useRouter();
  const [landlordInsuranceFiles, setLandlordInsuranceFiles] = useState<File[]>(
    []
  );
  const [utilityMaintenanceFiles, setUtilityMaintenanceFiles] = useState<
    File[]
  >([]);
  const [otherDocumentFiles, setOtherDocumentFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewDocs, setViewDocs] = useState<boolean>(false);
  const [itemUrl, setItemUrl] = useState<any>(null);
  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [pdf, setPdf] = useState<any>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const files: File[] = Array.from(e.target.files || []);

    // Check the id of the input to determine the type of document
    switch (e.target.id) {
      case "landlordInsurancePolicy":
        setLandlordInsuranceFiles((prevFiles) => [...prevFiles, ...files]);
        break;
      case "utilityMaintenance":
        setUtilityMaintenanceFiles((prevFiles) => [...prevFiles, ...files]);
        break;
      case "otherDocuments":
        setOtherDocumentFiles((prevFiles) => [...prevFiles, ...files]);
        break;
      default:
        // Handle other cases if needed
        break;
    }
  };

  const handleRemoveFile = (index: number, setter: Function) => {
    setter((prevFiles: File[]) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const formData = new FormData();

    landlordInsuranceFiles.forEach((file) => {
      formData.append("landlordInsurancePolicy", file);
    });
    utilityMaintenanceFiles.forEach((file) => {
      formData.append("utilityAndMaintenance", file);
    });
    otherDocumentFiles.forEach((file) => {
      formData.append("otherDocuments", file);
    });

    try {
      setLoading(true);
      const userData = await dispatch(
        updateProperty({ body: formData, id }) as any
      );

      const properties = await dispatch(getPropertyById(id) as any).unwrap();
      toast.success("Property document uploaded");
      setLandlordInsuranceFiles([]);
      setOtherDocumentFiles([]);
      setUtilityMaintenanceFiles([]);
      setLoading(false);
    } catch (error) {
      toast.error("An error occured while uploding document");
      setLoading(false);
    }
  };

  const deleteDocument = async () => {
    try {
      setLoading(true);
      await dispatch(deleteDocumentById({ documentUrl: itemUrl, id }) as any);
      await dispatch(getPropertyById(id) as any).unwrap();
      toast.success("Document deleted successfully");
      setItemUrl(null);
      setShowDeleteConfirmation(false);
      setLoading(false);
    } catch (error) {
      toast.error("An error occured while uploding document");
      setLoading(false);
    }
  };

  const viewDocument = (item: string) => {
    const fileType = getFileExtension(item);
    if (
      fileType === "jpg" ||
      fileType === "jpeg" ||
      fileType === "png" ||
      fileType === "gif"
    ) {
      setPdf("image");
    } else if (fileType === "pdf") {
      setPdf("pdf");
    }
    setFileUrl(item);
    setViewDocs(true);
    setViewerVisible(true); // Ensure viewer is visible when a document is viewed
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setViewDocs(false);
    setFileUrl(""); // Reset fileUrl
    setPdf(""); // Reset pdf state
  };

  const getFileExtension = (filename: string) => {
    if (filename) {
      const parts = filename.split(".");
      if (parts.length > 1) {
        return parts.pop()?.toLowerCase() || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const openDeleteConfirmation = (item: string) => {
    setShowDeleteConfirmation(true);
    setItemUrl(item);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setItemUrl(null);
  };
  return (
    <div className="pb-12 md:pb-0 md:flex gap-6">
      <ToastContainer />
      <div className="md:w-1/2 w-full">
        <div className="bg-white max-w-full w-120 rounded rounded-2xl p-4">
          <div className="flex justify-between mb-4">
            <div>
              <div className="font-medium text-sm text-nrvPrimaryGreen">
                Rental Settings
              </div>
              <div className="text-start flex mx-auto mt-4 text-nrvLightGrey font-light text-xs">
                Keep track of all the documents related to this property in one
                place. This documents are not shared with your tenants.
              </div>
            </div>
            <div>
              <Button
                size="smaller"
                className=" p-0.5 border  hover:text-white hover:bg-nrvPrimaryGreen"
                variant="whitebg"
                showIcon={false}
              >
                <div className="text-[12px] md:text-md  flex gap-2">
                  Documents
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <label className="text-nrvGreyBlack mb-2 text-sm">
            Landlord Insurance Policy
          </label>
          <div className="text-center w-full mt-2">
            <div className="w-full border border-nrvLightGrey rounded-lg text-swBlack">
              <div className="text-center ">
                {landlordInsuranceFiles.length > 0 ? (
                  landlordInsuranceFiles.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="m-2 flex items-center justify-between py-1.5 px-2 bg-white border-b rounded-md border-gray-200 transition-all duration-200 hover:bg-gray-100"
                    >
                      <span className="text-nrvLightGrey font-light text-xs">
                        {file.name}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() =>
                          handleRemoveFile(index, setLandlordInsuranceFiles)
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center mt-4 ">
                    <SlCloudUpload
                      size={30}
                      fontWeight={900}
                      className="text-nrvLightGrey"
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="landlordInsurancePolicy"
                className="hidden"
                accept=".png, .jpg, .jpeg, .pdf"
                onChange={(e) => handleFileInputChange(e)}
                multiple
              />
              <label
                htmlFor="landlordInsurancePolicy"
                className="cursor-pointer rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-3 mb-3"
              >
                <div className="pt-5 pb-5">
                  {landlordInsuranceFiles.length > 0
                    ? "Add more files"
                    : "Click to upload"}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Utility & Maintenance Documents */}
        <div className="w-full mt-4">
          <label className="text-nrvGreyBlack mb-2 text-sm mb-2">
            Utility & Maintenance
          </label>
          <p className="text-xs text-nrvLightGrey mt-2">
            Examples include: HOA, service contracts, appliance manuals,
            property assets, invoices, receipts
          </p>

          <div className="text-center w-full mt-2">
            <div className="w-full border border-nrvLightGrey rounded-lg text-swBlack">
              <div className="text-center">
                {utilityMaintenanceFiles.length > 0 ? (
                  utilityMaintenanceFiles.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="m-2 flex items-center justify-between py-1.5 px-2 bg-white border-b rounded-md border-gray-200 transition-all duration-200 hover:bg-gray-100"
                    >
                      <span className="text-nrvLightGrey font-light text-xs">
                        {file.name}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() =>
                          handleRemoveFile(index, setLandlordInsuranceFiles)
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center mt-4 ">
                    <SlCloudUpload
                      size={30}
                      fontWeight={900}
                      className="text-nrvLightGrey"
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="utilityMaintenance"
                className="hidden"
                accept=".png, .jpg, .jpeg, .pdf"
                onChange={(e) => handleFileInputChange(e)}
                multiple // Enable multiple file selection
              />
              <label
                htmlFor="utilityMaintenance"
                className="cursor-pointer p-1 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-3 mb-3"
              >
                <div className="">
                  {utilityMaintenanceFiles.length > 0
                    ? "Add more files"
                    : "Click to upload"}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Other Documents */}
        <div className="w-full mt-4">
          <label className="text-nrvGreyBlack mb-2 text-sm">
            Other Documents
          </label>
          <p className="text-xs text-nrvLightGrey mt-2">
            Examples include: property policies, home inspection reports,
            notices, covenants, property-specific templates
          </p>
          <div className="text-center w-full mt-2">
            <div className="w-full border border-nrvLightGrey rounded-lg text-swBlack">
              <div className="text-center">
                {otherDocumentFiles.length > 0 ? (
                  otherDocumentFiles.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="m-2 flex items-center justify-between py-1.5 px-2 bg-white border-b rounded-md border-gray-200 transition-all duration-200 hover:bg-gray-100"
                    >
                      <span className="text-nrvLightGrey font-light text-xs">
                        {file.name}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        onClick={() =>
                          handleRemoveFile(index, setLandlordInsuranceFiles)
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center mt-4 ">
                    <SlCloudUpload
                      size={30}
                      fontWeight={900}
                      className="text-nrvLightGrey"
                    />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="otherDocuments"
                className="hidden"
                accept=".png, .jpg, .jpeg, .pdf"
                onChange={(e) => handleFileInputChange(e)}
                multiple // Enable multiple file selection
              />
              <label
                htmlFor="otherDocuments"
                className="cursor-pointer p-1 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
              >
                <div className="">
                  {otherDocumentFiles.length > 0
                    ? "Add more files"
                    : "Click to upload"}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Button
            size="normal"
            className={`bg-nrvLightGreyBg w-full block pt-3 pb-3 text-md rounded-md hover:text-white hover:bg-nrvPrimaryGreen text-bg-nrvPrimaryGreen ${
              !landlordInsuranceFiles.length &&
              !utilityMaintenanceFiles.length &&
              !otherDocumentFiles.length
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            variant="primary"
            showIcon={false}
            onClick={handleUpload}
            disabled={
              !landlordInsuranceFiles.length &&
              !utilityMaintenanceFiles.length &&
              !otherDocumentFiles.length
            }
          >
            <div className="">Upload document</div>
          </Button>
        </div>
      </div>
      <div className="md:w-1/2 w-full md:mt-0 mt-4">
        <div className="bg-white rounded rounded-2xl p-4">
          <div className="text-start text-nrvPrimaryGreen text-[11px]">
            Uploaded Land Insurance Documents
          </div>
          {data?.data?.landlordInsurancePolicy?.length > 0 ? (
            <div>
              {data?.data?.landlordInsurancePolicy &&
                data?.data?.landlordInsurancePolicy.map(
                  (item: any, index: any) => (
                    <div className="w-full mt-6" key={index}>
                      <div className="bg-white w-full block border border-nrvGreyMediumBg p-2 rounded-md text-bg-nrvPrimaryGreen flex space-between justify-between">
                        <div
                          className="underline text-xs cursor-pointer"
                          onClick={() => viewDocument(item)}
                        >
                          {" "}
                          Docs ({index})
                        </div>{" "}
                        <div
                          className="text-red-500 cursor-pointer"
                          onClick={() => {
                            openDeleteConfirmation(item);
                            //deleteDocument(item);
                          }}
                        >
                          <MdDelete size={20} />
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          ) : (
            <div className="text-xs italics text-nrvLightGrey pt-3">
              {" "}
              No document uploaded yet
            </div>
          )}

          <div className="text-start text-nrvPrimaryGreen text-[11px] mt-8">
            Utility & Maintenanace Documents
          </div>
          {data?.data?.utilityAndMaintenance?.length > 0 ? (
            <div>
              {data?.data?.utilityAndMaintenance &&
                data?.data?.utilityAndMaintenance.map(
                  (item: any, index: any) => (
                    <div className="w-full mt-6" key={index}>
                      <div className="bg-white w-full block border border-nrvGreyMediumBg p-2 rounded-md text-bg-nrvPrimaryGreen flex space-between justify-between">
                        <div
                          className="underline text-xs cursor-pointer"
                          onClick={() => viewDocument(item)}
                        >
                          {" "}
                          Docs ({index})
                        </div>{" "}
                        <div
                          className="text-red-500 cursor-pointer"
                          onClick={() => {
                            openDeleteConfirmation(item);
                            // deleteDocument(item);
                          }}
                        >
                          <MdDelete size={20} />
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          ) : (
            <div className="text-xs italics text-nrvLightGrey pt-3">
              {" "}
              No document uploaded yet
            </div>
          )}

          <div className="text-start text-nrvPrimaryGreen text-[11px] mt-8">
            Other Documents Uploaded
          </div>
          {data?.data?.otherDocuments?.length > 0 ? (
            <div>
              {data?.data?.otherDocuments &&
                data?.data?.otherDocuments.map((item: any, index: any) => (
                  <div className="w-full mt-6" key={index}>
                    <div className="bg-white w-full block border border-nrvGreyMediumBg p-2 rounded-md text-bg-nrvPrimaryGreen flex space-between justify-between">
                      <div
                        className="underline text-xs cursor-pointer"
                        onClick={() => viewDocument(item)}
                      >
                        {" "}
                        Docs ({index})
                      </div>{" "}
                      <div
                        className="text-red-500 cursor-pointer"
                        onClick={() => {
                          openDeleteConfirmation(item);
                          //  deleteDocument(item);
                        }}
                      >
                        <MdDelete size={20} />
                      </div>
                    </div>
                    {/* {viewDocs ? <FileViewer fileUrl={item} /> : null} */}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-xs italics text-nrvLightGrey pt-3">
              {" "}
              No document uploaded yet
            </div>
          )}
        </div>
      </div>
      {loading && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center"
        >
          <div className="loader border-8 border-t-8 border-gray-200 rounded-full w-20 h-20 animate-spin"></div>
        </div>
      )}

      {viewDocs === true ? (
        <div>
          {pdf === "image" && (
            <>
              <Viewer
                visible={viewerVisible}
                onClose={closeViewer}
                images={[{ src: fileUrl, alt: "Image" }]}
              />
            </>
          )}
          {pdf === "pdf" && (
            <div
              id="overlay"
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center"
            >
              <div className="overflow-y-scroll bg-white p-4 relative">
                <button
                  onClick={closeViewer}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-4 py-2"
                >
                  X
                </button>
                <div>
                  <iframe
                    src={fileUrl}
                    height="600"
                    width="600"
                    title="PDF Viewer"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {showDeleteConfirmation && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center"
        >
          <div className="bg-white p-8 rounded-[1.2rem] shadow-md text-center w-[30rem] m-4">
            <p className="pb-2 text-red-700 flex justify-center items-center text-[1.25rem] font-medium w-full mx-auto">
              <MdOutlineDeleteOutline color="#ef5e5e" size={40} />
            </p>

            <p className="text-red-700 text-sm mb-4">
              This action can&#39;t be undone!!!
            </p>
            <div className="mt-8 flex justify-between ">
              <button
                onClick={closeDeleteConfirmation}
                className="bg-gray-200 text-sm text-nrvPrimaryGreen px-6 py-1.5 rounded w-[48%]"
              >
                No
              </button>
              <button
                onClick={deleteDocument}
                className="bg-red-200 text-red-600 px-6 py-1.5 rounded w-[48%]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PropertyDocuments;
