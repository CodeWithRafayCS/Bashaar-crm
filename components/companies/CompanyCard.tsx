"use client";

import { useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { formatCurrency, formatPhone } from "@/lib/utils/format";
import { Building2, Phone, Mail, MapPin, Globe, Star, Users, TrendingUp, ArrowRight } from "lucide-react";

interface CompanyCardProps {
  company: Company;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onViewDetails?: (id: string) => void;
  compact?: boolean;
}

export function CompanyCard({
  company,
  onSelect,
  isSelected = false,
  onViewDetails,
  compact = false,
}: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(company.id);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(company.id);
  };

  return (
    <div
      className={`company-card ${isSelected ? "selected" : ""} ${compact ? "compact" : ""} ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="card-checkbox" onClick={handleSelect}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="checkbox-input"
          />
        </div>
      )}

      {/* Header */}
      <div className="card-header">
        <div className="company-avatar">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="company-logo"
            />
          ) : (
            <span className="avatar-initials">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="company-info">
          <h3 className="company-name">{company.name}</h3>
          {company.category && (
            <span className={`category-badge ${company.category.toLowerCase()}`}>
              {company.category}
            </span>
          )}
          {company.leadCount !== undefined && (
            <span className="lead-count">
              <Users className="w-3 h-3" />
              {company.leadCount} leads
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {company.phone && (
          <div className="company-detail">
            <Phone className="detail-icon" />
            <span>{formatPhone(company.phone)}</span>
          </div>
        )}
        {company.email && (
          <div className="company-detail">
            <Mail className="detail-icon" />
            <span>{company.email}</span>
          </div>
        )}
        {company.address && (
          <div className="company-detail">
            <MapPin className="detail-icon" />
            <span>{company.address}</span>
          </div>
        )}
        {company.website && (
          <div className="company-detail">
            <Globe className="detail-icon" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="website-link"
            >
              {company.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="company-stats">
          {company.totalDealValue !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Total Value</span>
              <span className="stat-value gold">
                {formatCurrency(company.totalDealValue)}
              </span>
            </div>
          )}
          {company.googleRating !== undefined && (
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">
                <Star className="star-icon" />
                {company.googleRating} ({company.googleReviews || 0})
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/companies/${company.id}`}
          className="view-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View Details</span>
          <ArrowRight className={`arrow-icon ${isHovered ? "visible" : ""}`} />
        </Link>
      </div>

      <style jsx>{`
        .company-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .company-card:hover {
          transform: translateY(-4px);
          border-color: rgba(244, 197, 66, 0.12);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .company-card.selected {
          border-color: rgba(244, 197, 66, 0.3);
          background: rgba(244, 197, 66, 0.04);
        }

        .company-card.compact {
          padding: 0.75rem 1rem;
        }

        .company-card.compact .card-body {
          display: none;
        }

        .company-card.compact .card-footer {
          border-top: none;
          padding-top: 0.5rem;
        }

        /* Checkbox */
        .card-checkbox {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          z-index: 2;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        /* Header */
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .company-avatar {
          flex-shrink: 0;
        }

        .company-avatar .company-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .company-info {
          flex: 1;
          min-width: 0;
        }

        .company-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.2rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-badge {
          display: inline-block;
          padding: 0.05rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 500;
          margin-right: 0.3rem;
        }

        .category-badge.technology {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.12);
        }

        .category-badge.healthcare {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .category-badge.retail {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.12);
        }

        .category-badge.finance {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .category-badge.education {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.12);
        }

        .category-badge.other {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .lead-count {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.25);
        }

        /* Body */
        .card-body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0.5rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .company-detail {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .detail-icon {
          width: 14px;
          height: 14px;
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .website-link {
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
          font-size: 0.8rem;
        }

        .website-link:hover {
          color: #f4c542;
        }

        /* Footer */
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .company-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .stat-value.gold {
          color: #f4c542;
        }

        .star-icon {
          width: 12px;
          height: 12px;
          color: #f4c542;
          fill: #f4c542;
        }

        .view-link {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.4);
          text-decoration: none;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .view-link:hover {
          color: #f4c542;
        }

        .arrow-icon {
          width: 14px;
          height: 14px;
          transition: all 0.3s;
          opacity: 0;
          transform: translateX(-4px);
        }

        .arrow-icon.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .view-link:hover .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .company-card {
            padding: 1rem;
          }

          .company-name {
            font-size: 0.9rem;
          }

          .company-stats {
            gap: 0.5rem;
          }

          .stat-value {
            font-size: 0.75rem;
          }

          .view-link {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 480px) {
          .company-card {
            padding: 0.75rem;
          }

          .company-avatar .company-logo,
          .avatar-initials {
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
          }

          .company-name {
            font-size: 0.85rem;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.3rem;
          }

          .company-stats {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}