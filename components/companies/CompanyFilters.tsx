"use client";

import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, Search, Building2, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/common/Button";

export interface CompanyFilterState {
  category: string;
  status: string;
  minRating: string;
  hasLeads: boolean;
  sortBy: string;
  search: string;
}

interface CompanyFiltersProps {
  value: CompanyFilterState;
  onChange: (filters: CompanyFilterState) => void;
  categories?: string[];
  onClear?: () => void;
  compact?: boolean;
}

const CATEGORIES = [
  "All",
  "Technology",
  "Healthcare",
  "Retail",
  "Finance",
  "Education",
  "Real Estate",
  "Hospitality",
  "Manufacturing",
  "Other",
];

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "createdAt", label: "Created Date" },
  { value: "leadCount", label: "Lead Count" },
  { value: "totalDealValue", label: "Total Value" },
  { value: "rating", label: "Rating" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export function CompanyFilters({
  value,
  onChange,
  categories = CATEGORIES,
  onClear,
  compact = false,
}: CompanyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<CompanyFilterState>(value);

  // Sync local filters with external value
  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  const hasActiveFilters = 
    localFilters.category !== "" ||
    localFilters.status !== "" ||
    localFilters.minRating !== "" ||
    localFilters.hasLeads ||
    localFilters.sortBy !== "" ||
    localFilters.search !== "";

  const activeFilterCount = [
    localFilters.category,
    localFilters.status,
    localFilters.minRating,
    localFilters.hasLeads ? "hasLeads" : null,
    localFilters.sortBy,
    localFilters.search,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof CompanyFilterState, val: any) => {
    const newFilters = { ...localFilters, [key]: val };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const cleared = {
      category: "",
      status: "",
      minRating: "",
      hasLeads: false,
      sortBy: "",
      search: "",
    };
    setLocalFilters(cleared);
    onChange(cleared);
    onClear?.();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via onChange on input
  };

  return (
    <div className={`company-filters ${compact ? "compact" : ""}`}>
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search companies by name, email, or phone..."
              className="search-input"
              aria-label="Search companies"
            />
            {localFilters.search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => handleFilterChange("search", "")}
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter Toggle */}
      <div className="filter-toggle">
        <button
          type="button"
          className={`toggle-btn ${isExpanded ? "active" : ""}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
          <ChevronDown className={`chevron ${isExpanded ? "open" : ""}`} />
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filter Body */}
      <div className={`filter-body ${isExpanded ? "expanded" : ""}`}>
        <div className="filter-grid">
          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-option ${localFilters.category === cat ? "active" : ""}`}
                  onClick={() => handleFilterChange("category", localFilters.category === cat ? "" : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <div className="filter-options small">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-option ${localFilters.status === opt.value ? "active" : ""}`}
                  onClick={() => handleFilterChange("status", localFilters.status === opt.value ? "" : opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div className="filter-group">
            <label className="filter-label">
              <Star className="w-3.5 h-3.5" />
              Minimum Rating
            </label>
            <div className="filter-options small">
              {["All", "4.5+", "4.0+", "3.5+", "3.0+"].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`filter-option ${localFilters.minRating === rating ? "active" : ""}`}
                  onClick={() => handleFilterChange("minRating", localFilters.minRating === rating ? "" : rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Has Leads Toggle */}
          <div className="filter-group">
            <label className="filter-label">
              <Users className="w-3.5 h-3.5" />
              Lead Status
            </label>
            <div className="filter-options small">
              <button
                type="button"
                className={`filter-option ${localFilters.hasLeads ? "active" : ""}`}
                onClick={() => handleFilterChange("hasLeads", !localFilters.hasLeads)}
              >
                {localFilters.hasLeads ? "Has Leads" : "All"}
              </button>
              <button
                type="button"
                className={`filter-option ${!localFilters.hasLeads && localFilters.hasLeads !== undefined ? "active" : ""}`}
                onClick={() => handleFilterChange("hasLeads", false)}
              >
                No Leads
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label className="filter-label">
              <Calendar className="w-3.5 h-3.5" />
              Sort By
            </label>
            <select
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="filter-select"
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="active-filters">
            {localFilters.category && (
              <span className="active-filter">
                <Building2 className="w-3 h-3" />
                {localFilters.category}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("category", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.status && localFilters.status !== "all" && (
              <span className="active-filter">
                Status: {localFilters.status}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("status", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.minRating && (
              <span className="active-filter">
                <Star className="w-3 h-3" />
                {localFilters.minRating}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("minRating", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.hasLeads && (
              <span className="active-filter">
                <Users className="w-3 h-3" />
                Has Leads
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("hasLeads", false)}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.sortBy && (
              <span className="active-filter">
                Sort: {SORT_OPTIONS.find((o) => o.value === localFilters.sortBy)?.label}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("sortBy", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .company-filters {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.3s;
        }

        .company-filters.compact {
          padding: 0.5rem 0.75rem;
        }

        .company-filters:hover {
          border-color: rgba(255, 255, 255, 0.05);
        }

        /* Search Section */
        .search-section {
          margin-bottom: 0.5rem;
        }

        .search-form {
          width: 100%;
        }

        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.8rem 0.5rem 2.5rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
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
          transition: all 0.3s;
          padding: 0.2rem;
          font-family: inherit;
        }

        .clear-search:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Filter Toggle */
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        .toggle-btn.active {
          color: rgba(255, 255, 255, 0.6);
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

        .chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.3s;
        }

        .chevron.open {
          transform: rotate(180deg);
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
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .clear-all-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        /* Filter Body */
        .filter-body {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-body.expanded {
          max-height: 600px;
          opacity: 1;
          margin-top: 0.75rem;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.65rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2rem;
        }

        .filter-options.small .filter-option {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
        }

        .filter-option {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .filter-option:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        .filter-option.active {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.1);
          color: #f4c542;
        }

        .filter-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Active Filters */
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .active-filter {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.15rem 0.5rem;
          background: rgba(244, 197, 66, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.06);
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .remove-filter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: color 0.3s;
          padding: 0;
          font-family: inherit;
        }

        .remove-filter:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .company-filters {
            padding: 0.5rem 0.75rem;
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .search-input {
            font-size: 0.8rem;
          }

          .filter-options {
            gap: 0.15rem;
          }
        }

        @media (max-width: 480px) {
          .company-filters {
            padding: 0.4rem 0.5rem;
          }

          .filter-grid {
            grid-template-columns: 1fr;
          }

          .filter-toggle {
            flex-wrap: wrap;
          }

          .toggle-btn {
            font-size: 0.7rem;
          }

          .clear-all-btn {
            font-size: 0.7rem;
          }

          .search-input {
            font-size: 0.75rem;
            padding: 0.4rem 0.6rem 0.4rem 2rem;
          }

          .search-icon {
            width: 14px;
            height: 14px;
            left: 8px;
          }
        }
      `}</style>
    </div>
  );
}