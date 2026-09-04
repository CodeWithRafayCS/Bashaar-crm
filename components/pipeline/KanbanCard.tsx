"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Lead } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { 
  User, 
  DollarSign, 
  Calendar, 
  Clock, 
  MoreVertical, 
  Phone, 
  Mail, 
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";

interface KanbanCardProps {
  lead: Lead;
  index: number;
  onClick?: (leadId: string) => void;
  onEdit?: (leadId: string) => void;
  onDelete?: (leadId: string) => void;
}

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "New": <AlertCircle className="stage-icon new" />,
  "Attempted": <Phone className="stage-icon attempted" />,
  "Connected": <CheckCircle className="stage-icon connected" />,
  "Interested": <Star className="stage-icon interested" />,
  "Meeting Scheduled": <Calendar className="stage-icon meeting" />,
  "Proposal Sent": <MessageSquare className="stage-icon proposal" />,
  "Negotiation": <TrendingUp className="stage-icon negotiation" />,
  "Won": <CheckCircle className="stage-icon won" />,
  "Lost": <XCircle className="stage-icon lost" />,
};

const STAGE_COLORS: Record<string, string> = {
  "New": "#4285f4",
  "Attempted": "#9c27b0",
  "Connected": "#00c853",
  "Interested": "#ffc107",
  "Meeting Scheduled": "#f4c542",
  "Proposal Sent": "#ff6f00",
  "Negotiation": "#ff4444",
  "Won": "#00c853",
  "Lost": "#ff4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  "High": "#ff4444",
  "Medium": "#ffc107",
  "Low": "#00c853",
};

