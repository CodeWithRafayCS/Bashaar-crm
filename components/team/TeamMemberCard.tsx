"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@/lib/types";
import { formatDate } from "@/lib/utils/format";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Award,
  TrendingUp,
  CheckSquare,
  Users,
  Star,
  Shield,
  Clock,
} from "lucide-react";

interface TeamMemberCardProps {
  member: User;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

export function TeamMemberCard({
  member,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  compact = false,
  showActions = true,
}: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isActive = member.active;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Shield className="role-icon admin" />;
      case "Manager": return <Star className="role-icon manager" />;
      case "Sales User": return <Users className="role-icon sales" />;
      case "Viewer": return <Eye className="role-icon viewer" />;
      default: return <UserIcon className="role-icon" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "#f4c542";
      case "Manager": return "#4285f4";
      case "Sales User": return "#00c853";
      case "Viewer": return "#9c27b0";
      default: return "#ffffff";
    }
  };

  const handleCardClick = () => {
    onView?.(member.id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete?.(member.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`team-member-card ${compact ? "compact" : ""} ${isActive ? "active" : "inactive"} ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      {/* Status Indicator */}
      <div className={`status-indicator ${isActive ? "active" : "inactive"}`} />

      {/* Avatar */}
      <div className="member-avatar">
        <div className="avatar-wrapper">
          <span className="avatar-initials">{getInitials(member.name)}</span>
          <div className="role-badge" style={{ background: getRoleColor(member.role) }}>
            {getRoleIcon(member.role)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="member-content">
        <div className="member-header">
          <div className="member-info">
            <h3 className="member-name">{member.name}</h3>
            <span className="member-role" style={{ color: getRoleColor(member.role) }}>
              {getRoleIcon(member.role)}
              {member.role}
            </span>
          </div>
          <div className="member-actions">
            {showActions && (
              <div className="dropdown-wrapper">
                <button
                  type="button"
                  className="action-btn more"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    {onView && (
                      <button onClick={() => { onView(member.id); setShowMenu(false); }}>
                        <Eye className="w-3 h-3" />
                        View Profile
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => { onEdit(member.id); setShowMenu(false); }}>
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                    {onToggleActive && (
                      <button onClick={() => { onToggleActive(member.id); setShowMenu(false); }}>
                        {isActive ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="danger"
                        onClick={() => { handleDelete(); setShowMenu(false); }}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="member-details">
          {member.email && (
            <div className="detail-item">
              <Mail className="detail-icon" />
              <span>{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="detail-item">
              <Phone className="detail-icon" />
              <span>{member.phone}</span>
            </div>
          )}
          {member.department && (
            <div className="detail-item">
              <Users className="detail-icon" />
              <span>{member.department}</span>
            </div>
          )}
          {member.joinedAt && (
            <div className="detail-item">
              <Calendar className="detail-icon" />
              <span>Joined {formatDate(member.joinedAt)}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="member-stats">
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <Users className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{member.leadsCreated || 0}</span>
              <span className="stat-label">Leads</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-icon-wrapper gold">
              <TrendingUp className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{member.dealsWon || 0}</span>
              <span className="stat-label">Deals Won</span>
            </div>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <div className="stat-icon-wrapper green">
              <CheckSquare className="stat-icon" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{member.tasksCompleted || 0}</span>
              <span className="stat-label">Tasks</span>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
            <span>Delete this member?</span>
            <button
              type="button"
              className="confirm-yes"
              onClick={handleDelete}
            >
              <CheckCircle className="w-3 h-3" />
              Yes
            </button>
            <button
              type="button"
              className="confirm-no"
              onClick={handleCancelDelete}
            >
              <XCircle className="w-3 h-3" />
              No
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .team-member-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .team-member-card:hover {
          transform: translateY(-4px);
          border-color: rgba(244, 197, 66, 0.08);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .team-member-card.compact {
          padding: 0.75rem 1rem;
          gap: 0.75rem;
        }

        .team-member-card.compact .member-details {
          gap: 0.15rem;
        }

        .team-member-card.compact .detail-item {
          font-size: 0.7rem;
        }

        .team-member-card.compact .member-stats {
          gap: 0.3rem;
        }

        .team-member-card.compact .stat-item {
          gap: 0.3rem;
        }

        .team-member-card.compact .stat-value {
          font-size: 0.85rem;
        }

        .team-member-card.inactive {
          opacity: 0.5;
        }

        /* Status Indicator */
        .status-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          border-radius: 4px 0 0 4px;
        }

        .status-indicator.active {
          background: #00c853;
        }

        .status-indicator.inactive {
          background: #ff4444;
        }

        /* Avatar */
        .member-avatar {
          flex-shrink: 0;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .team-member-card.compact .avatar-initials {
          width: 40px;
          height: 40px;
          font-size: 0.85rem;
        }

        .role-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #0a0a0a;
        }

        .role-icon {
          width: 12px;
          height: 12px;
          color: #ffffff;
        }

        .team-member-card.compact .role-badge {
          width: 18px;
          height: 18px;
        }

        .team-member-card.compact .role-icon {
          width: 10px;
          height: 10px;
        }

        /* Content */
        .member-content {
          flex: 1;
          min-width: 0;
        }

        .member-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
        }

        .member-info {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .member-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .team-member-card.compact .member-name {
          font-size: 0.85rem;
        }

        .member-role {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .team-member-card.compact .member-role {
          font-size: 0.65rem;
        }

        .role-icon.admin {
          color: #f4c542;
        }

        .role-icon.manager {
          color: #4285f4;
        }

        .role-icon.sales {
          color: #00c853;
        }

        .role-icon.viewer {
          color: #9c27b0;
        }

        /* Actions */
        .member-actions {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          flex-shrink: 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          min-width: 150px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          padding: 0.2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
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
          color: rgba(255, 255, 255, 0.3);
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

        /* Details */
        .member-details {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 0.5rem;
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
          color: rgba(255, 255, 255, 0.1);
        }

        /* Stats */
        .member-stats {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon-wrapper.gold {
          background: rgba(244, 197, 66, 0.04);
          color: #f4c542;
        }

        .stat-icon-wrapper.green {
          background: rgba(0, 200, 83, 0.04);
          color: #00c853;
        }

        .stat-icon {
          width: 14px;
          height: 14px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-label {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.04);
        }

        /* Delete Confirm */
        .delete-confirm {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.3rem;
          padding: 0.3rem 0.5rem;
          background: rgba(255, 68, 68, 0.06);
          border: 1px solid rgba(255, 68, 68, 0.08);
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .delete-confirm span {
          flex: 1;
        }

        .confirm-yes,
        .confirm-no {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.1rem 0.4rem;
          border: 1px solid transparent;
          border-radius: 4px;
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .confirm-yes {
          background: rgba(0, 200, 83, 0.06);
          border-color: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .confirm-yes:hover {
          background: rgba(0, 200, 83, 0.1);
        }

        .confirm-no {
          background: rgba(255, 68, 68, 0.06);
          border-color: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .confirm-no:hover {
          background: rgba(255, 68, 68, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .team-member-card {
            padding: 1rem;
            flex-direction: column;
            align-items: stretch;
          }

          .avatar-wrapper {
            align-self: center;
          }

          .member-header {
            flex-wrap: wrap;
          }

          .member-stats {
            flex-wrap: wrap;
          }

          .stat-item {
            flex: 1;
            min-width: 60px;
          }

          .stat-divider {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .team-member-card {
            padding: 0.75rem;
          }

          .avatar-initials {
            width: 44px;
            height: 44px;
            font-size: 0.9rem;
          }

          .role-badge {
            width: 18px;
            height: 18px;
          }

          .role-icon {
            width: 10px;
            height: 10px;
          }

          .member-name {
            font-size: 0.85rem;
          }

          .member-role {
            font-size: 0.6rem;
          }

          .detail-item {
            font-size: 0.65rem;
          }

          .stat-item {
            gap: 0.3rem;
          }

          .stat-value {
            font-size: 0.75rem;
          }

          .stat-icon-wrapper {
            width: 22px;
            height: 22px;
          }

          .stat-icon {
            width: 12px;
            height: 12px;
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