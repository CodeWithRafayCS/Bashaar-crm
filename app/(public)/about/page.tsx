"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Content */}
      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">About Us</span>
          </div>
          <h1 className="page-title">
            Building the Future
            <span className="title-highlight">of Sales</span>
          </h1>
          <p className="page-subtitle">
            Bashaar AI is a premium CRM platform designed to be the single source of truth for your sales operations.
          </p>
        </div>

        {/* Mission Card */}
        <div className="mission-card">
          <div className="mission-icon">🚀</div>
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            Build a reliable internal CRM that the team can use every day. 
            Version 1 must improve sales execution before adding advanced AI.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">4</div>
            <div className="stat-label">Weeks to MVP</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Data Centralization</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">30</div>
            <div className="stat-label">Minutes to Learn</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7</div>
            <div className="stat-label">Days to Adopt</div>
          </div>
        </div>

        {/* Core Values */}
        <div className="values-section">
          <h2 className="values-title">
            <span className="values-icon">💡</span>
            Core Principles
          </h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">📊</div>
              <h3 className="value-title">One Source of Truth</h3>
              <p className="value-description">
                No duplicate Excel sheets and no private lead lists. Everything lives in the CRM.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3 className="value-title">Next-Action Discipline</h3>
              <p className="value-description">
                A warm lead without a next action is treated as incomplete.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔄</div>
              <h3 className="value-title">Reusable by Design</h3>
              <p className="value-description">
                Every record belongs to an organization and project for maximum flexibility.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤖</div>
              <h3 className="value-title">Human-Controlled AI</h3>
              <p className="value-description">
                AI suggests; users approve before sending or changing records.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">📱</div>
              <h3 className="value-title">Mobile-First Forms</h3>
              <p className="value-description">
                Field staff must update the CRM from an Android browser.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3 className="value-title">Privacy First</h3>
              <p className="value-description">
                Only collect business contact information required for legitimate sales operations.
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-section">
          <h2 className="features-title">
            <span className="features-icon">⚡</span>
            Key Features
          </h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Lead capture and assignment</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Call, WhatsApp, meeting, and note tracking</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Deal stages, products, proposals, and payments</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Task management and follow-up reminders</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Dashboards and CSV export</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Audit log and settings</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <p className="cta-text">
            Ready to transform your sales process?
          </p>
          <Link href="/login" className="cta-button">
            Get Started
            <span className="cta-arrow">→</span>
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
        .about-page {
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
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
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
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Mission Card */
        .mission-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .mission-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .mission-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
        }

        .mission-text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.5);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.25rem;
          text-align: center;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-top: 0.2rem;
        }

        /* Values Section */
        .values-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .values-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1rem 0;
        }

        .values-icon {
          font-size: 1.4rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .value-card {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s;
        }

        .value-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(244, 197, 66, 0.06);
        }

        .value-icon {
          font-size: 1.4rem;
          margin-bottom: 0.3rem;
        }

        .value-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.3rem 0;
        }

        .value-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          line-height: 1.5;
          margin: 0;
        }

        /* Features Section */
        .features-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .features-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1rem 0;
        }

        .features-icon {
          font-size: 1.4rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          padding: 0.3rem 0;
        }

        .feature-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: rgba(244, 197, 66, 0.08);
          border-radius: 4px;
          color: #f4c542;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* CTA Section */
        .cta-section {
          text-align: center;
          padding: 1.5rem;
          background: rgba(244, 197, 66, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(244, 197, 66, 0.06);
        }

        .cta-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 1rem 0;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.5rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3);
        }

        .cta-arrow {
          transition: transform 0.3s;
        }

        .cta-button:hover .cta-arrow {
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

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .values-grid {
            grid-template-columns: 1fr 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .mission-card {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.6rem;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .stat-card {
            padding: 0.75rem;
          }

          .value-card {
            padding: 0.75rem;
          }

          .content-wrapper {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}