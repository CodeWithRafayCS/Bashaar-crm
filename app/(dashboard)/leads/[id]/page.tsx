"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  createDealFromLead,
  createTask,
  getLeadById,
  getPayments,
  getTasks,
  logActivity,
  moveStage,
  updateLead,
} from "@/lib/api";
import type { Deal, Lead, Payment, Task } from "@/lib/types";
import { formatCurrency, formatDate, formatPhone } from "@/lib/utils/format";
import { ActivityTimeline } from "@/components/activities/ActivityTimeline";
import { useActivities } from "@/lib/hooks/useActivities";
import { useDeals } from "@/lib/hooks/useDeals";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { LEAD_STAGES } from "@/lib/utils/constants";
import { activityFormSchema } from "@/lib/utils/validation";
import { useAppStore } from "@/lib/store";
import { EmptyState } from "@/components/common/EmptyState";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { version, user, pushToast } = useAppStore();
  const { activities } = useActivities(id);
  const { deals } = useDeals();
  const [lead, setLead] = useState<Lead | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [channel, setChannel] = useState("Call");
  const [outcome, setOutcome] = useState("Connected");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    void getLeadById(id).then(setLead);
    void getTasks().then((all) => setTasks(all.filter((t) => t.leadId === id && t.status !== "Completed")));
  }, [id, version]);

  const deal = deals.find((d) => d.leadId === id);

  useEffect(() => {
    if (deal) void getPayments(deal.id).then(setPayments);
  }, [deal, version]);

  if (!lead) {
    return (
      <EmptyState
        title="Lead not found"
        body="It may have been archived. Return to the list and add it back."
        action={<Link href="/leads">Back to leads</Link>}
      />
    );
  }

  async function submitActivity(e: React.FormEvent) {
    e.preventDefault();
    const parsed = activityFormSchema.safeParse({ channel, outcome, notes });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    await logActivity(
      { leadId: id, channel: parsed.data.channel, outcome: parsed.data.outcome, notes: parsed.data.notes },
      user?.email ?? "sarah@bashar.ai",
    );
    setNotes("");
    pushToast("success", "Activity logged");
  }

  async function quickTask() {
    await createTask({
      title: `Follow up: ${lead.company}`,
      leadId: lead.id,
      company: lead.company,
      dueDate: lead.followUpDate,
      priority: lead.priority,
      assigneeEmail: lead.ownerEmail,
    });
    pushToast("success", "Task created");
  }

  return (
    <div className="lead-detail-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Summary Bar */}
      <div className="summary-card">
        <div className="summary-left">
          <div className="company-badge">
            <span className="company-dot" />
            <span className="company-name">{lead.company}</span>
          </div>
          <h1 className="lead-name">{lead.name}</h1>
          <div className="lead-meta">
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {lead.ownerEmail}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatCurrency(lead.value)}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Next: {lead.nextAction}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(lead.followUpDate)}
            </span>
          </div>
          <div className="badge-group">
            <span className={`stage-badge ${lead.stage.toLowerCase().replace(/\s/g, "-")}`}>
              {lead.stage}
            </span>
            <span className={`priority-badge ${lead.priority.toLowerCase()}`}>
              {lead.priority}
            </span>
          </div>
        </div>

        <div className="summary-right">
          <div className="quick-actions-grid">
            <button className="quick-btn quick-btn-call" onClick={() => setChannel("Call")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call
            </button>
            <button className="quick-btn quick-btn-whatsapp" onClick={() => setChannel("WhatsApp")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              WhatsApp
            </button>
            <button className="quick-btn quick-btn-meeting" onClick={() => setChannel("Meeting")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Meeting
            </button>
            <button className="quick-btn quick-btn-task" onClick={() => void quickTask()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Task
            </button>
            <button className="quick-btn quick-btn-deal" onClick={async () => {
              const created = await createDealFromLead(lead.id);
              pushToast("success", created ? "Deal ready" : "Could not create deal");
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Deal
            </button>
          </div>

          <div className="dropdown-wrapper">
            <button className="dropdown-trigger" onClick={() => setMenuOpen((v) => !v)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
              More
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => setChannel("Call")}>Log call</button>
                <button onClick={() => setChannel("WhatsApp")}>Log WhatsApp</button>
                <button onClick={() => setChannel("Meeting")}>Schedule meeting</button>
                <button onClick={() => void quickTask()}>Add task</button>
                <button onClick={() => void createDealFromLead(lead.id)}>Create deal</button>
                <button onClick={() => void moveStage(lead.id, "Won", user?.email ?? "")}>Mark won</button>
                <button onClick={() => void moveStage(lead.id, "Lost", user?.email ?? "")}>Mark lost</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="detail-grid">
        {/* Left Column - Contact Info */}
        <aside className="detail-card detail-card-left">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Contact
            </h2>
            <div className="contact-field">
              <span className="field-label">Name</span>
              <span className="field-value">{lead.title}</span>
            </div>
            <div className="contact-field">
              <span className="field-label">Phone</span>
              <span className="field-value">{formatPhone(lead.phone)}</span>
            </div>
            <div className="contact-field">
              <span className="field-label">Email</span>
              <span className="field-value">{lead.email}</span>
            </div>
            <div className="contact-field">
              <span className="field-label">Address</span>
              <span className="field-value">
                {lead.address}, {lead.city} {lead.zip}
              </span>
            </div>
          </div>

          {lead.googleProfileUrl && (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">📍</span>
                Google Profile
              </h2>
              <div className="google-rating">
                <span className="rating-stars">⭐</span>
                <span className="rating-value">{lead.googleRating ?? "—"}</span>
                <span className="rating-reviews">({lead.googleReviews ?? 0} reviews)</span>
              </div>
              <div className="verification-status">
                <span className={`status-indicator ${lead.googleVerificationStatus?.toLowerCase()}`} />
                {lead.googleVerificationStatus}
              </div>
              <a href={lead.googleProfileUrl} target="_blank" rel="noreferrer" className="maps-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Open Maps
              </a>
            </div>
          )}

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">🏷️</span>
              Tags
            </h2>
            <div className="tags-group">
              {lead.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
              {lead.tags.length === 0 && (
                <span className="no-tags">No tags</span>
              )}
            </div>
            <div className="source-field">
              <span className="field-label">Source</span>
              <span className="field-value">{lead.source}</span>
            </div>
          </div>
        </aside>

        {/* Middle Column - Timeline & Activity */}
        <section className="detail-card detail-card-center">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Timeline
            </h2>
            <ActivityTimeline activities={activities} />
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">✏️</span>
              Log Activity
            </h2>
            <form onSubmit={submitActivity} className="activity-form">
              <div className="form-row">
                <div className="form-group">
                  <Select
                    label="Channel"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    options={["Call", "WhatsApp", "Meeting", "Note"].map((c) => ({ value: c, label: c }))}
                    className="form-select"
                  />
                </div>
                <div className="form-group">
                  <Select
                    label="Outcome"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    options={["Connected", "No answer", "Voicemail", "Completed", "Qualified"].map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    className="form-select"
                  />
                </div>
              </div>
              <div className="form-group">
                <Textarea 
                  label="Notes" 
                  value={notes} 
                  error={errors.notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                  placeholder="Enter notes..."
                />
              </div>
              <Button type="submit" variant="gold" className="btn-submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save log
              </Button>
            </form>
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">🔄</span>
              Move Stage
            </h2>
            <select
              value={lead.stage}
              onChange={(e) => void moveStage(lead.id, e.target.value as Lead["stage"], user?.email ?? "")}
              className="stage-select"
            >
              {LEAD_STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Right Column - Tasks & Deal */}
        <aside className="detail-card detail-card-right">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">✅</span>
              Open Tasks
            </h2>
            {tasks.length === 0 ? (
              <div className="empty-tasks">
                <p>No open tasks</p>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map((t) => (
                  <div key={t.id} className="task-item">
                    <span className="task-dot" />
                    <div className="task-info">
                      <span className="task-title">{t.title}</span>
                      <span className="task-date">{formatDate(t.dueDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Next Meeting
            </h2>
            <div className="meeting-info">
              {activities.find((a) => a.channel === "Meeting") ? (
                <p>{activities.find((a) => a.channel === "Meeting")!.notes}</p>
              ) : (
                <p className="no-meeting">None scheduled</p>
              )}
            </div>
          </div>

          {deal?.proposalStatus && (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">📄</span>
                Proposal
              </h2>
              <div className="proposal-status">
                <span className={`proposal-badge ${deal.proposalStatus.toLowerCase()}`}>
                  {deal.proposalStatus}
                </span>
              </div>
            </div>
          )}

          {deal && (deal.won || deal.stage === "Won") && (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">💰</span>
                Payments
              </h2>
              {payments.length === 0 ? (
                <p className="no-payments">No payments recorded</p>
              ) : (
                <div className="payments-list">
                  {payments.map((p) => (
                    <div key={p.id} className="payment-item">
                      <span className="payment-amount">{formatCurrency(p.amount)}</span>
                      <span className={`payment-status ${p.status.toLowerCase()}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            className="btn-save-action"
            onClick={() =>
              void updateLead(lead.id, {
                nextAction: "Updated from detail",
              })
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save next action note
          </Button>
        </aside>
      </div>

      <style jsx>{`
        .lead-detail-page {
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

        /* Summary Card */
        .summary-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          flex-wrap: wrap;
        }

        .summary-left {
          flex: 1;
          min-width: 280px;
        }

        .company-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 197, 66, 0.08);
          border: 1px solid rgba(244, 197, 66, 0.1);
          border-radius: 20px;
          padding: 0.2rem 0.8rem 0.2rem 0.5rem;
          margin-bottom: 0.5rem;
        }

        .company-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f4c542;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        .company-name {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .lead-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
        }

        .lead-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem 1.5rem;
          margin-bottom: 0.75rem;
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

        .badge-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stage-badge {
          padding: 0.2rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
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

        .priority-badge {
          padding: 0.2rem 0.8rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .priority-badge.high {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.15);
        }

        .priority-badge.medium {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.15);
        }

        .priority-badge.low {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .summary-right {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.3rem;
        }

        .quick-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.4rem 0.3rem;
          border: none;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .quick-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .quick-btn-call:hover {
          border-color: rgba(244, 197, 66, 0.3);
          color: #f4c542;
        }

        .quick-btn-whatsapp:hover {
          border-color: rgba(37, 211, 102, 0.3);
          color: #25d366;
        }

        .quick-btn-meeting:hover {
          border-color: rgba(66, 133, 244, 0.3);
          color: #4285f4;
        }

        .quick-btn-task:hover {
          border-color: rgba(255, 193, 7, 0.3);
          color: #ffc107;
        }

        .quick-btn-deal:hover {
          border-color: rgba(0, 200, 83, 0.3);
          color: #00c853;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.4rem;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.7);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.3rem;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 0.3rem;
          min-width: 160px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          z-index: 10;
        }

        .dropdown-menu button {
          display: block;
          width: 100%;
          padding: 0.5rem 0.8rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-weight: 400;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 6px;
          font-family: inherit;
        }

        .dropdown-menu button:hover {
          background: rgba(244, 197, 66, 0.08);
          color: #f4c542;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 320px 1fr 320px;
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

        /* Contact Fields */
        .contact-field {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .contact-field:last-child {
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
          margin-bottom: 0.5rem;
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

        .source-field {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          margin-top: 0.3rem;
          padding-top: 0.5rem;
        }

        /* Activity Form */
        .activity-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .form-group :global(.form-select) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          width: 100%;
          transition: all 0.3s;
        }

        .form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-select option) {
          background: #1a1a1a;
          color: #ffffff;
        }

        .form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .form-group :global(.form-textarea) {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          width: 100%;
          min-height: 60px;
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

        .btn-submit {
          padding: 0.5rem 1rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.8rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          font-family: inherit !important;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Stage Select */
        .stage-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.6rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }

        .stage-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .stage-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Tasks List */
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s;
        }

        .task-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .task-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffc107;
          flex-shrink: 0;
        }

        .task-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex: 1;
          gap: 0.5rem;
        }

        .task-title {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .task-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .empty-tasks {
          text-align: center;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-style: italic;
        }

        /* Meeting Info */
        .meeting-info p {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .no-meeting {
          color: rgba(255, 255, 255, 0.2) !important;
          font-style: italic;
        }

        /* Proposal */
        .proposal-badge {
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .proposal-badge.sent {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .proposal-badge.accepted {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .proposal-badge.rejected {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.15);
        }

        .proposal-badge.draft {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Payments */
        .payments-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .payment-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.3rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }

        .payment-amount {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f4c542;
        }

        .payment-status {
          font-size: 0.65rem;
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .payment-status.completed {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
        }

        .payment-status.pending {
          background: rgba(255, 193, 7, 0.08);
          color: #ffc107;
        }

        .payment-status.failed {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .no-payments {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
          font-style: italic;
        }

        /* Save Action Button */
        .btn-save-action {
          width: 100% !important;
          padding: 0.4rem 0.8rem !important;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.04) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.3) !important;
          font-size: 0.75rem !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.4rem !important;
          font-family: inherit !important;
          margin-top: 0.5rem;
        }

        .btn-save-action:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(244, 197, 66, 0.1) !important;
          color: rgba(255, 255, 255, 0.6) !important;
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
        }

        @media (max-width: 768px) {
          .lead-detail-page {
            padding: 1rem;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .summary-card {
            flex-direction: column;
          }

          .summary-right {
            width: 100%;
            min-width: unset;
          }

          .quick-actions-grid {
            grid-template-columns: repeat(5, 1fr);
          }

          .lead-name {
            font-size: 1.4rem;
          }

          .lead-meta {
            gap: 0.5rem 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .quick-actions-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .summary-left {
            min-width: unset;
          }

          .lead-name {
            font-size: 1.2rem;
          }

          .meta-item {
            font-size: 0.75rem;
          }

          .detail-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}