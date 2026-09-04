"use client";

import { useState, useEffect } from "react";
import { Filter, X, ChevronDown, Search, Flag, User, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/common/Button";

export interface TaskFilterState {
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  search: string;
  sortBy: string;
}

interface TaskFiltersProps {
  value: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
  assignees?: string[];
  statuses?: string[];
  priorities?: string[];
  onClear?: () => void;
  compact?: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "⏳ Pending" },
  { value: "In Progress", label: "🔄 In Progress" },
  { value: "Completed", label: "✅ Completed" },
  { value: "Overdue", label: "⚠️ Overdue" },
];

const PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "High", label: "🔴 High" },
  { value: "Medium", label: "🟡 Medium" },
  { value: "Low", label: "🟢 Low" },
];

const DUE_DATE_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this-week", label: "This Week" },
  { value: "next-week", label: "Next Week" },
  { value: "overdue", label: "Overdue" },
  { value: "no-date", label: "No Date" },
];

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "createdAt", label: "Created Date" },
  { value: "title", label: "Title" },
];

export function TaskFilters({
  value,
  onChange,
  assignees = [],
  statuses = STATUS_OPTIONS.map((s) => s.value),
  priorities = PRIORITY_OPTIONS.map((p) => p.value),
  onClear,
  compact = false,
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<TaskFilterState>(value);

  // Sync local filters with external value
  useEffect(() => {
    setLocalFilters(value);
  }, [value]);

  const hasActiveFilters = 
    localFilters.status !== "" &&
    localFilters.status !== "all" ||
    localFilters.priority !== "" &&
    localFilters.priority !== "all" ||
    localFilters.assignee !== "" ||
    localFilters.dueDate !== "" &&
    localFilters.dueDate !== "all" ||
    localFilters.search !== "" ||
    localFilters.sortBy !== "";

  const activeFilterCount = [
    localFilters.status && localFilters.status !== "all" ? localFilters.status : null,
    localFilters.priority && localFilters.priority !== "all" ? localFilters.priority : null,
    localFilters.assignee,
    localFilters.dueDate && localFilters.dueDate !== "all" ? localFilters.dueDate : null,
    localFilters.search,
    localFilters.sortBy,
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof TaskFilterState, val: any) => {
    const newFilters = { ...localFilters, [key]: val };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleClearAll = () => {
    const cleared = {
      status: "",
      priority: "",
      assignee: "",
      dueDate: "",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="w-3 h-3" />;
      case "In Progress": return <Clock className="w-3 h-3" />;
      case "Overdue": return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <Flag className="w-3 h-3" />;
      case "Medium": return <Flag className="w-3 h-3" />;
      case "Low": return <Flag className="w-3 h-3" />;
      default: return <Flag className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "#00c853";
      case "In Progress": return "#4285f4";
      case "Overdue": return "#ff4444";
      default: return "#ffc107";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "#ff4444";
      case "Medium": return "#ffc107";
      case "Low": return "#00c853";
      default: return "#ffc107";
    }
  };

  return (
    <div className={`task-filters ${compact ? "compact" : ""}`}>
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search tasks by title, company, or assignee..."
              className="search-input"
              aria-label="Search tasks"
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
          {/* Status */}
          <div className="filter-group">
            <label className="filter-label">
              <CheckCircle className="w-3.5 h-3.5" />
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

          {/* Priority */}
          <div className="filter-group">
            <label className="filter-label">
              <Flag className="w-3.5 h-3.5" />
              Priority
            </label>
            <select
              value={localFilters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="filter-select"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div className="filter-group">
            <label className="filter-label">
              <User className="w-3.5 h-3.5" />
              Assignee
            </label>
            <select
              value={localFilters.assignee}
              onChange={(e) => handleFilterChange("assignee", e.target.value)}
              className="filter-select"
            >
              <option value="">All Assignees</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="filter-group">
            <label className="filter-label">
              <Calendar className="w-3.5 h-3.5" />
              Due Date
            </label>
            <select
              value={localFilters.dueDate}
              onChange={(e) => handleFilterChange("dueDate", e.target.value)}
              className="filter-select"
            >
              {DUE_DATE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
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
            {localFilters.status && localFilters.status !== "all" && (
              <span className="active-filter">
                {getStatusIcon(localFilters.status)}
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
            {localFilters.priority && localFilters.priority !== "all" && (
              <span className="active-filter">
                {getPriorityIcon(localFilters.priority)}
                {localFilters.priority}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("priority", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.assignee && (
              <span className="active-filter">
                <User className="w-3 h-3" />
                {localFilters.assignee}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("assignee", "")}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {localFilters.dueDate && localFilters.dueDate !== "all" && (
              <span className="active-filter">
                <Calendar className="w-3 h-3" />
                {DUE_DATE_OPTIONS.find((o) => o.value === localFilters.dueDate)?.label}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => handleFilterChange("dueDate", "")}
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
        .task-filters {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          transition: all 0.3s;
        }

        .task-filters.compact {
          padding: 0.5rem 0.75rem;
        }

        .task-filters:hover {
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
          .task-filters {
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
          .task-filters {
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