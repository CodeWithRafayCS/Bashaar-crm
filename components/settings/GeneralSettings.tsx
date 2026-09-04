"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { updateOrganization } from "@/lib/api";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { 
  Building2, 
  Globe, 
  Clock, 
  DollarSign, 
  Save, 
  Upload,
  Image,
  Palette,
  Bell,
  Shield,
  Languages,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface GeneralSettingsProps {
  className?: string;
}

interface Organization {
  id: string;
  name: string;
  logoText: string;
  timezone: string;
  currency: string;
  language: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    allowExport: boolean;
    require2FA: boolean;
    auditLog: boolean;
  };
}

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const CURRENCIES = ["USD", "EUR", "GBP", "AED", "PKR", "INR", "SGD", "JPY", "AUD", "CAD"];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "ur", label: "Urdu" },
];

const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "gold", label: "Gold" },
  { value: "system", label: "System" },
];

export function GeneralSettings({ className = "" }: GeneralSettingsProps) {
  const { pushToast } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [org, setOrg] = useState<Organization>({
    id: "1",
    name: "Bashaar AI",
    logoText: "BA",
    timezone: "UTC",
    currency: "USD",
    language: "en",
    email: "hello@bashar.ai",
    phone: "+1-555-123-4567",
    address: "Dubai, United Arab Emirates",
    website: "https://bashar.ai",
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      allowExport: true,
      require2FA: false,
      auditLog: true,
    },
  });

  useEffect(() => {
    // Load organization data
    const loadOrg = async () => {
      setLoading(true);
      try {
        // const data = await getOrganization();
        // if (data) setOrg(data);
        // For now, keep mock data
      } catch (error) {
        pushToast("error", "Failed to load organization settings");
      } finally {
        setLoading(false);
      }
    };
    loadOrg();
  }, [pushToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    try {
      await updateOrganization(org);
      setSaved(true);
      pushToast("success", "Organization settings saved successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      pushToast("error", "Failed to save organization settings");
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof org.notifications) => {
    setOrg({
      ...org,
      notifications: {
        ...org.notifications,
        [key]: !org.notifications[key],
      },
    });
  };

  const handlePrivacyChange = (key: keyof typeof org.privacy) => {
    setOrg({
      ...org,
      privacy: {
        ...org.privacy,
        [key]: !org.privacy[key],
      },
    });
  };

  if (loading) {
    return (
      <div className="general-settings-loading">
        <Loader2 className="loading-spinner" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className={`general-settings ${className}`}>
      <form onSubmit={handleSave}>
        {/* Organization Info */}
        <div className="settings-section">
          <h3 className="section-title">
            <Building2 className="section-icon" />
            Organization Information
          </h3>
          <div className="settings-grid">
            <div className="form-group">
              <Input
                label="Organization Name"
                value={org.name}
                onChange={(e) => setOrg({ ...org, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <Input
                label="Logo Text (2 chars max)"
                value={org.logoText}
                maxLength={2}
                onChange={(e) => setOrg({ ...org, logoText: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <Input
                label="Email"
                type="email"
                value={org.email}
                onChange={(e) => setOrg({ ...org, email: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <Input
                label="Phone"
                value={org.phone}
                onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group full-width">
              <Input
                label="Address"
                value={org.address}
                onChange={(e) => setOrg({ ...org, address: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <Input
                label="Website"
                value={org.website}
                onChange={(e) => setOrg({ ...org, website: e.target.value })}
                className="form-input"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="settings-section">
          <h3 className="section-title">
            <Globe className="section-icon" />
            Regional Settings
          </h3>
          <div className="settings-grid">
            <div className="form-group">
              <Select
                label="Timezone"
                value={org.timezone}
                onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                options={TIMEZONES.map((tz) => ({ value: tz, label: tz.replace(/_/g, " ") }))}
                className="form-select"
              />
            </div>
            <div className="form-group">
              <Select
                label="Currency"
                value={org.currency}
                onChange={(e) => setOrg({ ...org, currency: e.target.value })}
                options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                className="form-select"
              />
            </div>
            <div className="form-group">
              <Select
                label="Language"
                value={org.language}
                onChange={(e) => setOrg({ ...org, language: e.target.value })}
                options={LANGUAGES}
                className="form-select"
              />
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="settings-section">
          <h3 className="section-title">
            <Palette className="section-icon" />
            Appearance
          </h3>
          <div className="settings-grid">
            <div className="form-group">
              <Select
                label="Theme"
                value={org.theme}
                onChange={(e) => setOrg({ ...org, theme: e.target.value })}
                options={THEMES}
                className="form-select"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h3 className="section-title">
            <Bell className="section-icon" />
            Notifications
          </h3>
          <div className="toggle-grid">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.notifications.email}
                onChange={() => handleNotificationChange("email")}
              />
              <span className="toggle-label">Email Notifications</span>
              <span className="toggle-description">Receive email updates about leads and deals</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.notifications.push}
                onChange={() => handleNotificationChange("push")}
              />
              <span className="toggle-label">Push Notifications</span>
              <span className="toggle-description">Receive push notifications in browser</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.notifications.sms}
                onChange={() => handleNotificationChange("sms")}
              />
              <span className="toggle-label">SMS Notifications</span>
              <span className="toggle-description">Receive SMS alerts for important updates</span>
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-section">
          <h3 className="section-title">
            <Shield className="section-icon" />
            Privacy & Security
          </h3>
          <div className="toggle-grid">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.privacy.allowExport}
                onChange={() => handlePrivacyChange("allowExport")}
              />
              <span className="toggle-label">Allow Data Export</span>
              <span className="toggle-description">Allow users to export data to CSV</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.privacy.require2FA}
                onChange={() => handlePrivacyChange("require2FA")}
              />
              <span className="toggle-label">Require Two-Factor Authentication</span>
              <span className="toggle-description">Require 2FA for all users</span>
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={org.privacy.auditLog}
                onChange={() => handlePrivacyChange("auditLog")}
              />
              <span className="toggle-label">Enable Audit Log</span>
              <span className="toggle-description">Track all user actions and changes</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="settings-actions">
          <div className="action-status">
            {saved && (
              <span className="status-saved">
                <CheckCircle className="w-4 h-4" />
                Settings saved
              </span>
            )}
            {saving && (
              <span className="status-saving">
                <Loader2 className="w-4 h-4 loading-spinner" />
                Saving...
              </span>
            )}
          </div>
          <Button type="submit" variant="gold" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 loading-spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <style jsx>{`
        .general-settings {
          width: 100%;
        }

        .general-settings-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.15);
        }

        .loading-spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Sections */
        .settings-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .settings-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 1rem 0;
        }

        .section-icon {
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.2);
        }

        /* Grids */
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
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

        /* Toggle Grid */
        .toggle-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .toggle-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .toggle-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .toggle-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #f4c542;
          cursor: pointer;
          flex-shrink: 0;
        }

        .toggle-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .toggle-description {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.15);
        }

        /* Actions */
        .settings-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .action-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-saved {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #00c853;
          font-size: 0.8rem;
          animation: fadeInOut 3s ease forwards;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-5px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(5px); }
        }

        .status-saving {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
        }

        .settings-actions :global(.btn-gold) {
          padding: 0.5rem 1.5rem !important;
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

        .settings-actions :global(.btn-gold):hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(244, 197, 66, 0.3) !important;
        }

        .settings-actions :global(.btn-gold):disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: 1;
          }

          .settings-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .action-status {
            justify-content: center;
          }

          .settings-actions :global(.btn-gold) {
            width: 100%;
            justify-content: center;
          }

          .toggle-item {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 0.8rem;
          }

          .section-icon {
            width: 16px;
            height: 16px;
          }

          .toggle-item {
            padding: 0.4rem 0.5rem;
          }

          .toggle-label {
            font-size: 0.8rem;
          }

          .toggle-description {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}