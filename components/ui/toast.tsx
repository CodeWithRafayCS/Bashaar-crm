"use client";

import { ReactNode, useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const ICONS = {
  success: <CheckCircle className="toast-icon" />,
  error: <AlertCircle className="toast-icon" />,
  warning: <AlertTriangle className="toast-icon" />,
  info: <Info className="toast-icon" />,
};

const COLORS = {
  success: {
    bg: "rgba(0, 200, 83, 0.04)",
    border: "rgba(0, 200, 83, 0.08)",
    text: "#00c853",
    iconBg: "rgba(0, 200, 83, 0.06)",
  },
  error: {
    bg: "rgba(255, 68, 68, 0.04)",
    border: "rgba(255, 68, 68, 0.08)",
    text: "#ff4444",
    iconBg: "rgba(255, 68, 68, 0.06)",
  },
  warning: {
    bg: "rgba(255, 193, 7, 0.04)",
    border: "rgba(255, 193, 7, 0.08)",
    text: "#ffc107",
    iconBg: "rgba(255, 193, 7, 0.06)",
  },
  info: {
    bg: "rgba(66, 133, 244, 0.04)",
    border: "rgba(66, 133, 244, 0.08)",
    text: "#4285f4",
    iconBg: "rgba(66, 133, 244, 0.06)",
  },
};

export function Toast({
  open: controlledOpen,
  onOpenChange,
  variant = "info",
  title,
  description,
  duration = 4000,
  action,
  className = "",
  children,
}: ToastProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsOpen = (open: boolean) => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }
  };

  const colors = COLORS[variant];
  const Icon = ICONS[variant];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`toast ${isExiting ? "exiting" : ""} ${className}`}
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon-wrapper" style={{ background: colors.iconBg, color: colors.text }}>
        {Icon}
      </div>

      <div className="toast-content">
        {title && <div className="toast-title" style={{ color: colors.text }}>{title}</div>}
        <div className="toast-description">
          {description || children}
        </div>
      </div>

      {action && (
        <button
          type="button"
          className="toast-action"
          style={{ color: colors.text }}
          onClick={() => {
            action.onClick();
            handleClose();
          }}
        >
          {action.label}
        </button>
      )}

      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      <div
        className="toast-progress"
        style={{
          background: colors.text,
          animationDuration: `${duration}ms`,
        }}
      />

      <style jsx>{`
        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid;
          border-radius: 12px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5);
          min-width: 320px;
          max-width: 480px;
          position: relative;
          overflow: hidden;
          animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast.exiting {
          animation: toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(calc(100% + 24px));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes toastOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(calc(100% + 24px));
          }
        }

        .toast-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .toast-icon {
          width: 18px;
          height: 18px;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.05rem;
        }

        .toast-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.4;
          word-break: break-word;
        }

        .toast-description :global(p) {
          margin: 0;
        }

        .toast-action {
          padding: 0.2rem 0.6rem;
          border: 1px solid currentColor;
          background: transparent;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          flex-shrink: 0;
          opacity: 0.7;
          margin-top: 0.1rem;
        }

        .toast-action:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.04);
        }

        .toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 6px;
          flex-shrink: 0;
          padding: 0;
          margin-top: -0.2rem;
          margin-right: -0.4rem;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          transform-origin: left;
          animation: progress linear forwards;
          opacity: 0.2;
        }

        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        @media (max-width: 480px) {
          .toast {
            min-width: unset;
            width: calc(100vw - 2rem);
            padding: 0.6rem 0.75rem;
            border-radius: 10px;
          }

          .toast-icon-wrapper {
            width: 28px;
            height: 28px;
          }

          .toast-icon {
            width: 14px;
            height: 14px;
          }

          .toast-title {
            font-size: 0.8rem;
          }

          .toast-description {
            font-size: 0.75rem;
          }

          .toast-action {
            font-size: 0.65rem;
            padding: 0.15rem 0.5rem;
          }

          .toast-close {
            width: 24px;
            height: 24px;
          }

          .toast-close svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default Toast;