import React, { useState, useEffect } from "react";

interface MultiImageUploadProps {
  label: string;
  onChange: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string;
  initialImages?: File[];
  value?: File[];
}

const MultiImageUploader: React.FC<MultiImageUploadProps> = ({ 
  label, 
  onChange, 
  maxFiles = 10,
  acceptedTypes = ".png, .jpg, .jpeg",
  initialImages = [],
  value
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(value || initialImages);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number>(0);

  // Sync with external value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedFiles(value);
    }
  }, [value]);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      onChange(newFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onChange(newFiles);
  };

  const handlePreviewClick = (file: File, index: number) => {
    setOverlayImage(URL.createObjectURL(file));
    setOverlayIndex(index);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayImage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles = [...selectedFiles, ...files].slice(0, maxFiles);
      setSelectedFiles(newFiles);
      onChange(newFiles);
    }
  };

  return (
    <div className="w-full mt-4">
      <label className="text-nrvInputFiledColor text-[14px] font-medium">{label}</label>

      {/* Image Upload Section */}
      <div
        className="text-center w-full mt-2 w-full rounded-lg pt-4 pb-4 text-swBlack"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          borderColor: "#7d7d7d",
          borderStyle: "dotted",
          borderWidth: "1px",
        }}
      >
        {/* Selected Images Preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <div className="text-nrvPrimaryGreen font-medium mb-2">
              Selected Images ({selectedFiles.length}/{maxFiles})
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div
                    className="w-20 h-20 border rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                    onClick={() => handlePreviewClick(file, index)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div className="">
          <input
            type="file"
            id="multiFileInput"
            className="hidden"
            accept={acceptedTypes}
            multiple
            onChange={handleFileInputChange}
            disabled={selectedFiles.length >= maxFiles}
          />

          <label
            htmlFor="multiFileInput"
            className={`cursor-pointer rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3 ${
              selectedFiles.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="text-center flex justify-center">
              {selectedFiles.length === 0 && (
                <svg
                  width="57"
                  height="57"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="28.5" cy="28.5" r="28" fill="#F0F2F5" />
                  <path
                    d="M21.5013 25.5836C21.5013 22.0398 24.3741 19.167 27.918 19.167C31.0571 19.167 33.672 21.4223 34.2262 24.4014C34.3039 24.8192 34.6026 25.1616 35.0059 25.2954C37.3285 26.0657 39.0013 28.2558 39.0013 30.8336C39.0013 34.0553 36.3896 36.667 33.168 36.667C32.5236 36.667 32.0013 37.1893 32.0013 37.8336C32.0013 38.478 32.5236 39.0003 33.168 39.0003C37.6783 39.0003 41.3346 35.3439 41.3346 30.8336C41.3346 27.4591 39.2886 24.5651 36.372 23.3198C35.374 19.5846 31.9683 16.8336 27.918 16.8336C23.0855 16.8336 19.168 20.7511 19.168 25.5836C19.168 25.7006 19.1703 25.8171 19.1748 25.9331C17.0802 27.1416 15.668 29.4049 15.668 32.0003C15.668 35.8663 18.802 39.0003 22.668 39.0003C23.3123 39.0003 23.8346 38.478 23.8346 37.8336C23.8346 37.1893 23.3123 36.667 22.668 36.667C20.0906 36.667 18.0013 34.5776 18.0013 32.0003C18.0013 30.0667 19.1775 28.4052 20.8581 27.6972C21.3444 27.4924 21.6326 26.9866 21.561 26.4638C21.5217 26.1766 21.5013 25.8828 21.5013 25.5836Z"
                    fill="#475367"
                  />
                  <path
                    d="M27.7262 31.1283C28.1682 30.7354 28.8344 30.7354 29.2764 31.1283L31.0264 32.6839C31.508 33.1119 31.5514 33.8494 31.1233 34.3309C30.7488 34.7522 30.1376 34.8382 29.668 34.5665V40.167C29.668 40.8113 29.1456 41.3336 28.5013 41.3336C27.857 41.3336 27.3346 40.8113 27.3346 40.167V34.5665C26.8651 34.8382 26.2538 34.7522 25.8793 34.3309C25.4513 33.8494 25.4946 33.1119 25.9762 32.6839L27.7262 31.1283Z"
                    fill="#475367"
                  />
                </svg>
              )}
            </div>
            {selectedFiles.length > 0 ? (
              <div>
                <div className="flex justify-center">
                  <svg
                    width="57"
                    height="57"
                    viewBox="0 0 57 57"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="28.5" cy="28.5" r="28" fill="#E7F6EC" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M28.5 41.625C35.7487 41.625 41.625 35.7487 41.625 28.5C41.625 21.2513 35.7487 15.375 28.5 15.375C21.2513 15.375 15.375 21.2513 15.375 28.5C15.375 35.7487 21.2513 41.625 28.5 41.625ZM33.86 26.6588C34.4539 26.1148 34.4944 25.1923 33.9505 24.5984C33.4065 24.0044 32.484 23.9639 31.89 24.5079L26.5058 29.4391L25.11 28.1608C24.516 27.6168 23.5935 27.6573 23.0496 28.2513C22.5056 28.8452 22.5461 29.7677 23.14 30.3117L25.5208 32.4921C26.0782 33.0026 26.9333 33.0026 27.4907 32.4921L33.86 26.6588Z"
                      fill="#0F973D"
                    />
                  </svg>
                </div>
                <div className="pt-2">
                  {selectedFiles.length >= maxFiles 
                    ? `Maximum ${maxFiles} images selected` 
                    : `Add more images (${selectedFiles.length}/${maxFiles})`
                  }
                </div>
              </div>
            ) : (
              <div className="font-light text-sm">
                <span className="text-nrvPrimaryGreen font-medium">
                  Click to upload
                </span>{" "}
                <span className="font-medium text-nrvDarkGrey">
                  or drag and drop{" "}
                </span>
                <br></br> SVG, PNG, JPG or GIF (max. {maxFiles} images)
              </div>
            )}
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
              alt={`Preview ${overlayIndex + 1}`}
              className="w-full h-auto rounded-md shadow-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="bg-white text-black rounded-full px-3 py-1 text-sm">
                {overlayIndex + 1} of {selectedFiles.length}
              </span>
              <button
                className="bg-white text-black rounded-full p-2"
                onClick={closeOverlay}
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader; 