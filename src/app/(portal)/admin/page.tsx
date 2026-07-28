"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Server, Lock, Cpu, CheckCircle, 
  Terminal, Activity, HardDrive, Smartphone, Bug
} from "lucide-react";

export default function TechnicalAdminPage() {
  const [activeTab, setActiveTab] = useState<"ha" | "env" | "rbac" | "sec" | "uat" | "perf" | "mobile" | "rca">("ha");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #114 – #121
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> High Availability Active
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Technical &amp; Infrastructure Security Hub</h1>
          <p className="text-caption text-ink-muted">
            Cloud HA/DR architecture, DEV/UAT/PROD environment segregation, fine-grained RBAC, AES-256 encryption, and UAT test logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-background-secondary px-3 py-1.5 rounded-apple-pill border border-border-soft font-semibold text-ink">
            AES-256 / TLS 1.3
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border-soft pb-3 scrollbar-none">
        {[
          { id: "ha", label: "Item #114: Cloud HA / DR", icon: Server },
          { id: "env", label: "Item #115: Environments", icon: HardDrive },
          { id: "rbac", label: "Item #116: RBAC Matrix", icon: Lock },
          { id: "sec", label: "Item #117: Security Audit", icon: ShieldCheck },
          { id: "uat", label: "Item #118: UAT Test Suite", icon: Terminal },
          { id: "perf", label: "Item #119: Performance", icon: Activity },
          { id: "mobile", label: "Item #120: Mobile UI Test", icon: Smartphone },
          { id: "rca", label: "Item #121: Defect & RCA Log", icon: Bug }
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
        
        {/* Item #114: Cloud HA / DR */}
        {activeTab === "ha" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #114 – Cloud Architecture &amp; High Availability (HA/DR)</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.10 / TN-01 | Target Uptime: 99.95%</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted uppercase">Primary Availability Zone</span>
                <p className="text-sm font-bold text-system-green">me-central-1 (Riyadh AWS)</p>
                <p className="text-xs text-ink-muted">Status: Active Active</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted uppercase">Disaster Recovery (DR) Zone</span>
                <p className="text-sm font-bold text-brand-teal">me-south-1 (Bahrain AWS)</p>
                <p className="text-xs text-ink-muted">Sync: Standby Replica (RPO &lt; 5m)</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted uppercase">Database Replication</span>
                <p className="text-sm font-bold text-brand-blue">PostgreSQL Multi-AZ</p>
                <p className="text-xs text-ink-muted">Failover SLA: &lt; 30 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #115: Environments */}
        {activeTab === "env" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #115 – DEV / UAT / PROD Environment Segregation</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.4 / TN-02 | Fit Status: Fully Available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "DEV Environment", url: "dev.tms.expertise.com.sa", db: "tms_dev_db", status: "Active (Build 1.4.2)" },
                { name: "UAT Environment", url: "uat.tms.expertise.com.sa", db: "tms_uat_db", status: "Active (Sign-off Ready)" },
                { name: "PROD Environment", url: "tms.expertise.com.sa", db: "tms_prod_db", status: "Staged for Cutover" }
              ].map((env, i) => (
                <div key={i} className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-background-secondary">
                  <span className="text-xs font-bold text-brand-teal">{env.name}</span>
                  <p className="text-xs font-mono text-ink-muted">{env.url}</p>
                  <p className="text-[11px] text-ink-muted">DB: {env.db}</p>
                  <span className="inline-block px-2 py-0.5 bg-system-green/10 text-system-green text-[10px] font-bold rounded">
                    {env.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item #116: RBAC Matrix */}
        {activeTab === "rbac" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm overflow-x-auto">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #116 – Fine-Grained Role-Based Access Control (RBAC)</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.5 / TN-03 | Fit Status: Fully Available</p>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background-secondary border-b border-border-soft">
                  <th className="p-3 font-semibold text-ink">User Role</th>
                  <th className="p-3 font-semibold text-ink">Light Vehicles</th>
                  <th className="p-3 font-semibold text-ink">Buses &amp; Shuttles</th>
                  <th className="p-3 font-semibold text-ink">Heavy Equipment</th>
                  <th className="p-3 font-semibold text-ink">SAP CPI Config</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {[
                  { role: "SYS_ADMIN", lv: "Full Control", bus: "Full Control", hv: "Full Control", sap: "Full Control" },
                  { role: "FLEET_MGR", lv: "Manage & Assign", bus: "Manage & Assign", hv: "Manage & Assign", sap: "Read Only" },
                  { role: "HR_DEPT", lv: "Request & Approve", bus: "Passenger Roster", hv: "No Access", sap: "No Access" },
                  { role: "DRIVER", lv: "My Trip Only", bus: "Assigned Bus", hv: "Assigned Crane", sap: "No Access" }
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-background-secondary/50">
                    <td className="p-3 font-bold text-ink">{r.role}</td>
                    <td className="p-3 text-brand-teal font-semibold">{r.lv}</td>
                    <td className="p-3 text-brand-blue font-semibold">{r.bus}</td>
                    <td className="p-3 text-system-orange font-semibold">{r.hv}</td>
                    <td className="p-3 text-ink-muted font-semibold">{r.sap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Item #117: Security Audit */}
        {activeTab === "sec" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #117 – Security, Data Encryption &amp; Vulnerability Audit</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.5 / TN-04 | Fit Status: Fully Available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-background-secondary">
                <span className="text-xs font-bold text-ink">Data-at-Rest Encryption</span>
                <p className="text-xs text-ink-muted">AES-256 KMS Key Rotation active on PostgreSQL storage and S3 document buckets.</p>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-background-secondary">
                <span className="text-xs font-bold text-ink">Data-in-Transit Encryption</span>
                <p className="text-xs text-ink-muted">TLS 1.3 enforced on all API routes, SAP CPI webhooks, and mobile PWA streams.</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #118: UAT Test Suite */}
        {activeTab === "uat" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #118 – UAT Scripts Preparation &amp; Execution</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.2 / TN-05 | Pass Rate: 100%</p>
            </div>

            <div className="space-y-3">
              {[
                { tc: "TC-LV-01", title: "Submit Permanent Vehicle Request with M1 Grade Check", status: "PASSED" },
                { tc: "TC-BUS-02", title: "Board Passenger via QR & Seat Occupancy Heatmap Update", status: "PASSED" },
                { tc: "TC-HV-03", title: "Heavy Equipment Work Order Lockout via SAP PM API", status: "PASSED" }
              ].map((tc, i) => (
                <div key={i} className="p-3 border border-border-soft rounded-apple-md flex items-center justify-between bg-background-secondary">
                  <span className="text-xs font-mono font-bold text-ink">{tc.tc}: {tc.title}</span>
                  <span className="px-2.5 py-0.5 bg-system-green/10 text-system-green text-[10px] font-bold rounded-apple-pill">
                    {tc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item #119: Performance */}
        {activeTab === "perf" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #119 – Performance &amp; Scalability Testing</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.4 / TN-06 | Load Capacity: 5,000 Concurrent Users</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Average Page Load</span>
                <p className="text-lg font-bold text-system-green mt-1">420 ms</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">API P99 Latency</span>
                <p className="text-lg font-bold text-brand-teal mt-1">85 ms</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">DB Query Time</span>
                <p className="text-lg font-bold text-brand-blue mt-1">12 ms</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md bg-background-secondary">
                <span className="text-xs text-ink-muted">Error Rate</span>
                <p className="text-lg font-bold text-system-green mt-1">0.00 %</p>
              </div>
            </div>
          </div>
        )}

        {/* Item #120: Mobile UI Test */}
        {activeTab === "mobile" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #120 – Mobile-Friendly UI Validation</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.6.1 / TN-07 | Fit Status: Fully Available</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              Responsive layouts verified on iOS (Safari, PWA mode) and Android (Chrome) across mobile (375px), tablet (834px), and desktop viewports.
            </p>
          </div>
        )}

        {/* Item #121: Defect & RCA Log */}
        {activeTab === "rca" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #121 – Issue Resolution Log &amp; Root Cause Analysis (RCA)</h2>
              <p className="text-xs text-ink-muted">RFP Reference: Section 3.11.1 / TN-08 | Closed Defects: 100%</p>
            </div>

            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              All UAT feedback items resolved with documented Root Cause Analysis (RCA) logs and zero critical/high severity open defects.
            </p>
          </div>
        )}

      </motion.div>

    </div>
  );
}
