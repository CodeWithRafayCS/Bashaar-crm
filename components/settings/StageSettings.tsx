"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getPipelineStages, addPipelineStage, deletePipelineStage, renamePipelineStage, reorderStages } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import type { PipelineStageConfig } from "@/lib/types";
import {
  Layers,
  Plus,
  X,
  Edit2,
  Trash2,
  Check,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Search,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

interface StageSettingsProps {
  className?: string;
}

const DEFAULT_STAGES = [
  { name: "New", order: 0, probability: 10, isWon: false, isLost: false },
  { name: "Attempted", order: 1, probability: 20, isWon: false, isLost: false },
  { name: "Connected", order: 2, probability: 30, isWon: false, isLost: false },
  { name: "Interested", order: 3, probability: 45, isWon: false, isLost: false },
  { name: "Meeting Scheduled", order: 4, probability: 60, isWon: false, isLost: false },
  { name: "Proposal Sent", order: 5, probability: 75, isWon: false, isLost: false },
  { name: "Negotiation", order: 6, probability: 90, isWon: false, isLost: false },
  { name: "Won", order: 7, probability: 100, isWon: true, isLost: false },
  { name: "Lost", order: 8, probability: 0, isWon: false, isLost: true },
];

const STAGE_COLORS = [
  "#4285f4",
  "#9c27b0",
  "#00c853",
  "#ffc107",
  "#f4c542",
  "#ff6f00",
  "#ff4444",
  "#00c853",
  "#ff4444",
];

export function StageSettings({ className = "" }: StageSettingsProps) {
  const { pushToast } = useAppStore();
  const [stages, setStages] = useState<PipelineStageConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [editingName, setEditingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDefault, setShowDefault] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    setLoading(true);
    try {
      const data = await getPipelineStages();
      if (data && data.length > 0) {
        setStages(data.sort((a, b) => a.order - b.order));
      } else {
        // Use default stages if none exist
        const defaultStages = DEFAULT_STAGES.map((s, i) => ({
          id: `stage-${Date.now()}-${i}`,
          name: s.name as PipelineStageConfig["name"],
          order: s.order,
          probability: s.probability,
          isWon: s.isWon,
          isLost: s.isLost,
        }));
        setStages(defaultStages);
        // Optionally save defaults to backend
        // await saveDefaultStages(defaultStages);
      }
    } catch (error) {
      pushToast("error", "Failed to load stages");
      // Set defaults if API fails
      const defaultStages = DEFAULT_STAGES.map((s, i) => ({
        id: `stage-${Date.now()}-${i}`,
        name: s.name as PipelineStageConfig["name"],
        order: s.order,
        probability: s.probability,
        isWon: s.isWon,
        isLost: s.isLost,
      }));
      setStages(defaultStages);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newStageName.trim()) {
      pushToast("error", "Stage name is required");
      return;
    }

    try {
      const newStage = await addPipelineStage(newStageName.trim());
      setStages([...stages, newStage].sort((a, b) => a.order - b.order));
      setNewStageName("");
      pushToast("success", "Stage added successfully");
    } catch (error) {
      pushToast("error", "Failed to add stage");
    }
  };

  const handleDelete = async (id: string) => {
    const stage = stages.find((s) => s.id === id);
    if (stage?.isWon || stage?.isLost) {
      pushToast("error", "Cannot delete Won or Lost stages");
      return;
    }

    if (!confirm("Are you sure you want to delete this stage?")) return;

    try {
      await deletePipelineStage(id);
      setStages(stages.filter((s) => s.id !== id));
      pushToast("success", "Stage deleted successfully");
    } catch (error) {
      pushToast("error", "Failed to delete stage");
    }
  };

  const handleRename = async (id: string) => {
    if (!editingName.trim()) {
      pushToast("error", "Stage name is required");
      return;
    }

    try {
      await renamePipelineStage(id, editingName.trim());
      setStages(
        stages.map((s) =>
          s.id === id ? { ...s, name: editingName.trim() as PipelineStageConfig["name"] } : s
        )
      );
      setEditingId(null);
      setEditingName("");
      pushToast("success", "Stage renamed successfully");
    } catch (error) {
      pushToast("error", "Failed to rename stage");
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = stages.findIndex((s) => s.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stages.length) return;

    const newStages = [...stages];
    [newStages[index], newStages[newIndex]] = [newStages[newIndex], newStages[index]];
    
    // Update order numbers
    const reordered = newStages.map((s, i) => ({ ...s, order: i }));
    setStages(reordered);

    try {
      await reorderStages(reordered.map((s) => s.id));
      pushToast("success", "Stage reordered");
    } catch (error) {
      pushToast("error", "Failed to reorder stages");
      // Revert on error
      loadStages();
    }
  };

  const startEdit = (stage: PipelineStageConfig) => {
    setEditingId(stage.id);
    setEditingName(stage.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const getColor = (index: number) => {
    return STAGE_COLORS[index % STAGE_COLORS.length];
  };

  const filteredStages = stages.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="stage-settings-loading">
        <Loader2 className="loading-spinner" />
        <span>Loading stages...</span>
      </div>
    );
  }

  return (
    <div className={`stage-settings ${className}`}>
      <div className="settings-header">
        <div className="header-info">
          <h3 className="settings-title">
            <Layers className="title-icon" />
            Pipeline Stages
          </h3>
          <p className="settings-description">
            Manage your sales pipeline stages and their order.
          </p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            {stages.length} stages
          </span>
          <button
            type="button"
            className="reset-btn"
            onClick={loadStages}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Add Stage */}
      <div className="add-section">
        <div className="add-form">
          <div className="add-inputs">
            <Input
              label="New Stage Name"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              placeholder="Enter stage name..."
              className="stage-input"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <Button type="button" variant="gold" className="add-btn" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Stage
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stages..."
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          className={`show-default-btn ${showDefault ? "active" : ""}`}
          onClick={() => setShowDefault(!showDefault)}
        >
          {showDefault ? "Hide Default" : "Show Default"}
        </button>
      </div>

      {/* Stages List */}
      {filteredStages.length === 0 ? (
        <div className="empty-state">
          <Layers className="empty-icon" />
          <p>No stages found</p>
          <span className="empty-hint">
            {searchTerm ? "Try adjusting your search" : "Add your first stage above"}
          </span>
        </div>
      ) : (
        <div className="stages-list">
          {filteredStages.map((stage, index) => {
            const isEditing = editingId === stage.id;
            const color = getColor(index);
            const isProtected = stage.isWon || stage.isLost;

            return (
              <div
                key={stage.id}
                className={`stage-item ${isEditing ? "editing" : ""} ${isProtected ? "protected" : ""}`}
                style={{ borderLeftColor: color }}
              >
                <div className="stage-left">
                  <div className="stage-order">{stage.order + 1}</div>
                  <div className="stage-color" style={{ background: color }} />

                  {isEditing ? (
                    <div className="edit-form">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="gold"
                        onClick={() => handleRename(stage.id)}
                        className="edit-save"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="edit-cancel"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="stage-name">{stage.name}</span>
                      {stage.probability !== undefined && (
                        <span className="stage-probability" style={{ color }}>
                          {stage.probability}%
                        </span>
                      )}
                      {stage.isWon && (
                        <span className="stage-badge won">Won</span>
                      )}
                      {stage.isLost && (
                        <span className="stage-badge lost">Lost</span>
                      )}
                      {isProtected && (
                        <span className="stage-badge protected">Protected</span>
                      )}
                    </>
                  )}
                </div>

                <div className="stage-actions">
                  {!isEditing && (
                    <>
                      {!isProtected && (
                        <>
                          <button
                            type="button"
                            className="action-btn move-up"
                            onClick={() => handleMove(stage.id, "up")}
                            disabled={index === 0}
                            aria-label="Move up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="action-btn move-down"
                            onClick={() => handleMove(stage.id, "down")}
                            disabled={index === stages.length - 1}
                            aria-label="Move down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="action-btn edit"
                            onClick={() => startEdit(stage)}
                            aria-label="Edit stage"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => handleDelete(stage.id)}
                            aria-label="Delete stage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isProtected && (
                        <span className="protected-label">Cannot modify</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .stage-settings {
          width: 100%;
        }

        .stage-settings-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .loading-spinner {
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .title-icon {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.2);
        }

        .settings-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0.2rem 0 0 0;
        }

        .header-stats {
          display: flex;
          gap: 0.5rem;
          align-items: center;
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

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.15rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .reset-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        /* Add Section */
        .add-section {
          margin-bottom: 1rem;
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
          flex: 1;
          min-width: 200px;
        }

        .stage-input :global(.form-input) {
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

        .stage-input :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .stage-input :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .stage-input :global(label) {
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

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Search */
        .search-section {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem 0.4rem 2.2rem;
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

        .show-default-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .show-default-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .show-default-btn.active {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        /* Stages List */
        .stages-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .stages-list::-webkit-scrollbar {
          width: 3px;
        }

        .stages-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .stages-list::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        .stage-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-left: 3px solid #666;
          border-radius: 6px;
          transition: all 0.3s;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stage-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .stage-item.editing {
          border-color: rgba(244, 197, 66, 0.2);
          background: rgba(244, 197, 66, 0.02);
        }

        .stage-item.protected {
          opacity: 0.6;
        }

        .stage-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .stage-order {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 50%;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .stage-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .stage-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .stage-probability {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.05rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
        }

        .stage-badge {
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          font-size: 0.55rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stage-badge.won {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.06);
        }

        .stage-badge.lost {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.06);
        }

        .stage-badge.protected {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        /* Edit Form */
        .edit-form {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex: 1;
        }

        .edit-input {
          flex: 1;
          min-width: 100px;
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

        .edit-input :global(label) {
          display: none;
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
        .stage-actions {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          flex-shrink: 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .action-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .action-btn.move-up:hover:not(:disabled) {
          color: #4285f4;
        }

        .action-btn.move-down:hover:not(:disabled) {
          color: #4285f4;
        }

        .action-btn.edit:hover:not(:disabled) {
          color: #f4c542;
        }

        .action-btn.delete:hover:not(:disabled) {
          color: #ff4444;
          border-color: rgba(255, 68, 68, 0.06);
          background: rgba(255, 68, 68, 0.06);
        }

        .protected-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
          font-style: italic;
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

        /* Responsive */
        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
          }

          .add-form {
            flex-direction: column;
          }

          .add-inputs {
            min-width: 100%;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .search-section {
            flex-direction: column;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .show-default-btn {
            width: 100%;
            justify-content: center;
          }

          .stage-item {
            flex-direction: column;
            align-items: stretch;
          }

          .stage-left {
            flex-wrap: wrap;
          }

          .stage-actions {
            justify-content: flex-end;
            border-top: 1px solid rgba(255, 255, 255, 0.03);
            padding-top: 0.3rem;
          }

          .edit-form {
            flex-wrap: wrap;
          }

          .edit-input {
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .stage-order {
            display: none;
          }

          .stage-name {
            font-size: 0.75rem;
          }

          .stage-probability {
            font-size: 0.55rem;
          }

          .stage-badge {
            font-size: 0.5rem;
          }

          .stage-actions {
            flex-wrap: wrap;
            justify-content: center;
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
      `}</style>
    </div>
  );
}