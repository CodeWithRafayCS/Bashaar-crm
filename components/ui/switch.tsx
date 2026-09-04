"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "success" | "danger";
  className?: string;
}

const SIZES = {
  sm: {
    switch: "w-8 h-4",
    thumb: "w-3 h-3",
    translate: "translate-x-4",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    switch: "w-10 h-5",
    thumb: "w-4 h-4",
    translate: "translate-x-5",
    label: "text-base",
    description: "text-sm",
  },
  lg: {
    switch: "w-12 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-6",
    label: "text-lg",
    description: "text-base",
  },
};

const VARIANT_COLORS = {
  default: "#f4c542",
  gold: "#f4c542",
  success: "#00c853",
  danger: "#ff4444",
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      variant = "default",
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
    const switchId = id || `switch-${Math.random().toString(36).slice(2, 11)}`;
    const color = VARIANT_COLORS[variant];
    const sizes = SIZES[size];

    return (
      <div className={`switch-wrapper ${className}`}>
        <label className="switch-label" htmlFor={switchId}>
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className="switch-input"
          />
          <div
            className={`switch-track ${sizes.switch}`}
            style={{
              background: checked ? color : "rgba(255, 255, 255, 0.06)",
            }}
          >
            <div
              className={`switch-thumb ${sizes.thumb} ${checked ? sizes.translate : ""}`}
              style={{
                background: checked ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
              }}
            />
          </div>
          <div className="switch-content">
            {label && <span className={`switch-label-text ${sizes.label}`}>{label}</span>}
            {description && (
              <span className={`switch-description ${sizes.description}`}>{description}</span>
            )}
          </div>
        </label>
        {error && <span className="switch-error">{error}</span>}

        <style jsx>{`
          .switch-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
          }

          .switch-label {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: ${disabled ? "not-allowed" : "pointer"};
            opacity: ${disabled ? 0.4 : 1};
          }

          .switch-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
          }

          .switch-track {
            display: flex;
            align-items: center;
            border-radius: 9999px;
            flex-shrink: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            padding: 0.125rem;
          }

          .switch-track:focus-within {
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          }

          .switch-thumb {
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }

          .switch-content {
            display: flex;
            flex-direction: column;
          }

          .switch-label-text {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.6);
          }

          .switch-description {
            color: rgba(255, 255, 255, 0.2);
          }

          .switch-error {
            font-size: 0.75rem;
            color: #ff4444;
          }

          @media (max-width: 480px) {
            .switch-label-text {
              font-size: 0.85rem;
            }
            .switch-description {
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;