"use client";

import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

const ApartmentDocuments = (data: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [viewDocs, setViewDocs] = useState<boolean>(false);
  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [pdf, setPdf] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string>("");

  const viewDocument = (item: string) => {
    const fileType = getFileExtension(item);
    if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
      setPdf("image");
    } else if (fileType === "pdf") {
      setPdf("pdf");
    }
    setFileUrl(item);
    setViewDocs(true);
    setViewerVisible(true);
  };

  const closeViewer = () => {
    setViewerVisible(false);
    setViewDocs(false);
    setFileUrl("");
    setPdf(null);
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12 md:pb-0">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="border-8 border-t-8 border-gray-200 rounded-full w-20 h-20 animate-spin"></div>
        </div>
      )}

      <div className="md:flex gap-6">
        <div className="md:w-1/2 w-full mt-4 md:mt-0">
          <div className="bg-white rounded-2xl p-4 shadow-md mt-8">
            <div className="text-nrvPrimaryGreen text-sm font-semibold">Uploaded Land Insurance Documents</div>
            {data.data.property?.propertyId?.landlordInsurancePolicy?.length > 0 ? (
              <div className="mt-4">
                {data.data.property.propertyId.landlordInsurancePolicy && data.data.property.propertyId.landlordInsurancePolicy.map((item: string, index: number) => (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md mt-4 cursor-pointer hover:bg-gray-100" key={index} onClick={() => viewDocument(item)}>
                    <span className="text-sm text-nrvLightGrey">Doc ({index})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs italic text-nrvLightGrey mt-4">No document uploaded yet</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md mt-8">
            <div className="text-nrvPrimaryGreen text-sm font-semibold">Utility & Maintenance Documents</div>
            {data.data.property?.propertyId?.utilityAndMaintenance?.length > 0 ? (
              <div className="mt-4">
                {data.data.property.propertyId.utilityAndMaintenance && data.data.property.propertyId.utilityAndMaintenance.map((item: string, index: number) => (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md mt-4 cursor-pointer hover:bg-gray-100" key={index} onClick={() => viewDocument(item)}>
                    <span className="text-sm text-nrvLightGrey">Doc ({index})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs italic text-nrvLightGrey mt-4">No document uploaded yet</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md mt-8">
            <div className="text-nrvPrimaryGreen text-sm font-semibold"> Uploaded</div>
            {data.data.property?.propertyId?.otherDocuments?.length > 0 ? (
              <div className="mt-4">
                {data.data.property.propertyId.otherDocuments && data.data.property.propertyId.otherDocuments.map((item: string, index: number) => (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md mt-4 cursor-pointer hover:bg-gray-100" key={index} onClick={() => viewDocument(item)}>
                    <span className="text-sm text-nrvLightGrey">Doc ({index})</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs italic text-nrvLightGrey mt-4">No document uploaded yet</div>
            )}
          </div>
        </div>

        {viewDocs && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${viewerVisible ? 'bg-black bg-opacity-50' : 'hidden'}`}>
            {pdf === "image" ? (
              <Viewer visible={viewerVisible} onClose={closeViewer} images={[{ src: fileUrl, alt: "Image" }]} />
            ) : pdf === "pdf" ? (
              <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
                <button onClick={closeViewer} className="absolute top-2 right-2 text-white rounded-full px-4 py-2">
                  X
                </button>
                <iframe src={fileUrl} height="600" width="600" title="PDF Viewer" className="border-0"></iframe>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApartmentDocuments;
