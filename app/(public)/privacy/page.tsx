"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Content */}
      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Privacy Policy</span>
          </div>
          <h1 className="page-title">
            Your <span className="title-highlight">Privacy</span> Matters
          </h1>
          <p className="page-subtitle">
            We are committed to protecting your personal information and being transparent about how we use it.
          </p>
          <div className="last-updated">
            Last Updated: <span className="update-date">July 24, 2026</span>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="privacy-content">
          {/* Section 1 */}
          <div className="privacy-section">
            <div className="section-icon">🔒</div>
            <div className="section-body">
              <h2 className="section-title">Information We Collect</h2>
              <p className="section-text">
                We collect only the business contact information required for legitimate sales operations. 
                This includes:
              </p>
              <ul className="section-list">
                <li>Name and business email address</li>
                <li>Company name and role</li>
                <li>Phone number for business communication</li>
                <li>Sales and deal-related information</li>
                <li>Communication history within the CRM</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="privacy-section">
            <div className="section-icon">📊</div>
            <div className="section-body">
              <h2 className="section-title">How We Use Your Information</h2>
              <p className="section-text">
                Your information helps us provide, improve, and personalize our CRM services:
              </p>
              <ul className="section-list">
                <li>Manage leads, deals, and sales pipelines</li>
                <li>Track activities and follow-ups</li>
                <li>Generate reports and analytics</li>
                <li>Communicate about your account and updates</li>
                <li>Improve our platform and user experience</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="privacy-section">
            <div className="section-icon">🤖</div>
            <div className="section-body">
              <h2 className="section-title">AI & Data Usage</h2>
              <p className="section-text">
                We use AI to enhance your experience while maintaining strict data controls:
              </p>
              <ul className="section-list">
                <li>AI suggestions are always reviewed and approved by users</li>
                <li>Never automate unsolicited bulk messaging</li>
                <li>No data scraping without explicit consent</li>
                <li>AI features are optional and can be disabled</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="privacy-section">
            <div className="section-icon">🔐</div>
            <div className="section-body">
              <h2 className="section-title">Data Security</h2>
              <p className="section-text">
                We take data security seriously with industry-standard measures:
              </p>
              <ul className="section-list">
                <li>Encrypted data storage and transmission</li>
                <li>Row-level security for data access control</li>
                <li>Regular security audits and backups</li>
                <li>Role-based access permissions</li>
                <li>Secure authentication and session management</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="privacy-section">
            <div className="section-icon">🤝</div>
            <div className="section-body">
              <h2 className="section-title">Data Sharing</h2>
              <p className="section-text">
                We do not sell or rent your personal information. We share data only when:
              </p>
              <ul className="section-list">
                <li>You provide explicit consent</li>
                <li>Required by law or legal process</li>
                <li>With trusted service providers who maintain similar privacy standards</li>
                <li>To protect the rights, property, or safety of Bashaar AI and its users</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="privacy-section">
            <div className="section-icon">📋</div>
            <div className="section-body">
              <h2 className="section-title">Your Rights</h2>
              <p className="section-text">
                You have control over your personal data with these rights:
              </p>
              <ul className="section-list">
                <li>Access and view your personal data</li>
                <li>Update or correct your information</li>
                <li>Request data export or deletion</li>
                <li>Withdraw consent at any time</li>
                <li>Opt-out of non-essential communications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact for Privacy */}
        <div className="contact-privacy">
          <h3 className="contact-title">Privacy Questions?</h3>
          <p className="contact-text">
            If you have any questions about our privacy practices, please contact us.
          </p>
          <Link href="/contact" className="contact-button">
            Contact Us
            <span className="contact-arrow">→</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <p className="footer-text">
            Bashaar AI CRM — One source of truth for your sales.
          </p>
          <div className="footer-links">
            <Link href="/" className="footer-link">Home</Link>
            <span className="footer-divider">·</span>
            <Link href="/about" className="footer-link">About</Link>
            <span className="footer-divider">·</span>
            <Link href="/contact" className="footer-link">Contact</Link>
            <span className="footer-divider">·</span>
            <Link href="/privacy" className="footer-link">Privacy</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .privacy-page {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
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
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.04) 0%, transparent 70%);
          top: -10%;
          right: -10%;
          animation: float 20s ease-in-out infinite;
        }

        .page-glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.02) 0%, transparent 70%);
          bottom: -10%;
          left: -10%;
          animation: float 20s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Header Section */
        .header-section {
          text-align: center;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 20px;
          padding: 0.2rem 0.8rem 0.2rem 0.5rem;
          margin-bottom: 1rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f4c542;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .badge-text {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .page-title {
          font-size: 2.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
        }

        .title-highlight {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.4);
          max-width: 600px;
          margin: 0 auto 0.5rem;
          line-height: 1.6;
        }

        .last-updated {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .update-date {
          color: rgba(255, 255, 255, 0.3);
        }

        /* Privacy Content */
        .privacy-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .privacy-section {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s;
        }

        .privacy-section:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(244, 197, 66, 0.04);
        }

        .section-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .section-body {
          flex: 1;
        }

        .section-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.3rem 0;
        }

        .section-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0 0 0.3rem 0;
          line-height: 1.6;
        }

        .section-list {
          margin: 0;
          padding-left: 1.25rem;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          line-height: 1.8;
        }

        .section-list li {
          list-style-type: disc;
        }

        /* Contact for Privacy */
        .contact-privacy {
          text-align: center;
          padding: 1.5rem;
          background: rgba(244, 197, 66, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(244, 197, 66, 0.06);
        }

        .contact-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.3rem 0;
        }

        .contact-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0 0 1rem 0;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.3s;
        }

        .contact-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3);
        }

        .contact-arrow {
          transition: transform 0.3s;
        }

        .contact-button:hover .contact-arrow {
          transform: translateX(4px);
        }

        /* Footer */
        .footer-section {
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .footer-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.15);
          margin: 0 0 0.5rem 0;
        }

        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .footer-link {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-link:hover {
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-divider {
          color: rgba(255, 255, 255, 0.05);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .privacy-section {
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
          }

          .section-icon {
            font-size: 1.3rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.6rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }

          .privacy-section {
            padding: 0.75rem;
          }

          .section-title {
            font-size: 0.9rem;
          }

          .section-text {
            font-size: 0.8rem;
          }

          .section-list {
            font-size: 0.75rem;
          }

          .content-wrapper {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}