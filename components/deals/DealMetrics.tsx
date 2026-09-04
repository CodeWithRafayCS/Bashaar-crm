"use client";

import { useMemo } from "react";
import type { Deal } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Target,
  Zap,
  Calendar,
} from "lucide-react";

interface DealMetricsProps {
  deals: Deal[];
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

export function DealMetrics({
  deals,
  loading = false,
  compact = false,
  className = "",
}: DealMetricsProps) {
  const metrics = useMemo(() => {
    const total = deals.length;
    const won = deals.filter((d) => d.stage === "Won" || d.won).length;
    const lost = deals.filter((d) => d.stage === "Lost").length;
    const active = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost").length;
    
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
    const wonValue = deals
      .filter((d) => d.stage === "Won" || d.won)
      .reduce((sum, d) => sum + d.value, 0);
    const activeValue = deals
      .filter((d) => d.stage !== "Won" && d.stage !== "Lost")
      .reduce((sum, d) => sum + d.value, 0);
    
    const winRate = total > 0 ? (won / (won + lost)) * 100 : 0;
    const avgDealSize = total > 0 ? totalValue / total : 0;
    
    // Calculate velocity (avg days from creation to won)
    let avgVelocity = 0;
    const wonDeals = deals.filter((d) => d.stage === "Won" || d.won);
    if (wonDeals.length > 0) {
      const totalDays = wonDeals.reduce((sum, d) => {
        if (d.createdAt && d.wonDate) {
          const created = new Date(d.createdAt);
          const won = new Date(d.wonDate);
          return sum + Math.ceil((won.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }
        return sum;
      }, 0);
      avgVelocity = totalDays / wonDeals.length;
    }

    return {
      total,
      won,
      lost,
      active,
      totalValue,
      wonValue,
      activeValue,
      winRate,
      avgDealSize,
      avgVelocity,
    };
  }, [deals]);

  if (loading) {
    return (
      <div className={`deal-metrics-skeleton ${compact ? "compact" : ""} ${className}`}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="metric-skeleton">
            <div className="skeleton-icon" />
            <div className="skeleton-content">
              <div className="skeleton-value" />
              <div className="skeleton-label" />
            </div>
          </div>
        ))}

        <style jsx>{`
          .deal-metrics-skeleton {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .deal-metrics-skeleton.compact {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.5rem;
          }

          .metric-skeleton {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            padding: 0.75rem;
          }

          .skeleton-icon {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            flex-shrink: 0;
            animation: pulse 1.5s ease-in-out infinite;
          }

          .skeleton-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .skeleton-value {
            height: 18px;
            width: 60%;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 4px;
            animation: pulse 1.5s ease-in-out infinite 0.2s;
          }

          .skeleton-label {
            height: 12px;
            width: 80%;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 4px;
            animation: pulse 1.5s ease-in-out infinite 0.4s;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`deal-metrics ${compact ? "compact" : ""} ${className}`}>
      {/* Total Deals */}
      <div className="metric-card">
        <div className="metric-icon blue">
          <DollarSign className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.total}</span>
          <span className="metric-label">Total Deals</span>
        </div>
        <div className="metric-sub">
          <span className="sub-value">{formatCurrency(metrics.totalValue)}</span>
        </div>
      </div>

      {/* Active Deals */}
      <div className="metric-card">
        <div className="metric-icon gold">
          <Clock className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.active}</span>
          <span className="metric-label">Active Deals</span>
        </div>
        <div className="metric-sub">
          <span className="sub-value">{formatCurrency(metrics.activeValue)}</span>
        </div>
      </div>

      {/* Won Deals */}
      <div className="metric-card">
        <div className="metric-icon green">
          <CheckCircle className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.won}</span>
          <span className="metric-label">Won</span>
        </div>
        <div className="metric-sub">
          <span className="sub-value">{formatCurrency(metrics.wonValue)}</span>
        </div>
      </div>

      {/* Lost Deals */}
      <div className="metric-card">
        <div className="metric-icon red">
          <XCircle className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.lost}</span>
          <span className="metric-label">Lost</span>
        </div>
        <div className="metric-sub">
          <span className="sub-value">{metrics.lost > 0 ? `${Math.round((metrics.lost / metrics.total) * 100)}%` : "—"}</span>
        </div>
      </div>

      {/* Win Rate */}
      <div className="metric-card">
        <div className="metric-icon gold">
          <Target className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{metrics.winRate.toFixed(1)}%</span>
          <span className="metric-label">Win Rate</span>
        </div>
        <div className="metric-sub">
          <span className={`sub-value ${metrics.winRate >= 50 ? "positive" : "negative"}`}>
            {metrics.winRate >= 50 ? (
              <TrendingUp className="trend-icon positive" />
            ) : (
              <TrendingDown className="trend-icon negative" />
            )}
            {metrics.winRate >= 50 ? "Above avg" : "Below avg"}
          </span>
        </div>
      </div>

      {/* Avg Deal Size */}
      <div className="metric-card">
        <div className="metric-icon purple">
          <Zap className="icon" />
        </div>
        <div className="metric-content">
          <span className="metric-value">{formatCurrency(metrics.avgDealSize)}</span>
          <span className="metric-label">Avg Deal Size</span>
        </div>
        <div className="metric-sub">
          <span className="sub-value">
            {metrics.total > 0 ? `${metrics.total} deals` : "No deals"}
          </span>
        </div>
      </div>

      <style jsx>{`
        .deal-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .deal-metrics.compact {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .deal-metrics.compact .metric-card {
          padding: 0.5rem 0.75rem;
        }

        .deal-metrics.compact .metric-icon {
          width: 28px;
          height: 28px;
        }

        .deal-metrics.compact .metric-icon .icon {
          width: 14px;
          height: 14px;
        }

        .deal-metrics.compact .metric-value {
          font-size: 0.85rem;
        }

        .deal-metrics.compact .metric-label {
          font-size: 0.55rem;
        }

        .deal-metrics.compact .metric-sub {
          font-size: 0.55rem;
        }

        /* Metric Card */
        .metric-card {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.6rem 0.75rem;
          transition: all 0.3s;
        }

        .metric-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        /* Icon */
        .metric-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .metric-icon .icon {
          width: 18px;
          height: 18px;
        }

        .metric-icon.blue {
          background: rgba(66, 133, 244, 0.06);
          color: #4285f4;
        }

        .metric-icon.gold {
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
        }

        .metric-icon.green {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .metric-icon.red {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .metric-icon.purple {
          background: rgba(156, 39, 176, 0.06);
          color: #9c27b0;
        }

        /* Content */
        .metric-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .metric-value {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.2;
        }

        .metric-label {
          font-size: 0.6rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Subtext */
        .metric-sub {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          margin-top: auto;
          padding-top: 0.1rem;
        }

        .sub-value {
          display: inline-flex;
          align-items: center;
          gap: 0.15rem;
        }

        .sub-value.positive {
          color: #00c853;
        }

        .sub-value.negative {
          color: #ff4444;
        }

        .trend-icon {
          width: 12px;
          height: 12px;
        }

        .trend-icon.positive {
          color: #00c853;
        }

        .trend-icon.negative {
          color: #ff4444;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .deal-metrics {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
          }

          .metric-card {
            padding: 0.5rem;
          }

          .metric-icon {
            width: 28px;
            height: 28px;
          }

          .metric-icon .icon {
            width: 14px;
            height: 14px;
          }

          .metric-value {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .deal-metrics {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.4rem;
          }

          .deal-metrics .metric-card {
            padding: 0.4rem 0.5rem;
          }

          .deal-metrics .metric-icon {
            width: 24px;
            height: 24px;
          }

          .deal-metrics .metric-icon .icon {
            width: 12px;
            height: 12px;
          }

          .deal-metrics .metric-value {
            font-size: 0.75rem;
          }

          .deal-metrics .metric-label {
            font-size: 0.5rem;
          }

          .metric-sub {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}