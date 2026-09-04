"use client";

import { useMemo, useState } from "react";
import { DealList } from "@/components/deals/DealList";
import { DealMetrics } from "@/components/deals/DealMetrics";
import { useDeals } from "@/lib/hooks/useDeals";
import { getPayments, getProducts, markDealOutcome } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { LEAD_STAGES } from "@/lib/utils/constants";
import { useEffect } from "react";
import type { Payment, Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { AddLeadModal } from "@/components/leads/AddLeadModal";

export default function DealsPage() {
  const { deals } = useDeals();
  const { users, pushToast } = useAppStore();
  const [stage, setStage] = useState("");
  const [owner, setOwner] = useState("");
  const [tab, setTab] = useState<"list" | "products" | "payments">("list");
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    void getProducts().then(setProducts);
    void getPayments().then(setPayments);
  }, []);

  const filtered = useMemo(
    () => deals.filter((d) => (stage ? d.stage === stage : true) && (owner ? d.ownerEmail === owner : true)),
    [deals, stage, owner],
  );

  return (
    <div className="deals-page">
      {/* Animated background glow */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Revenue</span>
          </div>
          <h1 className="page-title">
            Deals
            <span className="title-count">{filtered.length}</span>
          </h1>
          <p className="page-subtitle">Track and manage your revenue opportunities</p>
        </div>
        <Button type="button" variant="gold" className="btn-create" onClick={() => setAddOpen(true)}>
          <svg className="create-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create from lead
        </Button>
      </header>

      <DealMetrics deals={filtered} />

      <div className="filters-section">
        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <select value={stage} onChange={(e) => setStage(e.target.value)} aria-label="Stage" className="filter-select">
            <option value="">All stages</option>
            {LEAD_STAGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <select value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Owner" className="filter-select">
            <option value="">All owners</option>
            {users.map((u) => (
              <option key={u.email} value={u.email}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-clear">
          {(stage || owner) && (
            <button 
              className="clear-btn"
              onClick={() => {
                setStage("");
                setOwner("");
              }}
            >
              Clear filters ✕
            </button>
          )}
        </div>
      </div>

      <div className="tabs-section">
        <div className="tabs" role="tablist">
          <button 
            type="button" 
            className={`tab ${tab === "list" ? "active" : ""}`} 
            onClick={() => setTab("list")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Deals
          </button>
          <button 
            type="button" 
            className={`tab ${tab === "products" ? "active" : ""}`} 
            onClick={() => setTab("products")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Products
          </button>
          <button 
            type="button" 
            className={`tab ${tab === "payments" ? "active" : ""}`} 
            onClick={() => setTab("payments")}
          >
            <svg className="tab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Payments
          </button>
        </div>
      </div>

      {tab === "list" ? (
        <>
          <div className="deals-container">
            <DealList deals={filtered} />
          </div>
          {filtered.length > 0 && (
            <div className="quick-actions">
              <span className="quick-label">Quick actions</span>
              <div className="quick-buttons">
                {filtered.slice(0, 3).map((d) => (
                  <div key={d.id} className="quick-group">
                    <Button 
                      size="sm" 
                      type="button" 
                      className="btn-win"
                      onClick={() => void markDealOutcome(d.id, "Won")}
                    >
                      <span className="win-icon">🏆</span>
                      Win {d.name.slice(0, 15)}...
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      className="btn-lose"
                      onClick={() => {
                        void markDealOutcome(d.id, "Lost", "Timing");
                        pushToast("info", "Marked lost");
                      }}
                    >
                      Lose
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      {tab === "products" ? (
        <div className="products-grid">
          {products.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-card-header">
                <div className="product-icon-wrapper">
                  <svg className="product-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="product-name">{p.name}</h3>
              </div>
              <p className="product-description">{p.description || "No description available"}</p>
              <div className="product-footer">
                <span className="product-price">{formatCurrency(p.price)}</span>
                <span className="product-status">
                  <span className="status-dot" />
                  {p.active ? "Active" : "Inactive"}
                </span>
              </div>
            </article>
          ))}
          {products.length === 0 && (
            <div className="empty-state">
              <p>No products added yet</p>
            </div>
          )}
        </div>
      ) : null}

      {tab === "payments" ? (
        <div className="payments-card">
          <div className="payments-header">
            <span className="payments-title">Payment History</span>
            <span className="payments-total">
              Total: {formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}
            </span>
          </div>
          <div className="payments-divider" />
          <div className="payments-list">
            {payments.map((p) => (
              <div key={p.id} className="payment-item">
                <div className="payment-left">
                  <span className={`payment-status-badge ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                  <span className="payment-method">{p.method}</span>
                </div>
                <div className="payment-right">
                  <span className="payment-amount">{formatCurrency(p.amount)}</span>
                  <span className="payment-date">{p.date}</span>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <div className="empty-state">
                <p>No payments recorded yet</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} />

      <style jsx>{`
        .deals-page {
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
          background: radial-gradient(circle, rgba(244, 197, 66, 0.06) 0%, transparent 70%);
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

        /* Page Header */
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
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
          border: 1px solid rgba(244, 197, 66, 0.12);
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
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.5px;
        }

        .title-count {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
          padding: 0.1rem 0.6rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.35);
          margin: 0;
          font-weight: 400;
        }

        /* Create Button */
        .btn-create {
          padding: 0.6rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          white-space: nowrap !important;
          font-family: inherit !important;
        }

        .btn-create:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .create-icon {
          width: 16px;
          height: 16px;
        }

        /* Filters Section */
        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin: 1.25rem 0;
          position: relative;
          z-index: 1;
          align-items: center;
        }

        .filter-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 150px;
          max-width: 250px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
          z-index: 2;
        }

        .filter-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 0.6rem 0.8rem 0.6rem 2.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.08);
          background: rgba(255, 255, 255, 0.06);
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .filter-select::-ms-expand {
          display: none;
        }

        .filter-clear {
          display: flex;
          align-items: center;
        }

        .clear-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
        }

        /* Tabs */
        .tabs-section {
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }

        .tabs {
          display: inline-flex;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04);
        }

        .tab.active {
          background: linear-gradient(135deg, #f4c542, #d4a030);
          color: #0a0a0a;
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.2);
        }

        .tab-icon {
          width: 14px;
          height: 14px;
        }

        /* Deals Container */
        .deals-container {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        /* Quick Actions */
        .quick-actions {
          margin-top: 1.5rem;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          position: relative;
          z-index: 1;
        }

        .quick-label {
          display: block;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.25);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }

        .quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-group {
          display: flex;
          gap: 0.3rem;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.2rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .btn-win {
          background: linear-gradient(135deg, #00c853, #00a844) !important;
          border: none !important;
          border-radius: 6px !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          font-size: 0.75rem !important;
          padding: 0.3rem 0.7rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          font-family: inherit !important;
        }

        .btn-win:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 200, 83, 0.3) !important;
        }

        .win-icon {
          margin-right: 0.2rem;
        }

        .btn-lose {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 6px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          font-weight: 400 !important;
          font-size: 0.75rem !important;
          padding: 0.3rem 0.7rem !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-lose:hover {
          background: rgba(255, 68, 68, 0.1) !important;
          border-color: rgba(255, 68, 68, 0.2) !important;
          color: #ff4444 !important;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .product-card:hover {
          transform: translateY(-3px);
          border-color: rgba(244, 197, 66, 0.15);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .product-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .product-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(244, 197, 66, 0.08);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .product-icon {
          color: #f4c542;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .product-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          margin: 0.25rem 0 0.75rem 0;
          line-height: 1.4;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .product-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f4c542;
        }

        .product-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00c853;
        }

        /* Payments Card */
        .payments-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 1;
        }

        .payments-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
        }

        .payments-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .payments-total {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f4c542;
        }

        .payments-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.04), rgba(244, 197, 66, 0.08), rgba(255, 255, 255, 0.04));
          margin: 0 1.5rem;
        }

        .payments-list {
          padding: 0.5rem 1.5rem;
        }

        .payment-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .payment-item:last-child {
          border-bottom: none;
        }

        .payment-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .payment-status-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .payment-status-badge.completed {
          background: rgba(0, 200, 83, 0.12);
          color: #00c853;
        }

        .payment-status-badge.pending {
          background: rgba(255, 193, 7, 0.12);
          color: #ffc107;
        }

        .payment-status-badge.failed {
          background: rgba(255, 68, 68, 0.12);
          color: #ff4444;
        }

        .payment-method {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .payment-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .payment-amount {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
        }

        .payment-date {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Empty State */
        .empty-state {
          padding: 2.5rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .deals-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-create {
            width: 100%;
            justify-content: center;
          }

          .filter-wrapper {
            min-width: 120px;
            max-width: 100%;
            flex: 1 1 calc(50% - 0.5rem);
          }

          .filters-section {
            flex-wrap: wrap;
          }

          .tabs {
            width: 100%;
            justify-content: stretch;
          }

          .tab {
            flex: 1;
            justify-content: center;
            font-size: 0.75rem;
            padding: 0.4rem 0.5rem;
          }

          .tab-icon {
            width: 12px;
            height: 12px;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .quick-buttons {
            flex-direction: column;
          }

          .quick-group {
            flex-wrap: wrap;
          }

          .payment-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .payment-right {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {
          .filter-wrapper {
            flex: 1 1 100%;
          }

          .payments-header {
            flex-direction: column;
            gap: 0.3rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}