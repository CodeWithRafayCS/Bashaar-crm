"use client";

import { useState } from "react";
import Link from "next/link";
import type { Task } from "@/lib/types";
import { formatDate, formatDateShort } from "@/lib/utils/format";
import {
  CheckCircle,
  Circle,
  Clock,
  Flag,
  Calendar,
  User,
  Edit2,
  Trash2,
  MoreVertical,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onReschedule?: (task: Task) => void;
  onClick?: (task: Task) => void;
  compact?: boolean;
  showActions?: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  High: "#ff4444",
  Medium: "#ffc107",
  Low: "#00c853",
};

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  High: <Flag className="priority-icon high" />,
  Medium: <Flag className="priority-icon medium" />,
  Low: <Flag className="priority-icon low" />,
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Completed: <CheckCircle className="status-icon completed" />,
  "In Progress": <Clock className="status-icon in-progress" />,
  Pending: <Circle className="status-icon pending" />,
  Overdue: <AlertCircle className="status-icon overdue" />,
};

const STATUS_COLORS: Record<string, string> = {
  Completed: "#00c853",
  "In Progress": "#4285f4",
  Pending: "#ffc107",
  Overdue: "#ff4444",
};

export function TaskCard({
  task,
  onComplete,
  onEdit,
  onDelete,
  onReschedule,
  onClick,
  compact = false,
  showActions = true,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const priorityColor = PRIORITY_COLORS[task.priority] || "#ffc107";
  const priorityIcon = PRIORITY_ICONS[task.priority] || <Flag className="priority-icon medium" />;
  const statusIcon = STATUS_ICONS[task.status] || <Circle className="status-icon pending" />;
  const statusColor = STATUS_COLORS[task.status] || "#ffc107";

  const isOverdue = task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = task.status === "Completed";

  const handleCardClick = () => {
    onClick?.(task);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete?.(task.id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`task-card ${compact ? "compact" : ""} ${isCompleted ? "completed" : ""} ${isOverdue ? "overdue" : ""} ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      {/* Priority Indicator */}
      <div className="priority-indicator" style={{ background: priorityColor }} />

      {/* Status */}
      <button
        type="button"
        className="task-status"
        onClick={handleComplete}
        aria-label={isCompleted ? "Reopen task" : "Complete task"}
      >
        {statusIcon}
      </button>

      {/* Content */}
      <div className="task-content">
        <div className="task-header">
          <div className="task-title-wrapper">
            <span className={`task-title ${isCompleted ? "completed" : ""}`}>
              {task.title}
            </span>
            {task.company && (
              <span className="task-company">{task.company}</span>
            )}
          </div>
          <div className="task-meta">
            <span className="task-priority" style={{ color: priorityColor }}>
              {priorityIcon}
              {!compact && task.priority}
            </span>
            <span className="task-status-label" style={{ color: statusColor }}>
              {!compact && task.status}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && !compact && (
          <p className={`task-description ${isExpanded ? "expanded" : ""}`}>
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="task-footer">
          <div className="task-footer-left">
            {task.dueDate && (
              <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
                <Calendar className="due-icon" />
                {formatDateShort(task.dueDate)}
                {isOverdue && " (Overdue)"}
              </span>
            )}
            {task.assigneeEmail && (
              <span className="task-assignee">
                <User className="assignee-icon" />
                {compact ? task.assigneeEmail.split("@")[0] : task.assigneeEmail}
              </span>
            )}
          </div>
          <div className="task-footer-right">
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
            {showActions && !compact && (
              <div className="task-actions">
                <button
                  type="button"
                  className="action-btn expand"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <div className="dropdown-wrapper">
                  <button
                    type="button"
                    className="action-btn more"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </button>
                  {showMenu && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                      {onEdit && (
                        <button onClick={() => { onEdit(task); setShowMenu(false); }}>
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}
                      {onReschedule && (
                        <button onClick={() => { onReschedule(task); setShowMenu(false); }}>
                          <Calendar className="w-3 h-3" />
                          Reschedule
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="danger"
                          onClick={() => { handleDelete(); setShowMenu(false); }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
            <span>Delete this task?</span>
            <button
              type="button"
              className="confirm-yes"
              onClick={handleDelete}
            >
              <Check className="w-3 h-3" />
              Yes
            </button>
            <button
              type="button"
              className="confirm-no"
              onClick={handleCancelDelete}
            >
              <X className="w-3 h-3" />
              No
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .task-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .task-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.06);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .task-card.compact {
          padding: 0.5rem 0.75rem;
          gap: 0.5rem;
        }

        .task-card.compact .task-title {
          font-size: 0.8rem;
        }

        .task-card.compact .task-meta {
          font-size: 0.6rem;
        }

        .task-card.compact .task-footer {
          font-size: 0.6rem;
        }

        .task-card.completed {
          opacity: 0.6;
        }

        .task-card.completed .task-title {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.2);
        }

        .task-card.overdue {
          border-color: rgba(255, 68, 68, 0.08);
          background: rgba(255, 68, 68, 0.02);
        }

        .task-card.overdue:hover {
          border-color: rgba(255, 68, 68, 0.12);
          background: rgba(255, 68, 68, 0.04);
        }

        /* Priority Indicator */
        .priority-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          border-radius: 4px 0 0 4px;
        }

        /* Status */
        .task-status {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .status-icon {
          width: 20px;
          height: 20px;
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

        .task-status:hover .status-icon {
          transform: scale(1.1);
        }

        .task-status:hover .status-icon.pending {
          color: rgba(244, 197, 66, 0.4);
        }

        /* Content */
        .task-content {
          flex: 1;
          min-width: 0;
        }

        .task-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .task-title-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
          flex: 1;
          min-width: 0;
        }

        .task-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s;
          word-break: break-word;
        }

        .task-company {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .task-priority {
          display: flex;
          align-items: center;
          gap: 0.15rem;
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

        .task-status-label {
          font-weight: 500;
        }

        /* Description */
        .task-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.25);
          margin: 0.2rem 0 0 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: all 0.3s;
        }

        .task-description.expanded {
          -webkit-line-clamp: unset;
        }

        /* Footer */
        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .task-footer-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .task-due {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .task-due.overdue {
          color: #ff4444;
        }

        .due-icon {
          width: 12px;
          height: 12px;
        }

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .assignee-icon {
          width: 12px;
          height: 12px;
        }

        .task-footer-right {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .task-lead-link {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
          font-size: 0.6rem;
        }

        .task-lead-link:hover {
          color: #f4c542;
        }

        /* Actions */
        .task-actions {
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
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
          color: rgba(255, 255, 255, 0.3);
        }

        .action-btn.expand:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        .action-btn.more:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        /* Dropdown */
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

        /* Delete Confirm */
        .delete-confirm {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.3rem;
          padding: 0.3rem 0.5rem;
          background: rgba(255, 68, 68, 0.06);
          border: 1px solid rgba(255, 68, 68, 0.08);
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .delete-confirm span {
          flex: 1;
        }

        .confirm-yes,
        .confirm-no {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.1rem 0.4rem;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .confirm-yes {
          background: rgba(0, 200, 83, 0.06);
          border-color: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .confirm-yes:hover {
          background: rgba(0, 200, 83, 0.1);
        }

        .confirm-no {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .confirm-no:hover {
          background: rgba(255, 68, 68, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .task-card {
            padding: 0.5rem 0.75rem;
          }

          .task-title {
            font-size: 0.8rem;
          }

          .task-footer {
            font-size: 0.6rem;
          }

          .task-meta {
            font-size: 0.6rem;
          }

          .dropdown-menu {
            min-width: 120px;
          }
        }

        @media (max-width: 480px) {
          .task-card {
            padding: 0.4rem 0.5rem;
            gap: 0.4rem;
          }

          .task-status {
            width: 22px;
            height: 22px;
          }

          .status-icon {
            width: 16px;
            height: 16px;
          }

          .task-title {
            font-size: 0.75rem;
          }

          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }

          .task-meta {
            font-size: 0.55rem;
          }

          .task-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .task-footer-right {
            width: 100%;
            justify-content: flex-end;
          }

          .task-description {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}