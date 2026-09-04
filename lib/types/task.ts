export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed" | "Overdue" | string;
  priority: "High" | "Medium" | "Low" | string;
  dueDate?: string;
  assigneeEmail?: string;
  leadId?: string;
  dealId?: string;
  companyId?: string;
  createdAt: string;
  completedAt?: string;
}
