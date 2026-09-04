export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return "$0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string | number | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateShort(date: string | number | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | number | Date | undefined | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatPhone(phone: string | undefined | null): string {
  if (!phone) return "";
  return String(phone);
}

export function taskDueKind(dueDate?: string | null, status?: string): "overdue" | "today" | "upcoming" | "none" {
  if (status === "Completed") return "upcoming";
  if (!dueDate) return "none";
  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return "none";
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dueStart = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (dueStart < todayStart) return "overdue";
  if (dueStart === todayStart) return "today";
  return "upcoming";
}
