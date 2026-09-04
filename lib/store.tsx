"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  initials?: string;
}

interface AppStoreContextType {
  user: User | null;
  users: User[];
  projects: any[];
  activeProjectId: string;
  version: number;
  pushToast: (type: string, message: string) => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => Promise<void>;
  refresh: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("all");
  const [version, setVersion] = useState(0);

  const pushToast = (type: string, message: string) => {
    console.log(`[${type}] ${message}`);
  };

  const login = (email: string, password: string) => {
    const mockUsers: User[] = [
      { id: "1", name: "Sarah", email: "sarah@bashar.ai", role: "Admin", active: true, initials: "S" },
      { id: "2", name: "John", email: "john@bashar.ai", role: "Sales User", active: true, initials: "J" },
      { id: "3", name: "Mike", email: "mike@bashar.ai", role: "Manager", active: true, initials: "M" },
    ];
    
    const found = mockUsers.find((u) => u.email === email);
    if (found && password === "demo") {
      setUser(found);
      setUsers(mockUsers);
      return { ok: true };
    }
    return { ok: false, error: "Invalid credentials" };
  };

  const logout = async () => {
    setUser(null);
  };

  const refresh = () => {
    setVersion((v) => v + 1);
  };

  return (
    <AppStoreContext.Provider
      value={{
        user,
        users,
        projects,
        activeProjectId,
        version,
        pushToast,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
}