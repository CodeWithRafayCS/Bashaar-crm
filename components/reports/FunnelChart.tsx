"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  FunnelChart as RechartsFunnelChart,
  Funnel,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

interface FunnelChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  dataKey?: string;
  nameKey?: string;
  height?: number;
  loading?: boolean;
  colors?: string[];
  showLabels?: boolean;
  showValues?: boolean;
  showPercentages?: boolean;
  className?: string;
}

const DEFAULT_COLORS = [
  "#4285f4",
  "#9c27b0",
  "#00c853",
  "#ffc107",
  "#f4c542",
  "#ff6f00",
  "#ff4444",
];

export function FunnelChart({
  data,
  dataKey = "value",
  nameKey = "name",
  height = 300,
  loading = false,
  colors = DEFAULT_COLORS,
  showLabels = true,
  showValues = true,
  showPercentages = true,
  className = "",
}: FunnelChartProps) {
  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);
  }, [data, dataKey]);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Calculate percentages
    return data.map((item, index) => ({
      ...item,
      percentage: totalValue > 0 ? ((item[dataKey] || 0) / totalValue) * 100 : 0,
      index,
    }));
  }, [data, dataKey, totalValue]);

  const renderLabel = (props: any) => {
    const { x, y, width, height: cellHeight, value, index } = props;
    const item = chartData[index];
    if (!item) return null;

    const labelY = y + cellHeight / 2 + 5;
    const labelX = x + width + 10;

    return (
      <g>
        {showLabels && (
          <text
            x={labelX}
            y={labelY}
            fill="rgba(255, 255, 255, 0.4)"
            fontSize={12}
            fontWeight={500}
            textAnchor="start"
          >
            {item[nameKey]}
          </text>
        )}
        {showValues && (
          <text
            x={x + width - 10}
            y={labelY}
            fill="rgba(255, 255, 255, 0.2)"
            fontSize={11}
            textAnchor="end"
          >
            {typeof value === 'number' && value > 1000 
              ? formatCurrency(value) 
              : value}
          </text>
        )}
        {showPercentages && (
          <text
            x={x + width - 10}
            y={labelY + 18}
            fill="rgba(255, 255, 255, 0.1)"
            fontSize={10}
            textAnchor="end"
          >
            {item.percentage.toFixed(1)}%
          </text>
        )}
      </g>
    );
  };

  if (loading) {
    return (
      <div className="funnel-loading">
        <div className="spinner" />
        <span>Loading funnel...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="funnel-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className={`funnel-chart ${className}`}>
      <div className="funnel-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{formatCurrency(totalValue)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Stages</span>
          <span className="stat-value">{data.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Conversion Rate</span>
          <span className="stat-value">
            {data.length > 1 && data[data.length - 1] && data[0]
              ? ((data[data.length - 1][dataKey] || 0) / (data[0][dataKey] || 1) * 100).toFixed(1) + '%'
              : '—'}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <RechartsFunnelChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const item = payload[0]?.payload;
              if (!item) return null;

              return (
                <div className="funnel-tooltip">
                  <div className="tooltip-name">{item[nameKey]}</div>
                  <div className="tooltip-value">
                    {typeof item[dataKey] === 'number' && item[dataKey] > 1000
                      ? formatCurrency(item[dataKey])
                      : item[dataKey]}
                  </div>
                  <div className="tooltip-percentage">
                    {item.percentage?.toFixed(1)}% of total
                  </div>
                </div>
              );
            }}
          />
          <Funnel
            dataKey={dataKey}
            data={chartData}
            nameKey={nameKey}
            isAnimationActive
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="rgba(10, 10, 10, 0.2)"
                strokeWidth={2}
              />
            ))}
            {showLabels && (
              <LabelList
                position="right"
                content={renderLabel}
              />
            )}
          </Funnel>
        </RechartsFunnelChart>
      </ResponsiveContainer>

      <style jsx>{`
        .funnel-chart {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          width: 100%;
        }

        .funnel-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Loading */
        .funnel-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: ${height}px;
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
        .funnel-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${height}px;
          color: rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          font-style: italic;
        }

        /* Tooltip */
        .funnel-tooltip {
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          min-width: 120px;
        }

        .tooltip-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .tooltip-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f4c542;
        }

        .tooltip-percentage {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .funnel-chart {
            padding: 0.75rem;
          }

          .funnel-stats {
            gap: 1rem;
          }

          .stat-value {
            font-size: 0.8rem;
          }

          :global(.recharts-label) {
            font-size: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .funnel-chart {
            padding: 0.5rem;
          }

          .funnel-stats {
            gap: 0.5rem;
          }

          .stat-value {
            font-size: 0.7rem;
          }

          .stat-label {
            font-size: 0.5rem;
          }

          :global(.recharts-label) {
            font-size: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}