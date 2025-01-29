import React, { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";

// Reusable Image Upload Component
interface ImageUploadProps {
  label: string;
  onChange: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({ label, onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles([files[0]]);
      onChange(files[0]); // Pass the file to the parent component via onChange
    }
  };

  const handlePreviewClick = (file: File) => {
    setOverlayImage(URL.createObjectURL(file));
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayImage(null);
  };

  return (
    <div className="w-full mt-4">
      <label className="text-black font-medium">
        {label}
      </label>

      {/* Image Upload Section */}
      <div
        className="text-center w-full mt-2 w-full border border-nrvLightGrey rounded-lg pt-4 pb-4 text-swBlack"
        onDragOver={(e) => e.preventDefault()}
      >
        {/* Only show the Preview Image link if a file is selected */}
        {selectedFiles.length > 0 && (
          <div
            onClick={() => handlePreviewClick(selectedFiles[0])}
            className="text-nrvDarkBlue font-medium cursor-pointer"
          >
            Preview Image
          </div>
        )}

        {/* Upload Area */}
        <div className="">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".png, .jpg , .jpeg"
            onChange={handleFileInputChange}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer rounded-md bg-swBlue text-nrvLightGrey font-normal mx-auto mt-5 mb-3 transition duration-300 ease-in-out hover:bg-swBlueLight"
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

      {/* Image Overlay Modal */}
      {showOverlay && overlayImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeOverlay}
        >
          <div className="relative w-auto max-w-3xl">
            <img
              src={overlayImage}
              alt="Overlay Preview"
              className="w-full h-auto rounded-md shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white text-black rounded-full p-2"
              onClick={closeOverlay}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
