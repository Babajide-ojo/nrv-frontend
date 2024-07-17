"use client";

import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useState } from "react";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

const ApartmentDocuments = (data: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewDocs, setViewDocs] = useState<boolean>(false);

  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [pdf, setPdf] = useState<any>(null);
  const [fileUrl, setFileUrl] = useState<string>("");
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

  return (
    <div className="pb-12 md:pb-0 md:flex gap-6">
      <div className="md:w-1/2 w-full md:mt-0 mt-4">
        <div className="">
          <div className="bg-white rounded rounded-2xl p-4 mt-8">
            <div className="text-start text-nrvDarkBlue text-[16px]">
              Uploaded Land Insurance Documents
            </div>
            {data.data.property.propertyId.landlordInsurancePolicy?.length >
            0 ? (
              <div>
                {data.data.property.propertyId.landlordInsurancePolicy &&
                  data.data.property.propertyId.landlordInsurancePolicy.map(
                    (item: any, index: any) => (
                      <div className="w-full mt-6" key={index}>
                        <div className=" w-full block p-2 rounded-md text-bg-nrvDarkBlue flex space-between justify-between">
                          <div
                            className="underline text-sm text-nrvLightGrey cursor-pointer"
                            onClick={() => viewDocument(item)}
                          >
                            {" "}
                            Docs ({index})
                          </div>{" "}
                        </div>
                      </div>
                    )
                  )}
              </div>
            ) : (
              <div className="text-sm italics text-nrvLightGrey pt-3">
                {" "}
                No document uploaded yet
              </div>
            )}
          </div>

          <div className="bg-white rounded rounded-2xl p-4 mt-8">
            <div className="text-start text-nrvDarkBlue text-[16px]">
              Utility & Maintenanace Documents
            </div>
            {data.data.property.propertyId.utilityAndMaintenance?.length > 0 ? (
              <div>
                {data.data.property.propertyId.utilityAndMaintenance &&
                  data.data.property.propertyId.utilityAndMaintenance.map(
                    (item: any, index: any) => (
                      <div className="w-full mt-6" key={index}>
                        <div className=" w-full block p-2 rounded-md text-bg-nrvDarkBlue flex space-between justify-between">
                          <div
                            className="underline text-sm text-nrvLightGrey cursor-pointer"
                            onClick={() => viewDocument(item)}
                          >
                            {" "}
                            Docs ({index})
                          </div>{" "}
                        </div>
                      </div>
                    )
                  )}
              </div>
            ) : (
              <div className="text-sm italics text-nrvLightGrey pt-3">
                {" "}
                No document uploaded yet
              </div>
            )}
          </div>
          <div className="bg-white rounded rounded-2xl p-4 mt-8">
            <div className="text-start text-nrvDarkBlue text-[16px]">
              Other Documents Uploaded
            </div>
            {data.data.property.propertyId.otherDocuments ? (
              <div>
                {data.data.property.propertyId.otherDocuments &&
                  data.data.property.propertyId.otherDocuments.map(
                    (item: any, index: any) => (
                      <div className="w-full mt-6" key={index}>
                        <div className="w-full block p-2 rounded-md text-bg-nrvDarkBlue flex space-between justify-between">
                          <div
                            className="underline text-sm text-nrvLightGrey cursor-pointer"
                            onClick={() => viewDocument(item)}
                          >
                            {" "}
                            Docs ({index})
                          </div>{" "}
                        </div>
                      </div>
                    )
                  )}
              </div>
            ) : (
              <div className="text-sm italics text-nrvLightGrey pt-3">
                {" "}
                No document uploaded yet
              </div>
            )}
          </div>
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
    </div>
  );
};
export default ApartmentDocuments;
