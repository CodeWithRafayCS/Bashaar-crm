"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAppStore } from "@/lib/store";
import { createTask } from "@/lib/api";
import type { Task } from "@/lib/types";
import {
  Calendar,
  User,
  Flag,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (task: Task) => void;
  initialData?: Partial<Task>;
  leadId?: string;
  company?: string;
}

export function AddTaskModal({
  open,
  onClose,
  onSuccess,
  initialData,
  leadId,
  company,
}: AddTaskModalProps) {
  const { user, pushToast, users } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium" as Task["priority"],
    status: "Pending" as Task["status"],
    dueDate: "",
    assigneeEmail: "",
    leadId: leadId || "",
    company: company || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      // Reset form with initial data
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setFormData({
        title: initialData?.title || "",
        description: initialData?.description || "",
        priority: initialData?.priority || "Medium",
        status: initialData?.status || "Pending",
        dueDate: initialData?.dueDate || tomorrow.toISOString().split("T")[0],
        assigneeEmail: initialData?.assigneeEmail || user?.email || "",
        leadId: initialData?.leadId || leadId || "",
        company: initialData?.company || company || "",
      });
      setErrors({});
    }
  }, [open, initialData, user, leadId, company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.assigneeEmail) newErrors.assigneeEmail = "Assignee is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        assigneeEmail: formData.assigneeEmail,
        leadId: formData.leadId || undefined,
        company: formData.company || undefined,
      };

      const task = await createTask(taskData);
      pushToast("success", `Task "${task.title}" created successfully`);
      onSuccess?.(task);
      onClose();
    } catch (error) {
      pushToast("error", "Failed to create task");
      setErrors({ submit: "Failed to create task. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Task"
      onClose={onClose}
      size="md"
      loading={loading}
    >
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="form-group">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="Enter task title..."
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add description..."
            className="form-textarea"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task["priority"] })}
              options={[
                { value: "Low", label: "🟢 Low" },
                { value: "Medium", label: "🟡 Medium" },
                { value: "High", label: "🔴 High" },
              ]}
              className="form-select"
            />
          </div>
          <div className="form-group">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
              options={[
                { value: "Pending", label: "⏳ Pending" },
                { value: "In Progress", label: "🔄 In Progress" },
                { value: "Completed", label: "✅ Completed" },
                { value: "Overdue", label: "⚠️ Overdue" },
              ]}
              className="form-select"
            />
          </div>
        </div>

        <div className="form-group">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            error={errors.dueDate}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <Select
            label="Assignee"
            value={formData.assigneeEmail}
            onChange={(e) => setFormData({ ...formData, assigneeEmail: e.target.value })}
            options={[
              { value: user?.email || "", label: user?.name || "Me" },
              ...users
                .filter((u) => u.active && u.email !== user?.email)
                .map((u) => ({ value: u.email, label: u.name })),
            ]}
            error={errors.assigneeEmail}
            className="form-select"
          />
        </div>

        {formData.leadId && (
          <div className="form-group lead-info">
            <div className="info-badge">
              <span className="info-label">Linked to Lead</span>
              <span className="info-value">ID: {formData.leadId}</span>
            </div>
          </div>
        )}

        {formData.company && (
          <div className="form-group company-info">
            <div className="info-badge">
              <span className="info-label">Company</span>
              <span className="info-value">{formData.company}</span>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 loading-spinner" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </Button>
        </div>
      </form>

      <style jsx>{`
        .add-task-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
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
          background: rgba(255, 255, 255, 0.06);
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
          min-height: 60px;
          resize: vertical;
          transition: all 0.3s;
        }

        .form-group :global(.form-textarea:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
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
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* Info Badges */
        .lead-info,
        .company-info {
          margin: 0.25rem 0;
        }

        .info-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          background: rgba(244, 197, 66, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.06);
          border-radius: 6px;
        }

        .info-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .info-value {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Submit Error */
        .submit-error {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 68, 68, 0.06);
          border: 1px solid rgba(255, 68, 68, 0.1);
          border-radius: 6px;
          color: #ff4444;
          font-size: 0.8rem;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .form-actions :global(.btn-gold) {
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

        .form-actions :global(.btn-gold):hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .form-actions :global(.btn-gold):disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-actions :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .form-actions :global(.btn-ghost):hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .form-actions :global(.btn-ghost):disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .loading-spinner {
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions :global(.btn-gold),
          .form-actions :global(.btn-ghost) {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .info-badge {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }
        }
      `}</style>
    </Modal>
  );
}