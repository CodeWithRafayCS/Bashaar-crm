"use client";

import { ReactNode, useState, useEffect, useRef, createContext, useContext } from "react";

interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: ContextMenuItem[];
}

interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  className?: string;
  trigger?: "click" | "contextmenu";
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

const ContextMenuContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: ContextMenuPosition;
  setPosition: (pos: ContextMenuPosition) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
});

export function ContextMenu({
  children,
  items,
  className = "",
  trigger = "contextmenu",
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<ContextMenuPosition>({ x: 0, y: 0 });
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSubMenuOpen(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSubMenuOpen(null);
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

  const handleTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = e.clientX;
    let y = e.clientY;

    // Adjust position to keep menu in viewport
    const menuWidth = 220;
    const menuHeight = items.length * 36 + 16;
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setPosition({ x, y });
    setIsOpen(true);
    setSubMenuOpen(null);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
    setSubMenuOpen(null);
  };

  const renderMenuItem = (item: ContextMenuItem, depth: number = 0) => {
    if (item.divider) {
      return <div key={item.label} className="context-menu-divider" />;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isSubMenuOpen = subMenuOpen === item.label;

    return (
      <div
        key={item.label}
        className={`context-menu-item ${item.disabled ? "disabled" : ""} ${item.danger ? "danger" : ""} ${depth > 0 ? "sub-item" : ""}`}
        onClick={() => !hasChildren && handleItemClick(item)}
        onMouseEnter={() => hasChildren && setSubMenuOpen(item.label)}
        onMouseLeave={() => hasChildren && setSubMenuOpen(null)}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      >
        <div className="context-menu-item-content">
          {item.icon && <span className="context-menu-item-icon">{item.icon}</span>}
          <span className="context-menu-item-label">{item.label}</span>
          {item.shortcut && <span className="context-menu-item-shortcut">{item.shortcut}</span>}
          {hasChildren && <span className="context-menu-item-arrow">›</span>}
        </div>

        {hasChildren && isSubMenuOpen && (
          <div className="context-menu-sub">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ContextMenuContext.Provider value={{ isOpen, setIsOpen, position, setPosition }}>
      <div ref={triggerRef} onContextMenu={handleTrigger}>
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`context-menu ${className}`}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            zIndex: 9999,
          }}
        >
          {items.map((item) => renderMenuItem(item))}

          <style jsx>{`
            .context-menu {
              min-width: 200px;
              background: rgba(20, 20, 20, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 10px;
              padding: 0.3rem;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
              animation: menuFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes menuFadeIn {
              from {
                opacity: 0;
                transform: scale(0.97) translateY(-4px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            .context-menu-divider {
              height: 1px;
              margin: 0.2rem 0.5rem;
              background: rgba(255, 255, 255, 0.04);
            }

            .context-menu-item {
              position: relative;
              padding: 0.3rem 0.6rem;
              border-radius: 6px;
              cursor: pointer;
              transition: all 0.2s;
              font-size: 0.85rem;
              color: rgba(255, 255, 255, 0.5);
            }

            .context-menu-item:hover:not(.disabled) {
              background: rgba(255, 255, 255, 0.04);
              color: rgba(255, 255, 255, 0.7);
            }

            .context-menu-item.disabled {
              opacity: 0.3;
              cursor: not-allowed;
            }

            .context-menu-item.danger:hover:not(.disabled) {
              background: rgba(255, 68, 68, 0.06);
              color: #ff4444;
            }

            .context-menu-item.sub-item {
              padding-left: 2rem;
            }

            .context-menu-item-content {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .context-menu-item-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
              flex-shrink: 0;
              color: rgba(255, 255, 255, 0.15);
            }

            .context-menu-item:hover .context-menu-item-icon {
              color: rgba(255, 255, 255, 0.3);
            }

            .context-menu-item.danger .context-menu-item-icon {
              color: rgba(255, 68, 68, 0.3);
            }

            .context-menu-item.danger:hover .context-menu-item-icon {
              color: #ff4444;
            }

            .context-menu-item-label {
              flex: 1;
            }

            .context-menu-item-shortcut {
              font-size: 0.6rem;
              color: rgba(255, 255, 255, 0.1);
              font-family: monospace;
              padding: 0.05rem 0.3rem;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 3px;
            }

            .context-menu-item-arrow {
              color: rgba(255, 255, 255, 0.1);
              font-size: 1.2rem;
              font-weight: 300;
              margin-left: 0.3rem;
            }

            .context-menu-sub {
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
              animation: subMenuFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes subMenuFadeIn {
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
              .context-menu {
                min-width: 160px;
                padding: 0.2rem;
                font-size: 0.8rem;
              }

              .context-menu-item {
                padding: 0.25rem 0.5rem;
                font-size: 0.8rem;
              }

              .context-menu-sub {
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
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenu");
  }
  return context;
}

export default ContextMenu;