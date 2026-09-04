export type Role = "Admin" | "Manager" | "Sales User" | "Viewer" | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  initials?: string;
  phone?: string;
  title?: string;
  avatar?: string;
  leadsCreated?: number;
  dealsWon?: number;
  tasksCompleted?: number;
  createdAt?: string;
  lastActive?: string;
}
