"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lead } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function LeadCard({
  lead,
  onSelect,
  isSelected = false,
  onView,
  onEdit,
  onDelete,
  compact = false,
  showActions = true,
}: LeadCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (onView) {
      onView(lead.id);
    }
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(lead.id);
  };

  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <div
      className={`lead-card ${isSelected ? "selected" : ""} ${compact ? "compact" : ""} ${isHovered ? "hovered" : ""}`}
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
        <div className="lead-avatar">
          <span className="avatar-initials">
            {lead.name.charAt(0).toUpperCase()}
          </span>
          {lead.stage && (
            <span className={`stage-indicator ${lead.stage.toLowerCase().replace(/\s/g, "-")}`} />
          )}
        </div>
        <div className="lead-info">
          <h3 className="lead-name">{lead.name}</h3>
          <div className="lead-company">
            <Building2 className="info-icon" />
            <span>{lead.company}</span>
          </div>
        </div>
        <div className="lead-actions">
          {showActions && (
            <div className="dropdown-wrapper">
              <button
                className="dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  {onView && (
                    <button onClick={() => { onView(lead.id); setShowMenu(false); }}>
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => { onEdit(lead.id); setShowMenu(false); }}>
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => { onDelete(lead.id); setShowMenu(false); }}
                      className="danger"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        {/* Contact Details */}
        <div className="contact-details">
          {lead.phone && (
            <div className="detail-item">
              <Phone className="detail-icon" />
              <span>{formatPhone(lead.phone)}</span>
            </div>
          )}
          {lead.email && (
            <div className="detail-item">
              <Mail className="detail-icon" />
              <span>{lead.email}</span>
            </div>
          )}
          {lead.address && (
            <div className="detail-item">
              <MapPin className="detail-icon" />
              <span>{lead.address}</span>
            </div>
          )}
          {lead.city && (
            <div className="detail-item">
              <MapPin className="detail-icon" />
              <span>{lead.city}, {lead.country || ""}</span>
            </div>
          )}
        </div>

        {/* Lead Details */}
        <div className="lead-details">
          <div className="detail-group">
            <div className="detail-item">
              <DollarSign className="detail-icon" />
              <span className="value">{formatCurrency(lead.value)}</span>
            </div>
            <div className="detail-item">
              <span className={`stage-badge ${lead.stage.toLowerCase().replace(/\s/g, "-")}`}>
                {lead.stage}
              </span>
            </div>
            <div className="detail-item">
              <span className={`priority-badge ${lead.priority?.toLowerCase() || "medium"}`}>
                {lead.priority || "Medium"}
              </span>
            </div>
          </div>
          <div className="detail-group">
            <div className="detail-item">
              <User className="detail-icon" />
              <span>{lead.ownerEmail}</span>
            </div>
            <div className="detail-item">
              <Calendar className="detail-icon" />
              <span>{formatDate(lead.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-left">
          {lead.followUpDate && (
            <span className={`follow-up ${isOverdue ? "overdue" : ""}`}>
              <Clock className="follow-icon" />
              {isOverdue ? "Overdue" : formatDate(lead.followUpDate)}
            </span>
          )}
          {lead.source && (
            <span className="source-tag">{lead.source}</span>
          )}
        </div>
        <Link
          href={`/leads/${lead.id}`}
          className="view-link"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View</span>
          <ChevronRight className={`arrow-icon ${isHovered ? "visible" : ""}`} />
        </Link>
      </div>

      <style jsx>{`
        .lead-card {
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

        .lead-card:hover {
          transform: translateY(-4px);
          border-color: rgba(244, 197, 66, 0.12);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .lead-card.selected {
          border-color: rgba(244, 197, 66, 0.3);
          background: rgba(244, 197, 66, 0.04);
        }

        .lead-card.compact {
          padding: 0.75rem 1rem;
        }

        .lead-card.compact .card-body {
          margin: 0.3rem 0;
        }

        .lead-card.compact .contact-details {
          gap: 0.15rem;
        }

        .lead-card.compact .detail-item {
          font-size: 0.7rem;
        }

        .lead-card.compact .lead-details {
          gap: 0.15rem;
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
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .lead-avatar {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .stage-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #0a0a0a;
        }

        .stage-indicator.new {
          background: #4285f4;
        }

        .stage-indicator.attempted {
          background: #9c27b0;
        }

        .stage-indicator.connected {
          background: #00c853;
        }

        .stage-indicator.interested {
          background: #ffc107;
        }

        .stage-indicator.meeting-scheduled {
          background: #f4c542;
        }

        .stage-indicator.proposal-sent {
          background: #ff6f00;
        }

        .stage-indicator.negotiation {
          background: #ff4444;
        }

        .stage-indicator.won {
          background: #00c853;
        }

        .stage-indicator.lost {
          background: #ff4444;
        }

        .lead-info {
          flex: 1;
          min-width: 0;
        }

        .lead-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.2rem 0;
        }

        .lead-company {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .info-icon {
          width: 14px;
          height: 14px;
        }

        .lead-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        /* Dropdown */
        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-trigger {
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
        }

        .dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          min-width: 150px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          z-index: 10;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          font-family: inherit;
        }

        .dropdown-menu button:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .dropdown-menu button.danger:hover {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.06);
        }

        .dropdown-menu button svg {
          width: 14px;
          height: 14px;
        }

        /* Body */
        .card-body {
          margin: 0.5rem 0;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 0.3rem;
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
          flex-shrink: 0;
        }

        .detail-item .value {
          color: #f4c542;
          font-weight: 600;
        }

        .lead-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .detail-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem 0.5rem;
          align-items: center;
        }

        .stage-badge {
          padding: 0.05rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 500;
        }

        .stage-badge.new {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.12);
        }

        .stage-badge.attempted {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.12);
        }

        .stage-badge.connected {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .stage-badge.interested {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.12);
        }

        .stage-badge.meeting-scheduled {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .stage-badge.proposal-sent {
          background: rgba(255, 111, 0, 0.1);
          color: #ff6f00;
          border: 1px solid rgba(255, 111, 0, 0.12);
        }

        .stage-badge.negotiation {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.12);
        }

        .stage-badge.won {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .stage-badge.lost {
          background: rgba(255, 68, 68, 0.12);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.15);
        }

        .priority-badge {
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          font-size: 0.55rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.high {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.08);
        }

        .priority-badge.medium {
          background: rgba(255, 193, 7, 0.08);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.08);
        }

        .priority-badge.low {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.08);
        }

        /* Footer */
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .follow-up {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .follow-up.overdue {
          color: #ff4444;
        }

        .follow-icon {
          width: 12px;
          height: 12px;
        }

        .source-tag {
          padding: 0.05rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .view-link {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: all 0.3s;
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
          .lead-card {
            padding: 1rem;
          }

          .avatar-initials {
            width: 36px;
            height: 36px;
            font-size: 0.85rem;
          }

          .lead-name {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .lead-card {
            padding: 0.75rem;
          }

          .card-header {
            flex-wrap: wrap;
          }

          .lead-actions {
            margin-left: auto;
          }

          .contact-details {
            gap: 0.1rem;
          }

          .detail-item {
            font-size: 0.65rem;
          }

          .lead-details {
            gap: 0.1rem;
          }

          .detail-group {
            gap: 0.2rem;
          }

          .card-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 0.3rem;
          }

          .footer-left {
            flex-wrap: wrap;
          }

          .view-link {
            justify-content: flex-end;
          }

          .dropdown-menu {
            right: -0.5rem;
            min-width: 130px;
          }
        }
      `}</style>
    </div>
  );
}