export function KanbanCard({
  lead,
  index,
  onClick,
  onEdit,
  onDelete,
}: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const stageColor = STAGE_COLORS[lead.stage] || "#ffffff";
  const stageIcon = STAGE_ICONS[lead.stage] || <Building2 className="stage-icon" />;
  const priorityColor = PRIORITY_COLORS[lead.priority || "Medium"] || "#ffc107";
  const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  const handleCardClick = () => {
    onClick?.(lead.id);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
          onClick={handleCardClick}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Priority Indicator */}
          <div 
            className="priority-indicator"
            style={{ background: priorityColor }}
          />

          {/* Header */}
          <div className="card-header">
            <div className="card-title-wrapper">
              <div className="card-title-row">
                <span className="stage-icon-wrapper" style={{ color: stageColor }}>
                  {stageIcon}
                </span>
                <h4 className="card-title">{lead.name}</h4>
              </div>
              <span className="card-company">{lead.company}</span>
            </div>
            <div className="card-actions">
              <button
                className="card-expand"
                onClick={toggleExpand}
                aria-label="Toggle details"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="card-body">
            <div className="card-value">
              <DollarSign className="value-icon" />
              <span>{formatCurrency(lead.value)}</span>
            </div>
            <div className="card-owner">
              <User className="owner-icon" />
              <span>{lead.ownerEmail}</span>
            </div>
            {lead.priority && (
              <span 
                className="card-priority"
                style={{ color: priorityColor }}
              >
                {lead.priority}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer">
            {lead.followUpDate && (
              <span className={`followup-date ${isOverdue ? "overdue" : ""}`}>
                <Clock className="followup-icon" />
                {formatDate(lead.followUpDate)}
                {isOverdue && " ⚠️"}
              </span>
            )}
            {lead.source && (
              <span className="card-source">{lead.source}</span>
            )}
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="card-details">
              <div className="detail-row">
                <Phone className="detail-icon" />
                <span>{lead.phone || "No phone"}</span>
              </div>
              <div className="detail-row">
                <Mail className="detail-icon" />
                <span>{lead.email || "No email"}</span>
              </div>
              {lead.address && (
                <div className="detail-row">
                  <Building2 className="detail-icon" />
                  <span>{lead.address}</span>
                </div>
              )}
              {lead.notes && (
                <div className="detail-row notes">
                  <span>{lead.notes}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Stage:</span>
                <span style={{ color: stageColor }}>{lead.stage}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Source:</span>
                <span>{lead.source || "Unknown"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Created:</span>
                <span>{formatDate(lead.createdAt)}</span>
              </div>
              {lead.tags && lead.tags.length > 0 && (
                <div className="detail-row tags">
                  {lead.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <style jsx>{`
            .kanban-card {
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.04);
              border-radius: 8px;
              padding: 0.6rem 0.75rem;
              margin-bottom: 0.4rem;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              position: relative;
              overflow: hidden;
            }

            .kanban-card:hover {
              background: rgba(255, 255, 255, 0.05);
              border-color: rgba(255, 255, 255, 0.06);
              transform: translateY(-2px);
            }

            .kanban-card.dragging {
              opacity: 0.5;
              transform: rotate(2deg) scale(0.98);
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            }

            /* Priority Indicator */
            .priority-indicator {
              position: absolute;
              top: 0;
              left: 0;
              width: 4px;
              height: 100%;
              border-radius: 4px 0 0 4px;
            }

            /* Header */
            .card-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 0.3rem;
              padding-left: 0.3rem;
            }

            .card-title-wrapper {
              flex: 1;
              min-width: 0;
            }

            .card-title-row {
              display: flex;
              align-items: center;
              gap: 0.3rem;
            }

            .stage-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .stage-icon {
              width: 16px;
              height: 16px;
            }

            .stage-icon.new {
              color: #4285f4;
            }

            .stage-icon.attempted {
              color: #9c27b0;
            }

            .stage-icon.connected {
              color: #00c853;
            }

            .stage-icon.interested {
              color: #ffc107;
            }

            .stage-icon.meeting {
              color: #f4c542;
            }

            .stage-icon.proposal {
              color: #ff6f00;
            }

            .stage-icon.negotiation {
              color: #ff4444;
            }

            .stage-icon.won {
              color: #00c853;
            }

            .stage-icon.lost {
              color: #ff4444;
            }

            .card-title {
              font-size: 0.8rem;
              font-weight: 500;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .card-company {
              font-size: 0.65rem;
              color: rgba(255, 255, 255, 0.2);
              display: block;
            }

            .card-actions {
              display: flex;
              align-items: center;
              gap: 0.1rem;
              flex-shrink: 0;
            }

            .card-expand {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              border: none;
              background: transparent;
              border-radius: 4px;
              color: rgba(255, 255, 255, 0.1);
              cursor: pointer;
              transition: all 0.3s;
            }

            .card-expand:hover {
              background: rgba(255, 255, 255, 0.04);
              color: rgba(255, 255, 255, 0.3);
            }

            /* Body */
            .card-body {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              gap: 0.3rem 0.5rem;
              padding-left: 0.3rem;
              font-size: 0.7rem;
              color: rgba(255, 255, 255, 0.3);
            }

            .card-value {
              display: flex;
              align-items: center;
              gap: 0.2rem;
              font-weight: 600;
              color: #f4c542;
            }

            .value-icon {
              width: 12px;
              height: 12px;
            }

            .card-owner {
              display: flex;
              align-items: center;
              gap: 0.2rem;
            }

            .owner-icon {
              width: 12px;
              height: 12px;
            }

            .card-priority {
              font-size: 0.55rem;
              font-weight: 600;
              text-transform: uppercase;
              padding: 0.05rem 0.3rem;
              border-radius: 3px;
              background: rgba(255, 255, 255, 0.04);
              border: 1px solid currentColor;
            }

            /* Footer */
            .card-footer {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 0.3rem;
              padding-top: 0.3rem;
              padding-left: 0.3rem;
              border-top: 1px solid rgba(255, 255, 255, 0.03);
              font-size: 0.6rem;
              color: rgba(255, 255, 255, 0.15);
            }

            .followup-date {
              display: flex;
              align-items: center;
              gap: 0.2rem;
            }

            .followup-date.overdue {
              color: #ff4444;
            }

            .followup-icon {
              width: 12px;
              height: 12px;
            }

            .card-source {
              padding: 0.05rem 0.3rem;
              background: rgba(255, 255, 255, 0.03);
              border-radius: 3px;
              font-size: 0.55rem;
              color: rgba(255, 255, 255, 0.1);
            }

            /* Details */
            .card-details {
              margin-top: 0.3rem;
              padding: 0.3rem 0.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.03);
              background: rgba(255, 255, 255, 0.02);
              border-radius: 4px;
              display: flex;
              flex-direction: column;
              gap: 0.15rem;
            }

            .detail-row {
              display: flex;
              align-items: center;
              gap: 0.3rem;
              font-size: 0.65rem;
              color: rgba(255, 255, 255, 0.25);
            }

            .detail-icon {
              width: 12px;
              height: 12px;
              color: rgba(255, 255, 255, 0.1);
            }

            .detail-row.notes {
              padding: 0.2rem 0.3rem;
              background: rgba(255, 255, 255, 0.02);
              border-radius: 4px;
              font-style: italic;
              color: rgba(255, 255, 255, 0.15);
              font-size: 0.6rem;
            }

            .detail-label {
              color: rgba(255, 255, 255, 0.1);
              font-weight: 500;
            }

            .detail-row.tags {
              flex-wrap: wrap;
              gap: 0.2rem;
            }

            .tag {
              padding: 0.05rem 0.3rem;
              background: rgba(244, 197, 66, 0.06);
              border: 1px solid rgba(244, 197, 66, 0.06);
              border-radius: 3px;
              font-size: 0.55rem;
              color: rgba(244, 197, 66, 0.3);
            }

            /* Responsive */
            @media (max-width: 480px) {
              .kanban-card {
                padding: 0.4rem 0.5rem;
              }

              .card-title {
                font-size: 0.75rem;
              }

              .card-body {
                font-size: 0.65rem;
              }

              .card-details {
                padding: 0.2rem 0.3rem;
              }

              .detail-row {
                font-size: 0.6rem;
              }

              .stage-icon {
                width: 14px;
                height: 14px;
              }
            }
          `}</style>
        </div>
      )}
    </Draggable>
  );
}