"use client";

import { ReactNode } from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "gold" | "white" | "muted";
  label?: string;
  fullPage?: boolean;
  className?: string;
  children?: ReactNode;
}

export function LoadingSpinner({
  size = "md",
  color = "gold",
  label,
  fullPage = false,
  className = "",
  children,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      spinner: "w-5 h-5 border-2",
      text: "text-xs",
      gap: "gap-1.5",
    },
    md: {
      spinner: "w-8 h-8 border-3",
      text: "text-sm",
      gap: "gap-2",
    },
    lg: {
      spinner: "w-12 h-12 border-4",
      text: "text-base",
      gap: "gap-3",
    },
    xl: {
      spinner: "w-16 h-16 border-4",
      text: "text-lg",
      gap: "gap-4",
    },
  };

  const colorClasses = {
    gold: "border-t-gold",
    white: "border-t-white",
    muted: "border-t-white-faint",
  };

  const sizes = sizeClasses[size];
  const colorClass = colorClasses[color];

  const spinnerContent = (
    <div className={`loading-spinner ${sizes.gap} ${className}`}>
      <div className={`spinner ${sizes.spinner} ${colorClass}`} />
      {label && <span className={`spinner-label ${sizes.text}`}>{label}</span>}
      {children && <div className="spinner-children">{children}</div>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className="loading-fullpage-content">
          {spinnerContent}
        </div>

        <style jsx>{`
          .loading-fullpage {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .loading-fullpage-content {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {spinnerContent}

      <style jsx>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          border-radius: 50%;
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          animation: spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          flex-shrink: 0;
        }

        .spinner.border-t-gold {
          border-top-color: #f4c542;
        }

        .spinner.border-t-white {
          border-top-color: #ffffff;
        }

        .spinner.border-t-white-faint {
          border-top-color: rgba(255, 255, 255, 0.2);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spinner-label {
          color: rgba(255, 255, 255, 0.3);
          font-weight: 500;
          margin: 0;
          animation: pulse-label 1.5s ease-in-out infinite;
        }

        @keyframes pulse-label {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .spinner-children {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .loading-fullpage-content {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}