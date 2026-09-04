"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Textarea } from "@/components/common/Textarea";
import type { Activity, Lead } from "@/lib/types";

interface LogActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    channel: string;
    outcome: string;
    notes: string;
    leadId?: string;
  }) => Promise<void>;
  leads?: Lead[];
  selectedLeadId?: string;
  initialChannel?: string;
}

const CHANNELS = [
  { value: "Call", label: "📞 Call" },
  { value: "WhatsApp", label: "💬 WhatsApp" },
  { value: "Meeting", label: "📅 Meeting" },
  { value: "Note", label: "📝 Note" },
  { value: "Email", label: "✉️ Email" },
];

const OUTCOMES: Record<string, string[]> = {
  Call: ["Connected", "No answer", "Voicemail", "Left message", "Busy", "Wrong number"],
  WhatsApp: ["Connected", "No response", "Read", "Delivered", "Blocked"],
  Meeting: ["Completed", "Scheduled", "No-show", "Rescheduled", "Cancelled"],
  Note: ["Qualified", "Disqualified", "Follow-up needed", "Information gathered"],
  Email: ["Sent", "Opened", "Replied", "Bounced", "Unsubscribed"],
};

const DEFAULT_OUTCOMES = ["Connected", "No answer", "Voicemail", "Completed", "Qualified"];

export function LogActivityModal({
  open,
  onClose,
  onSubmit,
  leads,
  selectedLeadId,
  initialChannel = "Call",
}: LogActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState(initialChannel);
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [leadId, setLeadId] = useState(selectedLeadId || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setChannel(initialChannel);
      setOutcome("");
      setNotes("");
      setLeadId(selectedLeadId || "");
      setErrors({});
    }
  }, [open, initialChannel, selectedLeadId]);

  // Update outcomes when channel changes
  useEffect(() => {
    const availableOutcomes = OUTCOMES[channel] || DEFAULT_OUTCOMES;
    if (!availableOutcomes.includes(outcome)) {
      setOutcome(availableOutcomes[0] || "");
    }
  }, [channel, outcome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!channel) newErrors.channel = "Channel is required";
    if (!outcome) newErrors.outcome = "Outcome is required";
    if (!notes.trim()) newErrors.notes = "Notes are required";
    
    if (leads && leads.length > 0 && !leadId) {
      newErrors.leadId = "Please select a lead";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        channel,
        outcome,
        notes: notes.trim(),
        leadId: leadId || undefined,
      });
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to log activity. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const availableOutcomes = OUTCOMES[channel] || DEFAULT_OUTCOMES;

  return (
    <Modal 
      open={open} 
      title="Log Activity" 
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="log-activity-form">
        {/* Lead Select */}
        {leads && leads.length > 0 && (
          <div className="form-group">
            <Select
              label="Lead"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              options={[
                { value: "", label: "Select a lead..." },
                ...leads.map((lead) => ({
                  value: lead.id,
                  label: `${lead.name} (${lead.company})`,
                })),
              ]}
              error={errors.leadId}
              className="form-select"
            />
          </div>
        )}

        {/* Channel */}
        <div className="form-group">
          <Select
            label="Channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            options={CHANNELS}
            error={errors.channel}
            className="form-select"
          />
        </div>

        {/* Outcome */}
        <div className="form-group">
          <Select
            label="Outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            options={availableOutcomes.map((o) => ({ value: o, label: o }))}
            error={errors.outcome}
            className="form-select"
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <Textarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            error={errors.notes}
            placeholder="Enter detailed notes about this activity..."
            className="form-textarea"
          />
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="submit-error">{errors.submit}</div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="gold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Logging...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Log Activity
              </>
            )}
          </Button>
        </div>
      </form>

      <style jsx>{`
        .log-activity-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
          display: block;
          margin-bottom: 0.2rem;
        }

        .submit-error {
          padding: 0.5rem 0.75rem;
          background: rgba(255, 68, 68, 0.06);
          border: 1px solid rgba(255, 68, 68, 0.1);
          border-radius: 6px;
          color: #ff4444;
          font-size: 0.8rem;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
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
        @media (max-width: 480px) {
          .form-actions {
            flex-direction: column;
          }

          .form-actions :global(.btn-gold),
          .form-actions :global(.btn-ghost) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </Modal>
  );
}