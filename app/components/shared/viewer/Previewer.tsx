"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

interface FileViewerProps {
  initialFileUrl: any;
}

const FileViewer: React.FC<FileViewerProps> = ( {initialFileUrl} ) => {
  const [viewerVisible, setViewerVisible] = useState<boolean>(true);
  const [fileUrl, setFileUrl] = useState<any>(initialFileUrl);


  useEffect(() => {
    setFileUrl(initialFileUrl);
  }, [initialFileUrl]);

  const closeViewer = () => {
    setViewerVisible(false);
  };

  const getFileExtension = (filename: any) => {
    if (filename && filename) {
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

  const fileType = getFileExtension(fileUrl);
  const isImage =
    fileType === "jpg" ||
    fileType === "jpeg" ||
    fileType === "png" ||
    fileType === "gif";
  const isPDF = fileType === "pdf";

  return (
    <div>
      {isImage && (
        <>
          <Viewer
            visible={viewerVisible}
            onClose={closeViewer}
            images={[{ src: fileUrl, alt: "Image" }]}
          />
        </>
      )}
      {isPDF && viewerVisible && (
        <div
          id="overlay"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center"
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
  );
};

export default FileViewer;
