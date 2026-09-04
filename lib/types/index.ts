export * from "./user";
export * from "./lead";
export * from "./deal";
export * from "./task";
export * from "./activity";
export * from "./company";

export interface Project {
  id: string;
  name: string;
  description?: string;
  code?: string;
  active?: boolean;
  createdAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  fiscalYearStart?: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface PipelineStageConfig {
  id: string;
  name: string;
  color: string;
  order: number;
  winProbability?: number;
}

export interface LossReason {
  id: string;
  name: string;
  active?: boolean;
}

export interface CustomField {
  id: string;
  name: string;
  entityType: string;
  fieldType: string;
  required?: boolean;
  options?: string[];
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  target?: number;
}

export interface KPISnapshot {
  totalLeads: number;
  openDeals: number;
  pipelineValue: number;
  wonRevenue: number;
  conversionRate: number;
  avgDealSize: number;
  tasksDueToday?: number;
  recentActivityCount?: number;
  winRate?: number;
}
