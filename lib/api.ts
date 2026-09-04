import {
  mockUsers,
  mockLeads,
  mockDeals,
  mockCompanies,
  mockContacts,
  mockTasks,
  mockActivities,
  mockPayments,
  mockProducts,
  mockProjects,
  mockOrganization,
  mockPipelineStages,
  mockLossReasons,
  mockCustomFields,
} from "./data";
import type {
  User,
  Lead,
  Deal,
  Company,
  Contact,
  Task,
  Activity,
  Payment,
  Product,
  Project,
  Organization,
  PipelineStageConfig,
  LossReason,
  CustomField,
  KPISnapshot,
  RevenuePoint,
} from "./types";

// In-memory data store
let users: User[] = [...mockUsers];
let leads: Lead[] = [...mockLeads];
let deals: Deal[] = [...mockDeals];
let companies: Company[] = [...mockCompanies];
let contacts: Contact[] = [...mockContacts];
let tasks: Task[] = [...mockTasks];
let activities: Activity[] = [...mockActivities];
let payments: Payment[] = [...mockPayments];
let products: Product[] = [...mockProducts];
let projects: Project[] = [...mockProjects];
let organization: Organization = { ...mockOrganization };
let pipelineStages: PipelineStageConfig[] = [...mockPipelineStages];
let lossReasons: LossReason[] = [...mockLossReasons];
let customFields: CustomField[] = [...mockCustomFields];

const delay = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

// Database / Health
export async function getDatabase() {
  await delay();
  return {
    leads: leads.length,
    deals: deals.length,
    companies: companies.length,
    tasks: tasks.length,
    activities: activities.length,
  };
}

// KPI Snapshot
export async function getKPIs(): Promise<KPISnapshot> {
  await delay();
  const totalLeads = leads.length;
  const openDeals = deals.filter((d) => d.stage !== "Won" && d.stage !== "Lost").length;
  const pipelineValue = leads
    .filter((l) => l.stage !== "Won" && l.stage !== "Lost")
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const wonDeals = deals.filter((d) => d.stage === "Won" || d.won);
  const wonRevenue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonDeals.length / totalLeads) * 100) : 0;
  const avgDealSize = wonDeals.length > 0 ? Math.round(wonRevenue / wonDeals.length) : 0;

  return {
    totalLeads,
    openDeals,
    pipelineValue,
    wonRevenue,
    conversionRate,
    avgDealSize,
    tasksDueToday: tasks.filter((t) => t.status !== "Completed").length,
    recentActivityCount: activities.length,
    winRate: conversionRate,
  };
}

// Leads API
export async function getLeads(): Promise<Lead[]> {
  await delay();
  return [...leads];
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  await delay();
  return leads.find((l) => l.id === id);
}

export async function addLead(data: Partial<Lead>): Promise<Lead> {
  await delay();
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: data.name || "Untitled Lead",
    company: data.company || "",
    email: data.email || "",
    phone: data.phone || "",
    stage: data.stage || "New",
    source: data.source || "Website",
    value: Number(data.value) || 0,
    ownerEmail: data.ownerEmail || "sarah@bashar.ai",
    projectId: data.projectId,
    priority: data.priority || "Medium",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
    ...data,
  };
  leads = [newLead, ...leads];
  return newLead;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  await delay();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead not found");
  leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() };
  return leads[idx];
}

export async function moveStage(leadId: string, stage: string): Promise<Lead> {
  return updateLead(leadId, { stage });
}

export async function archiveLeads(ids: string[]): Promise<void> {
  await delay();
  const idSet = new Set(ids);
  leads = leads.filter((l) => !idSet.has(l.id));
}

export async function assignLeads(ids: string[], ownerEmail: string): Promise<void> {
  await delay();
  const idSet = new Set(ids);
  leads = leads.map((l) => (idSet.has(l.id) ? { ...l, ownerEmail } : l));
}

export function findDuplicateLeadIds(leadsList: Lead[]): string[] {
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  const duplicates = new Set<string>();

  for (const lead of leadsList) {
    const emailKey = lead.email ? lead.email.toLowerCase().trim() : null;
    const phoneKey = lead.phone ? lead.phone.replace(/\D/g, "") : null;

    if (emailKey) {
      if (seenEmails.has(emailKey)) duplicates.add(lead.id);
      else seenEmails.add(emailKey);
    }
    if (phoneKey && phoneKey.length > 5) {
      if (seenPhones.has(phoneKey)) duplicates.add(lead.id);
      else seenPhones.add(phoneKey);
    }
  }

  return Array.from(duplicates);
}

