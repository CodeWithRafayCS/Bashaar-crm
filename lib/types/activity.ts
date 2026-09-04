export interface Activity {
  id: string;
  leadId?: string;
  dealId?: string;
  companyId?: string;
  taskId?: string;
  userEmail: string;
  channel: "Call" | "WhatsApp" | "Meeting" | "Note" | "Email" | string;
  outcome: string;
  notes?: string;
  createdAt: string;
  title?: string;
}
