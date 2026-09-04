"use client";

import { useMemo, useState } from "react";
import { ActivityItem } from "./ActivityItem";
import type { Activity, Lead } from "@/lib/types";
import { formatDate, formatDateShort } from "@/lib/utils/format";

interface ActivityTimelineProps {
  activities: Activity[];
  leads?: Lead[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
  maxItems?: number;
  showLoadMore?: boolean;
}

export function ActivityTimeline({
  activities,
  leads,
  onEdit,
  onDelete,
  maxItems = 10,
  showLoadMore = true,
}: ActivityTimelineProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [activities]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    const displayActivities = showAll ? sortedActivities : sortedActivities.slice(0, maxItems);
    
    displayActivities.forEach((activity) => {
      const date = formatDate(activity.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    
    return groups;
  }, [sortedActivities, showAll, maxItems]);

  const getLeadForActivity = (activity: Activity): Lead | undefined => {
    if (!leads) return undefined;
    return leads.find((lead) => lead.id === activity.leadId);
  };

  const totalCount = sortedActivities.length;
  const displayedCount = showAll ? totalCount : Math.min(totalCount, maxItems);
  const hasMore = totalCount > maxItems && !showAll;

  if (activities.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="empty-icon">📋</div>
        <p className="empty-title">No activities yet</p>
        <p className="empty-description">Activities will appear here once you start logging them.</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline">
      {/* Header */}
      <div className="timeline-header">
        <div className="timeline-header-left">
          <span className="timeline-title">Activity Timeline</span>
          <span className="timeline-count">{totalCount} entries</span>
        </div>
        {totalCount > maxItems && (
          <button
            type="button"
            className="timeline-toggle"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all (${totalCount})`}
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="timeline-body">
        {Object.entries(groupedActivities).map(([date, items]) => (
          <div key={date} className="timeline-group">
            {/* Date Header */}
            <div className="date-header">
              <span className="date-label">{date}</span>
              <span className="date-count">{items.length} activity{items.length > 1 ? 's' : ''}</span>
            </div>

            {/* Activities */}
            <div className="activities-list">
              {items.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  lead={getLeadForActivity(activity)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && showLoadMore && (
        <div className="load-more">
          <button
            type="button"
            className="load-more-btn"
            onClick={() => setShowAll(true)}
          >
            <span>Load more</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .activity-timeline {
          width: 100%;
        }

        /* Timeline Header */
        .timeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .timeline-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timeline-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        .timeline-count {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.05rem 0.4rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .timeline-toggle {
          font-size: 0.7rem;
          color: rgba(244, 197, 66, 0.4);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .timeline-toggle:hover {
          color: #f4c542;
          background: rgba(244, 197, 66, 0.04);
        }

        /* Timeline Body */
        .timeline-body {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Timeline Group */
        .timeline-group {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
        }

        .date-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.3rem 0 0.2rem;
          margin-bottom: 0.3rem;
        }

        .date-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .date-count {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.1);
        }

        .activities-list {
          display: flex;
          flex-direction: column;
        }

        /* Empty State */
        .timeline-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          opacity: 0.3;
        }

        .empty-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.3);
          margin: 0 0 0.25rem 0;
        }

        .empty-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.15);
          margin: 0;
        }

        /* Load More */
        .load-more {
          display: flex;
          justify-content: center;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .load-more-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .load-more-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.4);
          border-color: rgba(244, 197, 66, 0.06);
        }

        .load-more-btn svg {
          transition: transform 0.3s;
        }

        .load-more-btn:hover svg {
          transform: translateY(2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .timeline-header {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .timeline-group {
            padding: 0.1rem 0.3rem;
          }

          .timeline-empty {
            padding: 1.5rem 1rem;
          }

          .empty-icon {
            font-size: 2rem;
          }

          .empty-title {
            font-size: 0.85rem;
          }

          .empty-description {
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .timeline-header-left {
            flex-wrap: wrap;
          }

          .timeline-title {
            font-size: 0.75rem;
          }

          .date-label {
            font-size: 0.65rem;
          }

          .load-more-btn {
            font-size: 0.7rem;
            padding: 0.2rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}