"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "success" | "danger";
  indeterminate?: boolean;
  className?: string;
}

const SIZES = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const LABEL_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const VARIANT_COLORS = {
  default: "#f4c542",
  gold: "#f4c542",
  success: "#00c853",
  danger: "#ff4444",
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      variant = "default",
      indeterminate = false,
      className = "",
      checked,
      defaultChecked,
      onChange,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const sizeClass = SIZES[size];
    const labelSize = LABEL_SIZES[size];
    const color = VARIANT_COLORS[variant];

    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 11)}`;

    return (
      <div className={`checkbox-wrapper ${className}`}>
        <label className="checkbox-label" htmlFor={checkboxId}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className={`checkbox-input ${sizeClass}`}
            style={{
              accentColor: color,
            }}
            {...props}
          />
          <span className={`checkbox-custom ${sizeClass}`} />
          {label && (
            <span className={`checkbox-label-text ${labelSize}`}>
              {label}
              {description && (
                <span className="checkbox-description">{description}</span>
              )}
            </span>
          )}
        </label>
        {error && (
          <span className="checkbox-error">{error}</span>
        )}

        <style jsx>{`
          .checkbox-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }

          .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            opacity: ${disabled ? 0.4 : 1};
          }

          .checkbox-input {
            display: none;
          }

          .checkbox-custom {
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.15);
            border-radius: 4px;
            flex-shrink: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            background: rgba(255, 255, 255, 0.02);
            position: relative;
            margin-top: 0.1rem;
          }

          .checkbox-input:checked + .checkbox-custom {
            background: ${color};
            border-color: ${color};
          }

          .checkbox-input:checked + .checkbox-custom::after {
            content: "✓";
            color: #0a0a0a;
            font-size: ${size === "sm" ? "10px" : size === "lg" ? "16px" : "12px"};
            font-weight: 700;
          }

          .checkbox-input:indeterminate + .checkbox-custom {
            background: ${color};
            border-color: ${color};
          }

          .checkbox-input:indeterminate + .checkbox-custom::after {
            content: "—";
            color: #0a0a0a;
            font-size: ${size === "sm" ? "12px" : size === "lg" ? "18px" : "14px"};
            font-weight: 700;
          }

          .checkbox-input:focus + .checkbox-custom {
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
            border-color: ${color};
          }

          .checkbox-input:disabled + .checkbox-custom {
            opacity: 0.3;
          }

          .checkbox-label-text {
            display: flex;
            flex-direction: column;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.4;
          }

          .checkbox-description {
            font-size: 0.75rem;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.2);
          }

          .checkbox-error {
            font-size: 0.75rem;
            color: #ff4444;
            margin-left: 0.15rem;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .checkbox-label-text {
              font-size: 0.85rem;
            }

            .checkbox-description {
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;