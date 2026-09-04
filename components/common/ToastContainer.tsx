"use client";

import { ReactNode, useEffect, useState } from "react";
import { Toast, ToastItem, ToastType } from "./Toast";

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
}

export function ToastContainer({
  toasts,
  onClose,
  position = "top-right",
  className = "",
}: ToastContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={`toast-container fixed z-[9999] flex flex-col gap-2 pointer-events-none ${positionClasses[position]} ${className}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={onClose} />
        </div>
      ))}

      <style jsx>{`
        .toast-container {
          max-width: 100vw;
          padding: 0.5rem;
        }

        @media (max-width: 480px) {
          .toast-container {
            top: 0.5rem !important;
            right: 0.5rem !important;
            left: 0.5rem !important;
            bottom: auto !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}