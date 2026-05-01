import React from "react";
import { MdDelete } from "react-icons/md";
import { SlCloudUpload } from "react-icons/sl";

interface FileUploaderProps {
  file: File | null | any;
  onFileChange: (file: File | null) => void;
  label?: string;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileChange,
  label = "Click to upload",
  accept = ".png, .jpg, .jpeg, .pdf",
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]); 
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null); 
  };

  return (
    <div className="text-center w-full mt-2">
      <div className="w-full border border-nrvLightGrey rounded-lg text-swBlack">
        <div className="text-center">
          {file ? (
            <div className="m-2 flex items-center justify-between py-1.5 px-2 bg-white border-b rounded-md border-gray-200 transition-all duration-200 hover:bg-gray-100">
              <span className="text-nrvLightGrey font-light text-xs">
                {file.name}
              </span>
              <button
                className="text-red-500 hover:text-red-700 transition duration-200"
                onClick={handleRemoveFile}
              >
                <MdDelete size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
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
          id="fileInput"
          className="hidden"
          accept={accept}
          onChange={handleFileInputChange}
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer p-1 rounded-md bg-swBlue text-nrvLightGrey font-light mx-auto mt-5 mb-3"
        >
          <div>{file ? "Replace file" : label}</div>
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
