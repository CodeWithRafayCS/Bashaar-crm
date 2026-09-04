"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Activity, Lead } from "@/lib/types";
import { formatDate, formatTime, formatDateShort } from "@/lib/utils/format";
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Mail,
  ChevronRight,
  Clock,
  User
} from "lucide-react";

interface RecentActivityProps {
  activities: Activity[];
  leads: Lead[];
  maxItems?: number;
  compact?: boolean;
  showViewAll?: boolean;
}

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  Call: <Phone className="channel-icon" />,
  WhatsApp: <MessageSquare className="channel-icon" />,
  Meeting: <Calendar className="channel-icon" />,
  Note: <FileText className="channel-icon" />,
  Email: <Mail className="channel-icon" />,
};

const CHANNEL_COLORS: Record<string, string> = {
  Call: "#4285f4",
  WhatsApp: "#25d366",
  Meeting: "#f4c542",
  Note: "#ffc107",
  Email: "#ea4335",
};

export function RecentActivity({
  activities,
  leads,
  maxItems = 5,
  compact = false,
  showViewAll = true,
}: RecentActivityProps) {
  const recentActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, maxItems);
  }, [activities, maxItems]);

  const getLeadName = (leadId: string): string | undefined => {
    const lead = leads.find((l) => l.id === leadId);
    return lead?.name;
  };

  const getLeadLink = (leadId: string): string => {
    return `/leads/${leadId}`;
  };

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateShort(date);
  };

  if (activities.length === 0) {
    return (
      <div className="recent-activity-empty">
        <div className="empty-icon">📋</div>
        <p className="empty-text">No recent activity</p>
        <p className="empty-subtext">Activities will appear here as you log them</p>

        <style jsx>{`
          .recent-activity-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            text-align: center;
          }

          .empty-icon {
            font-size: 2rem;
            opacity: 0.2;
            margin-bottom: 0.3rem;
          }

          .empty-text {
            font-size: 0.85rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.2);
            margin: 0;
          }

          .empty-subtext {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.08);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`recent-activity ${compact ? "compact" : ""}`}>
      <div className="activity-list">
        {recentActivities.map((activity) => {
          const leadName = getLeadName(activity.leadId);
          const channelIcon = CHANNEL_ICONS[activity.channel] || <FileText className="channel-icon" />;
          const channelColor = CHANNEL_COLORS[activity.channel] || "#ffffff";

          return (
            <div key={activity.id} className="activity-item">
              {/* Timeline dot with color */}
              <div className="activity-timeline">
                <div 
                  className="activity-dot" 
                  style={{ background: channelColor }}
                />
                {recentActivities.indexOf(activity) !== recentActivities.length - 1 && (
                  <div className="activity-line" />
                )}
              </div>

              {/* Activity content */}
              <div className="activity-content">
                <div className="activity-header">
                  <div className="activity-left">
                    <span className="activity-icon" style={{ color: channelColor }}>
                      {channelIcon}
                    </span>
                    <span className="activity-channel">{activity.channel}</span>
                    <span className="activity-outcome">{activity.outcome}</span>
                  </div>
                  <span className="activity-time" title={formatDate(activity.createdAt)}>
                    <Clock className="time-icon" />
                    {getTimeAgo(activity.createdAt)}
                  </span>
                </div>

                {leadName && (
                  <Link href={getLeadLink(activity.leadId)} className="activity-lead">
                    <User className="lead-icon" />
                    {leadName}
                  </Link>
                )}

                {activity.notes && (
                  <p className={`activity-notes ${compact ? "truncate" : ""}`}>
                    {activity.notes}
                  </p>
                )}

                <div className="activity-footer">
                  <span className="activity-owner">
                    by {activity.ownerEmail}
                  </span>
                  {leadName && (
                    <Link href={getLeadLink(activity.leadId)} className="view-lead">
                      View lead
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showViewAll && activities.length > maxItems && (
        <div className="view-all-wrapper">
          <Link href="/activities" className="view-all-link">
            View all activities
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <style jsx>{`
        .recent-activity {
          width: 100%;
        }

        .recent-activity.compact .activity-item {
          padding: 0.3rem 0;
        }

        .recent-activity.compact .activity-content {
          padding: 0.3rem 0.5rem;
        }

        .recent-activity.compact .activity-header {
          font-size: 0.75rem;
        }

        .recent-activity.compact .activity-notes {
          font-size: 0.7rem;
        }

        .recent-activity.compact .activity-footer {
          font-size: 0.6rem;
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
        }

        .activity-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem 0;
        }

        .activity-item:last-child .activity-line {
          display: none;
        }

        /* Timeline */
        .activity-timeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          padding-top: 0.3rem;
        }

        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
          z-index: 1;
        }

        .activity-line {
          width: 2px;
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          min-height: 20px;
          margin-top: 0.2rem;
        }

        /* Content */
        .activity-content {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s;
        }

        .activity-content:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.05);
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
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .activity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .channel-icon {
          width: 14px;
          height: 14px;
        }

        .activity-channel {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
        }

        .activity-outcome {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.25);
        }

        .activity-time {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          white-space: nowrap;
        }

        .time-icon {
          width: 12px;
          height: 12px;
        }

        /* Lead */
        .activity-lead {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          color: rgba(244, 197, 66, 0.4);
          text-decoration: none;
          transition: color 0.3s;
          margin-top: 0.1rem;
        }

        .activity-lead:hover {
          color: #f4c542;
        }

        .lead-icon {
          width: 12px;
          height: 12px;
        }

        /* Notes */
        .activity-notes {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0.1rem 0 0.2rem 0;
          line-height: 1.4;
        }

        .activity-notes.truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Footer */
        .activity-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.2rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .activity-owner {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .view-lead {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: color 0.3s;
        }

        .view-lead:hover {
          color: #f4c542;
        }

        /* View All */
        .view-all-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .view-all-link {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.3);
          text-decoration: none;
          transition: all 0.3s;
        }

        .view-all-link:hover {
          color: #f4c542;
        }

        .view-all-link svg {
          transition: transform 0.3s;
        }

        .view-all-link:hover svg {
          transform: translateX(2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .activity-item {
            padding: 0.3rem 0;
          }

          .activity-content {
            padding: 0.3rem 0.5rem;
          }

          .activity-channel {
            font-size: 0.7rem;
          }

          .activity-outcome {
            font-size: 0.65rem;
          }

          .activity-notes {
            font-size: 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .activity-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .activity-left {
            gap: 0.2rem;
          }

          .activity-time {
            font-size: 0.6rem;
          }

          .activity-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .channel-icon {
            width: 12px;
            height: 12px;
          }

          .activity-dot {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
}