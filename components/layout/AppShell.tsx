"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Bell,
  Search,
  HelpCircle,
} from "lucide-react";
import {
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
} from "@/components/icons/Icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, pushToast } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);

  // Check if user is authenticated
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <DashboardIcon size={20} />,
    },
    {
      label: "Leads",
      href: "/leads",
      icon: <LeadsIcon size={20} />,
    },
    {
      label: "Companies",
      href: "/companies",
      icon: <CompaniesIcon size={20} />,
    },
    {
      label: "Pipeline",
      href: "/pipeline",
      icon: <PipelineIcon size={20} />,
    },
    {
      label: "Deals",
      href: "/deals",
      icon: <DealsIcon size={20} />,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: <TasksIcon size={20} />,
      badge: 3,
    },
    {
      label: "Activities",
      href: "/activities",
      icon: <ActivitiesIcon size={20} />,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <ReportsIcon size={20} />,
    },
    {
      label: "Team",
      href: "/team",
      icon: <TeamIcon size={20} />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <SettingsIcon size={20} />,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    pushToast("info", "Logged out successfully");
    router.push("/login");
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="loader" />
          <p className="text-white/20 mt-4">Loading dashboard...</p>
        </div>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.04);
            border-top-color: #f4c542;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <Link href="/" className="brand-link">
            <div className="brand-icon">
              <span className="brand-mark">B</span>
            </div>
            <div className="brand-text">
              Bashaar <span className="brand-highlight">AI</span>
            </div>
          </Link>
        </div>

        {/* User Info */}
        {user && (
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

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
              {isActive(item.href) && <span className="nav-indicator" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <div className="sidebar-version">v1.0.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="topbar-title">
              {navItems.find((i) => isActive(i.href))?.label || "Dashboard"}
            </h2>
          </div>

          <div className="topbar-right">
            {/* Search */}
            <button
              className="search-toggle"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="search-shortcut">
                <span className="shortcut-key">⌘</span>
                <span className="shortcut-key">K</span>
              </span>
            </button>

            {/* Notifications */}
            <button className="notifications-btn" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="notification-dot" />
            </button>

            {/* Profile */}
            <div className="profile-wrapper" ref={profileRef}>
              <button
                className="profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile menu"
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.name || "User"}</span>
                  <span className="profile-role">{user?.role || "Role"}</span>
                </div>
                <ChevronDown className={`profile-chevron ${isProfileOpen ? "open" : ""}`} />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="dropdown-user">
                      <span className="dropdown-name">{user?.name || "User"}</span>
                      <span className="dropdown-email">{user?.email || "user@bashar.ai"}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link href="/settings" className="dropdown-item">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <Link href="/help" className="dropdown-item">
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">{children}</div>
      </main>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-overlay" onClick={() => setIsSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrapper">
              <Search className="search-modal-icon" />
              <input
                type="text"
                className="search-modal-input"
                placeholder="Search leads, companies, deals..."
                autoFocus
              />
              <button className="search-modal-close" onClick={() => setIsSearchOpen(false)}>
                <span className="shortcut-key">Esc</span>
              </button>
            </div>
            <div className="search-results">
              <p className="search-hint">Type to search across all modules...</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
        }

        /* ===== Sidebar ===== */
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
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
        }

        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.2);
          border-radius: 2px;
        }

        @media (max-width: 767px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }

        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0);
          }
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Brand */
        .sidebar-brand {
          padding: 1.5rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
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
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.25);
          flex-shrink: 0;
        }

        .brand-mark {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.5px;
        }

        .brand-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brand-highlight {
          color: #f4c542;
        }

        /* User Info */
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
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
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 0.5rem 0.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .nav-item:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-item.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .nav-item.active .nav-icon {
          color: #f4c542;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.2);
          transition: color 0.3s;
        }

        .nav-item.active .nav-icon {
          color: #f4c542;
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge {
          padding: 0.05rem 0.4rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #f4c542;
        }

        .nav-indicator {
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 2px;
          flex-shrink: 0;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 0.75rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 6px;
          font-family: inherit;
        }

        .logout-btn:hover {
          color: rgba(255, 68, 68, 0.7);
          background: rgba(255, 68, 68, 0.06);
        }

        .sidebar-version {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.08);
          text-align: center;
          letter-spacing: 0.5px;
        }

        /* ===== Main Content ===== */
        .main-content {
          flex: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 768px) {
          .main-content {
            margin-left: 260px;
          }
        }

        /* Topbar */
        .topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          min-height: 64px;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
        }

        @media (min-width: 768px) {
          .menu-toggle {
            display: none;
          }
        }

        .topbar-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Search */
        .search-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .search-toggle:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .search-shortcut {
          display: flex;
          gap: 0.1rem;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .shortcut-key {
          padding: 0.05rem 0.2rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 3px;
        }

        /* Notifications */
        .notifications-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .notifications-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: #ff4444;
          border-radius: 50%;
          border: 2px solid #0a0a0a;
        }

        /* Profile */
        .profile-wrapper {
          position: relative;
        }

        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .profile-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .profile-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .profile-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .profile-role {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .profile-chevron {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
          transition: transform 0.3s;
        }

        .profile-chevron.open {
          transform: rotate(180deg);
        }

        @media (max-width: 768px) {
          .profile-info {
            display: none;
          }
        }

        /* Profile Dropdown */
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          min-width: 220px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 50;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
        }

        .dropdown-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .dropdown-user {
          display: flex;
          flex-direction: column;
        }

        .dropdown-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .dropdown-email {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.04);
          margin: 0.3rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          font-family: inherit;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
        }

        .dropdown-item.logout {
          color: rgba(255, 68, 68, 0.5);
        }

        .dropdown-item.logout:hover {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        /* ===== Search Modal ===== */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
          animation: fadeIn 0.2s ease;
        }

        .search-modal {
          max-width: 600px;
          width: 100%;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          gap: 0.5rem;
        }

        .search-modal-icon {
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.15);
        }

        .search-modal-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          font-family: inherit;
        }

        .search-modal-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .search-modal-close {
          padding: 0.2rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.6rem;
          cursor: pointer;
          font-family: inherit;
        }

        .search-modal-close:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .search-results {
          padding: 1rem;
          min-height: 100px;
        }

        .search-hint {
          color: rgba(255, 255, 255, 0.1);
          font-size: 0.85rem;
          text-align: center;
          margin: 0;
        }

        /* Page Content */
        .page-content {
          flex: 1;
          padding: 0;
        }

        /* Global Styles for children */
        .page-content :global(.page-header) {
          padding: 1.5rem 1.5rem 0;
        }

        .page-content :global(.page-header) + * {
          padding: 0 1.5rem;
        }

        .page-content :global(.page-header) + :global(.stats-grid),
        .page-content :global(.page-header) + :global(.filters-section),
        .page-content :global(.page-header) + :global(.tabs-wrapper),
        .page-content :global(.page-header) + :global(.filter-bar),
        .page-content :global(.page-header) + :global(.toolbar) {
          padding: 0 1.5rem;
          margin-top: 0.75rem;
        }

        .page-content :global(.page-header) + :global(.card),
        .page-content :global(.page-header) + :global(.dash-grid),
        .page-content :global(.page-header) + :global(.team-grid),
        .page-content :global(.page-header) + :global(.tasks-grid),
        .page-content :global(.page-header) + :global(.companies-grid),
        .page-content :global(.page-header) + :global(.products-grid),
        .page-content :global(.page-header) + :global(.table-wrapper),
        .page-content :global(.page-header) + :global(.empty-wrapper),
        .page-content :global(.page-header) + :global(.chart-card),
        .page-content :global(.page-header) + :global(.calendar-wrapper),
        .page-content :global(.page-header) + :global(.deals-container),
        .page-content :global(.page-header) + :global(.lead-detail),
        .page-content :global(.page-header) + :global(.detail-grid),
        .page-content :global(.page-header) + :global(.kanban-wrapper) {
          padding: 0 1.5rem 1.5rem;
        }

        .page-content :global(.page-header) + :global(.kpi-grid) {
          padding: 0 1.5rem;
          margin-top: 0.75rem;
        }

        .page-content :global(.page-header) + :global(.kpi-grid) + * {
          padding: 0 1.5rem;
        }

        .page-content :global(.card) {
          margin: 0 1.5rem 1.5rem;
        }

        .page-content :global(.dash-grid) {
          padding: 0 1.5rem 1.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .topbar {
            padding: 0.5rem 1rem;
          }

          .search-shortcut {
            display: none;
          }

          .topbar-title {
            font-size: 0.95rem;
          }

          .profile-btn {
            padding: 0.2rem 0.4rem;
          }

          .search-toggle {
            padding: 0.3rem 0.5rem;
          }

          .page-content :global(.page-header) {
            padding: 1rem 1rem 0;
          }

          .page-content :global(.page-header) + * {
            padding: 0 1rem;
          }

          .page-content :global(.page-header) + :global(.stats-grid),
          .page-content :global(.page-header) + :global(.filters-section),
          .page-content :global(.page-header) + :global(.tabs-wrapper),
          .page-content :global(.page-header) + :global(.filter-bar),
          .page-content :global(.page-header) + :global(.toolbar) {
            padding: 0 1rem;
          }

          .page-content :global(.page-header) + :global(.card),
          .page-content :global(.page-header) + :global(.dash-grid),
          .page-content :global(.page-header) + :global(.team-grid),
          .page-content :global(.page-header) + :global(.tasks-grid),
          .page-content :global(.page-header) + :global(.companies-grid),
          .page-content :global(.page-header) + :global(.products-grid),
          .page-content :global(.page-header) + :global(.table-wrapper),
          .page-content :global(.page-header) + :global(.empty-wrapper),
          .page-content :global(.page-header) + :global(.chart-card),
          .page-content :global(.page-header) + :global(.calendar-wrapper),
          .page-content :global(.page-header) + :global(.deals-container),
          .page-content :global(.page-header) + :global(.lead-detail),
          .page-content :global(.page-header) + :global(.detail-grid),
          .page-content :global(.page-header) + :global(.kanban-wrapper) {
            padding: 0 1rem 1rem;
          }

          .page-content :global(.page-header) + :global(.kpi-grid) {
            padding: 0 1rem;
          }

          .page-content :global(.page-header) + :global(.kpi-grid) + * {
            padding: 0 1rem;
          }

          .page-content :global(.card) {
            margin: 0 1rem 1rem;
          }

          .page-content :global(.dash-grid) {
            padding: 0 1rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .topbar {
            padding: 0.4rem 0.75rem;
            min-height: 56px;
          }

          .topbar-title {
            font-size: 0.85rem;
          }

          .profile-btn {
            padding: 0.15rem 0.3rem;
          }

          .profile-avatar {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
          }

          .notifications-btn {
            width: 32px;
            height: 32px;
          }

          .search-toggle {
            padding: 0.2rem 0.4rem;
          }

          .search-modal {
            margin: 0 0.5rem;
          }

          .search-modal-input {
            font-size: 0.85rem;
          }

          .profile-dropdown {
            right: -1rem;
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}