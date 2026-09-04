"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getLossReasons, updateLossReasons } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { 
  X, 
  Plus, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  Check,
  GripVertical,
  TrendingDown,
  Ban,
  Frown,
  Meh,
  AlertTriangle,
} from "lucide-react";

interface LossReason {
  id: string;
  label: string;
  category?: string;
  description?: string;
  isDefault?: boolean;
}

interface LossReasonSettingsProps {
  className?: string;
}

const DEFAULT_REASONS: LossReason[] = [
  { id: "lr-1", label: "Budget constraints", category: "Budget", isDefault: true },
  { id: "lr-2", label: "Competitor pricing", category: "Competition", isDefault: true },
  { id: "lr-3", label: "Timing not right", category: "Timing", isDefault: true },
  { id: "lr-4", label: "Not a good fit", category: "Fit", isDefault: true },
  { id: "lr-5", label: "Decision maker not available", category: "Process", isDefault: true },
  { id: "lr-6", label: "No response", category: "Follow-up", isDefault: true },
  { id: "lr-7", label: "Lost to competitor", category: "Competition", isDefault: true },
  { id: "lr-8", label: "Product doesn't meet needs", category: "Product", isDefault: true },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Budget": "#ff4444",
  "Competition": "#4285f4",
  "Timing": "#ffc107",
  "Fit": "#9c27b0",
  "Process": "#ff6f00",
  "Follow-up": "#ff4444",
  "Product": "#f4c542",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Budget": <DollarSign className="category-icon" />,
  "Competition": <TrendingDown className="category-icon" />,
  "Timing": <Clock className="category-icon" />,
  "Fit": <Meh className="category-icon" />,
  "Process": <AlertCircle className="category-icon" />,
  "Follow-up": <AlertTriangle className="category-icon" />,
  "Product": <Ban className="category-icon" />,
};

