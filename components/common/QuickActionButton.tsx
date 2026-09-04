"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "gold" | "dark" | "ghost" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  shortcut?: string;
  badge?: number | string;
  active?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export function QuickActionButton({
  icon,
  label,
  variant = "dark",
  size = "md",
  fullWidth = false,
  shortcut,
  badge,
  active = false,
  loading = false,
  tooltip,
  className,
  disabled,
  onClick,
  ...props
}: QuickActionButtonProps) {
  const variantClasses = {
    gold: "bg-gradient-gold text-matte-black hover:shadow-gold border border-gold/20",
    dark: "bg-white/5 text-white/70 hover:bg-white/10 border border-white/5",
    ghost: "bg-transparent text-white/30 hover:bg-white/5 border border-transparent hover:border-white/5",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/10",
    success: "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/10",
    warning: "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/10",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5 min-h-[32px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-base gap-2.5 min-h-[48px]",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const badgeSizes = {
    sm: "text-[9px] min-w-[16px] h-[16px]",
    md: "text-[10px] min-w-[18px] h-[18px]",
    lg: "text-[11px] min-w-[20px] h-[20px]",
  };

  return (
    <button
      className={cn(
        "quick-action-btn relative inline-flex items-center justify-center rounded-lg transition-all duration-300 font-medium",
        "hover:translate-y-[-2px] active:scale-[0.97] active:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-matte-black",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        active && "ring-2 ring-gold/40 ring-offset-2 ring-offset-matte-black",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      title={tooltip || label}
      {...props}
    >
      {/* Loading Spinner */}
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="spinner" />
          {label}
        </span>
      ) : (
        <>
          {/* Icon */}
          <span className={`icon-wrapper ${iconSizes[size]} flex-shrink-0`}>
            {icon}
          </span>

          {/* Label */}
          <span className="label truncate">{label}</span>

          {/* Shortcut */}
          {shortcut && (
            <span className="shortcut hidden sm:inline-block text-[10px] opacity-30 font-mono">
              {shortcut}
            </span>
          )}

          {/* Badge */}
          {badge !== undefined && badge !== null && badge !== 0 && (
            <span className={`badge ${badgeSizes[size]} flex items-center justify-center rounded-full bg-gold text-matte-black font-bold`}>
              {badge}
            </span>
          )}
        </>
      )}

      <style jsx>{`
        .quick-action-btn {
          position: relative;
          overflow: hidden;
        }

        /* Glow effect on hover */
        .quick-action-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(244, 197, 66, 0.06) 0%, 
            transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .quick-action-btn:hover::after {
          opacity: 1;
        }

        .quick-action-btn.bg-gradient-gold::after {
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(255, 255, 255, 0.15) 0%, 
            transparent 60%);
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .bg-gradient-gold .spinner {
          border-color: rgba(0, 0, 0, 0.1);
          border-top-color: #0a0a0a;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Icon */
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper svg {
          width: 100%;
          height: 100%;
        }

        /* Badge */
        .badge {
          padding: 0 4px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
        }

        /* Shortcut */
        .shortcut {
          font-family: 'JetBrains Mono', monospace;
        }

        /* Tooltip fallback */
        [title] {
          position: relative;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .quick-action-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
          }

          .shortcut {
            display: none !important;
          }
        }
      `}</style>
    </button>
  );
}