export async function importLeads(newLeads: Partial<Lead>[]): Promise<{ count: number }> {
  await delay();
  const created: Lead[] = newLeads.map((item, idx) => ({
    id: `lead-${Date.now()}-${idx}`,
    name: item.name || "Imported Lead",
    company: item.company || "",
    email: item.email || "",
    phone: item.phone || "",
    stage: item.stage || "New",
    source: item.source || "Imported",
    value: Number(item.value) || 0,
    ownerEmail: item.ownerEmail || "sarah@bashar.ai",
    createdAt: new Date().toISOString(),
    ...item,
  }));
  leads = [...created, ...leads];
  return { count: created.length };
}

// Deals API
export async function getDeals(): Promise<Deal[]> {
  await delay();
  return [...deals];
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  await delay();
  return deals.find((d) => d.id === id);
}

export async function updateDeal(id: string, updates: Partial<Deal>): Promise<Deal> {
  await delay();
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error("Deal not found");
  deals[idx] = { ...deals[idx], ...updates, updatedAt: new Date().toISOString() };
  return deals[idx];
}

export async function updateDealStage(id: string, stage: string): Promise<Deal> {
  return updateDeal(id, { stage });
}

export async function updateDealProposal(id: string, proposal: any): Promise<Deal> {
  return updateDeal(id, { notes: typeof proposal === "string" ? proposal : JSON.stringify(proposal) });
}

export async function markDealOutcome(id: string, outcome: "won" | "lost", reason?: string): Promise<Deal> {
  const isWon = outcome === "won";
  return updateDeal(id, {
    stage: isWon ? "Won" : "Lost",
    won: isWon,
    lostReason: isWon ? undefined : reason,
    closeDate: new Date().toISOString().split("T")[0],
  });
}

export async function createDealFromLead(lead: Lead, extra?: Partial<Deal>): Promise<Deal> {
  await delay();
  const newDeal: Deal = {
    id: `deal-${Date.now()}`,
    title: `${lead.company || lead.name} Deal`,
    value: lead.value || 10000,
    stage: lead.stage || "Proposal Sent",
    leadId: lead.id,
    ownerEmail: lead.ownerEmail,
    company: lead.company,
    contactName: lead.name,
    createdAt: new Date().toISOString(),
    ...extra,
  };
  deals = [newDeal, ...deals];
  return newDeal;
}

// Tasks API
export async function getTasks(): Promise<Task[]> {
  await delay();
  return [...tasks];
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  await delay();
  return tasks.find((t) => t.id === id);
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  await delay();
  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: data.title || "Untitled Task",
    description: data.description || "",
    status: data.status || "Pending",
    priority: data.priority || "Medium",
    dueDate: data.dueDate || new Date().toISOString(),
    assigneeEmail: data.assigneeEmail || "sarah@bashar.ai",
    leadId: data.leadId,
    dealId: data.dealId,
    companyId: data.companyId,
    createdAt: new Date().toISOString(),
    ...data,
  };
  tasks = [newTask, ...tasks];
  return newTask;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  await delay();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Task not found");
  tasks[idx] = { ...tasks[idx], ...updates };
  return tasks[idx];
}

export async function deleteTask(id: string): Promise<void> {
  await delay();
  tasks = tasks.filter((t) => t.id !== id);
}

export async function getTaskActivities(taskId: string): Promise<Activity[]> {
  await delay();
  return activities.filter((a) => a.taskId === taskId);
}

// Activities API
export async function getActivities(): Promise<Activity[]> {
  await delay();
  return [...activities];
}

export async function logActivity(data: Partial<Activity>): Promise<Activity> {
  await delay();
  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    userEmail: data.userEmail || "sarah@bashar.ai",
    channel: data.channel || "Call",
    outcome: data.outcome || "Connected",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
    ...data,
  };
  activities = [newActivity, ...activities];
  return newActivity;
}

// Companies API
export async function getCompanies(): Promise<Company[]> {
  await delay();
  return [...companies];
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  await delay();
  return companies.find((c) => c.id === id);
}

export async function getCompanyLeads(companyId: string): Promise<Lead[]> {
  await delay();
  return leads.filter((l) => l.companyId === companyId);
}

