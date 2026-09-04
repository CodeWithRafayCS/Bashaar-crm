"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export interface SheetProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface SheetBodyProps {
  children: ReactNode;
  className?: string;
}

export interface SheetFooterProps {
  children: ReactNode;
  className?: string;
}

export interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

export interface SheetDescriptionProps {
  children: ReactNode;
  className?: string;
}

const SIDE_CLASSES = {
  left: "inset-y-0 left-0 transform -translate-x-full",
  right: "inset-y-0 right-0 transform translate-x-full",
  top: "inset-x-0 top-0 transform -translate-y-full",
  bottom: "inset-x-0 bottom-0 transform translate-y-full",
};

const SIDE_ANIMATION = {
  left: "translate-x-0",
  right: "translate-x-0",
  top: "translate-y-0",
  bottom: "translate-y-0",
};

const SIZES = {
  sm: {
    left: "w-80",
    right: "w-80",
    top: "h-80",
    bottom: "h-80",
  },
  md: {
    left: "w-96",
    right: "w-96",
    top: "h-96",
    bottom: "h-96",
  },
  lg: {
    left: "w-[480px]",
    right: "w-[480px]",
    top: "h-[480px]",
    bottom: "h-[480px]",
  },
  xl: {
    left: "w-[600px]",
    right: "w-[600px]",
    top: "h-[600px]",
    bottom: "h-[600px]",
  },
  full: {
    left: "w-full",
    right: "w-full",
    top: "h-full",
    bottom: "h-full",
  },
};

export function Sheet({
  children,
  open,
  onOpenChange,
  side = "right",
  size = "md",
  className = "",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}: SheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      setIsAnimating(true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange, closeOnEscape]);

  useEffect(() => {
    if (open && sheetRef.current) {
      const focusable = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
      }
    }
  }, [open]);

  const handleAnimationEnd = () => {
    if (!open) {
      setIsAnimating(false);
    }
  };

  if (!open && !isAnimating) return null;

  return (
    <div className="sheet-overlay" onClick={() => closeOnOverlayClick && onOpenChange(false)}>
      <div
        ref={sheetRef}
        className={`sheet-container ${SIDE_CLASSES[side]} ${open ? SIDE_ANIMATION[side] : ""} ${SIZES[size][side]} ${className}`}
        onAnimationEnd={handleAnimationEnd}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <button
            type="button"
            className="sheet-close"
            onClick={() => onOpenChange(false)}
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="sheet-content">{children}</div>

        <style jsx>{`
          .sheet-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 9999;
            animation: overlayFadeIn 0.3s ease;
          }

          @keyframes overlayFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .sheet-container {
            position: fixed;
            background: rgba(16, 16, 16, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.04);
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            flex-direction: column;
            z-index: 10000;
            max-height: 100vh;
            overflow: hidden;
          }

          .sheet-container.sheet-left {
            border-right: 1px solid rgba(255, 255, 255, 0.04);
            top: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
          }

          .sheet-container.sheet-left.open {
            transform: translateX(0);
          }

          .sheet-container.sheet-right {
            border-left: 1px solid rgba(255, 255, 255, 0.04);
            top: 0;
            bottom: 0;
            right: 0;
            transform: translateX(100%);
          }

          .sheet-container.sheet-right.open {
            transform: translateX(0);
          }

          .sheet-container.sheet-top {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            left: 0;
            right: 0;
            top: 0;
            transform: translateY(-100%);
          }

          .sheet-container.sheet-top.open {
            transform: translateY(0);
          }

          .sheet-container.sheet-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            left: 0;
            right: 0;
            bottom: 0;
            transform: translateY(100%);
          }

          .sheet-container.sheet-bottom.open {
            transform: translateY(0);
          }

          .sheet-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
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
            z-index: 10;
            font-family: inherit;
          }

          .sheet-close:hover {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.4);
          }

          .sheet-content {
            flex: 1;
            overflow-y: auto;
            padding: 1.5rem;
            padding-top: 0.5rem;
          }

          .sheet-content::-webkit-scrollbar {
            width: 4px;
          }

          .sheet-content::-webkit-scrollbar-track {
            background: transparent;
          }

          .sheet-content::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.1);
            border-radius: 2px;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .sheet-container.sheet-left,
            .sheet-container.sheet-right {
              width: 90vw !important;
              max-width: 400px;
            }

            .sheet-container.sheet-top,
            .sheet-container.sheet-bottom {
              height: 70vh !important;
            }

            .sheet-close {
              top: 0.75rem;
              right: 0.75rem;
              width: 32px;
              height: 32px;
            }

            .sheet-content {
              padding: 1rem;
            }
          }

          @media (max-width: 480px) {
            .sheet-container.sheet-left,
            .sheet-container.sheet-right {
              width: 100vw !important;
              max-width: 100%;
            }

            .sheet-container.sheet-top,
            .sheet-container.sheet-bottom {
              height: 80vh !important;
            }

            .sheet-close {
              width: 28px;
              height: 28px;
            }

            .sheet-close svg {
              width: 16px;
              height: 16px;
            }

            .sheet-content {
              padding: 0.75rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export function SheetHeader({ children, className = "" }: SheetHeaderProps) {
  return (
    <div className={`sheet-header ${className}`}>
      {children}

      <style jsx>{`
        .sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        @media (max-width: 480px) {
          .sheet-header {
            padding-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export function SheetBody({ children, className = "" }: SheetBodyProps) {
  return (
    <div className={`sheet-body ${className}`}>
      {children}

      <style jsx>{`
        .sheet-body {
          flex: 1;
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}

export function SheetFooter({ children, className = "" }: SheetFooterProps) {
  return (
    <div className={`sheet-footer ${className}`}>
      {children}

      <style jsx>{`
        .sheet-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .sheet-footer {
            flex-direction: column;
            padding-top: 0.5rem;
          }

          .sheet-footer :global(button) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

export function SheetTitle({ children, className = "" }: SheetTitleProps) {
  return (
    <h2 className={`sheet-title ${className}`}>
      {children}

      <style jsx>{`
        .sheet-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          flex: 1;
        }

        @media (max-width: 480px) {
          .sheet-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </h2>
  );
}

export function SheetDescription({ children, className = "" }: SheetDescriptionProps) {
  return (
    <p className={`sheet-description ${className}`}>
      {children}

      <style jsx>{`
        .sheet-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0.2rem 0 0 0;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .sheet-description {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </p>
  );
}

export default Sheet;