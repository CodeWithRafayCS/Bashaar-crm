"use client";

import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = 
  | "gold"
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "outline";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  asChild?: boolean;
}

const VARIANTS: Record<ButtonVariant, { bg: string; hover: string; text: string; border: string }> = {
  gold: {
    bg: "linear-gradient(135deg, #f4c542, #d4a030)",
    hover: "linear-gradient(135deg, #f5c95a, #d4a030)",
    text: "#0a0a0a",
    border: "transparent",
  },
  primary: {
    bg: "rgba(66, 133, 244, 0.06)",
    hover: "rgba(66, 133, 244, 0.1)",
    text: "#4285f4",
    border: "rgba(66, 133, 244, 0.08)",
  },
  secondary: {
    bg: "rgba(255, 255, 255, 0.04)",
    hover: "rgba(255, 255, 255, 0.08)",
    text: "rgba(255, 255, 255, 0.5)",
    border: "rgba(255, 255, 255, 0.04)",
  },
  ghost: {
    bg: "transparent",
    hover: "rgba(255, 255, 255, 0.04)",
    text: "rgba(255, 255, 255, 0.3)",
    border: "transparent",
  },
  danger: {
    bg: "rgba(255, 68, 68, 0.06)",
    hover: "rgba(255, 68, 68, 0.1)",
    text: "#ff4444",
    border: "rgba(255, 68, 68, 0.08)",
  },
  success: {
    bg: "rgba(0, 200, 83, 0.06)",
    hover: "rgba(0, 200, 83, 0.1)",
    text: "#00c853",
    border: "rgba(0, 200, 83, 0.08)",
  },
  warning: {
    bg: "rgba(255, 193, 7, 0.06)",
    hover: "rgba(255, 193, 7, 0.1)",
    text: "#ffc107",
    border: "rgba(255, 193, 7, 0.08)",
  },
  outline: {
    bg: "transparent",
    hover: "rgba(255, 255, 255, 0.04)",
    text: "rgba(255, 255, 255, 0.5)",
    border: "rgba(255, 255, 255, 0.06)",
  },
};

const SIZES: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs min-h-[28px]",
  sm: "px-3 py-1.5 text-sm min-h-[32px]",
  md: "px-4 py-2 text-sm min-h-[40px]",
  lg: "px-6 py-2.5 text-base min-h-[48px]",
  xl: "px-8 py-3 text-lg min-h-[56px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "secondary",
      size = "md",
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      className = "",
      disabled,
      type = "button",
      onClick,
      ...props
    },
    ref
  ) => {
    const variantStyles = VARIANTS[variant];
    const sizeClasses = SIZES[size];

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        className={`btn ${sizeClasses} ${fullWidth ? "w-full" : ""} ${className}`}
        style={{
          background: variantStyles.bg,
          color: variantStyles.text,
          borderColor: variantStyles.border,
          borderStyle: "solid",
          borderWidth: variant === "ghost" || variant === "outline" ? "1px" : "0px",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        disabled={isDisabled}
        onClick={onClick}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Loader2 className="btn-loader" />
        )}

        {/* Left Icon */}
        {!loading && icon && (
          <span className="btn-icon-left">{icon}</span>
        )}

        {/* Children */}
        <span className="btn-label">{children}</span>

        {/* Right Icon */}
        {!loading && iconRight && (
          <span className="btn-icon-right">{iconRight}</span>
        )}

        <style jsx>{`
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            font-weight: 500;
            font-family: inherit;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
            user-select: none;
            white-space: nowrap;
          }

          .btn:not(:disabled):hover {
            background: ${variantStyles.hover};
            transform: translateY(-2px);
            box-shadow: ${variant === "gold" ? "0 8px 30px rgba(244, 197, 66, 0.3)" : "0 4px 20px rgba(0,0,0,0.1)"};
          }

          .btn:not(:disabled):active {
            transform: scale(0.97);
          }

          .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none !important;
          }

          /* Gold variant special shadow */
          .btn[style*="background: linear-gradient"]:not(:disabled):hover {
            box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
          }

          /* Loading state */
          .btn-loader {
            width: ${size === "xs" ? "14px" : size === "sm" ? "16px" : size === "lg" ? "20px" : "18px"};
            height: ${size === "xs" ? "14px" : size === "sm" ? "16px" : size === "lg" ? "20px" : "18px"};
            animation: spin 0.7s linear infinite;
            flex-shrink: 0;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .btn-icon-left,
          .btn-icon-right {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            line-height: 1;
          }

          .btn-icon-left svg,
          .btn-icon-right svg {
            width: ${size === "xs" ? "14px" : size === "sm" ? "16px" : size === "lg" ? "20px" : "18px"};
            height: ${size === "xs" ? "14px" : size === "sm" ? "16px" : size === "lg" ? "20px" : "18px"};
          }

          .btn-label {
            display: inline-flex;
            align-items: center;
            gap: 0.2rem;
          }

          /* Gold variant text color override */
          .btn[style*="background: linear-gradient"] .btn-label {
            color: #0a0a0a;
          }

          .btn[style*="background: linear-gradient"]:disabled .btn-label {
            color: rgba(10, 10, 10, 0.4);
          }

          /* Responsive */
          @media (max-width: 480px) {
            .btn {
              font-size: 0.8rem;
              padding: 0.3rem 0.8rem;
              min-height: 32px;
            }

            .btn-icon-left svg,
            .btn-icon-right svg {
              width: 14px;
              height: 14px;
            }

            .btn-loader {
              width: 14px;
              height: 14px;
            }
          }
        `}</style>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;