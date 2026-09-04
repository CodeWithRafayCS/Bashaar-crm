export const LEAD_STAGES = [
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export const DEAL_STAGES = [
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Cold Call",
  "LinkedIn",
  "Conference",
  "Inbound",
  "Outbound",
  "Partner",
  "Other",
] as const;

export const DATE_PRESETS = ["Week", "Month", "Quarter", "Year"] as const;

export const SETTINGS_TABS = [
  { slug: "organization", label: "Organization", icon: "🏢" },
  { slug: "projects", label: "Projects", icon: "📁" },
  { slug: "pipelines", label: "Pipelines", icon: "📊" },
  { slug: "products", label: "Products", icon: "📦" },
  { slug: "loss-reasons", label: "Loss Reasons", icon: "❌" },
  { slug: "custom-fields", label: "Custom Fields", icon: "⚙️" },
  { slug: "import-export", label: "Import / Export", icon: "🔄" },
] as const;
