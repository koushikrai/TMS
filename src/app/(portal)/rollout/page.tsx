"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Users, Activity, Rocket, LifeBuoy, 
  CheckCircle, Award, FileText, Sparkles, Download
} from "lucide-react";

export default function RolloutHypercarePage() {
  const [activeTab, setActiveTab] = useState<"t3" | "userTrn" | "adoption" | "cutover" | "hypercare" | "closure" | "ams">("t3");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #122 – #128
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Cutover Ready
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Training, Go-Live &amp; Hypercare Support Hub</h1>
          <p className="text-caption text-ink-muted">
            Train-the-trainer workshops, end-user training, adoption metrics, cutover execution tracking, 60-day hypercare desk, and AMS SLA reporting.
          </p>
        </div>

        <button className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm">
          <Download className="h-4 w-4" /> Download Rollout Plan (PDF)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border-soft pb-3 scrollbar-none">
        {[
          { id: "t3", label: "Item #122: Train-the-Trainer", icon: GraduationCap },
          { id: "userTrn", label: "Item #123: End-User Training", icon: Users },
          { id: "adoption", label: "Item #124: Adoption Review", icon: Activity },
          { id: "cutover", label: "Item #125: Cutover Strategy", icon: Rocket },
          { id: "hypercare", label: "Item #126: 2-Mo Hypercare", icon: LifeBuoy },
          { id: "closure", label: "Item #127: Final Closure", icon: Award },
          { id: "ams", label: "Item #128: AMS SLA Report", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-apple-pill text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "bg-brand-teal text-white shadow-sm"
                  : "bg-white text-ink-muted border border-border-soft hover:text-ink hover:bg-background-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        
        {/* Item #122: Train-the-Trainer */}
        {activeTab === "t3" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #122 – Train-the-Trainer Capacity Building Sessions</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.3 / TG-01 | Fit Status: Fully Available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-bold text-ink">Super User Certification</span>
                <p className="text-xs text-ink-muted">12 Expertise Fleet &amp; Transport Super Users trained to conduct site-level user training.</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-bold text-ink">Training Material Vault</span>
                <p className="text-xs text-ink-muted">Interactive slide decks, system sandbox access, and trainer assessment quizzes.</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #123: End-User Training */}
        {activeTab === "userTrn" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #123 – End-User Functional &amp; Technical Training</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.3 / TG-02 | Audience: Fleet Admins, Drivers, HR, Finance</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              Role-specific training tracks conducted across Jubail, Dammam, and Riyadh regional offices with hands-on scenario simulations.
            </p>
          </div>
        )}

        {/* Item #124: Adoption Review */}
        {activeTab === "adoption" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #124 – Post-Go-Live Workshops &amp; System Adoption Review</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.3 / TG-03 | Target Active Adoption: &gt; 95%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Daily Active Users</span>
                <p className="text-lg font-bold text-brand-teal mt-1">450+ Users</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Driver App Login %</span>
                <p className="text-lg font-bold text-system-green mt-1">98.2 %</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Manual Requests</span>
                <p className="text-lg font-bold text-brand-blue mt-1">0 (Fully Digital)</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #125: Cutover Strategy */}
        {activeTab === "cutover" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #125 – Cut-Over / Go-Live Execution &amp; Hypercare Plan</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.2 / TG-04 | Fit Status: Fully Available</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              Detailed hour-by-hour cutover sequence for weekend data delta migration, SAP CPI production endpoint activation, and user credential distribution.
            </p>
          </div>
        )}

        {/* Item #126: 2-Mo Hypercare */}
        {activeTab === "hypercare" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #126 – Post Go-Live Stabilisation &amp; 2-Month Hypercare Support</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / TG-05 | Dedicated On-Site &amp; Remote Engineers</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              Dedicated 60-day hypercare period providing 24/7 incident resolution, daily operational standups, and rapid patch deployment.
            </p>
          </div>
        )}

        {/* Item #127: Final Closure */}
        {activeTab === "closure" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #127 – Lessons Learned &amp; Final Project Closure Report</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / TG-06 | Final Sign-Off Deliverable</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              Formal project sign-off documentation, final accomplishment report, and handover to Application Maintenance Services (AMS).
            </p>
          </div>
        )}

        {/* Item #128: AMS SLA Report */}
        {activeTab === "ams" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #128 – AMS SLA Performance Report &amp; Issue Log</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.2 / TG-07 | Target Resolution SLA: 99.5%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">SLA Compliance %</span>
                <p className="text-lg font-bold text-system-green mt-1">99.8 %</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Avg Response Time</span>
                <p className="text-lg font-bold text-brand-teal mt-1">14 mins</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Open P1 / P2 Tickets</span>
                <p className="text-lg font-bold text-system-green mt-1">0 Tickets</p>
              </div>
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
}
