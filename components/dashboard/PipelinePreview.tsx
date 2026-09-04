"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { ChevronRight, Users, DollarSign } from "lucide-react";

interface PipelinePreviewProps {
  leads: Lead[];
  maxStages?: number;
  showDetails?: boolean;
  compact?: boolean;
}

const STAGE_ORDER = [
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
];

const STAGE_COLORS: Record<string, string> = {
  "New": "#4285f4",
  "Attempted": "#9c27b0",
  "Connected": "#00c853",
  "Interested": "#ffc107",
  "Meeting Scheduled": "#f4c542",
  "Proposal Sent": "#ff6f00",
  "Negotiation": "#ff4444",
};

const STAGE_ICONS: Record<string, string> = {
  "New": "🆕",
  "Attempted": "📞",
  "Connected": "✅",
  "Interested": "⭐",
  "Meeting Scheduled": "📅",
  "Proposal Sent": "📄",
  "Negotiation": "🤝",
};

export function PipelinePreview({
  leads,
  maxStages = 5,
  showDetails = true,
  compact = false,
}: PipelinePreviewProps) {
  // Filter out Won/Lost leads and group by stage
  const stageData = useMemo(() => {
    const activeLeads = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
    const grouped: Record<string, { count: number; value: number; leads: Lead[] }> = {};

    STAGE_ORDER.forEach((stage) => {
      const stageLeads = activeLeads.filter((l) => l.stage === stage);
      grouped[stage] = {
        count: stageLeads.length,
        value: stageLeads.reduce((sum, l) => sum + l.value, 0),
        leads: stageLeads,
      };
    });

    // Add any stages that might not be in STAGE_ORDER
    activeLeads.forEach((l) => {
      if (!grouped[l.stage]) {
        grouped[l.stage] = {
          count: 0,
          value: 0,
          leads: [],
        };
      }
    });

    return grouped;
  }, [leads]);

  const totalLeads = Object.values(stageData).reduce((sum, s) => sum + s.count, 0);
  const totalValue = Object.values(stageData).reduce((sum, s) => sum + s.value, 0);

  const visibleStages = Object.entries(stageData)
    .filter(([_, data]) => data.count > 0)
    .slice(0, maxStages);

  const hasMoreStages = Object.entries(stageData).filter(([_, data]) => data.count > 0).length > maxStages;

  const maxCount = Math.max(...Object.values(stageData).map((s) => s.count), 1);

  if (totalLeads === 0) {
    return (
      <div className="pipeline-empty">
        <div className="empty-icon">📊</div>
        <p className="empty-title">No active leads in pipeline</p>
        <p className="empty-description">Add leads to see your pipeline here</p>
        <Link href="/leads" className="empty-action">
          View all leads →
        </Link>

        <style jsx>{`
          .pipeline-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            text-align: center;
            min-height: 150px;
          }

          .empty-icon {
            font-size: 2.5rem;
            opacity: 0.2;
            margin-bottom: 0.5rem;
          }

          .empty-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.3);
            margin: 0 0 0.2rem 0;
          }

          .empty-description {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.1);
            margin: 0 0 0.75rem 0;
          }

          .empty-action {
            font-size: 0.8rem;
            color: rgba(244, 197, 66, 0.4);
            text-decoration: none;
            transition: color 0.3s;
          }

          .empty-action:hover {
            color: #f4c542;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`pipeline-preview ${compact ? "compact" : ""}`}>
      {/* Header */}
      {showDetails && (
        <div className="pipeline-header">
          <div className="pipeline-stats">
            <div className="stat-item">
              <Users className="stat-icon" />
              <span className="stat-value">{totalLeads}</span>
              <span className="stat-label">Active Leads</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <DollarSign className="stat-icon" />
              <span className="stat-value gold">{formatCurrency(totalValue)}</span>
              <span className="stat-label">Total Value</span>
            </div>
          </div>
          <Link href="/pipeline" className="view-all">
            View Pipeline
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Pipeline Bars */}
      <div className="pipeline-bars">
        {visibleStages.map(([stage, data]) => {
          const percentage = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
          const color = STAGE_COLORS[stage] || "#ffffff";
          const icon = STAGE_ICONS[stage] || "📌";

          return (
            <div key={stage} className="stage-bar">
              <div className="stage-header">
                <span className="stage-icon">{icon}</span>
                <span className="stage-name">{stage}</span>
                <span className="stage-count">{data.count}</span>
              </div>
              <div className="stage-track">
                <div
                  className="stage-fill"
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    background: `linear-gradient(90deg, ${color}80, ${color})`,
                  }}
                />
              </div>
              {showDetails && data.value > 0 && (
                <span className="stage-value">{formatCurrency(data.value)}</span>
              )}
            </div>
          );
        })}

        {hasMoreStages && (
          <div className="stage-more">
            <span className="more-text">+{Object.entries(stageData).filter(([_, data]) => data.count > 0).length - maxStages} more stages</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .pipeline-preview {
          width: 100%;
        }

        .pipeline-preview.compact .pipeline-header {
          margin-bottom: 0.5rem;
        }

        .pipeline-preview.compact .stage-header {
          font-size: 0.7rem;
        }

        .pipeline-preview.compact .stage-count {
          font-size: 0.7rem;
        }

        .pipeline-preview.compact .stage-value {
          font-size: 0.6rem;
        }

        /* Header */
        .pipeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pipeline-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stat-icon {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .stat-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-value.gold {
          color: #f4c542;
        }

        .stat-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.04);
        }

        .view-all {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.4);
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all:hover {
          color: #f4c542;
        }

        .view-all svg {
          transition: transform 0.3s;
        }

        .view-all:hover svg {
          transform: translateX(2px);
        }

        /* Pipeline Bars */
        .pipeline-bars {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stage-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stage-header {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          min-width: 130px;
          flex-shrink: 0;
        }

        .stage-icon {
          font-size: 0.85rem;
        }

        .stage-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          white-space: nowrap;
        }

        .stage-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.2);
          margin-left: auto;
        }

        .stage-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
          min-width: 60px;
        }

        .stage-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .stage-value {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.15);
          min-width: 70px;
          text-align: right;
          flex-shrink: 0;
        }

        .stage-more {
          display: flex;
          justify-content: center;
          padding: 0.2rem 0;
        }

        .more-text {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stage-header {
            min-width: 80px;
          }

          .stage-name {
            font-size: 0.65rem;
          }

          .stage-icon {
            font-size: 0.7rem;
          }

          .stage-count {
            font-size: 0.65rem;
          }

          .stage-value {
            font-size: 0.6rem;
            min-width: 55px;
          }

          .stat-value {
            font-size: 0.8rem;
          }

          .stat-label {
            font-size: 0.6rem;
          }

          .stat-icon {
            width: 14px;
            height: 14px;
          }

          .view-all {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 480px) {
          .stage-header {
            min-width: 60px;
          }

          .stage-name {
            font-size: 0.6rem;
          }

          .stage-icon {
            font-size: 0.6rem;
          }

          .stage-count {
            font-size: 0.6rem;
          }

          .stage-value {
            font-size: 0.55rem;
            min-width: 45px;
          }

          .pipeline-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .pipeline-stats {
            justify-content: space-around;
          }

          .stat-divider {
            display: none;
          }

          .view-all {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}