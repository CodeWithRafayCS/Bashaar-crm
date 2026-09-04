"use client";

import { useAppStore } from "@/lib/store";

export function useAuth() {
  const { user, login, logout } = useAppStore();
  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

export default useAuth;
