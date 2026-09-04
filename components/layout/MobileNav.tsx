"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Users,
  Building2,
  LayoutDashboard,
  DollarSign,
  CheckSquare,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Search,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface MobileNavProps {
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export function MobileNav({ className = "" }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, pushToast } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="nav-icon" />,
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

  const handleSearch = () => {
    setIsSearchOpen(true);
    // Implement search logic here
    pushToast("info", "Search coming soon");
  };

  return (
    <>
      {/* Mobile Nav Bar */}
      <div className={`mobile-nav ${className}`}>
        <div className="mobile-nav-inner">
          {/* Brand */}
          <Link href="/" className="mobile-brand">
            <div className="brand-icon">
              <span className="brand-mark">B</span>
            </div>
            <span className="brand-text">
              Bashaar <span className="brand-highlight">AI</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="mobile-actions">
            <button
              className="mobile-search-btn"
              onClick={handleSearch}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${isOpen ? "open" : ""}`}>
        {/* User Profile */}
        {user && (
          <div className="drawer-user">
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
        <nav className="drawer-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`drawer-item ${isActive(item.href) ? "active" : ""}`}
            >
              <span className="drawer-icon">{item.icon}</span>
              <span className="drawer-label">{item.label}</span>
              {item.badge && (
                <span className="drawer-badge">{item.badge}</span>
              )}
              {isActive(item.href) && (
                <ChevronRight className="drawer-chevron" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="drawer-footer">
          <button className="drawer-logout" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
          <div className="drawer-version">v1.0.0</div>
        </div>
      </div>

      <style jsx>{`
        /* ===== Mobile Nav Bar ===== */
        .mobile-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          display: none;
        }

        @media (max-width: 767px) {
          .mobile-nav {
            display: block;
          }
        }

        .mobile-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Brand */
        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        .brand-mark {
          font-size: 1rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.5px;
        }

        .brand-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brand-highlight {
          color: #f4c542;
        }

        /* Actions */
        .mobile-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .mobile-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .mobile-search-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .mobile-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        /* ===== Mobile Overlay ===== */
        .mobile-overlay {
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ===== Mobile Drawer ===== */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 320px;
          max-width: 85vw;
          background: rgba(16, 16, 16, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.04);
          z-index: 1000;
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        /* User Profile */
        .drawer-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .user-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .user-role {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Navigation */
        .drawer-nav {
          flex: 1;
          padding: 0.5rem 0.75rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .drawer-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .drawer-item:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .drawer-item.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .drawer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.2);
          transition: color 0.3s;
        }

        .drawer-item.active .drawer-icon {
          color: #f4c542;
        }

        .drawer-label {
          flex: 1;
        }

        .drawer-badge {
          padding: 0.05rem 0.4rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          color: #f4c542;
        }

        .drawer-chevron {
          width: 16px;
          height: 16px;
          color: rgba(244, 197, 66, 0.3);
          flex-shrink: 0;
        }

        /* Footer */
        .drawer-footer {
          padding: 0.75rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .drawer-logout {
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

        .drawer-logout:hover {
          color: rgba(255, 68, 68, 0.7);
          background: rgba(255, 68, 68, 0.06);
        }

        .drawer-version {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.08);
          text-align: center;
          letter-spacing: 0.5px;
        }

        /* Scrollbar */
        .drawer-nav::-webkit-scrollbar {
          width: 3px;
        }

        .drawer-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-nav::-webkit-scrollbar-thumb {
          background: rgba(244, 197, 66, 0.15);
          border-radius: 2px;
        }

        /* ===== Responsive ===== */
        @media (max-width: 480px) {
          .mobile-nav-inner {
            padding: 0.4rem 0.75rem;
          }

          .brand-text {
            font-size: 0.85rem;
          }

          .brand-icon {
            width: 28px;
            height: 28px;
          }

          .brand-mark {
            font-size: 0.85rem;
          }

          .mobile-search-btn,
          .mobile-menu-btn {
            width: 36px;
            height: 36px;
          }

          .mobile-search-btn svg,
          .mobile-menu-btn svg {
            width: 20px;
            height: 20px;
          }

          .mobile-drawer {
            width: 280px;
          }

          .drawer-user {
            padding: 0.75rem 1rem;
          }

          .user-avatar {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }

          .user-name {
            font-size: 0.85rem;
          }

          .drawer-item {
            padding: 0.5rem 0.6rem;
            font-size: 0.85rem;
          }

          .drawer-footer {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </>
  );
}