"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TodayTasks } from "@/components/dashboard/TodayTasks";
import { PipelinePreview } from "@/components/dashboard/PipelinePreview";
import { Reveal } from "@/components/common/Reveal";
import { getActivities, getDatabase, getKPIs, getLeads, getTasks } from "@/lib/api";
import type { Activity, KPISnapshot, Lead, RevenuePoint, Task } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { taskDueKind } from "@/lib/utils/format";

export default function DashboardPage() {
  const { version } = useAppStore();
  const [kpis, setKpis] = useState<KPISnapshot | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void Promise.all([getKPIs(), getLeads(), getTasks(), getActivities(), getDatabase()]).then(
      ([k, l, t, a, db]) => {
        setKpis(k);
        setLeads(l);
        setTasks(t);
        setActivities(a);
        setRevenue(db.revenueSeries);
        setLoading(false);
      },
    );
  }, [version]);

  const todayTasks = tasks
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => {
      const rank = (t: Task) => {
        const k = taskDueKind(t.dueDate);
        return k === "overdue" ? 0 : k === "today" ? 1 : 2;
      };
      return rank(a) - rank(b);
    });

  const overdueCount = todayTasks.filter((t) => taskDueKind(t.dueDate) === "overdue").length;

  return (
    <div className="dashboard-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Overview</span>
          </div>
          <h1 className="page-title">
            <span className="title-line">Today's</span>
            <span className="title-line highlight">Operating</span>
            <span className="title-line">Picture</span>
          </h1>
          <div className="header-stats">
            <span className="header-stat">
              <span className="stat-dot green" />
              {leads.length} Active Leads
            </span>
            {overdueCount > 0 && (
              <span className="header-stat warning">
                <span className="stat-dot red" />
                {overdueCount} Overdue Tasks
              </span>
            )}
            <span className="header-stat">
              <span className="stat-dot gold" />
              {tasks.filter((t) => t.status === "Completed").length} Completed
            </span>
          </div>
        </div>
        <div className="header-actions">
          <div className="time-display">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              month: "long", 
              day: "numeric",
              year: "numeric"
            })}</span>
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {loading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="kpi-skeleton">
                <div className="skeleton-line" />
                <div className="skeleton-value" />
                <div className="skeleton-trend" />
              </div>
            ))}
          </>
        ) : kpis ? (
          <>
            <KPICard 
              label="New Leads" 
              value={kpis.newLeads} 
              trend={kpis.newLeadsTrend} 
              icon="📊"
            />
            <KPICard 
              label="Contact Rate" 
              value={kpis.contactRate} 
              trend={kpis.contactRateTrend} 
              icon="📞"
            />
            <KPICard 
              label="Meeting Rate" 
              value={kpis.meetingRate} 
              trend={kpis.meetingRateTrend} 
              icon="📅"
            />
            <KPICard 
              label="Revenue Booked" 
              value={kpis.revenueBooked} 
              trend={kpis.revenueBookedTrend} 
              money 
              icon="💰"
            />
            <KPICard 
              label="Cash Collected" 
              value={kpis.cashCollected} 
              trend={kpis.cashCollectedTrend} 
              money 
              icon="💳"
            />
            <KPICard 
              label="Pipeline Value" 
              value={kpis.pipelineValue} 
              trend={kpis.pipelineValueTrend} 
              money 
              icon="📈"
            />
          </>
        ) : null}
      </div>

      {/* Two Column Layout */}
      <div className="dash-grid">
        <Reveal>
          <section className="dashboard-card tasks-card">
            <div className="card-header">
              <div className="card-header-left">
                <span className="card-icon">✅</span>
                <h2 className="card-title">Today's Tasks</h2>
              </div>
              <span className="card-badge">{todayTasks.length}</span>
            </div>
            <div className="card-divider" />
            <TodayTasks tasks={todayTasks} />
          </section>
        </Reveal>

        <Reveal>
          <section className="dashboard-card activity-card">
            <div className="card-header">
              <div className="card-header-left">
                <span className="card-icon">📋</span>
                <h2 className="card-title">Recent Activity</h2>
              </div>
              <span className="card-badge">{activities.length}</span>
            </div>
            <div className="card-divider" />
            <RecentActivity activities={activities} leads={leads} />
          </section>
        </Reveal>
      </div>

      {/* Pipeline Preview */}
      <Reveal>
        <section className="dashboard-card pipeline-card">
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon">📊</span>
              <h2 className="card-title">Pipeline Preview</h2>
            </div>
            <span className="card-badge">{leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost").length} Active</span>
          </div>
          <div className="card-divider" />
          <PipelinePreview leads={leads} />
        </section>
      </Reveal>

      {/* Revenue Chart */}
      <Reveal>
        <section className="dashboard-card revenue-card">
          <div className="card-header">
            <div className="card-header-left">
              <span className="card-icon">📈</span>
              <h2 className="card-title">Revenue</h2>
            </div>
            <span className="card-badge">
              {kpis && `Total: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(kpis.cashCollected)}`}
            </span>
          </div>
          <div className="card-divider" />
          <RevenueChart data={revenue} />
        </section>
      </Reveal>

      <style jsx>{`
        .dashboard-page {
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
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.04) 0%, transparent 70%);
          top: -10%;
          right: -10%;
          animation: float-glow 20s ease-in-out infinite;
        }

        .page-glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.02) 0%, transparent 70%);
          bottom: -10%;
          left: -10%;
          animation: float-glow 20s ease-in-out infinite reverse;
        }

        @keyframes float-glow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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
          font-size: 2.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: -0.5px;
          flex-wrap: wrap;
        }

        .title-line {
          display: inline-block;
        }

        .title-line.highlight {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .header-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .header-stat.warning {
          color: #ff4444;
        }

        .stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .stat-dot.green {
          background: #00c853;
        }

        .stat-dot.red {
          background: #ff4444;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        .stat-dot.gold {
          background: #f4c542;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          white-space: nowrap;
        }

        .time-display svg {
          color: rgba(255, 255, 255, 0.15);
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .kpi-skeleton {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-line {
          height: 12px;
          width: 60%;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
        }

        .skeleton-value {
          height: 28px;
          width: 50%;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
        }

        .skeleton-trend {
          height: 16px;
          width: 30%;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Dashboard Grid */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        /* Dashboard Cards */
        .dashboard-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dashboard-card:hover {
          border-color: rgba(244, 197, 66, 0.06);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-icon {
          font-size: 1.2rem;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .card-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .card-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.03), rgba(244, 197, 66, 0.06), rgba(255, 255, 255, 0.03));
          margin-bottom: 0.75rem;
        }

        .pipeline-card {
          margin-bottom: 1rem;
        }

        .revenue-card {
          margin-bottom: 1rem;
        }

        /* Card overrides for child components */
        .tasks-card :global(.today-tasks) {
          max-height: 300px;
          overflow-y: auto;
        }

        .tasks-card :global(.today-tasks::-webkit-scrollbar) {
          width: 3px;
        }

        .tasks-card :global(.today-tasks::-webkit-scrollbar-track) {
          background: transparent;
        }

        .tasks-card :global(.today-tasks::-webkit-scrollbar-thumb) {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        .activity-card :global(.recent-activity) {
          max-height: 300px;
          overflow-y: auto;
        }

        .activity-card :global(.recent-activity::-webkit-scrollbar) {
          width: 3px;
        }

        .activity-card :global(.recent-activity::-webkit-scrollbar-track) {
          background: transparent;
        }

        .activity-card :global(.recent-activity::-webkit-scrollbar-thumb) {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 992px) {
          .dash-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.8rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-stats {
            flex-wrap: wrap;
          }

          .time-display {
            font-size: 0.65rem;
            padding: 0.3rem 0.6rem;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-card {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.4rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.1rem;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
          }

          .header-stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }

          .time-display {
            width: 100%;
            justify-content: center;
          }

          .dashboard-card {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}