"use client";

import { useState } from "react";
import { Settings, Save, Sliders, ShieldCheck, Key, Globe, CheckCircle } from "lucide-react";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard-settings-container">
      {/* Header */}
      <div className="dashboard-settings-header">
        <h1 className="dashboard-settings-title">
          Platform Settings
        </h1>
        <p className="dashboard-settings-subtitle">
          Configure global publication metadata, SEO defaults, and API integration keys.
        </p>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="dashboard-toast dashboard-settings-toast">
          <CheckCircle className="dashboard-toast__icon" />
          <span>Platform configuration updated successfully.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-settings-tabs">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "seo", label: "SEO & Metadata", icon: Globe },
          { id: "security", label: "Security & Auth", icon: ShieldCheck },
          { id: "api", label: "API & Integrations", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dashboard-settings-tab ${activeTab === tab.id ? "dashboard-settings-tab--active" : ""}`}
            >
              <Icon className="dashboard-settings-tab__icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <form onSubmit={handleSave} className="card dashboard-settings-form">
        {activeTab === "general" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">General Configuration</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-name" className="dashboard-settings-label">
                Publication Name
              </label>
              <input id="settings-site-name" type="text" defaultValue="TechCrest" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-tagline" className="dashboard-settings-label">
                Tagline
              </label>
              <input id="settings-site-tagline" type="text" defaultValue="The Future of Technology Journalism" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-site-description" className="dashboard-settings-label">
                Site Description
              </label>
              <textarea id="settings-site-description" rows={3} defaultValue="TechCrest covers the latest technology news, in-depth reviews, buying guides, and analysis from industry experts." className="input dashboard-settings-textarea" />
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">SEO &amp; OpenGraph Defaults</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-seo-title" className="dashboard-settings-label">
                Default Meta Title Template
              </label>
              <input id="settings-seo-title" type="text" defaultValue="%s — TechCrest" className="input dashboard-settings-input" />
            </div>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-og-image" className="dashboard-settings-label">
                Default OpenGraph Banner URL
              </label>
              <input id="settings-og-image" type="text" defaultValue="https://tech.io/og-default.jpg" className="input dashboard-settings-input" />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">Authentication &amp; Access</h2>
            <div className="dashboard-settings-toggle-row">
              <div className="dashboard-settings-toggle-content">
                <p className="dashboard-settings-toggle-title">Require 2FA for Editorial Desk</p>
                <p className="dashboard-settings-toggle-desc">Enforce two-factor authentication for editors and admins.</p>
              </div>
              <input type="checkbox" defaultChecked className="dashboard-settings-checkbox" />
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="dashboard-settings-section">
            <h2 className="dashboard-settings-section__title">API &amp; Integration Keys</h2>
            <div className="dashboard-settings-field">
              <label htmlFor="settings-resend-key" className="dashboard-settings-label">
                Resend Email API Key
              </label>
              <input id="settings-resend-key" type="password" defaultValue="re_123456789_abcdef" className="input dashboard-settings-input" />
            </div>
          </div>
        )}

        <div className="dashboard-settings-footer">
          <button type="submit" className="btn btn-primary dashboard-settings-save-btn">
            <Save className="dashboard-settings-save-icon" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
