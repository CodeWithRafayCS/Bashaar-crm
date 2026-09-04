"use client";

import { useMemo, useState } from "react";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import { ActivityFilters } from "@/components/activities/ActivityFilters";
import { useActivities } from "@/lib/hooks/useActivities";
import { useLeads } from "@/lib/hooks/useLeads";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";

export default function ActivitiesPage() {
  const { activities } = useActivities();
  const { leads } = useLeads();
  const { users, pushToast, activeProjectId } = useAppStore();
  const [channel, setChannel] = useState("");
  const [owner, setOwner] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const leadOk = new Set(
      leads.filter((l) => (activeProjectId === "all" ? true : l.projectId === activeProjectId)).map((l) => l.id),
    );
    return activities.filter((a) => {
      if (channel && a.channel !== channel) return false;
      if (owner && a.ownerEmail !== owner) return false;
      if (from && a.createdAt < from) return false;
      if (to && a.createdAt > to) return false;
      if (!leadOk.has(a.leadId)) return false;
      return true;
    });
  }, [activities, channel, owner, from, to, leads, activeProjectId]);

  function exportCsv() {
    const blob = new Blob(
      [
        ["channel,lead,owner,created,notes", ...filtered.map((a) => [a.channel, a.leadId, a.ownerEmail, a.createdAt, a.notes].join(","))].join(
          "\n",
        ),
      ],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activities.csv";
    a.click();
    pushToast("success", "Activity CSV downloaded");
  }

  return (
    <div className="activities-page">
      {/* Animated background glow */}
      <div className="page-glow" />

      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Log</span>
          </div>
          <h1 className="page-title">
            Activities
            <span className="title-count">{filtered.length}</span>
          </h1>
          <p className="page-subtitle">Track all your sales interactions in one timeline</p>
        </div>
        <Button type="button" variant="gold" className="btn-export" onClick={exportCsv}>
          <svg className="export-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </Button>
      </header>

      <div className="filters-section">
        <ActivityFilters
          channel={channel}
          onChannel={setChannel}
          owner={owner}
          onOwner={setOwner}
          owners={users}
        />
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
              aria-label="From"
              className="date-input"
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
              aria-label="To"
              className="date-input"
              placeholder="To"
            />
          </div>
        </div>
      </div>

      <section className="activities-card">
        <div className="card-header">
          <div className="card-header-left">
            <span className="card-header-dot" />
            <span className="card-header-title">Activity Timeline</span>
          </div>
          <span className="card-header-count">{filtered.length} entries</span>
        </div>
        <div className="card-divider" />
        <ActivityTimeline activities={filtered} />
      </section>

      <style jsx>{`
        .activities-page {
          padding: 1.5rem;
          position: relative;
          min-height: 100vh;
        }

        /* Background Glow */
        .page-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.06) 0%, transparent 70%);
          top: -10%;
          right: -10%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        /* Page Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
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
          border: 1px solid rgba(244, 197, 66, 0.12);
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

        /* Export Button */
        .btn-export {
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

        .btn-export:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .export-icon {
          width: 16px;
          height: 16px;
        }

        /* Filters Section */
        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          align-items: center;
        }

        .filters-section :global(.activity-filters) {
          flex: 1;
          min-width: 200px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .date-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.4rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
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
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.08);
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

        /* Activities Card */
        .activities-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 0;
          position: relative;
          z-index: 1;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .card-header-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          box-shadow: 0 0 20px rgba(244, 197, 66, 0.2);
        }

        .card-header-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 0.3px;
        }

        .card-header-count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .card-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.04), rgba(244, 197, 66, 0.08), rgba(255, 255, 255, 0.04));
          margin: 0 1.5rem;
        }

        .activities-card :global(.activity-timeline) {
          padding: 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .activities-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .date-filters {
            flex-wrap: wrap;
            justify-content: center;
          }

          .date-input {
            width: 120px;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-export {
            width: 100%;
            justify-content: center;
          }

          .card-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .date-input {
            width: 100px;
            font-size: 0.7rem;
            padding: 0.4rem 0.4rem 0.4rem 1.8rem;
          }

          .date-filters {
            padding: 0.3rem 0.4rem;
          }

          .date-icon {
            width: 12px;
            height: 12px;
            left: 8px;
          }
        }
      `}</style>
    </div>
  );
}