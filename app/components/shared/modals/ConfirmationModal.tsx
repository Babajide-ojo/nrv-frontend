"use client";

import { FC } from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  heading: string;
  message: string;
  subMessage?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
  tone?: "default" | "warning";
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  heading,
  message,
  subMessage,
  onCancel,
  onConfirm,
  isOpen,
  confirmLabel = "Save Changes",
  cancelLabel = "Cancel",
  confirmLoading = false,
  tone = "default",
}) => {
  if (!isOpen) {
    return null;
  }

  const isWarning = tone === "warning";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isWarning ? "bg-amber-100" : "bg-[#E7F6EC]"
              }`}
            >
              {isWarning ? (
                <AlertTriangle className="h-5 w-5 text-amber-700" aria-hidden />
              ) : (
                <img
                  src="/icons/SuccessIcon.svg"
                  alt=""
                  className="h-5 w-5"
                />
              )}
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
            disabled={confirmLoading}
            className="order-2 rounded-full px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200/60 hover:text-gray-900 disabled:opacity-60 sm:order-1"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmLoading}
            className={`order-1 min-h-[44px] rounded-full border-0 px-6 py-2.5 text-sm font-semibold text-white shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 sm:order-2 ${
              isWarning
                ? "bg-amber-700 hover:bg-amber-800 focus-visible:ring-amber-700"
                : "bg-[#03442C] hover:bg-[#022f21] focus-visible:ring-[#03442C]"
            }`}
          >
            {confirmLoading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
