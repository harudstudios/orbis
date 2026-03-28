"use client";

import { useState } from "react";

const TABS = [
  { id: "terms", label: "Terms of Service" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "about", label: "About Orbis" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("terms");

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-lg sm:text-xl font-semibold mb-1">Settings</h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
        Policies and information
      </p>

      {/* Tabs */}
      <div className="flex gap-0 sm:gap-1 mb-4 sm:mb-6 border-b border-border overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        {activeTab === "terms" && <TermsContent />}
        {activeTab === "privacy" && <PrivacyContent />}
        {activeTab === "about" && <AboutContent />}
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm text-foreground/90 leading-relaxed">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Terms of Service</h2>
      <p className="text-muted-foreground text-xs">Last updated: March 28, 2026</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground mt-6">1. Acceptance of Terms</h3>
      <p>By accessing or using Orbis, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">2. Description of Service</h3>
      <p>Orbis is a real-time, trust-based intelligence platform that collects event reports from users, processes them using AI, and displays verified information on an interactive map dashboard. The service includes event submission, AI normalization, clustering, and news enrichment features.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">3. User Submissions</h3>
      <p>Users may submit event reports through the Orbis mobile application. By submitting content, you represent that the information is truthful and accurate to the best of your knowledge. You grant Orbis a non-exclusive, worldwide license to use, process, and display your submissions.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">4. Trust Score System</h3>
      <p>Orbis employs a trust scoring mechanism based solely on corroboration from multiple independent user reports. External news articles are displayed for context but do not affect trust scores. Trust scores are algorithmic and do not constitute verification of absolute truth. Users should exercise their own judgment when interpreting trust scores.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">5. Prohibited Conduct</h3>
      <p>You agree not to: submit false or misleading information; attempt to manipulate trust scores; use automated systems to submit reports; or engage in any activity that disrupts the integrity of the platform.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">6. Limitation of Liability</h3>
      <p>Orbis is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for decisions made based on information displayed on the platform. Event data is crowd-sourced and AI-processed, and may contain inaccuracies.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">7. Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm text-foreground/90 leading-relaxed">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">Privacy Policy</h2>
      <p className="text-muted-foreground text-xs">Last updated: March 28, 2026</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground mt-6">1. Information We Collect</h3>
      <p><strong>Account Data:</strong> When you sign in via Google, we receive your name, email address, and profile picture from Firebase Authentication.</p>
      <p><strong>Location Data:</strong> When you submit an event, your device&apos;s geographic coordinates are collected to associate the event with a location. The dashboard may also request your location to center the map.</p>
      <p><strong>Event Submissions:</strong> Text descriptions, categories, and associated metadata you provide when reporting events.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">2. How We Use Your Information</h3>
      <p>We use collected information to: display events on the map; calculate trust scores; prevent duplicate submissions; improve AI normalization accuracy; and enhance the overall user experience.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">3. Data Processing</h3>
      <p>Submitted event text is processed through Google&apos;s Gemini API for normalization and clustering. This processing occurs on secure servers and is subject to Google&apos;s data usage policies. We do not use your personal identity in AI processing — only the event text content.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">4. Data Sharing</h3>
      <p>We do not sell your personal information. Event data (without personal identifiers) is displayed publicly on the dashboard. We may share anonymized, aggregated data for research purposes.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">5. Data Retention</h3>
      <p>Event and report data is retained for the operational lifetime of the platform. You may request deletion of your account and associated data by contacting our support team.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">6. Security</h3>
      <p>We implement industry-standard security measures including encrypted communications (HTTPS), secure authentication via Firebase, and access controls on our database systems.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">7. Contact</h3>
      <p>For privacy-related inquiries, please contact us at privacy@orbis.app.</p>
    </div>
  );
}

function AboutContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm text-foreground/90 leading-relaxed">
      <h2 className="text-base sm:text-lg font-semibold text-foreground">About Orbis</h2>

      <p>Orbis is a decentralized intelligence system where users act as real-time sensors. People report events from the real world through a mobile app, and the system transforms these raw signals into structured, verified, and visual intelligence on a live map dashboard.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground mt-6">How It Works</h3>
      <p>Users submit raw event reports via the Orbis mobile app. These reports are processed by Google Gemini AI to normalize and structure the information. The system then checks for similar existing events nearby — if found, the new report increases the trust score of the existing event cluster. If it&apos;s a new event, a fresh cluster is created. Related news articles are also fetched from Google News via Apify to provide additional context.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">Trust Score</h3>
      <p>Every event has a trust score equal to the <strong>number of independent user reports</strong>. Only real users reporting the same event from the mobile app can increase trust — external news articles are displayed for reference but do not affect the score. Events progress through trust levels: Low (0–3), Medium (4–9), High (10–19), and Verified (20+).</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">Dashboard Features</h3>
      <p>The web dashboard provides a live interactive map with location search, category filters, zoom controls, and hover-to-preview event popups. You can explore any zone on the map, search the web for related news via Exa, and browse related articles. Optionally sign in with Google to favorite events for quick access later.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">Technology</h3>
      <p>Orbis is built with Next.js 16, Convex (real-time database), Google Gemini Flash 2.5 (AI normalization and clustering), Leaflet (maps), Exa (semantic web search), and Apify (Google News scraping). Authentication is handled by Firebase. The mobile app is built with Flutter.</p>

      <h3 className="text-sm sm:text-base font-medium text-foreground">One User, One Voice</h3>
      <p>To maintain integrity, each user can only submit one report per event cluster. This prevents a single user from artificially inflating trust scores and ensures that high trust truly represents widespread corroboration from independent sources.</p>
    </div>
  );
}
