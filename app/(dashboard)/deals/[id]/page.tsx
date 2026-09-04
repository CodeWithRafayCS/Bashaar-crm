"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getDealById,
  getPayments,
  getProducts,
  updateDeal,
  updateDealStage,
  updateDealProposal,
} from "@/lib/api";
import type { Deal, Payment, Product } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { Select } from "@/components/common/Select";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { EmptyState } from "@/components/common/EmptyState";
import { DEAL_STAGES } from "@/lib/utils/constants";

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { version, user, pushToast } = useAppStore();
  const [deal, setDeal] = useState<Deal | undefined>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editExpectedClose, setEditExpectedClose] = useState("");
  const [editProposalStatus, setEditProposalStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dealData, paymentsData, productsData] = await Promise.all([
          getDealById(id),
          getPayments(id),
          getProducts(),
        ]);
        setDeal(dealData);
        setPayments(paymentsData);
        setProducts(productsData);
        if (dealData) {
          setEditValue(dealData.value.toString());
          setEditExpectedClose(dealData.expectedClose || "");
          setEditProposalStatus(dealData.proposalStatus || "Draft");
          setEditNotes(dealData.notes || "");
        }
      } catch (error) {
        pushToast("error", "Failed to load deal");
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
        <p>Loading deal...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <EmptyState
        title="Deal not found"
        body="It may have been archived or deleted."
        action={<Link href="/deals">Back to deals</Link>}
      />
    );
  }

  async function handleUpdateDeal(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateDeal(deal.id, {
        value: parseFloat(editValue),
        expectedClose: editExpectedClose,
        proposalStatus: editProposalStatus as Deal["proposalStatus"],
        notes: editNotes,
      });
      setDeal((prev) => prev ? {
        ...prev,
        value: parseFloat(editValue),
        expectedClose: editExpectedClose,
        proposalStatus: editProposalStatus as Deal["proposalStatus"],
        notes: editNotes,
      } : undefined);
      setIsEditing(false);
      pushToast("success", "Deal updated");
    } catch (error) {
      pushToast("error", "Failed to update deal");
    }
  }

  async function handleStageChange(newStage: string) {
    try {
      await updateDealStage(deal.id, newStage);
      setDeal((prev) => prev ? { ...prev, stage: newStage } : undefined);
      pushToast("success", `Stage updated to ${newStage}`);
    } catch (error) {
      pushToast("error", "Failed to update stage");
    }
  }

  const totalPaid = payments.reduce((sum, p) => p.status === "Completed" ? sum + p.amount : sum, 0);
  const remaining = deal.value - totalPaid;

  return (
    <div className="deal-detail-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Deal</span>
          </div>
          <h1 className="page-title">
            {deal.name}
            <span className={`stage-badge ${deal.stage.toLowerCase().replace(/\s/g, "-")}`}>
              {deal.stage}
            </span>
          </h1>
          <div className="header-meta">
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {deal.ownerEmail}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatCurrency(deal.value)}
            </span>
            <span className="meta-item">
              <svg className="meta-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {deal.expectedClose ? formatDate(deal.expectedClose) : "No close date"}
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
          <Button type="button" variant="gold" className="btn-export" onClick={() => {
            pushToast("success", "Deal exported");
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

      {/* Main Content Grid */}
      <div className="detail-grid">
        {/* Left Column - Deal Info */}
        <aside className="detail-card detail-card-left">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📊</span>
              Deal Information
            </h2>

            <div className="info-field">
              <span className="field-label">Lead</span>
              <span className="field-value">
                <Link href={`/leads/${deal.leadId}`} className="link">
                  View Lead →
                </Link>
              </span>
            </div>

            <div className="info-field">
              <span className="field-label">Stage</span>
              <div className="field-value">
                <Select
                  value={deal.stage}
                  onChange={(e) => handleStageChange(e.target.value)}
                  options={DEAL_STAGES.map((s) => ({ value: s, label: s }))}
                  className="stage-select-inline"
                />
              </div>
            </div>

            <div className="info-field">
              <span className="field-label">Value</span>
              <span className="field-value highlight">{formatCurrency(deal.value)}</span>
            </div>

            <div className="info-field">
              <span className="field-label">Expected Close</span>
              <span className="field-value">{deal.expectedClose ? formatDate(deal.expectedClose) : "Not set"}</span>
            </div>

            <div className="info-field">
              <span className="field-label">Proposal Status</span>
              <span className={`proposal-badge ${deal.proposalStatus?.toLowerCase() || "draft"}`}>
                {deal.proposalStatus || "Draft"}
              </span>
            </div>

            <div className="info-field">
              <span className="field-label">Owner</span>
              <span className="field-value">{deal.ownerEmail}</span>
            </div>

            <div className="info-field">
              <span className="field-label">Created</span>
              <span className="field-value">{formatDate(deal.createdAt)}</span>
            </div>

            {deal.notes && (
              <div className="info-field notes-field">
                <span className="field-label">Notes</span>
                <span className="field-value notes-text">{deal.notes}</span>
              </div>
            )}
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">💰</span>
              Payment Summary
            </h2>
            <div className="payment-summary">
              <div className="summary-item">
                <span className="summary-label">Total Deal Value</span>
                <span className="summary-value">{formatCurrency(deal.value)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Paid</span>
                <span className="summary-value paid">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Remaining</span>
                <span className={`summary-value ${remaining > 0 ? "remaining" : "fully-paid"}`}>
                  {remaining > 0 ? formatCurrency(remaining) : "Fully Paid ✓"}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${deal.value > 0 ? (totalPaid / deal.value) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {deal.won && (
            <div className="card-section won-section">
              <div className="won-badge">🏆 Deal Won</div>
            </div>
          )}

          {deal.stage === "Lost" && (
            <div className="card-section lost-section">
              <div className="lost-badge">❌ Deal Lost</div>
              <div className="lost-reason">
                <span className="field-label">Reason</span>
                <span className="field-value">{deal.lostReason || "Not specified"}</span>
              </div>
            </div>
          )}
        </aside>

        {/* Middle Column - Edit Form */}
        <section className="detail-card detail-card-center">
          {isEditing ? (
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">✏️</span>
                Edit Deal
              </h2>
              <form onSubmit={handleUpdateDeal} className="edit-form">
                <div className="form-group">
                  <Input
                    label="Value"
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Input
                    label="Expected Close Date"
                    type="date"
                    value={editExpectedClose}
                    onChange={(e) => setEditExpectedClose(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <Select
                    label="Proposal Status"
                    value={editProposalStatus}
                    onChange={(e) => setEditProposalStatus(e.target.value)}
                    options={["Draft", "Sent", "Viewed", "Negotiating", "Accepted", "Rejected"].map((s) => ({
                      value: s,
                      label: s,
                    }))}
                    className="form-select"
                  />
                </div>

                <div className="form-group">
                  <Textarea
                    label="Notes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="form-textarea"
                    placeholder="Add notes about this deal..."
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
            <div className="card-section">
              <h2 className="section-title">
                <span className="section-icon">📋</span>
                Deal Details
              </h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Lead</span>
                  <span className="detail-value">
                    <Link href={`/leads/${deal.leadId}`} className="link">
                      View Associated Lead
                    </Link>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stage</span>
                  <span className={`stage-badge ${deal.stage.toLowerCase().replace(/\s/g, "-")}`}>
                    {deal.stage}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Value</span>
                  <span className="detail-value highlight">{formatCurrency(deal.value)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expected Close</span>
                  <span className="detail-value">{deal.expectedClose ? formatDate(deal.expectedClose) : "Not set"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Proposal Status</span>
                  <span className={`proposal-badge ${deal.proposalStatus?.toLowerCase() || "draft"}`}>
                    {deal.proposalStatus || "Draft"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Owner</span>
                  <span className="detail-value">{deal.ownerEmail}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Notes</span>
                  <span className="detail-value notes-text">{deal.notes || "No notes"}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column - Products & Payments */}
        <aside className="detail-card detail-card-right">
          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">📦</span>
              Products
            </h2>
            {products.length === 0 ? (
              <div className="empty-products">
                <p>No products added to this deal</p>
                <Button type="button" variant="ghost" size="sm" className="btn-add-product">
                  + Add Product
                </Button>
              </div>
            ) : (
              <div className="products-list">
                {products.map((p) => (
                  <div key={p.id} className="product-item">
                    <div className="product-info">
                      <span className="product-name">{p.name}</span>
                      <span className="product-description">{p.description}</span>
                    </div>
                    <span className="product-price">{formatCurrency(p.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-section">
            <h2 className="section-title">
              <span className="section-icon">💳</span>
              Payments
              <span className="section-badge">{payments.length}</span>
            </h2>
            {payments.length === 0 ? (
              <div className="empty-payments">
                <p>No payments recorded</p>
                <Button type="button" variant="ghost" size="sm" className="btn-add-payment">
                  + Record Payment
                </Button>
              </div>
            ) : (
              <div className="payments-list">
                {payments.map((p) => (
                  <div key={p.id} className="payment-item">
                    <div className="payment-info">
                      <span className={`payment-status-badge ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                      <span className="payment-method">{p.method}</span>
                      <span className="payment-date">{formatDate(p.date)}</span>
                    </div>
                    <span className="payment-amount">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-section actions-section">
            <h2 className="section-title">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h2>
            <div className="actions-grid">
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Add Payment
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Generate Proposal
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Deal
              </Button>
              <Button type="button" variant="ghost" className="action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Assign Owner
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .deal-detail-page {
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

        .btn-export {
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

        .btn-export:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        /* Detail Grid */
        .detail-grid {
          display: grid;
          grid-template-columns: 320px 1fr 360px;
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

        .field-value.highlight {
          color: #f4c542;
          font-weight: 600;
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

        .stage-select-inline {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
        }

        .stage-select-inline:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .stage-select-inline option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .proposal-badge {
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .proposal-badge.draft {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .proposal-badge.sent {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .proposal-badge.viewed {
          background: rgba(66, 133, 244, 0.08);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.12);
        }

        .proposal-badge.negotiating {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.15);
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

        /* Payment Summary */
        .payment-summary {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem 0;
        }

        .summary-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .summary-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .summary-value.paid {
          color: #00c853;
        }

        .summary-value.remaining {
          color: #f4c542;
        }

        .summary-value.fully-paid {
          color: #00c853;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 2px;
          margin-top: 0.3rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f4c542, #d4a030);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        /* Won/Lost Sections */
        .won-section {
          background: rgba(0, 200, 83, 0.04);
          border: 1px solid rgba(0, 200, 83, 0.08);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .won-badge {
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: #00c853;
        }

        .lost-section {
          background: rgba(255, 68, 68, 0.04);
          border: 1px solid rgba(255, 68, 68, 0.08);
          border-radius: 8px;
          padding: 0.75rem;
        }

        .lost-badge {
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: #ff4444;
          margin-bottom: 0.3rem;
        }

        .lost-reason {
          display: flex;
          justify-content: space-between;
          padding: 0.2rem 0;
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

        .form-group :global(.form-select) {
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

        .form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .form-group :global(.form-select option) {
          background: #1a1a1a;
          color: #ffffff;
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

        /* Details Grid */
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding: 0.3rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .detail-value {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-value.highlight {
          color: #f4c542;
          font-weight: 600;
        }

        .detail-value .link {
          color: #f4c542;
          text-decoration: none;
          font-size: 0.8rem;
          transition: opacity 0.3s;
        }

        .detail-value .link:hover {
          opacity: 0.7;
        }

        .detail-value.notes-text {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          font-size: 0.8rem;
        }

        /* Products */
        .products-list {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .product-description {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .product-price {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f4c542;
        }

        .empty-products {
          text-align: center;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-style: italic;
        }

        .btn-add-product {
          margin-top: 0.3rem !important;
          color: rgba(244, 197, 66, 0.5) !important;
        }

        .btn-add-product:hover {
          color: #f4c542 !important;
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
          padding: 0.4rem 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .payment-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .payment-status-badge {
          font-size: 0.6rem;
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .payment-status-badge.completed {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
        }

        .payment-status-badge.pending {
          background: rgba(255, 193, 7, 0.08);
          color: #ffc107;
        }

        .payment-status-badge.failed {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .payment-method {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .payment-date {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .payment-amount {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f4c542;
        }

        .empty-payments {
          text-align: center;
          padding: 0.5rem;
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-style: italic;
        }

        .btn-add-payment {
          margin-top: 0.3rem !important;
          color: rgba(244, 197, 66, 0.5) !important;
        }

        .btn-add-payment:hover {
          color: #f4c542 !important;
        }

        /* Actions */
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

          .actions-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .deal-detail-page {
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
          .btn-export {
            flex: 1;
            justify-content: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr 1fr;
          }

          .summary-right {
            width: 100%;
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

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .detail-card {
            padding: 1rem;
          }

          .payment-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }

          .product-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }
        }
      `}</style>
    </div>
  );
}