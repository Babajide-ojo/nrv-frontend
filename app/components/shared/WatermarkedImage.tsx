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
      ? "text-[10px] sm:text-[12px] px-2 py-1"
      : "text-[11px] sm:text-[13px] px-2.5 py-1.5";

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
        className={`absolute inset-0 pointer-events-none flex items-end justify-start p-2 z-10 ${overlayClassName}`}
      >
        <div
          className={`font-semibold tracking-wide text-white/90 bg-black/55 border border-white/25 ${watermarkClasses} whitespace-nowrap rounded-md shadow-[0_6px_18px_rgba(0,0,0,0.35)]`}
        >
          {watermarkText}
        </div>
      </div>
    </div>
  );
}

