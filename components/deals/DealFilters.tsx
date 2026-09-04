"use client";

import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, Search, DollarSign, Calendar, User, Tag, FileText } from "lucide-react";
import { Button } from "@/components/common/Button";

export interface DealFilterState {
  stage: string;
  owner: string;
  minValue: string;
  maxValue: string;
  dateFrom: string;
  dateTo: string;
  proposalStatus: string;
  search: string;
  sortBy: string;
}

interface DealFiltersProps {
  value: DealFilterState;
  onChange: (filters: DealFilterState) => void;
  owners?: string[];
  stages?: string[];
  proposalStatuses?: string[];
  onClear?: () => void;
  compact?: boolean;
}

const STAGES = [
  "All",
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const PROPOSAL_STATUSES = [
  "All",
  "Draft",
  "Sent",
  "Viewed",
  "Negotiating",
  "Accepted",
  "Rejected",
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "value", label: "Value" },
  { value: "expectedClose", label: "Expected Close" },
  { value: "stage", label: "Stage" },
  { value: "name", label: "Name" },
];

const VALUE_PRESETS = [
  { label: "All", value: "" },
  { label: "< $10K", value: "0-10000" },
  { label: "$10K - $50K", value: "10000-50000" },
  { label: "$50K - $100K", value: "50000-100000" },
  { label: "$100K+", value: "100000-" },
];

