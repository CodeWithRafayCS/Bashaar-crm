"use client";

import { ReactNode, useEffect, useRef } from "react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  footer?: ReactNode;
  loading?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
  footer,
  loading = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw]",
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && open) {
        onClose();
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
  }, [open, onClose, closeOnEscape]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle focus trap
  useEffect(() => {
    if (open && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`modal-container ${sizeClasses[size]} ${className}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`modal-body ${loading ? "loading" : ""}`}>
          {loading ? (
            <div className="modal-loading">
              <div className="spinner" />
              <span>Loading...</span>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
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
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
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
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
          font-family: inherit;
        }

        .modal-close:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        .modal-close:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Body */
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .modal-body.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
        }

        .modal-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Footer */
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .modal-footer :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .modal-footer :global(.btn-ghost):hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .modal-footer :global(.btn-gold) {
          padding: 0.5rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .modal-footer :global(.btn-gold):hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .modal-footer :global(.btn-gold):disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-footer :global(.btn-danger) {
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.08) !important;
          border-radius: 8px !important;
          color: rgba(255, 68, 68, 0.5) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .modal-footer :global(.btn-danger):hover:not(:disabled) {
          background: rgba(255, 68, 68, 0.1) !important;
          color: #ff4444 !important;
        }

        .modal-footer :global(.btn-danger):disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .modal-body::-webkit-scrollbar {
          width: 4px;
        }

        .modal-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal-container {
            max-height: 95vh;
            border-radius: 12px;
          }

          .modal-header {
            padding: 1rem 1.25rem;
          }

          .modal-body {
            padding: 1.25rem;
          }

          .modal-footer {
            padding: 0.75rem 1.25rem;
            flex-direction: column;
          }

          .modal-footer :global(.btn-ghost),
          .modal-footer :global(.btn-gold),
          .modal-footer :global(.btn-danger) {
            width: 100%;
            justify-content: center;
          }

          .modal-title {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-container {
            max-height: 98vh;
            border-radius: 10px;
          }

          .modal-header {
            padding: 0.75rem 1rem;
          }

          .modal-body {
            padding: 1rem;
          }

          .modal-footer {
            padding: 0.5rem 1rem;
          }

          .modal-title {
            font-size: 0.9rem;
          }

          .modal-close {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}