export function LossReasonSettings({ className = "" }: LossReasonSettingsProps) {
  const { pushToast } = useAppStore();
  const [reasons, setReasons] = useState<LossReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newReason, setNewReason] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingLabel, setEditingLabel] = useState("");
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadReasons();
  }, []);

  const loadReasons = async () => {
    setLoading(true);
    try {
      const data = await getLossReasons();
      setReasons(data.length > 0 ? data : DEFAULT_REASONS);
    } catch (error) {
      pushToast("error", "Failed to load loss reasons");
      setReasons(DEFAULT_REASONS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateLossReasons(reasons);
      pushToast("success", "Loss reasons updated successfully");
    } catch (error) {
      pushToast("error", "Failed to save loss reasons");
    }
  };

  const handleAdd = async () => {
    if (!newReason.trim()) {
      pushToast("error", "Please enter a reason");
      return;
    }

    const reason: LossReason = {
      id: `lr-${Date.now()}`,
      label: newReason.trim(),
      category: newCategory.trim() || "Other",
    };

    setReasons([...reasons, reason]);
    setNewReason("");
    setNewCategory("");
    pushToast("success", "Loss reason added");
    await handleSave();
  };

  const handleDelete = async (id: string) => {
    const reason = reasons.find((r) => r.id === id);
    if (reason?.isDefault) {
      pushToast("error", "Cannot delete default loss reason");
      return;
    }

    setReasons(reasons.filter((r) => r.id !== id));
    setShowConfirm(null);
    pushToast("success", "Loss reason deleted");
    await handleSave();
  };

  const handleEdit = (id: string) => {
    const reason = reasons.find((r) => r.id === id);
    if (reason) {
      setEditingId(id);
      setEditingLabel(reason.label);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingLabel.trim()) {
      pushToast("error", "Please enter a reason");
      return;
    }

    setReasons(
      reasons.map((r) =>
        r.id === id ? { ...r, label: editingLabel.trim() } : r
      )
    );
    setEditingId(null);
    setEditingLabel("");
    pushToast("success", "Loss reason updated");
    await handleSave();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingLabel("");
  };

  const filteredReasons = reasons.filter((r) => {
    const matchesSearch = r.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? r.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(reasons.map((r) => r.category).filter(Boolean))];

  const defaultCount = reasons.filter((r) => r.isDefault).length;

  if (loading) {
    return (
      <div className="loss-reason-loading">
        <div className="spinner" />
        <span>Loading loss reasons...</span>
      </div>
    );
  }

  return (
    <div className={`loss-reason-settings ${className}`}>
      <div className="settings-header">
        <div className="header-info">
          <h3 className="settings-title">Loss Reasons</h3>
          <p className="settings-description">
            Configure reasons for lost deals to track why opportunities are not won.
          </p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            {reasons.length} reasons
          </span>
          <span className="stat-badge default">
            {defaultCount} default
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-filter">
        <div className="search-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search loss reasons..."
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Add New */}
      <div className="add-section">
        <div className="add-form">
          <div className="add-inputs">
            <Input
              label="New Loss Reason"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Enter loss reason..."
              className="reason-input"
            />
            <Input
              label="Category (optional)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Budget, Competition"
              className="category-input"
            />
          </div>
          <Button
            type="button"
            variant="gold"
            onClick={handleAdd}
            disabled={!newReason.trim()}
            className="add-btn"
          >
            <Plus className="w-4 h-4" />
            Add Reason
          </Button>
        </div>
      </div>

      {/* Reasons List */}
      <div className="reasons-list">
        {filteredReasons.length === 0 ? (
          <div className="empty-state">
            <Frown className="empty-icon" />
            <p>No loss reasons found</p>
            {searchTerm || categoryFilter ? (
              <span className="empty-hint">Try adjusting your filters</span>
            ) : (
              <span className="empty-hint">Add your first loss reason above</span>
            )}
          </div>
        ) : (
          filteredReasons.map((reason) => {
            const isEditing = editingId === reason.id;
            const categoryColor = CATEGORY_COLORS[reason.category || ""] || "#666";
            const categoryIcon = CATEGORY_ICONS[reason.category || ""] || <Frown className="category-icon" />;

            return (
              <div key={reason.id} className="reason-item">
                <div className="reason-left">
                  <div className="reason-icon" style={{ color: categoryColor }}>
                    {categoryIcon}
                  </div>
                  {isEditing ? (
                    <div className="edit-form">
                      <Input
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="gold"
                        onClick={() => handleSaveEdit(reason.id)}
                        className="edit-save"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="edit-cancel"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="reason-label">{reason.label}</span>
                      {reason.category && (
                        <span className="reason-category" style={{ color: categoryColor }}>
                          {reason.category}
                        </span>
                      )}
                      {reason.isDefault && (
                        <span className="reason-default">Default</span>
                      )}
                    </>
                  )}
                </div>
                <div className="reason-actions">
                  {!isEditing && !reason.isDefault && (
                    <>
                      <button
                        type="button"
                        className="action-btn edit"
                        onClick={() => handleEdit(reason.id)}
                        aria-label="Edit reason"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {showConfirm === reason.id ? (
                        <div className="confirm-delete">
                          <button
                            type="button"
                            className="action-btn confirm-yes"
                            onClick={() => handleDelete(reason.id)}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="action-btn confirm-no"
                            onClick={() => setShowConfirm(null)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => setShowConfirm(reason.id)}
                          aria-label="Delete reason"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  {reason.isDefault && (
                    <span className="protected-badge">
                      <Ban className="w-3 h-3" />
                      Protected
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Save Button */}
      {!loading && (
        <div className="settings-footer">
          <Button type="button" variant="gold" onClick={handleSave}>
            <Check className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}

      <style jsx>{`
        .loss-reason-settings {
          width: 100%;
        }

        .loss-reason-loading {
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

        /* Header */
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .settings-title {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .settings-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0.2rem 0 0 0;
        }

        .header-stats {
          display: flex;
          gap: 0.5rem;
        }

        .stat-badge {
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.2);
        }

        .stat-badge.default {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        /* Search & Filter */
        .search-filter {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem 0.4rem 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
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
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          font-family: inherit;
        }

        .category-filter {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
          min-width: 150px;
        }

        .category-filter:focus {
          outline: none;
          border-color: #f4c542;
        }

        .category-filter option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Add Section */
        .add-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .add-inputs {
          display: flex;
          gap: 0.75rem;
          flex: 1;
          flex-wrap: wrap;
        }

        .reason-input {
          flex: 2;
          min-width: 200px;
        }

        .reason-input :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .reason-input :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .reason-input :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .reason-input :global(label) {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .category-input {
          flex: 1;
          min-width: 140px;
        }

        .category-input :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .category-input :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .category-input :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .category-input :global(label) {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .add-btn {
          padding: 0.4rem 1rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
          white-space: nowrap;
          height: 38px;
        }

        .add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .add-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Reasons List */
        .reasons-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .reasons-list::-webkit-scrollbar {
          width: 3px;
        }

        .reasons-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .reasons-list::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        .reason-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          transition: all 0.3s;
        }

        .reason-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .reason-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }

        .reason-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
        }

        .category-icon {
          width: 14px;
          height: 14px;
        }

        .reason-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .reason-category {
          font-size: 0.6rem;
          padding: 0.05rem 0.4rem;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.04);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .reason-default {
          font-size: 0.55rem;
          padding: 0.05rem 0.3rem;
          border-radius: 3px;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.06);
          color: #f4c542;
          font-weight: 500;
        }

        /* Edit Form */
        .edit-form {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex: 1;
        }

        .edit-input :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.2);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .edit-input :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .edit-save {
          padding: 0.2rem 0.4rem !important;
          background: rgba(0, 200, 83, 0.1) !important;
          border: 1px solid rgba(0, 200, 83, 0.1) !important;
          border-radius: 4px !important;
          color: #00c853 !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .edit-save:hover {
          background: rgba(0, 200, 83, 0.15) !important;
        }

        .edit-cancel {
          padding: 0.2rem 0.4rem !important;
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.06) !important;
          border-radius: 4px !important;
          color: #ff4444 !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .edit-cancel:hover {
          background: rgba(255, 68, 68, 0.1) !important;
        }

        /* Actions */
        .reason-actions {
          display: flex;
          align-items: center;
          gap: 0.2rem;
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

        .action-btn.edit:hover {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .confirm-delete {
          display: flex;
          gap: 0.1rem;
        }

        .confirm-yes {
          color: #00c853 !important;
        }

        .confirm-yes:hover {
          background: rgba(0, 200, 83, 0.06) !important;
        }

        .confirm-no {
          color: #ff4444 !important;
        }

        .confirm-no:hover {
          background: rgba(255, 68, 68, 0.06) !important;
        }

        .protected-badge {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 0.3rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          width: 32px;
          height: 32px;
          opacity: 0.3;
        }

        .empty-state p {
          font-size: 0.85rem;
          margin: 0;
        }

        .empty-hint {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.05);
        }

        /* Footer */
        .settings-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .settings-footer :global(.btn-gold) {
          padding: 0.5rem 1.5rem !important;
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

        .settings-footer :global(.btn-gold):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
          }

          .header-stats {
            width: 100%;
          }

          .add-form {
            flex-direction: column;
          }

          .add-inputs {
            width: 100%;
          }

          .reason-input {
            min-width: 100%;
          }

          .category-input {
            min-width: 100%;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .reason-left {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .search-filter {
            flex-direction: column;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .category-filter {
            width: 100%;
          }

          .reason-item {
            flex-wrap: wrap;
            gap: 0.3rem;
          }

          .reason-actions {
            margin-left: auto;
          }

          .settings-footer {
            flex-direction: column;
          }

          .settings-footer :global(.btn-gold) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

// Add missing imports
import { DollarSign, Clock } from "lucide-react";