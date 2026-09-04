"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
}

export interface MenubarProps {
  items: MenuItem[];
  className?: string;
  variant?: "default" | "dark" | "minimal";
}

export function Menubar({ items, className = "", variant = "default" }: MenubarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const menubarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menubarRef.current && !menubarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setSubMenuOpen(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setSubMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMenuClick = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
    setSubMenuOpen(null);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    if (item.children && item.children.length > 0) return;
    item.onClick?.();
    setOpenMenu(null);
    setSubMenuOpen(null);
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    if (item.divider) {
      return <div key={item.label} className="menubar-divider" />;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = subMenuOpen === item.label;

    return (
      <div
        key={item.label}
        className={`menubar-item ${item.disabled ? "disabled" : ""} ${depth > 0 ? "sub-item" : ""}`}
        onClick={() => !hasChildren && handleItemClick(item)}
        onMouseEnter={() => hasChildren && setSubMenuOpen(item.label)}
        onMouseLeave={() => hasChildren && setSubMenuOpen(null)}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      >
        <div className="menubar-item-content">
          {item.icon && <span className="menubar-item-icon">{item.icon}</span>}
          <span className="menubar-item-label">{item.label}</span>
          {item.shortcut && <span className="menubar-item-shortcut">{item.shortcut}</span>}
          {hasChildren && <ChevronRight className="menubar-item-arrow" />}
        </div>

        {hasChildren && isSubMenuOpen && (
          <div className="menubar-sub">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const variantClasses = {
    default: "bg-white/5 border-white/5",
    dark: "bg-black/30 border-white/3",
    minimal: "bg-transparent border-transparent",
  };

  return (
    <div
      ref={menubarRef}
      className={`menubar ${variantClasses[variant]} ${className}`}
    >
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenu === item.label;

        return (
          <div key={item.label} className="menubar-menu">
            <button
              type="button"
              className={`menubar-trigger ${isOpen ? "open" : ""} ${item.disabled ? "disabled" : ""}`}
              onClick={() => hasChildren && handleMenuClick(item.label)}
              disabled={item.disabled}
            >
              {item.icon && <span className="menubar-trigger-icon">{item.icon}</span>}
              <span className="menubar-trigger-label">{item.label}</span>
              {hasChildren && <ChevronDown className={`menubar-trigger-chevron ${isOpen ? "open" : ""}`} />}
            </button>

            {isOpen && hasChildren && (
              <div className="menubar-dropdown">
                {item.children!.map((child) => renderMenuItem(child))}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .menubar {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid;
          border-radius: 10px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow-x: auto;
          overflow-y: visible;
        }

        .menubar::-webkit-scrollbar {
          height: 2px;
        }

        .menubar::-webkit-scrollbar-track {
          background: transparent;
        }

        .menubar::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        /* Menu */
        .menubar-menu {
          position: relative;
        }

        /* Trigger */
        .menubar-trigger {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .menubar-trigger:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .menubar-trigger.open {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .menubar-trigger.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .menubar-trigger-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .menubar-trigger-chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.3s;
        }

        .menubar-trigger-chevron.open {
          transform: rotate(180deg);
        }

        /* Dropdown */
        .menubar-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
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

        /* Menu Items */
        .menubar-divider {
          height: 1px;
          margin: 0.2rem 0.5rem;
          background: rgba(255, 255, 255, 0.04);
        }

        .menubar-item {
          position: relative;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .menubar-item:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
        }

        .menubar-item.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .menubar-item.sub-item {
          padding-left: 2rem;
        }

        .menubar-item-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .menubar-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.15);
        }

        .menubar-item:hover .menubar-item-icon {
          color: rgba(255, 255, 255, 0.3);
        }

        .menubar-item-label {
          flex: 1;
        }

        .menubar-item-shortcut {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
          font-family: monospace;
          padding: 0.05rem 0.3rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }

        .menubar-item-arrow {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        /* Sub-menu */
        .menubar-sub {
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
        @media (max-width: 768px) {
          .menubar {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 0.2rem 0.4rem;
          }

          .menubar-trigger {
            font-size: 0.75rem;
            padding: 0.2rem 0.4rem;
          }

          .menubar-dropdown {
            min-width: 160px;
            padding: 0.2rem;
          }

          .menubar-item {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }

          .menubar-sub {
            position: fixed;
            top: 0.5rem;
            left: 0.5rem;
            right: 0.5rem;
            min-width: unset;
            max-height: 80vh;
            overflow-y: auto;
          }
        }

        @media (max-width: 480px) {
          .menubar {
            gap: 0.1rem;
            padding: 0.15rem 0.3rem;
          }

          .menubar-trigger {
            font-size: 0.7rem;
            padding: 0.15rem 0.3rem;
          }

          .menubar-trigger-chevron {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default Menubar;