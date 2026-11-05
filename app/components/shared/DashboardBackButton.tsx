"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

type DashboardBackButtonProps = {
  fallbackHref?: string;
  className?: string;
};

const DashboardBackButton = ({
  fallbackHref = "/dashboard/landlord",
  className = "",
}: DashboardBackButtonProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 touch-manipulation ${className}`}
      aria-label="Go back"
    >
      <IoArrowBack size={18} aria-hidden />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
};

export default DashboardBackButton;
