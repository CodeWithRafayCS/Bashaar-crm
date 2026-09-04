"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Task } from "@/lib/types";
import { formatDate, formatDateShort, taskDueKind } from "@/lib/utils/format";
import {
  CheckCircle,
  Circle,
  Clock,
  Flag,
  Calendar,
  User,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  loading?: boolean;
  compact?: boolean;
  showFilters?: boolean;
  emptyMessage?: string;
}

type SortKey = "dueDate" | "priority" | "status" | "createdAt" | "title";
type SortDirection = "asc" | "desc";

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };
const STATUS_ORDER = { Overdue: 0, "In Progress": 1, Pending: 2, Completed: 3 };

export function TaskList({
  tasks,
  onComplete,
  onEdit,
  onDelete,
  onView,
  loading = false,
  compact = false,
  showFilters = true,
  emptyMessage = "No tasks found",
}: TaskListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
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

  const getSortValue = (task: Task, key: SortKey): string | number => {
    switch (key) {
      case "dueDate":
        return task.dueDate || "";
      case "priority":
        return PRIORITY_ORDER[task.priority as keyof typeof PRIORITY_ORDER] ?? 1;
      case "status":
        return STATUS_ORDER[task.status as keyof typeof STATUS_ORDER] ?? 2;
      case "createdAt":
        return task.createdAt;
      case "title":
        return task.title;
      default:
        return "";
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.company?.toLowerCase().includes(term) ||
          t.assigneeEmail?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
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
  }, [tasks, searchTerm, filterStatus, filterPriority, sortKey, sortDirection]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" 
      ? <ChevronUp className="sort-icon active" />
      : <ChevronDown className="sort-icon active" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "#ff4444";
      case "Medium": return "#ffc107";
      case "Low": return "#00c853";
      default: return "#ffc107";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <Flag className="priority-icon high" />;
      case "Medium": return <Flag className="priority-icon medium" />;
      case "Low": return <Flag className="priority-icon low" />;
      default: return <Flag className="priority-icon medium" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return <CheckCircle className="status-icon completed" />;
      case "In Progress": return <Clock className="status-icon in-progress" />;
      case "Pending": return <Circle className="status-icon pending" />;
      case "Overdue": return <AlertCircle className="status-icon overdue" />;
      default: return <Circle className="status-icon pending" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "#00c853";
      case "In Progress": return "#4285f4";
      case "Pending": return "#ffc107";
      case "Overdue": return "#ff4444";
      default: return "#ffc107";
    }
  };

  const handleComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onComplete?.(id);
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

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="spinner" />
        <span>Loading tasks...</span>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">✅</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`task-list-wrapper ${compact ? "compact" : ""}`}>
      {/* Filters */}
      {showFilters && (
        <div className="task-list-filters">
          <div className="filter-group">
            <Search className="filter-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            className="clear-filters"
            onClick={() => {
              setFilterStatus("all");
              setFilterPriority("all");
              setSearchTerm("");
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="table-scroll">
        <table className="task-table">
          <thead>
            <tr>
              <th className="col-status">Status</th>
              <th className="col-title" onClick={() => handleSort("title")}>
                <span className="header-content">
                  Task
                  {getSortIcon("title")}
                </span>
              </th>
              <th className="col-priority" onClick={() => handleSort("priority")}>
                <span className="header-content">
                  Priority
                  {getSortIcon("priority")}
                </span>
              </th>
              <th className="col-assignee">Assignee</th>
              <th className="col-due" onClick={() => handleSort("dueDate")}>
                <span className="header-content">
                  Due Date
                  {getSortIcon("dueDate")}
                </span>
              </th>
              <th className="col-status-label" onClick={() => handleSort("status")}>
                <span className="header-content">
                  Status
                  {getSortIcon("status")}
                </span>
              </th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results">
                  <span>No tasks match your filters</span>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < new Date();
                const isCompleted = task.status === "Completed";
                const priorityColor = getPriorityColor(task.priority);
                const priorityIcon = getPriorityIcon(task.priority);
                const statusIcon = getStatusIcon(task.status);
                const statusColor = getStatusColor(task.status);

                return (
                  <tr 
                    key={task.id} 
                    className={`${isCompleted ? "completed" : ""} ${isOverdue ? "overdue" : ""}`}
                    onClick={() => onView?.(task.id)}
                  >
                    <td className="col-status">
                      <button
                        type="button"
                        className="status-btn"
                        onClick={(e) => handleComplete(e, task.id)}
                        aria-label={isCompleted ? "Reopen task" : "Complete task"}
                      >
                        {statusIcon}
                      </button>
                    </td>
                    <td className="col-title">
                      <div className="task-cell">
                        <span className="task-title">{task.title}</span>
                        {task.company && (
                          <span className="task-company">{task.company}</span>
                        )}
                        {task.leadId && (
                          <Link
                            href={`/leads/${task.leadId}`}
                            className="task-lead-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Eye className="w-3 h-3" />
                            View Lead
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="col-priority">
                      <span className="priority-badge" style={{ color: priorityColor }}>
                        {priorityIcon}
                        {task.priority}
                      </span>
                    </td>
                    <td className="col-assignee">
                      <span className="assignee-name">
                        <User className="assignee-icon" />
                        {task.assigneeEmail ? task.assigneeEmail.split("@")[0] : "Unassigned"}
                      </span>
                    </td>
                    <td className="col-due">
                      <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
                        <Calendar className="due-icon" />
                        {task.dueDate ? formatDateShort(task.dueDate) : "No date"}
                        {isOverdue && " ⚠️"}
                      </span>
                    </td>
                    <td className="col-status-label">
                      <span className="status-badge" style={{ color: statusColor }}>
                        {task.status}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        {onEdit && (
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={(e) => handleAction(e, () => onEdit(task))}
                            aria-label="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={(e) => handleAction(e, () => onDelete(task.id))}
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <div className="dropdown-wrapper">
                          <button
                            type="button"
                            className="action-btn more"
                            onClick={(e) => handleMenuToggle(e, task.id)}
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showMenu === task.id && (
                            <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                              {onView && (
                                <button onClick={() => { onView(task.id); setShowMenu(null); }}>
                                  <Eye className="w-3 h-3" />
                                  View Details
                                </button>
                              )}
                              {onEdit && (
                                <button onClick={() => { onEdit(task); setShowMenu(null); }}>
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                              )}
                              {onDelete && (
                                <button 
                                  className="danger"
                                  onClick={() => { onDelete(task.id); setShowMenu(null); }}
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
        .task-list-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .task-list-wrapper.compact {
          font-size: 0.8rem;
        }

        .task-list-wrapper.compact .task-title {
          font-size: 0.8rem;
        }

        .task-list-wrapper.compact .task-cell {
          gap: 0.15rem;
        }

        /* Loading */
        .task-list-loading {
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
        .task-list-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          font-size: 2.5rem;
          opacity: 0.3;
        }

        .task-list-empty p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Filters */
        .task-list-filters {
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

        .task-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .task-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .task-table th {
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

        .task-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .task-table th.sortable:hover {
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

        .task-table td {
          padding: 0.4rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .task-table tbody tr {
          transition: background 0.2s;
          cursor: pointer;
        }

        .task-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .task-table tbody tr.completed {
          opacity: 0.5;
        }

        .task-table tbody tr.completed .task-title {
          text-decoration: line-through;
        }

        .task-table tbody tr.overdue {
          border-left: 3px solid #ff4444;
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
        }

        /* Status Column */
        .col-status {
          width: 40px;
          text-align: center;
        }

        .status-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .status-icon {
          width: 18px;
          height: 18px;
          transition: all 0.3s;
        }

        .status-icon.completed {
          color: #00c853;
        }

        .status-icon.in-progress {
          color: #4285f4;
        }

        .status-icon.pending {
          color: #ffc107;
        }

        .status-icon.overdue {
          color: #ff4444;
        }

        .status-btn:hover .status-icon {
          transform: scale(1.1);
        }

        /* Title Column */
        .task-cell {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .task-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .task-company {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .task-lead-link {
          display: inline-flex;
          align-items: center;
          gap: 0.15rem;
          font-size: 0.6rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }

        .task-lead-link:hover {
          color: #f4c542;
        }

        /* Priority Column */
        .priority-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .priority-icon {
          width: 14px;
          height: 14px;
        }

        .priority-icon.high {
          color: #ff4444;
        }

        .priority-icon.medium {
          color: #ffc107;
        }

        .priority-icon.low {
          color: #00c853;
        }

        /* Assignee Column */
        .assignee-name {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .assignee-icon {
          width: 14px;
          height: 14px;
        }

        /* Due Date Column */
        .due-date {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .due-date.overdue {
          color: #ff4444;
        }

        .due-icon {
          width: 14px;
          height: 14px;
        }

        /* Status Label Column */
        .status-badge {
          font-size: 0.7rem;
          font-weight: 500;
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
          .col-priority {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .col-assignee {
            display: none;
          }

          .col-due {
            display: none;
          }

          .col-status-label {
            display: none;
          }

          .task-list-filters {
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

          .task-table th,
          .task-table td {
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
          .task-table {
            font-size: 0.75rem;
          }

          .col-title {
            min-width: 120px;
          }

          .task-title {
            font-size: 0.75rem;
          }

          .status-btn {
            width: 22px;
            height: 22px;
          }

          .status-icon {
            width: 14px;
            height: 14px;
          }

          .dropdown-menu {
            min-width: 120px;
            right: -0.5rem;
          }
        }
      `}</style>
    </div>
  );
}