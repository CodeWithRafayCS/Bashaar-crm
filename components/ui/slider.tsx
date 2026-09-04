"use client";

import { forwardRef, useState, useEffect, useRef } from "react";

export interface SliderProps {
  value?: number | number[];
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number | number[]) => void;
  onChangeEnd?: (value: number | number[]) => void;
  className?: string;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "success" | "warning" | "error";
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  disabled?: boolean;
  marks?: { value: number; label: string }[];
  range?: boolean;
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      onChangeEnd,
      className = "",
      label,
      description,
      size = "md",
      variant = "default",
      showValue = false,
      valueFormatter = (v) => v.toString(),
      disabled = false,
      marks = [],
      range = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<number | number[]>(
      defaultValue
    );
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const isArray = Array.isArray(value);
    const currentValue = isArray ? value[0] || 0 : value;

    useEffect(() => {
      if (controlledValue !== undefined) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue]);

    const handleThumbMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleThumbTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !trackRef.current || disabled) return;

        const rect = trackRef.current.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const clampedPercentage = Math.max(0, Math.min(1, percentage));
        const rawValue = min + clampedPercentage * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        const finalValue = Math.max(min, Math.min(max, steppedValue));

        if (range && Array.isArray(value)) {
          const newValue = [finalValue, value[1] || max];
          const sorted = newValue.sort((a, b) => a - b);
          setInternalValue(sorted);
          onChange?.(sorted);
        } else {
          setInternalValue(finalValue);
          onChange?.(finalValue);
        }
      };

      const handleMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          onChangeEnd?.(value);
        }
      };

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleMouseMove);
        document.addEventListener("touchend", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleMouseMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }, [isDragging, min, max, step, disabled, value, range]);

    const getPercentage = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    const getValue = (): number => {
      if (range && Array.isArray(value)) {
        return value[0] || 0;
      }
      return value as number;
    };

    const currentPercentage = getPercentage(getValue());

    const sizeClasses = {
      sm: {
        track: "h-1",
        thumb: "w-4 h-4",
        thumbInner: "w-2 h-2",
        label: "text-xs",
        value: "text-xs",
      },
      md: {
        track: "h-1.5",
        thumb: "w-5 h-5",
        thumbInner: "w-2.5 h-2.5",
        label: "text-sm",
        value: "text-sm",
      },
      lg: {
        track: "h-2",
        thumb: "w-6 h-6",
        thumbInner: "w-3 h-3",
        label: "text-base",
        value: "text-base",
      },
    };

    const variantColors = {
      default: "#f4c542",
      gold: "#f4c542",
      success: "#00c853",
      warning: "#ffc107",
      error: "#ff4444",
    };

    const sizes = sizeClasses[size];
    const color = variantColors[variant];

    return (
      <div
        ref={ref}
        className={`slider-wrapper ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {(label || showValue) && (
          <div className="slider-header">
            {label && <span className={`slider-label ${sizes.label}`}>{label}</span>}
            {showValue && (
              <span className={`slider-value ${sizes.value}`}>
                {valueFormatter(getValue())}
              </span>
            )}
          </div>
        )}

        <div
          className={`slider-track ${sizes.track} ${disabled ? "disabled" : ""}`}
          style={{
            background: disabled ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.04)",
          }}
          ref={trackRef}
        >
          <div
            className="slider-fill"
            style={{
              width: `${currentPercentage}%`,
              background: disabled ? "rgba(255, 255, 255, 0.1)" : color,
              boxShadow: isHovered || isDragging ? `0 0 20px ${color}30` : "none",
            }}
          />

          {/* Marks */}
          {marks.map((mark) => (
            <div
              key={mark.value}
              className="slider-mark"
              style={{
                left: `${getPercentage(mark.value)}%`,
                background: getValue() >= mark.value ? color : "rgba(255, 255, 255, 0.1)",
              }}
            >
              <span className="slider-mark-label">{mark.label}</span>
            </div>
          ))}

          <div
            ref={thumbRef}
            className={`slider-thumb ${sizes.thumb} ${isDragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
            style={{
              left: `${currentPercentage}%`,
              borderColor: disabled ? "rgba(255, 255, 255, 0.1)" : color,
              background: disabled ? "rgba(255, 255, 255, 0.1)" : "#0a0a0a",
              cursor: disabled ? "not-allowed" : "pointer",
              boxShadow: isDragging ? `0 0 30px ${color}40` : "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onMouseDown={handleThumbMouseDown}
            onTouchStart={handleThumbTouchStart}
          >
            <div
              className={`slider-thumb-inner ${sizes.thumbInner}`}
              style={{
                background: disabled ? "rgba(255, 255, 255, 0.1)" : color,
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

        {description && (
          <span className={`slider-description ${sizes.label}`}>
            {description}
          </span>
        )}

        <style jsx>{`
          .slider-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
            width: 100%;
          }

          .slider-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .slider-label {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.3);
          }

          .slider-value {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.5);
          }

          .slider-track {
            position: relative;
            border-radius: 9999px;
            cursor: pointer;
            touch-action: none;
            user-select: none;
            transition: background 0.3s;
          }

          .slider-track.disabled {
            cursor: not-allowed;
          }

          .slider-fill {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-radius: 9999px;
            transition: width 0.2s ease, box-shadow 0.3s ease;
          }

          .slider-thumb {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            border: 2px solid;
            border-radius: 50%;
            transition: transform 0.2s ease, box-shadow 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .slider-thumb:not(.disabled):hover {
            transform: translate(-50%, -50%) scale(1.1);
          }

          .slider-thumb.dragging {
            transform: translate(-50%, -50%) scale(1.15);
          }

          .slider-thumb.disabled {
            opacity: 0.3;
          }

          .slider-thumb-inner {
            border-radius: 50%;
            transition: all 0.3s;
          }

          .slider-mark {
            position: absolute;
            top: 100%;
            transform: translateX(-50%);
            width: 1px;
            height: 6px;
            border-radius: 1px;
            transition: background 0.3s;
            margin-top: 0.3rem;
          }

          .slider-mark-label {
            position: absolute;
            top: calc(100% + 4px);
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.6rem;
            color: rgba(255, 255, 255, 0.1);
            white-space: nowrap;
          }

          .slider-description {
            color: rgba(255, 255, 255, 0.1);
            margin-top: 0.1rem;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .slider-thumb {
              width: 1.25rem;
              height: 1.25rem;
            }

            .slider-thumb-inner {
              width: 0.5rem;
              height: 0.5rem;
            }

            .slider-label,
            .slider-value {
              font-size: 0.8rem;
            }

            .slider-mark-label {
              font-size: 0.5rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;