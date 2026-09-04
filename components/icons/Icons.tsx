"use client";

import { 
  // Lucide Icons
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  HelpCircle,
  Home,
  Info,
  Link,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Trash,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Custom Icons
import { ReactNode } from "react";

export interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  HelpCircle,
  Home,
  Info,
  Link,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Trash,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  X,
  Zap,
};

// ============================================
// Brand Icons
// ============================================

export function BashaarLogo({ className = "", size = 40 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="url(#bashaar-gradient)" />
      <text
        x="20"
        y="28"
        textAnchor="middle"
        fill="#0a0a0a"
        fontSize="22"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      >
        B
      </text>
      <defs>
        <linearGradient id="bashaar-gradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#f4c542" />
          <stop offset="100%" stopColor="#d4a030" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BashaarMark({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="6" fill="url(#bashaar-mark-gradient)" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="#0a0a0a"
        fontSize="14"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      >
        B
      </text>
      <defs>
        <linearGradient id="bashaar-mark-gradient" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#f4c542" />
          <stop offset="100%" stopColor="#d4a030" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function BashaarText({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      className={className}
      width={size * 3}
      height={size}
      viewBox="0 0 180 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="28"
        fill="#ffffff"
        fontSize="28"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        Bashaar
      </text>
      <text
        x="110"
        y="28"
        fill="#f4c542"
        fontSize="28"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        AI
      </text>
    </svg>
  );
}

// ============================================
// Status Icons
// ============================================

interface StatusIconProps extends IconProps {
  status: "success" | "error" | "warning" | "info" | "pending" | "active" | "inactive";
}

export function StatusIcon({ status, className = "", size = 20 }: StatusIconProps) {
  const icons: Record<string, LucideIcon> = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    pending: Clock,
    active: CheckCircle,
    inactive: X,
  };

  const colors: Record<string, string> = {
    success: "#00c853",
    error: "#ff4444",
    warning: "#ffc107",
    info: "#4285f4",
    pending: "#ffc107",
    active: "#00c853",
    inactive: "#666666",
  };

  const Icon = icons[status] || Info;
  const color = colors[status] || "#ffffff";

  return <Icon className={className} size={size} color={color} />;
}

// ============================================
// Channel Icons
// ============================================

interface ChannelIconProps extends IconProps {
  channel: "Call" | "WhatsApp" | "Meeting" | "Note" | "Email" | "Task";
}

export function ChannelIcon({ channel, className = "", size = 20 }: ChannelIconProps) {
  const icons: Record<string, LucideIcon> = {
    Call: Phone,
    WhatsApp: MessageSquare,
    Meeting: Calendar,
    Note: FileText,
    Email: Mail,
    Task: CheckCircle,
  };

  const colors: Record<string, string> = {
    Call: "#4285f4",
    WhatsApp: "#25d366",
    Meeting: "#f4c542",
    Note: "#ffc107",
    Email: "#ea4335",
    Task: "#00c853",
  };

  const Icon = icons[channel] || FileText;
  const color = colors[channel] || "#ffffff";

  return <Icon className={className} size={size} color={color} />;
}

// ============================================
// Priority Icons
// ============================================

interface PriorityIconProps extends IconProps {
  priority: "High" | "Medium" | "Low";
}

export function PriorityIcon({ priority, className = "", size = 20 }: PriorityIconProps) {
  const colors: Record<string, string> = {
    High: "#ff4444",
    Medium: "#ffc107",
    Low: "#00c853",
  };

  return <Flag className={className} size={size} color={colors[priority] || "#ffffff"} />;
}

// ============================================
// Stage Icons
// ============================================

interface StageIconProps extends IconProps {
  stage: string;
}

export function StageIcon({ stage, className = "", size = 20 }: StageIconProps) {
  const icons: Record<string, LucideIcon> = {
    "New": FileText,
    "Attempted": Phone,
    "Connected": CheckCircle,
    "Interested": Star,
    "Meeting Scheduled": Calendar,
    "Proposal Sent": FileText,
    "Negotiation": TrendingUp,
    "Won": CheckCircle,
    "Lost": X,
  };

  const colors: Record<string, string> = {
    "New": "#4285f4",
    "Attempted": "#9c27b0",
    "Connected": "#00c853",
    "Interested": "#ffc107",
    "Meeting Scheduled": "#f4c542",
    "Proposal Sent": "#ff6f00",
    "Negotiation": "#ff4444",
    "Won": "#00c853",
    "Lost": "#ff4444",
  };

  const Icon = icons[stage] || FileText;
  const color = colors[stage] || "#ffffff";

  return <Icon className={className} size={size} color={color} />;
}

// ============================================
// Navigation Icons
// ============================================

interface NavIconProps extends IconProps {
  active?: boolean;
}

export function DashboardIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function LeadsIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function CompaniesIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function PipelineIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <line x1="10" y1="10" x2="14" y2="14" />
      <line x1="10" y1="14" x2="14" y2="10" />
    </svg>
  );
}

export function DealsIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function TasksIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function ActivitiesIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function ReportsIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    </svg>
  );
}

export function TeamIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function SettingsIcon({ className = "", size = 20, active = false }: NavIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ============================================
// Export all icons as a group
// ============================================

export const Icons = {
  // Lucide
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Bell,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  HelpCircle,
  Home,
  Info,
  Link,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  MoreHorizontal,
  MoreVertical,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Trash,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  UserPlus,
  Users,
  X,
  Zap,
  
  // Custom
  BashaarLogo,
  BashaarMark,
  BashaarText,
  StatusIcon,
  ChannelIcon,
  PriorityIcon,
  StageIcon,
  DashboardIcon,
  LeadsIcon,
  CompaniesIcon,
  PipelineIcon,
  DealsIcon,
  TasksIcon,
  ActivitiesIcon,
  ReportsIcon,
  TeamIcon,
  SettingsIcon,
};

export default Icons;