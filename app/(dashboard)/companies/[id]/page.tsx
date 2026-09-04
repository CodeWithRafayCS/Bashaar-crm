"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getCompanyById,
  getCompanyLeads,
  getCompanyContacts,
  updateCompany,
  getActivities,
} from "@/lib/api";
import type { Company, Lead, Contact, Activity } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { version, user, pushToast } = useAppStore();
  const [company, setCompany] = useState<Company | undefined>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [companyData, leadsData, contactsData, activitiesData] = await Promise.all([
          getCompanyById(id),
          getCompanyLeads(id),
          getCompanyContacts(id),
          getActivities({ companyId: id }),
        ]);
        setCompany(companyData);
        setLeads(leadsData);
        setContacts(contactsData);
        setActivities(activitiesData);
        if (companyData) {
          setEditData({
            name: companyData.name,
            category: companyData.category || "",
            phone: companyData.phone || "",
            email: companyData.email || "",
            address: companyData.address || "",
            website: companyData.website || "",
            notes: companyData.notes || "",
          });
        }
      } catch (error) {
        pushToast("error", "Failed to load company");
      } finally {
        setLoading(false);
      }
    }
    void loadData();
  }, [id, version, pushToast]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loader" />
        <p>Loading company...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <EmptyState
        title="Company not found"
        body="It may have been archived or deleted."
        action={<Link href="/companies">Back to companies</Link>}
      />
    );
  }

  async function handleUpdateCompany(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateCompany(company.id, editData);
      setCompany((prev) => prev ? { ...prev, ...editData } : undefined);
      setIsEditing(false);
      pushToast("success", "Company updated");
    } catch (error) {
      pushToast("error", "Failed to update company");
    }
  }

  const totalDealValue = leads.reduce((sum, l) => sum + l.value, 0);
  const wonDeals = leads.filter((l) => l.stage === "Won");
  const activeLeads = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");

  return (
    <div className="company-detail-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Company</span>
          </div>
          <h1 className="page-title">
            {company.name}
            <span className={`category-badge ${company.category?.toLowerCase() || "other"}`}>
              {company.category || "Other"}
            </span>
          </h1>
          <div className="header-meta">
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {company.phone || "No phone"}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {company.email || "No email"}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatCurrency(totalDealValue)} in deals
            </span>
          </div>
        </div>
        <div className="header-actions">
          <Button
            type="button"
            variant="ghost"
            className="btn-edit"
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button type="button" variant="gold" className="btn-action" onClick={() => {
            pushToast("success", "Company exported");
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{leads.length}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(totalDealValue)}</span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{wonDeals.length}</span>
            <span className="stat-label">Won Deals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{activeLeads.length}</span>
            <span className="stat-label">Active Leads</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Left Column - Company Info */}
        <aside className="detail-card detail-card-left">
          {isEditing ? (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">✏️</span>
                Edit Company
              </h2>
              <form onSubmit={handleUpdateCompany} className="edit-form">
                <div className="form-group">
                  <Input
                    label="Company Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Category"
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Technology, Healthcare, Retail"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Website"
                    value={editData.website}
                    onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                    className="form-input"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Address"
                    value={editData.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Textarea
                    label="Notes"
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    className="form-textarea"
                    placeholder="Add notes about this company..."
                  />
                </div>

                <div className="form-actions">
                  <Button type="submit" variant="gold" className="btn-save">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="card-section">
                <h2 className="section-title">
                  <span className="section-icon">🏢</span>
                  Company Information
                </h2>

                <div className="info-field">
                  <span className="field-label">Name</span>
                  <span className="field-value">{company.name}</span>
                </div>

                <div className="info-field">
                  <span className="field-label">Category</span>
                  <span className={`category-badge ${company.category?.toLowerCase() || "other"}`}>
                    {company.category || "Other"}
                  </span>
                </div>

                <div className="info-field">
                  <span className="field-label">Phone</span>
                  <span className="field-value">{formatPhone(company.phone) || "—"}</span>
                </div>

                <div className="info-field">
                  <span className="field-label">Email</span>
                  <span className="field-value">{company.email || "—"}</span>
                </div>

                <div className="info-field">
                  <span className="field-label">Website</span>
                  <span className="field-value">
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="link">
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    ) : "—"}
                  </span>
                </div>

                <div className="info-field">
                  <span className="field-label">Address</span>
                  <span className="field-value">{company.address || "—"}</span>
                </div>

                {company.notes && (
                  <div className="info-field notes-field">
                    <span className="field-label">Notes</span>
                    <span className="field-value notes-text">{company.notes}</span>
                  </div>
                )}

                <div className="info-field">
                  <span className="field-label">Created</span>
                  <span className="field-value">{formatDate(company.createdAt)}</span>
                </div>
              </div>

              {company.googleProfileUrl && (
                <div className="card-section">
                  <h2 className="section-title">
                    <span className="section-icon">📍</span>
                    Google Profile
                  </h2>
                  <div className="google-rating">
                    <span className="rating-stars">⭐</span>
                    <span className="rating-value">{company.googleRating ?? "—"}</span>
                    <span className="rating-reviews">({company.googleReviews ?? 0} reviews)</span>
                  </div>
                  <div className="verification-status">
                    <span className={`status-indicator ${company.googleVerificationStatus?.toLowerCase()}`} />
                    {company.googleVerificationStatus}
                  </div>
                  <a href={company.googleProfileUrl} target="_blank" rel="noreferrer" className="maps-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Open Maps
                  </a>
                </div>
              )}
            </>
          )}
        </aside>

        {/* Middle Column - Leads & Activities */}
        <section className="detail-card detail-card-center">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Leads
              <span className="section-badge">{leads.length}</span>
            </h2>
            {leads.length === 0 ? (
              <div className="empty-leads">
                <p>No leads for this company</p>
                <Button type="button" variant="ghost" size="sm" className="btn-add">
                  + Create Lead
                </Button>
              </div>
            ) : (
              <div className="leads-list">
                {leads.map((lead) => (
                  <Link href={`/leads/${lead.id}`} key={lead.id} className="lead-item">
                    <div className="lead-info">
                      <span className="lead-name">{lead.name}</span>
                      <span className="lead-owner">{lead.ownerEmail}</span>
                    </div>
                    <div className="lead-right">
                      <span className={`stage-badge ${lead.stage.toLowerCase().replace(/\s/g, "-")}`}>
                        {lead.stage}
                      </span>
                      <span className="lead-value">{formatCurrency(lead.value)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">👥</span>
              Contacts
              <span className="section-badge">{contacts.length}</span>
            </h2>
            {contacts.length === 0 ? (
              <div className="empty-contacts">
                <p>No contacts for this company</p>
                <Button type="button" variant="ghost" size="sm" className="btn-add">
                  + Add Contact
                </Button>
              </div>
            ) : (
              <div className="contacts-list">
                {contacts.map((contact) => (
                  <div key={contact.id} className="contact-item">
                    <div className="contact-info">
                      <span className="contact-name">{contact.name}</span>
                      <span className="contact-title">{contact.title}</span>
                    </div>
                    <div className="contact-details">
                      <span className="contact-email">{contact.email}</span>
                      <span className="contact-phone">{formatPhone(contact.phone)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Recent Activity
            </h2>
            <ActivityTimeline activities={activities.slice(0, 5)} />
          </div>
        </section>

        {/* Right Column - Quick Actions & Info */}
        <aside className="detail-card detail-card-right">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h2>
            <div className="actions-grid">
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Add Lead
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Add Contact
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Create Deal
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Schedule Meeting
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Data
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Log Activity
              </Button>
            </div>
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📊</span>
              Company Summary
            </h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Leads</span>
                <span className="summary-value">{leads.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Active Leads</span>
                <span className="summary-value">{activeLeads.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Won Deals</span>
                <span className="summary-value">{wonDeals.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Value</span>
                <span className="summary-value highlight">{formatCurrency(totalDealValue)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Contacts</span>
                <span className="summary-value">{contacts.length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Activities</span>
                <span className="summary-value">{activities.length}</span>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">🏷️</span>
              Tags
            </h2>
            <div className="tags-group">
              {company.tags?.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
              {(!company.tags || company.tags.length === 0) && (
                <span className="no-tags">No tags</span>
              )}
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .company-detail-page {
          padding: 1.5rem;
          position: relative;
          min-height: 100vh;
        }

        /* Background Glows */
        .page-glow-1,
        .page-glow-2 {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .page-glow-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.05) 0%, transparent 70%);
          top: -5%;
          right: -5%;
        }

        .page-glow-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(244, 197, 66, 0.03) 0%, transparent 70%);
          bottom: -5%;
          left: -5%;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1rem;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.04);
          border-top-color: #f4c542;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-state p {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.85rem;
        }

        /* Page Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          flex: 1;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 20px;
          padding: 0.2rem 0.8rem 0.2rem 0.5rem;
          margin-bottom: 0.75rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f4c542;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .badge-text {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.5px;
          flex-wrap: wrap;
        }

        .category-badge {
          padding: 0.15rem 0.7rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .category-badge.technology {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .category-badge.healthcare {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .category-badge.retail {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.15);
        }

        .category-badge.finance {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .category-badge.education {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.15);
        }

        .category-badge.other {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .header-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .meta-icon {
          color: rgba(255, 255, 255, 0.2);
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-edit {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.5) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .btn-action {
          padding: 0.5rem 1rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(244, 197, 66, 0.1);
          transform: translateY(-2px);
        }

        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .stat-icon-wrapper.gold {
          background: rgba(244, 197, 66, 0.08);
          color: #f4c542;
        }

        .stat-icon-wrapper.green {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
        }

        .stat-icon-wrapper.blue {
          background: rgba(66, 133, 244, 0.08);
          color: #4285f4;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
        }

        .stat-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 340px 1fr 340px;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .card-section {
          margin-bottom: 1.25rem;
        }

        .card-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-icon {
          font-size: 1rem;
        }

        .section-badge {
          margin-left: auto;
          font-size: 0.65rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Info Fields */
        .info-field {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          align-items: center;
        }

        .info-field:last-child {
          border-bottom: none;
        }

        .field-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 400;
        }

        .field-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .field-value .link {
          color: #f4c542;
          text-decoration: none;
          font-size: 0.8rem;
          transition: opacity 0.3s;
        }

        .field-value .link:hover {
          opacity: 0.7;
        }

        .notes-text {
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
          font-size: 0.8rem;
        }

        .notes-field {
          flex-direction: column;
          align-items: stretch;
          gap: 0.2rem;
        }

        /* Google Profile */
        .google-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-bottom: 0.3rem;
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
          color: rgba(255, 255, 255, 0.5);
          padding: 0.2rem 0.6rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          margin: 0.3rem 0;
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

        .status-indicator["not-started"] {
          background: rgba(255, 255, 255, 0.2);
        }

        .maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: #f4c542;
          text-decoration: none;
          margin-top: 0.3rem;
          transition: opacity 0.3s;
        }

        .maps-link:hover {
          opacity: 0.7;
        }

        /* Tags */
        .tags-group {
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
          color: rgba(255, 255, 255, 0.6);
        }

        .no-tags {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
          font-style: italic;
        }

        /* Leads List */
        .leads-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .lead-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          text-decoration: none;
          transition: all 0.3s;
          cursor: pointer;
        }

        .lead-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .lead-info {
          display: flex;
          flex-direction: column;
        }

        .lead-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .lead-owner {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .lead-right {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .lead-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f4c542;
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

        .empty-leads {
          text-align: center;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-style: italic;
        }

        /* Contacts List */
        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
        }

        .contact-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .contact-title {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.1rem;
        }

        .contact-email {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .contact-phone {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .empty-contacts {
          text-align: center;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-style: italic;
        }

        .btn-add {
          margin-top: 0.3rem !important;
          color: rgba(244, 197, 66, 0.5) !important;
        }

        .btn-add:hover {
          color: #f4c542 !important;
        }

        /* Edit Form */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group :global(.form-input) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-group :global(.form-textarea) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          min-height: 80px;
          resize: vertical;
          transition: all 0.3s;
        }

        .form-group :global(.form-textarea:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-textarea::placeholder) {
          color: rgba(255, 255, 255, 0.15);
        }

        .form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 0.2rem;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }

        .btn-save {
          padding: 0.5rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3rem;
        }

        .action-btn {
          padding: 0.4rem 0.6rem !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 6px !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 0.7rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.3rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(244, 197, 66, 0.1) !important;
          color: rgba(255, 255, 255, 0.6) !important;
        }

        /* Summary Grid */
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3rem 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .summary-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .summary-value {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .summary-value.highlight {
          color: #f4c542;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }

          .detail-card-left {
            grid-column: 1;
          }

          .detail-card-center {
            grid-column: 2;
          }

          .detail-card-right {
            grid-column: 1 / -1;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .company-detail-page {
            padding: 1rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
          }

          .btn-edit,
          .btn-action {
            flex: 1;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr 1fr;
          }

          .contact-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.2rem;
          }

          .contact-details {
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .header-meta {
            flex-direction: column;
            gap: 0.3rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .detail-card {
            padding: 1rem;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .lead-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }

          .lead-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}