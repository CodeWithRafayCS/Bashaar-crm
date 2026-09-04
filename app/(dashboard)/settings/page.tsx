"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SETTINGS_TABS } from "@/lib/utils/constants";

export default function SettingsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to organization tab after a brief moment
    const timer = setTimeout(() => {
      router.push("/settings/organization");
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="settings-index-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      <div className="content-wrapper">
        {/* Logo / Brand */}
        <div className="brand-section">
          <div className="brand-icon">
            <span className="brand-mark">⚙️</span>
          </div>
          <h1 className="brand-title">Settings</h1>
          <p className="brand-subtitle">Redirecting you to the right place...</p>
        </div>

        {/* Loading Animation */}
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-ring" />
            <div className="spinner-ring" />
            <div className="spinner-ring" />
          </div>
          <p className="loading-text">Taking you to Organization Settings</p>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <p className="quick-links-label">Or jump directly to:</p>
          <div className="quick-links-grid">
            {SETTINGS_TABS.map((tab) => (
              <Link
                key={tab.slug}
                href={`/settings/${tab.slug}`}
                className="quick-link"
              >
                <span className="quick-link-icon">{tab.icon}</span>
                <span className="quick-link-label">{tab.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Manual Redirect */}
        <div className="manual-redirect">
          <p className="manual-text">
            If you're not redirected automatically,{" "}
            <Link href="/settings/organization" className="manual-link">
              click here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .settings-index-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
        }

        /* Background Glows */
        .page-glow-1,
        .page-glow-2 {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .page-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.06) 0%, transparent 70%);
          top: -10%;
          right: -10%;
          animation: float-glow 20s ease-in-out infinite;
        }

        .page-glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.03) 0%, transparent 70%);
          bottom: -10%;
          left: -10%;
          animation: float-glow 20s ease-in-out infinite reverse;
        }

        @keyframes float-glow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        /* Brand Section */
        .brand-section {
          text-align: center;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(-20px);
        }

        @keyframes fadeInDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 20px;
          margin-bottom: 1rem;
          box-shadow: 0 8px 40px rgba(244, 197, 66, 0.25);
        }

        .brand-mark {
          font-size: 2.4rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .brand-title {
          font-size: 2.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.5px;
        }

        .brand-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        /* Loading Container */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          width: 100%;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
          animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .spinner-ring:nth-child(1) {
          border-top-color: #f4c542;
          animation-delay: 0s;
        }

        .spinner-ring:nth-child(2) {
          border-right-color: rgba(244, 197, 66, 0.4);
          animation-delay: 0.2s;
        }

        .spinner-ring:nth-child(3) {
          border-bottom-color: rgba(244, 197, 66, 0.15);
          animation-delay: 0.4s;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
          animation: pulse-text 1.5s ease-in-out infinite;
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Quick Links */
        .quick-links {
          width: 100%;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .quick-links-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
          margin: 0 0 0.75rem 0;
        }

        .quick-links-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .quick-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.75rem 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .quick-link:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(244, 197, 66, 0.1);
          transform: translateY(-2px);
        }

        .quick-link-icon {
          font-size: 1.2rem;
        }

        .quick-link-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
          font-weight: 500;
          transition: color 0.3s;
        }

        .quick-link:hover .quick-link-label {
          color: rgba(255, 255, 255, 0.6);
        }

        /* Manual Redirect */
        .manual-redirect {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .manual-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.15);
          margin: 0;
        }

        .manual-link {
          color: #f4c542;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s;
        }

        .manual-link:hover {
          opacity: 0.7;
        }

        /* Progress Bar */
        .progress-bar {
          width: 100%;
          max-width: 400px;
          height: 2px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 2px;
          overflow: hidden;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f4c542, #d4a030);
          border-radius: 2px;
          animation: progress 1.2s ease-in-out forwards;
        }

        @keyframes progress {
          0% { width: 0%; }
          30% { width: 30%; }
          60% { width: 65%; }
          85% { width: 85%; }
          100% { width: 100%; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .brand-title {
            font-size: 2rem;
          }

          .brand-icon {
            width: 60px;
            height: 60px;
          }

          .brand-mark {
            font-size: 2rem;
          }

          .quick-links-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .loading-container {
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .brand-title {
            font-size: 1.6rem;
          }

          .brand-subtitle {
            font-size: 0.85rem;
          }

          .quick-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .loading-spinner {
            width: 48px;
            height: 48px;
          }

          .content-wrapper {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}