"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Cpu, RefreshCw, CheckCircle2, AlertCircle, 
  Send, Database, Bell, Radio, Fingerprint, Fuel, ShieldCheck, Activity
} from "lucide-react";

export default function IntegrationsPage() {
  const [activeItem, setActiveItem] = useState<number>(81);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("2 mins ago");

  const integrations = [
    { num: 81, name: "SAP HCM Employee & Driver Sync", code: "SI-01", desc: "Bi-directional synchronization of employee records, roles, cost centers, and driver qualification statuses." },
    { num: 82, name: "SAP Employee Roster, Shift & Leave Sync", code: "SI-02", desc: "Sync shift patterns, active leave approvals, and daily availability for bus and light vehicle allocations." },
    { num: 83, name: "SAP PM Vehicle & Equipment Sync", code: "SI-03", desc: "Synchronize fleet assets, equipment serial numbers, and SAP Plant Maintenance condition ratings." },
    { num: 84, name: "SAP MM Vendor & Vendor-Vehicle Sync", code: "SI-04", desc: "Vendor master data, contract expiration badges, and sub-contracted vehicle master sync." },
    { num: 85, name: "SAP PM Maintenance Auto-Lockout Integration", code: "SI-05", desc: "Automatically block vehicle allocation in TMS when SAP PM work order is generated." },
    { num: 86, name: "SAP PS Project & WBS Cost Center Sync", code: "SI-06", desc: "Sync project WBS elements, internal orders, and department cost centers for transport billing." },
    { num: 87, name: "Automated SAP MM/CO Cross-Charge & Invoicing", code: "SI-07", desc: "Generate monthly cross-charging journal entries and vendor PO invocations in SAP MM/CO." },
    { num: 88, name: "SAP Fiori Inbox / Email / SMS Gateway", code: "SI-08", desc: "Push notification bridge dispatching approval tasks to SAP Fiori Inbox, SMS, and Email." },
    { num: 89, name: "Saudi Ex GPS Telematics Real-Time Ingestion", code: "SI-09", desc: "High-throughput API ingestion stream parsing raw GPS telematics, speed, and geofence events." },
    { num: 90, name: "ZKT BioTime Attendance Device Connector", code: "SI-10", desc: "Real-time punch-in/out event stream connector verifying driver duty hours and passenger boarding." },
    { num: 91, name: "Petro APP Digital Fuel Transaction Ingestion", code: "SI-11", desc: "Ingest fuel transaction logs (liters, station, odometer, SAR cost) from Petro APP API." },
    { num: 92, name: "KSA TGA / Naql / MIZAN Regulatory Alignment", code: "SI-12", desc: "Align transport permits, weight scales, and operating licenses with Saudi government portals." },
    { num: 93, name: "SAP CPI API Integration Monitor & Error Log", code: "SI-13", desc: "Centralized payload inspector, payload retry queue, HTTP status metrics, and CPI audit log console." }
  ];

  const current = integrations.find((i) => i.num === activeItem) || integrations[0];

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Just now");
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #81 – #93
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> SAP CPI Middleware Connected
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">SAP S/4HANA &amp; API Integration Console</h1>
          <p className="text-caption text-ink-muted">
            Bidirectional integration suite connecting SAP S/4HANA (HCM, PM, MM, CO, PS), Saudi Ex GPS, ZKT BioTime, and Petro APP.
          </p>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Syncing API Endpoints..." : "Trigger Full CPI Sync"}</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Integration Item Selector */}
        <div className="space-y-2 bg-white p-4 rounded-apple-lg border border-border-soft shadow-sm max-h-[600px] overflow-y-auto">
          <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider px-2">Integration Services</span>
          {integrations.map((item) => (
            <button
              key={item.num}
              onClick={() => setActiveItem(item.num)}
              className={`w-full text-left p-3 rounded-apple-md transition-all flex items-start justify-between gap-2 ${
                activeItem === item.num
                  ? "bg-brand-teal text-white font-semibold shadow-sm"
                  : "bg-background-secondary hover:bg-border-soft text-ink"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    activeItem === item.num ? "bg-white/20 text-white" : "bg-brand-teal/10 text-brand-teal"
                  }`}>
                    Item #{item.num}
                  </span>
                  <span className="text-[10px] font-mono opacity-80">({item.code})</span>
                </div>
                <p className="text-xs leading-snug line-clamp-1">{item.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Interface */}
        <div className="md:col-span-2 bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-6">
          <div className="border-b border-border-soft pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-brand-teal font-bold bg-brand-teal/10 px-2 py-0.5 rounded">
                Item #{current.num} • {current.code}
              </span>
              <h2 className="text-xl font-display font-bold text-ink mt-1">{current.name}</h2>
              <p className="text-xs text-ink-muted">Status: Live Ingestion • Last Sync: {lastSyncTime}</p>
            </div>
            <span className="px-3 py-1 bg-system-green/10 text-system-green text-xs font-semibold rounded-apple-pill flex items-center gap-1">
              <Activity className="h-3.5 w-3.5" /> Healthy 200 OK
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-ink">Service Summary</h3>
            <p className="text-caption text-ink-muted bg-background-secondary p-4 rounded-apple-md border border-border-soft">
              {current.desc}
            </p>

            <h3 className="text-sm font-semibold text-ink">Sample JSON Payload (SAP CPI Ingest)</h3>
            <div className="bg-ink text-white p-4 rounded-apple-md font-mono text-xs overflow-x-auto">
              <pre>{`{
  "header": {
    "systemId": "SAP-CPI-PROD",
    "integrationCode": "${current.code}",
    "timestamp": "2026-07-28T13:46:00Z"
  },
  "payload": {
    "itemNum": ${current.num},
    "service": "${current.name}",
    "status": "SUCCESS",
    "recordsProcessed": 142
  }
}`}</pre>
            </div>

            <div className="pt-4 border-t border-border-soft flex items-center justify-between">
              <span className="text-xs text-ink-muted">API Endpoint: <strong className="text-ink font-mono">/api/integrations/sap/{current.code.toLowerCase()}</strong></span>
              <button
                onClick={handleSimulateSync}
                className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" /> Test Payload
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
