"use client";

import { useState, useCallback, useEffect } from "react";
import type { ToastVariant } from "./toast";

export interface ToastInput {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Toast extends ToastInput {
  id: string;
  visible: boolean;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<ToastInput>) => void;
  dismissAll: () => void;
  success: (toast: ToastInput) => void;
  error: (toast: ToastInput) => void;
  warning: (toast: ToastInput) => void;
  info: (toast: ToastInput) => void;
}

let toastIdCounter = 0;

export function useToast(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastInput: ToastInput) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: Toast = {
      id,
      visible: true,
      variant: toastInput.variant || "info",
      title: toastInput.title,
      description: toastInput.description,
      duration: toastInput.duration || 4000,
      action: toastInput.action,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, visible: false } : t
        )
      );
      // Remove after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, newToast.duration + 300);

    return id;
  }, []);

  const updateToast = useCallback((id: string, toastInput: Partial<ToastInput>) => {
    setToasts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...toastInput } : t
      )
    );
  }, []);

  const dismissAll = useCallback(() => {
    setToasts((prev) =>
      prev.map((t) => ({ ...t, visible: false }))
    );
    setTimeout(() => {
      setToasts([]);
    }, 300);
  }, []);

  const success = useCallback((toast: ToastInput) => {
    addToast({ ...toast, variant: "success" });
  }, [addToast]);

  const error = useCallback((toast: ToastInput) => {
    addToast({ ...toast, variant: "error" });
  }, [addToast]);

  const warning = useCallback((toast: ToastInput) => {
    addToast({ ...toast, variant: "warning" });
  }, [addToast]);

  const info = useCallback((toast: ToastInput) => {
    addToast({ ...toast, variant: "info" });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    dismissAll,
    success,
    error,
    warning,
    info,
  };
}

export default useToast;