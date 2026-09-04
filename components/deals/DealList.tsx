"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  DollarSign,
  Calendar,
  User,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";

interface DealListProps {
  deals: Deal[];
  selectedIds?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: (selected: boolean) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStageChange?: (id: string, stage: string) => void;
  loading?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

type SortKey = keyof Deal | "value";
type SortDirection = "asc" | "desc";

const STAGE_ORDER = [
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

const STAGE_COLORS: Record<string, string> = {
  "New": "#4285f4",
  "Attempted": "#9c27b0",
  "Connected": "#00c853",
  "Interested": "#ffc107",
  "Meeting Scheduled": "#f4c542",
  "Proposal Sent": "#ff6f00",
  "Negotiation": "#ff4444",
  "Won": "#00c853",
  "Lost": "#ff4444",
};

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "New": <Clock className="stage-icon" />,
  "Attempted": <Clock className="stage-icon" />,
  "Connected": <CheckCircle className="stage-icon" />,
  "Interested": <TrendingUp className="stage-icon" />,
  "Meeting Scheduled": <Calendar className="stage-icon" />,
  "Proposal Sent": <FileText className="stage-icon" />,
  "Negotiation": <TrendingDown className="stage-icon" />,
  "Won": <CheckCircle className="stage-icon won" />,
  "Lost": <XCircle className="stage-icon lost" />,
};

export function DealList({
  deals,
  selectedIds = new Set(),
  onSelectRow,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  onStageChange,
  loading = false,
  compact = false,
  emptyMessage = "No deals found",
}: DealListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortValue = (deal: Deal, key: SortKey): string | number => {
    switch (key) {
      case "value":
        return deal.value;
      case "expectedClose":
        return deal.expectedClose || "";
      default:
        return deal[key] as string || "";
    }
  };

  const sortedDeals = [...deals].sort((a, b) => {
    const aVal = getSortValue(a, sortKey);
    const bVal = getSortValue(b, sortKey);
    
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortDirection === "asc" 
      ? (aVal > bVal ? 1 : -1)
      : (bVal > aVal ? 1 : -1);
  });

  const allSelected = deals.length > 0 && deals.every((d) => selectedIds.has(d.id));
  const hasSelection = selectedIds.size > 0;

  const getStageIndex = (stage: string) => {
    const index = STAGE_ORDER.indexOf(stage);
    return index === -1 ? 0 : index;
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" 
      ? <ChevronUp className="sort-icon active" />
      : <ChevronDown className="sort-icon active" />;
  };

  if (loading) {
    return (
      <div className="deal-list-loading">
        <div className="spinner" />
        <span>Loading deals...</span>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="deal-list-empty">
        <DollarSign className="empty-icon" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`deal-list-wrapper ${compact ? "compact" : ""}`}>
      <div className="table-scroll">
        <table className="deal-table">
          <thead>
            <tr>
              {onSelectRow && (
                <th className="col-select">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="select-checkbox"
                  />
                </th>
              )}
              <th className="col-name" onClick={() => handleSort("name")}>
                <span className="header-content">
                  Deal
                  {getSortIcon("name")}
                </span>
              </th>
              <th className="col-stage">Stage</th>
              <th className="col-value" onClick={() => handleSort("value")}>
                <span className="header-content">
                  <DollarSign className="header-icon" />
                  Value
                  {getSortIcon("value")}
                </span>
              </th>
              <th className="col-owner" onClick={() => handleSort("ownerEmail")}>
                <span className="header-content">
                  <User className="header-icon" />
                  Owner
                  {getSortIcon("ownerEmail")}
                </span>
              </th>
              <th className="col-date" onClick={() => handleSort("expectedClose")}>
                <span className="header-content">
                  <Calendar className="header-icon" />
                  Close Date
                  {getSortIcon("expectedClose")}
                </span>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeals.map((deal) => {
              const isSelected = selectedIds.has(deal.id);
              const isWon = deal.stage === "Won" || deal.won;
              const isLost = deal.stage === "Lost";
              const stageColor = STAGE_COLORS[deal.stage] || "#ffffff";
              const stageIcon = STAGE_ICONS[deal.stage] || null;
              const stageIndex = getStageIndex(deal.stage);
              const totalStages = STAGE_ORDER.length;

              return (
                <tr 
                  key={deal.id} 
                  className={`${isSelected ? "selected" : ""} ${isWon ? "won" : ""} ${isLost ? "lost" : ""}`}
                >
                  {onSelectRow && (
                    <td className="col-select" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(deal.id)}
                        className="select-checkbox"
                      />
                    </td>
                  )}
                  <td className="col-name">
                    <div className="deal-cell">
                      <div className="deal-info">
                        <Link href={`/deals/${deal.id}`} className="deal-name">
                          {deal.name}
                        </Link>
                        {deal.leadId && (
                          <Link href={`/leads/${deal.leadId}`} className="deal-lead">
                            View Lead →
                          </Link>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="col-stage">
                    <div className="stage-cell">
                      <div 
                        className="stage-dot" 
                        style={{ background: stageColor }}
                      />
                      <div className="stage-info">
                        <span 
                          className="stage-name"
                          style={{ color: stageColor }}
                        >
                          {stageIcon} {deal.stage}
                        </span>
                        <div className="stage-progress">
                          <div className="stage-bar">
                            <div 
                              className="stage-fill" 
                              style={{ 
                                width: `${(stageIndex / (totalStages - 1)) * 100}%`,
                                background: stageColor,
                              }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="col-value">
                    <span className="value-amount">
                      {formatCurrency(deal.value)}
                    </span>
                  </td>
                  <td className="col-owner">
                    <span className="owner-name">{deal.ownerEmail}</span>
                  </td>
                  <td className="col-date">
                    <span className="date-text">
                      {deal.expectedClose ? formatDate(deal.expectedClose) : "—"}
                    </span>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      {onView && (
                        <button
                          type="button"
                          className="action-btn view"
                          onClick={() => onView(deal.id)}
                          aria-label="View deal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => onEdit(deal.id)}
                          aria-label="Edit deal"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => onDelete(deal.id)}
                          aria-label="Delete deal"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                      {onStageChange && (
                        <select
                          value={deal.stage}
                          onChange={(e) => onStageChange(deal.id, e.target.value)}
                          className="stage-select"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STAGE_ORDER.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Selection Info */}
      {hasSelection && (
        <div className="selection-info">
          <span>{selectedIds.size} deal{selectedIds.size > 1 ? 's' : ''} selected</span>
        </div>
      )}

      <style jsx>{`
        .deal-list-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .deal-list-wrapper.compact {
          font-size: 0.8rem;
        }

        .deal-list-wrapper.compact .deal-name {
          font-size: 0.85rem;
        }

        .deal-list-wrapper.compact .col-name,
        .deal-list-wrapper.compact .col-stage,
        .deal-list-wrapper.compact .col-value,
        .deal-list-wrapper.compact .col-owner,
        .deal-list-wrapper.compact .col-date,
        .deal-list-wrapper.compact .col-actions {
          padding: 0.3rem 0.6rem;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .deal-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        /* Header */
        .deal-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .deal-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }

        .deal-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .deal-table th.sortable:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        .header-content {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .header-icon {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
        }

        .sort-icon {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
        }

        .sort-icon.active {
          color: #f4c542;
        }

        .col-select {
          width: 36px;
          text-align: center;
        }

        .select-checkbox {
          width: 15px;
          height: 15px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        /* Body */
        .deal-table tbody tr {
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .deal-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .deal-table tbody tr.selected {
          background: rgba(244, 197, 66, 0.04);
        }

        .deal-table tbody tr.won {
          border-left: 3px solid #00c853;
        }

        .deal-table tbody tr.lost {
          border-left: 3px solid #ff4444;
        }

        .deal-table td {
          padding: 0.5rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Deal Cell */
        .deal-cell {
          display: flex;
          align-items: center;
        }

        .deal-info {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .deal-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .deal-name:hover {
          color: #f4c542;
        }

        .deal-lead {
          font-size: 0.65rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }

        .deal-lead:hover {
          color: #f4c542;
        }

        /* Stage Cell */
        .stage-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stage-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .stage-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          flex: 1;
        }

        .stage-name {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stage-icon {
          width: 14px;
          height: 14px;
        }

        .stage-icon.won {
          color: #00c853;
        }

        .stage-icon.lost {
          color: #ff4444;
        }

        .stage-progress {
          width: 100%;
          max-width: 120px;
        }

        .stage-bar {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 2px;
          overflow: hidden;
        }

        .stage-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* Value */
        .value-amount {
          font-weight: 600;
          color: #f4c542;
        }

        /* Owner */
        .owner-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }

        /* Date */
        .date-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Actions */
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .action-btn.view:hover {
          color: rgba(66, 133, 244, 0.6);
        }

        .action-btn.edit:hover {
          color: rgba(244, 197, 66, 0.6);
        }

        .action-btn.delete:hover {
          color: rgba(255, 68, 68, 0.6);
          background: rgba(255, 68, 68, 0.04);
        }

        .stage-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.65rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          max-width: 100px;
        }

        .stage-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .stage-select:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
        }

        .stage-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Selection Info */
        .selection-info {
          padding: 0.5rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Loading */
        .deal-list-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty */
        .deal-list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          opacity: 0.2;
        }

        .deal-list-empty p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .col-owner {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .col-date {
            display: none;
          }

          .col-value {
            display: none;
          }

          .deal-table th,
          .deal-table td {
            padding: 0.4rem 0.6rem;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }

          .stage-select {
            max-width: 80px;
            font-size: 0.6rem;
          }

          .stage-progress {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .deal-table {
            font-size: 0.75rem;
          }

          .col-actions {
            padding: 0.3rem 0.4rem;
          }

          .action-btn {
            width: 24px;
            height: 24px;
          }

          .action-btn svg {
            width: 14px;
            height: 14px;
          }

          .deal-name {
            font-size: 0.8rem;
          }

          .stage-name {
            font-size: 0.65rem;
          }

          .stage-select {
            max-width: 60px;
            font-size: 0.55rem;
            padding: 0.05rem 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}