export function DealFilters({
  value,
  onChange,
  owners = [],
  stages = STAGES,
  proposalStatuses = PROPOSAL_STATUSES,
  onClear,
  compact = false,
}: DealFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<DealFilterState>(value);

  // Sync local filters with external value
  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  const hasActiveFilters = 
    localFilters.stage !== "" ||
    localFilters.owner !== "" ||
    localFilters.minValue !== "" ||
    localFilters.maxValue !== "" ||
    localFilters.dateFrom !== "" ||
    localFilters.dateTo !== "" ||
    localFilters.proposalStatus !== "" ||
    localFilters.search !== "" ||
    localFilters.sortBy !== "";

  const activeFilterCount = [
    localFilters.stage,
    localFilters.owner,
    localFilters.minValue,
    localFilters.maxValue,
    localFilters.dateFrom,
    localFilters.dateTo,
    localFilters.proposalStatus,
    localFilters.search,
    localFilters.sortBy,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof DealFilterState, val: any) => {
    const newFilters = { ...localFilters, [key]: val };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const cleared = {
      stage: "",
      owner: "",
      minValue: "",
      maxValue: "",
      dateFrom: "",
      dateTo: "",
      proposalStatus: "",
      search: "",
      sortBy: "",
    };
    setLocalFilters(cleared);
    onChange(cleared);
    onClear?.();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via onChange on input
  };

  const handleValuePreset = (preset: string) => {
    if (preset === "") {
      handleFilterChange("minValue", "");
      handleFilterChange("maxValue", "");
      return;
    }
    const [min, max] = preset.split("-");
    handleFilterChange("minValue", min || "");
    handleFilterChange("maxValue", max || "");
  };

  const getValuePreset = () => {
    const current = `${localFilters.minValue}-${localFilters.maxValue}`;
    const found = VALUE_PRESETS.find((p) => p.value === current);
    return found?.value || "";
  };

  return (
    <div className={`deal-filters ${compact ? "compact" : ""}`}>
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search deals by name, owner, or lead..."
              className="search-input"
              aria-label="Search deals"
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
          {/* Stage */}
          <div className="filter-group">
            <label className="filter-label">
              <Tag className="w-3.5 h-3.5" />
              Stage
            </label>
            <select
              value={localFilters.stage}
              onChange={(e) => handleFilterChange("stage", e.target.value)}
              className="filter-select"
            >
              <option value="">All Stages</option>
              {stages.filter(s => s !== "All").map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Owner */}
          <div className="filter-group">
            <label className="filter-label">
              <User className="w-3.5 h-3.5" />
              Owner
            </label>
            <select
              value={localFilters.owner}
              onChange={(e) => handleFilterChange("owner", e.target.value)}
              className="filter-select"
            >
              <option value="">All Owners</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Proposal Status */}
          <div className="filter-group">
            <label className="filter-label">
              <FileText className="w-3.5 h-3.5" />
              Proposal Status
            </label>
            <select
              value={localFilters.proposalStatus}
              onChange={(e) => handleFilterChange("proposalStatus", e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {proposalStatuses.filter(s => s !== "All").map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Value Range */}
          <div className="filter-group">
            <label className="filter-label">
              <DollarSign className="w-3.5 h-3.5" />
              Value Range
            </label>
            <div className="value-range">
              <select
                value={getValuePreset()}
                onChange={(e) => handleValuePreset(e.target.value)}
                className="filter-select value-preset"
              >
                {VALUE_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <div className="range-inputs">
                <input
                  type="number"
                  value={localFilters.minValue}
                  onChange={(e) => handleFilterChange("minValue", e.target.value)}
                  placeholder="Min"
                  className="range-input"
                  min="0"
                />
                <span className="range-separator">—</span>
                <input
                  type="number"
                  value={localFilters.maxValue}
                  onChange={(e) => handleFilterChange("maxValue", e.target.value)}
                  placeholder="Max"
                  className="range-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="filter-group">
            <label className="filter-label">
              <Calendar className="w-3.5 h-3.5" />
              Expected Close
            </label>
            <div className="date-range">
              <input
                type="date"
                value={localFilters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="date-input"
                placeholder="From"
              />
              <span className="range-separator">→</span>
              <input
                type="date"
                value={localFilters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="date-input"
                placeholder="To"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-group">
            <label className="filter-label">Sort By</label>
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
            {localFilters.stage && (
              <span className="active-filter">
                <Tag className="w-3 h-3" />
                {localFilters.stage}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("stage", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.owner && (
              <span className="active-filter">
                <User className="w-3 h-3" />
                {localFilters.owner}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("owner", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.proposalStatus && (
              <span className="active-filter">
                <FileText className="w-3 h-3" />
                {localFilters.proposalStatus}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("proposalStatus", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(localFilters.minValue || localFilters.maxValue) && (
              <span className="active-filter">
                <DollarSign className="w-3 h-3" />
                {localFilters.minValue || "0"} - {localFilters.maxValue || "∞"}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => {
                    handleFilterChange("minValue", "");
                    handleFilterChange("maxValue", "");
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(localFilters.dateFrom || localFilters.dateTo) && (
              <span className="active-filter">
                <Calendar className="w-3 h-3" />
                {localFilters.dateFrom || "Any"} → {localFilters.dateTo || "Any"}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => {
                    handleFilterChange("dateFrom", "");
                    handleFilterChange("dateTo", "");
                  }}
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
        .deal-filters {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.3s;
        }

        .deal-filters.compact {
          padding: 0.5rem 0.75rem;
        }

        .deal-filters:hover {
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
          max-height: 800px;
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

        /* Value Range */
        .value-range {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .value-preset {
          width: 100%;
        }

        .range-inputs {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .range-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.3s;
          width: 100%;
        }

        .range-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .range-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .range-separator {
          color: rgba(255, 255, 255, 0.1);
          font-size: 0.7rem;
        }

        /* Date Range */
        .date-range {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .date-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
          width: 100%;
        }

        .date-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.3);
          cursor: pointer;
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
          .deal-filters {
            padding: 0.5rem 0.75rem;
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .search-input {
            font-size: 0.8rem;
          }

          .range-inputs {
            flex-wrap: nowrap;
          }

          .date-range {
            flex-wrap: nowrap;
          }
        }

        @media (max-width: 480px) {
          .deal-filters {
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

          .range-inputs {
            flex-wrap: wrap;
          }

          .date-range {
            flex-wrap: wrap;
          }

          .date-input,
          .range-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}