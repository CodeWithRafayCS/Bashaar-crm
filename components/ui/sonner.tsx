"use client";

import { ReactNode, useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
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

export interface SonnerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
  richColors?: boolean;
  expand?: boolean;
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

function ToastItem({
  toast,
  onClose,
  richColors = true,
  expand = false,
}: {
  toast: Toast;
  onClose: (id: string) => void;
  richColors?: boolean;
  expand?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const colors = COLORS[toast.type];
  const Icon = ICONS[toast.type];

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

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
      className={`sonner-toast ${isVisible ? "visible" : ""} ${isExiting ? "exiting" : ""} ${expand ? "expand" : ""}`}
      style={{
        background: richColors ? colors.bg : "rgba(20, 20, 20, 0.9)",
        borderColor: richColors ? colors.border : "rgba(255, 255, 255, 0.04)",
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className="sonner-icon"
        style={{
          color: richColors ? colors.text : "rgba(255,255,255,0.2)",
          background: richColors ? colors.iconBg : "rgba(255,255,255,0.02)",
        }}
      >
        {Icon}
      </div>

      {/* Content */}
      <div className="sonner-content">
        {toast.title && (
          <div className="sonner-title" style={{ color: richColors ? colors.text : "rgba(255,255,255,0.6)" }}>
            {toast.title}
          </div>
        )}
        <div className="sonner-message">{toast.message}</div>
      </div>

      {/* Action */}
      {toast.action && (
        <button
          type="button"
          className="sonner-action"
          style={{ color: richColors ? colors.text : "rgba(255,255,255,0.3)" }}
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
        className="sonner-close"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className="sonner-progress"
        style={{
          background: richColors ? colors.text : "rgba(255,255,255,0.05)",
          animationDuration: `${toast.duration || 4000}ms`,
        }}
      />

      <style jsx>{`
        .sonner-toast {
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
          transform: translateX(calc(100% + 24px));
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sonner-toast.visible {
          transform: translateX(0);
          opacity: 1;
        }

        .sonner-toast.exiting {
          transform: translateX(calc(100% + 24px));
          opacity: 0;
        }

        .sonner-toast.expand {
          min-width: 400px;
          max-width: 600px;
        }

        /* Icon */
        .sonner-icon {
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

        /* Content */
        .sonner-content {
          flex: 1;
          min-width: 0;
        }

        .sonner-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.05rem;
        }

        .sonner-message {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.4;
          word-break: break-word;
        }

        /* Action */
        .sonner-action {
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

        .sonner-action:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Close */
        .sonner-close {
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

        .sonner-close:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        /* Progress */
        .sonner-progress {
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
          .sonner-toast {
            min-width: unset;
            width: calc(100vw - 2rem);
            padding: 0.6rem 0.75rem;
            border-radius: 10px;
          }

          .sonner-toast.expand {
            min-width: unset;
            max-width: 100%;
          }

          .sonner-icon {
            width: 28px;
            height: 28px;
          }

          .toast-icon {
            width: 14px;
            height: 14px;
          }

          .sonner-title {
            font-size: 0.8rem;
          }

          .sonner-message {
            font-size: 0.75rem;
          }

          .sonner-action {
            font-size: 0.65rem;
            padding: 0.15rem 0.5rem;
          }

          .sonner-close {
            width: 24px;
            height: 24px;
          }

          .sonner-close svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export function Sonner({
  toasts,
  onClose,
  position = "top-right",
  className = "",
  richColors = true,
  expand = false,
}: SonnerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={`sonner-container fixed z-[9999] flex flex-col gap-2 pointer-events-none ${positionClasses[position]} ${className}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onClose={onClose}
            richColors={richColors}
            expand={expand}
          />
        </div>
      ))}

      <style jsx>{`
        .sonner-container {
          max-width: 100vw;
          padding: 0.5rem;
        }

        @media (max-width: 480px) {
          .sonner-container {
            top: 0.5rem !important;
            right: 0.5rem !important;
            left: 0.5rem !important;
            bottom: auto !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Sonner;