"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavItem[];
  onClick?: () => void;
  disabled?: boolean;
}

export interface NavigationMenuProps {
  items: NavItem[];
  className?: string;
  variant?: "default" | "dark" | "minimal";
  orientation?: "horizontal" | "vertical";
}

export function NavigationMenu({
  items,
  className = "",
  variant = "default",
  orientation = "horizontal",
}: NavigationMenuProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenItem(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleItemClick = (item: NavItem) => {
    if (item.disabled) return;
    if (item.children && item.children.length > 0) {
      setOpenItem(openItem === item.label ? null : item.label);
      return;
    }
    item.onClick?.();
    setOpenItem(null);
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItem === item.label;
    const isLink = !!item.href && !hasChildren;

    const content = (
      <div className={`nav-item-content ${depth > 0 ? "sub-item" : ""}`}>
        {item.icon && <span className="nav-item-icon">{item.icon}</span>}
        <span className="nav-item-label">{item.label}</span>
        {hasChildren && (
          <ChevronDown className={`nav-item-chevron ${isOpen ? "open" : ""}`} />
        )}
      </div>
    );

    return (
      <div
        key={item.label}
        className={`nav-item-wrapper ${depth > 0 ? "sub-wrapper" : ""}`}
      >
        {isLink ? (
          <Link
            href={item.href}
            className={`nav-item ${item.disabled ? "disabled" : ""} ${depth > 0 ? "sub-item" : ""}`}
            onClick={(e) => {
              if (item.disabled) e.preventDefault();
              handleItemClick(item);
            }}
          >
            {content}
          </Link>
        ) : (
          <button
            type="button"
            className={`nav-item ${item.disabled ? "disabled" : ""} ${depth > 0 ? "sub-item" : ""} ${isOpen ? "open" : ""}`}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {content}
          </button>
        )}

        {hasChildren && isOpen && (
          <div className={`nav-item-children ${depth > 0 ? "sub-children" : ""}`}>
            {item.children!.map((child) => renderNavItem(child, depth + 1))}
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
    <nav
      ref={navRef}
      className={`navigation-menu ${variantClasses[variant]} ${orientation === "vertical" ? "vertical" : "horizontal"} ${className}`}
    >
      {items.map((item) => renderNavItem(item))}

      <style jsx>{`
        .navigation-menu {
          display: flex;
          align-items: flex-start;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid;
          border-radius: 10px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: visible;
        }

        .navigation-menu.vertical {
          flex-direction: column;
          align-items: stretch;
          width: 100%;
        }

        .navigation-menu.horizontal {
          flex-direction: row;
          flex-wrap: wrap;
        }

        /* Nav Item */
        .nav-item-wrapper {
          position: relative;
        }

        .nav-item-wrapper.sub-wrapper {
          width: 100%;
        }

        .nav-item {
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
          text-decoration: none;
          white-space: nowrap;
          width: 100%;
        }

        .nav-item:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .nav-item.open {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .nav-item.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-item.sub-item {
          padding-left: 1.5rem;
          font-size: 0.8rem;
        }

        /* Nav Item Content */
        .nav-item-content {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          width: 100%;
        }

        .nav-item-content.sub-item {
          gap: 0.3rem;
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-item-icon svg {
          width: 16px;
          height: 16px;
        }

        .nav-item-label {
          flex: 1;
        }

        .nav-item-chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.3s;
          flex-shrink: 0;
        }

        .nav-item-chevron.open {
          transform: rotate(180deg);
        }

        /* Children */
        .nav-item-children {
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

        .nav-item-children.sub-children {
          position: absolute;
          top: -0.3rem;
          left: calc(100% + 0.3rem);
          min-width: 180px;
        }

        .navigation-menu.vertical .nav-item-children {
          position: static;
          box-shadow: none;
          background: transparent;
          border: none;
          padding: 0.15rem 0 0.15rem 1rem;
          animation: none;
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

        /* Responsive */
        @media (max-width: 768px) {
          .navigation-menu.horizontal {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            flex-wrap: nowrap;
          }

          .nav-item {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }

          .nav-item.sub-item {
            padding-left: 1.5rem;
          }

          .nav-item-children {
            position: static !important;
            box-shadow: none !important;
            background: transparent !important;
            border: none !important;
            padding: 0.15rem 0 0.15rem 1rem !important;
            animation: none !important;
          }

          .nav-item-children.sub-children {
            padding-left: 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .navigation-menu {
            padding: 0.15rem 0.3rem;
          }

          .nav-item {
            font-size: 0.75rem;
            padding: 0.2rem 0.4rem;
          }

          .nav-item-icon svg {
            width: 14px;
            height: 14px;
          }

          .nav-item-chevron {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </nav>
  );
}

export default NavigationMenu;