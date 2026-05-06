"use client";

import { FC } from "react";

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
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F6EC]">
              <img
                src="/icons/SuccessIcon.svg"
                alt=""
                className="h-5 w-5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="confirmation-modal-title"
                className="text-lg font-semibold text-[#101828]"
              >
                {heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {message}
              </p>
              {subMessage ? (
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {subMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="order-2 rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200/60 hover:text-gray-900 sm:order-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="order-1 min-h-[44px] rounded-full border-0 bg-[#03442C] px-6 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition hover:bg-[#022f21] focus-visible:ring-2 focus-visible:ring-[#03442C] focus-visible:ring-offset-2 sm:order-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
