"use client";

import { ReactNode, useState, useEffect, Children, isValidElement } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  defaultValue?: string;
  className?: string;
  variant?: "default" | "underline" | "pills" | "buttons" | "minimal";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  className?: string;
  fullWidth?: boolean;
}

const variantClasses = {
  default: {
    tab: "rounded-lg px-4 py-2",
    active: "bg-gold/10 text-gold",
    inactive: "text-white/30 hover:text-white/60 hover:bg-white/5",
  },
  underline: {
    tab: "px-4 py-2 border-b-2 border-transparent",
    active: "text-gold border-gold",
    inactive: "text-white/30 hover:text-white/60",
  },
  pills: {
    tab: "rounded-full px-4 py-2",
    active: "bg-gold/10 text-gold",
    inactive: "text-white/30 hover:text-white/60 hover:bg-white/5",
  },
  buttons: {
    tab: "rounded-lg px-4 py-2",
    active: "bg-gold text-matte-black font-semibold shadow-gold-sm",
    inactive: "text-white/30 hover:text-white/60 hover:bg-white/5",
  },
  minimal: {
    tab: "px-3 py-1.5",
    active: "text-gold",
    inactive: "text-white/20 hover:text-white/40",
  },
};

const sizeClasses = {
  sm: {
    tab: "text-xs px-3 py-1.5",
    icon: "w-3.5 h-3.5",
  },
  md: {
    tab: "text-sm px-4 py-2",
    icon: "w-4 h-4",
  },
  lg: {
    tab: "text-base px-6 py-2.5",
    icon: "w-5 h-5",
  },
};

export function Tabs({
  tabs,
  value: controlledValue,
  onChange,
  defaultValue,
  className = "",
  variant = "default",
  size = "md",
  orientation = "horizontal",
  fullWidth = false,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.id || "");

  const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleTabClick = (id: string) => {
    if (controlledValue === undefined) {
      setInternalValue(id);
    }
    onChange?.(id);
  };

  const selectedTab = tabs.find((tab) => tab.id === selectedValue);
  const styles = variantClasses[variant];
  const sizes = sizeClasses[size];

  return (
    <div className={`tabs-wrapper ${orientation === "vertical" ? "vertical" : ""} ${className}`}>
      <div
        className={`tabs-list ${orientation === "vertical" ? "flex-col" : ""} ${fullWidth ? "full-width" : ""}`}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => {
          const isActive = selectedValue === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled}
              className={`tab-button ${sizes.tab} ${styles.tab} ${isActive ? styles.active : styles.inactive} ${isDisabled ? "disabled" : ""} ${fullWidth ? "flex-1" : ""}`}
              onClick={() => !isDisabled && handleTabClick(tab.id)}
              disabled={isDisabled}
            >
              {tab.icon && (
                <span className={`tab-icon ${sizes.icon}`}>{tab.icon}</span>
              )}
              <span className="tab-label">{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="tab-content" role="tabpanel">
        {selectedTab?.content}
      </div>

      <style jsx>{`
        .tabs-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .tabs-wrapper.vertical {
          flex-direction: row;
          gap: 1.5rem;
        }

        .tabs-wrapper.vertical .tabs-list {
          flex-direction: column;
          min-width: 180px;
          border-right: 1px solid rgba(255, 255, 255, 0.04);
          padding-right: 0.5rem;
        }

        .tabs-wrapper.vertical .tab-content {
          flex: 1;
        }

        .tabs-list {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
          padding: 0.15rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .tabs-list.full-width {
          flex-wrap: nowrap;
        }

        .tabs-list.full-width .tab-button {
          flex: 1;
          justify-content: center;
        }

        .tab-button {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: none;
          background: transparent;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          position: relative;
        }

        .tab-button.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tab-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.05rem 0.4rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.08);
          border-radius: 4px;
          font-size: 0.55rem;
          font-weight: 600;
          color: #f4c542;
          line-height: 1.2;
        }

        .tab-button.active .tab-badge {
          background: rgba(10, 10, 10, 0.05);
          border-color: rgba(10, 10, 10, 0.05);
          color: #0a0a0a;
        }

        .tab-content {
          flex: 1;
          animation: tabFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tabs-wrapper.vertical .tab-content {
          animation: tabFadeInVertical 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes tabFadeInVertical {
          from {
            opacity: 0;
            transform: translateX(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .tabs-wrapper.vertical {
            flex-direction: column;
          }

          .tabs-wrapper.vertical .tabs-list {
            flex-direction: row;
            flex-wrap: nowrap;
            overflow-x: auto;
            min-width: unset;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            padding-right: 0;
            padding-bottom: 0.5rem;
          }

          .tabs-list {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 0.1rem;
          }

          .tabs-list::-webkit-scrollbar {
            height: 2px;
          }

          .tabs-list::-webkit-scrollbar-track {
            background: transparent;
          }

          .tabs-list::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.1);
            border-radius: 2px;
          }

          .tab-button {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        @media (max-width: 480px) {
          .tab-button {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }

          .tab-badge {
            font-size: 0.5rem;
            padding: 0.05rem 0.3rem;
          }

          .tabs-list {
            gap: 0.1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Tabs;