import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  bgColor?: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: string; // Custom width for the modal
  height?: string; // Custom height for the modal
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  bgColor,
  onClose,
  children,
  width,
  height,
}) => {
  useEffect(() => {
    // Close modal on escape key press
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-50 z-[110] overflow-hidden"
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${bgColor ? bgColor : "bg-white"} ${
          width ? `w-[${width}]` : "md:w-1/2 w-full"
        } ${height ? `h-[${height}]` : "h-full"} overflow-auto shadow-md`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on modal from closing it
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
