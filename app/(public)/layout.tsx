"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="public-layout">
      {/* Top Navigation */}
      <header className="public-header">
        <div className="header-container">
          <Link href="/" className="brand-link">
            <div className="brand-icon">
              <span className="brand-mark">B</span>
            </div>
            <div className="brand-text">
              Bashaar <span className="brand-highlight">AI</span>
            </div>
          </Link>

          <nav className="public-nav">
            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`nav-link ${isActive("/about") ? "active" : ""}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className={`nav-link ${isActive("/privacy") ? "active" : ""}`}
            >
              Privacy
            </Link>
            <Link href="/login" className="nav-cta">
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => {
              const nav = document.querySelector(".public-nav");
              nav?.classList.toggle("open");
            }}
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="public-main">
        {children}
      </main>

      <style jsx>{`
        .public-layout {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
        }

        /* ===== Header ===== */
        .public-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0 1.5rem;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          height: 70px;
        }

        /* Brand */
        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          transition: opacity 0.3s;
          flex-shrink: 0;
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
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.2);
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
        }

        .brand-highlight {
          color: #f4c542;
        }

        /* Navigation */
        .public-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-link {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .nav-link.active {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.06);
        }

        .nav-cta {
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 6px;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.3s;
          margin-left: 0.25rem;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.25);
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
        }

        /* ===== Main Content ===== */
        .public-main {
          flex: 1;
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .public-header {
            padding: 0 1rem;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .public-nav {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            flex-direction: column;
            padding: 0.5rem 1rem 1rem;
            gap: 0.25rem;
            transform: translateY(-10px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .public-nav.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }

          .nav-link {
            width: 100%;
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }

          .nav-cta {
            width: 100%;
            text-align: center;
            padding: 0.5rem;
            margin-left: 0;
            margin-top: 0.25rem;
          }

          .brand-text {
            font-size: 1rem;
          }

          .brand-icon {
            width: 32px;
            height: 32px;
          }

          .brand-mark {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .public-header {
            padding: 0 0.75rem;
          }

          .brand-text {
            font-size: 0.9rem;
          }

          .brand-icon {
            width: 28px;
            height: 28px;
          }

          .brand-mark {
            font-size: 0.9rem;
          }

          .header-container {
            height: 60px;
          }

          .public-nav {
            top: 60px;
          }
        }
      `}</style>
    </div>
  );
}