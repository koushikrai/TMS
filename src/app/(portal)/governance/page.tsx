"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, FileText, Users, AlertTriangle, GitPullRequest, 
  Calendar, CheckCircle, Clock, ArrowRight, Download, Sparkles
} from "lucide-react";

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<"charter" | "raci" | "risks" | "framework" | "plan">("charter");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #1 – #5
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Fully Delivered
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Project Governance &amp; Kick-Off Hub</h1>
          <p className="text-caption text-ink-muted">
            Inception phase deliverables, project charter, RACI matrix, risk register, governance framework, and baseline project roadmap.
          </p>
        </div>

        <button className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm">
          <Download className="h-4 w-4" /> Export Governance Pack (PDF)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border-soft pb-3 scrollbar-none">
        {[
          { id: "charter", label: "Item #1: Project Charter", icon: FileText },
          { id: "raci", label: "Item #2: RACI Matrix", icon: Users },
          { id: "risks", label: "Item #3: Risk Register", icon: AlertTriangle },
          { id: "framework", label: "Item #4: Governance Framework", icon: GitPullRequest },
          { id: "plan", label: "Item #5: Detailed Roadmap", icon: Calendar }
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

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        
        {/* Item #1: Project Charter */}
        {activeTab === "charter" && (
          <div className="bg-white rounded-apple-lg border border-border-soft p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border-soft pb-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">Item #1 – Project Charter &amp; Communication Plan</h2>
                <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / PG-01 | Fit Status: Fully Available</p>
              </div>
              <span className="px-3 py-1 bg-system-green/10 text-system-green text-xs font-semibold rounded-apple-pill">
                Approved by Steering Committee
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-ink">Project Objectives</h3>
                <ul className="space-y-2 text-caption text-ink-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-system-green shrink-0 mt-0.5" />
                    <span>Digitize 100% of Expertise Transport &amp; Logistics operations across KSA sites.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-system-green shrink-0 mt-0.5" />
                    <span>Seamless integration with SAP S/4HANA (HCM, PM, MM, CO, PS) via CPI middleware.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-system-green shrink-0 mt-0.5" />
                    <span>Real-time GPS tracking (Saudi Ex), driver safety scorecards, and automated violation management.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 bg-background-secondary p-4 rounded-apple-md border border-border-soft">
                <h3 className="text-sm font-semibold text-ink">Communication Channels &amp; Frequency</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-soft">
                    <span className="text-ink-muted">Steering Committee Meeting:</span>
                    <strong className="text-ink">Bi-Weekly (Executive Sponsor)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-soft">
                    <span className="text-ink-muted">Project Standup &amp; Progress:</span>
                    <strong className="text-ink">Weekly (PMO &amp; Workstream Leads)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-muted">Issue &amp; Risk Review:</span>
                    <strong className="text-ink">Weekly Log Audit</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Item #2: RACI Matrix */}
        {activeTab === "raci" && (
          <div className="bg-white rounded-apple-lg border border-border-soft p-6 space-y-6 shadow-sm overflow-x-auto">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #2 – Roles &amp; Responsibilities Matrix (RACI)</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / PG-02 | Fit Status: Fully Available</p>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background-secondary border-b border-border-soft">
                  <th className="p-3 font-semibold text-ink">Workstream / Deliverable</th>
                  <th className="p-3 font-semibold text-ink">Project Sponsor</th>
                  <th className="p-3 font-semibold text-ink">Project Manager</th>
                  <th className="p-3 font-semibold text-ink">Fleet Admin Lead</th>
                  <th className="p-3 font-semibold text-ink">SAP Integration Lead</th>
                  <th className="p-3 font-semibold text-ink">End-User QA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {[
                  { name: "Project Charter & Governance", sp: "A", pm: "R", fl: "C", sap: "I", qa: "I" },
                  { name: "Master Data Management (MDM)", sp: "I", pm: "A", fl: "R", sap: "C", qa: "C" },
                  { name: "Light & Heavy Vehicle Modules", sp: "I", pm: "A", fl: "R", sap: "C", qa: "C" },
                  { name: "SAP S/4HANA CPI Integration", sp: "I", pm: "A", fl: "C", sap: "R", qa: "I" },
                  { name: "UAT Sign-off & Hypercare", sp: "A", pm: "R", fl: "C", sap: "C", qa: "R" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="p-3 font-medium text-ink">{row.name}</td>
                    <td className="p-3 font-bold text-brand-teal">{row.sp}</td>
                    <td className="p-3 font-bold text-brand-blue">{row.pm}</td>
                    <td className="p-3 font-bold text-system-orange">{row.fl}</td>
                    <td className="p-3 font-bold text-system-green">{row.sap}</td>
                    <td className="p-3 font-bold text-ink-muted">{row.qa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] text-ink-muted flex items-center gap-4 pt-2">
              <span><strong>R</strong> = Responsible</span>
              <span><strong>A</strong> = Accountable</span>
              <span><strong>C</strong> = Consulted</span>
              <span><strong>I</strong> = Informed</span>
            </div>
          </div>
        )}

        {/* Item #3: Risk Register */}
        {activeTab === "risks" && (
          <div className="bg-white rounded-apple-lg border border-border-soft p-6 space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Item #3 – Risk Register &amp; Mitigation Plan</h2>
                <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / PG-03 | Fit Status: Fully Available</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-teal/10 text-brand-teal rounded-apple-pill">
                Active Weekly Monitoring
              </span>
            </div>

            <div className="space-y-4">
              {[
                { id: "RSK-01", title: "SAP CPI Endpoint Latency", impact: "High", prob: "Low", owner: "Integration Lead", mitigation: "Implement asynchronous queueing (RabbitMQ/Kafka) & retry triggers." },
                { id: "RSK-02", title: "Driver BioTime Connectivity in Remote Sites", impact: "Medium", prob: "Medium", owner: "Infrastructure Lead", mitigation: "Enable offline PWA sync with automatic retry on signal re-establishment." },
                { id: "RSK-03", title: "Vehicle Compliance Data Discrepancy", impact: "Medium", prob: "Low", owner: "Fleet Admin", mitigation: "Automate automated reconciliation scripts with Saudi Tamm/Naql APIs." }
              ].map((risk) => (
                <div key={risk.id} className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-brand-teal">{risk.id}: {risk.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-system-red/10 text-system-red text-[10px] font-bold rounded">Impact: {risk.impact}</span>
                      <span className="px-2 py-0.5 bg-system-orange/10 text-system-orange text-[10px] font-bold rounded">Prob: {risk.prob}</span>
                    </div>
                  </div>
                  <p className="text-caption text-ink-muted"><strong>Mitigation:</strong> {risk.mitigation}</p>
                  <span className="text-[11px] text-ink-muted">Owner: <strong>{risk.owner}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item #4: Governance Framework */}
        {activeTab === "framework" && (
          <div className="bg-white rounded-apple-lg border border-border-soft p-6 space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #4 – Governance Framework &amp; Escalation Matrix</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / PG-04 | Fit Status: Fully Available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-border-soft rounded-apple-md space-y-2">
                <span className="text-xs font-mono font-bold text-brand-teal uppercase">Level 1 Escalation</span>
                <h3 className="text-sm font-semibold text-ink">Workstream Lead</h3>
                <p className="text-xs text-ink-muted">Target Resolution SLA: <strong>Within 24 Hours</strong></p>
                <p className="text-xs text-ink-muted">Scope: Technical bugs, minor scope queries, layout updates.</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-brand-blue/5">
                <span className="text-xs font-mono font-bold text-brand-blue uppercase">Level 2 Escalation</span>
                <h3 className="text-sm font-semibold text-ink">Project Manager / PMO</h3>
                <p className="text-xs text-ink-muted">Target Resolution SLA: <strong>Within 48 Hours</strong></p>
                <p className="text-xs text-ink-muted">Scope: Schedule variance &gt; 3 days, API integration blocks.</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-brand-teal/5">
                <span className="text-xs font-mono font-bold text-brand-teal uppercase">Level 3 Escalation</span>
                <h3 className="text-sm font-semibold text-ink">Steering Committee</h3>
                <p className="text-xs text-ink-muted">Target Resolution SLA: <strong>Immediate Special Session</strong></p>
                <p className="text-xs text-ink-muted">Scope: Scope changes, budget adjustments, executive sign-off.</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #5: Detailed Roadmap */}
        {activeTab === "plan" && (
          <div className="bg-white rounded-apple-lg border border-border-soft p-6 space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #5 – Detailed Project Plan with Milestones</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 2.4 / PG-05 | Fit Status: Fully Available</p>
            </div>

            <div className="space-y-4">
              {[
                { phase: "Phase 1: Inception & Governance", timeline: "Weeks 1–2", status: "Completed", progress: 100 },
                { phase: "Phase 2: Master Data & Core Modules", timeline: "Weeks 3–5", status: "In Progress", progress: 85 },
                { phase: "Phase 3: Telematics & SAP Integration", timeline: "Weeks 6–8", status: "Upcoming", progress: 40 },
                { phase: "Phase 4: UAT, Training & Go-Live", timeline: "Weeks 9–12", status: "Upcoming", progress: 10 }
              ].map((p, i) => (
                <div key={i} className="p-4 border border-border-soft rounded-apple-md space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">{p.phase} ({p.timeline})</span>
                    <span className="text-brand-teal">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-background-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-brand-teal rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
}
