'use client';

import { FC } from 'react';

interface ConfirmationModalProps {
  heading: string;
  message: string;
  subMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  heading,
  message,
  subMessage,
  onCancel,
  onConfirm,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl  w-full max-w-md shadow-xl">
 <div className='p-6'>
 <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
    <img src='/icons/SuccessIcon.svg' alt='success'/>
          </div>
          <h2 className="text-lg font-semibold">{heading}</h2>
        </div>
        <p className="text-gray-600 mb-2">{message}</p>
        {subMessage && <p className="text-sm text-gray-400">{subMessage}</p>}

 </div>
        <div className="flex justify-end gap-4 mt-6 bg-gray-100 p-6 rounded-bl-2xl rounded-br-2xl">
          <button
            onClick={onCancel}
            className="text-gray-600 font-medium hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={onConfirm}
            className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
