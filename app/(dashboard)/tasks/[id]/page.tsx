"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getTaskById,
  updateTask,
  deleteTask,
  getTaskActivities,
  getLeadById,
} from "@/lib/api";
import type { Task, Lead, Activity } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Select } from "@/components/common/Select";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { version, user, pushToast } = useAppStore();
  const [task, setTask] = useState<Task | undefined>();
  const [lead, setLead] = useState<Lead | undefined>();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assigneeEmail: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const taskData = await getTaskById(id);
        setTask(taskData);
        
        if (taskData) {
          setEditData({
            title: taskData.title,
            description: taskData.description || "",
            status: taskData.status,
            priority: taskData.priority,
            dueDate: taskData.dueDate || "",
            assigneeEmail: taskData.assigneeEmail || "",
          });

          if (taskData.leadId) {
            const leadData = await getLeadById(taskData.leadId);
            setLead(leadData);
          }

          const activityData = await getTaskActivities(id);
          setActivities(activityData);
        }
      } catch (error) {
        pushToast("error", "Failed to load task");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [id, version, pushToast]);

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateTask(id, {
        title: editData.title,
        description: editData.description,
        status: editData.status as Task["status"],
        priority: editData.priority as Task["priority"],
        dueDate: editData.dueDate,
        assigneeEmail: editData.assigneeEmail,
      });
      setTask((prev) => prev ? {
        ...prev,
        title: editData.title,
        description: editData.description,
        status: editData.status as Task["status"],
        priority: editData.priority as Task["priority"],
        dueDate: editData.dueDate,
        assigneeEmail: editData.assigneeEmail,
      } : undefined);
      setIsEditing(false);
      pushToast("success", "Task updated");
    } catch (error) {
      pushToast("error", "Failed to update task");
    }
  }

  async function handleStatusChange(newStatus: string) {
    try {
      await updateTask(id, { status: newStatus as Task["status"] });
      setTask((prev) => prev ? { ...prev, status: newStatus as Task["status"] } : undefined);
      pushToast("success", `Task ${newStatus.toLowerCase()}`);
    } catch (error) {
      pushToast("error", "Failed to update status");
    }
  }

  async function handleDeleteTask() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      pushToast("success", "Task deleted");
      router.push("/tasks");
    } catch (error) {
      pushToast("error", "Failed to delete task");
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "completed";
      case "In Progress": return "in-progress";
      case "Overdue": return "overdue";
      default: return "pending";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "high";
      case "Medium": return "medium";
      case "Low": return "low";
      default: return "medium";
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader" />
        <p>Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        body="It may have been deleted or archived."
        action={<Link href="/tasks">Back to tasks</Link>}
      />
    );
  }

  const isOverdue = task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="task-detail-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Task</span>
          </div>
          <h1 className="page-title">
            {task.title}
            <span className={`status-badge ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
            {isOverdue && (
              <span className="overdue-badge">⚠️ Overdue</span>
            )}
          </h1>
          <div className="header-meta">
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {task.assigneeEmail || "Unassigned"}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {task.dueDate ? formatDate(task.dueDate) : "No due date"}
            </span>
            <span className="meta-item">
              <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Button
            type="button"
            variant="ghost"
            className="btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            type="button"
            variant="danger"
            className="btn-delete"
            onClick={handleDeleteTask}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </Button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Left Column - Task Details */}
        <aside className="detail-card detail-card-left">
          {isEditing ? (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">✏️</span>
                Edit Task
              </h2>
              <form onSubmit={handleUpdateTask} className="edit-form">
                <div className="form-group">
                  <Input
                    label="Title"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <Textarea
                    label="Description"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="form-textarea"
                    placeholder="Add description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <Select
                      label="Status"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      options={["Pending", "In Progress", "Completed", "Overdue"].map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      className="form-select"
                    />
                  </div>
                  <div className="form-group">
                    <Select
                      label="Priority"
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      options={["Low", "Medium", "High"].map((p) => ({
                        value: p,
                        label: p,
                      }))}
                      className="form-select"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <Input
                    label="Due Date"
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Assignee Email"
                    type="email"
                    value={editData.assigneeEmail}
                    onChange={(e) => setEditData({ ...editData, assigneeEmail: e.target.value })}
                    className="form-input"
                    placeholder="assignee@email.com"
                  />
                </div>

                <div className="form-actions">
                  <Button type="submit" variant="gold" className="btn-save">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="card-section">
                <h2 className="section-title">
                  <span className="section-icon">📋</span>
                  Task Details
                </h2>

                <div className="info-field">
                  <span className="field-label">Title</span>
                  <span className="field-value">{task.title}</span>
                </div>

                {task.description && (
                  <div className="info-field description-field">
                    <span className="field-label">Description</span>
                    <span className="field-value description-text">{task.description}</span>
                  </div>
                )}

                <div className="info-field">
                  <span className="field-label">Status</span>
                  <div className="field-value">
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      options={["Pending", "In Progress", "Completed", "Overdue"].map((s) => ({
                        value: s,
                        label: s,
                      }))}
                      className="status-select-inline"
                    />
                  </div>
                </div>

                <div className="info-field">
                  <span className="field-label">Priority</span>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="info-field">
                  <span className="field-label">Due Date</span>
                  <span className={`field-value ${isOverdue ? "overdue-text" : ""}`}>
                    {task.dueDate ? formatDate(task.dueDate) : "Not set"}
                    {isOverdue && " ⚠️"}
                  </span>
                </div>

                <div className="info-field">
                  <span className="field-label">Assignee</span>
                  <span className="field-value">{task.assigneeEmail || "Unassigned"}</span>
                </div>

                {task.leadId && lead && (
                  <div className="info-field">
                    <span className="field-label">Related Lead</span>
                    <span className="field-value">
                      <Link href={`/leads/${lead.id}`} className="link">
                        {lead.name} ({lead.company})
                      </Link>
                    </span>
                  </div>
                )}

                <div className="info-field">
                  <span className="field-label">Created</span>
                  <span className="field-value">{formatDate(task.createdAt)}</span>
                </div>

                {task.updatedAt && (
                  <div className="info-field">
                    <span className="field-label">Updated</span>
                    <span className="field-value">{formatDate(task.updatedAt)}</span>
                  </div>
                )}
              </div>

              {task.leadId && lead && (
                <div className="card-section">
                  <h2 className="section-title">
                    <span className="section-icon">🏢</span>
                    Related Lead
                  </h2>
                  <div className="related-lead">
                    <div className="lead-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-company">{lead.company}</span>
                    </div>
                    <div className="lead-details">
                      <span className={`stage-badge ${lead.stage.toLowerCase().replace(/\s/g, "-")}`}>
                        {lead.stage}
                      </span>
                      <span className="lead-value">{formatCurrency(lead.value)}</span>
                    </div>
                    <Link href={`/leads/${lead.id}`} className="view-lead-link">
                      View Lead →
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Right Column - Activities & Quick Actions */}
        <aside className="detail-card detail-card-right">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Activity Timeline
              <span className="section-badge">{activities.length}</span>
            </h2>
            <ActivityTimeline activities={activities} />
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h2>
            <div className="actions-grid">
              <Button 
                type="button" 
                variant="ghost" 
                className="action-btn"
                onClick={() => {
                  if (task.status !== "Completed") {
                    handleStatusChange("Completed");
                  } else {
                    handleStatusChange("Pending");
                  }
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {task.status === "Completed" ? "Reopen" : "Mark Complete"}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="action-btn"
                onClick={() => {
                  const nextPriority = task.priority === "High" ? "Medium" : 
                                      task.priority === "Medium" ? "Low" : "High";
                  void updateTask(id, { priority: nextPriority as Task["priority"] });
                  setTask((prev) => prev ? { ...prev, priority: nextPriority as Task["priority"] } : undefined);
                  pushToast("success", `Priority updated to ${nextPriority}`);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                Change Priority
              </Button>

              {task.leadId && (
                <Link href={`/leads/${task.leadId}`} className="action-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  View Lead
                </Link>
              )}

              <Button 
                type="button" 
                variant="ghost" 
                className="action-btn"
                onClick={() => {
                  pushToast("info", "Log activity modal coming soon");
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Log Activity
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .task-detail-page {
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

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
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
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.5px;
          flex-wrap: wrap;
        }

        .status-badge {
          padding: 0.2rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.completed {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .status-badge.in-progress {
          background: rgba(66, 133, 244, 0.12);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .status-badge.overdue {
          background: rgba(255, 68, 68, 0.12);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.15);
        }

        .status-badge.pending {
          background: rgba(255, 193, 7, 0.12);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.15);
        }

        .overdue-badge {
          padding: 0.2rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.12);
          animation: pulse-warning 2s ease-in-out infinite;
        }

        @keyframes pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
          align-items: center;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .meta-icon {
          color: rgba(255, 255, 255, 0.2);
        }

        .priority-badge {
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .priority-badge.high {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.12);
        }

        .priority-badge.medium {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.12);
        }

        .priority-badge.low {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-edit {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.5) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .btn-delete {
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.08) !important;
          border-radius: 8px !important;
          color: rgba(255, 68, 68, 0.5) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-delete:hover {
          background: rgba(255, 68, 68, 0.1) !important;
          color: #ff4444 !important;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .card-section {
          margin-bottom: 1.25rem;
        }

        .card-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: 1rem;
        }

        .section-badge {
          margin-left: auto;
          font-size: 0.65rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Info Fields */
        .info-field {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          align-items: center;
        }

        .info-field:last-child {
          border-bottom: none;
        }

        .field-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 400;
        }

        .field-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .field-value .link {
          color: #f4c542;
          text-decoration: none;
          font-size: 0.8rem;
          transition: opacity 0.3s;
        }

        .field-value .link:hover {
          opacity: 0.7;
        }

        .description-field {
          flex-direction: column;
          align-items: stretch;
          gap: 0.2rem;
        }

        .description-text {
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.5;
          font-size: 0.85rem;
        }

        .overdue-text {
          color: #ff4444;
          font-weight: 500;
        }

        .status-select-inline {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }

        .status-select-inline:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .status-select-inline option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Related Lead */
        .related-lead {
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .lead-info {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.3rem;
        }

        .lead-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .lead-company {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .lead-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .stage-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 500;
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .stage-badge.won {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
          border-color: rgba(0, 200, 83, 0.15);
        }

        .stage-badge.lost {
          background: rgba(255, 68, 68, 0.12);
          color: #ff4444;
          border-color: rgba(255, 68, 68, 0.15);
        }

        .lead-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f4c542;
        }

        .view-lead-link {
          display: inline-block;
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
        }

        .view-lead-link:hover {
          color: #f4c542;
        }

        /* Edit Form */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group :global(.form-input) {
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

        .form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-group :global(.form-textarea) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          min-height: 80px;
          resize: vertical;
          transition: all 0.3s;
        }

        .form-group :global(.form-textarea:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-textarea::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-group :global(.form-select) {
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

        .form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-select option) {
          background: #1a1a1a;
          color: #ffffff;
        }

        .form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.2rem;
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .btn-save {
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

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3rem;
        }

        .action-btn {
          padding: 0.4rem 0.6rem !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 6px !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 0.7rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.3rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(244, 197, 66, 0.1) !important;
          color: rgba(255, 255, 255, 0.6) !important;
        }

        .action-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.7rem;
          text-decoration: none;
          transition: all 0.3s;
        }

        .action-link:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(244, 197, 66, 0.1);
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }

          .detail-card-left {
            grid-column: 1;
          }

          .detail-card-right {
            grid-column: 2;
          }
        }

        @media (max-width: 768px) {
          .task-detail-page {
            padding: 1rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
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

          .btn-edit,
          .btn-delete {
            flex: 1;
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .header-meta {
            flex-direction: column;
            gap: 0.3rem;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .detail-card {
            padding: 1rem;
          }

          .info-field {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .lead-details {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}