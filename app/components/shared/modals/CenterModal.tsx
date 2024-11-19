import React from "react";

interface CenterModalProps {
  isOpen: boolean;
  bgColor?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  twidth?: string;
  height?: string;
}

const CenterModal: React.FC<CenterModalProps> = ({
  isOpen,
  bgColor,
  onClose,
  children,
  width,
  twidth,
  height,
}) => {
  if (!isOpen) return null;
  const modalStyles = {
    width: width || "90%",
    minWidth: "300px",
  };
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 z-[110]">
      <div
        style={modalStyles}
        className={`${
          bgColor ? bgColor : "bg-white"
        } overflow-hidden rounded-2xl shadow-md" style={modalStyles} ${
          height && height
        } m-8 p-4 ${!width ? twidth || "max-w-xl w-full" : ""} `}
      >
        {children}
      </div>
    </div>
  );
};

export default CenterModal;
