"use client";

import { useMemo, useState } from "react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks } from "@/lib/hooks/useTasks";
import { updateTask } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { taskDueKind, formatDate } from "@/lib/utils/format";
import type { Task } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";

type View = "mine" | "team" | "overdue" | "today";

export default function TasksPage() {
  const { tasks } = useTasks();
  const { user, pushToast } = useAppStore();
  const [view, setView] = useState<View>("mine");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState<"list" | "calendar">("list");
  const [editing, setEditing] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const kind = t.status === "Completed" ? "upcoming" : taskDueKind(t.dueDate);
      if (view === "mine" && t.assigneeEmail !== user?.email) return false;
      if (view === "overdue" && kind !== "overdue") return false;
      if (view === "today" && kind !== "today") return false;
      if (priority && t.priority !== priority) return false;
      if (status === "Overdue" && kind !== "overdue") return false;
      if (status && status !== "Overdue" && t.status !== status) return false;
      return true;
    });
  }, [tasks, view, priority, status, user]);

  const viewLabels: Record<View, string> = {
    mine: "My Tasks",
    team: "Team Tasks",
    overdue: "Overdue",
    today: "Due Today",
  };

  const viewCounts = useMemo(() => {
    const counts: Record<View, number> = { mine: 0, team: 0, overdue: 0, today: 0 };
    tasks.forEach((t) => {
      const kind = t.status === "Completed" ? "upcoming" : taskDueKind(t.dueDate);
      if (t.assigneeEmail === user?.email) counts.mine++;
      if (kind === "overdue") counts.overdue++;
      if (kind === "today") counts.today++;
      counts.team++;
    });
    return counts;
  }, [tasks, user]);

  return (
    <div className="tasks-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Work queue</span>
          </div>
          <h1 className="page-title">
            Tasks
            <span className="title-count">{filtered.length}</span>
          </h1>
          <p className="page-subtitle">Manage your tasks and follow-ups</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              type="button"
              className={`view-btn ${mode === "list" ? "active" : ""}`}
              onClick={() => setMode("list")}
              aria-label="List view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List
            </button>
            <button
              type="button"
              className={`view-btn ${mode === "calendar" ? "active" : ""}`}
              onClick={() => setMode("calendar")}
              aria-label="Calendar view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Calendar
            </button>
          </div>
        </div>
      </header>

      {/* View Tabs */}
      <div className="tabs-wrapper">
        <div className="tabs" role="tablist">
          {(["mine", "team", "overdue", "today"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              className={`tab ${view === v ? "active" : ""}`}
              onClick={() => setView(v)}
            >
              {viewLabels[v]}
              <span className="tab-count">{viewCounts[v]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="filter-select"
            aria-label="Priority"
          >
            <option value="">All priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="filter-select"
            aria-label="Status"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {(priority || status) && (
          <button
            className="clear-filters"
            onClick={() => {
              setPriority("");
              setStatus("");
            }}
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No tasks in this view"
            body="Create a task from a lead detail page or add one manually."
          />
        </div>
      ) : mode === "list" ? (
        <div className="tasks-grid">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => {
                void updateTask(task.id, { status: "Completed" });
                pushToast("success", "Task completed");
              }}
              onEdit={() => setEditing(task)}
              onReschedule={() => setEditing(task)}
            />
          ))}
        </div>
      ) : (
        <div className="calendar-wrapper">
          <div className="calendar-header">
            <h3 className="calendar-title">Next 14 Days</h3>
            <span className="calendar-count">{filtered.length} tasks</span>
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 14 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const key = d.toISOString().slice(0, 10);
              const dayTasks = filtered.filter((t) => t.dueDate === key);
              const isToday = i === 0;
              const isOverdue = dayTasks.some((t) => taskDueKind(t.dueDate) === "overdue");

              return (
                <div key={key} className={`calendar-cell ${isToday ? "today" : ""} ${isOverdue ? "has-overdue" : ""}`}>
                  <div className="calendar-date">
                    <span className="calendar-day">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className={`calendar-number ${isToday ? "today-number" : ""}`}>{d.getDate()}</span>
                    <span className="calendar-month">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                  </div>
                  <div className="calendar-tasks">
                    {dayTasks.length === 0 ? (
                      <p className="calendar-empty">No tasks</p>
                    ) : (
                      dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`calendar-task ${taskDueKind(t.dueDate) === "overdue" ? "task-overdue" : ""}`}
                          onClick={() => setEditing(t)}
                        >
                          <span className="calendar-task-dot" />
                          <span className="calendar-task-title">{t.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={Boolean(editing)} title="Edit Task" onClose={() => setEditing(null)}>
        {editing ? (
          <form
            className="edit-modal-form"
            onSubmit={(e) => {
              e.preventDefault();
              void updateTask(editing.id, {
                title: editing.title,
                dueDate: editing.dueDate,
                priority: editing.priority,
              });
              pushToast("success", "Task updated");
              setEditing(null);
            }}
          >
            <div className="modal-form-group">
              <Input
                label="Title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="modal-input"
              />
            </div>
            <div className="modal-form-group">
              <Input
                label="Due date"
                type="date"
                value={editing.dueDate}
                onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })}
                className="modal-input"
              />
            </div>
            <div className="modal-form-group">
              <select
                value={editing.priority}
                onChange={(e) => setEditing({ ...editing, priority: e.target.value as Task["priority"] })}
                className="modal-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="modal-actions">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Changes
              </Button>
            </div>
          </form>
        ) : null}
      </Modal>

      <style jsx>{`
        .tasks-page {
          padding: 1.5rem;
          position: relative;
          min-height: 100vh;
        }

        /* Background Glows */
        .page-glow-1,
        .page-glow-2 {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .page-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.05) 0%, transparent 70%);
          top: -5%;
          right: -5%;
        }

        .page-glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.03) 0%, transparent 70%);
          bottom: -5%;
          left: -5%;
        }

        /* Page Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          flex: 1;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 20px;
          padding: 0.2rem 0.8rem 0.2rem 0.5rem;
          margin-bottom: 0.75rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f4c542;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .badge-text {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.5px;
          flex-wrap: wrap;
        }

        .title-count {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.1rem 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          font-weight: 400;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .view-toggle {
          display: flex;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          padding: 0.2rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .view-btn:hover {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .view-btn.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        /* Tabs */
        .tabs-wrapper {
          position: relative;
          z-index: 1;
          margin-bottom: 1rem;
        }

        .tabs {
          display: flex;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .tab.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        .tab-count {
          font-size: 0.65rem;
          padding: 0.05rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
        }

        .tab.active .tab-count {
          background: rgba(0, 0, 0, 0.1);
          color: #0a0a0a;
        }

        /* Filters */
        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .filter-wrapper {
          position: relative;
          min-width: 150px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .filter-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.8rem 0.5rem 2.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
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

        .filter-select::-ms-expand {
          display: none;
        }

        .clear-filters {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .clear-filters:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
        }

        /* Tasks Grid */
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .empty-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* Calendar View */
        .calendar-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .calendar-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .calendar-count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .calendar-cell {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.5rem;
          min-height: 100px;
          transition: all 0.3s;
        }

        .calendar-cell:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .calendar-cell.today {
          border-color: rgba(244, 197, 66, 0.2);
          background: rgba(244, 197, 66, 0.03);
        }

        .calendar-cell.has-overdue {
          border-color: rgba(255, 68, 68, 0.1);
        }

        .calendar-date {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-bottom: 0.4rem;
          padding-bottom: 0.3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .calendar-day {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .calendar-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin-left: auto;
        }

        .calendar-number.today-number {
          color: #f4c542;
        }

        .calendar-month {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
        }

        .calendar-tasks {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .calendar-empty {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
          margin: 0;
          padding: 0.2rem 0;
        }

        .calendar-task {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.3rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .calendar-task:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .calendar-task.task-overdue {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.04);
          border-color: rgba(255, 68, 68, 0.06);
        }

        .calendar-task-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          flex-shrink: 0;
        }

        .calendar-task.task-overdue .calendar-task-dot {
          background: #ff4444;
        }

        .calendar-task-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Edit Modal */
        .edit-modal-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modal-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .modal-form-group :global(.modal-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .modal-form-group :global(.modal-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .modal-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .modal-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .modal-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .modal-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .modal-actions :global(.btn-gold) {
          padding: 0.5rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .modal-actions :global(.btn-gold):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .modal-actions :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .modal-actions :global(.btn-ghost):hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .calendar-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tasks-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
          }

          .view-toggle {
            width: 100%;
          }

          .view-btn {
            flex: 1;
            justify-content: center;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: center;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-wrapper {
            min-width: 100%;
          }

          .tasks-grid {
            grid-template-columns: 1fr;
          }

          .calendar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .calendar-grid {
            grid-template-columns: 1fr;
          }

          .calendar-cell {
            min-height: 80px;
          }

          .modal-actions {
            flex-direction: column;
          }

          .modal-actions :global(.btn-gold),
          .modal-actions :global(.btn-ghost) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}