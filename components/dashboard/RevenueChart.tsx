"use client";

import { useMemo, useState } from "react";
import type { RevenuePoint } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

interface RevenueChartProps {
  data: RevenuePoint[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  compact?: boolean;
  color?: string;
  gradient?: boolean;
}

export function RevenueChart({
  data,
  height = 200,
  showLegend = true,
  showTooltip = true,
  compact = false,
  color = "#f4c542",
  gradient = true,
}: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { maxValue, minValue, points, total, average, percentageChange } = useMemo(() => {
    if (data.length === 0) {
      return {
        maxValue: 100,
        minValue: 0,
        points: [],
        total: 0,
        average: 0,
        percentageChange: 0,
      };
    }

    const values = data.map((d) => d.value);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    const totalVal = values.reduce((sum, v) => sum + v, 0);
    const avgVal = totalVal / data.length;

    // Calculate percentage change from first to last
    const firstVal = values[0] || 0;
    const lastVal = values[values.length - 1] || 0;
    const change = firstVal !== 0 ? ((lastVal - firstVal) / Math.abs(firstVal)) * 100 : 0;

    return {
      maxValue: maxVal,
      minValue: minVal,
      points: data.map((d, i) => ({
        ...d,
        x: (i / (data.length - 1)) * 100,
        y: ((d.value - minVal) / range) * 80 + 10, // 10% to 90% of chart height
      })),
      total: totalVal,
      average: avgVal,
      percentageChange: change,
    };
  }, [data]);

  const getPath = () => {
    if (points.length === 0) return "";
    const path = points.map((p, i) => {
      const x = p.x;
      const y = 100 - p.y;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    return path;
  };

  const getAreaPath = () => {
    if (points.length === 0) return "";
    const linePath = getPath();
    const lastX = points[points.length - 1]?.x || 0;
    return `${linePath} L ${lastX} 100 L 0 100 Z`;
  };

  const getGradientId = () => `revenue-gradient-${color.replace('#', '')}`;

  if (data.length === 0) {
    return (
      <div className="revenue-chart-empty">
        <div className="empty-icon">📊</div>
        <p>No revenue data available</p>

        <style jsx>{`
          .revenue-chart-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: ${height}px;
            color: rgba(255, 255, 255, 0.1);
          }

          .empty-icon {
            font-size: 2rem;
            opacity: 0.2;
            margin-bottom: 0.3rem;
          }

          .revenue-chart-empty p {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.15);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  const currentValue = data[data.length - 1]?.value || 0;
  const isPositive = percentageChange >= 0;

  return (
    <div className={`revenue-chart ${compact ? "compact" : ""}`}>
      {/* Stats */}
      {showLegend && (
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(total)}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-label">Average</span>
            <span className="stat-value">{formatCurrency(average)}</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-label">Current</span>
            <span className="stat-value">{formatCurrency(currentValue)}</span>
          </div>
          <div className="stat-divider" />
          <div className={`stat-item trend ${isPositive ? "positive" : "negative"}`}>
            <span className="stat-label">Change</span>
            <span className="stat-value">
              {isPositive ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div 
        className="chart-container"
        style={{ height: `${height}px` }}
      >
        <svg
          className="chart-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Gradient */}
          {gradient && (
            <defs>
              <linearGradient
                id={getGradientId()}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          )}

          {/* Area */}
          {gradient && (
            <path
              d={getAreaPath()}
              fill={`url(#${getGradientId()})`}
              opacity="0.6"
            />
          )}

          {/* Line */}
          <path
            d={getPath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {showTooltip && points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={100 - p.y}
              r={hoveredIndex === i ? "3" : "1.5"}
              fill={hoveredIndex === i ? color : color}
              opacity={hoveredIndex === i ? 1 : 0.3}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="chart-point"
            />
          ))}
        </svg>

        {/* Tooltip */}
        {showTooltip && hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="chart-tooltip"
            style={{
              left: `${points[hoveredIndex].x}%`,
              bottom: `${points[hoveredIndex].y}%`,
              transform: `translate(-50%, -100%)`,
            }}
          >
            <span className="tooltip-value">
              {formatCurrency(points[hoveredIndex].value)}
            </span>
            <span className="tooltip-label">
              {points[hoveredIndex].label}
            </span>
          </div>
        )}
      </div>

      {/* X-Axis Labels */}
      {data.length > 1 && (
        <div className="x-axis">
          <span className="axis-label">{data[0]?.label || ""}</span>
          <span className="axis-label">{data[Math.floor(data.length / 2)]?.label || ""}</span>
          <span className="axis-label">{data[data.length - 1]?.label || ""}</span>
        </div>
      )}

      <style jsx>{`
        .revenue-chart {
          width: 100%;
        }

        .revenue-chart.compact .chart-stats {
          margin-bottom: 0.5rem;
        }

        .revenue-chart.compact .stat-value {
          font-size: 0.85rem;
        }

        .revenue-chart.compact .stat-label {
          font-size: 0.6rem;
        }

        .revenue-chart.compact .axis-label {
          font-size: 0.6rem;
        }

        /* Stats */
        .chart-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-item.trend {
          flex-direction: row;
          align-items: center;
          gap: 0.3rem;
        }

        .stat-item.trend.positive {
          color: #00c853;
        }

        .stat-item.trend.negative {
          color: #ff4444;
        }

        .stat-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .trend-icon {
          width: 14px;
          height: 14px;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Chart Container */
        .chart-container {
          position: relative;
          width: 100%;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .chart-point {
          cursor: pointer;
          transition: all 0.3s;
        }

        .chart-point:hover {
          r: 4;
          opacity: 1;
        }

        /* Tooltip */
        .chart-tooltip {
          position: absolute;
          pointer-events: none;
          background: rgba(20, 20, 20, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.3rem 0.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          opacity: 0;
          animation: tooltipFade 0.3s ease forwards;
        }

        @keyframes tooltipFade {
          from {
            opacity: 0;
            transform: translate(-50%, -100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -100%) scale(1);
          }
        }

        .tooltip-value {
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
        }

        .tooltip-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* X-Axis */
        .x-axis {
          display: flex;
          justify-content: space-between;
          margin-top: 0.3rem;
          padding: 0 0.2rem;
        }

        .axis-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .chart-stats {
            gap: 0.5rem;
            padding: 0.4rem 0.6rem;
          }

          .stat-value {
            font-size: 0.85rem;
          }

          .stat-divider {
            height: 20px;
          }
        }

        @media (max-width: 480px) {
          .chart-stats {
            flex-wrap: wrap;
            justify-content: center;
          }

          .stat-item {
            flex: 1;
            min-width: 60px;
            align-items: center;
          }

          .stat-divider {
            display: none;
          }

          .stat-value {
            font-size: 0.75rem;
          }

          .stat-label {
            font-size: 0.55rem;
          }

          .axis-label {
            font-size: 0.55rem;
          }

          .tooltip-value {
            font-size: 0.7rem;
          }

          .tooltip-label {
            font-size: 0.55rem;
          }
        }
      `}</style>
    </div>
  );
}