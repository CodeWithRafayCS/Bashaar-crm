"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { updateProjects } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import type { Project } from "@/lib/types";
import {
  FolderTree,
  Plus,
  X,
  Edit2,
  Trash2,
  Check,
  Search,
  Archive,
  RefreshCw,
  Folder,
  FolderOpen,
  Globe,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface ProjectSettingsProps {
  className?: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: "Active" | "Archived";
  industry: string;
  color: string;
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Real Estate",
  "Education",
  "Finance",
  "Retail",
  "Manufacturing",
  "Hospitality",
  "Entertainment",
  "Construction",
  "Legal",
  "Consulting",
  "Other",
];

const COLORS = [
  "#f4c542",
  "#4285f4",
  "#00c853",
  "#ff4444",
  "#9c27b0",
  "#ff6f00",
  "#00bcd4",
  "#ff4081",
  "#4caf50",
  "#ff9800",
  "#795548",
  "#607d8b",
];

export function ProjectSettings({ className = "" }: ProjectSettingsProps) {
  const { projects, pushToast, refresh } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Archived">("all");
  const [sortBy, setSortBy] = useState<"name" | "status" | "createdAt">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "Active",
    industry: "Technology",
    color: "#f4c542",
  });
  const [editData, setEditData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "Active",
    industry: "Technology",
    color: "#f4c542",
  });

  useEffect(() => {
    // Reset form when projects change
  }, [projects]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      pushToast("error", "Project name is required");
      return;
    }

    setLoading(true);
    try {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        industry: formData.industry,
        color: formData.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leadCount: 0,
        dealValue: 0,
      };

      await updateProjects([...projects, newProject]);
      refresh();
      setFormData({
        name: "",
        description: "",
        status: "Active",
        industry: "Technology",
        color: "#f4c542",
      });
      pushToast("success", "Project created successfully");
    } catch (error) {
      pushToast("error", "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updatedProjects = projects.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            name: editData.name.trim() || p.name,
            description: editData.description.trim() || p.description || "",
            status: editData.status,
            industry: editData.industry || p.industry || "Other",
            color: editData.color || p.color || "#f4c542",
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      await updateProjects(updatedProjects);
      refresh();
      setEditingId(null);
      pushToast("success", "Project updated successfully");
    } catch (error) {
      pushToast("error", "Failed to update project");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const updatedProjects = projects.filter((p) => p.id !== id);
      await updateProjects(updatedProjects);
      refresh();
      pushToast("success", "Project deleted successfully");
    } catch (error) {
      pushToast("error", "Failed to delete project");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: "Active" | "Archived") => {
    try {
      const newStatus = currentStatus === "Active" ? "Archived" : "Active";
      const updatedProjects = projects.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      await updateProjects(updatedProjects);
      refresh();
      pushToast("success", `Project ${newStatus.toLowerCase()}`);
    } catch (error) {
      pushToast("error", "Failed to update project status");
    }
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditData({
      name: project.name,
      description: project.description || "",
      status: project.status,
      industry: project.industry || "Other",
      color: project.color || "#f4c542",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const activeCount = projects.filter((p) => p.status === "Active").length;
  const archivedCount = projects.filter((p) => p.status === "Archived").length;

  return (
    <div className={`project-settings ${className}`}>
      {/* Header */}
      <div className="settings-header">
        <div className="header-info">
          <h3 className="settings-title">
            <FolderTree className="title-icon" />
            Projects
          </h3>
          <p className="settings-description">
            Manage your projects and their settings.
          </p>
        </div>
        <div className="header-stats">
          <span className="stat-badge">
            <Folder className="stat-icon" />
            {projects.length} Total
          </span>
          <span className="stat-badge active">
            <FolderOpen className="stat-icon" />
            {activeCount} Active
          </span>
          <span className="stat-badge archived">
            <Archive className="stat-icon" />
            {archivedCount} Archived
          </span>
        </div>
      </div>

      {/* Add Project Form */}
      <div className="add-section">
        <form onSubmit={handleAdd} className="add-form">
          <div className="add-inputs">
            <div className="form-group">
              <Input
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name..."
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <Select
                label="Industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
                className="form-select"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? "selected" : ""}`}
                    style={{ background: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button type="submit" variant="gold" className="add-btn" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 loading-spinner" /> : <Plus className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>

      {/* Search & Filters */}
      <div className="search-filter">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="createdAt">Sort by Date</option>
          </select>

          <button
            type="button"
            className="sort-direction"
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          >
            {sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <FolderTree className="empty-icon" />
          <p>No projects found</p>
          {searchTerm || statusFilter !== "all" ? (
            <span className="empty-hint">Try adjusting your filters</span>
          ) : (
            <span className="empty-hint">Create your first project above</span>
          )}
        </div>
      ) : (
        <div className="projects-list">
          {filteredProjects.map((project) => {
            const isEditing = editingId === project.id;
            const isActive = project.status === "Active";

            return (
              <div key={project.id} className={`project-item ${!isActive ? "archived" : ""}`}>
                <div className="project-left">
                  <div 
                    className="project-color"
                    style={{ background: project.color || "#f4c542" }}
                  />
                  
                  {isEditing ? (
                    <div className="edit-form">
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="edit-input"
                        autoFocus
                      />
                      <Input
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="edit-input"
                        placeholder="Description"
                      />
                      <select
                        value={editData.industry}
                        onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
                        className="edit-select"
                      >
                        {INDUSTRIES.map((i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                      <div className="edit-colors">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`color-option small ${editData.color === color ? "selected" : ""}`}
                            style={{ background: color }}
                            onClick={() => setEditData({ ...editData, color })}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="project-info">
                        <span className="project-name">{project.name}</span>
                        {project.description && (
                          <span className="project-description">{project.description}</span>
                        )}
                        <div className="project-tags">
                          {project.industry && (
                            <span className="project-tag">{project.industry}</span>
                          )}
                          <span className={`project-status ${isActive ? "active" : "archived"}`}>
                            {project.status}
                          </span>
                          {project.leadCount !== undefined && (
                            <span className="project-tag">
                              <Users className="tag-icon" />
                              {project.leadCount} leads
                            </span>
                          )}
                          {project.dealValue !== undefined && project.dealValue > 0 && (
                            <span className="project-tag">
                              <FolderTree className="tag-icon" />
                              {project.dealValue} deals
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="project-meta">
                        <span className="project-date">
                          <Calendar className="meta-icon" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="project-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="action-btn save"
                        onClick={() => handleUpdate(project.id)}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="action-btn cancel"
                        onClick={cancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="action-btn toggle"
                        onClick={() => handleToggleStatus(project.id, project.status)}
                      >
                        {isActive ? <Archive className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        {isActive ? "Archive" : "Restore"}
                      </button>
                      <button
                        type="button"
                        className="action-btn edit"
                        onClick={() => startEdit(project)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .project-settings {
          width: 100%;
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
          flex-wrap: wrap;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.2);
        }

        .stat-icon {
          width: 14px;
          height: 14px;
        }

        .stat-badge.active {
          background: rgba(0, 200, 83, 0.06);
          border-color: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .stat-badge.archived {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.15);
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
          display: grid;
          grid-template-columns: 2fr 2fr 1.5fr 1.5fr;
          gap: 0.75rem;
          flex: 1;
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
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.7);
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

        .form-group :global(.form-select) {
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

        .form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(label) {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .form-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .color-picker {
          display: flex;
          gap: 0.2rem;
          flex-wrap: wrap;
          padding: 0.2rem 0;
        }

        .color-option {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
        }

        .color-option:hover {
          transform: scale(1.1);
        }

        .color-option.selected {
          border-color: #ffffff;
          box-shadow: 0 0 0 2px rgba(244, 197, 66, 0.3);
        }

        .color-option.small {
          width: 20px;
          height: 20px;
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
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Search & Filters */
        .search-filter {
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

        .filter-controls {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          font-family: inherit;
          cursor: pointer;
          min-width: 140px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .sort-direction {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-direction:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.4);
        }

        /* Projects List */
        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .projects-list::-webkit-scrollbar {
          width: 3px;
        }

        .projects-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .projects-list::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        .project-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          transition: all 0.3s;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .project-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .project-item.archived {
          opacity: 0.5;
        }

        .project-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }

        .project-color {
          width: 4px;
          height: 40px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .project-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          flex: 1;
          min-width: 0;
        }

        .project-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .project-description {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2rem;
          margin-top: 0.1rem;
        }

        .project-tag {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.05rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .tag-icon {
          width: 12px;
          height: 12px;
        }

        .project-status {
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          font-size: 0.55rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .project-status.active {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.06);
        }

        .project-status.archived {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .meta-icon {
          width: 12px;
          height: 12px;
        }

        /* Edit Form */
        .edit-form {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex: 1;
          flex-wrap: wrap;
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

        .edit-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(244, 197, 66, 0.2);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.8rem;
          font-family: inherit;
          cursor: pointer;
        }

        .edit-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .edit-colors {
          display: flex;
          gap: 0.15rem;
        }

        /* Actions */
        .project-actions {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          flex-shrink: 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          padding: 0.2rem 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.toggle:hover {
          background: rgba(244, 197, 66, 0.06);
          border-color: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .action-btn.edit:hover {
          background: rgba(66, 133, 244, 0.06);
          border-color: rgba(66, 133, 244, 0.06);
          color: #4285f4;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .action-btn.save {
          background: rgba(0, 200, 83, 0.06);
          border-color: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .action-btn.save:hover {
          background: rgba(0, 200, 83, 0.1);
        }

        .action-btn.cancel {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .action-btn.cancel:hover {
          background: rgba(255, 68, 68, 0.1);
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
        @media (max-width: 1024px) {
          .add-inputs {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
          }

          .add-inputs {
            grid-template-columns: 1fr;
          }

          .add-form {
            flex-direction: column;
          }

          .add-btn {
            width: 100%;
            justify-content: center;
          }

          .search-filter {
            flex-direction: column;
          }

          .filter-controls {
            width: 100%;
            flex-wrap: wrap;
          }

          .filter-select {
            flex: 1;
            min-width: 120px;
          }

          .project-item {
            flex-direction: column;
            align-items: stretch;
          }

          .project-left {
            flex-wrap: wrap;
          }

          .project-actions {
            justify-content: flex-end;
            border-top: 1px solid rgba(255, 255, 255, 0.03);
            padding-top: 0.3rem;
          }

          .edit-form {
            flex-direction: column;
            align-items: stretch;
          }

          .edit-input {
            min-width: 100%;
          }

          .edit-select {
            width: 100%;
          }

          .edit-colors {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .filter-controls {
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }

          .project-tags {
            flex-wrap: wrap;
          }

          .project-meta {
            flex-wrap: wrap;
          }

          .project-actions {
            flex-wrap: wrap;
            justify-content: center;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}