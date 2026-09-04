"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownMenuProps {
  children: ReactNode;
  items: DropdownItem[];
  trigger?: "click" | "hover";
  align?: "start" | "center" | "end";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  children,
  items,
  trigger = "click",
  align = "start",
  className = "",
  open: controlledOpen,
  onOpenChange,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setIsOpen = (open: boolean) => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(open);
    } else {
      setInternalOpen(open);
    }
    if (!open) {
      setSubMenuOpen(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
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
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trigger === "click") {
      setIsOpen(!isOpen);
    }
  };

  const handleTriggerHover = () => {
    if (trigger === "hover") {
      setIsOpen(true);
    }
  };

  const handleTriggerLeave = () => {
    if (trigger === "hover") {
      setTimeout(() => {
        if (!menuRef.current?.matches(":hover")) {
          setIsOpen(false);
        }
      }, 200);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    if (item.children && item.children.length > 0) return;
    item.onClick?.();
    setIsOpen(false);
    setSubMenuOpen(null);
  };

  const renderMenuItem = (item: DropdownItem, depth: number = 0) => {
    if (item.divider) {
      return <div key={item.label} className="dropdown-divider" />;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = subMenuOpen === item.label;

    return (
      <div
        key={item.label}
        className={`dropdown-item ${item.disabled ? "disabled" : ""} ${item.danger ? "danger" : ""} ${depth > 0 ? "sub-item" : ""}`}
        onClick={() => !hasChildren && handleItemClick(item)}
        onMouseEnter={() => hasChildren && setSubMenuOpen(item.label)}
        onMouseLeave={() => hasChildren && setSubMenuOpen(null)}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      >
        <div className="dropdown-item-content">
          {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
          <span className="dropdown-item-label">{item.label}</span>
          {item.shortcut && <span className="dropdown-item-shortcut">{item.shortcut}</span>}
          {hasChildren && <ChevronRight className="dropdown-item-arrow" />}
        </div>

        {hasChildren && isSubMenuOpen && (
          <div className="dropdown-sub">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={menuRef}
      className={`dropdown-wrapper ${className}`}
      onMouseEnter={handleTriggerHover}
      onMouseLeave={handleTriggerLeave}
    >
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {children}
      </div>

      {isOpen && (
        <div className={`dropdown-menu ${alignClasses[align]}`}>
          {items.map((item) => renderMenuItem(item))}

          <style jsx>{`
            .dropdown-wrapper {
              position: relative;
              display: inline-block;
            }

            .dropdown-menu {
              position: absolute;
              top: calc(100% + 4px);
              min-width: 200px;
              background: rgba(20, 20, 20, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 10px;
              padding: 0.3rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
              animation: dropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
              z-index: 100;
            }

            @keyframes dropdownFadeIn {
              from {
                opacity: 0;
                transform: translateY(-4px) scale(0.97);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            .dropdown-divider {
              height: 1px;
              margin: 0.2rem 0.5rem;
              background: rgba(255, 255, 255, 0.04);
            }

            .dropdown-item {
              position: relative;
              padding: 0.3rem 0.6rem;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.85rem;
              color: rgba(255, 255, 255, 0.5);
            }

            .dropdown-item:hover:not(.disabled) {
              background: rgba(255, 255, 255, 0.04);
              color: rgba(255, 255, 255, 0.7);
            }

            .dropdown-item.disabled {
              opacity: 0.3;
              cursor: not-allowed;
            }

            .dropdown-item.danger:hover:not(.disabled) {
              background: rgba(255, 68, 68, 0.06);
              color: #ff4444;
            }

            .dropdown-item.sub-item {
              padding-left: 2rem;
            }

            .dropdown-item-content {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .dropdown-item-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
              flex-shrink: 0;
              color: rgba(255, 255, 255, 0.15);
            }

            .dropdown-item:hover .dropdown-item-icon {
              color: rgba(255, 255, 255, 0.3);
            }

            .dropdown-item.danger .dropdown-item-icon {
              color: rgba(255, 68, 68, 0.3);
            }

            .dropdown-item.danger:hover .dropdown-item-icon {
              color: #ff4444;
            }

            .dropdown-item-label {
              flex: 1;
            }

            .dropdown-item-shortcut {
              font-size: 0.6rem;
              color: rgba(255, 255, 255, 0.1);
              font-family: monospace;
              padding: 0.05rem 0.3rem;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 3px;
            }

            .dropdown-item-arrow {
              width: 16px;
              height: 16px;
              color: rgba(255, 255, 255, 0.1);
              flex-shrink: 0;
            }

            .dropdown-sub {
              position: absolute;
              top: -0.3rem;
              left: calc(100% + 0.3rem);
              min-width: 180px;
              background: rgba(20, 20, 20, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 8px;
              padding: 0.3rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
              animation: subFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes subFadeIn {
              from {
                opacity: 0;
                transform: scale(0.97) translateX(-4px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateX(0);
              }
            }

            /* Responsive */
            @media (max-width: 480px) {
              .dropdown-menu {
                min-width: 160px;
                padding: 0.2rem;
              }

              .dropdown-item {
                padding: 0.25rem 0.5rem;
                font-size: 0.8rem;
              }

              .dropdown-sub {
                position: fixed;
                top: 0.5rem;
                left: 0.5rem;
                right: 0.5rem;
                min-width: unset;
                max-height: 80vh;
                overflow-y: auto;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;