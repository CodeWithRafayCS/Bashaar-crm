"use client";

import { useEffect, useMemo, useState } from "react";
import { LeadFilters, type LeadFilterState } from "@/components/leads/LeadFilters";
import { LeadTable } from "@/components/leads/LeadTable";
import { ImportModal } from "@/components/leads/ImportModal";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { useLeads } from "@/lib/hooks/useLeads";
import { archiveLeads, assignLeads, findDuplicateLeadIds } from "@/lib/api";
import { useAppStore } from "@/lib/store";

export default function LeadsPage() {
  const { leads, loading } = useLeads();
  const { users, pushToast } = useAppStore();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filters, setFilters] = useState<LeadFilterState>({
    status: "",
    source: "",
    owner: "",
    project: "",
    stage: "",
    view: "",
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);
  const [assignTo, setAssignTo] = useState("sarah@bashar.ai");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q), 280);
    return () => window.clearTimeout(t);
  }, [q]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filters.stage && l.stage !== filters.stage) return false;
      if (filters.source && l.source !== filters.source) return false;
      if (filters.owner && l.ownerEmail !== filters.owner) return false;
      if (filters.project && l.projectId !== filters.project) return false;
      if (filters.view === "High value" && l.value < 50000) return false;
      if (debounced) {
        const hay = `${l.name} ${l.company} ${l.email} ${l.phone} ${l.notes ?? ""}`.toLowerCase();
        if (!hay.includes(debounced.toLowerCase())) return false;
      }
      return true;
    });
  }, [leads, filters, debounced]);

  const duplicates = findDuplicateLeadIds(leads);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const rows = filtered.map((l) =>
      [l.name, l.company, l.stage, l.ownerEmail, l.nextAction, l.followUpDate, l.value].join(","),
    );
    const blob = new Blob(
      [["Name,Company,Stage,Owner,Next Action,Follow-up,Value", ...rows].join("\n")],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("success", "Leads exported");
  }

  return (
    <div className="leads-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Lead management</span>
          </div>
          <h1 className="page-title">
            Leads
            <span className="title-count">{filtered.length}</span>
            {duplicates.length > 0 && (
              <span className="duplicate-warning">
                ⚠️ {duplicates.length} duplicates
              </span>
            )}
          </h1>
          <p className="page-subtitle">Manage your sales pipeline from one place</p>
        </div>
        <Button type="button" variant="gold" className="btn-import" onClick={() => setImportOpen(true)}>
          <svg className="import-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          CSV Import
        </Button>
      </header>

      <div className="filters-wrapper">
        <LeadFilters value={filters} onChange={setFilters} />
      </div>

      <div className="toolbar-section">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads by name, company, email..."
            aria-label="Search leads"
            className="search-input"
          />
          {q && (
            <button className="clear-search" onClick={() => setQ("")}>
              ✕
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <div className="assign-wrapper">
            <Select
              label="Assign to"
              name="assign"
              value={assignTo}
              options={users.filter((u) => u.active).map((u) => ({ value: u.email, label: u.name }))}
              onChange={(e) => setAssignTo(e.target.value)}
              className="assign-select"
            />
          </div>

          <Button
            type="button"
            size="sm"
            className="btn-assign"
            onClick={async () => {
              await assignLeads([...selected], assignTo);
              pushToast("success", "Leads assigned");
              setSelected(new Set());
            }}
            disabled={selected.size === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Assign {selected.size > 0 && `(${selected.size})`}
          </Button>

          <Button type="button" size="sm" variant="ghost" className="btn-export" onClick={exportCsv}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>

          <Button
            type="button"
            size="sm"
            variant="danger"
            className="btn-archive"
            disabled={selected.size === 0}
            onClick={async () => {
              await archiveLeads([...selected]);
              pushToast("success", "Leads archived");
              setSelected(new Set());
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Archive {selected.size > 0 && `(${selected.size})`}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader" />
          <p>Loading leads…</p>
        </div>
      ) : null}

      {!loading && filtered.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No leads yet — add your first one!"
            body="Every active lead should live in Bashaar. Import from CSV or add manually."
          />
        </div>
      ) : (
        <div className="table-wrapper">
          <LeadTable leads={filtered} selected={selected} onToggle={toggle} duplicates={duplicates} />
        </div>
      )}

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />

      <style jsx>{`
        .leads-page {
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
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
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

        .duplicate-warning {
          font-size: 0.75rem;
          font-weight: 500;
          color: #ffc107;
          background: rgba(255, 193, 7, 0.08);
          padding: 0.1rem 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 193, 7, 0.1);
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          font-weight: 400;
        }

        /* Import Button */
        .btn-import {
          padding: 0.6rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          white-space: nowrap !important;
          font-family: inherit !important;
        }

        .btn-import:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .import-icon {
          width: 16px;
          height: 16px;
        }

        /* Filters */
        .filters-wrapper {
          position: relative;
          z-index: 1;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .filters-wrapper :global(.lead-filters) {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Toolbar */
        .toolbar-section {
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

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.8rem 0.5rem 2.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0 0.3rem;
          transition: color 0.3s;
        }

        .clear-search:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        .toolbar-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .assign-wrapper {
          min-width: 140px;
        }

        .assign-wrapper :global(.assign-select) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .assign-wrapper :global(.assign-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .btn-assign {
          background: rgba(244, 197, 66, 0.08) !important;
          border: 1px solid rgba(244, 197, 66, 0.12) !important;
          border-radius: 8px !important;
          color: #f4c542 !important;
          font-weight: 500 !important;
          font-size: 0.8rem !important;
          padding: 0.4rem 0.8rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          font-family: inherit !important;
        }

        .btn-assign:hover:not(:disabled) {
          background: rgba(244, 197, 66, 0.12) !important;
          transform: translateY(-1px);
        }

        .btn-assign:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .btn-export {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-weight: 400 !important;
          font-size: 0.8rem !important;
          padding: 0.4rem 0.8rem !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          font-family: inherit !important;
        }

        .btn-export:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .btn-archive {
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.08) !important;
          border-radius: 8px !important;
          color: rgba(255, 68, 68, 0.6) !important;
          font-weight: 400 !important;
          font-size: 0.8rem !important;
          padding: 0.4rem 0.8rem !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          font-family: inherit !important;
        }

        .btn-archive:hover:not(:disabled) {
          background: rgba(255, 68, 68, 0.1) !important;
          border-color: rgba(255, 68, 68, 0.15) !important;
          color: #ff4444 !important;
        }

        .btn-archive:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .loader {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state p {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
        }

        /* Table Wrapper */
        .table-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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

        /* Responsive */
        @media (max-width: 768px) {
          .leads-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-import {
            width: 100%;
            justify-content: center;
          }

          .toolbar-section {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-actions {
            flex-wrap: wrap;
          }

          .assign-wrapper {
            min-width: 100%;
          }

          .btn-assign,
          .btn-export,
          .btn-archive {
            flex: 1;
            justify-content: center;
          }

          .filters-wrapper {
            padding: 0.5rem;
          }

          .filters-wrapper :global(.lead-filters) {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.25rem;
            flex-wrap: wrap;
          }

          .title-count {
            font-size: 0.75rem;
          }

          .duplicate-warning {
            font-size: 0.65rem;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .toolbar-actions {
            flex-direction: column;
          }

          .btn-assign,
          .btn-export,
          .btn-archive {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}