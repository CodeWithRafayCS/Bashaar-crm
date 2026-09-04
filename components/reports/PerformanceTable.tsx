"use client";

import { useState, useMemo } from "react";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  User,
  DollarSign,
  Target,
  ChevronUp,
  ChevronDown,
  Star,
  Users,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

interface PerformanceData {
  id: string;
  name: string;
  email: string;
  role: string;
  leadsAssigned: number;
  leadsContacted: number;
  meetingsBooked: number;
  proposalsSent: number;
  dealsWon: number;
  dealsLost: number;
  revenue: number;
  tasksCompleted: number;
  contactRate: number;
  meetingRate: number;
  proposalRate: number;
  winRate: number;
  avgDealSize: number;
  responseTime: number;
  activities: number;
}

interface PerformanceTableProps {
  data: PerformanceData[];
  loading?: boolean;
  compact?: boolean;
  onRowClick?: (id: string) => void;
  className?: string;
}

type SortKey = keyof PerformanceData;
type SortDirection = "asc" | "desc";

const METRIC_COLORS: Record<string, string> = {
  "leadsAssigned": "#4285f4",
  "leadsContacted": "#9c27b0",
  "meetingsBooked": "#ffc107",
  "proposalsSent": "#ff6f00",
  "dealsWon": "#00c853",
  "dealsLost": "#ff4444",
  "revenue": "#f4c542",
  "tasksCompleted": "#00c853",
  "contactRate": "#4285f4",
  "meetingRate": "#9c27b0",
  "proposalRate": "#ff6f00",
  "winRate": "#00c853",
  "avgDealSize": "#f4c542",
  "responseTime": "#ff4444",
  "activities": "#4285f4",
};

const METRIC_ICONS: Record<string, React.ReactNode> = {
  "leadsAssigned": <Users className="metric-icon" />,
  "leadsContacted": <Phone className="metric-icon" />,
  "meetingsBooked": <Calendar className="metric-icon" />,
  "proposalsSent": <Target className="metric-icon" />,
  "dealsWon": <CheckCircle className="metric-icon" />,
  "dealsLost": <XCircle className="metric-icon" />,
  "revenue": <DollarSign className="metric-icon" />,
  "tasksCompleted": <CheckCircle className="metric-icon" />,
  "contactRate": <Phone className="metric-icon" />,
  "meetingRate": <Calendar className="metric-icon" />,
  "proposalRate": <Target className="metric-icon" />,
  "winRate": <Star className="metric-icon" />,
  "avgDealSize": <DollarSign className="metric-icon" />,
  "responseTime": <Clock className="metric-icon" />,
  "activities": <Users className="metric-icon" />,
};

