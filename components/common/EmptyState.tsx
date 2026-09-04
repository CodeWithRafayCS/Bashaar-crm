"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_ICON = (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <path d="M8 7h8" />
    <path d="M8 11h6" />
    <path d="M8 15h4" />
  </svg>
);

export function EmptyState({
  title,
  body,
  icon = DEFAULT_ICON,
  action,
  className = "",
  size = "md",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: "py-8 px-4",
      title: "text-base",
      body: "text-sm",
      icon: "w-12 h-12",
    },
    md: {
      container: "py-12 px-6",
      title: "text-lg",
      body: "text-base",
      icon: "w-16 h-16",
    },
    lg: {
      container: "py-16 px-8",
      title: "text-2xl",
      body: "text-lg",
      icon: "w-20 h-20",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`empty-state ${sizes.container} ${className}`}>
      <div className="empty-state-icon-wrapper">
        <div className={`empty-state-icon ${sizes.icon}`}>
          {icon}
        </div>
      </div>

      <div className="empty-state-content">
        <h3 className={`empty-state-title ${sizes.title}`}>
          {title}
        </h3>
        {body && (
          <p className={`empty-state-body ${sizes.body}`}>
            {body}
          </p>
        )}
        {action && (
          <div className="empty-state-action">
            {action}
          </div>
        )}
      </div>

      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          min-height: 200px;
          gap: 1rem;
          transition: all 0.3s;
        }

        .empty-state:hover {
          border-color: rgba(255, 255, 255, 0.06);
        }

        .empty-state-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .empty-state-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }

        .empty-state:hover .empty-state-icon {
          color: rgba(255, 255, 255, 0.08);
        }

        .empty-state-icon svg {
          width: 100%;
          height: 100%;
          stroke: currentColor;
        }

        .empty-state-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          max-width: 500px;
        }

        .empty-state-title {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .empty-state-body {
          color: rgba(255, 255, 255, 0.2);
          line-height: 1.6;
          margin: 0;
        }

        .empty-state-action {
          margin-top: 0.5rem;
        }

        .empty-state-action :global(.btn-gold) {
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
          text-decoration: none !important;
        }

        .empty-state-action :global(.btn-gold):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .empty-state-action :global(a.btn-gold) {
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
          text-decoration: none !important;
        }

        .empty-state-action :global(a.btn-gold):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .empty-state-action :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
          text-decoration: none !important;
        }

        .empty-state-action :global(.btn-ghost):hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .empty-state {
            padding: 1.5rem !important;
            min-height: 150px;
          }

          .empty-state-title {
            font-size: 1rem !important;
          }

          .empty-state-body {
            font-size: 0.85rem !important;
          }

          .empty-state-icon {
            width: 48px !important;
            height: 48px !important;
          }
        }

        @media (max-width: 480px) {
          .empty-state {
            padding: 1rem !important;
            min-height: 120px;
          }

          .empty-state-title {
            font-size: 0.9rem !important;
          }

          .empty-state-body {
            font-size: 0.75rem !important;
          }

          .empty-state-icon {
            width: 36px !important;
            height: 36px !important;
          }

          .empty-state-action :global(.btn-gold),
          .empty-state-action :global(a.btn-gold),
          .empty-state-action :global(.btn-ghost) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}