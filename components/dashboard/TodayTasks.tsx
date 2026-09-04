"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Task } from "@/lib/types";
import { formatDate, formatTime, taskDueKind } from "@/lib/utils/format";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle, 
  Calendar,
  ChevronRight,
  Flag,
  User
} from "lucide-react";

interface TodayTasksProps {
  tasks: Task[];
  maxItems?: number;
  onComplete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  compact?: boolean;
  showViewAll?: boolean;
}

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  High: <Flag className="priority-icon high" />,
  Medium: <Flag className="priority-icon medium" />,
  Low: <Flag className="priority-icon low" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  High: "#ff4444",
  Medium: "#ffc107",
  Low: "#00c853",
};

export function TodayTasks({
  tasks,
  maxItems = 5,
  onComplete,
  onEdit,
  compact = false,
  showViewAll = true,
}: TodayTasksProps) {
  const { overdueTasks, todayTasks, upcomingTasks, completedTasks } = useMemo(() => {
    const overdue: Task[] = [];
    const today: Task[] = [];
    const upcoming: Task[] = [];
    const completed: Task[] = [];

    tasks.forEach((task) => {
      if (task.status === "Completed") {
        completed.push(task);
        return;
      }

      const kind = taskDueKind(task.dueDate);
      if (kind === "overdue") overdue.push(task);
      else if (kind === "today") today.push(task);
      else upcoming.push(task);
    });

    return {
      overdueTasks: overdue,
      todayTasks: today,
      upcomingTasks: upcoming,
      completedTasks: completed,
    };
  }, [tasks]);

  const displayTasks = useMemo(() => {
    const all = [...overdueTasks, ...todayTasks, ...upcomingTasks];
    return all.slice(0, maxItems);
  }, [overdueTasks, todayTasks, upcomingTasks, maxItems]);

  const hasMore = tasks.length > maxItems;

  if (tasks.length === 0) {
    return (
      <div className="today-tasks-empty">
        <div className="empty-icon">✅</div>
        <p className="empty-text">No tasks</p>
        <p className="empty-subtext">You're all caught up!</p>

        <style jsx>{`
          .today-tasks-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            text-align: center;
          }

          .empty-icon {
            font-size: 2rem;
            opacity: 0.2;
            margin-bottom: 0.3rem;
          }

          .empty-text {
            font-size: 0.85rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.2);
            margin: 0;
          }

          .empty-subtext {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.08);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`today-tasks ${compact ? "compact" : ""}`}>
      {/* Stats */}
      {!compact && (
        <div className="task-stats">
          {overdueTasks.length > 0 && (
            <span className="stat-badge overdue">
              <AlertCircle className="stat-icon" />
              {overdueTasks.length} overdue
            </span>
          )}
          {todayTasks.length > 0 && (
            <span className="stat-badge today">
              <Clock className="stat-icon" />
              {todayTasks.length} due today
            </span>
          )}
          {upcomingTasks.length > 0 && (
            <span className="stat-badge upcoming">
              <Calendar className="stat-icon" />
              {upcomingTasks.length} upcoming
            </span>
          )}
          {completedTasks.length > 0 && (
            <span className="stat-badge completed">
              <CheckCircle className="stat-icon" />
              {completedTasks.length} completed
            </span>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {displayTasks.map((task) => {
          const isOverdue = taskDueKind(task.dueDate) === "overdue";
          const isToday = taskDueKind(task.dueDate) === "today";
          const priorityIcon = PRIORITY_ICONS[task.priority] || null;
          const priorityColor = PRIORITY_COLORS[task.priority] || "#ffffff";
          const dueDate = task.dueDate ? new Date(task.dueDate) : null;

          return (
            <div 
              key={task.id} 
              className={`task-item ${isOverdue ? "overdue" : ""} ${isToday ? "today" : ""}`}
              onClick={() => onEdit?.(task)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onEdit?.(task)}
            >
              {/* Status */}
              <button
                type="button"
                className="task-status"
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete?.(task.id);
                }}
                aria-label={task.status === "Completed" ? "Reopen task" : "Complete task"}
              >
                {task.status === "Completed" ? (
                  <CheckCircle className="status-icon completed" />
                ) : (
                  <Circle className="status-icon pending" />
                )}
              </button>

              {/* Content */}
              <div className="task-content">
                <div className="task-header">
                  <span className={`task-title ${task.status === "Completed" ? "completed" : ""}`}>
                    {task.title}
                  </span>
                  <div className="task-meta">
                    {priorityIcon && (
                      <span className="task-priority" style={{ color: priorityColor }}>
                        {priorityIcon}
                      </span>
                    )}
                    {task.assigneeEmail && (
                      <span className="task-assignee">
                        <User className="assignee-icon" />
                        {task.assigneeEmail.split('@')[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="task-footer">
                  {dueDate && (
                    <span className={`task-due ${isOverdue ? "overdue" : ""}`}>
                      <Calendar className="due-icon" />
                      {isOverdue ? "Overdue" : isToday ? "Today" : formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.leadId && (
                    <Link
                      href={`/leads/${task.leadId}`}
                      className="task-lead"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View lead
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showViewAll && hasMore && (
        <div className="view-all-wrapper">
          <Link href="/tasks" className="view-all-link">
            View all tasks ({tasks.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <style jsx>{`
        .today-tasks {
          width: 100%;
        }

        .today-tasks.compact .task-item {
          padding: 0.3rem 0.5rem;
        }

        .today-tasks.compact .task-title {
          font-size: 0.8rem;
        }

        .today-tasks.compact .task-meta {
          font-size: 0.6rem;
        }

        .today-tasks.compact .task-footer {
          font-size: 0.6rem;
        }

        /* Stats */
        .task-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 0.75rem;
        }

        .stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
        }

        .stat-badge.overdue {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.08);
        }

        .stat-badge.today {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.08);
        }

        .stat-badge.upcoming {
          background: rgba(66, 133, 244, 0.06);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.08);
        }

        .stat-badge.completed {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.08);
        }

        .stat-icon {
          width: 12px;
          height: 12px;
        }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .task-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .task-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .task-item.overdue {
          border-color: rgba(255, 68, 68, 0.08);
          background: rgba(255, 68, 68, 0.02);
        }

        .task-item.overdue:hover {
          border-color: rgba(255, 68, 68, 0.12);
          background: rgba(255, 68, 68, 0.04);
        }

        .task-item.today {
          border-color: rgba(244, 197, 66, 0.06);
        }

        /* Status */
        .task-status {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .status-icon {
          width: 18px;
          height: 18px;
          transition: all 0.3s;
        }

        .status-icon.pending {
          color: rgba(255, 255, 255, 0.15);
        }

        .task-status:hover .status-icon.pending {
          color: rgba(244, 197, 66, 0.4);
        }

        .status-icon.completed {
          color: #00c853;
        }

        .task-status:hover .status-icon.completed {
          transform: scale(1.1);
        }

        /* Content */
        .task-content {
          flex: 1;
          min-width: 0;
        }

        .task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .task-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s;
        }

        .task-title.completed {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.15);
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
        }

        .task-priority {
          display: flex;
          align-items: center;
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

        .task-assignee {
          display: flex;
          align-items: center;
          gap: 0.15rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .assignee-icon {
          width: 12px;
          height: 12px;
        }

        /* Footer */
        .task-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.1rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .task-due {
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        .task-due.overdue {
          color: #ff4444;
        }

        .due-icon {
          width: 12px;
          height: 12px;
        }

        .task-lead {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }

        .task-lead:hover {
          color: #f4c542;
        }

        /* View All */
        .view-all-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all-link:hover {
          color: #f4c542;
        }

        .view-all-link svg {
          transition: transform 0.3s;
        }

        .view-all-link:hover svg {
          transform: translateX(2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .task-item {
            padding: 0.3rem 0.4rem;
          }

          .task-title {
            font-size: 0.8rem;
          }

          .task-footer {
            font-size: 0.6rem;
          }

          .task-stats {
            gap: 0.2rem;
          }

          .stat-badge {
            font-size: 0.6rem;
            padding: 0.1rem 0.4rem;
          }
        }

        @media (max-width: 480px) {
          .task-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }

          .task-meta {
            width: 100%;
            justify-content: flex-start;
          }

          .task-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }

          .task-status {
            width: 20px;
            height: 20px;
          }

          .status-icon {
            width: 16px;
            height: 16px;
          }

          .task-stats {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}