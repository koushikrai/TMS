"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion } from "framer-motion";
import { 
  Clock, Truck, Wrench, AlertTriangle, ShieldCheck, 
  Sparkles, CheckCircle, BarChart3, Plus, RefreshCw
} from "lucide-react";

export default function HeavyHourMetersPage() {
  const { vehicles } = useTMSStore();
  const heavyList = vehicles.filter(v => v.category === 'Crane' || v.category === 'Truck' || v.category === 'Trailer' || v.category === 'LowBed' || v.category === 'HeavyEquipment');

  const [selectedEquipId, setSelectedEquipId] = useState<string>(heavyList[0]?.id || "HV-01");
  const [newReading, setNewReading] = useState<string>("");

  const selectedEquip = heavyList.find((h) => h.id === selectedEquipId) || heavyList[0];

  // Calculated metrics
  const totalOperatingHours = 4850;
  const idleHours = 620;
  const idlePercentage = Math.round((idleHours / totalOperatingHours) * 100);
  const hoursUntilPM = 150 - (totalOperatingHours % 150);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Item #40 &amp; #49
            </span>
            <span className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Hour Meter &amp; Idle Time Logger
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink mt-1">Heavy Equipment Hour Meter &amp; Operating Utilization</h1>
          <p className="text-caption text-ink-muted">
            Engine operating hours logging, idle vs productive ratio analytics, fuel burn rate per hour, and SAP PM maintenance triggers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-background-secondary p-2 rounded-apple-md border border-border-soft">
          <Truck className="h-4 w-4 text-brand-teal shrink-0" />
          <select
            value={selectedEquipId}
            onChange={(e) => setSelectedEquipId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-ink cursor-pointer focus:outline-none"
          >
            {heavyList.map((h) => (
              <option key={h.id} value={h.id}>
                {h.id} - {h.make} {h.model} ({h.plateNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Cumulative Engine Hours</span>
          <div className="text-2xl font-display font-bold text-ink mt-1">{totalOperatingHours} hrs</div>
          <span className="text-[11px] text-ink-muted">Recorded via Telematics &amp; Log</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Idle Hours Ratio</span>
          <div className="text-2xl font-display font-bold text-system-orange mt-1">{idlePercentage} % ({idleHours} hrs)</div>
          <span className="text-[11px] text-system-orange font-semibold">Target: &lt; 10% idle burn</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Hours to Next SAP PM</span>
          <div className="text-2xl font-display font-bold text-brand-teal mt-1">{hoursUntilPM} hrs</div>
          <span className="text-[11px] text-brand-teal font-semibold">PM Service Order #8801</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Fuel Consumption Rate</span>
          <div className="text-2xl font-display font-bold text-system-green mt-1">18.4 L / hr</div>
          <span className="text-[11px] text-ink-muted">Petro APP heavy card synced</span>
        </div>
      </div>

      {/* Log Form & Recent Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Log Entry Form */}
        <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
          <div className="border-b border-border-soft pb-3">
            <h3 className="text-base font-semibold text-ink">Record Daily Meter Reading</h3>
            <p className="text-xs text-ink-muted">Operator end-of-shift hours submission</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Meter reading logged!"); }} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink block mb-1">Current Hour Meter Value (Hrs)</label>
              <input
                type="number"
                placeholder={`Current: ${totalOperatingHours}`}
                value={newReading}
                onChange={(e) => setNewReading(e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary border border-border-soft rounded-apple-md text-xs text-ink focus:outline-none focus:border-brand-teal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink block mb-1">Operating Job Site</label>
              <input
                type="text"
                defaultValue="SADARA Refinery Expansion Project"
                className="w-full px-3 py-2 bg-background-secondary border border-border-soft rounded-apple-md text-xs text-ink focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all shadow-sm"
            >
              Submit Hour Meter Log
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-ink">Recent Engine Hour Logs for {selectedEquip?.make} {selectedEquip?.model}</h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-background-secondary border-b border-border-soft">
                <th className="p-3 font-semibold text-ink">Date &amp; Shift</th>
                <th className="p-3 font-semibold text-ink">Meter Reading</th>
                <th className="p-3 font-semibold text-ink">Operating Hrs</th>
                <th className="p-3 font-semibold text-ink">Idle Hrs</th>
                <th className="p-3 font-semibold text-ink">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {[
                { date: "2026-07-28 (Day Shift)", reading: "4,850 hrs", operating: "9.5 hrs", idle: "1.2 hrs", status: "Verified" },
                { date: "2026-07-27 (Night Shift)", reading: "4,839 hrs", operating: "10.0 hrs", idle: "0.8 hrs", status: "Verified" },
                { date: "2026-07-27 (Day Shift)", reading: "4,828 hrs", operating: "8.5 hrs", idle: "1.5 hrs", status: "Verified" }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-background-secondary/50">
                  <td className="p-3 font-semibold text-ink">{row.date}</td>
                  <td className="p-3 font-mono font-bold text-brand-teal">{row.reading}</td>
                  <td className="p-3 text-ink-muted">{row.operating}</td>
                  <td className="p-3 text-system-orange font-semibold">{row.idle}</td>
                  <td className="p-3 text-system-green font-semibold">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
