"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { User } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  CheckSquare,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react";

interface TeamMemberListProps {
  members: User[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  loading?: boolean;
  compact?: boolean;
  showFilters?: boolean;
  emptyMessage?: string;
  showStats?: boolean;
}

type SortKey = "name" | "role" | "status" | "leadsCreated" | "dealsWon" | "tasksCompleted" | "joinedAt";
type SortDirection = "asc" | "desc";

const ROLE_ORDER = { Admin: 0, Manager: 1, "Sales User": 2, Viewer: 3 };

export function TeamMemberList({
  members,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  loading = false,
  compact = false,
  showFilters = true,
  emptyMessage = "No team members found",
  showStats = true,
}: TeamMemberListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortValue = (member: User, key: SortKey): string | number => {
    switch (key) {
      case "name":
        return member.name;
      case "role":
        return ROLE_ORDER[member.role as keyof typeof ROLE_ORDER] ?? 999;
      case "status":
        return member.active ? 0 : 1;
      case "leadsCreated":
        return member.leadsCreated || 0;
      case "dealsWon":
        return member.dealsWon || 0;
      case "tasksCompleted":
        return member.tasksCompleted || 0;
      case "joinedAt":
        return member.joinedAt || "";
      default:
        return "";
    }
  };

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          m.role.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((m) => m.role === filterRole);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((m) => m.active === (filterStatus === "active"));
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" 
          ? aVal - bVal
          : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [members, searchTerm, filterRole, filterStatus, sortKey, sortDirection]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" 
      ? <ChevronUp className="sort-icon active" />
      : <ChevronDown className="sort-icon active" />;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Shield className="role-icon admin" />;
      case "Manager": return <Users className="role-icon manager" />;
      case "Sales User": return <TrendingUp className="role-icon sales" />;
      case "Viewer": return <Eye className="role-icon viewer" />;
      default: return <UserIcon className="role-icon" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "#f4c542";
      case "Manager": return "#4285f4";
      case "Sales User": return "#00c853";
      case "Viewer": return "#9c27b0";
      default: return "#ffffff";
    }
  };

  const getStatusColor = (active: boolean) => {
    return active ? "#00c853" : "#ff4444";
  };

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShowMenu(showMenu === id ? null : id);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(null);
  };

  const totalStats = useMemo(() => {
    return members.reduce(
      (acc, m) => ({
        leads: acc.leads + (m.leadsCreated || 0),
        deals: acc.deals + (m.dealsWon || 0),
        tasks: acc.tasks + (m.tasksCompleted || 0),
        active: acc.active + (m.active ? 1 : 0),
      }),
      { leads: 0, deals: 0, tasks: 0, active: 0 }
    );
  }, [members]);

  if (loading) {
    return (
      <div className="member-list-loading">
        <div className="spinner" />
        <span>Loading team members...</span>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="member-list-empty">
        <Users className="empty-icon" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`member-list-wrapper ${compact ? "compact" : ""}`}>
      {/* Stats */}
      {showStats && (
        <div className="member-stats-bar">
          <div className="stat-item">
            <Users className="stat-icon" />
            <span className="stat-value">{members.length}</span>
            <span className="stat-label">Total Members</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <CheckCircle className="stat-icon green" />
            <span className="stat-value">{totalStats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <TrendingUp className="stat-icon gold" />
            <span className="stat-value">{totalStats.deals}</span>
            <span className="stat-label">Deals Won</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <CheckSquare className="stat-icon blue" />
            <span className="stat-value">{totalStats.tasks}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="member-filters">
          <div className="filter-group">
            <Search className="filter-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search members..."
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Sales User">Sales User</option>
            <option value="Viewer">Viewer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            className="clear-filters"
            onClick={() => {
              setFilterRole("all");
              setFilterStatus("all");
              setSearchTerm("");
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-scroll">
        <table className="member-table">
          <thead>
            <tr>
              <th className="col-member" onClick={() => handleSort("name")}>
                <span className="header-content">
                  Member
                  {getSortIcon("name")}
                </span>
              </th>
              <th className="col-role" onClick={() => handleSort("role")}>
                <span className="header-content">
                  Role
                  {getSortIcon("role")}
                </span>
              </th>
              <th className="col-contact">Contact</th>
              <th className="col-status" onClick={() => handleSort("status")}>
                <span className="header-content">
                  Status
                  {getSortIcon("status")}
                </span>
              </th>
              <th className="col-leads" onClick={() => handleSort("leadsCreated")}>
                <span className="header-content">
                  Leads
                  {getSortIcon("leadsCreated")}
                </span>
              </th>
              <th className="col-deals" onClick={() => handleSort("dealsWon")}>
                <span className="header-content">
                  Won
                  {getSortIcon("dealsWon")}
                </span>
              </th>
              <th className="col-tasks" onClick={() => handleSort("tasksCompleted")}>
                <span className="header-content">
                  Tasks
                  {getSortIcon("tasksCompleted")}
                </span>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-results">
                  <span>No members match your filters</span>
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => {
                const isActive = member.active;
                const roleColor = getRoleColor(member.role);
                const statusColor = getStatusColor(isActive);

                return (
                  <tr 
                    key={member.id} 
                    className={isActive ? "active" : "inactive"}
                    onClick={() => onView?.(member.id)}
                  >
                    <td className="col-member">
                      <div className="member-cell">
                        <div className="member-avatar">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-info">
                          <span className="member-name">{member.name}</span>
                          <span className="member-email">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="col-role">
                      <span className="role-badge" style={{ color: roleColor }}>
                        {getRoleIcon(member.role)}
                        {member.role}
                      </span>
                    </td>
                    <td className="col-contact">
                      {member.phone && (
                        <span className="contact-item">
                          <Phone className="contact-icon" />
                          {member.phone}
                        </span>
                      )}
                      {!member.phone && (
                        <span className="contact-empty">—</span>
                      )}
                    </td>
                    <td className="col-status">
                      <span className="status-badge" style={{ color: statusColor }}>
                        {isActive ? (
                          <CheckCircle className="status-icon active" />
                        ) : (
                          <XCircle className="status-icon inactive" />
                        )}
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="col-leads">
                      <span className="stat-number">{member.leadsCreated || 0}</span>
                    </td>
                    <td className="col-deals">
                      <span className="stat-number gold">{member.dealsWon || 0}</span>
                    </td>
                    <td className="col-tasks">
                      <span className="stat-number">{member.tasksCompleted || 0}</span>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        {onView && (
                          <button
                            type="button"
                            className="action-btn view"
                            onClick={(e) => handleAction(e, () => onView(member.id))}
                            aria-label="View member"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={(e) => handleAction(e, () => onEdit(member.id))}
                            aria-label="Edit member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={(e) => handleAction(e, () => onDelete(member.id))}
                            aria-label="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="dropdown-wrapper">
                          <button
                            type="button"
                            className="action-btn more"
                            onClick={(e) => handleMenuToggle(e, member.id)}
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showMenu === member.id && (
                            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                              {onToggleActive && (
                                <button onClick={() => { onToggleActive(member.id); setShowMenu(null); }}>
                                  {isActive ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                  {isActive ? "Deactivate" : "Activate"}
                                </button>
                              )}
                              {onEdit && (
                                <button onClick={() => { onEdit(member.id); setShowMenu(null); }}>
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                              )}
                              {onDelete && (
                                <button 
                                  className="danger"
                                  onClick={() => { onDelete(member.id); setShowMenu(null); }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .member-list-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .member-list-wrapper.compact {
          font-size: 0.8rem;
        }

        .member-list-wrapper.compact .member-cell {
          gap: 0.5rem;
        }

        .member-list-wrapper.compact .member-avatar {
          width: 28px;
          height: 28px;
          font-size: 0.7rem;
        }

        .member-list-wrapper.compact .member-name {
          font-size: 0.8rem;
        }

        .member-list-wrapper.compact .member-email {
          font-size: 0.6rem;
        }

        /* Loading */
        .member-list-loading {
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
        .member-list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          opacity: 0.2;
        }

        .member-list-empty p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Stats Bar */
        .member-stats-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stat-icon {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon.green {
          color: #00c853;
        }

        .stat-icon.gold {
          color: #f4c542;
        }

        .stat-icon.blue {
          color: #4285f4;
        }

        .stat-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        .stat-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Filters */
        .member-filters {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-group {
          position: relative;
          flex: 1;
          min-width: 150px;
        }

        .filter-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.6rem 0.3rem 2rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .clear-search {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          font-size: 0.7rem;
          font-family: inherit;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          font-family: inherit;
          cursor: pointer;
          min-width: 120px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .clear-filters {
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .clear-filters:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        /* Table */
        .table-scroll {
          overflow-x: auto;
        }

        .member-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .member-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .member-table th {
          padding: 0.5rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.2);
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }

        .member-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .member-table th.sortable:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        .header-content {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .sort-icon {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.1);
        }

        .sort-icon.active {
          color: #f4c542;
        }

        .member-table td {
          padding: 0.4rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .member-table tbody tr {
          transition: background 0.2s;
          cursor: pointer;
        }

        .member-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .member-table tbody tr.inactive {
          opacity: 0.5;
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
        }

        /* Member Cell */
        .member-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .member-avatar {
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
          flex-shrink: 0;
        }

        .member-info {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .member-email {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Role */
        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .role-icon {
          width: 14px;
          height: 14px;
        }

        .role-icon.admin {
          color: #f4c542;
        }

        .role-icon.manager {
          color: #4285f4;
        }

        .role-icon.sales {
          color: #00c853;
        }

        .role-icon.viewer {
          color: #9c27b0;
        }

        /* Contact */
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .contact-icon {
          width: 12px;
          height: 12px;
        }

        .contact-empty {
          color: rgba(255, 255, 255, 0.05);
        }

        /* Status */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .status-icon {
          width: 14px;
          height: 14px;
        }

        .status-icon.active {
          color: #00c853;
        }

        .status-icon.inactive {
          color: #ff4444;
        }

        /* Stats */
        .stat-number {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        .stat-number.gold {
          color: #f4c542;
        }

        /* Actions */
        .col-actions {
          width: 100px;
          text-align: right;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .action-btn.view:hover {
          color: #4285f4;
        }

        .action-btn.edit:hover {
          color: #f4c542;
        }

        .action-btn.delete:hover {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.04);
        }

        .action-btn.more:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          min-width: 140px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 0.2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          z-index: 10;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          font-family: inherit;
        }

        .dropdown-menu button:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .dropdown-menu button.danger:hover {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.06);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .col-contact {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .col-deals {
            display: none;
          }

          .col-leads {
            display: none;
          }

          .col-tasks {
            display: none;
          }

          .member-filters {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            min-width: 100%;
          }

          .filter-select {
            width: 100%;
          }

          .clear-filters {
            width: 100%;
            text-align: center;
          }

          .member-stats-bar {
            justify-content: center;
            gap: 0.5rem;
          }

          .member-table th,
          .member-table td {
            padding: 0.3rem 0.5rem;
          }

          .col-actions {
            width: 80px;
          }

          .action-btn {
            width: 24px;
            height: 24px;
          }

          .action-btn svg {
            width: 14px;
            height: 14px;
          }
        }

        @media (max-width: 480px) {
          .member-table {
            font-size: 0.75rem;
          }

          .col-member {
            min-width: 100px;
          }

          .member-avatar {
            width: 24px;
            height: 24px;
            font-size: 0.6rem;
          }

          .member-name {
            font-size: 0.75rem;
          }

          .member-email {
            font-size: 0.55rem;
          }

          .member-stats-bar {
            flex-wrap: wrap;
            gap: 0.3rem;
          }

          .stat-divider {
            display: none;
          }

          .dropdown-menu {
            right: -0.5rem;
            min-width: 120px;
          }

          .role-badge {
            font-size: 0.65rem;
          }

          .status-badge {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}