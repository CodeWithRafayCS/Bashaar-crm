"use client";

import Link from "next/link";
import { Heart, Github, Twitter, Linkedin, Mail, Globe } from "lucide-react";

interface FooterProps {
  className?: string;
  compact?: boolean;
  showSocial?: boolean;
  showLinks?: boolean;
}

export function Footer({
  className = "",
  compact = false,
  showSocial = true,
  showLinks = true,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${compact ? "compact" : ""} ${className}`}>
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="brand-icon">
            <span className="brand-mark">B</span>
          </div>
          <div className="brand-text">
            Bashaar <span className="brand-highlight">AI</span>
          </div>
          <p className="brand-tagline">One source of truth for your sales.</p>
        </div>

        {/* Links */}
        {showLinks && (
          <div className="footer-links">
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/help" className="footer-link">Help</Link>
          </div>
        )}

        {/* Social */}
        {showSocial && (
          <div className="footer-social">
            <a
              href="https://twitter.com/basharai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Twitter"
            >
              <Twitter className="social-icon" />
            </a>
            <a
              href="https://linkedin.com/company/basharai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="LinkedIn"
            >
              <Linkedin className="social-icon" />
            </a>
            <a
              href="https://github.com/basharai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <Github className="social-icon" />
            </a>
            <a
              href="mailto:hello@bashar.ai"
              className="social-link"
              aria-label="Email"
            >
              <Mail className="social-icon" />
            </a>
            <a
              href="https://bashar.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Website"
            >
              <Globe className="social-icon" />
            </a>
          </div>
        )}

        {/* Copyright */}
        <div className="footer-copyright">
          <span>
            © {currentYear} Bashaar AI. All rights reserved.
          </span>
          <span className="footer-made-with">
            Made with <Heart className="heart-icon" /> by the Bashaar team
          </span>
        </div>
      </div>

      <style jsx>{`
        .footer {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding: 1.5rem 1.5rem;
          margin-top: auto;
        }

        .footer.compact {
          padding: 0.75rem 1.5rem;
        }

        .footer.compact .footer-container {
          gap: 0.5rem;
        }

        .footer.compact .footer-brand {
          flex-direction: row;
          gap: 0.5rem;
        }

        .footer.compact .brand-tagline {
          display: none;
        }

        .footer.compact .footer-links {
          gap: 0.5rem;
        }

        .footer.compact .footer-link {
          font-size: 0.7rem;
        }

        .footer.compact .footer-social {
          gap: 0.3rem;
        }

        .footer.compact .social-link {
          width: 28px;
          height: 28px;
        }

        .footer.compact .social-icon {
          width: 14px;
          height: 14px;
        }

        .footer.compact .footer-copyright {
          font-size: 0.6rem;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Brand */
        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
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
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .brand-highlight {
          color: #f4c542;
        }

        .brand-tagline {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0;
        }

        /* Links */
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }

        .footer-link {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
          text-decoration: none;
          transition: all 0.3s;
        }

        .footer-link:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        /* Social */
        .footer-social {
          display: flex;
          gap: 0.4rem;
          justify-content: center;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          transition: all 0.3s;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .social-icon {
          width: 16px;
          height: 16px;
        }

        /* Copyright */
        .footer-copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
        }

        .footer-made-with {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .heart-icon {
          width: 12px;
          height: 12px;
          color: #ff4444;
          fill: #ff4444;
          animation: pulse-heart 1.5s ease-in-out infinite;
        }

        @keyframes pulse-heart {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer {
            padding: 1rem 1rem;
          }

          .footer.compact {
            padding: 0.5rem 1rem;
          }

          .footer-links {
            gap: 0.5rem;
          }

          .footer-link {
            font-size: 0.7rem;
          }

          .footer-copyright {
            flex-direction: column;
            gap: 0.2rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 0.75rem 0.75rem;
          }

          .footer.compact {
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

          .social-link {
            width: 28px;
            height: 28px;
          }

          .social-icon {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </footer>
  );
}