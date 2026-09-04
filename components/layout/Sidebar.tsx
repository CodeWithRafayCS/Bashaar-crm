"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  User,
  Bell,
  Search,
  Home,
  Users,
  Building2,
  LayoutDashboard,
  DollarSign,
  CheckSquare,
  Activity,
  BarChart3,
  ChevronDown,
  Plus,
  Star,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ className = "", collapsed: externalCollapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, pushToast } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(externalCollapsed || false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Sync with external collapsed state
  useEffect(() => {
    if (externalCollapsed !== undefined) {
      setIsCollapsed(externalCollapsed);
    }
  }, [externalCollapsed]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse?.(newState);
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    pushToast("info", "Logged out successfully");
    router.push("/login");
  };

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <Home className="nav-icon" />,
    },
    {
      label: "Leads",
      href: "/leads",
      icon: <Users className="nav-icon" />,
      badge: 12,
    },
    {
      label: "Companies",
      href: "/companies",
      icon: <Building2 className="nav-icon" />,
    },
    {
      label: "Pipeline",
      href: "/pipeline",
      icon: <LayoutDashboard className="nav-icon" />,
    },
    {
      label: "Deals",
      href: "/deals",
      icon: <DollarSign className="nav-icon" />,
      badge: 5,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <CheckSquare className="nav-icon" />,
      badge: 3,
    },
    {
      label: "Activities",
      href: "/activities",
      icon: <Activity className="nav-icon" />,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <BarChart3 className="nav-icon" />,
      children: [
        { label: "Funnel", href: "/reports/funnel", icon: <ChevronDown className="nav-icon" /> },
        { label: "Revenue", href: "/reports/revenue", icon: <ChevronDown className="nav-icon" /> },
        { label: "Performance", href: "/reports/performance", icon: <ChevronDown className="nav-icon" /> },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isItemActive = isActive(item.href);
    const hasActiveChild = hasChildren && item.children?.some((child) => isActive(child.href));

    if (isCollapsed && hasChildren) {
      return (
        <div key={item.label} className="nav-group-collapsed">
          <div className="nav-item collapsed">
            <span className="nav-icon-wrapper">{item.icon}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        </div>
      );
    }

    return (
      <div key={item.label} className={`nav-item-wrapper depth-${depth}`}>
        {hasChildren ? (
          <>
            <button
              className={`nav-item ${isItemActive || hasActiveChild ? "active" : ""} has-children`}
              onClick={() => toggleExpand(item.label)}
            >
              <span className="nav-icon-wrapper">{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                  <ChevronDown className={`nav-chevron ${isExpanded ? "open" : ""}`} />
                </>
              )}
            </button>
            {!isCollapsed && isExpanded && hasChildren && (
              <div className="nav-children">
                {item.children!.map((child) => renderNavItem(child, depth + 1))}
              </div>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            className={`nav-item ${isItemActive ? "active" : ""}`}
          >
            <span className="nav-icon-wrapper">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </>
            )}
          </Link>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${className}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <Link href="/" className="brand-link">
          <div className="brand-icon">
            <span className="brand-mark">B</span>
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              Bashaar <span className="brand-highlight">AI</span>
            </div>
          )}
        </Link>
        <button className="collapse-btn" onClick={toggleCollapse} aria-label="Toggle sidebar">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Info */}
      {user && !isCollapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="quick-actions">
          <button className="quick-action" onClick={() => pushToast("info", "Add lead coming soon")}>
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
          <button className="quick-action" onClick={() => pushToast("info", "Search coming soon")}>
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => renderNavItem(item))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <>
            <Link href="/settings" className="footer-link">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link href="/help" className="footer-link">
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </Link>
            <button className="footer-link logout" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
            <div className="sidebar-version">v1.0.0</div>
          </>
        ) : (
          <div className="footer-collapsed">
            <button className="footer-icon" onClick={() => router.push("/settings")}>
              <Settings className="w-4 h-4" />
            </button>
            <button className="footer-icon" onClick={() => router.push("/help")}>
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="footer-icon logout" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          background: rgba(16, 16, 16, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .sidebar.collapsed {
          width: 64px;
        }

        .sidebar::-webkit-scrollbar {
          width: 3px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        /* Brand */
        .sidebar-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          min-height: 72px;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: opacity 0.3s;
        }

        .brand-link:hover {
          opacity: 0.8;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
          flex-shrink: 0;
        }

        .brand-mark {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.5px;
        }

        .brand-text {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .brand-highlight {
          color: #f4c542;
        }

        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
          font-family: inherit;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.4);
        }

        .sidebar.collapsed .collapse-btn {
          margin: 0 auto;
        }

        /* User Info */
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          margin: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Quick Actions */
        .quick-actions {
          display: flex;
          gap: 0.3rem;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex: 1;
          padding: 0.3rem 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .quick-action:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(244, 197, 66, 0.06);
          color: rgba(255, 255, 255, 0.5);
        }

        .quick-action svg {
          flex-shrink: 0;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 0.5rem 0.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-size: 0.85rem;
          font-weight: 500;
          width: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
          position: relative;
        }

        .nav-item:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-item.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .nav-item.active .nav-icon-wrapper {
          color: #f4c542;
        }

        .nav-item.has-children {
          position: relative;
        }

        .nav-item.collapsed {
          justify-content: center;
          padding: 0.5rem;
        }

        .nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.2);
          transition: color 0.3s;
        }

        .nav-label {
          flex: 1;
          white-space: nowrap;
        }

        .nav-badge {
          padding: 0.05rem 0.4rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #f4c542;
          flex-shrink: 0;
        }

        .nav-chevron {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.1);
          transition: transform 0.3s;
          flex-shrink: 0;
        }

        .nav-chevron.open {
          transform: rotate(180deg);
        }

        .nav-children {
          padding-left: 0.5rem;
          border-left: 1px solid rgba(255, 255, 255, 0.03);
          margin-left: 0.75rem;
        }

        .nav-children .nav-item {
          padding-left: 0.75rem;
          font-size: 0.8rem;
        }

        .nav-group-collapsed {
          display: flex;
          justify-content: center;
          padding: 0.1rem 0;
        }

        /* Footer */
        .sidebar-footer {
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.4rem 0.5rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .footer-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-link.logout:hover {
          color: rgba(255, 68, 68, 0.7);
          background: rgba(255, 68, 68, 0.06);
        }

        .footer-collapsed {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
        }

        .footer-icon:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-icon.logout:hover {
          color: rgba(255, 68, 68, 0.7);
          background: rgba(255, 68, 68, 0.06);
        }

        .sidebar-version {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.06);
          text-align: center;
          letter-spacing: 0.5px;
          padding: 0.2rem 0;
        }

        /* Scrollbar */
        .sidebar-nav::-webkit-scrollbar {
          width: 3px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.1);
          border-radius: 2px;
        }

        /* Responsive */
        @media (max-width: 767px) {
          .sidebar {
            width: 280px;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: 280px;
            transform: translateX(-100%);
          }

          .sidebar.collapsed.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}