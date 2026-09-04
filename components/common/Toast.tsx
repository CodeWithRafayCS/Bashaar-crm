"use client";

import { ReactNode, useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: {
    bg: "rgba(0, 200, 83, 0.08)",
    border: "rgba(0, 200, 83, 0.12)",
    text: "#00c853",
    iconBg: "rgba(0, 200, 83, 0.12)",
  },
  error: {
    bg: "rgba(255, 68, 68, 0.08)",
    border: "rgba(255, 68, 68, 0.12)",
    text: "#ff4444",
    iconBg: "rgba(255, 68, 68, 0.12)",
  },
  warning: {
    bg: "rgba(255, 193, 7, 0.08)",
    border: "rgba(255, 193, 7, 0.12)",
    text: "#ffc107",
    iconBg: "rgba(255, 193, 7, 0.12)",
  },
  info: {
    bg: "rgba(66, 133, 244, 0.08)",
    border: "rgba(66, 133, 244, 0.12)",
    text: "#4285f4",
    iconBg: "rgba(66, 133, 244, 0.12)",
  },
};

export function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = ICONS[toast.type];
  const colors = COLORS[toast.type];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto dismiss
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300);
  };

  return (
    <div
      className={`toast-wrapper ${isVisible ? "visible" : ""} ${isExiting ? "exiting" : ""}`}
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className="toast-icon"
        style={{
          background: colors.iconBg,
          color: colors.text,
        }}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="toast-content">
        {toast.title && (
          <div className="toast-title" style={{ color: colors.text }}>
            {toast.title}
          </div>
        )}
        <div className="toast-message">{toast.message}</div>
      </div>

      {/* Action Button */}
      {toast.action && (
        <button
          type="button"
          className="toast-action"
          style={{ color: colors.text }}
          onClick={() => {
            toast.action?.onClick();
            handleClose();
          }}
        >
          {toast.action.label}
        </button>
      )}

      {/* Close Button */}
      <button
        type="button"
        className="toast-close"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className="toast-progress"
        style={{
          background: colors.text,
          animationDuration: `${toast.duration || 4000}ms`,
        }}
      />

      <style jsx>{`
        .toast-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 1px solid;
          border-radius: 12px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(20, 20, 20, 0.9);
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5);
          min-width: 320px;
          max-width: 480px;
          position: relative;
          overflow: hidden;
          transform: translateX(calc(100% + 24px));
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-wrapper.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .toast-wrapper.exiting {
          transform: translateX(calc(100% + 24px));
          opacity: 0;
        }

        /* Icon */
        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        /* Content */
        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
        }

        .toast-message {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.4;
          word-break: break-word;
        }

        /* Action */
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

        /* Close */
        .toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.15);
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
          color: rgba(255, 255, 255, 0.4);
        }

        /* Progress Bar */
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

        /* Responsive */
        @media (max-width: 480px) {
          .toast-wrapper {
            min-width: unset;
            width: calc(100vw - 2rem);
            padding: 0.6rem 0.75rem;
            border-radius: 10px;
          }

          .toast-icon {
            width: 28px;
            height: 28px;
          }

          .toast-icon svg {
            width: 16px;
            height: 16px;
          }

          .toast-title {
            font-size: 0.8rem;
          }

          .toast-message {
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