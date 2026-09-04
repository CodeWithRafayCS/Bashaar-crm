"use client";

import { ReactNode } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Activity,
  DollarSign,
  Target,
  Clock,
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export type ReportTab = 
  | "Funnel Report"
  | "Revenue Report"
  | "Source Report"
  | "User Performance"
  | "Activity Report"
  | "Conversion Report"
  | "Forecast Report";

interface ReportTabsProps {
  value: ReportTab;
  onChange: (tab: ReportTab) => void;
  className?: string;
  compact?: boolean;
}

interface TabItem {
  id: ReportTab;
  label: string;
  icon: ReactNode;
  description?: string;
  badge?: number | string;
}

const TABS: TabItem[] = [
  {
    id: "Funnel Report",
    label: "Funnel",
    icon: <PieChart className="tab-icon" />,
    description: "Pipeline conversion",
  },
  {
    id: "Revenue Report",
    label: "Revenue",
    icon: <DollarSign className="tab-icon" />,
    description: "Revenue analytics",
  },
  {
    id: "Source Report",
    label: "Sources",
    icon: <Activity className="tab-icon" />,
    description: "Lead sources",
  },
  {
    id: "User Performance",
    label: "Performance",
    icon: <Users className="tab-icon" />,
    description: "User metrics",
  },
  {
    id: "Activity Report",
    label: "Activity",
    icon: <Clock className="tab-icon" />,
    description: "Activity logs",
  },
  {
    id: "Conversion Report",
    label: "Conversion",
    icon: <Target className="tab-icon" />,
    description: "Conversion rates",
  },
  {
    id: "Forecast Report",
    label: "Forecast",
    icon: <TrendingUp className="tab-icon" />,
    description: "Revenue forecast",
  },
];

export function ReportTabs({
  value,
  onChange,
  className = "",
  compact = false,
}: ReportTabsProps) {
  const getTabClasses = (tab: TabItem) => {
    const isActive = value === tab.id;
    return `report-tab ${isActive ? "active" : ""} ${compact ? "compact" : ""}`;
  };

  return (
    <div className={`report-tabs-wrapper ${className} ${compact ? "compact" : ""}`}>
      <div className="report-tabs-scroll">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={getTabClasses(tab)}
            onClick={() => onChange(tab.id)}
            aria-selected={value === tab.id}
            role="tab"
          >
            <span className="tab-content">
              <span className="tab-icon-wrapper">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.description && !compact && (
                <span className="tab-description">{tab.description}</span>
              )}
              {tab.badge && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </span>
            {value === tab.id && <span className="tab-indicator" />}
          </button>
        ))}
      </div>

      <style jsx>{`
        .report-tabs-wrapper {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.3rem;
          overflow: hidden;
          transition: all 0.3s;
        }

        .report-tabs-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.05);
        }

        .report-tabs-wrapper.compact {
          padding: 0.2rem;
        }

        .report-tabs-wrapper.compact .report-tab {
          padding: 0.3rem 0.6rem;
          font-size: 0.7rem;
        }

        .report-tabs-wrapper.compact .tab-icon-wrapper {
          width: 20px;
          height: 20px;
        }

        .report-tabs-wrapper.compact .tab-icon {
          width: 14px;
          height: 14px;
        }

        .report-tabs-wrapper.compact .tab-description {
          display: none;
        }

        .report-tabs-scroll {
          display: flex;
          gap: 0.2rem;
          overflow-x: auto;
          padding: 0.1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(244, 197, 66, 0.1) transparent;
        }

        .report-tabs-scroll::-webkit-scrollbar {
          height: 2px;
        }

        .report-tabs-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .report-tabs-scroll::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        /* Tab */
        .report-tab {
          display: flex;
          align-items: center;
          position: relative;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
          flex-shrink: 0;
          min-height: 40px;
        }

        .report-tab:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .report-tab.active {
          background: rgba(244, 197, 66, 0.06);
        }

        .report-tab.active .tab-label {
          color: #f4c542;
        }

        .report-tab.active .tab-icon-wrapper {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .report-tab:active {
          transform: scale(0.97);
        }

        .tab-content {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          position: relative;
        }

        .tab-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.15);
          transition: all 0.3s;
          flex-shrink: 0;
        }

        .tab-icon {
          width: 16px;
          height: 16px;
        }

        .report-tab:hover .tab-icon-wrapper {
          color: rgba(255, 255, 255, 0.3);
        }

        .report-tab.active .tab-icon-wrapper {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .tab-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.3s;
          white-space: nowrap;
        }

        .report-tab:hover .tab-label {
          color: rgba(255, 255, 255, 0.6);
        }

        .tab-description {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
          margin-left: 0.2rem;
          white-space: nowrap;
        }

        .report-tab.active .tab-description {
          color: rgba(244, 197, 66, 0.2);
        }

        .tab-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.05rem 0.3rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.08);
          border-radius: 4px;
          font-size: 0.55rem;
          font-weight: 600;
          color: #f4c542;
        }

        .tab-indicator {
          position: absolute;
          bottom: -0.3rem;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg, #f4c542, #d4a030);
          border-radius: 2px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .report-tabs-wrapper {
            padding: 0.2rem;
          }

          .report-tab {
            padding: 0.3rem 0.6rem;
            min-height: 32px;
          }

          .tab-icon-wrapper {
            width: 22px;
            height: 22px;
          }

          .tab-icon {
            width: 13px;
            height: 13px;
          }

          .tab-label {
            font-size: 0.7rem;
          }

          .tab-description {
            display: none;
          }

          .tab-indicator {
            bottom: -0.2rem;
            width: 14px;
            height: 2px;
          }
        }

        @media (max-width: 480px) {
          .report-tabs-wrapper {
            padding: 0.15rem;
          }

          .report-tab {
            padding: 0.2rem 0.4rem;
            min-height: 28px;
          }

          .tab-icon-wrapper {
            width: 18px;
            height: 18px;
          }

          .tab-icon {
            width: 11px;
            height: 11px;
          }

          .tab-label {
            font-size: 0.65rem;
          }

          .tab-badge {
            font-size: 0.5rem;
            padding: 0.05rem 0.2rem;
          }
        }
      `}</style>
    </div>
  );
}