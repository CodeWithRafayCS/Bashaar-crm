"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { addUser, toggleUserActive } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import type { Role } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function TeamPage() {
  const { users, pushToast } = useAppStore();
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Sales User");

  const filtered = useMemo(() => {
    return users.filter((u) => (role ? u.role === role : true));
  }, [users, role]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((u) => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const activeCount = users.filter((u) => u.active).length;

  return (
    <div className="team-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">People</span>
          </div>
          <h1 className="page-title">
            Team
            <span className="title-count">{filtered.length}</span>
          </h1>
          <p className="page-subtitle">Manage your team members and their roles</p>
        </div>
        <Button type="button" variant="gold" className="btn-add" onClick={() => setOpen(true)}>
          <svg className="add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </Button>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Members</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{users.filter((u) => u.role === "Admin").length}</span>
            <span className="stat-label">Admins</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{Object.keys(roleCounts).length}</span>
            <span className="stat-label">Roles</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="filter-select"
            aria-label="Role"
          >
            <option value="">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Sales User">Sales User</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>

        {role && (
          <button className="clear-filters" onClick={() => setRole("")}>
            Clear filter ✕
          </button>
        )}
      </div>

      {/* Team Grid */}
      {filtered.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No team members found"
            body={role ? "Try adjusting your role filter" : "Add your first team member to get started"}
            action={
              <Button type="button" variant="gold" onClick={() => setOpen(true)}>
                + Add User
              </Button>
            }
          />
        </div>
      ) : (
        <div className="team-grid">
          {filtered.map((u) => (
            <article key={u.id} className="team-card">
              <div className="team-card-header">
                <div className="avatar-wrapper">
                  <div className="avatar">
                    {u.initials || u.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`status-dot ${u.active ? "active" : "inactive"}`} />
                </div>
                <div className="user-info">
                  <h3 className="user-name">{u.name}</h3>
                  <p className="user-role">
                    <span className={`role-badge ${u.role.toLowerCase().replace(/\s/g, "-")}`}>
                      {u.role}
                    </span>
                    <span className={`status-label ${u.active ? "active" : "inactive"}`}>
                      {u.active ? "● Active" : "○ Inactive"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="team-card-body">
                <div className="user-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{u.email}</span>
                </div>
              </div>

              <div className="team-card-footer">
                <div className="user-stats">
                  <div className="stat-item">
                    <span className="stat-number">{u.leadsCreated || 0}</span>
                    <span className="stat-label-small">Leads</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-number">{u.dealsWon || 0}</span>
                    <span className="stat-label-small">Deals Won</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-number">{u.tasksCompleted || 0}</span>
                    <span className="stat-label-small">Tasks</span>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={`btn-toggle ${u.active ? "active" : "inactive"}`}
                  onClick={() => void toggleUserActive(u.id)}
                >
                  {u.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      <Modal open={open} title="Add User" onClose={() => setOpen(false)}>
        <form
          className="modal-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) {
              pushToast("error", "Name and email are required");
              return;
            }
            await addUser({ name: name.trim(), email: email.trim(), role: newRole, active: true });
            pushToast("success", "User added");
            setOpen(false);
            setName("");
            setEmail("");
            setNewRole("Sales User");
          }}
        >
          <div className="modal-form-group">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
              placeholder="John Doe"
              required
            />
          </div>
          <div className="modal-form-group">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="modal-input"
              placeholder="john@company.com"
              required
            />
          </div>
          <div className="modal-form-group">
            <Select
              label="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as Role)}
              options={["Admin", "Manager", "Sales User", "Viewer"].map((r) => ({
                value: r,
                label: r,
              }))}
              className="modal-select"
            />
          </div>
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Add User
            </Button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .team-page {
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

        .btn-add {
          padding: 0.6rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          font-family: inherit !important;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .add-icon {
          width: 16px;
          height: 16px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(244, 197, 66, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .stat-icon-wrapper.gold {
          background: rgba(244, 197, 66, 0.08);
          color: #f4c542;
        }

        .stat-icon-wrapper.green {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
        }

        .stat-icon-wrapper.blue {
          background: rgba(66, 133, 244, 0.08);
          color: #4285f4;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
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
          min-width: 180px;
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

        /* Team Grid */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .team-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .team-card:hover {
          transform: translateY(-3px);
          border-color: rgba(244, 197, 66, 0.1);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .team-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .status-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #0a0a0a;
        }

        .status-dot.active {
          background: #00c853;
        }

        .status-dot.inactive {
          background: rgba(255, 255, 255, 0.2);
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.2rem 0;
        }

        .user-role {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          flex-wrap: wrap;
        }

        .role-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
        }

        .role-badge.admin {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .role-badge.manager {
          background: rgba(66, 133, 244, 0.12);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .role-badge.sales-user {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .role-badge.viewer {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .status-label {
          font-size: 0.6rem;
          font-weight: 500;
        }

        .status-label.active {
          color: #00c853;
        }

        .status-label.inactive {
          color: rgba(255, 255, 255, 0.2);
        }

        .team-card-body {
          margin-bottom: 0.75rem;
          padding: 0.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .user-detail {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .user-detail svg {
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .team-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .user-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 0.85rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-label-small {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.04);
        }

        .btn-toggle {
          padding: 0.3rem 0.8rem !important;
          border-radius: 6px !important;
          font-size: 0.7rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-toggle.active {
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.08) !important;
          color: rgba(255, 68, 68, 0.5) !important;
        }

        .btn-toggle.active:hover {
          background: rgba(255, 68, 68, 0.1) !important;
          color: #ff4444 !important;
        }

        .btn-toggle.inactive {
          background: rgba(0, 200, 83, 0.06) !important;
          border: 1px solid rgba(0, 200, 83, 0.08) !important;
          color: rgba(0, 200, 83, 0.5) !important;
        }

        .btn-toggle.inactive:hover {
          background: rgba(0, 200, 83, 0.1) !important;
          color: #00c853 !important;
        }

        /* Empty State */
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

        /* Modal */
        .modal-form {
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

        .modal-form-group :global(.modal-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .modal-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .modal-form-group :global(.modal-select) {
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

        .modal-form-group :global(.modal-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .modal-form-group :global(.modal-select option) {
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
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .team-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .team-card-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .user-stats {
            justify-content: space-around;
          }

          .btn-toggle {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .team-card-header {
            flex-wrap: wrap;
          }

          .user-role {
            flex-wrap: wrap;
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