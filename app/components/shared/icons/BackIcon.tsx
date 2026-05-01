"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

interface BackIconProps {
  width?: number;
  height?: number;
  color?: string;
  onClick?: () => void;
}

const BackIcon: React.FC<BackIconProps> = ({
  width = 20,
  height = 20,
  color = "#333333",
  onClick,
}) => {
  const router = useRouter();

  // Handle click if onClick prop is not provided
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <div
      className="cursor-pointer"
      onClick={handleClick}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <IoArrowBack
        style={{ width: `${width}px`, height: `${height}px`, color }}
      />
    </div>
  );
};

export default BackIcon;
