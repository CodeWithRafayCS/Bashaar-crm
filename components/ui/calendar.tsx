"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  className?: string;
  showWeekNumbers?: boolean;
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  size?: "sm" | "md" | "lg";
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function Calendar({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  className = "",
  showWeekNumbers = false,
  firstDayOfWeek = 0,
  locale = "en-US",
  size = "md",
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setCurrentDate(value);
    }
  }, [value]);

  const { daysInMonth, firstDayOfMonth, weeks, monthName, year } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfMonth = firstDay.getDay();

    // Get days from previous month to fill first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startOffset = (firstDayOfMonth - firstDayOfWeek + 7) % 7;

    const days: Date[] = [];
    const totalDays = startOffset + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 7; col++) {
        const dayIndex = row * 7 + col;
        if (dayIndex < startOffset) {
          const day = prevMonthLastDay - startOffset + dayIndex + 1;
          days.push(new Date(year, month - 1, day));
        } else if (dayIndex >= startOffset + daysInMonth) {
          const day = dayIndex - startOffset - daysInMonth + 1;
          days.push(new Date(year, month + 1, day));
        } else {
          const day = dayIndex - startOffset + 1;
          days.push(new Date(year, month, day));
        }
      }
    }

    return {
      daysInMonth,
      firstDayOfMonth,
      weeks: rows,
      monthName: MONTHS[month],
      year,
    };
  }, [currentDate, firstDayOfWeek]);

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some((d) => d.toDateString() === date.toDateString());
  };

  const isDateHighlighted = (date: Date): boolean => {
    return highlightedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
    setCurrentDate(date);
    onChange?.(date);
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const sizeClasses = {
    sm: {
      cell: "w-8 h-8 text-xs",
      header: "text-xs",
      nav: "w-6 h-6",
    },
    md: {
      cell: "w-10 h-10 text-sm",
      header: "text-sm",
      nav: "w-8 h-8",
    },
    lg: {
      cell: "w-12 h-12 text-base",
      header: "text-base",
      nav: "w-10 h-10",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`calendar ${className}`}>
      {/* Header */}
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="nav-icon" />
        </button>
        <span className="calendar-title">
          {monthName} {year}
        </span>
        <button
          type="button"
          className="calendar-nav"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight className="nav-icon" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="calendar-weekdays">
        {DAYS_SHORT.map((day, index) => {
          const dayIndex = (index + firstDayOfWeek) % 7;
          return (
            <div key={dayIndex} className="calendar-weekday">
              {day}
            </div>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="calendar-grid">
        {weeks.map((row, rowIndex) => (
          <div key={rowIndex} className="calendar-row">
            {showWeekNumbers && (
              <div className="calendar-week-number">
                {rowIndex + 1}
              </div>
            )}
            {Array.from({ length: 7 }).map((_, colIndex) => {
              const dateIndex = rowIndex * 7 + colIndex;
              const date = daysInMonth[dateIndex];
              if (!date) return <div key={colIndex} className="calendar-cell-empty" />;

              const disabled = isDateDisabled(date);
              const selected = isSelected(date);
              const today = isToday(date);
              const sameMonth = isSameMonth(date);
              const highlighted = isDateHighlighted(date);

              return (
                <button
                  key={colIndex}
                  type="button"
                  className={`calendar-cell ${sizes.cell} ${!sameMonth ? "other-month" : ""} ${selected ? "selected" : ""} ${today ? "today" : ""} ${disabled ? "disabled" : ""} ${highlighted ? "highlighted" : ""}`}
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  aria-label={`${date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' })}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .calendar {
          display: inline-flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 0.75rem;
          width: 100%;
          max-width: ${size === "sm" ? "280px" : size === "lg" ? "400px" : "340px"};
          user-select: none;
        }

        /* Header */
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .calendar-title {
          font-size: ${sizes.header};
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${sizes.nav};
          height: ${sizes.nav};
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .calendar-nav:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .nav-icon {
          width: ${size === "sm" ? "14px" : size === "lg" ? "20px" : "16px"};
          height: ${size === "sm" ? "14px" : size === "lg" ? "20px" : "16px"};
        }

        /* Weekdays */
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.15rem;
          margin-bottom: 0.3rem;
        }

        .calendar-weekday {
          text-align: center;
          font-size: ${size === "sm" ? "0.6rem" : size === "lg" ? "0.8rem" : "0.7rem"};
          font-weight: 600;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Grid */
        .calendar-grid {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .calendar-row {
          display: grid;
          grid-template-columns: ${showWeekNumbers ? "24px repeat(7, 1fr)" : "repeat(7, 1fr)"};
          gap: 0.15rem;
        }

        .calendar-week-number {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.05);
        }

        /* Cells */
        .calendar-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid transparent;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
          cursor: pointer;
        }

        .calendar-cell:hover:not(.disabled):not(.selected) {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .calendar-cell.other-month {
          color: rgba(255, 255, 255, 0.08);
        }

        .calendar-cell.today {
          border-color: rgba(244, 197, 66, 0.15);
          color: rgba(255, 255, 255, 0.6);
        }

        .calendar-cell.today:not(.selected) {
          background: rgba(244, 197, 66, 0.03);
        }

        .calendar-cell.selected {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-color: #f4c542;
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        .calendar-cell.disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .calendar-cell.highlighted {
          background: rgba(244, 197, 66, 0.03);
          border-color: rgba(244, 197, 66, 0.06);
        }

        .calendar-cell-empty {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .calendar {
            padding: 0.5rem;
            max-width: 100%;
          }

          .calendar-cell {
            font-size: 0.7rem;
            width: 32px;
            height: 32px;
          }

          .calendar-nav {
            width: 28px;
            height: 28px;
          }

          .calendar-title {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}