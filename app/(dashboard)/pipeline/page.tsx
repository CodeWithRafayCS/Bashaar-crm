"use client";

import { useState, useMemo } from "react";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import { AddLeadModal } from "@/components/leads/AddLeadModal";
import { useLeads } from "@/lib/hooks/useLeads";
import { moveStage } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { LeadStage } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";

export default function PipelinePage() {
  const { leads } = useLeads();
  const { users, user, pushToast, activeProjectId } = useAppStore();
  const [owner, setOwner] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const visible = useMemo(() => {
    return leads.filter((l) => {
      if (l.stage === "Won" || l.stage === "Lost") return false;
      if (owner && l.ownerEmail !== owner) return false;
      if (from && l.createdAt < from) return false;
      if (to && l.createdAt > to) return false;
      if (user?.role === "Viewer" && l.ownerEmail !== user.email) return false;
      return true;
    });
  }, [leads, owner, from, to, user]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    visible.forEach((l) => {
      counts[l.stage] = (counts[l.stage] || 0) + 1;
    });
    return counts;
  }, [visible]);

  const totalValue = useMemo(() => {
    return visible.reduce((sum, l) => sum + l.value, 0);
  }, [visible]);

  function clearFilters() {
    setOwner("");
    setFrom("");
    setTo("");
  }

  return (
    <div className="pipeline-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Kanban</span>
          </div>
          <h1 className="page-title">
            Pipeline
            <span className="title-count">{visible.length}</span>
          </h1>
          <p className="page-subtitle">
            Drag and drop leads across stages to update their progress
          </p>
        </div>
        <div className="header-actions">
          <div className="header-stats">
            <div className="header-stat">
              <span className="stat-label">Total Value</span>
              <span className="stat-value-gold">{new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalValue)}</span>
            </div>
            <div className="header-stat">
              <span className="stat-label">Active Leads</span>
              <span className="stat-value-white">{visible.length}</span>
            </div>
          </div>
          <button className="btn-add" onClick={() => setAddOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Lead
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-left">
          <div className="filter-wrapper">
            <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="filter-select"
              aria-label="Owner filter"
            >
              <option value="">All owners</option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="date-filters">
            <div className="date-input-wrapper">
              <svg className="date-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="date-input"
                aria-label="From date"
                placeholder="From"
              />
            </div>
            <span className="date-separator">→</span>
            <div className="date-input-wrapper">
              <svg className="date-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="date-input"
                aria-label="To date"
                placeholder="To"
              />
            </div>
          </div>

          {(owner || from || to) && (
            <button className="clear-filters" onClick={clearFilters}>
              Clear filters ✕
            </button>
          )}
        </div>

        <div className="filters-right">
          <div className="project-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Project: {activeProjectId === "all" ? "All" : activeProjectId}</span>
          </div>
        </div>
      </div>

      {/* Stage Stats */}
      <div className="stage-stats">
        {Object.entries(stageCounts).map(([stage, count]) => (
          <div key={stage} className="stage-stat">
            <span className="stage-stat-name">{stage}</span>
            <span className="stage-stat-count">{count}</span>
          </div>
        ))}
        {Object.keys(stageCounts).length === 0 && (
          <div className="stage-stat empty">
            <span className="stage-stat-name">No leads in pipeline</span>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="kanban-wrapper">
        <KanbanBoard
          leads={visible}
          onMove={async (leadId, stage) => {
            await moveStage(leadId, stage as LeadStage, user?.email ?? "sarah@bashar.ai");
            pushToast("success", `Lead moved to ${stage}`);
          }}
          onAdd={() => setAddOpen(true)}
        />
      </div>

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} />

      <style jsx>{`
        .pipeline-page {
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
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .header-stats {
          display: flex;
          gap: 1.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .header-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header-stat .stat-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.2);
        }

        .header-stat .stat-value-gold {
          font-size: 1rem;
          font-weight: 700;
          color: #f4c542;
        }

        .header-stat .stat-value-white {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border: none;
          border-radius: 10px;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3);
        }

        /* Filters Section */
        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .filters-left {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          flex: 1;
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

        .date-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .date-icon {
          position: absolute;
          left: 10px;
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .date-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.5rem 0.5rem 2.2rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
          width: 140px;
          cursor: pointer;
        }

        .date-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.5);
          cursor: pointer;
        }

        .date-separator {
          color: rgba(255, 255, 255, 0.15);
          font-weight: 300;
          font-size: 0.8rem;
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

        .filters-right {
          display: flex;
          align-items: center;
        }

        .project-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .project-badge svg {
          color: rgba(255, 255, 255, 0.15);
        }

        /* Stage Stats */
        .stage-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .stage-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.3s;
        }

        .stage-stat:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .stage-stat-name {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .stage-stat-count {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f4c542;
          background: rgba(244, 197, 66, 0.08);
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
        }

        .stage-stat.empty {
          opacity: 0.3;
        }

        .stage-stat.empty .stage-stat-name {
          color: rgba(255, 255, 255, 0.2);
          font-style: italic;
        }

        /* Kanban Wrapper */
        .kanban-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 0.25rem;
          min-height: 400px;
          overflow: hidden;
        }

        .kanban-wrapper :global(.kanban-board) {
          min-height: 400px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-left {
            flex-wrap: wrap;
          }

          .filters-right {
            justify-content: flex-start;
          }

          .header-stats {
            flex-direction: column;
            gap: 0.3rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 768px) {
          .pipeline-page {
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
            flex-direction: column;
            align-items: stretch;
          }

          .header-stats {
            flex-direction: row;
            justify-content: space-around;
            padding: 0.5rem;
          }

          .btn-add {
            justify-content: center;
          }

          .filters-left {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-wrapper {
            min-width: 100%;
          }

          .date-filters {
            flex-wrap: wrap;
            justify-content: center;
          }

          .date-input {
            width: 120px;
          }

          .stage-stats {
            gap: 0.3rem;
          }

          .stage-stat {
            padding: 0.2rem 0.6rem;
            font-size: 0.7rem;
          }

          .kanban-wrapper {
            padding: 0;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .header-stats {
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
          }

          .header-stat {
            flex-direction: row;
            gap: 0.5rem;
          }

          .date-input {
            width: 100px;
            font-size: 0.7rem;
            padding: 0.4rem 0.4rem 0.4rem 1.8rem;
          }

          .date-icon {
            width: 12px;
            height: 12px;
            left: 8px;
          }

          .stage-stats {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}