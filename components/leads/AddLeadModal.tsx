"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import { useAppStore } from "@/lib/store";
import { addLead } from "@/lib/api";
import type { Lead } from "@/lib/types";
import { LEAD_STAGES, LEAD_SOURCES } from "@/lib/utils/constants";

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (lead: Lead) => void;
  initialData?: Partial<Lead>;
  projectId?: string;
}

export function AddLeadModal({
  open,
  onClose,
  onSuccess,
  initialData,
  projectId,
}: AddLeadModalProps) {
  const { user, pushToast, projects, activeProjectId } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    title: "",
    phone: "",
    email: "",
    source: "Website",
    stage: "New" as Lead["stage"],
    ownerEmail: user?.email || "",
    value: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    notes: "",
    projectId: projectId || activeProjectId || "",
    googleProfileUrl: "",
    googleRating: "",
    googleReviews: "",
    googleVerificationStatus: "Not started" as Lead["googleVerificationStatus"],
    priority: "Medium" as Lead["priority"],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      // Reset form with initial data
      setFormData({
        name: initialData?.name || "",
        company: initialData?.company || "",
        title: initialData?.title || "",
        phone: initialData?.phone || "",
        email: initialData?.email || "",
        source: initialData?.source || "Website",
        stage: initialData?.stage || "New",
        ownerEmail: initialData?.ownerEmail || user?.email || "",
        value: initialData?.value?.toString() || "",
        address: initialData?.address || "",
        city: initialData?.city || "",
        zip: initialData?.zip || "",
        country: initialData?.country || "",
        notes: initialData?.notes || "",
        projectId: initialData?.projectId || projectId || activeProjectId || "",
        googleProfileUrl: initialData?.googleProfileUrl || "",
        googleRating: initialData?.googleRating?.toString() || "",
        googleReviews: initialData?.googleReviews?.toString() || "",
        googleVerificationStatus: initialData?.googleVerificationStatus || "Not started",
        priority: initialData?.priority || "Medium",
      });
      setErrors({});
    }
  }, [open, initialData, user, projectId, activeProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Lead name is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.ownerEmail) newErrors.ownerEmail = "Owner is required";
    if (!formData.projectId) newErrors.projectId = "Project is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const leadData = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        title: formData.title.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        source: formData.source,
        stage: formData.stage,
        ownerEmail: formData.ownerEmail,
        value: Number(formData.value) || 0,
        address: formData.address.trim(),
        city: formData.city.trim(),
        zip: formData.zip.trim(),
        country: formData.country.trim(),
        notes: formData.notes.trim(),
        projectId: formData.projectId,
        googleProfileUrl: formData.googleProfileUrl.trim(),
        googleRating: Number(formData.googleRating) || undefined,
        googleReviews: Number(formData.googleReviews) || undefined,
        googleVerificationStatus: formData.googleVerificationStatus,
        priority: formData.priority,
      } as Omit<Lead, "id" | "createdAt" | "updatedAt">;

      const lead = await addLead(leadData);
      pushToast("success", `Lead ${lead.name} created successfully`);
      onSuccess?.(lead);
      onClose();
    } catch (error) {
      pushToast("error", "Failed to create lead");
      setErrors({ submit: "Failed to create lead. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add Lead"
      onClose={onClose}
      size="lg"
      loading={loading}
    >
      <form onSubmit={handleSubmit} className="add-lead-form">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-group">
              <Input
                label="Lead Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                placeholder="John Doe"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Input
                label="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                error={errors.company}
                placeholder="Acme Corp"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Input
                label="Title / Role"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="CEO"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@acme.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="New York"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <Input
                  label="ZIP / Postal"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  placeholder="10001"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="United States"
                className="form-input"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-group">
              <Select
                label="Source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
                className="form-select"
              />
            </div>

            <div className="form-group">
              <Select
                label="Stage"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as Lead["stage"] })}
                options={LEAD_STAGES.map((s) => ({ value: s, label: s }))}
                className="form-select"
              />
            </div>

            <div className="form-group">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Lead["priority"] })}
                options={["Low", "Medium", "High"].map((p) => ({ value: p, label: p }))}
                className="form-select"
              />
            </div>

            <div className="form-group">
              <Select
                label="Owner"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                options={[
                  { value: user?.email || "", label: user?.name || "Me" },
                  ...(user?.email ? [] : []),
                ]}
                error={errors.ownerEmail}
                className="form-select"
              />
            </div>

            <div className="form-group">
              <Select
                label="Project"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                error={errors.projectId}
                className="form-select"
              />
            </div>

            <div className="form-group">
              <Input
                label="Value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <Textarea
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add notes about this lead..."
                className="form-textarea"
              />
            </div>
          </div>
        </div>

        {/* Google Profile Section */}
        <div className="google-section">
          <h4 className="section-title">Google Profile (Optional)</h4>
          <div className="form-grid google-grid">
            <div className="form-group">
              <Input
                label="Google Maps URL"
                value={formData.googleProfileUrl}
                onChange={(e) => setFormData({ ...formData, googleProfileUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="form-input"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Rating"
                  type="number"
                  value={formData.googleRating}
                  onChange={(e) => setFormData({ ...formData, googleRating: e.target.value })}
                  placeholder="4.5"
                  step="0.1"
                  min="0"
                  max="5"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <Input
                  label="Reviews"
                  type="number"
                  value={formData.googleReviews}
                  onChange={(e) => setFormData({ ...formData, googleReviews: e.target.value })}
                  placeholder="100"
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <Select
                label="Verification Status"
                value={formData.googleVerificationStatus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    googleVerificationStatus: e.target.value as Lead["googleVerificationStatus"],
                  })
                }
                options={["Verified", "Pending", "Suspended", "Not started"].map((s) => ({
                  value: s,
                  label: s,
                }))}
                className="form-select"
              />
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Creating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Create Lead
              </>
            )}
          </Button>
        </div>
      </form>

      <style jsx>{`
        .add-lead-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 1.5rem;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
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
          background: rgba(255, 255, 255, 0.06);
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
          background: rgba(255, 255, 255, 0.06);
        }

        .form-group :global(.form-textarea::placeholder) {
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

        .form-group :global(label) {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.3px;
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        /* Google Section */
        .google-section {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
        }

        .section-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          margin: 0 0 0.75rem 0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .google-grid {
          grid-template-columns: 1fr 1fr;
        }

        /* Submit Error */
        .submit-error {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 68, 68, 0.06);
          border: 1px solid rgba(255, 68, 68, 0.1);
          border-radius: 6px;
          color: #ff4444;
          font-size: 0.8rem;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
        }

        .form-actions :global(.btn-gold) {
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

        .form-actions :global(.btn-gold):hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .form-actions :global(.btn-gold):disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-actions :global(.btn-ghost) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.06) !important;
          border-radius: 8px !important;
          color: rgba(255, 255, 255, 0.4) !important;
          padding: 0.5rem 1rem !important;
          font-size: 0.85rem !important;
          transition: all 0.3s !important;
          font-family: inherit !important;
        }

        .form-actions :global(.btn-ghost):hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .form-actions :global(.btn-ghost):disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: #0a0a0a;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .google-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions :global(.btn-gold),
          .form-actions :global(.btn-ghost) {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .google-section {
            padding: 0.75rem;
          }
        }
      `}</style>
    </Modal>
  );
}