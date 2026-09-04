"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Company, Lead, Contact, Activity } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Edit,
  Trash,
  ArrowLeft,
  ExternalLink,
  FileText,
  Briefcase,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";

interface CompanyDetailsProps {
  company: Company;
  leads?: Lead[];
  contacts?: Contact[];
  activities?: Activity[];
  loading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddLead?: () => void;
  onAddContact?: () => void;
  onAddActivity?: () => void;
  onBack?: () => void;
}

export function CompanyDetails({
  company,
  leads = [],
  contacts = [],
  activities = [],
  loading = false,
  onEdit,
  onDelete,
  onAddLead,
  onAddContact,
  onAddActivity,
  onBack,
}: CompanyDetailsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "contacts" | "activities">("overview");

  const totalDealValue = leads.reduce((sum, l) => sum + l.value, 0);
  const activeLeads = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
  const wonLeads = leads.filter((l) => l.stage === "Won");

  if (loading) {
    return (
      <div className="company-details-loading">
        <LoadingSpinner label="Loading company details..." size="lg" />
      </div>
    );
  }

  return (
    <div className="company-details">
      {/* Back Button */}
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Header */}
      <div className="details-header">
        <div className="header-left">
          <div className="company-avatar-large">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="company-logo" />
            ) : (
              <span className="avatar-initials">{company.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="company-info">
            <h1 className="company-name">{company.name}</h1>
            <div className="company-meta">
              {company.category && (
                <span className={`category-badge ${company.category.toLowerCase()}`}>
                  {company.category}
                </span>
              )}
              {company.totalDealValue !== undefined && (
                <span className="meta-item">
                  <TrendingUp className="meta-icon" />
                  {formatCurrency(company.totalDealValue)}
                </span>
              )}
              {company.googleRating !== undefined && (
                <span className="meta-item">
                  <Star className="meta-icon gold" />
                  {company.googleRating} ({company.googleReviews || 0} reviews)
                </span>
              )}
              <span className="meta-item">
                <Users className="meta-icon" />
                {leads.length} leads
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {onEdit && (
            <Button variant="ghost" onClick={onEdit}>
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="details-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Building2 className="tab-icon" />
          Overview
        </button>
        <button
          className={`tab ${activeTab === "leads" ? "active" : ""}`}
          onClick={() => setActiveTab("leads")}
        >
          <Briefcase className="tab-icon" />
          Leads ({leads.length})
        </button>
        <button
          className={`tab ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          <Users className="tab-icon" />
          Contacts ({contacts.length})
        </button>
        <button
          className={`tab ${activeTab === "activities" ? "active" : ""}`}
          onClick={() => setActiveTab("activities")}
        >
          <MessageSquare className="tab-icon" />
          Activities ({activities.length})
        </button>
      </div>

      {/* Content */}
      <div className="details-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            {/* Contact Info */}
            <div className="info-card">
              <h3 className="card-title">Contact Information</h3>
              <div className="info-list">
                {company.phone && (
                  <div className="info-item">
                    <Phone className="info-icon" />
                    <div>
                      <span className="info-label">Phone</span>
                      <span className="info-value">{formatPhone(company.phone)}</span>
                    </div>
                  </div>
                )}
                {company.email && (
                  <div className="info-item">
                    <Mail className="info-icon" />
                    <div>
                      <span className="info-label">Email</span>
                      <span className="info-value">{company.email}</span>
                    </div>
                  </div>
                )}
                {company.address && (
                  <div className="info-item">
                    <MapPin className="info-icon" />
                    <div>
                      <span className="info-label">Address</span>
                      <span className="info-value">{company.address}</span>
                    </div>
                  </div>
                )}
                {company.website && (
                  <div className="info-item">
                    <Globe className="info-icon" />
                    <div>
                      <span className="info-label">Website</span>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
                {company.createdAt && (
                  <div className="info-item">
                    <Calendar className="info-icon" />
                    <div>
                      <span className="info-label">Created</span>
                      <span className="info-value">{formatDate(company.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Google Profile */}
            {company.googleProfileUrl && (
              <div className="info-card">
                <h3 className="card-title">Google Profile</h3>
                <div className="google-info">
                  <div className="google-rating">
                    <span className="rating-stars">⭐</span>
                    <span className="rating-value">{company.googleRating ?? "—"}</span>
                    <span className="rating-reviews">
                      ({company.googleReviews ?? 0} reviews)
                    </span>
                  </div>
                  <div className="verification-status">
                    <span
                      className={`status-indicator ${company.googleVerificationStatus?.toLowerCase()}`}
                    />
                    {company.googleVerificationStatus}
                  </div>
                  <a
                    href={company.googleProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maps-link"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="info-card stats-card">
              <h3 className="card-title">Company Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Leads</span>
                  <span className="stat-value">{leads.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Leads</span>
                  <span className="stat-value">{activeLeads.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Won Deals</span>
                  <span className="stat-value gold">{wonLeads.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Value</span>
                  <span className="stat-value gold">{formatCurrency(totalDealValue)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Contacts</span>
                  <span className="stat-value">{contacts.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Activities</span>
                  <span className="stat-value">{activities.length}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {company.tags && company.tags.length > 0 && (
              <div className="info-card">
                <h3 className="card-title">Tags</h3>
                <div className="tags-container">
                  {company.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {company.notes && (
              <div className="info-card full-width">
                <h3 className="card-title">Notes</h3>
                <p className="notes-text">{company.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "leads" && (
          <div className="tab-content">
            {leads.length === 0 ? (
              <EmptyState
                title="No leads yet"
                body="Add a lead to this company to get started"
                action={
                  onAddLead && (
                    <Button variant="gold" onClick={onAddLead}>
                      <Plus className="w-4 h-4" />
                      Add Lead
                    </Button>
                  )
                }
              />
            ) : (
              <div className="leads-grid">
                {leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="lead-card"
                  >
                    <div className="lead-header">
                      <span className="lead-name">{lead.name}</span>
                      <span className={`stage-badge ${lead.stage.toLowerCase().replace(/\s/g, "-")}`}>
                        {lead.stage}
                      </span>
                    </div>
                    <div className="lead-body">
                      <span className="lead-owner">{lead.ownerEmail}</span>
                      <span className="lead-value">{formatCurrency(lead.value)}</span>
                    </div>
                    {lead.followUpDate && (
                      <div className="lead-footer">
                        <Calendar className="w-3 h-3" />
                        <span>Follow-up: {formatDate(lead.followUpDate)}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="tab-content">
            {contacts.length === 0 ? (
              <EmptyState
                title="No contacts yet"
                body="Add contacts to this company"
                action={
                  onAddContact && (
                    <Button variant="gold" onClick={onAddContact}>
                      <Plus className="w-4 h-4" />
                      Add Contact
                    </Button>
                  )
                }
              />
            ) : (
              <div className="contacts-grid">
                {contacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-avatar">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="contact-info">
                      <span className="contact-name">{contact.name}</span>
                      {contact.title && (
                        <span className="contact-title">{contact.title}</span>
                      )}
                      {contact.email && (
                        <span className="contact-email">{contact.email}</span>
                      )}
                      {contact.phone && (
                        <span className="contact-phone">{formatPhone(contact.phone)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "activities" && (
          <div className="tab-content">
            {activities.length === 0 ? (
              <EmptyState
                title="No activities yet"
                body="Log activities for this company"
                action={
                  onAddActivity && (
                    <Button variant="gold" onClick={onAddActivity}>
                      <Plus className="w-4 h-4" />
                      Log Activity
                    </Button>
                  )
                }
              />
            ) : (
              <ActivityTimeline activities={activities} />
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .company-details {
          padding: 0;
        }

        /* Back Button */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: transparent;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          margin-bottom: 1rem;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        /* Header */
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .company-avatar-large {
          flex-shrink: 0;
        }

        .company-avatar-large .company-logo {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          object-fit: cover;
        }

        .avatar-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 14px;
          font-size: 1.8rem;
          font-weight: 700;
          color: #0a0a0a;
        }

        .company-info {
          flex: 1;
        }

        .company-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.3rem 0;
        }

        .company-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          align-items: center;
        }

        .category-badge {
          padding: 0.1rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 500;
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

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .meta-icon {
          width: 14px;
          height: 14px;
        }

        .meta-icon.gold {
          color: #f4c542;
          fill: #f4c542;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* Tabs */
        .details-tabs {
          display: flex;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          padding: 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
        }

        .tab.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.15);
        }

        .tab-icon {
          width: 16px;
          height: 16px;
        }

        /* Overview Grid */
        .overview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1.25rem;
        }

        .info-card.full-width {
          grid-column: 1 / -1;
        }

        .card-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Info List */
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .info-icon {
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .info-item > div {
          display: flex;
          flex-direction: column;
          gap: 0.05rem;
        }

        .info-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .info-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .info-link {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.85rem;
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
        }

        .info-link:hover {
          color: #f4c542;
        }

        /* Google Info */
        .google-info {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .google-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .rating-stars {
          font-size: 1rem;
        }

        .rating-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
        }

        .rating-reviews {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .verification-status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          padding: 0.15rem 0.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-indicator.verified {
          background: #00c853;
        }

        .status-indicator.pending {
          background: #ffc107;
        }

        .status-indicator.suspended {
          background: #ff4444;
        }

        .maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
          margin-top: 0.2rem;
        }

        .maps-link:hover {
          color: #f4c542;
        }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-value.gold {
          color: #f4c542;
        }

        /* Tags */
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .tag {
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.08);
          color: rgba(255, 255, 255, 0.5);
        }

        .notes-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          margin: 0;
        }

        /* Leads Grid */
        .leads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 0.75rem;
        }

        .lead-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          text-decoration: none;
          transition: all 0.3s;
        }

        .lead-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .lead-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .lead-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .stage-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 500;
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .stage-badge.won {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
          border-color: rgba(0, 200, 83, 0.15);
        }

        .stage-badge.lost {
          background: rgba(255, 68, 68, 0.12);
          color: #ff4444;
          border-color: rgba(255, 68, 68, 0.15);
        }

        .lead-body {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .lead-value {
          font-weight: 600;
          color: #f4c542;
        }

        .lead-footer {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          margin-top: 0.3rem;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Contacts Grid */
        .contacts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          transition: all 0.3s;
        }

        .contact-card:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .contact-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .contact-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .contact-title {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.25);
        }

        .contact-email {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .contact-phone {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Tab Content */
        .tab-content {
          padding: 0.5rem 0;
        }

        .company-details-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .details-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-left {
            flex-wrap: wrap;
          }

          .company-name {
            font-size: 1.4rem;
          }

          .company-avatar-large .company-logo,
          .avatar-initials {
            width: 50px;
            height: 50px;
            font-size: 1.4rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .leads-grid {
            grid-template-columns: 1fr;
          }

          .contacts-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .company-name {
            font-size: 1.2rem;
          }

          .company-meta {
            gap: 0.3rem 0.5rem;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions :global(.btn-ghost),
          .header-actions :global(.btn-danger) {
            flex: 1;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.3rem;
          }

          .info-card {
            padding: 1rem;
          }

          .stat-value {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}