export async function getCompanyContacts(companyId: string): Promise<Contact[]> {
  await delay();
  return contacts.filter((c) => c.companyId === companyId);
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<Company> {
  await delay();
  const idx = companies.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Company not found");
  companies[idx] = { ...companies[idx], ...updates, updatedAt: new Date().toISOString() };
  return companies[idx];
}

// Payments & Products API
export async function getPayments(dealId?: string): Promise<Payment[]> {
  await delay();
  if (dealId) return payments.filter((p) => p.dealId === dealId);
  return [...payments];
}

export async function getProducts(): Promise<Product[]> {
  await delay();
  return [...products];
}

export async function addProduct(data: Partial<Product>): Promise<Product> {
  await delay();
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    name: data.name || "New Product",
    price: Number(data.price) || 0,
    category: data.category || "Software",
    active: true,
    ...data,
  };
  products = [...products, newProd];
  return newProd;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await delay();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  products[idx] = { ...products[idx], ...updates };
  return products[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  await delay();
  products = products.filter((p) => p.id !== id);
}

// Team / Users API
export async function addUser(data: Partial<User>): Promise<User> {
  await delay();
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name || "New Member",
    email: data.email || "",
    role: data.role || "Sales User",
    active: true,
    initials: (data.name || "N").slice(0, 2).toUpperCase(),
    ...data,
  };
  users = [...users, newUser];
  return newUser;
}

export async function toggleUserActive(userId: string): Promise<User> {
  await delay();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx], active: !users[idx].active };
  return users[idx];
}

// Settings API
export async function getOrganization(): Promise<Organization> {
  await delay();
  return { ...organization };
}

export async function updateOrganization(updates: Partial<Organization>): Promise<Organization> {
  await delay();
  organization = { ...organization, ...updates };
  return { ...organization };
}

export async function updateProjects(newProjects: Project[]): Promise<Project[]> {
  await delay();
  projects = [...newProjects];
  return [...projects];
}

export async function getPipelineStages(): Promise<PipelineStageConfig[]> {
  await delay();
  return [...pipelineStages];
}

export async function addPipelineStage(data: Partial<PipelineStageConfig>): Promise<PipelineStageConfig> {
  await delay();
  const newStage: PipelineStageConfig = {
    id: `stg-${Date.now()}`,
    name: data.name || "New Stage",
    color: data.color || "#4285f4",
    order: pipelineStages.length + 1,
    winProbability: data.winProbability || 50,
    ...data,
  };
  pipelineStages = [...pipelineStages, newStage];
  return newStage;
}

export async function deletePipelineStage(id: string): Promise<void> {
  await delay();
  pipelineStages = pipelineStages.filter((s) => s.id !== id);
}

export async function renamePipelineStage(id: string, name: string): Promise<PipelineStageConfig> {
  await delay();
  const idx = pipelineStages.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Stage not found");
  pipelineStages[idx] = { ...pipelineStages[idx], name };
  return pipelineStages[idx];
}

export async function reorderStages(stages: PipelineStageConfig[]): Promise<PipelineStageConfig[]> {
  await delay();
  pipelineStages = [...stages];
  return [...pipelineStages];
}

export async function getLossReasons(): Promise<LossReason[]> {
  await delay();
  return [...lossReasons];
}

export async function updateLossReasons(reasons: LossReason[]): Promise<LossReason[]> {
  await delay();
  lossReasons = [...reasons];
  return [...lossReasons];
}

export async function getCustomFields(): Promise<CustomField[]> {
  await delay();
  return [...customFields];
}

export async function updateCustomFields(fields: CustomField[]): Promise<CustomField[]> {
  await delay();
  customFields = [...fields];
  return [...customFields];
}

// Reports API
export async function getReports(preset = "Month") {
  await delay();
  const monthlyRevenue: RevenuePoint[] = [
    { month: "Jan", revenue: 45000, target: 40000 },
    { month: "Feb", revenue: 52000, target: 45000 },
    { month: "Mar", revenue: 68000, target: 50000 },
    { month: "Apr", revenue: 61000, target: 55000 },
    { month: "May", revenue: 78000, target: 60000 },
    { month: "Jun", revenue: 89000, target: 70000 },
  ];

  const stageFunnel = [
    { stage: "New", count: 42, value: 420000 },
    { stage: "Contacted", count: 35, value: 380000 },
    { stage: "Qualified", count: 28, value: 310000 },
    { stage: "Proposal", count: 18, value: 240000 },
    { stage: "Won", count: 12, value: 185000 },
  ];

  return {
    preset,
    monthlyRevenue,
    stageFunnel,
    kpis: await getKPIs(),
  };
}
