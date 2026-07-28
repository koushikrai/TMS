"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, Layers, ShieldCheck, Server, Database, BookOpen, 
  CheckCircle, Download, ExternalLink, Sparkles
} from "lucide-react";

export default function DocumentationPage() {
  const [activeItem, setActiveItem] = useState<number>(14);

  const docs = [
    { num: 14, title: "AS-IS Process Documentation", ref: "Section 3.1 / DC-01", desc: "Detailed baseline documentation of legacy transport workflows, manual Excel tracking, paper request forms, and offline approval bottlenecks across sites." },
    { num: 15, title: "TO-BE Business Blueprint", ref: "Section 3.2 / DC-02", desc: "Target state process blueprint covering self-service digital requests, automated multi-tier approval chains, SAP integration points, and mobile driver apps." },
    { num: 16, title: "Integration Architecture Blueprint", ref: "Section 3.10 / DC-03", desc: "High-level and detailed architectural topology for SAP CPI, Saudi Ex GPS, Petro APP fuel logs, and ZKT BioTime attendance integration." },
    { num: 17, title: "Security & RBAC Architecture", ref: "Section 3.11.5 / DC-04", desc: "Role-Based Access Control matrix, AES-256 data encryption standards, KSA NDMO data privacy compliance, and SSO integration." },
    { num: 18, title: "Infrastructure & Hosting Architecture", ref: "Section 3.10 / DC-05", desc: "Enterprise cloud hosting architecture, High Availability (HA) multi-AZ setup, Disaster Recovery (DR) RPO/RTO parameters, and container orchestration." },
    { num: 19, title: "Data Migration Strategy Document", ref: "Section 3.8 / DC-06", desc: "Extraction, Transformation, and Loading (ETL) strategy, staging schema specs, data cleansing rules, and validation reports for legacy vehicle/driver records." },
    { num: 20, title: "SOPs & User Manuals", ref: "Section 3.11.3 / DC-07", desc: "Standard Operating Procedures (SOPs), quick reference guides, video walkthroughs, and role-specific manuals for Admins, Drivers, and HR." },
    { num: 21, title: "Test Strategy & UAT Execution Plan", ref: "Section 3.11.2 / DC-08", desc: "End-to-end testing methodology covering unit, functional, SAP CPI integration, security, performance, and formal UAT sign-off criteria." },
    { num: 22, title: "Cutover & Go-Live Strategy Document", ref: "Section 3.11.2 / DC-09", desc: "Minute-by-minute cutover sequence, system freeze windows, initial data seeding checklists, and rollback contingency plans." }
  ];

  const current = docs.find((d) => d.num === activeItem) || docs[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #14 – #22
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Blueprint Complete
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Enterprise Architecture &amp; Documentation Hub</h1>
          <p className="text-caption text-ink-muted">
            Formal architectural blueprints, TO-BE process specifications, SAP CPI integration diagrams, and cutover strategies.
          </p>
        </div>

        <button className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm">
          <Download className="h-4 w-4" /> Download Architecture Vault (ZIP)
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Navigation List */}
        <div className="space-y-2 bg-white p-4 rounded-apple-lg border border-border-soft shadow-sm max-h-[600px] overflow-y-auto">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider px-2">Documentation Deliverables</span>
          {docs.map((doc) => (
            <button
              key={doc.num}
              onClick={() => setActiveItem(doc.num)}
              className={`w-full text-left p-3 rounded-apple-md transition-all flex items-start justify-between gap-2 ${
                activeItem === doc.num
                  ? "bg-brand-teal text-white font-semibold shadow-sm"
                  : "bg-background-secondary hover:bg-border-soft text-ink"
              }`}
            >
              <div className="space-y-0.5">
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  activeItem === doc.num ? "bg-white/20 text-white" : "bg-brand-teal/10 text-brand-teal"
                }`}>
                  Item #{doc.num}
                </span>
                <p className="text-xs leading-snug line-clamp-1">{doc.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Document Viewer */}
        <div className="md:col-span-2 bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-6">
          <div className="border-b border-border-soft pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-brand-teal font-bold bg-brand-teal/10 px-2 py-0.5 rounded">
                Item #{current.num}
              </span>
              <h2 className="text-xl font-display font-bold text-ink mt-1">{current.title}</h2>
              <p className="text-xs text-ink-muted">RFP Reference: {current.ref} | Fit Status: Fully Available</p>
            </div>
            <span className="px-3 py-1 bg-system-green/10 text-system-green text-xs font-semibold rounded-apple-pill">
              Verified Deliverable
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink">Scope &amp; Description</h3>
            <p className="text-caption text-ink-muted leading-relaxed bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              {current.desc}
            </p>

            <h3 className="text-sm font-semibold text-ink">Key Deliverable Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 border border-border-soft rounded-apple-md space-y-1">
                <span className="text-xs font-bold text-ink">Sign-Off Status</span>
                <p className="text-xs text-system-green font-semibold">Accepted by Expertise PMO</p>
              </div>
              <div className="p-3 border border-border-soft rounded-apple-md space-y-1">
                <span className="text-xs font-bold text-ink">File Format</span>
                <p className="text-xs text-ink-muted">Markdown &amp; PDF Export</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border-soft flex justify-end gap-3">
              <button className="px-4 py-2 bg-background-secondary border border-border-soft text-ink rounded-apple-md text-xs font-semibold hover:bg-border-soft transition-all">
                Preview Spec
              </button>
              <button className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> Download Deliverable
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
