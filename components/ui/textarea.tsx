"use client";

import { forwardRef, TextareaHTMLAttributes, ReactNode } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "minimal";
  fullWidth?: boolean;
  className?: string;
  rows?: number;
  maxRows?: number;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      success = false,
      icon,
      size = "md",
      variant = "default",
      fullWidth = true,
      className = "",
      id,
      disabled,
      rows = 3,
      maxRows,
      autoResize = false,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 11)}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    const sizeClasses = {
      sm: {
        textarea: "text-xs px-2.5 py-1.5 min-h-[60px]",
        label: "text-xs",
        description: "text-xs",
        icon: "w-3.5 h-3.5",
      },
      md: {
        textarea: "text-sm px-3 py-2 min-h-[80px]",
        label: "text-sm",
        description: "text-sm",
        icon: "w-4 h-4",
      },
      lg: {
        textarea: "text-base px-4 py-2.5 min-h-[100px]",
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

    return (
      <div className={`textarea-wrapper ${fullWidth ? "w-full" : ""} ${className}`}>
        {label && (
          <label htmlFor={textareaId} className={`textarea-label ${sizes.label}`}>
            {label}
            {props.required && <span className="textarea-required">*</span>}
          </label>
        )}

        <div
          className={`textarea-container ${variantClass} ${hasError ? "error" : ""} ${hasSuccess ? "success" : ""}`}
        >
          {icon && (
            <span className={`textarea-icon ${sizes.icon}`}>{icon}</span>
          )}

          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            className={`textarea-field ${sizes.textarea} ${icon ? "pl-8" : ""}`}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${textareaId}-error` :
              description ? `${textareaId}-description` :
              undefined
            }
            style={{
              maxHeight: maxRows ? `${maxRows * 1.5}rem` : undefined,
              resize: autoResize ? "none" : "vertical",
            }}
            {...props}
          />
        </div>

        {description && !error && (
          <p id={`${textareaId}-description`} className={`textarea-description ${sizes.description}`}>
            {description}
          </p>
        )}

        {error && (
          <p id={`${textareaId}-error`} className="textarea-error">
            {error}
          </p>
        )}

        <style jsx>{`
          .textarea-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
          }

          .textarea-label {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.4);
            letter-spacing: 0.3px;
          }

          .textarea-required {
            color: #ff4444;
            margin-left: 0.1rem;
          }

          .textarea-container {
            display: flex;
            align-items: flex-start;
            border: 1px solid;
            border-radius: 8px;
            transition: all 0.3s;
            position: relative;
          }

          .textarea-container:hover:not(.error):not(.success) {
            border-color: rgba(255, 255, 255, 0.15);
          }

          .textarea-container:focus-within {
            border-color: #f4c542;
            box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          }

          .textarea-container.error {
            border-color: #ff4444;
          }

          .textarea-container.error:focus-within {
            box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.06);
          }

          .textarea-container.success {
            border-color: #00c853;
          }

          .textarea-container.success:focus-within {
            box-shadow: 0 0 0 3px rgba(0, 200, 83, 0.06);
          }

          .textarea-container:has(:disabled) {
            opacity: 0.4;
            cursor: not-allowed;
          }

          .textarea-field {
            width: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: rgba(255, 255, 255, 0.7);
            font-family: inherit;
            font-weight: 400;
            line-height: 1.5;
            resize: vertical;
          }

          .textarea-field::placeholder {
            color: rgba(255, 255, 255, 0.1);
          }

          .textarea-field:disabled {
            cursor: not-allowed;
          }

          .textarea-field::-webkit-scrollbar {
            width: 4px;
          }

          .textarea-field::-webkit-scrollbar-track {
            background: transparent;
          }

          .textarea-field::-webkit-scrollbar-thumb {
            background: rgba(244, 197, 66, 0.1);
            border-radius: 2px;
          }

          .textarea-icon {
            position: absolute;
            left: 0.75rem;
            top: 0.75rem;
            color: rgba(255, 255, 255, 0.15);
            pointer-events: none;
          }

          .textarea-description {
            color: rgba(255, 255, 255, 0.15);
            font-weight: 400;
            margin: 0;
          }

          .textarea-error {
            color: #ff4444;
            font-size: 0.75rem;
            margin: 0;
          }

          @media (max-width: 480px) {
            .textarea-container {
              border-radius: 6px;
            }

            .textarea-field {
              font-size: 0.85rem;
            }

            .textarea-label {
              font-size: 0.8rem;
            }

            .textarea-description {
              font-size: 0.7rem;
            }
          }
        `}</style>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;