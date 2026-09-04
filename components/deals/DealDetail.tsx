"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal, Payment, Product, Lead } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
  DollarSign,
  Calendar,
  User,
  FileText,
  CreditCard,
  Package,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";

interface DealDetailsProps {
  deal: Deal;
  lead?: Lead;
  payments?: Payment[];
  products?: Product[];
  loading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddPayment?: () => void;
  onAddProduct?: () => void;
  onUpdateStage?: (stage: string) => void;
  onBack?: () => void;
}

const STAGE_ORDER = [
  "New",
  "Attempted",
  "Connected",
  "Interested",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

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

const STAGE_ICONS: Record<string, React.ReactNode> = {
  "New": <Clock className="w-4 h-4" />,
  "Attempted": <Clock className="w-4 h-4" />,
  "Connected": <CheckCircle className="w-4 h-4" />,
  "Interested": <TrendingUp className="w-4 h-4" />,
  "Meeting Scheduled": <Calendar className="w-4 h-4" />,
  "Proposal Sent": <FileText className="w-4 h-4" />,
  "Negotiation": <AlertCircle className="w-4 h-4" />,
  "Won": <CheckCircle className="w-4 h-4" />,
  "Lost": <XCircle className="w-4 h-4" />,
};

export function DealDetails({
  deal,
  lead,
  payments = [],
  products = [],
  loading = false,
  onEdit,
  onDelete,
  onAddPayment,
  onAddProduct,
  onUpdateStage,
  onBack,
}: DealDetailsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "payments">("overview");

  const totalPaid = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const remaining = deal.value - totalPaid;
  const isWon = deal.stage === "Won" || deal.won;
  const isLost = deal.stage === "Lost";

  const getStageIndex = (stage: string) => {
    const index = STAGE_ORDER.indexOf(stage);
    return index === -1 ? 0 : index;
  };

  const currentStageIndex = getStageIndex(deal.stage);
  const progress = Math.min((currentStageIndex / (STAGE_ORDER.length - 1)) * 100, 100);

  if (loading) {
    return (
      <div className="deal-details-loading">
        <LoadingSpinner label="Loading deal details..." size="lg" />
      </div>
    );
  }

  return (
    <div className="deal-details">
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
          <div className="deal-icon-wrapper">
            <DollarSign className="deal-icon" />
          </div>
          <div className="deal-info">
            <h1 className="deal-name">{deal.name}</h1>
            <div className="deal-meta">
              <span className={`stage-badge ${deal.stage.toLowerCase().replace(/\s/g, "-")}`}>
                {deal.stage}
              </span>
              <span className="meta-item">
                <User className="meta-icon" />
                {deal.ownerEmail}
              </span>
              <span className="meta-item">
                <Calendar className="meta-icon" />
                {deal.expectedClose ? formatDate(deal.expectedClose) : "No close date"}
              </span>
              {lead && (
                <Link href={`/leads/${lead.id}`} className="meta-link">
                  View Lead →
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={onEdit}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Value Cards */}
      <div className="value-cards">
        <div className="value-card">
          <span className="value-label">Total Value</span>
          <span className="value-amount gold">{formatCurrency(deal.value)}</span>
        </div>
        <div className="value-card">
          <span className="value-label">Paid</span>
          <span className="value-amount green">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="value-card">
          <span className="value-label">Remaining</span>
          <span className={`value-amount ${remaining > 0 ? "gold" : "green"}`}>
            {remaining > 0 ? formatCurrency(remaining) : "Fully Paid ✓"}
          </span>
        </div>
        <div className="value-card">
          <span className="value-label">Progress</span>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="details-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <FileText className="tab-icon" />
          Overview
        </button>
        <button
          className={`tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          <Package className="tab-icon" />
          Products ({products.length})
        </button>
        <button
          className={`tab ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          <CreditCard className="tab-icon" />
          Payments ({payments.length})
        </button>
      </div>

      {/* Content */}
      <div className="details-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            {/* Deal Info */}
            <div className="info-card">
              <h3 className="card-title">Deal Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{deal.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Stage</span>
                  <div className="info-value">
                    <select
                      value={deal.stage}
                      onChange={(e) => onUpdateStage?.(e.target.value)}
                      className="stage-select"
                    >
                      {STAGE_ORDER.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label">Value</span>
                  <span className="info-value gold">{formatCurrency(deal.value)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Expected Close</span>
                  <span className="info-value">
                    {deal.expectedClose ? formatDate(deal.expectedClose) : "Not set"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Proposal Status</span>
                  <span className={`proposal-badge ${deal.proposalStatus?.toLowerCase() || "draft"}`}>
                    {deal.proposalStatus || "Draft"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Owner</span>
                  <span className="info-value">{deal.ownerEmail}</span>
                </div>
                {lead && (
                  <div className="info-item">
                    <span className="info-label">Related Lead</span>
                    <Link href={`/leads/${lead.id}`} className="info-link">
                      {lead.name} ({lead.company})
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Created</span>
                  <span className="info-value">{formatDate(deal.createdAt)}</span>
                </div>
                {deal.updatedAt && (
                  <div className="info-item">
                    <span className="info-label">Updated</span>
                    <span className="info-value">{formatDate(deal.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="info-card status-card">
              <h3 className="card-title">Status</h3>
              {isWon ? (
                <div className="status-won">
                  <CheckCircle className="status-icon" />
                  <span className="status-text">Deal Won</span>
                  {deal.wonDate && (
                    <span className="status-date">Won on {formatDate(deal.wonDate)}</span>
                  )}
                </div>
              ) : isLost ? (
                <div className="status-lost">
                  <XCircle className="status-icon" />
                  <span className="status-text">Deal Lost</span>
                  {deal.lostReason && (
                    <span className="status-reason">Reason: {deal.lostReason}</span>
                  )}
                  {deal.lostDate && (
                    <span className="status-date">Lost on {formatDate(deal.lostDate)}</span>
                  )}
                </div>
              ) : (
                <div className="status-active">
                  <div className="status-progress">
                    <span className="status-label">Stage Progress</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="status-stage">{deal.stage}</span>
                  </div>
                </div>
              )}

              {deal.notes && (
                <div className="status-notes">
                  <span className="notes-label">Notes</span>
                  <p className="notes-text">{deal.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="info-card actions-card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="actions-grid">
                {onAddPayment && (
                  <Button variant="ghost" onClick={onAddPayment} className="action-btn">
                    <CreditCard className="w-4 h-4" />
                    Add Payment
                  </Button>
                )}
                {onAddProduct && (
                  <Button variant="ghost" onClick={onAddProduct} className="action-btn">
                    <Package className="w-4 h-4" />
                    Add Product
                  </Button>
                )}
                {!isWon && !isLost && onUpdateStage && (
                  <>
                    <Button 
                      variant="success" 
                      onClick={() => onUpdateStage("Won")} 
                      className="action-btn"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Won
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => onUpdateStage("Lost")} 
                      className="action-btn"
                    >
                      <XCircle className="w-4 h-4" />
                      Mark Lost
                    </Button>
                  </>
                )}
                {deal.proposalStatus && deal.proposalStatus !== "Sent" && (
                  <Button variant="gold" className="action-btn">
                    <FileText className="w-4 h-4" />
                    Send Proposal
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="tab-content">
            {products.length === 0 ? (
              <EmptyState
                title="No products added"
                body="Add products to this deal"
                action={
                  onAddProduct && (
                    <Button variant="gold" onClick={onAddProduct}>
                      <Plus className="w-4 h-4" />
                      Add Product
                    </Button>
                  )
                }
              />
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-header">
                      <Package className="product-icon" />
                      <span className="product-name">{product.name}</span>
                    </div>
                    <div className="product-body">
                      {product.description && (
                        <p className="product-description">{product.description}</p>
                      )}
                      <div className="product-footer">
                        <span className="product-price">{formatCurrency(product.price)}</span>
                        <span className={`product-status ${product.active ? "active" : "inactive"}`}>
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="tab-content">
            {payments.length === 0 ? (
              <EmptyState
                title="No payments recorded"
                body="Record payments for this deal"
                action={
                  onAddPayment && (
                    <Button variant="gold" onClick={onAddPayment}>
                      <Plus className="w-4 h-4" />
                      Add Payment
                    </Button>
                  )
                }
              />
            ) : (
              <div className="payments-list">
                <div className="payments-header">
                  <span className="payments-title">Payment History</span>
                  <span className="payments-total">
                    Total: {formatCurrency(totalPaid)} / {formatCurrency(deal.value)}
                  </span>
                </div>
                <div className="payments-table-wrapper">
                  <table className="payments-table">
                    <thead>
                      <tr>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className={payment.status === "Completed" ? "completed" : ""}>
                          <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                          <td>{payment.method}</td>
                          <td>
                            <span className={`payment-status ${payment.status.toLowerCase()}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td>{formatDate(payment.date)}</td>
                          <td className="reference-cell">{payment.reference || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .deal-details {
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
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .deal-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(244, 197, 66, 0.06);
          border-radius: 12px;
          border: 1px solid rgba(244, 197, 66, 0.08);
        }

        .deal-icon {
          width: 24px;
          height: 24px;
          color: #f4c542;
        }

        .deal-info {
          flex: 1;
        }

        .deal-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.2rem 0;
        }

        .deal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .stage-badge {
          padding: 0.1rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
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

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.25);
        }

        .meta-icon {
          width: 14px;
          height: 14px;
        }

        .meta-link {
          font-size: 0.75rem;
          color: rgba(244, 197, 66, 0.4);
          text-decoration: none;
          transition: color 0.3s;
        }

        .meta-link:hover {
          color: #f4c542;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        /* Value Cards */
        .value-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .value-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.75rem 1rem;
        }

        .value-label {
          display: block;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .value-amount {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .value-amount.gold {
          color: #f4c542;
        }

        .value-amount.green {
          color: #00c853;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f4c542, #d4a030);
          border-radius: 3px;
          transition: width 0.5s;
        }

        .progress-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.3);
          min-width: 40px;
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

        .info-card.actions-card {
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
          gap: 0.4rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .info-value {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .info-value.gold {
          color: #f4c542;
        }

        .stage-select {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          padding: 0.1rem 0.3rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          font-family: inherit;
          cursor: pointer;
        }

        .stage-select:focus {
          outline: none;
          border-color: #f4c542;
        }

        .stage-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .proposal-badge {
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          font-size: 0.65rem;
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
          border: 1px solid rgba(66, 133, 244, 0.12);
        }

        .proposal-badge.accepted {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .proposal-badge.rejected {
          background: rgba(255, 68, 68, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 68, 68, 0.12);
        }

        .info-link {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.8rem;
          color: rgba(244, 197, 66, 0.5);
          text-decoration: none;
          transition: color 0.3s;
        }

        .info-link:hover {
          color: #f4c542;
        }

        /* Status Card */
        .status-won,
        .status-lost,
        .status-active {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
        }

        .status-won .status-icon {
          color: #00c853;
          width: 32px;
          height: 32px;
        }

        .status-lost .status-icon {
          color: #ff4444;
          width: 32px;
          height: 32px;
        }

        .status-text {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 0.2rem;
        }

        .status-won .status-text {
          color: #00c853;
        }

        .status-lost .status-text {
          color: #ff4444;
        }

        .status-date,
        .status-reason {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .status-progress {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .status-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .status-stage {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
        }

        .status-notes {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .notes-label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .notes-text {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0.2rem 0 0 0;
          line-height: 1.5;
        }

        /* Actions Grid */
        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.3rem;
        }

        .action-btn {
          justify-content: center !important;
          width: 100% !important;
        }

        .action-btn :global(.btn-success) {
          background: rgba(0, 200, 83, 0.06) !important;
          color: #00c853 !important;
          border: 1px solid rgba(0, 200, 83, 0.08) !important;
        }

        .action-btn :global(.btn-success):hover {
          background: rgba(0, 200, 83, 0.1) !important;
        }

        .action-btn :global(.btn-gold) {
          background: rgba(244, 197, 66, 0.06) !important;
          color: #f4c542 !important;
          border: 1px solid rgba(244, 197, 66, 0.08) !important;
        }

        .action-btn :global(.btn-gold):hover {
          background: rgba(244, 197, 66, 0.1) !important;
        }

        /* Products */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 1rem;
        }

        .product-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.3rem;
        }

        .product-icon {
          width: 20px;
          height: 20px;
          color: rgba(244, 197, 66, 0.3);
        }

        .product-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .product-description {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.2);
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.3rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .product-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: #f4c542;
        }

        .product-status {
          font-size: 0.6rem;
          padding: 0.05rem 0.4rem;
          border-radius: 3px;
        }

        .product-status.active {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .product-status.inactive {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.2);
        }

        /* Payments */
        .payments-list {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          overflow: hidden;
        }

        .payments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .payments-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
        }

        .payments-total {
          font-size: 0.8rem;
          font-weight: 600;
          color: #f4c542;
        }

        .payments-table-wrapper {
          overflow-x: auto;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }

        .payments-table th {
          padding: 0.5rem 1rem;
          text-align: left;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .payments-table td {
          padding: 0.4rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.5);
        }

        .payments-table tbody tr.completed {
          background: rgba(0, 200, 83, 0.02);
        }

        .payments-table .amount-cell {
          font-weight: 600;
          color: #f4c542;
        }

        .payment-status {
          padding: 0.1rem 0.4rem;
          border-radius: 3px;
          font-size: 0.65rem;
          font-weight: 500;
        }

        .payment-status.completed {
          background: rgba(0, 200, 83, 0.06);
          color: #00c853;
        }

        .payment-status.pending {
          background: rgba(255, 193, 7, 0.06);
          color: #ffc107;
        }

        .payment-status.failed {
          background: rgba(255, 68, 68, 0.06);
          color: #ff4444;
        }

        .reference-cell {
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.7rem;
        }

        /* Loading */
        .deal-details-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .value-cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .info-card.actions-card {
            grid-column: 1;
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

          .deal-name {
            font-size: 1.2rem;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions :global(.btn-ghost),
          .header-actions :global(.btn-danger) {
            flex: 1;
            justify-content: center;
          }

          .value-cards {
            grid-template-columns: 1fr 1fr;
          }

          .value-amount {
            font-size: 0.9rem;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: center;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .value-cards {
            grid-template-columns: 1fr;
          }

          .deal-name {
            font-size: 1rem;
          }

          .deal-meta {
            gap: 0.3rem;
          }

          .info-card {
            padding: 1rem;
          }

          .payments-table {
            font-size: 0.7rem;
          }

          .payments-table th,
          .payments-table td {
            padding: 0.3rem 0.5rem;
          }

          .header-actions :global(.btn-ghost),
          .header-actions :global(.btn-danger) {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
}