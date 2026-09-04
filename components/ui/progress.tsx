"use client";

import { forwardRef, useEffect, useState } from "react";

export interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "success" | "warning" | "error" | "gradient";
  showLabel?: boolean;
  labelPosition?: "inside" | "outside" | "tooltip";
  animated?: boolean;
  className?: string;
  labelFormatter?: (value: number, max: number) => string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = "md",
      variant = "default",
      showLabel = false,
      labelPosition = "outside",
      animated = true,
      className = "",
      labelFormatter = (v, m) => `${Math.round((v / m) * 100)}%`,
    },
    ref
  ) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      if (animated) {
        // Animate to target value
        const duration = 800;
        const startTime = Date.now();
        const startValue = progress;
        const endValue = Math.min(Math.max(value, 0), max);

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = startValue + (endValue - startValue) * eased;

          setProgress(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setProgress(endValue);
          }
        };

        animate();
      } else {
        setProgress(Math.min(Math.max(value, 0), max));
      }
    }, [value, max, animated]);

    const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);
    const clampedValue = Math.min(Math.max(value, 0), max);
    const displayValue = labelFormatter(clampedValue, max);

    const variantStyles = {
      default: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "#f4c542",
        glow: "rgba(244, 197, 66, 0.1)",
      },
      gold: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "#f4c542",
        glow: "rgba(244, 197, 66, 0.15)",
      },
      success: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "#00c853",
        glow: "rgba(0, 200, 83, 0.15)",
      },
      warning: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "#ffc107",
        glow: "rgba(255, 193, 7, 0.15)",
      },
      error: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "#ff4444",
        glow: "rgba(255, 68, 68, 0.15)",
      },
      gradient: {
        bg: "rgba(255, 255, 255, 0.04)",
        fill: "linear-gradient(90deg, #f4c542, #d4a030)",
        glow: "rgba(244, 197, 66, 0.15)",
      },
    };

    const sizeClasses = {
      sm: {
        bar: "h-1.5",
        label: "text-xs",
      },
      md: {
        bar: "h-2.5",
        label: "text-sm",
      },
      lg: {
        bar: "h-4",
        label: "text-base",
      },
    };

    const sizes = sizeClasses[size];
    const style = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={`progress-wrapper ${className}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {showLabel && labelPosition === "outside" && (
          <div className={`progress-label ${sizes.label}`}>
            <span className="progress-label-text">{displayValue}</span>
          </div>
        )}

        <div className={`progress-bar ${sizes.bar}`} style={{ background: style.bg }}>
          <div
            className={`progress-fill ${animated ? "animated" : ""}`}
            style={{
              width: `${percentage}%`,
              background: style.fill,
              boxShadow: `0 0 20px ${style.glow}`,
            }}
          >
            {showLabel && labelPosition === "inside" && (
              <span className={`progress-label-inside ${sizes.label}`}>
                {displayValue}
              </span>
            )}
          </div>
        </div>

        {showLabel && labelPosition === "outside" && (
          <div className={`progress-sub-label ${sizes.label}`}>
            <span className="progress-sub-label-text">{clampedValue} / {max}</span>
          </div>
        )}

        {showLabel && labelPosition === "tooltip" && (
          <div
            className="progress-tooltip"
            style={{ left: `${percentage}%` }}
          >
            <span className={sizes.label}>{displayValue}</span>
          </div>
        )}

        <style jsx>{`
          .progress-wrapper {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            position: relative;
          }

          .progress-label {
            display: flex;
            justify-content: space-between;
            color: rgba(255, 255, 255, 0.2);
          }

          .progress-label-text {
            font-weight: 500;
          }

          .progress-sub-label {
            color: rgba(255, 255, 255, 0.1);
            text-align: right;
          }

          .progress-bar {
            width: 100%;
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
          }

          .progress-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            min-width: ${percentage > 0 ? '4px' : '0'};
          }

          .progress-fill.animated {
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .progress-label-inside {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #0a0a0a;
            font-weight: 600;
            white-space: nowrap;
          }

          .progress-tooltip {
            position: absolute;
            top: calc(100% + 0.5rem);
            transform: translateX(-50%);
            padding: 0.15rem 0.4rem;
            background: rgba(20, 20, 20, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 4px;
            color: rgba(255, 255, 255, 0.4);
            white-space: nowrap;
            pointer-events: none;
            font-weight: 500;
            opacity: 0;
            animation: tooltipFadeIn 0.3s ease forwards;
            min-width: 40px;
            text-align: center;
          }

          @keyframes tooltipFadeIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          /* Size specific */
          .progress-bar.h-4 .progress-label-inside {
            font-size: 0.7rem;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .progress-label {
              font-size: 0.7rem;
            }

            .progress-tooltip {
              font-size: 0.65rem;
              padding: 0.1rem 0.3rem;
            }

            .progress-bar.h-4 {
              height: 3rem;
            }

            .progress-bar.h-4 .progress-label-inside {
              font-size: 0.6rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;