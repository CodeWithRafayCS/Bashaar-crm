"use client";

import { useEffect, useState } from "react";
import { ReportTabs, type ReportTab } from "@/components/reports/ReportTabs";
import { ChartContainer } from "@/components/reports/ChartContainer";
import { getReports } from "@/lib/api";
import { DATE_PRESETS } from "@/lib/utils/constants";
import { Button } from "@/components/common/Button";
import { useAppStore } from "@/lib/store";
import { KPICard } from "@/components/dashboard/KPICard";

export default function ReportsPage() {
  const { pushToast, version } = useAppStore();
  const [tab, setTab] = useState<ReportTab>("Funnel Report");
  const [preset, setPreset] = useState<(typeof DATE_PRESETS)[number]>("Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof getReports>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await getReports();
        setData(result);
      } catch (error) {
        pushToast("error", "Failed to load reports");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [version, preset, customFrom, customTo, pushToast]);

  function clearCustomDates() {
    setCustomFrom("");
    setCustomTo("");
  }

  return (
    <div className="reports-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Insight</span>
          </div>
          <h1 className="page-title">
            Reports
            <span className="title-count">{data?.metrics ? "Live" : "Loading"}</span>
          </h1>
          <p className="page-subtitle">Track performance metrics and analyze your sales pipeline</p>
        </div>
        <div className="header-actions">
          <button 
            type="button" 
            className="btn-export"
            onClick={() => pushToast("success", "CSV export queued")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            CSV
          </button>
          <button 
            type="button" 
            className="btn-export-pdf"
            onClick={() => pushToast("info", "PDF export is UI-only for now")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            PDF
          </button>
        </div>
      </header>

      {/* Date Filters */}
      <div className="filters-section">
        <div className="preset-filters">
          {DATE_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`preset-btn ${preset === p ? "active" : ""}`}
              onClick={() => setPreset(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="custom-filters">
          <div className="date-input-wrapper">
            <svg className="date-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="date-input"
              aria-label="Custom from"
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
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="date-input"
              aria-label="Custom to"
              placeholder="To"
            />
          </div>
          {(customFrom || customTo) && (
            <button className="clear-dates" onClick={clearCustomDates}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="kpi-skeleton-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="kpi-skeleton">
              <div className="skeleton-line" />
              <div className="skeleton-value" />
            </div>
          ))}
        </div>
      ) : data ? (
        <div className="kpi-grid">
          <KPICard 
            label="Contact Rate" 
            value={data.metrics.contactRate} 
            trend={2} 
            icon="📞"
          />
          <KPICard 
            label="Meeting Rate" 
            value={data.metrics.meetingRate} 
            trend={1} 
            icon="📅"
          />
          <KPICard 
            label="Proposal Rate" 
            value={data.metrics.proposalRate} 
            trend={3} 
            icon="📄"
          />
          <KPICard 
            label="Win Rate" 
            value={data.metrics.winRate} 
            trend={-1} 
            icon="🏆"
          />
          <KPICard 
            label="Follow-up Compliance" 
            value={data.metrics.followUpCompliance} 
            trend={4} 
            icon="✅"
          />
        </div>
      ) : null}

      {/* Report Tabs */}
      <div className="tabs-wrapper">
        <ReportTabs value={tab} onChange={setTab} />
      </div>

      {/* Chart Container */}
      <section className="chart-card">
        {loading ? (
          <div className="chart-skeleton">
            <div className="skeleton-chart" />
          </div>
        ) : !data ? (
          <div className="chart-empty">
            <p>No data available</p>
          </div>
        ) : (
          <>
            {tab === "Funnel Report" && (
              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">Funnel Report</h3>
                  <span className="chart-badge">Conversion</span>
                </div>
                <ChartContainer kind="funnel" data={data.funnel} />
              </div>
            )}
            {tab === "Revenue Report" && (
              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">Revenue Report</h3>
                  <span className="chart-badge">Trend</span>
                </div>
                <ChartContainer kind="line" data={data.revenue} />
              </div>
            )}
            {tab === "Source Report" && (
              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">Source Report</h3>
                  <span className="chart-badge">Distribution</span>
                </div>
                <ChartContainer kind="bar" data={data.bySource} />
              </div>
            )}
            {tab === "User Performance" && (
              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">User Performance</h3>
                  <span className="chart-badge">Activity</span>
                </div>
                <ChartContainer kind="bar" data={data.byOwner} />
              </div>
            )}
            {tab === "Activity Report" && (
              <div className="chart-section">
                <div className="chart-header">
                  <h3 className="chart-title">Activity Report</h3>
                  <span className="chart-badge">Logs</span>
                </div>
                <ChartContainer
                  kind="bar"
                  data={data.byOwner.map((o) => ({ source: o.name, count: o.activities }))}
                />
              </div>
            )}
          </>
        )}
      </section>

      <style jsx>{`
        .reports-page {
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
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(0, 200, 83, 0.6);
          background: rgba(0, 200, 83, 0.06);
          padding: 0.1rem 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(0, 200, 83, 0.08);
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

        .btn-export {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-export:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
        }

        .btn-export-pdf {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 8px;
          color: #f4c542;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-export-pdf:hover {
          background: rgba(244, 197, 66, 0.1);
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.1);
        }

        /* Filters Section */
        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .preset-filters {
          display: flex;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .preset-btn {
          padding: 0.3rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .preset-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .preset-btn.active {
          background: rgba(244, 197, 66, 0.08);
          border-color: rgba(244, 197, 66, 0.15);
          color: #f4c542;
        }

        .custom-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
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
          border-radius: 6px;
          padding: 0.4rem 0.5rem 0.4rem 2rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          font-family: inherit;
          transition: all 0.3s;
          width: 130px;
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
          color: rgba(255, 255, 255, 0.1);
          font-weight: 300;
          font-size: 0.7rem;
        }

        .clear-dates {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.6rem;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .clear-dates:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.5);
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .kpi-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .kpi-skeleton {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .skeleton-line {
          height: 12px;
          width: 60%;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-value {
          height: 28px;
          width: 40%;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          animation: pulse 1.5s ease-in-out infinite 0.3s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Tabs Wrapper */
        .tabs-wrapper {
          position: relative;
          z-index: 1;
          margin-bottom: 1rem;
        }

        .tabs-wrapper :global(.report-tabs) {
          display: flex;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          padding: 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .tabs-wrapper :global(.report-tab) {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .tabs-wrapper :global(.report-tab:hover) {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .tabs-wrapper :global(.report-tab.active) {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.2);
        }

        /* Chart Card */
        .chart-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          min-height: 400px;
        }

        .chart-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .chart-badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.5rem;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.08);
          border-radius: 4px;
          color: rgba(244, 197, 66, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .chart-skeleton {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 350px;
        }

        .skeleton-chart {
          width: 80%;
          height: 200px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .chart-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.9rem;
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .kpi-skeleton-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .preset-filters {
            justify-content: center;
          }

          .custom-filters {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .reports-page {
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

          .btn-export,
          .btn-export-pdf {
            flex: 1;
            justify-content: center;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .kpi-skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .preset-filters {
            gap: 0.2rem;
          }

          .preset-btn {
            padding: 0.2rem 0.6rem;
            font-size: 0.65rem;
          }

          .date-input {
            width: 100px;
            font-size: 0.65rem;
            padding: 0.3rem 0.3rem 0.3rem 1.8rem;
          }

          .date-icon {
            width: 12px;
            height: 12px;
            left: 8px;
          }

          .chart-card {
            padding: 1rem;
            min-height: 300px;
          }

          .tabs-wrapper :global(.report-tab) {
            font-size: 0.7rem;
            padding: 0.3rem 0.6rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .kpi-skeleton-grid {
            grid-template-columns: 1fr;
          }

          .custom-filters {
            flex-wrap: wrap;
          }

          .date-input {
            width: 80px;
            font-size: 0.6rem;
          }

          .tabs-wrapper :global(.report-tabs) {
            flex-direction: column;
          }

          .tabs-wrapper :global(.report-tab) {
            text-align: center;
          }

          .chart-card {
            min-height: 250px;
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}