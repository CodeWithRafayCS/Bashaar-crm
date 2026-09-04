"use client";

import { forwardRef, ReactNode } from "react";

export type BadgeVariant = 
  | "default"
  | "gold"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "pink"
  | "gray"
  | "outline";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
  dot?: boolean;
  rounded?: boolean;
  onClick?: () => void;
}

const VARIANTS = {
  default: {
    bg: "rgba(255, 255, 255, 0.04)",
    text: "rgba(255, 255, 255, 0.4)",
    border: "rgba(255, 255, 255, 0.04)",
    dot: "rgba(255, 255, 255, 0.2)",
  },
  gold: {
    bg: "rgba(244, 197, 66, 0.06)",
    text: "#f4c542",
    border: "rgba(244, 197, 66, 0.08)",
    dot: "#f4c542",
  },
  success: {
    bg: "rgba(0, 200, 83, 0.06)",
    text: "#00c853",
    border: "rgba(0, 200, 83, 0.08)",
    dot: "#00c853",
  },
  warning: {
    bg: "rgba(255, 193, 7, 0.06)",
    text: "#ffc107",
    border: "rgba(255, 193, 7, 0.08)",
    dot: "#ffc107",
  },
  error: {
    bg: "rgba(255, 68, 68, 0.06)",
    text: "#ff4444",
    border: "rgba(255, 68, 68, 0.08)",
    dot: "#ff4444",
  },
  info: {
    bg: "rgba(66, 133, 244, 0.06)",
    text: "#4285f4",
    border: "rgba(66, 133, 244, 0.08)",
    dot: "#4285f4",
  },
  purple: {
    bg: "rgba(156, 39, 176, 0.06)",
    text: "#9c27b0",
    border: "rgba(156, 39, 176, 0.08)",
    dot: "#9c27b0",
  },
  pink: {
    bg: "rgba(233, 30, 99, 0.06)",
    text: "#e91e63",
    border: "rgba(233, 30, 99, 0.08)",
    dot: "#e91e63",
  },
  gray: {
    bg: "rgba(255, 255, 255, 0.02)",
    text: "rgba(255, 255, 255, 0.15)",
    border: "rgba(255, 255, 255, 0.04)",
    dot: "rgba(255, 255, 255, 0.1)",
  },
  outline: {
    bg: "transparent",
    text: "rgba(255, 255, 255, 0.3)",
    border: "rgba(255, 255, 255, 0.06)",
    dot: "rgba(255, 255, 255, 0.1)",
  },
};

const SIZE_CLASSES = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3.5 py-1 text-sm",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      className = "",
      icon,
      dot = false,
      rounded = false,
      onClick,
    },
    ref
  ) => {
    const variantStyles = VARIANTS[variant];
    const sizeClasses = SIZE_CLASSES[size];

    return (
      <span
        ref={ref}
        className={`badge ${sizeClasses} ${rounded ? "rounded-full" : "rounded"} ${className}`}
        style={{
          background: variantStyles.bg,
          color: variantStyles.text,
          borderColor: variantStyles.border,
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {/* Dot */}
        {dot && (
          <span
            className="badge-dot"
            style={{ background: variantStyles.dot }}
          />
        )}

        {/* Icon */}
        {icon && (
          <span className="badge-icon">{icon}</span>
        )}

        {/* Label */}
        <span className="badge-label">{children}</span>

        <style jsx>{`
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            font-weight: 500;
            border: 1px solid;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            white-space: nowrap;
          }

          .badge:hover {
            transform: ${onClick ? "scale(1.05)" : "none"};
          }

          .badge:active {
            transform: ${onClick ? "scale(0.95)" : "none"};
          }

          .badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .badge-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            flex-shrink: 0;
          }

          .badge-icon svg {
            width: ${size === "sm" ? "12px" : size === "lg" ? "16px" : "14px"};
            height: ${size === "sm" ? "12px" : size === "lg" ? "16px" : "14px"};
          }

          .badge-label {
            line-height: 1;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .badge {
              font-size: 0.6rem;
              padding: 0.1rem 0.4rem;
            }

            .badge-dot {
              width: 4px;
              height: 4px;
            }

            .badge-icon svg {
              width: 10px;
              height: 10px;
            }
          }
        `}</style>
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;