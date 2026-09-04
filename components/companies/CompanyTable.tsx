"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Users, 
  TrendingUp,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Check,
  X
} from "lucide-react";

interface CompanyTableProps {
  companies: Company[];
  selectedIds?: Set<string>;
  onSelectRow?: (id: string) => void;
  onSelectAll?: (selected: boolean) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
  compact?: boolean;
  emptyMessage?: string;
}

type SortKey = keyof Company | "leadCount" | "totalDealValue";
type SortDirection = "asc" | "desc";

export function CompanyTable({
  companies,
  selectedIds = new Set(),
  onSelectRow,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
  loading = false,
  compact = false,
  emptyMessage = "No companies found",
}: CompanyTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortValue = (company: Company, key: SortKey): string | number => {
    switch (key) {
      case "leadCount":
        return company.leadCount || 0;
      case "totalDealValue":
        return company.totalDealValue || 0;
      default:
        return company[key] as string || "";
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
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

  const allSelected = companies.length > 0 && companies.every((c) => selectedIds.has(c.id));
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

  if (loading) {
    return (
      <div className="company-table-loading">
        <div className="spinner" />
        <span>Loading companies...</span>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="company-table-empty">
        <Building2 className="empty-icon" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`company-table-wrapper ${compact ? "compact" : ""}`}>
      <div className="table-scroll">
        <table className="company-table">
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
                  Company
                  {getSortIcon("name")}
                </span>
              </th>
              <th className="col-category" onClick={() => handleSort("category")}>
                <span className="header-content">
                  Category
                  {getSortIcon("category")}
                </span>
              </th>
              <th className="col-contact">Contact</th>
              <th className="col-leads" onClick={() => handleSort("leadCount")}>
                <span className="header-content">
                  <Users className="header-icon" />
                  Leads
                  {getSortIcon("leadCount")}
                </span>
              </th>
              <th className="col-value" onClick={() => handleSort("totalDealValue")}>
                <span className="header-content">
                  <TrendingUp className="header-icon" />
                  Value
                  {getSortIcon("totalDealValue")}
                </span>
              </th>
              <th className="col-rating" onClick={() => handleSort("googleRating")}>
                <span className="header-content">
                  <Star className="header-icon" />
                  Rating
                  {getSortIcon("googleRating")}
                </span>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCompanies.map((company) => {
              const isSelected = selectedIds.has(company.id);
              const isExpanded = expandedRows.has(company.id);
              const hasDetails = company.phone || company.email || company.address || company.website;

              return (
                <tr 
                  key={company.id} 
                  className={`${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                >
                  {onSelectRow && (
                    <td className="col-select" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(company.id)}
                        className="select-checkbox"
                      />
                    </td>
                  )}
                  <td className="col-name">
                    <div className="company-cell">
                      <div className="company-avatar">
                        {company.logoUrl ? (
                          <img src={company.logoUrl} alt={company.name} className="avatar-img" />
                        ) : (
                          <span className="avatar-initials">{company.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="company-info">
                        <Link href={`/companies/${company.id}`} className="company-name">
                          {company.name}
                        </Link>
                        {company.tags && company.tags.length > 0 && (
                          <div className="company-tags">
                            {company.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="tag">#{tag}</span>
                            ))}
                            {company.tags.length > 2 && (
                              <span className="tag-more">+{company.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="col-category">
                    <span className={`category-badge ${company.category?.toLowerCase() || "other"}`}>
                      {company.category || "Other"}
                    </span>
                  </td>
                  <td className="col-contact">
                    <div className="contact-info">
                      {company.phone && (
                        <span className="contact-item">
                          <Phone className="contact-icon" />
                          {formatPhone(company.phone)}
                        </span>
                      )}
                      {company.email && (
                        <span className="contact-item">
                          <Mail className="contact-icon" />
                          {company.email}
                        </span>
                      )}
                      {!company.phone && !company.email && (
                        <span className="contact-empty">—</span>
                      )}
                    </div>
                  </td>
                  <td className="col-leads">
                    <span className="leads-count">{company.leadCount || 0}</span>
                  </td>
                  <td className="col-value">
                    <span className="value-amount">
                      {formatCurrency(company.totalDealValue || 0)}
                    </span>
                  </td>
                  <td className="col-rating">
                    {company.googleRating ? (
                      <span className="rating">
                        <Star className="rating-star" />
                        {company.googleRating}
                        <span className="rating-reviews">
                          ({company.googleReviews || 0})
                        </span>
                      </span>
                    ) : (
                      <span className="rating-empty">—</span>
                    )}
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      {onView && (
                        <button
                          type="button"
                          className="action-btn view"
                          onClick={() => onView(company.id)}
                          aria-label="View company"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => onEdit(company.id)}
                          aria-label="Edit company"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => onDelete(company.id)}
                          aria-label="Delete company"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                      {hasDetails && (
                        <button
                          type="button"
                          className="action-btn expand"
                          onClick={() => toggleRowExpansion(company.id)}
                          aria-label="Toggle details"
                        >
                          <MoreHorizontal className="w-4 h-4" />
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
          <span>{selectedIds.size} company{selectedIds.size > 1 ? 'ies' : ''} selected</span>
        </div>
      )}

      <style jsx>{`
        .company-table-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .company-table-wrapper.compact {
          font-size: 0.8rem;
        }

        .company-table-wrapper.compact .company-cell {
          gap: 0.5rem;
        }

        .company-table-wrapper.compact .company-avatar {
          width: 28px;
          height: 28px;
        }

        .company-table-wrapper.compact .avatar-initials {
          font-size: 0.7rem;
        }

        .company-table-wrapper.compact .col-name,
        .company-table-wrapper.compact .col-category,
        .company-table-wrapper.compact .col-contact,
        .company-table-wrapper.compact .col-leads,
        .company-table-wrapper.compact .col-value,
        .company-table-wrapper.compact .col-rating,
        .company-table-wrapper.compact .col-actions {
          padding: 0.3rem 0.6rem;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .company-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        /* Header */
        .company-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .company-table th {
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

        .company-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .company-table th.sortable:hover {
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
        .company-table tbody tr {
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .company-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .company-table tbody tr.selected {
          background: rgba(244, 197, 66, 0.04);
        }

        .company-table td {
          padding: 0.5rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Company Cell */
        .company-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .company-avatar {
          flex-shrink: 0;
        }

        .company-avatar .avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          object-fit: cover;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .company-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .company-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .company-name:hover {
          color: #f4c542;
        }

        .company-tags {
          display: flex;
          gap: 0.15rem;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 0.6rem;
          padding: 0.05rem 0.3rem;
          border-radius: 3px;
          background: rgba(244, 197, 66, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.04);
          color: rgba(255, 255, 255, 0.2);
        }

        .tag-more {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        /* Category Badge */
        .category-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
        }

        .category-badge.technology {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.12);
        }

        .category-badge.healthcare {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .category-badge.retail {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.12);
        }

        .category-badge.finance {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .category-badge.education {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.12);
        }

        .category-badge.other {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
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
          font-size: 0.75rem;
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

        /* Leads */
        .leads-count {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Value */
        .value-amount {
          font-weight: 600;
          color: #f4c542;
        }

        /* Rating */
        .rating {
          display: inline-flex;
          align-items: center;
          gap: 0.15rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .rating-star {
          width: 14px;
          height: 14px;
          color: #f4c542;
          fill: #f4c542;
        }

        .rating-reviews {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .rating-empty {
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

        .action-btn.expand:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        /* Selection Info */
        .selection-info {
          padding: 0.5rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Loading */
        .company-table-loading {
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
        .company-table-empty {
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

        .company-table-empty p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .col-rating {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .col-contact {
            display: none;
          }

          .col-category {
            display: none;
          }

          .col-leads {
            display: none;
          }

          .col-value {
            display: none;
          }

          .company-table th,
          .company-table td {
            padding: 0.4rem 0.6rem;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }
        }

        @media (max-width: 480px) {
          .company-table {
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

          .company-name {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}