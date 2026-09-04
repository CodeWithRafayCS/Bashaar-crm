"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: number;
  money?: boolean;
  icon?: ReactNode;
  subtext?: string;
  loading?: boolean;
  className?: string;
  color?: "gold" | "green" | "blue" | "red" | "purple" | "default";
}

const COLOR_VARIANTS = {
  gold: {
    border: "rgba(244, 197, 66, 0.12)",
    iconBg: "rgba(244, 197, 66, 0.08)",
    iconColor: "#f4c542",
    glow: "0 4px 20px rgba(244, 197, 66, 0.1)",
  },
  green: {
    border: "rgba(0, 200, 83, 0.12)",
    iconBg: "rgba(0, 200, 83, 0.08)",
    iconColor: "#00c853",
    glow: "0 4px 20px rgba(0, 200, 83, 0.1)",
  },
  blue: {
    border: "rgba(66, 133, 244, 0.12)",
    iconBg: "rgba(66, 133, 244, 0.08)",
    iconColor: "#4285f4",
    glow: "0 4px 20px rgba(66, 133, 244, 0.1)",
  },
  red: {
    border: "rgba(255, 68, 68, 0.12)",
    iconBg: "rgba(255, 68, 68, 0.08)",
    iconColor: "#ff4444",
    glow: "0 4px 20px rgba(255, 68, 68, 0.1)",
  },
  purple: {
    border: "rgba(156, 39, 176, 0.12)",
    iconBg: "rgba(156, 39, 176, 0.08)",
    iconColor: "#9c27b0",
    glow: "0 4px 20px rgba(156, 39, 176, 0.1)",
  },
  default: {
    border: "rgba(255, 255, 255, 0.04)",
    iconBg: "rgba(255, 255, 255, 0.04)",
    iconColor: "rgba(255, 255, 255, 0.3)",
    glow: "none",
  },
};

export function KPICard({
  label,
  value,
  trend,
  money = false,
  icon,
  subtext,
  loading = false,
  className = "",
  color = "default",
}: KPICardProps) {
  const colors = COLOR_VARIANTS[color];

  const formatValue = (val: string | number): string => {
    if (money && typeof val === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!trend || trend === 0) return <Minus className="trend-icon neutral" />;
    if (trend > 0) return <TrendingUp className="trend-icon positive" />;
    return <TrendingDown className="trend-icon negative" />;
  };

  const getTrendColor = () => {
    if (!trend || trend === 0) return "neutral";
    if (trend > 0) return "positive";
    return "negative";
  };

  const getTrendLabel = () => {
    if (!trend) return null;
    if (trend > 0) return `+${trend}%`;
    if (trend < 0) return `${trend}%`;
    return "0%";
  };

  const displayValue = loading ? "—" : formatValue(value);

  return (
    <div
      className={`kpi-card ${className}`}
      style={{
        borderColor: colors.border,
      }}
    >
      <div className="kpi-content">
        {/* Icon */}
        {icon && (
          <div
            className="kpi-icon-wrapper"
            style={{
              background: colors.iconBg,
              color: colors.iconColor,
              boxShadow: colors.glow,
            }}
          >
            {icon}
          </div>
        )}

        {/* Info */}
        <div className="kpi-info">
          <span className="kpi-label">{label}</span>
          <div className="kpi-value-wrapper">
            <span className={`kpi-value ${loading ? "loading" : ""}`}>
              {displayValue}
            </span>
            {trend !== undefined && !loading && (
              <div className={`kpi-trend ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="trend-value">{getTrendLabel()}</span>
              </div>
            )}
          </div>
          {subtext && !loading && (
            <span className="kpi-subtext">{subtext}</span>
          )}
        </div>
      </div>

      {/* Loading Shimmer */}
      {loading && (
        <div className="kpi-shimmer">
          <div className="shimmer-bar" />
          <div className="shimmer-bar short" />
        </div>
      )}

      <style jsx>{`
        .kpi-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .kpi-card:hover {
          transform: translateY(-3px);
          border-color: rgba(244, 197, 66, 0.08);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .kpi-card:hover .kpi-icon-wrapper {
          transform: scale(1.05);
        }

        .kpi-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }

        /* Icon */
        .kpi-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          flex-shrink: 0;
          transition: transform 0.3s;
        }

        .kpi-icon-wrapper :global(svg) {
          width: 20px;
          height: 20px;
        }

        /* Info */
        .kpi-info {
          flex: 1;
          min-width: 0;
        }

        .kpi-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .kpi-value-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .kpi-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.025em;
          transition: opacity 0.3s;
        }

        .kpi-value.loading {
          opacity: 0.2;
        }

        /* Trend */
        .kpi-trend {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .kpi-trend.positive {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .kpi-trend.negative {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .kpi-trend.neutral {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.15);
        }

        .trend-icon {
          width: 14px;
          height: 14px;
        }

        .trend-icon.positive {
          color: #00c853;
        }

        .trend-icon.negative {
          color: #ff4444;
        }

        .trend-icon.neutral {
          color: rgba(255, 255, 255, 0.15);
        }

        .trend-value {
          font-size: 0.7rem;
        }

        /* Subtext */
        .kpi-subtext {
          display: block;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
          margin-top: 0.1rem;
        }

        /* Shimmer */
        .kpi-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          z-index: 0;
        }

        .shimmer-bar {
          height: 12px;
          width: 60%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.02) 0%,
            rgba(255, 255, 255, 0.04) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          border-radius: 4px;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .shimmer-bar.short {
          width: 40%;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Glow effect on hover */
        .kpi-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(244, 197, 66, 0.03) 0%,
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 0;
        }

        .kpi-card:hover::after {
          opacity: 1;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .kpi-card {
            padding: 0.75rem 1rem;
          }

          .kpi-value {
            font-size: 1.2rem;
          }

          .kpi-icon-wrapper {
            width: 36px;
            height: 36px;
          }

          .kpi-icon-wrapper :global(svg) {
            width: 16px;
            height: 16px;
          }

          .kpi-label {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 480px) {
          .kpi-card {
            padding: 0.6rem 0.75rem;
          }

          .kpi-value {
            font-size: 1rem;
          }

          .kpi-icon-wrapper {
            width: 32px;
            height: 32px;
          }

          .kpi-icon-wrapper :global(svg) {
            width: 14px;
            height: 14px;
          }

          .kpi-trend {
            font-size: 0.6rem;
            padding: 0.05rem 0.3rem;
          }

          .trend-icon {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
}