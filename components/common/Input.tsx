"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId, useState } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "minimal";
  fullWidth?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      success = false,
      icon,
      iconRight,
      size = "md",
      variant = "default",
      fullWidth = true,
      className = "",
      type = "text",
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      readOnly,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Check if controlled value is defined
    const isControlled = value !== undefined;
    const hasValueWithoutOnChange = isControlled && !onChange;

    const sizeClasses = {
      sm: {
        input: "text-xs px-2.5 py-1.5 min-h-[32px]",
        label: "text-xs",
        description: "text-xs",
        icon: "w-3.5 h-3.5",
      },
      md: {
        input: "text-sm px-3 py-2 min-h-[40px]",
        label: "text-sm",
        description: "text-sm",
        icon: "w-4 h-4",
      },
      lg: {
        input: "text-base px-4 py-2.5 min-h-[48px]",
        label: "text-base",
        description: "text-base",
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
    const hasSuccess = success && !hasError;

    // Safely structure input properties to avoid switching controlled/uncontrolled state
    const inputProps: InputHTMLAttributes<HTMLInputElement> = { ...props };
    if (isControlled) {
      inputProps.value = value ?? "";
    } else if (defaultValue !== undefined) {
      inputProps.defaultValue = defaultValue;
    }

    return (
      <div className={`input-wrapper ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={`input-label ${sizes.label}`}>
            {label}
            {props.required && <span className="input-required">*</span>}
          </label>
        )}

        <div
          className={`input-container ${variantClass} ${hasError ? "error" : ""} ${hasSuccess ? "success" : ""} ${sizes.input}`}
        >
          {icon && (
            <span className={`input-icon-left ${sizes.icon}`}>{icon}</span>
          )}

          <input
            ref={ref}
            type={inputType}
            id={inputId}
            className={`input-field ${sizes.input} ${icon ? "pl-8" : ""} ${iconRight || isPassword ? "pr-8" : ""}`}
            disabled={disabled}
            onChange={onChange}
            readOnly={readOnly || hasValueWithoutOnChange}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` :
              description ? `${inputId}-description` :
              undefined
            }
            {...inputProps}
          />

          {isPassword && (
            <button
              type="button"
              className="input-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className={sizes.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className={sizes.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {!isPassword && iconRight && (
            <span className={`input-icon-right ${sizes.icon}`}>{iconRight}</span>
          )}

          {hasError && !isPassword && (
            <svg className={`input-icon-right text-error ${sizes.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}

          {hasSuccess && !isPassword && (
            <svg className={`input-icon-right text-success ${sizes.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>

        {description && !error && (
          <p id={`${inputId}-description`} className={`input-description ${sizes.description}`}>
            {description}
          </p>
        )}

        {error && (
          <p id={`${inputId}-error`} className="input-error">
            {error}
          </p>
        )}

        <style jsx>{`
          .input-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .input-label {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.3px;
          }

          .input-required {
            color: #ff4444;
            margin-left: 0.1rem;
          }

          .input-container {
            display: flex;
            align-items: center;
            border: 1px solid;
            border-radius: 8px;
            transition: all 0.3s;
            position: relative;
          }

          .input-container:hover:not(.error):not(.success) {
            border-color: rgba(255, 255, 255, 0.15);
          }

          .input-container:focus-within {
            border-color: #f4c542;
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          }

          .input-container.error {
            border-color: #ff4444;
          }

          .input-container.error:focus-within {
            box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.06);
          }

          .input-container.success {
            border-color: #00c853;
          }

          .input-container.success:focus-within {
            box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.06);
          }

          .input-container:has(:disabled) {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .input-field {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: rgba(255, 255, 255, 0.7);
            font-family: inherit;
            font-weight: 400;
          }

          .input-field::placeholder {
            color: rgba(255, 255, 255, 0.1);
          }

          .input-field:disabled {
            cursor: not-allowed;
          }

          .input-icon-left {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.15);
            pointer-events: none;
          }

          .input-icon-right {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: rgba(255, 255, 255, 0.15);
            pointer-events: none;
          }

          .input-icon-right.text-error {
            color: #ff4444;
          }

          .input-icon-right.text-success {
            color: #00c853;
          }

          .input-toggle-password {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.15);
            cursor: pointer;
            transition: color 0.3s;
            padding: 0.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .input-toggle-password:hover {
            color: rgba(255, 255, 255, 0.4);
          }

          .input-description {
            color: rgba(255, 255, 255, 0.15);
            font-weight: 400;
            margin: 0;
          }

          .input-error {
            color: #ff4444;
            font-size: 0.75rem;
            margin: 0;
          }

          @media (max-width: 480px) {
            .input-container {
              border-radius: 6px;
            }
            .input-field {
              font-size: 0.85rem;
            }
            .input-label {
              font-size: 0.8rem;
            }
            .input-description {
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;