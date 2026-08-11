"use client";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  light?: boolean;
};

const sizeClass: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

const getInitials = (name?: string | null): string => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

export const UserAvatar = ({
  src,
  name,
  size = "sm",
  className,
  light = false,
}: UserAvatarProps) => {
  const initials = getInitials(name);
  const hasImage = Boolean(src && String(src).trim());

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        sizeClass[size],
        light
          ? "bg-white/20 text-white ring-1 ring-white/30"
          : "bg-[#03442C] text-white",
        className,
      )}
      aria-hidden={!hasImage}
    >
      {hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={String(src)}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-semibold">
          {initials}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;
