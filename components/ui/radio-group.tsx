"use client";

import { forwardRef, ReactNode, useState } from "react";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "card" | "button";
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      value: controlledValue,
      onChange,
      defaultValue,
      className = "",
      name,
      size = "md",
      variant = "default",
      orientation = "vertical",
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");

    const selectedValue = controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = (val: string) => {
      if (disabled) return;
      if (controlledValue === undefined) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const sizeClasses = {
      sm: {
        radio: "w-3.5 h-3.5",
        label: "text-sm",
        description: "text-xs",
        dot: "w-1.5 h-1.5",
        padding: "px-2 py-1.5",
        gap: "gap-1.5",
      },
      md: {
        radio: "w-4 h-4",
        label: "text-base",
        description: "text-sm",
        dot: "w-2 h-2",
        padding: "px-3 py-2",
        gap: "gap-2",
      },
      lg: {
        radio: "w-5 h-5",
        label: "text-lg",
        description: "text-base",
        dot: "w-2.5 h-2.5",
        padding: "px-4 py-2.5",
        gap: "gap-2.5",
      },
    };

    const sizes = sizeClasses[size];

    const orientationClasses = {
      horizontal: "flex-row flex-wrap",
      vertical: "flex-col",
    };

    const variantClasses = {
      default: "",
      card: "border border-white/5 rounded-lg hover:border-white/10",
      button: "border border-white/5 rounded-lg hover:border-white/10",
    };

    return (
      <div
        ref={ref}
        className={`radio-group ${orientationClasses[orientation]} ${className}`}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={`radio-option ${variantClasses[variant]} ${sizes.padding} ${sizes.gap} ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.4 : 1,
              }}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleChange(option.value)}
                disabled={isDisabled}
                className="radio-input"
              />
              <div className={`radio-custom ${sizes.radio}`}>
                {isSelected && <div className={`radio-dot ${sizes.dot}`} />}
              </div>
              <div className="radio-content">
                <span className={`radio-label ${sizes.label}`}>{option.label}</span>
                {option.description && (
                  <span className={`radio-description ${sizes.description}`}>
                    {option.description}
                  </span>
                )}
              </div>

              <style jsx>{`
                .radio-group {
                  display: flex;
                  gap: 0.25rem;
                }

                .radio-option {
                  display: flex;
                  align-items: flex-start;
                  gap: 0.5rem;
                  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                  border-radius: 8px;
                  position: relative;
                }

                .radio-option.default {
                  background: transparent;
                  padding: 0.2rem 0;
                }

                .radio-option.card {
                  background: rgba(255, 255, 255, 0.02);
                  border-color: rgba(255, 255, 255, 0.03);
                  flex: 1;
                }

                .radio-option.card.selected {
                  background: rgba(244, 197, 66, 0.04);
                  border-color: rgba(244, 197, 66, 0.08);
                  box-shadow: 0 0 0 1px rgba(244, 197, 66, 0.05);
                }

                .radio-option.button {
                  background: rgba(255, 255, 255, 0.02);
                  border-color: rgba(255, 255, 255, 0.03);
                  justify-content: center;
                  flex: 1;
                }

                .radio-option.button.selected {
                  background: linear-gradient(135deg, #f4c542, #d4a030);
                  border-color: #f4c542;
                  color: #0a0a0a;
                }

                .radio-option.button.selected .radio-label {
                  color: #0a0a0a;
                }

                .radio-option.button.selected .radio-description {
                  color: rgba(10, 10, 10, 0.5);
                }

                .radio-option.button.selected .radio-custom {
                  display: none;
                }

                .radio-option:not(.disabled):not(.button):hover {
                  background: rgba(255, 255, 255, 0.02);
                }

                .radio-option:not(.disabled):not(.button).card:hover {
                  border-color: rgba(255, 255, 255, 0.08);
                }

                /* Hidden input */
                .radio-input {
                  position: absolute;
                  opacity: 0;
                  width: 0;
                  height: 0;
                  pointer-events: none;
                }

                /* Custom radio */
                .radio-custom {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 2px solid rgba(255, 255, 255, 0.15);
                  border-radius: 50%;
                  flex-shrink: 0;
                  margin-top: 0.1rem;
                  transition: all 0.3s;
                }

                .radio-option.selected .radio-custom {
                  border-color: #f4c542;
                }

                .radio-option.button.selected .radio-custom {
                  display: none;
                }

                .radio-option:not(.disabled):not(.button):hover .radio-custom {
                  border-color: rgba(255, 255, 255, 0.3);
                }

                .radio-dot {
                  border-radius: 50%;
                  background: #f4c542;
                  animation: radioDotIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes radioDotIn {
                  from {
                    transform: scale(0);
                  }
                  to {
                    transform: scale(1);
                  }
                }

                .radio-content {
                  display: flex;
                  flex-direction: column;
                  flex: 1;
                }

                .radio-label {
                  font-weight: 500;
                  color: rgba(255, 255, 255, 0.6);
                }

                .radio-option.selected .radio-label:not(.button) {
                  color: rgba(255, 255, 255, 0.8);
                }

                .radio-option.button.selected .radio-label {
                  color: #0a0a0a;
                }

                .radio-description {
                  color: rgba(255, 255, 255, 0.15);
                }

                .radio-option.selected .radio-description:not(.button) {
                  color: rgba(255, 255, 255, 0.2);
                }

                .radio-option.button.selected .radio-description {
                  color: rgba(10, 10, 10, 0.4);
                }

                /* Responsive */
                @media (max-width: 480px) {
                  .radio-group.horizontal {
                    flex-direction: column;
                  }

                  .radio-option {
                    padding: 0.3rem 0.5rem;
                  }

                  .radio-label {
                    font-size: 0.85rem;
                  }

                  .radio-description {
                    font-size: 0.7rem;
                  }
                }
              `}</style>
            </label>
          );
        })}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;