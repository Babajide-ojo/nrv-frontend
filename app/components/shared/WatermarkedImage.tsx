"use client";

import React, { useId } from "react";

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

/**
 * Diagonal repeating text watermark (full image coverage), similar to stock-photo protection.
 * Compact variant uses a denser tile for thumbnails / small cards.
 */
export default function WatermarkedImage({
  src,
  alt,
  watermarkText = "NaijaRentVerify",
  variant = "default",
  wrapperClassName = "",
  imageClassName = "",
  overlayClassName = "",
  onClick,
  onLoad,
  onError,
}: WatermarkedImageProps) {
  const uid = useId().replace(/:/g, "");
  const patternId = `nrv-wm-${uid}`;

  const tile =
    variant === "compact"
      ? { w: 200, h: 88, fontSize: 11, y1: 52, y2: 22, x2: 100 }
      : { w: 280, h: 112, fontSize: 14, y1: 68, y2: 28, x2: 140 };

  const fill = "rgba(255, 255, 255, 0.38)";

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
        className={`absolute inset-0 pointer-events-none z-10 select-none ${overlayClassName}`}
        aria-hidden
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
              width={tile.w}
              height={tile.h}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(-38)"
            >
              <text
                x="8"
                y={tile.y1}
                fill={fill}
                fontSize={tile.fontSize}
                fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
                fontWeight="600"
                letterSpacing="0.06em"
              >
                {watermarkText}
              </text>
              <text
                x={tile.x2}
                y={tile.y2}
                fill={fill}
                fontSize={tile.fontSize}
                fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
                fontWeight="600"
                letterSpacing="0.06em"
              >
                {watermarkText}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    </div>
  );
}
