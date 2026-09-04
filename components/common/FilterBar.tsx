"use client";

import { useState, ReactNode, useCallback } from "react";
import { Button } from "./Button";

export interface FilterOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "select" | "search" | "date" | "toggle";
}

export interface FilterBarProps {
  filters: FilterGroup[];
  onClearAll?: () => void;
  onApply?: (filters: Record<string, string>) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  searchValue?: string;
  className?: string;
  compact?: boolean;
  children?: ReactNode;
}

export function FilterBar({
  filters,
  onClearAll,
  onApply,
  searchPlaceholder = "Search...",
  showSearch = true,
  onSearch,
  searchValue = "",
  className = "",
  compact = false,
  children,
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = filters.some((f) => f.value && f.value !== "");

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleClearAll = () => {
    filters.forEach((f) => f.onChange(""));
    if (onSearch) {
      setLocalSearch("");
      onSearch("");
    }
    onClearAll?.();
  };

  const handleApply = () => {
    const filterValues: Record<string, string> = {};
    filters.forEach((f) => {
      if (f.value) {
        filterValues[f.id] = f.value;
      }
    });
    onApply?.(filterValues);
  };

  const renderFilterInput = (filter: FilterGroup) => {
    switch (filter.type || "select") {
      case "select":
        return (
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="filter-select"
            aria-label={filter.label}
          >
            <option value="">{filter.placeholder || `All ${filter.label}s`}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case "search":
        return (
          <input
            type="text"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            placeholder={filter.placeholder || "Search..."}
            className="filter-input"
            aria-label={filter.label}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="filter-input date-input"
            aria-label={filter.label}
          />
        );
      case "toggle":
        return (
          <div className="toggle-group">
            {filter.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`toggle-btn ${filter.value === opt.value ? "active" : ""}`}
                onClick={() => filter.onChange(filter.value === opt.value ? "" : opt.value)}
              >
                {opt.icon && <span className="toggle-icon">{opt.icon}</span>}
                {opt.label}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`filter-bar ${compact ? "compact" : ""} ${className}`}>
      {/* Search */}
      {showSearch && onSearch && (
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="search-input"
            aria-label="Search"
          />
          {localSearch && (
            <button
              type="button"
              className="clear-search"
              onClick={() => handleSearchChange("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Filters */}
      <div className={`filters-wrapper ${isExpanded ? "expanded" : ""}`}>
        {filters.map((filter) => (
          <div key={filter.id} className="filter-group">
            <label className="filter-label">{filter.label}</label>
            {renderFilterInput(filter)}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="filter-actions">
        {children}

        {hasActiveFilters && (
          <button type="button" className="clear-all-btn" onClick={handleClearAll}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear all
          </button>
        )}

        {onApply && hasActiveFilters && (
          <Button type="button" variant="gold" size="sm" onClick={handleApply}>
            Apply
          </Button>
        )}

        <button
          type="button"
          className="toggle-filters"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle filters"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <span className="toggle-label">
            {isExpanded ? "Hide filters" : "Filters"}
            {hasActiveFilters && !isExpanded && (
              <span className="filter-badge">{filters.filter((f) => f.value).length}</span>
            )}
          </span>
        </button>
      </div>

      <style jsx>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.5rem 0.75rem;
          transition: all 0.3s;
        }

        .filter-bar:hover {
          border-color: rgba(255, 255, 255, 0.05);
        }

        .filter-bar.compact {
          padding: 0.3rem 0.5rem;
          gap: 0.3rem;
        }

        /* Search */
        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 180px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem 0.4rem 2.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          font-size: 0.7rem;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0.2rem;
        }

        .clear-search:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Filters Wrapper */
        .filters-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex: 1;
          align-items: flex-end;
        }

        .filters-wrapper:not(.expanded) .filter-group:not(:first-child) {
          display: none;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 130px;
          max-width: 200px;
        }

        .filter-label {
          font-size: 0.6rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .filter-select,
        .filter-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .filter-select::-ms-expand {
          display: none;
        }

        .date-input {
          cursor: pointer;
        }

        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.3);
          cursor: pointer;
        }

        /* Toggle Group */
        .toggle-group {
          display: flex;
          gap: 0.15rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          padding: 0.1rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.2rem 0.5rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .toggle-btn:hover {
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.04);
        }

        .toggle-btn.active {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .toggle-icon {
          font-size: 0.8rem;
        }

        /* Filter Actions */
        .filter-actions {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }

        .clear-all-btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .clear-all-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .filter-actions :global(.btn-gold) {
          padding: 0.3rem 0.8rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 6px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.75rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .filter-actions :global(.btn-gold):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.3) !important;
        }

        .toggle-filters {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .toggle-filters:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 0.3rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #f4c542;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .filter-bar {
            padding: 0.4rem 0.5rem;
            gap: 0.3rem;
          }

          .search-wrapper {
            min-width: 120px;
          }

          .filter-group {
            min-width: 100px;
            max-width: 160px;
          }

          .filters-wrapper:not(.expanded) .filter-group:not(:first-child) {
            display: none;
          }

          .filter-actions {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 0.5rem;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .filters-wrapper {
            flex-direction: column;
          }

          .filters-wrapper:not(.expanded) .filter-group:not(:first-child) {
            display: none;
          }

          .filter-group {
            min-width: 100%;
            max-width: 100%;
          }

          .filter-actions {
            justify-content: flex-end;
          }

          .toggle-filters {
            padding: 0.2rem 0.4rem;
            font-size: 0.65rem;
          }

          .clear-all-btn {
            padding: 0.2rem 0.4rem;
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}