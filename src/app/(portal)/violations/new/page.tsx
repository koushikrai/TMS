"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, Plus, FileText, Send, Trash2, HelpCircle, Check, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LogViolationPage() {
  const router = useRouter();
  const { addViolation, addToast } = useTMSStore();
  const [vehicleId, setVehicleId] = useState("LV-08");
  const [driverId, setDriverId] = useState("DRV-102");
  const [type, setType] = useState<'Speeding' | 'RouteDeviation' | 'GeofenceBreach' | 'DocumentNonCompliance'>("Speeding");
  const [source, setSource] = useState<'GPS' | 'Manual' | 'GovernmentPortal'>("Manual");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    
    // Add violation
    addViolation({
      vehicleId,
      driverId,
      type,
      source,
      description,
      capturedAt: new Date().toISOString(),
      evidence: ["/evidence.jpg"],
      financialImpact: impact,
      costCenter: "CC-200",
      driverRecordImpact: true
    });

    addToast({
      type: "success",
      title: "Violation Logged",
      message: "Incident successfully logged and forwarded to compliance supervisors."
    });
    
    router.push("/violations");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      
      {/* Back and Title */}
      <Link href="/violations" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Violations Dashboard</span>
      </Link>

      <div>
        <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Log Incident</h1>
        <p className="text-caption text-ink-muted mt-1">Submit manual compliance infractions or government portal traffic fines</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay space-y-5">
        
        {/* Source selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Incident Trigger Source</label>
            <select
              className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
            >
              <option value="Manual">Manual Inspection</option>
              <option value="GPS">GPS Auto-Trigger Telemetry</option>
              <option value="GovernmentPortal">KSA Government Portal (TGA/Tamm)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Violation Category</label>
            <select
              className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="Speeding">Speed Limit Exceeded</option>
              <option value="RouteDeviation">Unauthorized Route Deviation</option>
              <option value="GeofenceBreach">Geofence Restricted Zone Breach</option>
              <option value="DocumentNonCompliance">Expired Regulatory Permit</option>
            </select>
          </div>
        </div>

        {/* Entity Lookup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Vehicle Identification</label>
            <input 
              type="text"
              required
              placeholder="e.g. LV-08"
              className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Assigned Driver Code</label>
            <input 
              type="text"
              required
              placeholder="e.g. DRV-102"
              className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            />
          </div>
        </div>

        {/* Financial Linkage */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink">Projected Financial Fine / Penalty (SAR)</label>
          <input
            type="number"
            required
            className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink">Incident Description & Location details</label>
          <textarea
            required
            rows={4}
            placeholder="e.g. Speed limit breach of 120 km/h recorded on Jubail-Dammam Highway heading South near Km 12."
            className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink placeholder:text-ink-muted/50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Evidence upload mock */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink">Evidence Documents / Screenshots</label>
          <div className="border-2 border-dashed border-border-soft rounded-apple-md p-6 flex flex-col items-center justify-center bg-background-secondary text-center cursor-pointer hover:border-brand-teal transition-all">
            <FileText className="h-8 w-8 text-ink-muted mb-2 animate-bounce" />
            <span className="text-xs font-semibold text-ink">Drag evidence attachments here</span>
            <span className="text-[10px] text-ink-muted mt-1 leading-none">Supports PDF, PNG, JPEG up to 5MB</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all shadow-overlay"
        >
          Submit Compliance Incident Log
        </button>

      </form>

    </div>
  );
}
