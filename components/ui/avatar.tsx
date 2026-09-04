"use client";

import React, { ReactNode } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: AvatarStatus;
  size?: AvatarSize;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const SIZE_MAP: Record<AvatarSize, { size: string; text: string; dot: string }> = {
  xs: { size: "w-6 h-6", text: "text-[10px]", dot: "w-1.5 h-1.5" },
  sm: { size: "w-8 h-8", text: "text-xs", dot: "w-2 h-2" },
  md: { size: "w-10 h-10", text: "text-sm", dot: "w-2.5 h-2.5" },
  lg: { size: "w-12 h-12", text: "text-base", dot: "w-3 h-3" },
  xl: { size: "w-16 h-16", text: "text-xl", dot: "w-3.5 h-3.5" },
  "2xl": { size: "w-20 h-20", text: "text-2xl", dot: "w-4 h-4" },
};

const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  busy: "bg-rose-500",
  away: "bg-amber-500",
  offline: "bg-zinc-500",
};

export function Avatar({
  src,
  alt = "",
  fallback,
  status,
  size = "md",
  onClick,
  children,
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayText = fallback || (alt ? getInitials(alt) : "");
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium select-none ${sizeConfig.size} ${sizeConfig.text} ${
        onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children ? (
        children
      ) : src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-semibold">{displayText || "?"}</span>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-neutral-900 ${sizeConfig.dot} ${STATUS_COLOR[status]}`}
        />
      )}
    </div>
  );
}

export default Avatar;