export function PerformanceTable({
  data,
  loading = false,
  compact = false,
  onRowClick,
  className = "",
}: PerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === "asc" 
        ? (aVal > bVal ? 1 : -1)
        : (bVal > aVal ? 1 : -1);
    });
  }, [data, sortKey, sortDirection]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" 
      ? <ChevronUp className="sort-icon active" />
      : <ChevronDown className="sort-icon active" />;
  };

  const formatMetric = (value: number, key: SortKey): string => {
    if (key === "revenue" || key === "avgDealSize") {
      return formatCurrency(value);
    }
    if (key === "contactRate" || key === "meetingRate" || key === "proposalRate" || key === "winRate") {
      return `${value}%`;
    }
    if (key === "responseTime") {
      return `${value.toFixed(1)}h`;
    }
    return value.toString();
  };

  const getMetricColor = (key: SortKey, value: number) => {
    const baseColor = METRIC_COLORS[key] || "#ffffff";
    return baseColor;
  };

  if (loading) {
    return (
      <div className="performance-loading">
        <div className="spinner" />
        <span>Loading performance data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="performance-empty">
        <User className="empty-icon" />
        <p>No performance data available</p>
      </div>
    );
  }

  return (
    <div className={`performance-table-wrapper ${compact ? "compact" : ""} ${className}`}>
      <div className="table-scroll">
        <table className="performance-table">
          <thead>
            <tr>
              <th className="col-user">Team Member</th>
              <th className="col-metric" onClick={() => handleSort("leadsAssigned")}>
                <span className="header-content">
                  <Users className="header-icon" />
                  Leads
                  {getSortIcon("leadsAssigned")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("leadsContacted")}>
                <span className="header-content">
                  <Phone className="header-icon" />
                  Contacted
                  {getSortIcon("leadsContacted")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("meetingsBooked")}>
                <span className="header-content">
                  <Calendar className="header-icon" />
                  Meetings
                  {getSortIcon("meetingsBooked")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("proposalsSent")}>
                <span className="header-content">
                  <Target className="header-icon" />
                  Proposals
                  {getSortIcon("proposalsSent")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("dealsWon")}>
                <span className="header-content">
                  <CheckCircle className="header-icon" />
                  Won
                  {getSortIcon("dealsWon")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("revenue")}>
                <span className="header-content">
                  <DollarSign className="header-icon" />
                  Revenue
                  {getSortIcon("revenue")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("winRate")}>
                <span className="header-content">
                  <Star className="header-icon" />
                  Win Rate
                  {getSortIcon("winRate")}
                </span>
              </th>
              <th className="col-metric" onClick={() => handleSort("tasksCompleted")}>
                <span className="header-content">
                  <CheckCircle className="header-icon" />
                  Tasks
                  {getSortIcon("tasksCompleted")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className={`${selectedId === row.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedId(row.id);
                  onRowClick?.(row.id);
                }}
              >
                <td className="col-user">
                  <div className="user-cell">
                    <div className="user-avatar">
                      {row.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{row.name}</span>
                      <span className="user-role">{row.role}</span>
                    </div>
                  </div>
                </td>
                <td className="col-metric">
                  <span className="metric-value">
                    {row.leadsAssigned}
                  </span>
                </td>
                <td className="col-metric">
                  <span className="metric-value">
                    {row.leadsContacted}
                  </span>
                  <span className="metric-sub">
                    {row.contactRate}%
                  </span>
                </td>
                <td className="col-metric">
                  <span className="metric-value">
                    {row.meetingsBooked}
                  </span>
                  <span className="metric-sub">
                    {row.meetingRate}%
                  </span>
                </td>
                <td className="col-metric">
                  <span className="metric-value">
                    {row.proposalsSent}
                  </span>
                  <span className="metric-sub">
                    {row.proposalRate}%
                  </span>
                </td>
                <td className="col-metric">
                  <span className={`metric-value ${row.dealsWon > 0 ? "positive" : ""}`}>
                    {row.dealsWon}
                  </span>
                  <span className={`metric-sub ${row.dealsLost > 0 ? "negative" : ""}`}>
                    Lost: {row.dealsLost}
                  </span>
                </td>
                <td className="col-metric">
                  <span className="metric-value gold">
                    {formatCurrency(row.revenue)}
                  </span>
                </td>
                <td className="col-metric">
                  <span className={`metric-value ${row.winRate >= 40 ? "positive" : "negative"}`}>
                    {row.winRate}%
                  </span>
                </td>
                <td className="col-metric">
                  <span className="metric-value">
                    {row.tasksCompleted}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .performance-table-wrapper {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .performance-table-wrapper.compact {
          font-size: 0.8rem;
        }

        .performance-table-wrapper.compact .user-cell {
          gap: 0.5rem;
        }

        .performance-table-wrapper.compact .user-avatar {
          width: 28px;
          height: 28px;
          font-size: 0.7rem;
        }

        .performance-table-wrapper.compact .user-name {
          font-size: 0.8rem;
        }

        .performance-table-wrapper.compact .user-role {
          font-size: 0.55rem;
        }

        .performance-table-wrapper.compact .col-user,
        .performance-table-wrapper.compact .col-metric {
          padding: 0.3rem 0.6rem;
        }

        .table-scroll {
          overflow-x: auto;
        }

        .performance-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        /* Header */
        .performance-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .performance-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.2);
          cursor: default;
          user-select: none;
          white-space: nowrap;
        }

        .performance-table th.sortable {
          cursor: pointer;
          transition: color 0.3s;
        }

        .performance-table th.sortable:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        .header-content {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .header-icon {
          width: 14px;
          height: 14px;
        }

        .sort-icon {
          width: 14px;
          height: 14px;
        }

        .sort-icon.active {
          color: #f4c542;
        }

        /* Body */
        .performance-table tbody tr {
          transition: background 0.2s;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }

        .performance-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .performance-table tbody tr.selected {
          background: rgba(244, 197, 66, 0.04);
        }

        .performance-table td {
          padding: 0.5rem 0.8rem;
          vertical-align: middle;
          color: rgba(255, 255, 255, 0.6);
        }

        /* User Cell */
        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .user-role {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Metric */
        .col-metric {
          text-align: center;
          min-width: 70px;
        }

        .metric-value {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        .metric-value.gold {
          color: #f4c542;
        }

        .metric-value.positive {
          color: #00c853;
        }

        .metric-value.negative {
          color: #ff4444;
        }

        .metric-sub {
          display: block;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .metric-sub.negative {
          color: rgba(255, 68, 68, 0.3);
        }

        /* Loading */
        .performance-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Empty */
        .performance-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          opacity: 0.2;
        }

        .performance-empty p {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .col-metric:nth-child(2),
          .col-metric:nth-child(3),
          .col-metric:nth-child(4),
          .col-metric:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .col-metric:nth-child(6),
          .col-metric:nth-child(7) {
            display: none;
          }

          .performance-table th,
          .performance-table td {
            padding: 0.4rem 0.6rem;
          }

          .user-avatar {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .user-name {
            font-size: 0.75rem;
          }

          .metric-value {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .performance-table {
            font-size: 0.75rem;
          }

          .col-user {
            padding: 0.3rem 0.4rem;
          }

          .col-metric {
            padding: 0.3rem 0.4rem;
            min-width: 50px;
          }

          .metric-value {
            font-size: 0.7rem;
          }

          .metric-sub {
            font-size: 0.5rem;
          }

          .user-cell {
            gap: 0.3rem;
          }

          .user-avatar {
            width: 24px;
            height: 24px;
            font-size: 0.6rem;
          }

          .user-name {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}