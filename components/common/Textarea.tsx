"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      id,
      name,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium text-neutral-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          rows={rows}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-900 border text-neutral-100 placeholder-neutral-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
              : "border-neutral-800 hover:border-neutral-700"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-400 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
