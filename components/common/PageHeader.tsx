"use client";

import { ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: boolean;
  breadcrumbItems?: { label: string; href?: string; icon?: ReactNode }[];
  className?: string;
  compact?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  icon,
  actions,
  breadcrumb = false,
  breadcrumbItems,
  className = "",
  compact = false,
}: PageHeaderProps) {
  return (
    <div className={`page-header-wrapper ${compact ? "compact" : ""} ${className}`}>
      {/* Breadcrumb */}
      {breadcrumb && (
        <div className="breadcrumb-wrapper">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      )}

      {/* Main Header */}
      <div className="page-header">
        <div className="header-left">
          {/* Badge */}
          {badge && (
            <div className="header-badge">
              <span className="badge-dot" />
              <span className="badge-text">{badge}</span>
            </div>
          )}

          {/* Title */}
          <div className="header-title-wrapper">
            {icon && <span className="header-icon">{icon}</span>}
            <h1 className="header-title">
              {title}
              {subtitle && (
                <span className="header-subtitle">{subtitle}</span>
              )}
            </h1>
          </div>

          {/* Subtitle as description */}
          {subtitle && (
            <p className="header-description">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="header-actions">
            {actions}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-header-wrapper {
          width: 100%;
        }

        .page-header-wrapper.compact .page-header {
          padding: 0 0 0.75rem 0;
        }

        /* Breadcrumb */
        .breadcrumb-wrapper {
          margin-bottom: 0.5rem;
        }

        /* Page Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0 0 1.25rem 0;
        }

        .header-left {
          flex: 1;
          min-width: 0;
        }

        /* Badge */
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 20px;
          padding: 0.15rem 0.8rem 0.15rem 0.5rem;
          margin-bottom: 0.5rem;
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
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        /* Title */
        .header-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .header-icon {
          font-size: 1.4rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .header-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.025em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .header-subtitle {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.2);
          margin: 0;
        }

        .header-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0.25rem 0 0 0;
          line-height: 1.5;
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        .header-actions :global(.btn-gold) {
          padding: 0.5rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .header-actions :global(.btn-gold):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .header-actions :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .header-actions :global(.btn-ghost):hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .header-actions :global(.btn-danger) {
          background: rgba(255, 68, 68, 0.06) !important;
          border: 1px solid rgba(255, 68, 68, 0.08) !important;
          border-radius: 8px !important;
          color: rgba(255, 68, 68, 0.5) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .header-actions :global(.btn-danger):hover {
          background: rgba(255, 68, 68, 0.1) !important;
          color: #ff4444 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .header-title {
            font-size: 1.4rem;
          }

          .header-subtitle {
            font-size: 0.85rem;
          }

          .header-description {
            font-size: 0.8rem;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions :global(.btn-gold),
          .header-actions :global(.btn-ghost),
          .header-actions :global(.btn-danger) {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 0 0 0.75rem 0;
          }

          .header-title {
            font-size: 1.2rem;
          }

          .header-icon {
            font-size: 1.2rem;
          }

          .header-badge {
            font-size: 0.6rem;
          }

          .header-actions {
            flex-direction: column;
          }

          .header-actions :global(.btn-gold),
          .header-actions :global(.btn-ghost),
          .header-actions :global(.btn-danger) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}