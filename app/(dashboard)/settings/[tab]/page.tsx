"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { useAppStore } from "@/lib/store";
import { SETTINGS_TABS } from "@/lib/utils/constants";
import {
  addPipelineStage,
  addProduct,
  deletePipelineStage,
  deleteProduct,
  getCustomFields,
  getLossReasons,
  getOrganization,
  getPipelineStages,
  getProducts,
  renamePipelineStage,
  reorderStages,
  updateCustomFields,
  updateLossReasons,
  updateOrganization,
  updateProjects,
} from "@/lib/api";
import type {
  CustomField,
  LossReason,
  Organization,
  PipelineStageConfig,
  Product,
  Project,
} from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

type TabSlug = (typeof SETTINGS_TABS)[number]["slug"];

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const TEMPLATE_CSV =
  "name,company,title,phone,email,source,status,stage,owner,value,address,city,zip,country,googleProfileUrl,googleRating,googleReviews,googleVerificationStatus,notes\n" +
  "Amina Qureshi,Example Import Bakery,Owner,5550100999,amina@examplebakery.example,Website,new,New,sarah@bashar.ai,7500,10 Market St,Oakland,94607,USA,https://maps.google.com/?q=Example+Import+Bakery,4.5,88,Verified,Template example row\n";

export default function SettingsTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = use(params);
  const isKnownTab = SETTINGS_TABS.some((t) => t.slug === tab);

  return (
    <div className="settings-page">
      {/* Animated background glows */}
      <div className="page-glow-1" />
      <div className="page-glow-2" />

      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <div className="header-badge">
            <span className="badge-dot" />
            <span className="badge-text">Configuration</span>
          </div>
          <h1 className="page-title">
            Settings
            <span className="title-count">{SETTINGS_TABS.find(t => t.slug === tab)?.label || tab}</span>
          </h1>
          <p className="page-subtitle">Configure your CRM to match your workflow</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-wrapper">
        <div className="tabs" role="tablist" aria-label="Settings sections">
          {SETTINGS_TABS.map((t) => (
            <Link
              key={t.slug}
              href={`/settings/${t.slug}`}
              role="tab"
              aria-selected={t.slug === tab}
              className={`tab ${t.slug === tab ? "active" : ""}`}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="settings-card">
        {isKnownTab ? (
          <SettingsPanel tab={tab as TabSlug} />
        ) : (
          <EmptyState
            title="Unknown settings section"
            body="That settings tab doesn't exist."
            action={
              <Link href="/settings/organization" className="btn-gold-link">
                Go to Organization
              </Link>
            }
          />
        )}
      </div>

      <style jsx>{`
        .settings-page {
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
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
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

        /* Tabs */
        .tabs-wrapper {
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }

        .tabs {
          display: flex;
          gap: 0.3rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 0.3rem;
          border: 1px solid rgba(255, 255, 255, 0.03);
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
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
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
          box-shadow: 0 4px 20px rgba(244, 197, 66, 0.2);
        }

        .tab-icon {
          font-size: 1rem;
        }

        /* Settings Card */
        .settings-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .btn-gold-link {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #f4c542, #d4a030);
          border-radius: 8px;
          color: #0a0a0a;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .btn-gold-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: center;
          }

          .settings-card {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .page-title {
            font-size: 1.2rem;
          }

          .header-badge {
            font-size: 0.6rem;
          }

          .settings-card {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

function SettingsPanel({ tab }: { tab: TabSlug }) {
  switch (tab) {
    case "organization":
      return <OrganizationPanel />;
    case "projects":
      return <ProjectsPanel />;
    case "pipelines":
      return <PipelinesPanel />;
    case "products":
      return <ProductsPanel />;
    case "loss-reasons":
      return <LossReasonsPanel />;
    case "custom-fields":
      return <CustomFieldsPanel />;
    case "import-export":
      return <ImportExportPanel />;
    default:
      return null;
  }
}

function OrganizationPanel() {
  const { pushToast, refresh } = useAppStore();
  const [org, setOrg] = useState<Organization | null>(null);

  useEffect(() => {
    void getOrganization().then(setOrg);
  }, []);

  if (!org) return <div className="loading-state"><div className="loader" /><p>Loading organization...</p></div>;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Organization Settings</h2>
        <p className="panel-subtitle">Configure your company profile and preferences</p>
      </div>
      <form
        className="panel-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await updateOrganization(org);
          refresh();
          pushToast("success", "Organization settings saved");
        }}
      >
        <div className="form-grid">
          <div className="form-group">
            <Input
              label="Organization name"
              name="orgName"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <Input
              label="Logo initial (2 chars max)"
              name="logoText"
              value={org.logoText}
              maxLength={2}
              onChange={(e) => setOrg({ ...org, logoText: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <Input
              label="Timezone"
              name="timezone"
              value={org.timezone}
              onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <Select
              label="Currency"
              name="currency"
              value={org.currency}
              options={["USD", "EUR", "GBP", "AED", "PKR"].map((c) => ({ value: c, label: c }))}
              onChange={(e) => setOrg({ ...org, currency: e.target.value })}
              className="form-select"
            />
          </div>
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

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
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

        .form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
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

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          gap: 1rem;
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

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function ProjectsPanel() {
  const { projects, pushToast } = useAppStore();
  const [name, setName] = useState("");

  async function toggleStatus(project: Project) {
    const next = projects.map((p) =>
      p.id === project.id ? { ...p, status: p.status === "Active" ? ("Archived" as const) : ("Active" as const) } : p,
    );
    await updateProjects(next);
    pushToast("success", `${project.name} ${project.status === "Active" ? "archived" : "activated"}`);
  }

  async function addProjectRow(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = `proj-${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await updateProjects([...projects, { id, name: name.trim(), status: "Active" }]);
    setName("");
    pushToast("success", "Project added");
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Projects</h2>
        <p className="panel-subtitle">Manage your projects and their status</p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="project-name">{p.name}</td>
                <td>
                  <span className={`status-badge ${p.status === "Active" ? "active" : "archived"}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <button 
                    type="button" 
                    className={`action-btn ${p.status === "Active" ? "archive" : "activate"}`}
                    onClick={() => void toggleStatus(p)}
                  >
                    {p.status === "Active" ? "Archive" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={addProjectRow} className="add-form">
        <div className="add-form-group">
          <Input 
            label="New project name" 
            name="newProject" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <Button type="submit" variant="gold" className="btn-add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Project
        </Button>
      </form>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .data-table thead {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
        }

        .data-table td {
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.7);
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .project-name {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .status-badge {
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
          border: 1px solid rgba(0, 200, 83, 0.12);
        }

        .status-badge.archived {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .action-btn {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.archive {
          color: rgba(255, 68, 68, 0.5);
          border-color: rgba(255, 68, 68, 0.08);
        }

        .action-btn.archive:hover {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .action-btn.activate {
          color: rgba(0, 200, 83, 0.5);
          border-color: rgba(0, 200, 83, 0.08);
        }

        .action-btn.activate:hover {
          background: rgba(0, 200, 83, 0.08);
          color: #00c853;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .add-form-group {
          flex: 1;
          min-width: 200px;
        }

        .add-form-group :global(.form-input) {
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

        .add-form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .btn-add {
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
          white-space: nowrap;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        @media (max-width: 768px) {
          .add-form {
            flex-direction: column;
            align-items: stretch;
          }

          .add-form-group {
            min-width: 100%;
          }

          .btn-add {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function PipelinesPanel() {
  const { version, pushToast } = useAppStore();
  const [stages, setStages] = useState<PipelineStageConfig[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Record<string, string>>({});

  useEffect(() => {
    void getPipelineStages().then((s) => setStages([...s].sort((a, b) => a.order - b.order)));
  }, [version]);

  async function move(idx: number, dir: -1 | 1) {
    const next = [...stages];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setStages(next);
    await reorderStages(next.map((s) => s.id));
  }

  async function saveRename(id: string) {
    const value = editing[id];
    if (!value?.trim()) return;
    await renamePipelineStage(id, value.trim());
    setStages((s) => s.map((st) => (st.id === id ? { ...st, name: value.trim() as PipelineStageConfig["name"] } : st)));
    pushToast("success", "Stage renamed");
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Pipeline Stages</h2>
        <p className="panel-subtitle">Configure your sales pipeline stages</p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, idx) => (
              <tr key={s.id}>
                <td className="order-cell">{s.order}</td>
                <td>
                  <Input
                    label=""
                    name={`stage-${s.id}`}
                    value={editing[s.id] ?? s.name}
                    onChange={(e) => setEditing((prev) => ({ ...prev, [s.id]: e.target.value }))}
                    className="stage-input"
                  />
                </td>
                <td>
                  <div className="action-group">
                    <button 
                      type="button" 
                      className="action-icon" 
                      onClick={() => void move(idx, -1)} 
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button 
                      type="button" 
                      className="action-icon" 
                      onClick={() => void move(idx, 1)} 
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button 
                      type="button" 
                      className="action-btn save" 
                      onClick={() => void saveRename(s.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={async () => {
                        await deletePipelineStage(s.id);
                        setStages((prev) => prev.filter((st) => st.id !== s.id));
                        pushToast("success", "Stage deleted");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        className="add-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!name.trim()) return;
          const created = await addPipelineStage(name.trim());
          setStages((prev) => [...prev, created]);
          setName("");
          pushToast("success", "Stage added");
        }}
      >
        <div className="add-form-group">
          <Input 
            label="New stage name" 
            name="newStage" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <Button type="submit" variant="gold" className="btn-add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Stage
        </Button>
      </form>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .data-table thead {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
        }

        .data-table td {
          padding: 0.4rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.7);
          vertical-align: middle;
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .order-cell {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.3);
          text-align: center;
        }

        .stage-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 0.3rem 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
          font-family: inherit;
          width: 100%;
          max-width: 300px;
          transition: all 0.3s;
        }

        .stage-input:focus {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .action-group {
          display: flex;
          gap: 0.2rem;
          flex-wrap: wrap;
        }

        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.8rem;
          font-family: inherit;
        }

        .action-icon:hover {
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.6);
        }

        .action-btn {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: transparent;
          border-radius: 4px;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.save {
          color: rgba(244, 197, 66, 0.5);
          border-color: rgba(244, 197, 66, 0.08);
        }

        .action-btn.save:hover {
          background: rgba(244, 197, 66, 0.08);
          color: #f4c542;
        }

        .action-btn.delete {
          color: rgba(255, 68, 68, 0.5);
          border-color: rgba(255, 68, 68, 0.08);
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .add-form-group {
          flex: 1;
          min-width: 200px;
        }

        .add-form-group :global(.form-input) {
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

        .add-form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .btn-add {
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
          white-space: nowrap;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        @media (max-width: 768px) {
          .add-form {
            flex-direction: column;
            align-items: stretch;
          }

          .add-form-group {
            min-width: 100%;
          }

          .btn-add {
            justify-content: center;
          }

          .action-group {
            flex-wrap: wrap;
          }

          .stage-input {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function ProductsPanel() {
  const { version, pushToast } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });

  useEffect(() => {
    void getProducts().then(setProducts);
  }, [version]);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Products</h2>
        <p className="panel-subtitle">Manage your products and services catalog</p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="product-name">{p.name}</div>
                  <div className="product-description">{p.description}</div>
                </td>
                <td>{p.category}</td>
                <td className="price-cell">{formatCurrency(p.price)}</td>
                <td>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={async () => {
                      await deleteProduct(p.id);
                      setProducts((prev) => prev.filter((x) => x.id !== p.id));
                      pushToast("success", "Product removed");
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        className="add-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!form.name.trim()) return;
          const created = await addProduct({
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price) || 0,
            category: form.category.trim() || "General",
          });
          setProducts((prev) => [...prev, created]);
          setForm({ name: "", description: "", price: "", category: "" });
          pushToast("success", "Product added");
        }}
      >
        <div className="form-grid">
          <div className="add-form-group">
            <Input 
              label="Name" 
              name="prodName" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="add-form-group">
            <Input 
              label="Description" 
              name="prodDescription" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="add-form-group">
            <Input 
              label="Price" 
              name="prodPrice" 
              type="number" 
              value={form.price} 
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="add-form-group">
            <Input 
              label="Category" 
              name="prodCategory" 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
        <div className="form-actions">
          <Button type="submit" variant="gold" className="btn-add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Button>
        </div>
      </form>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .data-table thead {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
        }

        .data-table td {
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.7);
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .product-name {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .product-description {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .price-cell {
          font-weight: 600;
          color: #f4c542;
        }

        .action-btn.delete {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 68, 68, 0.08);
          background: transparent;
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 68, 68, 0.5);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .add-form {
          margin-top: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .add-form-group :global(.form-input) {
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

        .add-form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.75rem;
        }

        .btn-add {
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

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            justify-content: stretch;
          }

          .btn-add {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function LossReasonsPanel() {
  const { version, pushToast } = useAppStore();
  const [reasons, setReasons] = useState<LossReason[]>([]);
  const [label, setLabel] = useState("");

  useEffect(() => {
    void getLossReasons().then(setReasons);
  }, [version]);

  async function save(next: LossReason[]) {
    setReasons(next);
    await updateLossReasons(next);
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Loss Reasons</h2>
        <p className="panel-subtitle">Configure reasons for lost deals</p>
      </div>

      <div className="reasons-list">
        {reasons.map((r) => (
          <div key={r.id} className="reason-item">
            <span className="reason-label">{r.label}</span>
            <button
              type="button"
              className="action-btn delete"
              onClick={() => {
                void save(reasons.filter((x) => x.id !== r.id));
                pushToast("success", "Loss reason removed");
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {reasons.length === 0 && (
          <div className="empty-reasons">No loss reasons configured. Add one below.</div>
        )}
      </div>

      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim()) return;
          void save([...reasons, { id: `lr-${Date.now()}`, label: label.trim() }]);
          setLabel("");
          pushToast("success", "Loss reason added");
        }}
      >
        <div className="add-form-group">
          <Input 
            label="New loss reason" 
            name="newReason" 
            value={label} 
            onChange={(e) => setLabel(e.target.value)}
            className="form-input"
          />
        </div>
        <Button type="submit" variant="gold" className="btn-add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Reason
        </Button>
      </form>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .reasons-list {
          margin-bottom: 1rem;
        }

        .reason-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .reason-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .reason-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .empty-reasons {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.2);
          font-style: italic;
          font-size: 0.85rem;
        }

        .action-btn.delete {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 68, 68, 0.08);
          background: transparent;
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 68, 68, 0.5);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .add-form {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .add-form-group {
          flex: 1;
          min-width: 200px;
        }

        .add-form-group :global(.form-input) {
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

        .add-form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .btn-add {
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
          white-space: nowrap;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        @media (max-width: 768px) {
          .add-form {
            flex-direction: column;
            align-items: stretch;
          }

          .add-form-group {
            min-width: 100%;
          }

          .btn-add {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function CustomFieldsPanel() {
  const { version, pushToast } = useAppStore();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [form, setForm] = useState<{ name: string; type: CustomField["type"]; entity: CustomField["entity"] }>({
    name: "",
    type: "text",
    entity: "lead",
  });

  useEffect(() => {
    void getCustomFields().then(setFields);
  }, [version]);

  async function save(next: CustomField[]) {
    setFields(next);
    await updateCustomFields(next);
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Custom Fields</h2>
        <p className="panel-subtitle">Add custom fields to leads and deals</p>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Applies to</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.id}>
                <td className="field-name">{f.name}</td>
                <td>
                  <span className="type-badge">{f.type}</span>
                </td>
                <td>
                  <span className="entity-badge">{f.entity}</span>
                </td>
                <td>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => {
                      void save(fields.filter((x) => x.id !== f.id));
                      pushToast("success", "Custom field removed");
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        className="add-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) return;
          void save([...fields, { id: `cf-${Date.now()}`, name: form.name.trim(), type: form.type, entity: form.entity }]);
          setForm({ name: "", type: "text", entity: "lead" });
          pushToast("success", "Custom field added");
        }}
      >
        <div className="form-grid">
          <div className="add-form-group">
            <Input 
              label="Field name" 
              name="fieldName" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="add-form-group">
            <Select
              label="Type"
              name="fieldType"
              value={form.type}
              options={["text", "number", "date", "select"].map((t) => ({ value: t, label: t }))}
              onChange={(e) => setForm({ ...form, type: e.target.value as CustomField["type"] })}
              className="form-select"
            />
          </div>
          <div className="add-form-group">
            <Select
              label="Applies to"
              name="fieldEntity"
              value={form.entity}
              options={["lead", "deal"].map((t) => ({ value: t, label: t }))}
              onChange={(e) => setForm({ ...form, entity: e.target.value as CustomField["entity"] })}
              className="form-select"
            />
          </div>
        </div>
        <div className="form-actions">
          <Button type="submit" variant="gold" className="btn-add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Field
          </Button>
        </div>
      </form>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .table-wrapper {
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .data-table thead {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .data-table th {
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-weight: 500;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.3);
        }

        .data-table td {
          padding: 0.5rem 0.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.7);
        }

        .data-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .field-name {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }

        .type-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          background: rgba(66, 133, 244, 0.08);
          color: #4285f4;
          border: 1px solid rgba(66, 133, 244, 0.12);
          text-transform: uppercase;
        }

        .entity-badge {
          padding: 0.1rem 0.5rem;
          border-radius: 4px;
          font-size: 0.65rem;
          background: rgba(244, 197, 66, 0.06);
          color: #f4c542;
          border: 1px solid rgba(244, 197, 66, 0.08);
          text-transform: uppercase;
        }

        .action-btn.delete {
          padding: 0.2rem 0.6rem;
          border: 1px solid rgba(255, 68, 68, 0.08);
          background: transparent;
          border-radius: 4px;
          font-size: 0.7rem;
          color: rgba(255, 68, 68, 0.5);
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .action-btn.delete:hover {
          background: rgba(255, 68, 68, 0.08);
          color: #ff4444;
        }

        .add-form {
          margin-top: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.75rem;
        }

        .add-form-group :global(.form-input) {
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

        .add-form-group :global(.form-input:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(.form-select) {
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

        .add-form-group :global(.form-select:focus) {
          outline: none;
          border-color: #f4c542;
          box-shadow: 0 0 0 3px rgba(244, 197, 66, 0.06);
        }

        .add-form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
          margin-bottom: 0.2rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.75rem;
        }

        .btn-add {
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

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        @media (max-width: 992px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            justify-content: stretch;
          }

          .btn-add {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function ImportExportPanel() {
  const { pushToast } = useAppStore();

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Import / Export</h2>
        <p className="panel-subtitle">Bulk import and export your data</p>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-icon">📥</span>
          <h3 className="section-title">Lead Import</h3>
        </div>
        <p className="section-description">
          Copy <code className="inline-code">incoming/leads-template.csv</code> to <code className="inline-code">incoming/leads.csv</code>, 
          fill in one row per lead, then run <code className="inline-code">npm run import-leads</code>. The importer validates 
          required fields, checks stages, sources and owners against known values, flags duplicates by phone + company, 
          and regenerates <code className="inline-code">lib/generated-data.ts</code> wholesale — no scraping or automated 
          outreach is involved.
        </p>
        <button
          type="button"
          className="btn-download"
          onClick={() => {
            downloadCsv("leads-template.csv", TEMPLATE_CSV);
            pushToast("success", "Template downloaded");
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download CSV Template
        </button>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-icon">📤</span>
          <h3 className="section-title">Lead Export</h3>
        </div>
        <p className="section-description">
          Export every active lead currently in the system as a CSV file.
        </p>
        <button
          type="button"
          className="btn-export"
          onClick={async () => {
            const { getLeads } = await import("@/lib/api");
            const leads = await getLeads();
            const header = "name,company,title,phone,email,source,status,stage,owner,value,city,followUpDate";
            const rows = leads.map((l) =>
              [l.name, l.company, l.title, l.phone, l.email, l.source, l.status, l.stage, l.ownerEmail, l.value, l.city, l.followUpDate]
                .map((v) => `"${String(v).replace(/"/g, '""')}"`)
                .join(","),
            );
            downloadCsv("leads-export.csv", [header, ...rows].join("\n"));
            pushToast("success", `Exported ${leads.length} lead(s)`);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Leads to CSV
        </button>
      </div>

      <style jsx>{`
        .panel {
          width: 100%;
        }

        .panel-header {
          margin-bottom: 1.5rem;
        }

        .panel-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 0.25rem 0;
        }

        .panel-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.3);
          margin: 0;
        }

        .section {
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .section-icon {
          font-size: 1.2rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        .section-description {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
          margin: 0 0 1rem 0;
        }

        .inline-code {
          padding: 0.1rem 0.4rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(244, 197, 66, 0.06);
          border: 1px solid rgba(244, 197, 66, 0.08);
          border-radius: 8px;
          color: #f4c542;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-download:hover {
          background: rgba(244, 197, 66, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.1);
        }

        .btn-export {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .btn-export:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .section {
            padding: 1rem;
          }

          .btn-download,
          .btn-export {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}