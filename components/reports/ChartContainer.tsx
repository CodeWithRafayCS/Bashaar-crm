"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

interface ChartContainerProps {
  kind?: "bar" | "line" | "pie" | "area" | "funnel" | "composed";
  data: any[];
  xKey?: string;
  yKey?: string;
  height?: number;
  loading?: boolean;
  colors?: string[];
  title?: string;
  className?: string;
}

const DEFAULT_COLORS = ["#f4c542", "#d4a030", "#4285f4", "#00c853", "#ff4444", "#9c27b0", "#ff6f00", "#ffc107"];

export function ChartContainer({
  kind = "bar",
  data,
  xKey = "name",
  yKey = "value",
  height = 300,
  loading = false,
  colors = DEFAULT_COLORS,
  title,
  className = "",
}: ChartContainerProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data;
  }, [data]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="chart-loading">
          <div className="spinner" />
          <span>Loading chart...</span>
        </div>
      );
    }

    if (!chartData || chartData.length === 0) {
      return (
        <div className="chart-empty">
          <p>No data available</p>
        </div>
      );
    }

    const chartColors = colors.slice(0, chartData.length);

    switch (kind) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey={xKey} 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [formatCurrency(value), ""]}
              />
              <Bar 
                dataKey={yKey} 
                fill="#f4c542" 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey={xKey} 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [formatCurrency(value), ""]}
              />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke="#f4c542" 
                strokeWidth={2}
                dot={{ fill: "#f4c542", stroke: "#f4c542", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f4c542" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f4c542" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey={xKey} 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [formatCurrency(value), ""]}
              />
              <Area 
                type="monotone" 
                dataKey={yKey} 
                stroke="#f4c542" 
                strokeWidth={2}
                fill="url(#areaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={(entry) => `${entry[xKey]}: ${entry[yKey]}`}
                dataKey={yKey}
                nameKey={xKey}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]} 
                    stroke="rgba(10,10,10,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [formatCurrency(value), ""]}
              />
              <Legend 
                wrapperStyle={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "funnel":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [value, ""]}
              />
              <Funnel
                dataKey={yKey}
                data={chartData}
                nameKey={xKey}
                isAnimationActive
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]} 
                    stroke="rgba(10,10,10,0.2)"
                    strokeWidth={2}
                  />
                ))}
                <LabelList
                  position="right"
                  fill="rgba(255,255,255,0.3)"
                  stroke="none"
                  fontSize={12}
                  fontWeight={500}
                  formatter={(value: any) => value}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis 
                dataKey={xKey} 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.1)" 
                tick={{ fill: "rgba(255,255,255,0.1)", fontSize: 11 }}
                tickLine={{ stroke: "rgba(255,255,255,0.04)" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,20,20,0.9)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  borderRadius: "8px",
                  backdropFilter: "blur(20px)",
                  color: "rgba(255,255,255,0.8)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value: any) => [formatCurrency(value), ""]}
              />
              <Bar 
                dataKey={yKey} 
                fill="#f4c542" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                barGap={2}
              />
              <Line 
                type="monotone" 
                dataKey={yKey} 
                stroke="#d4a030" 
                strokeWidth={2}
                dot={{ fill: "#d4a030", stroke: "#d4a030", strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="chart-empty">
            <p>Chart type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && (
        <div className="chart-header">
          <h3 className="chart-title">{title}</h3>
        </div>
      )}
      <div className="chart-wrapper">
        {renderChart()}
      </div>

      <style jsx>{`
        .chart-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          width: 100%;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .chart-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .chart-wrapper {
          width: 100%;
          min-height: ${height}px;
        }

        /* Loading */
        .chart-loading {
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
        .chart-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${height}px;
          color: rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          font-style: italic;
        }

        /* Recharts Overrides */
        :global(.recharts-text) {
          fill: rgba(255, 255, 255, 0.3) !important;
          font-family: "Inter", sans-serif !important;
        }

        :global(.recharts-tooltip-item) {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        :global(.recharts-legend-item-text) {
          color: rgba(255, 255, 255, 0.2) !important;
        }

        :global(.recharts-surface) {
          overflow: visible;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .chart-container {
            padding: 0.75rem;
          }

          .chart-wrapper {
            min-height: 200px;
          }

          .chart-title {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .chart-container {
            padding: 0.5rem;
          }

          .chart-wrapper {
            min-height: 180px;
          }
        }
      `}</style>
    </div>
  );
}