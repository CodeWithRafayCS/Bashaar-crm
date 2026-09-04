"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "./calendar";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  size?: "sm" | "md" | "lg";
  format?: string;
  clearable?: boolean;
  error?: string;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date...",
      className = "",
      disabled = false,
      minDate,
      maxDate,
      disabledDates = [],
      highlightedDates = [],
      size = "md",
      format = "MMM d, yyyy",
      clearable = true,
      error,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setSelectedDate(value);
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      onChange?.(date);
      setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedDate(undefined);
      onChange?.(undefined);
    };

    const formatDate = (date: Date): string => {
      if (!date) return "";
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    const sizeClasses = {
      sm: {
        wrapper: "h-8",
        input: "text-xs pl-7 pr-7",
        icon: "w-3.5 h-3.5 left-2.5",
        clear: "w-3.5 h-3.5 right-2.5",
      },
      md: {
        wrapper: "h-10",
        input: "text-sm pl-9 pr-9",
        icon: "w-4 h-4 left-3",
        clear: "w-4 h-4 right-3",
      },
      lg: {
        wrapper: "h-12",
        input: "text-base pl-10 pr-10",
        icon: "w-5 h-5 left-3.5",
        clear: "w-5 h-5 right-3.5",
      },
    };

    const sizes = sizeClasses[size];

    const displayValue = selectedDate ? formatDate(selectedDate) : "";

    return (
      <div
        ref={wrapperRef}
        className={`date-picker-wrapper ${className}`}
        style={{ position: "relative" }}
      >
        {/* Input */}
        <div
          ref={ref}
          className={`date-picker-input ${sizes.wrapper} ${isOpen ? "focused" : ""} ${error ? "error" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : 1,
          }}
        >
          <CalendarIcon className={`date-picker-icon ${sizes.icon}`} />
          <span className={`date-picker-value ${!displayValue ? "placeholder" : ""}`}>
            {displayValue || placeholder}
          </span>
          {clearable && selectedDate && (
            <button
              type="button"
              className="date-picker-clear"
              onClick={handleClear}
              aria-label="Clear date"
            >
              <X className={sizes.clear} />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <span className="date-picker-error">{error}</span>
        )}

        {/* Calendar Dropdown */}
        {isOpen && !disabled && (
          <div className="date-picker-dropdown">
            <Calendar
              value={selectedDate}
              onChange={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
              disabledDates={disabledDates}
              highlightedDates={highlightedDates}
              size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
            />
          </div>
        )}

        <style jsx>{`
          .date-picker-wrapper {
            width: 100%;
            position: relative;
          }

          .date-picker-input {
            display: flex;
            align-items: center;
            width: 100%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 8px;
            padding: 0 0.5rem;
            transition: all 0.3s;
            position: relative;
          }

          .date-picker-input:hover:not(.error) {
            border-color: rgba(255, 255, 255, 0.08);
          }

          .date-picker-input.focused {
            border-color: #f4c542;
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
            background: rgba(255, 255, 255, 0.06);
          }

          .date-picker-input.error {
            border-color: #ff4444;
          }

          .date-picker-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.15);
            pointer-events: none;
          }

          .date-picker-value {
            flex: 1;
            padding-left: 0.5rem;
            color: rgba(255, 255, 255, 0.7);
            font-size: inherit;
            font-family: inherit;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .date-picker-value.placeholder {
            color: rgba(255, 255, 255, 0.15);
          }

          .date-picker-clear {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: color 0.3s;
            padding: 0.2rem;
            flex-shrink: 0;
          }

          .date-picker-clear:hover {
            color: rgba(255, 255, 255, 0.4);
          }

          .date-picker-error {
            display: block;
            font-size: 0.75rem;
            color: #ff4444;
            margin-top: 0.15rem;
          }

          .date-picker-dropdown {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            z-index: 100;
            animation: dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Responsive */
          @media (max-width: 480px) {
            .date-picker-input {
              padding: 0 0.3rem;
              font-size: 0.85rem;
            }

            .date-picker-dropdown {
              left: -0.5rem;
              right: -0.5rem;
            }

            .date-picker-value {
              font-size: 0.85rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;