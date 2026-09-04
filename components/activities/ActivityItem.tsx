"use client";

import { useState } from "react";
import Link from "next/link";
import type { Activity, Lead } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/utils/format";

interface ActivityItemProps {
  activity: Activity;
  lead?: Lead;
  onDelete?: (id: string) => void;
  onEdit?: (activity: Activity) => void;
  compact?: boolean;
}

const CHANNEL_ICONS: Record<string, string> = {
  Call: "📞",
  WhatsApp: "💬",
  Meeting: "📅",
  Note: "📝",
  Email: "✉️",
};

const CHANNEL_COLORS: Record<string, string> = {
  Call: "#4285f4",
  WhatsApp: "#25d366",
  Meeting: "#f4c542",
  Note: "#ffc107",
  Email: "#ea4335",
};

const OUTCOME_COLORS: Record<string, string> = {
  Connected: "#00c853",
  "No answer": "#ff4444",
  Voicemail: "#ffc107",
  Completed: "#00c853",
  Qualified: "#4285f4",
  "Not interested": "#ff4444",
  "Follow-up scheduled": "#f4c542",
};

export function ActivityItem({
  activity,
  lead,
  onDelete,
  onEdit,
  compact = false,
}: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const channelIcon = CHANNEL_ICONS[activity.channel] || "📋";
  const channelColor = CHANNEL_COLORS[activity.channel] || "#ffffff";
  const outcomeColor = OUTCOME_COLORS[activity.outcome] || "rgba(255,255,255,0.2)";

  const hasNotes = activity.notes && activity.notes.length > 0;
  const isLongNote = hasNotes && activity.notes!.length > 100;

  return (
    <div className={`activity-item ${compact ? "compact" : ""}`}>
      {/* Timeline Line */}
      <div className="timeline-line" />

      {/* Activity Dot */}
      <div className="activity-dot-wrapper">
        <div
          className="activity-dot"
          style={{ background: channelColor }}
        />
      </div>

      {/* Activity Content */}
      <div className="activity-content">
        {/* Header */}
        <div className="activity-header">
          <div className="activity-left">
            <span className="activity-icon">{channelIcon}</span>
            <span className="activity-channel">{activity.channel}</span>
            <span
              className="activity-outcome"
              style={{ color: outcomeColor }}
            >
              • {activity.outcome}
            </span>
            {lead && (
              <Link href={`/leads/${lead.id}`} className="activity-lead">
                • {lead.name}
              </Link>
            )}
          </div>
          <div className="activity-right">
            <span className="activity-time">
              {formatTime(activity.createdAt)}
            </span>
            <span className="activity-date">
              {formatDate(activity.createdAt)}
            </span>
            <button
              type="button"
              className="activity-toggle"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="Toggle details"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Owner */}
        <div className="activity-owner">
          <span className="owner-label">By</span>
          <span className="owner-name">{activity.ownerEmail}</span>
        </div>

        {/* Notes */}
        {hasNotes && (
          <div className={`activity-notes ${isExpanded ? "expanded" : ""}`}>
            <p className="notes-text">
              {isExpanded || !isLongNote
                ? activity.notes
                : `${activity.notes!.slice(0, 100)}...`}
            </p>
            {isLongNote && (
              <button
                type="button"
                className="notes-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="activity-actions">
          {onEdit && (
            <button
              type="button"
              className="action-btn edit"
              onClick={() => onEdit(activity)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="action-btn delete"
              onClick={() => onDelete(activity.id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 0;
          position: relative;
        }

        .activity-item:last-child {
          padding-bottom: 0;
        }

        .activity-item.compact {
          padding: 0.3rem 0;
        }

        /* Timeline Line */
        .timeline-line {
          position: absolute;
          left: 14px;
          top: 32px;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .activity-item:last-child .timeline-line {
          display: none;
        }

        /* Activity Dot */
        .activity-dot-wrapper {
          flex-shrink: 0;
          padding-top: 0.15rem;
          z-index: 1;
        }

        .activity-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 20px rgba(244, 197, 66, 0.05);
          flex-shrink: 0;
        }

        /* Activity Content */
        .activity-content {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s;
        }

        .activity-content:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
        }

        .activity-item.compact .activity-content {
          padding: 0.3rem 0.5rem;
        }

        /* Header */
        .activity-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .activity-left {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .activity-icon {
          font-size: 0.85rem;
        }

        .activity-channel {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .activity-outcome {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .activity-lead {
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
        }

        .activity-lead:hover {
          color: #f4c542;
        }

        .activity-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .activity-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .activity-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .activity-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .activity-toggle:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        /* Owner */
        .activity-owner {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.15rem;
        }

        .owner-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .owner-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.25);
        }

        /* Notes */
        .activity-notes {
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .activity-notes:not(.expanded) .notes-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notes-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.5;
          margin: 0;
        }

        .notes-toggle {
          font-size: 0.7rem;
          color: rgba(244, 197, 66, 0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0.2rem 0;
        }

        .notes-toggle:hover {
          color: #f4c542;
        }

        /* Actions */
        .activity-actions {
          display: flex;
          gap: 0.3rem;
          margin-top: 0.3rem;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.1rem 0.4rem;
          border: none;
          background: transparent;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.edit {
          color: rgba(255, 255, 255, 0.2);
        }

        .action-btn.edit:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
        }

        .action-btn.delete {
          color: rgba(255, 68, 68, 0.3);
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .action-btn svg {
          flex-shrink: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .activity-item {
            gap: 0.5rem;
            padding: 0.3rem 0;
          }

          .activity-content {
            padding: 0.4rem 0.5rem;
          }

          .activity-header {
            flex-wrap: wrap;
          }

          .activity-left {
            gap: 0.3rem;
          }

          .activity-channel {
            font-size: 0.75rem;
          }

          .activity-outcome {
            font-size: 0.7rem;
          }

          .activity-time,
          .activity-date {
            font-size: 0.6rem;
          }

          .timeline-line {
            left: 12px;
          }

          .activity-dot {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .activity-right {
            flex-wrap: wrap;
          }

          .activity-date {
            display: none;
          }

          .activity-lead {
            font-size: 0.7rem;
          }

          .notes-text {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}