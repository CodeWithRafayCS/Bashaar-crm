"use client";

import { forwardRef, SelectHTMLAttributes, ReactNode, useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "minimal";
  fullWidth?: boolean;
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      description,
      error,
      options,
      placeholder = "Select...",
      size = "md",
      variant = "default",
      fullWidth = true,
      className = "",
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      searchable = false,
      clearable = false,
      onClear,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectId = id || `select-${Math.random().toString(36).slice(2, 11)}`;

    useEffect(() => {
      // Find selected option label
      const selectedOption = options.find(opt => opt.value === value);
      if (selectedOption) {
        setSelectedLabel(selectedOption.label);
      } else if (defaultValue) {
        const defaultOption = options.find(opt => opt.value === defaultValue);
        if (defaultOption) {
          setSelectedLabel(defaultOption.label);
        }
      }
    }, [value, defaultValue, options]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          setSearchTerm("");
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

    const filteredOptions = searchTerm
      ? options.filter(opt =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      if (onChange) {
        const event = {
          target: {
            value: option.value,
            name: props.name,
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      setSelectedLabel(option.label);
      setIsOpen(false);
      setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onChange) {
        const event = {
          target: {
            value: "",
            name: props.name,
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      setSelectedLabel("");
      onClear?.();
    };

    const sizeClasses = {
      sm: {
        wrapper: "min-h-[32px]",
        input: "text-xs px-2.5 py-1.5",
        label: "text-xs",
        description: "text-xs",
        option: "text-xs px-2 py-1.5",
        icon: "w-3.5 h-3.5",
      },
      md: {
        wrapper: "min-h-[40px]",
        input: "text-sm px-3 py-2",
        label: "text-sm",
        description: "text-sm",
        option: "text-sm px-3 py-2",
        icon: "w-4 h-4",
      },
      lg: {
        wrapper: "min-h-[48px]",
        input: "text-base px-4 py-2.5",
        label: "text-base",
        description: "text-base",
        option: "text-base px-4 py-2.5",
        icon: "w-5 h-5",
      },
    };

    const variantClasses = {
      default: "bg-white/5 border-white/10 focus-within:border-gold/40",
      ghost: "bg-transparent border-transparent focus-within:border-gold/20",
      minimal: "bg-white/3 border-white/5 focus-within:border-gold/30",
    };

    const sizes = sizeClasses[size];
    const variantClass = variantClasses[variant];
    const hasError = !!error;

    return (
      <div className={`select-wrapper ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label htmlFor={selectId} className={`select-label ${sizes.label}`}>
            {label}
            {props.required && <span className="select-required">*</span>}
          </label>
        )}

        <div ref={selectRef} className="select-container">
          <div
            className={`select-trigger ${variantClass} ${hasError ? "error" : ""} ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${sizes.input}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <span className={`select-value ${!selectedLabel ? "placeholder" : ""}`}>
              {selectedLabel || placeholder}
            </span>

            {clearable && selectedLabel && !disabled && (
              <button
                type="button"
                className="select-clear"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <X className={sizes.icon} />
              </button>
            )}

            <ChevronDown className={`select-chevron ${sizes.icon} ${isOpen ? "open" : ""}`} />
          </div>

          {/* Hidden native select for form submission */}
          <select
            ref={ref}
            id={selectId}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            className="select-native"
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Dropdown */}
          {isOpen && !disabled && (
            <div className="select-dropdown">
              {searchable && (
                <div className="select-search">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className={`select-search-input ${sizes.input}`}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              )}

              <div className="select-options">
                {filteredOptions.length === 0 ? (
                  <div className={`select-empty ${sizes.option}`}>
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <div
                        key={option.value}
                        className={`select-option ${sizes.option} ${isSelected ? "selected" : ""} ${option.disabled ? "disabled" : ""}`}
                        onClick={() => handleSelect(option)}
                      >
                        {option.icon && (
                          <span className="select-option-icon">{option.icon}</span>
                        )}
                        <span className="select-option-label">{option.label}</span>
                        {isSelected && <Check className="select-option-check" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {description && !error && (
          <p className={`select-description ${sizes.description}`}>
            {description}
          </p>
        )}

        {error && (
          <p className="select-error">{error}</p>
        )}

        <style jsx>{`
          .select-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .select-label {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.3px;
          }

          .select-required {
            color: #ff4444;
            margin-left: 0.1rem;
          }

          .select-container {
            position: relative;
          }

          .select-trigger {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1px solid;
            border-radius: 8px;
            transition: all 0.3s;
            cursor: pointer;
            user-select: none;
            position: relative;
          }

          .select-trigger:hover:not(.disabled):not(.error) {
            border-color: rgba(255, 255, 255, 0.15);
          }

          .select-trigger.open {
            border-color: #f4c542;
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          }

          .select-trigger.error {
            border-color: #ff4444;
          }

          .select-trigger.error.open {
            box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.06);
          }

          .select-trigger.disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .select-value {
            flex: 1;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .select-value.placeholder {
            color: rgba(255, 255, 255, 0.1);
          }

          .select-clear {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: color 0.3s;
            padding: 0.2rem;
          }

          .select-clear:hover {
            color: rgba(255, 255, 255, 0.4);
          }

          .select-chevron {
            color: rgba(255, 255, 255, 0.15);
            transition: transform 0.3s;
            flex-shrink: 0;
          }

          .select-chevron.open {
            transform: rotate(180deg);
          }

          .select-native {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
            pointer-events: none;
          }

          /* Dropdown */
          .select-dropdown {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            right: 0;
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            z-index: 50;
            animation: dropdownFadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 280px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
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

          .select-search {
            padding: 0.3rem 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          }

          .select-search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 6px;
            color: rgba(255, 255, 255, 0.6);
            font-family: inherit;
            outline: none;
            transition: all 0.3s;
          }

          .select-search-input:focus {
            border-color: #f4c542;
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          }

          .select-options {
            overflow-y: auto;
            padding: 0.2rem;
            flex: 1;
          }

          .select-options::-webkit-scrollbar {
            width: 3px;
          }

          .select-options::-webkit-scrollbar-track {
            background: transparent;
          }

          .select-options::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.1);
            border-radius: 2px;
          }

          .select-empty {
            color: rgba(255, 255, 255, 0.1);
            text-align: center;
            padding: 0.5rem;
          }

          .select-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            color: rgba(255, 255, 255, 0.4);
          }

          .select-option:hover:not(.disabled) {
            background: rgba(255, 255, 255, 0.04);
            color: rgba(255, 255, 255, 0.6);
          }

          .select-option.selected {
            background: rgba(244, 197, 66, 0.06);
            color: #f4c542;
          }

          .select-option.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          .select-option-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .select-option-label {
            flex: 1;
          }

          .select-option-check {
            width: 16px;
            height: 16px;
            color: #f4c542;
            flex-shrink: 0;
          }

          .select-description {
            color: rgba(255, 255, 255, 0.15);
            font-weight: 400;
            margin: 0;
          }

          .select-error {
            color: #ff4444;
            font-size: 0.75rem;
            margin: 0;
          }

          /* Responsive */
          @media (max-width: 480px) {
            .select-trigger {
              border-radius: 6px;
            }

            .select-value {
              font-size: 0.85rem;
            }

            .select-label {
              font-size: 0.8rem;
            }

            .select-description {
              font-size: 0.7rem;
            }

            .select-dropdown {
              max-height: 220px;
            }
          }
        `}</style>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;