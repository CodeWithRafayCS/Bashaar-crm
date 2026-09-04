"use client";

import { ReactNode, forwardRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  icon?: ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  compact?: boolean;
}

const ICONS = {
  info: <Info className="alert-icon" />,
  success: <CheckCircle className="alert-icon" />,
  warning: <AlertTriangle className="alert-icon" />,
  error: <XCircle className="alert-icon" />,
};

const VARIANTS = {
  info: {
    bg: "rgba(66, 133, 244, 0.04)",
    border: "rgba(66, 133, 244, 0.08)",
    text: "#4285f4",
    iconBg: "rgba(66, 133, 244, 0.06)",
  },
  success: {
    bg: "rgba(0, 200, 83, 0.04)",
    border: "rgba(0, 200, 83, 0.08)",
    text: "#00c853",
    iconBg: "rgba(0, 200, 83, 0.06)",
  },
  warning: {
    bg: "rgba(255, 193, 7, 0.04)",
    border: "rgba(255, 193, 7, 0.08)",
    text: "#ffc107",
    iconBg: "rgba(255, 193, 7, 0.06)",
  },
  error: {
    bg: "rgba(255, 68, 68, 0.04)",
    border: "rgba(255, 68, 68, 0.08)",
    text: "#ff4444",
    iconBg: "rgba(255, 68, 68, 0.06)",
  },
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      children,
      variant = "info",
      title,
      icon,
      className = "",
      dismissible = false,
      onDismiss,
      compact = false,
    },
    ref
  ) => {
    const variantStyles = VARIANTS[variant];
    const defaultIcon = ICONS[variant];

    return (
      <div
        ref={ref}
        className={`alert ${compact ? "compact" : ""} ${className}`}
        style={{
          background: variantStyles.bg,
          borderColor: variantStyles.border,
        }}
        role="alert"
      >
        <div className="alert-icon-wrapper" style={{ color: variantStyles.text }}>
          {icon || defaultIcon}
        </div>

        <div className="alert-content">
          {title && <div className="alert-title" style={{ color: variantStyles.text }}>{title}</div>}
          <div className="alert-message">{children}</div>
        </div>

        {dismissible && onDismiss && (
          <button
            type="button"
            className="alert-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <style jsx>{`
          .alert {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            border: 1px solid;
            border-radius: 10px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s;
            width: 100%;
          }

          .alert.compact {
            padding: 0.5rem 0.75rem;
            gap: 0.5rem;
          }

          .alert.compact .alert-icon-wrapper {
            width: 20px;
            height: 20px;
          }

          .alert.compact .alert-icon {
            width: 14px;
            height: 14px;
          }

          .alert.compact .alert-title {
            font-size: 0.75rem;
          }

          .alert.compact .alert-message {
            font-size: 0.7rem;
          }

          .alert-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 6px;
            flex-shrink: 0;
            background: var(--icon-bg, transparent);
          }

          .alert-icon {
            width: 16px;
            height: 16px;
          }

          .alert-content {
            flex: 1;
            min-width: 0;
          }

          .alert-title {
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 0.1rem;
          }

          .alert-message {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.4);
            line-height: 1.5;
          }

          .alert-message :global(p) {
            margin: 0;
          }

          .alert-message :global(ul),
          .alert-message :global(ol) {
            margin: 0.2rem 0;
            padding-left: 1.2rem;
          }

          .alert-message :global(li) {
            margin: 0.1rem 0;
          }

          .alert-dismiss {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border: none;
            background: transparent;
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: all 0.3s;
            flex-shrink: 0;
            font-family: inherit;
          }

          .alert-dismiss:hover {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.4);
          }

          .alert.compact .alert-dismiss {
            width: 22px;
            height: 22px;
          }

          .alert.compact .alert-dismiss svg {
            width: 14px;
            height: 14px;
          }

          /* Animation */
          .alert {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive */
          @media (max-width: 480px) {
            .alert {
              padding: 0.5rem 0.75rem;
              gap: 0.5rem;
            }

            .alert-icon-wrapper {
              width: 20px;
              height: 20px;
            }

            .alert-icon {
              width: 14px;
              height: 14px;
            }

            .alert-title {
              font-size: 0.75rem;
            }

            .alert-message {
              font-size: 0.7rem;
            }

            .alert-dismiss {
              width: 24px;
              height: 24px;
            }

            .alert-dismiss svg {
              width: 14px;
              height: 14px;
            }
          }
        `}</style>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;