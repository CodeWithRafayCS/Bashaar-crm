"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contact-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Content */}
      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Get in Touch</span>
          </div>
          <h1 className="page-title">
            Let's <span className="title-highlight">Connect</span>
          </h1>
          <p className="page-subtitle">
            Have questions about Bashaar AI CRM? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3 className="info-title">Visit Us</h3>
              <p className="info-text">Dubai, United Arab Emirates</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3 className="info-title">Email Us</h3>
              <p className="info-text">hello@bashar.ai</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3 className="info-title">Call Us</h3>
              <p className="info-text">+971 50 123 4567</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕐</div>
              <h3 className="info-title">Working Hours</h3>
              <p className="info-text">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2 className="form-title">Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell us about your project..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Send Message
                <span className="button-arrow">→</span>
              </button>

              {submitted && (
                <div className="success-message">
                  ✅ Thank you! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
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
        .contact-page {
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
          max-width: 1000px;
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
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Contact Grid */
        .contact-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        /* Contact Info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s;
        }

        .info-card:hover {
          transform: translateX(4px);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .info-icon {
          font-size: 1.5rem;
          margin-bottom: 0.2rem;
        }

        .info-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.2rem 0;
        }

        .info-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        /* Contact Form */
        .contact-form-wrapper {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .form-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 1.25rem 0;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .form-label {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-textarea {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
          resize: vertical;
          min-height: 100px;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.15);
        }

        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1.5rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border: none;
          border-radius: 8px;
          color: #0a0a0a;
          font-weight: 600;
          font-size: 0.9rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 0.5rem;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3);
        }

        .button-arrow {
          transition: transform 0.3s;
        }

        .submit-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .success-message {
          padding: 0.6rem 1rem;
          background: rgba(0, 200, 83, 0.08);
          border: 1px solid rgba(0, 200, 83, 0.1);
          border-radius: 8px;
          color: #00c853;
          font-size: 0.85rem;
          text-align: center;
          animation: fadeInUp 0.4s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-info {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .contact-info {
            grid-template-columns: 1fr 1fr;
          }

          .contact-form-wrapper {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.6rem;
          }

          .contact-info {
            grid-template-columns: 1fr;
          }

          .contact-form-wrapper {
            padding: 1rem;
          }

          .content-wrapper {
            gap: 1.5rem;
          }

          .info-card {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}