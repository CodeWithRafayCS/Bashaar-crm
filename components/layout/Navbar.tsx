"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  HelpCircle,
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
} from "lucide-react";

interface NavbarProps {
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
}

export function Navbar({
  className = "",
  showSearch = true,
  showNotifications = true,
  showProfile = true,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, pushToast } = useAppStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const handleLogout = async () => {
    await logout();
    pushToast("info", "Logged out successfully");
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Leads", href: "/leads", icon: <Users className="w-4 h-4" /> },
    { label: "Companies", href: "/companies", icon: <Building2 className="w-4 h-4" /> },
    { label: "Pipeline", href: "/pipeline", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Deals", href: "/deals", icon: <DollarSign className="w-4 h-4" /> },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare className="w-4 h-4" /> },
    { label: "Activities", href: "/activities", icon: <Activity className="w-4 h-4" /> },
    { label: "Reports", href: "/reports", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`navbar ${className}`}>
        <div className="navbar-container">
          {/* Left - Brand */}
          <div className="navbar-left">
            <Link href="/" className="navbar-brand">
              <div className="brand-icon">
                <span className="brand-mark">B</span>
              </div>
              <div className="brand-text">
                Bashaar <span className="brand-highlight">AI</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="navbar-right">
            {showSearch && (
              <button
                className="nav-action search-btn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="search-shortcut">
                  <span className="shortcut-key">⌘</span>
                  <span className="shortcut-key">K</span>
                </span>
              </button>
            )}

            {showNotifications && (
              <button className="nav-action notifications-btn" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="notification-dot" />
              </button>
            )}

            {showProfile && user && (
              <div className="profile-wrapper" ref={profileRef}>
                <button
                  className="profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Profile menu"
                >
                  <div className="profile-avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="profile-info">
                    <span className="profile-name">{user.name}</span>
                    <span className="profile-role">{user.role}</span>
                  </div>
                  <ChevronDown className={`profile-chevron ${isProfileOpen ? "open" : ""}`} />
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="dropdown-user">
                        <span className="dropdown-name">{user.name}</span>
                        <span className="dropdown-email">{user.email}</span>
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
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-inner">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="mobile-divider" />
              <Link href="/settings" className="mobile-link" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button className="mobile-logout" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

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
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 64px;
        }

        /* Left */
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          transition: opacity 0.3s;
          flex-shrink: 0;
        }

        .navbar-brand:hover {
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
        }

        .brand-highlight {
          color: #f4c542;
        }

        /* Navigation Links */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.25);
          text-decoration: none;
          transition: all 0.3s;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-link.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        @media (max-width: 1024px) {
          .navbar-links {
            display: none;
          }
        }

        /* Right */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-action {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .nav-action:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .search-btn {
          width: auto;
          padding: 0 0.8rem;
          gap: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.15);
        }

        .search-btn:hover {
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

        .notifications-btn {
          position: relative;
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

        /* Mobile Toggle */
        .mobile-toggle {
          display: none;
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

        .mobile-toggle:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 1024px) {
          .mobile-toggle {
            display: flex;
          }
        }

        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1.5rem 1rem;
          gap: 0.1rem;
        }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.35);
          text-decoration: none;
          transition: all 0.3s;
        }

        .mobile-link:hover {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .mobile-link.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.04);
          margin: 0.3rem 0;
        }

        .mobile-logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.25);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          width: 100%;
          text-align: left;
        }

        .mobile-logout:hover {
          color: rgba(255, 68, 68, 0.7);
          background: rgba(255, 68, 68, 0.06);
        }

        /* Search Modal */
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        /* Responsive */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0.5rem 1rem;
            min-height: 56px;
          }

          .brand-text {
            font-size: 0.95rem;
          }

          .brand-icon {
            width: 32px;
            height: 32px;
          }

          .brand-mark {
            font-size: 0.95rem;
          }

          .search-btn {
            padding: 0 0.6rem;
          }

          .search-shortcut {
            display: none;
          }

          .profile-btn {
            padding: 0.2rem 0.4rem;
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

          .mobile-menu-inner {
            padding: 0.5rem 1rem 1rem;
          }

          .search-modal {
            margin: 0 0.5rem;
          }

          .search-modal-input {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0.4rem 0.75rem;
            min-height: 50px;
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

          .nav-action {
            width: 32px;
            height: 32px;
          }

          .search-btn {
            width: auto;
            padding: 0 0.4rem;
          }

          .search-btn svg {
            width: 16px;
            height: 16px;
          }

          .mobile-toggle {
            width: 36px;
            height: 36px;
          }

          .mobile-toggle svg {
            width: 20px;
            height: 20px;
          }

          .profile-dropdown {
            right: -0.5rem;
            min-width: 200px;
          }

          .mobile-menu-inner {
            padding: 0.5rem 0.75rem 0.75rem;
          }

          .mobile-link {
            font-size: 0.85rem;
            padding: 0.4rem 0.6rem;
          }
        }
      `}</style>
    </>
  );
}