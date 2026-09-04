"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Star,
  AlertCircle,
} from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  selectedIds?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: (selected: boolean) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  duplicates?: string[];
  loading?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

type SortKey = keyof Lead | "value";
type SortDirection = "asc" | "desc";

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

export function LeadTable({
  leads,
  selectedIds = new Set(),
  onSelectRow,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  duplicates = [],
  loading = false,
  compact = false,
  emptyMessage = "No leads found",
}: LeadTableProps) {
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

  const getSortValue = (lead: Lead, key: SortKey): string | number => {
    switch (key) {
      case "value":
        return lead.value;
      case "followUpDate":
        return lead.followUpDate || "";
      case "createdAt":
        return lead.createdAt;
      default:
        return lead[key] as string || "";
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
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

  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.has(l.id));
  const hasSelection = selectedIds.size > 0;

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

  const isDuplicate = (id: string) => duplicates.includes(id);

  if (loading) {
    return (
      <div className="lead-table-loading">
        <div className="spinner" />
        <span>Loading leads...</span>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="lead-table-empty">
        <User className="empty-icon" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`lead-table-wrapper ${compact ? "compact" : ""}`}>
      <div className="table-scroll">
        <table className="lead-table">
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
                  Name
                  {getSortIcon("name")}
                </span>
              </th>
              <th className="col-company" onClick={() => handleSort("company")}>
                <span className="header-content">
                  <Building2 className="header-icon" />
                  Company
                  {getSortIcon("company")}
                </span>
              </th>
              <th className="col-contact">Contact</th>
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
              <th className="col-followup" onClick={() => handleSort("followUpDate")}>
                <span className="header-content">
                  <Calendar className="header-icon" />
                  Follow-up
                  {getSortIcon("followUpDate")}
                </span>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead) => {
              const isSelected = selectedIds.has(lead.id);
              const isDuplicate = isDuplicate(lead.id);
              const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();
              const stageColor = STAGE_COLORS[lead.stage] || "#ffffff";

              return (
                <tr 
                  key={lead.id} 
                  className={`${isSelected ? "selected" : ""} ${isDuplicate ? "duplicate" : ""}`}
                >
                  {onSelectRow && (
                    <td className="col-select" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(lead.id)}
                        className="select-checkbox"
                      />
                    </td>
                  )}
                  <td className="col-name">
                    <div className="lead-cell">
                      <div className="lead-avatar">
                        <span className="avatar-initials">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                        {isDuplicate && (
                          <span className="duplicate-indicator" title="Duplicate lead">
                            <AlertCircle className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="lead-info">
                        <Link href={`/leads/${lead.id}`} className="lead-name">
                          {lead.name}
                        </Link>
                        <span className="lead-title">{lead.title || ""}</span>
                      </div>
                    </div>
                  </td>
                  <td className="col-company">
                    <span className="company-name">{lead.company}</span>
                  </td>
                  <td className="col-contact">
                    <div className="contact-info">
                      {lead.phone && (
                        <span className="contact-item">
                          <Phone className="contact-icon" />
                          {formatPhone(lead.phone)}
                        </span>
                      )}
                      {lead.email && (
                        <span className="contact-item">
                          <Mail className="contact-icon" />
                          {lead.email}
                        </span>
                      )}
                      {!lead.phone && !lead.email && (
                        <span className="contact-empty">—</span>
                      )}
                    </div>
                  </td>
                  <td className="col-stage">
                    <div className="stage-cell">
                      <div 
                        className="stage-dot" 
                        style={{ background: stageColor }}
                      />
                      <span 
                        className="stage-name"
                        style={{ color: stageColor }}
                      >
                        {lead.stage}
                      </span>
                    </div>
                  </td>
                  <td className="col-value">
                    <span className="value-amount">
                      {formatCurrency(lead.value)}
                    </span>
                  </td>
                  <td className="col-owner">
                    <span className="owner-name">{lead.ownerEmail}</span>
                  </td>
                  <td className="col-followup">
                    {lead.followUpDate ? (
                      <span className={`followup-date ${isOverdue ? "overdue" : ""}`}>
                        <Clock className="followup-icon" />
                        {formatDate(lead.followUpDate)}
                        {isOverdue && " (Overdue)"}
                      </span>
                    ) : (
                      <span className="followup-empty">—</span>
                    )}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      {onView && (
                        <button
                          type="button"
                          className="action-btn view"
                          onClick={() => onView(lead.id)}
                          aria-label="View lead"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => onEdit(lead.id)}
                          aria-label="Edit lead"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => onDelete(lead.id)}
                          aria-label="Delete lead"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
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
          <span>{selectedIds.size} lead{selectedIds.size > 1 ? 's' : ''} selected</span>
        </div>
      )}

      <style jsx>{`
        .lead-table-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .lead-table-wrapper.compact {
          font-size: 0.8rem;
        }

        .lead-table-wrapper.compact .lead-name {
          font-size: 0.85rem;
        }

        .lead-table-wrapper.compact .col-name,
        .lead-table-wrapper.compact .col-company,
        .lead-table-wrapper.compact .col-contact,
        .lead-table-wrapper.compact .col-stage,
        .lead-table-wrapper.compact .col-value,
        .lead-table-wrapper.compact .col-owner,
        .lead-table-wrapper.compact .col-followup,
        .lead-table-wrapper.compact .col-actions {
          padding: 0.3rem 0.6rem;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .lead-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        /* Header */
        .lead-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .lead-table th {
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

        .lead-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .lead-table th.sortable:hover {
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
        .lead-table tbody tr {
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .lead-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .lead-table tbody tr.selected {
          background: rgba(244, 197, 66, 0.04);
        }

        .lead-table tbody tr.duplicate {
          border-left: 3px solid #ffc107;
        }

        .lead-table td {
          padding: 0.5rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Lead Cell */
        .lead-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lead-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .duplicate-indicator {
          position: absolute;
          bottom: -4px;
          right: -4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffc107;
          color: #0a0a0a;
        }

        .lead-info {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .lead-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .lead-name:hover {
          color: #f4c542;
        }

        .lead-title {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Company */
        .company-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Contact */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .contact-icon {
          width: 12px;
          height: 12px;
          color: rgba(255, 255, 255, 0.1);
        }

        .contact-empty {
          color: rgba(255, 255, 255, 0.1);
        }

        /* Stage */
        .stage-cell {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stage-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .stage-name {
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Value */
        .value-amount {
          font-weight: 600;
          color: #f4c542;
        }

        /* Owner */
        .owner-name {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        /* Follow-up */
        .followup-date {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .followup-date.overdue {
          color: #ff4444;
        }

        .followup-icon {
          width: 12px;
          height: 12px;
        }

        .followup-empty {
          color: rgba(255, 255, 255, 0.1);
        }

        /* Actions */
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 0.15rem;
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

        /* Selection Info */
        .selection-info {
          padding: 0.5rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Loading */
        .lead-table-loading {
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
        .lead-table-empty {
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

        .lead-table-empty p {
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
          .col-contact {
            display: none;
          }

          .col-company {
            display: none;
          }

          .col-followup {
            display: none;
          }

          .lead-table th,
          .lead-table td {
            padding: 0.4rem 0.6rem;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }
        }

        @media (max-width: 480px) {
          .lead-table {
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

          .lead-name {
            font-size: 0.8rem;
          }

          .avatar-initials {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .value-amount {
            font-size: 0.75rem;
          }

          .stage-name {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}