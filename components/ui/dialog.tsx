"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface DialogBodyProps {
  children: ReactNode;
  className?: string;
}

export interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

export interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[95vw]",
};

export function Dialog({
  open,
  onOpenChange,
  children,
  className = "",
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange, closeOnEscape]);

  useEffect(() => {
    if (open && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        className={`dialog-container ${SIZES[size]} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {children}

        <style jsx>{`
          .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            padding: 1rem;
            animation: overlayFadeIn 0.2s ease;
          }

          @keyframes overlayFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .dialog-container {
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
            animation: dialogSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes dialogSlideIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .dialog-container {
              max-height: 95vh;
              border-radius: 12px;
            }
          }

          @media (max-width: 480px) {
            .dialog-overlay {
              padding: 0.5rem;
            }

            .dialog-container {
              border-radius: 10px;
              max-height: 98vh;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }: DialogHeaderProps) {
  return (
    <div className={`dialog-header ${className}`}>
      {children}

      <style jsx>{`
        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .dialog-header {
            padding: 1rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export function DialogBody({ children, className = "" }: DialogBodyProps) {
  return (
    <div className={`dialog-body ${className}`}>
      {children}

      <style jsx>{`
        .dialog-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .dialog-body::-webkit-scrollbar {
          width: 4px;
        }

        .dialog-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .dialog-body::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        @media (max-width: 480px) {
          .dialog-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export function DialogFooter({ children, className = "" }: DialogFooterProps) {
  return (
    <div className={`dialog-footer ${className}`}>
      {children}

      <style jsx>{`
        .dialog-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .dialog-footer {
            padding: 0.75rem 1rem;
            flex-direction: column;
          }

          .dialog-footer :global(button) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2 className={`dialog-title ${className}`}>
      {children}

      <style jsx>{`
        .dialog-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          flex: 1;
        }

        @media (max-width: 480px) {
          .dialog-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </h2>
  );
}

export function DialogDescription({ children, className = "" }: DialogDescriptionProps) {
  return (
    <p className={`dialog-description ${className}`}>
      {children}

      <style jsx>{`
        .dialog-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0.2rem 0 0 0;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .dialog-description {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </p>
  );
}

export function DialogClose({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`dialog-close ${className}`}
      onClick={onClose}
      aria-label="Close dialog"
    >
      <X className="w-5 h-5" />

      <style jsx>{`
        .dialog-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .dialog-close:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 480px) {
          .dialog-close {
            width: 32px;
            height: 32px;
          }

          .dialog-close svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </button>
  );
}

export default Dialog;