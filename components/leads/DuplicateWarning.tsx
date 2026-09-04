"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { 
  AlertTriangle, 
  X, 
  ExternalLink, 
  Check, 
  Users,
  Phone,
  Mail,
  Building2,
  MapPin
} from "lucide-react";
import { Button } from "@/components/common/Button";

interface DuplicateWarningProps {
  duplicates: Lead[];
  onIgnore?: () => void;
  onView?: (id: string) => void;
  onMerge?: (primaryId: string, duplicateId: string) => void;
  className?: string;
  compact?: boolean;
}

export function DuplicateWarning({
  duplicates,
  onIgnore,
  onView,
  onMerge,
  className = "",
  compact = false,
}: DuplicateWarningProps) {
  const [dismissed, setDismissed] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(
    duplicates.length > 0 ? duplicates[0].id : null
  );
  const [selectedDuplicate, setSelectedDuplicate] = useState<string | null>(
    duplicates.length > 1 ? duplicates[1].id : null
  );

  if (duplicates.length === 0 || dismissed) return null;

  const primary = duplicates.find((d) => d.id === selectedPrimary);
  const duplicate = duplicates.find((d) => d.id === selectedDuplicate);

  const handleIgnore = () => {
    setDismissed(true);
    onIgnore?.();
  };

  const handleMerge = () => {
    if (selectedPrimary && selectedDuplicate) {
      onMerge?.(selectedPrimary, selectedDuplicate);
    }
  };

  return (
    <div className={`duplicate-warning ${compact ? "compact" : ""} ${className}`}>
      <div className="warning-header">
        <div className="warning-left">
          <AlertTriangle className="warning-icon" />
          <div>
            <h4 className="warning-title">Potential Duplicate Leads Found</h4>
            <p className="warning-description">
              We found {duplicates.length} leads that may be duplicates based on phone number and company name.
            </p>
          </div>
        </div>
        <div className="warning-actions">
          <button className="dismiss-btn" onClick={handleIgnore} aria-label="Dismiss warning">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="warning-body">
        <div className="duplicate-grid">
          {/* Primary Lead */}
          <div className="lead-card primary">
            <div className="card-header">
              <span className="card-badge primary">Primary</span>
              {primary && (
                <Link href={`/leads/${primary.id}`} className="view-link">
                  View <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            {primary && (
              <div className="card-body">
                <h5 className="lead-name">{primary.name}</h5>
                <div className="lead-details">
                  <span className="detail-item">
                    <Building2 className="detail-icon" />
                    {primary.company}
                  </span>
                  <span className="detail-item">
                    <Phone className="detail-icon" />
                    {primary.phone || "No phone"}
                  </span>
                  <span className="detail-item">
                    <Mail className="detail-icon" />
                    {primary.email || "No email"}
                  </span>
                  <span className="detail-item">
                    <MapPin className="detail-icon" />
                    {primary.city || "No location"}
                  </span>
                  <span className="detail-item">
                    <Users className="detail-icon" />
                    {primary.stage}
                  </span>
                </div>
                <div className="lead-meta">
                  <span className="meta-item">
                    Value: {formatCurrency(primary.value)}
                  </span>
                  <span className="meta-item">
                    Created: {formatDate(primary.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Merge Arrow */}
          <div className="merge-arrow">
            <div className="arrow-line" />
            <div className="arrow-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="arrow-line" />
          </div>

          {/* Duplicate Lead */}
          <div className="lead-card duplicate">
            <div className="card-header">
              <span className="card-badge duplicate">Duplicate</span>
              {duplicate && (
                <Link href={`/leads/${duplicate.id}`} className="view-link">
                  View <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
            {duplicate && (
              <div className="card-body">
                <h5 className="lead-name">{duplicate.name}</h5>
                <div className="lead-details">
                  <span className="detail-item">
                    <Building2 className="detail-icon" />
                    {duplicate.company}
                  </span>
                  <span className="detail-item">
                    <Phone className="detail-icon" />
                    {duplicate.phone || "No phone"}
                  </span>
                  <span className="detail-item">
                    <Mail className="detail-icon" />
                    {duplicate.email || "No email"}
                  </span>
                  <span className="detail-item">
                    <MapPin className="detail-icon" />
                    {duplicate.city || "No location"}
                  </span>
                  <span className="detail-item">
                    <Users className="detail-icon" />
                    {duplicate.stage}
                  </span>
                </div>
                <div className="lead-meta">
                  <span className="meta-item">
                    Value: {formatCurrency(duplicate.value)}
                  </span>
                  <span className="meta-item">
                    Created: {formatDate(duplicate.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="warning-footer">
          <div className="footer-left">
            <label className="merge-label">
              <input
                type="checkbox"
                checked={!!selectedPrimary && !!selectedDuplicate}
                onChange={() => {
                  if (!selectedPrimary && duplicates.length > 0) {
                    setSelectedPrimary(duplicates[0].id);
                  }
                  if (!selectedDuplicate && duplicates.length > 1) {
                    setSelectedDuplicate(duplicates[1].id);
                  }
                }}
              />
              <span>Merge into one lead</span>
            </label>
          </div>
          <div className="footer-actions">
            <Button type="button" variant="ghost" onClick={handleIgnore}>
              Ignore
            </Button>
            <Button 
              type="button" 
              variant="gold" 
              onClick={handleMerge}
              disabled={!selectedPrimary || !selectedDuplicate}
            >
              <Check className="w-4 h-4" />
              Merge & Continue
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .duplicate-warning {
          background: rgba(255, 193, 7, 0.04);
          border: 1px solid rgba(255, 193, 7, 0.08);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .duplicate-warning.compact .warning-body {
          padding: 0.5rem 1rem;
        }

        .duplicate-warning.compact .lead-card {
          padding: 0.5rem;
        }

        .duplicate-warning.compact .lead-details {
          gap: 0.2rem;
        }

        .duplicate-warning.compact .detail-item {
          font-size: 0.7rem;
        }

        /* Header */
        .warning-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 193, 7, 0.06);
        }

        .warning-left {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .warning-icon {
          width: 20px;
          height: 20px;
          color: #ffc107;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .warning-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .warning-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .dismiss-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        /* Body */
        .warning-body {
          padding: 1rem;
        }

        .duplicate-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 1rem;
          align-items: stretch;
          margin-bottom: 1rem;
        }

        /* Lead Cards */
        .lead-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem;
          transition: all 0.3s;
        }

        .lead-card.primary {
          border-color: rgba(0, 200, 83, 0.08);
          background: rgba(0, 200, 83, 0.02);
        }

        .lead-card.duplicate {
          border-color: rgba(255, 193, 7, 0.06);
          background: rgba(255, 193, 7, 0.02);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .card-badge {
          padding: 0.05rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .card-badge.primary {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.08);
        }

        .card-badge.duplicate {
          background: rgba(255, 193, 7, 0.06);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.08);
        }

        .view-link {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }

        .view-link:hover {
          color: #f4c542;
        }

        .lead-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.3rem 0;
        }

        .lead-details {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .detail-icon {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
        }

        .lead-meta {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .meta-item {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Merge Arrow */
        .merge-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 0.25rem;
        }

        .arrow-line {
          flex: 1;
          width: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .arrow-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.08);
          color: rgba(244, 197, 66, 0.3);
        }

        /* Footer */
        .warning-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .footer-left {
          display: flex;
          align-items: center;
        }

        .merge-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
        }

        .merge-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        .footer-actions {
          display: flex;
          gap: 0.5rem;
        }

        .footer-actions :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.4rem 0.8rem !important;
          font-size: 0.8rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .footer-actions :global(.btn-ghost):hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .footer-actions :global(.btn-gold) {
          padding: 0.4rem 1rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.8rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.3rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .footer-actions :global(.btn-gold):hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .footer-actions :global(.btn-gold):disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .duplicate-grid {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .merge-arrow {
            flex-direction: row;
            padding: 0.25rem 0;
          }

          .arrow-line {
            width: 100%;
            height: 2px;
            flex: 1;
          }

          .arrow-icon-wrapper {
            width: 28px;
            height: 28px;
          }

          .arrow-icon-wrapper svg {
            width: 16px;
            height: 16px;
          }

          .warning-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .footer-actions {
            flex-direction: column;
          }

          .footer-actions :global(.btn-ghost),
          .footer-actions :global(.btn-gold) {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .warning-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.3rem;
          }

          .warning-left {
            flex-direction: column;
            align-items: flex-start;
          }

          .warning-actions {
            align-self: flex-end;
          }

          .warning-title {
            font-size: 0.8rem;
          }

          .warning-description {
            font-size: 0.7rem;
          }

          .lead-name {
            font-size: 0.8rem;
          }

          .detail-item {
            font-size: 0.65rem;
          }

          .lead-card {
            padding: 0.5rem;
          }

          .lead-meta {
            flex-direction: column;
            gap: 0.1rem;
          }
        }
      `}</style>
    </div>
  );
}