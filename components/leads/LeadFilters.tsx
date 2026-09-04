"use client";

import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, Search, Users, Tag, Calendar, DollarSign, User } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LEAD_STAGES, LEAD_SOURCES } from "@/lib/utils/constants";

export interface LeadFilterState {
  stage: string;
  source: string;
  owner: string;
  project: string;
  status: string;
  view: string;
  search: string;
}

interface LeadFiltersProps {
  value: LeadFilterState;
  onChange: (filters: LeadFilterState) => void;
  owners?: string[];
  projects?: { id: string; name: string }[];
  stages?: string[];
  sources?: string[];
  onClear?: () => void;
  compact?: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const VIEW_OPTIONS = [
  { value: "", label: "All" },
  { value: "High value", label: "High Value" },
  { value: "No owner", label: "Unassigned" },
  { value: "No follow-up", label: "No Follow-up" },
];

export function LeadFilters({
  value,
  onChange,
  owners = [],
  projects = [],
  stages = LEAD_STAGES,
  sources = LEAD_SOURCES,
  onClear,
  compact = false,
}: LeadFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<LeadFilterState>(value);

  // Sync local filters with external value
  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  const hasActiveFilters = 
    localFilters.stage !== "" ||
    localFilters.source !== "" ||
    localFilters.owner !== "" ||
    localFilters.project !== "" ||
    localFilters.status !== "" ||
    localFilters.view !== "" ||
    localFilters.search !== "";

  const activeFilterCount = [
    localFilters.stage,
    localFilters.source,
    localFilters.owner,
    localFilters.project,
    localFilters.status,
    localFilters.view,
    localFilters.search,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof LeadFilterState, val: any) => {
    const newFilters = { ...localFilters, [key]: val };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const cleared = {
      stage: "",
      source: "",
      owner: "",
      project: "",
      status: "",
      view: "",
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
    <div className={`lead-filters ${compact ? "compact" : ""}`}>
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search leads by name, company, email, or phone..."
              className="search-input"
              aria-label="Search leads"
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
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="filter-group">
            <label className="filter-label">
              <Tag className="w-3.5 h-3.5" />
              Source
            </label>
            <select
              value={localFilters.source}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              className="filter-select"
            >
              <option value="">All Sources</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
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

          {/* Project */}
          <div className="filter-group">
            <label className="filter-label">
              <Users className="w-3.5 h-3.5" />
              Project
            </label>
            <select
              value={localFilters.project}
              onChange={(e) => handleFilterChange("project", e.target.value)}
              className="filter-select"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="filter-group">
            <label className="filter-label">
              <Calendar className="w-3.5 h-3.5" />
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="filter-select"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View */}
          <div className="filter-group">
            <label className="filter-label">
              <DollarSign className="w-3.5 h-3.5" />
              View
            </label>
            <select
              value={localFilters.view}
              onChange={(e) => handleFilterChange("view", e.target.value)}
              className="filter-select"
            >
              {VIEW_OPTIONS.map((opt) => (
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
            {localFilters.source && (
              <span className="active-filter">
                <Tag className="w-3 h-3" />
                {localFilters.source}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("source", "")}
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
            {localFilters.project && (
              <span className="active-filter">
                <Users className="w-3 h-3" />
                {projects.find(p => p.id === localFilters.project)?.name || localFilters.project}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("project", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.status && localFilters.status !== "all" && (
              <span className="active-filter">
                <Calendar className="w-3 h-3" />
                {localFilters.status}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("status", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.view && (
              <span className="active-filter">
                <DollarSign className="w-3 h-3" />
                {localFilters.view}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("view", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .lead-filters {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.3s;
        }

        .lead-filters.compact {
          padding: 0.5rem 0.75rem;
        }

        .lead-filters:hover {
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
          .lead-filters {
            padding: 0.5rem 0.75rem;
          }

          .filter-grid {
            grid-template-columns: 1fr 1fr;
          }

          .search-input {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .lead-filters {
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