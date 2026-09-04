"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

interface ActivityFiltersProps {
  channel: string;
  onChannel: (value: string) => void;
  owner: string;
  onOwner: (value: string) => void;
  owners: User[];
}

const CHANNELS = ["All", "Call", "WhatsApp", "Meeting", "Note", "Email"];

export function ActivityFilters({
  channel,
  onChannel,
  owner,
  onOwner,
  owners,
}: ActivityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilters = [
    channel && channel !== "All" ? `Channel: ${channel}` : null,
    owner ? `Owner: ${owners.find((u) => u.email === owner)?.name || owner}` : null,
  ].filter(Boolean);

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="activity-filters">
      {/* Filter Header */}
      <div className="filters-header">
        <div className="filters-left">
          <svg className="filter-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <span className="filters-title">Filters</span>
          {hasActiveFilters && (
            <span className="filter-count">{activeFilters.length}</span>
          )}
        </div>
        <div className="filters-right">
          {hasActiveFilters && (
            <button
              type="button"
              className="clear-all"
              onClick={() => {
                onChannel("");
                onOwner("");
              }}
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            className="toggle-filters"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points={isExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Body */}
      <div className={`filters-body ${isExpanded ? "expanded" : ""}`}>
        {/* Channel Filter */}
        <div className="filter-group">
          <label className="filter-label">Channel</label>
          <div className="channel-tabs">
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                className={`channel-tab ${channel === c || (c === "All" && !channel) ? "active" : ""}`}
                onClick={() => onChannel(c === "All" ? "" : c)}
              >
                {c === "All" ? (
                  <span className="channel-icon">📋</span>
                ) : c === "Call" ? (
                  <span className="channel-icon">📞</span>
                ) : c === "WhatsApp" ? (
                  <span className="channel-icon">💬</span>
                ) : c === "Meeting" ? (
                  <span className="channel-icon">📅</span>
                ) : c === "Note" ? (
                  <span className="channel-icon">📝</span>
                ) : c === "Email" ? (
                  <span className="channel-icon">✉️</span>
                ) : null}
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Owner Filter */}
        <div className="filter-group">
          <label className="filter-label">Owner</label>
          <div className="owner-select-wrapper">
            <svg className="select-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <select
              value={owner}
              onChange={(e) => onOwner(e.target.value)}
              className="owner-select"
              aria-label="Filter by owner"
            >
              <option value="">All owners</option>
              {owners
                .filter((u) => u.active)
                .map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="active-filters">
            {activeFilters.map((filter) => (
              <span key={filter} className="active-filter">
                {filter}
                <button
                  type="button"
                  className="remove-filter"
                  onClick={() => {
                    if (filter?.startsWith("Channel:")) {
                      onChannel("");
                    } else if (filter?.startsWith("Owner:")) {
                      onOwner("");
                    }
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .activity-filters {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          transition: all 0.3s;
        }

        .activity-filters:hover {
          border-color: rgba(255, 255, 255, 0.06);
        }

        /* Header */
        .filters-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .filters-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-icon {
          color: rgba(255, 255, 255, 0.15);
        }

        .filters-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
        }

        .filter-count {
          font-size: 0.6rem;
          padding: 0.05rem 0.4rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 4px;
          color: #f4c542;
          font-weight: 500;
        }

        .filters-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .clear-all {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .clear-all:hover {
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.04);
        }

        .toggle-filters {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .toggle-filters:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        /* Body */
        .filters-body {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
        }

        .filters-body.expanded {
          max-height: 300px;
          opacity: 1;
          margin-top: 0.75rem;
        }

        .filter-group {
          margin-bottom: 0.75rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.3rem;
        }

        /* Channel Tabs */
        .channel-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .channel-tab {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .channel-tab:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        .channel-tab.active {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.12);
          color: #f4c542;
        }

        .channel-icon {
          font-size: 0.7rem;
        }

        /* Owner Select */
        .owner-select-wrapper {
          position: relative;
        }

        .select-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }

        .owner-select {
          width: 100%;
          max-width: 200px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.4rem 0.6rem 0.4rem 2rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .owner-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .owner-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .owner-select::-ms-expand {
          display: none;
        }

        /* Active Filters */
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .active-filter {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
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
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.6rem;
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0;
        }

        .remove-filter:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .activity-filters {
            padding: 0.5rem 0.75rem;
          }

          .channel-tabs {
            gap: 0.15rem;
          }

          .channel-tab {
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
          }

          .owner-select {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .filters-header {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .filters-right {
            margin-left: auto;
          }

          .channel-tab {
            font-size: 0.65rem;
            padding: 0.15rem 0.4rem;
          }

          .channel-icon {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}