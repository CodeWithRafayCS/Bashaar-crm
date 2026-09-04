"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: "click" | "hover";
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

export function Popover({
  children,
  content,
  className = "",
  side = "bottom",
  align = "center",
  open: controlledOpen,
  onOpenChange,
  trigger = "click",
  closeOnClickOutside = true,
  closeOnEscape = true,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsOpen = (open: boolean) => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const spacing = 8;

    switch (side) {
      case "top":
        top = triggerRect.top - contentRect.height - spacing;
        break;
      case "bottom":
        top = triggerRect.bottom + spacing;
        break;
      case "left":
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - spacing;
        break;
      case "right":
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
    }

    // Default left alignment
    if (side === "top" || side === "bottom") {
      switch (align) {
        case "start":
          left = triggerRect.left;
          break;
        case "center":
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          break;
        case "end":
          left = triggerRect.right - contentRect.width;
          break;
      }
    }

    // Keep in viewport
    if (left < 10) left = 10;
    if (left + contentRect.width > window.innerWidth - 10) {
      left = window.innerWidth - contentRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + contentRect.height > window.innerHeight - 10) {
      if (side === "bottom") {
        top = triggerRect.top - contentRect.height - spacing;
      } else if (side === "top") {
        top = triggerRect.bottom + spacing;
      }
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }
  }, [isOpen, content]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!closeOnClickOutside) return;
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (contentRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (!closeOnEscape) return;
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnClickOutside, closeOnEscape]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trigger === "click") {
      setIsOpen(!isOpen);
    }
  };

  const handleTriggerHover = () => {
    if (trigger === "hover") {
      clearTimeout(closeTimeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleTriggerLeave = () => {
    if (trigger === "hover") {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  const handleContentEnter = () => {
    if (trigger === "hover") {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleContentLeave = () => {
    if (trigger === "hover") {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  };

  return (
    <div className={`popover-wrapper ${className}`}>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerHover}
        onMouseLeave={handleTriggerLeave}
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className="popover-content"
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            zIndex: 9999,
          }}
          onMouseEnter={handleContentEnter}
          onMouseLeave={handleContentLeave}
        >
          {content}

          <style jsx>{`
            .popover-content {
              background: rgba(20, 20, 20, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 10px;
              padding: 0.75rem 1rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
              min-width: 200px;
              max-width: 320px;
              animation: popoverFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes popoverFadeIn {
              from {
                opacity: 0;
                transform: scale(0.97) translateY(-4px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            /* Responsive */
            @media (max-width: 480px) {
              .popover-content {
                min-width: 160px;
                max-width: 260px;
                padding: 0.5rem 0.75rem;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default Popover;