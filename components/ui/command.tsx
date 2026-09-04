"use client";

import { forwardRef, ReactNode, useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  group?: string;
  onClick?: () => void;
}

export interface CommandGroup {
  id: string;
  label: string;
  items: CommandItem[];
}

export interface CommandProps {
  items?: CommandItem[];
  groups?: CommandGroup[];
  onSelect?: (item: CommandItem) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  emptyMessage?: string;
}

export function Command({
  items = [],
  groups = [],
  onSelect,
  placeholder = "Search...",
  loading = false,
  className = "",
  size = "md",
  emptyMessage = "No results found",
}: CommandProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search
  const filteredGroups = groups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredItems = filteredGroups.length > 0
    ? filteredGroups.flatMap((g) => g.items)
    : filteredItems;

  const hasResults = allFilteredItems.length > 0;

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allFilteredItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < allFilteredItems.length) {
        e.preventDefault();
        const selected = allFilteredItems[selectedIndex];
        onSelect?.(selected);
        selected.onClick?.();
        setSearch("");
        setIsOpen(false);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [allFilteredItems, selectedIndex, isOpen, onSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (item: CommandItem) => {
    onSelect?.(item);
    item.onClick?.();
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  const sizeClasses = {
    sm: {
      input: "text-xs pl-7 pr-7 h-8",
      icon: "w-3.5 h-3.5 left-2.5",
      item: "text-xs px-2.5 py-1.5",
      group: "text-[10px]",
    },
    md: {
      input: "text-sm pl-9 pr-9 h-10",
      icon: "w-4 h-4 left-3",
      item: "text-sm px-3 py-2",
      group: "text-xs",
    },
    lg: {
      input: "text-base pl-10 pr-10 h-12",
      icon: "w-5 h-5 left-3.5",
      item: "text-base px-4 py-2.5",
      group: "text-sm",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`command ${className}`}>
      {/* Search Input */}
      <div className="command-input-wrapper">
        <Search className={`command-search-icon ${sizes.icon}`} />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`command-input ${sizes.input}`}
          onFocus={() => setIsOpen(true)}
        />
        {search && (
          <button
            type="button"
            className="command-clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {isOpen && (
        <div className="command-results" ref={listRef}>
          {loading ? (
            <div className="command-loading">
              <Loader2 className="command-spinner" />
              <span>Searching...</span>
            </div>
          ) : !hasResults ? (
            <div className="command-empty">
              <Search className="empty-icon" />
              <span>{emptyMessage}</span>
            </div>
          ) : (
            <>
              {filteredGroups.length > 0 ? (
                // Grouped results
                filteredGroups.map((group) => (
                  <div key={group.id} className="command-group">
                    <div className={`command-group-label ${sizes.group}`}>
                      {group.label}
                    </div>
                    {group.items.map((item, index) => {
                      const globalIndex = allFilteredItems.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-index={globalIndex}
                          className={`command-item ${sizes.item} ${
                            selectedIndex === globalIndex ? "selected" : ""
                          }`}
                          onClick={() => handleSelect(item)}
                        >
                          {item.icon && (
                            <span className="command-item-icon">{item.icon}</span>
                          )}
                          <span className="command-item-label">{item.label}</span>
                          {item.description && (
                            <span className="command-item-description">
                              {item.description}
                            </span>
                          )}
                          {item.shortcut && (
                            <span className="command-item-shortcut">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                // Flat results
                filteredItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    data-index={index}
                    className={`command-item ${sizes.item} ${
                      selectedIndex === index ? "selected" : ""
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {item.icon && (
                      <span className="command-item-icon">{item.icon}</span>
                    )}
                    <span className="command-item-label">{item.label}</span>
                    {item.description && (
                      <span className="command-item-description">
                        {item.description}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className="command-item-shortcut">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                ))
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .command {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          width: 100%;
          max-width: 480px;
        }

        /* Input Wrapper */
        .command-input-wrapper {
          position: relative;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .command-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }

        .command-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.3rem 0.8rem 0.3rem 2.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: inherit;
          transition: all 0.3s;
          outline: none;
        }

        .command-input:focus {
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .command-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .command-clear {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0.2rem;
        }

        .command-clear:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        /* Results */
        .command-results {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem 0.5rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .command-results::-webkit-scrollbar {
          width: 3px;
        }

        .command-results::-webkit-scrollbar-track {
          background: transparent;
        }

        .command-results::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        /* Loading */
        .command-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .command-spinner {
          width: 18px;
          height: 18px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Empty */
        .command-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 1.5rem;
          color: rgba(255, 255, 255, 0.05);
        }

        .empty-icon {
          width: 24px;
          height: 24px;
        }

        /* Group */
        .command-group {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .command-group-label {
          padding: 0.2rem 0.5rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Item */
        .command-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }

        .command-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .command-item.selected {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .command-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.15);
        }

        .command-item.selected .command-item-icon {
          color: #f4c542;
        }

        .command-item-label {
          flex: 1;
        }

        .command-item-description {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .command-item-shortcut {
          font-size: 0.6rem;
          padding: 0.05rem 0.3rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 3px;
          color: rgba(255, 255, 255, 0.1);
          font-family: monospace;
        }

        .command-item.selected .command-item-shortcut {
          color: rgba(244, 197, 66, 0.2);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .command {
            border-radius: 10px;
          }

          .command-input-wrapper {
            padding: 0.3rem 0.5rem;
          }

          .command-results {
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}