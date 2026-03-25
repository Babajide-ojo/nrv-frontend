"use client";

import React from "react";

type WatermarkedImageProps = {
  src: string;
  alt: string;
  watermarkText?: string;
  variant?: "default" | "compact";
  wrapperClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

export default function WatermarkedImage({
  src,
  alt,
  watermarkText = "Naijarentverify",
  variant = "default",
  wrapperClassName = "",
  imageClassName = "",
  overlayClassName = "",
  onClick,
  onLoad,
  onError,
}: WatermarkedImageProps) {
  const watermarkClasses =
    variant === "compact"
      ? "text-[16px] sm:text-[20px] px-4 py-2"
      : "text-[28px] sm:text-[38px] md:text-[48px] px-8 py-4";

  return (
    <div
      className={`relative overflow-hidden ${wrapperClassName}`}
      aria-hidden={false}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imageClassName}`}
        onClick={onClick}
        onLoad={onLoad}
        onError={onError}
      />
      <div
        className={`absolute inset-0 pointer-events-none flex items-center justify-center z-10 ${overlayClassName}`}
      >
        <div
          className={`rotate-[-30deg] font-extrabold tracking-widest text-white/45 bg-black/20 border border-white/15 ${watermarkClasses} whitespace-nowrap rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.2)]`}
        >
          {watermarkText}
        </div>
      </div>
    </div>
  );
}
