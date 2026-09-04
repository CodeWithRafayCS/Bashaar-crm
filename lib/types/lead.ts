export type LeadStage =
  | "New"
  | "Attempted"
  | "Connected"
  | "Interested"
  | "Meeting Scheduled"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost"
  | string;

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title?: string;
  city?: string;
  country?: string;
  stage: LeadStage;
  source: string;
  value: number;
  ownerEmail: string;
  projectId?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent" | string;
  score?: number;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  lastActivityAt?: string;
  lossReason?: string;
  companyId?: string;
}
