"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { EmptyState } from "@/components/common/EmptyState";
import { formatCurrency, formatPhone } from "@/lib/utils/format";
import type { Company } from "@/lib/types";

export default function CompaniesPage() {
  const { companies, loading } = useCompanies();
  const { pushToast } = useAppStore();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(search), 280);
    return () => window.clearTimeout(t);
  }, [search]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    companies.forEach((c) => {
      if (c.category) cats.add(c.category);
    });
    return Array.from(cats);
  }, [companies]);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (selectedCategory && c.category !== selectedCategory) return false;
      if (debounced) {
        const hay = `${c.name} ${c.email} ${c.phone} ${c.address} ${c.notes ?? ""}`.toLowerCase();
        if (!hay.includes(debounced.toLowerCase())) return false;
      }
      return true;
    });
  }, [companies, selectedCategory, debounced]);

  const totalValue = filtered.reduce((sum, c) => {
    // Assuming companies have a totalDealValue or we calculate from leads
    return sum + (c.totalDealValue || 0);
  }, 0);

  function toggleCompany(id: string) {
    setSelectedCompanies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedCompanies.size === filtered.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(filtered.map((c) => c.id)));
    }
  }

  function exportCsv() {
    const rows = filtered.map((c) =>
      [c.name, c.category || "", c.phone || "", c.email || "", c.address || "", c.totalDealValue || 0].join(","),
    );
    const blob = new Blob(
      [["Name,Category,Phone,Email,Address,Total Value", ...rows].join("\n")],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("success", "Companies exported");
  }

  return (
    <div className="companies-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Company management</span>
          </div>
          <h1 className="page-title">
            Companies
            <span className="title-count">{filtered.length}</span>
          </h1>
          <p className="page-subtitle">Manage all your business accounts in one place</p>
        </div>
        <div className="header-actions">
          <Button type="button" variant="gold" className="btn-add" onClick={() => {
            pushToast("info", "Add company modal coming soon");
          }}>
            <svg className="add-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Company
          </Button>
          <Button type="button" variant="ghost" className="btn-export" onClick={exportCsv}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{companies.length}</span>
            <span className="stat-label">Total Companies</span>
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
            <span className="stat-value">{formatCurrency(totalValue)}</span>
            <span className="stat-label">Total Deal Value</span>
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
            <span className="stat-value">{categories.length}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{filtered.length}</span>
            <span className="stat-label">Showing</span>
          </div>
        </div>
      </div>

      {/* Filters & Toolbar */}
      <div className="toolbar-section">
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search companies by name, email, phone..."
            aria-label="Search companies"
            className="search-input"
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-wrapper">
          <svg className="filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
          </svg>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button
            type="button"
            className={`view-btn ${view === "grid" ? "active" : ""}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            className={`view-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>

        {selectedCompanies.size > 0 && (
          <div className="bulk-actions">
            <span className="bulk-count">{selectedCompanies.size} selected</span>
            <Button type="button" size="sm" variant="ghost" className="bulk-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Assign
            </Button>
            <Button type="button" size="sm" variant="danger" className="bulk-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Archive
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loader" />
          <p>Loading companies...</p>
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No companies found"
            body={search || selectedCategory ? "Try adjusting your filters" : "Add your first company to get started"}
            action={
              <Button type="button" variant="gold" onClick={() => {
                pushToast("info", "Add company modal coming soon");
              }}>
                + Add Company
              </Button>
            }
          />
        </div>
      ) : !loading && view === "grid" ? (
        <div className="companies-grid">
          {filtered.map((company) => (
            <Link href={`/companies/${company.id}`} key={company.id} className="company-card">
              <div className="company-card-header">
                <div className="company-avatar">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className="company-header-info">
                  <h3 className="company-name">{company.name}</h3>
                  <span className={`category-tag ${company.category?.toLowerCase() || "other"}`}>
                    {company.category || "Other"}
                  </span>
                </div>
                <button
                  type="button"
                  className="company-check"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCompany(company.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCompanies.has(company.id)}
                    onChange={() => {}}
                  />
                </button>
              </div>

              <div className="company-card-body">
                {company.phone && (
                  <div className="company-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{formatPhone(company.phone)}</span>
                  </div>
                )}
                {company.email && (
                  <div className="company-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>{company.email}</span>
                  </div>
                )}
                {company.address && (
                  <div className="company-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{company.address}</span>
                  </div>
                )}
              </div>

              <div className="company-card-footer">
                <div className="company-leads">
                  <span className="leads-count">{company.leadCount || 0}</span>
                  <span className="leads-label">Leads</span>
                </div>
                <div className="company-value">
                  <span className="value-amount">{formatCurrency(company.totalDealValue || 0)}</span>
                  <span className="value-label">Total Value</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : !loading && view === "list" ? (
        <div className="table-wrapper">
          <table className="companies-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Company</th>
                <th>Category</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Leads</th>
                <th>Total Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr key={company.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCompanies.has(company.id)}
                      onChange={() => toggleCompany(company.id)}
                    />
                  </td>
                  <td>
                    <Link href={`/companies/${company.id}`} className="company-link">
                      <div className="company-cell">
                        <div className="company-avatar-small">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="company-name">{company.name}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className={`category-tag ${company.category?.toLowerCase() || "other"}`}>
                      {company.category || "Other"}
                    </span>
                  </td>
                  <td>{formatPhone(company.phone) || "—"}</td>
                  <td>{company.email || "—"}</td>
                  <td>{company.leadCount || 0}</td>
                  <td className="value-cell">{formatCurrency(company.totalDealValue || 0)}</td>
                  <td>
                    <Link href={`/companies/${company.id}`} className="view-link">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <style jsx>{`
        .companies-page {
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
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.5px;
          flex-wrap: wrap;
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

        .header-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-add {
          padding: 0.6rem 1.2rem !important;
          background: linear-gradient(135deg, #f4c542, #d4a030) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #0a0a0a !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          font-family: inherit !important;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .btn-export {
          padding: 0.6rem 1.2rem !important;
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 10px !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-weight: 500 !important;
          font-size: 0.85rem !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .btn-export:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.8) !important;
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

        /* Toolbar */
        .toolbar-section {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.8rem 0.5rem 2.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
          background: rgba(255, 255, 255, 0.06);
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        .clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0 0.3rem;
          transition: color 0.3s;
        }

        .clear-search:hover {
          color: rgba(255, 255, 255, 0.6);
        }

        .filter-wrapper {
          position: relative;
          min-width: 150px;
        }

        .filter-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .filter-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 0.5rem 0.8rem 0.5rem 2.5rem;
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
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .filter-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .filter-select::-ms-expand {
          display: none;
        }

        .view-toggle {
          display: flex;
          gap: 0.2rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 8px;
          padding: 0.2rem;
          border: 1px solid rgba(255, 255, 255, 0.04);
        }

        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.3rem 0.6rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-btn:hover {
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.04);
        }

        .view-btn.active {
          background: rgba(244, 197, 66, 0.08);
          color: #f4c542;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 0.5rem;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
        }

        .bulk-count {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .bulk-btn {
          font-size: 0.75rem !important;
          padding: 0.3rem 0.6rem !important;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .loader {
          width: 32px;
          height: 32px;
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

        /* Empty State */
        .empty-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        /* Companies Grid */
        .companies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .company-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 1.25rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }

        .company-card:hover {
          transform: translateY(-4px);
          border-color: rgba(244, 197, 66, 0.12);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
        }

        .company-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .company-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 10px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .company-header-info {
          flex: 1;
          min-width: 0;
        }

        .company-name {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .category-tag {
          font-size: 0.6rem;
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .category-tag.technology {
          background: rgba(66, 133, 244, 0.1);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.15);
        }

        .category-tag.healthcare {
          background: rgba(0, 200, 83, 0.1);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.15);
        }

        .category-tag.retail {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.15);
        }

        .category-tag.finance {
          background: rgba(244, 197, 66, 0.12);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.15);
        }

        .category-tag.education {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.15);
        }

        .category-tag.other {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .company-check {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.2rem;
        }

        .company-check input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        .company-card-body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-bottom: 0.75rem;
        }

        .company-detail {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .company-detail svg {
          color: rgba(255, 255, 255, 0.15);
          flex-shrink: 0;
        }

        .company-detail span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .company-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .company-leads {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .leads-count {
          font-size: 0.85rem;
          font-weight: 600;
          color: #ffffff;
        }

        .leads-label {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .company-value {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .value-amount {
          font-size: 0.9rem;
          font-weight: 700;
          color: #f4c542;
        }

        .value-label {
          font-size: 0.55rem;
          color: rgba(255, 255, 255, 0.15);
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        /* Table View */
        .table-wrapper {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .companies-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .companies-table thead {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .companies-table th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
        }

        .companies-table th input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        .companies-table td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.7);
        }

        .companies-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .companies-table tbody tr:last-child td {
          border-bottom: none;
        }

        .companies-table td input[type="checkbox"] {
          width: 14px;
          height: 14px;
          accent-color: #f4c542;
          cursor: pointer;
        }

        .company-link {
          text-decoration: none;
          color: inherit;
        }

        .company-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .company-avatar-small {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0a0a0a;
          flex-shrink: 0;
        }

        .company-name {
          color: #ffffff;
          font-weight: 500;
        }

        .value-cell {
          font-weight: 600;
          color: #f4c542;
        }

        .view-link {
          color: rgba(244, 197, 66, 0.4);
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.3s;
        }

        .view-link:hover {
          color: #f4c542;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .companies-page {
            padding: 1rem;
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

          .btn-add,
          .btn-export {
            flex: 1;
            justify-content: center;
          }

          .toolbar-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-wrapper {
            min-width: 100%;
          }

          .view-toggle {
            align-self: center;
          }

          .bulk-actions {
            border-left: none;
            padding-left: 0;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .companies-grid {
            grid-template-columns: 1fr;
          }

          .companies-table {
            font-size: 0.75rem;
          }

          .companies-table th,
          .companies-table td {
            padding: 0.4rem 0.6rem;
          }

          .companies-table th:nth-child(4),
          .companies-table td:nth-child(4),
          .companies-table th:nth-child(5),
          .companies-table td:nth-child(5) {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .companies-table th:nth-child(3),
          .companies-table td:nth-child(3),
          .companies-table th:nth-child(6),
          .companies-table td:nth-child(6) {
            display: none;
          }

          .company-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}