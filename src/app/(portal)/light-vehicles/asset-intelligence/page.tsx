"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, AlertTriangle, Car, ShieldAlert, Fuel, Wrench, 
  DollarSign, BarChart3, ArrowRight, Sparkles, CheckCircle, RefreshCw, Layers
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export default function AssetIntelligencePage() {
  const { vehicles } = useTMSStore();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || "LV-01");

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Simulated metrics for the Sell vs Keep model based on selected vehicle
  const year = selectedVehicle?.year || 2021;
  const ageYears = 2026 - year;
  const maintenanceCostSar = (ageYears * 12500) + (selectedVehicle?.maintenanceHistory.reduce((acc, m) => acc + m.cost, 0) || 5000);
  const fuelCostSar = ageYears * 18400;
  const totalOperatingCostSar = maintenanceCostSar + fuelCostSar;
  const currentAssetValueSar = Math.max(15000, 110000 - (ageYears * 14500));
  const projectedNextYearMaintSar = maintenanceCostSar * 0.35 + 8500;

  // Recommendation engine score (0 - 100). > 65 means Sell, <= 65 means Keep
  const sellScore = Math.min(98, Math.round((maintenanceCostSar / (currentAssetValueSar || 1)) * 45 + (ageYears * 8)));
  const recommendation = sellScore > 65 ? "RECOMMEND SELL / RETIRE" : "RECOMMEND KEEP / RETAIN";
  const recommendationReason = sellScore > 65 
    ? `Cumulative maintenance SAR ${maintenanceCostSar.toLocaleString()} exceeds 40% of current asset value (SAR ${currentAssetValueSar.toLocaleString()}). Next year projected repairs exceed SAR ${projectedNextYearMaintSar.toLocaleString()}.`
    : `Asset operating cost per km is optimal (SAR 0.42/km). Preventive maintenance history is up-to-date with high residual value.`;

  // Sample chart data for maintenance vs residual value
  const chartData = [
    { year: "2022", maintenance: 4200, residualValue: 95000, fuel: 14000 },
    { year: "2023", maintenance: 8900, residualValue: 81000, fuel: 15500 },
    { year: "2024", maintenance: 15400, residualValue: 68000, fuel: 17000 },
    { year: "2025", maintenance: 24800, residualValue: 54000, fuel: 18200 },
    { year: "2026 (Est)", maintenance: maintenanceCostSar, residualValue: currentAssetValueSar, fuel: fuelCostSar }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-apple-xl border border-border-soft shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Item #28 &amp; #35
            </span>
            <span className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Sell / Keep Recommendation Model
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink mt-1">Vehicle Ownership &amp; Lifecycle Intelligence</h1>
          <p className="text-caption text-ink-muted">
            Chain of ownership history, accident tracking, maintenance cost accumulation, and AI-driven Sell or Keep asset optimization model.
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="flex items-center gap-2 bg-background-secondary p-2 rounded-apple-md border border-border-soft">
          <Car className="h-4 w-4 text-brand-teal shrink-0" />
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-ink focus:outline-none cursor-pointer"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} - {v.make} {v.model} ({v.plateNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sell / Keep AI Recommendation Hero Card */}
      <div className={`p-6 rounded-apple-xl border shadow-overlay transition-all ${
        sellScore > 65 
          ? "bg-gradient-to-br from-system-red/10 via-white to-system-orange/5 border-system-red/30" 
          : "bg-gradient-to-br from-system-green/10 via-white to-brand-teal/5 border-system-green/30"
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-apple-pill text-xs font-bold uppercase tracking-wider ${
                sellScore > 65 ? "bg-system-red text-white" : "bg-system-green text-white"
              }`}>
                {recommendation}
              </span>
              <span className="text-xs font-mono font-bold text-ink-muted">
                Replacement Risk Score: <strong className="text-ink">{sellScore}/100</strong>
              </span>
            </div>

            <h2 className="text-xl font-display font-bold text-ink">
              Asset Lifecycle Decision Analysis for {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.plateNumber})
            </h2>

            <p className="text-caption text-ink-muted leading-relaxed">
              {recommendationReason}
            </p>
          </div>

          {/* Meter Gauge */}
          <div className="bg-white p-4 rounded-apple-lg border border-border-soft shadow-sm text-center shrink-0 w-full md:w-56 space-y-2">
            <span className="text-xs font-semibold text-ink-muted uppercase">Retention Threshold</span>
            <div className="text-3xl font-display font-bold text-ink">
              {sellScore} <span className="text-xs text-ink-muted font-normal">/ 100</span>
            </div>
            <div className="w-full h-2.5 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${sellScore > 65 ? "bg-system-red" : "bg-system-green"}`} 
                style={{ width: `${sellScore}%` }} 
              />
            </div>
            <span className="text-[10px] text-ink-muted block">Score &gt; 65 triggers sell recommendation</span>
          </div>
        </div>
      </div>

      {/* Cost & Lifecycle Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold flex items-center gap-1.5">
            <Wrench className="h-4 w-4 text-brand-teal" /> Cumulative Maintenance
          </span>
          <div className="text-2xl font-display font-bold text-ink mt-1">
            SAR {maintenanceCostSar.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">{selectedVehicle?.maintenanceHistory.length || 3} recorded work orders</span>
        </div>

        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold flex items-center gap-1.5">
            <Fuel className="h-4 w-4 text-system-orange" /> Fuel Expenditure
          </span>
          <div className="text-2xl font-display font-bold text-ink mt-1">
            SAR {fuelCostSar.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Petro APP card integrated</span>
        </div>

        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-system-green" /> Residual Market Value
          </span>
          <div className="text-2xl font-display font-bold text-system-green mt-1">
            SAR {currentAssetValueSar.toLocaleString()}
          </div>
          <span className="text-[11px] text-ink-muted">Based on KSA market depreciation</span>
        </div>

        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-system-red" /> Accident &amp; Damage Log
          </span>
          <div className="text-2xl font-display font-bold text-ink mt-1">
            1 Recorded
          </div>
          <span className="text-[11px] text-system-red font-semibold">Minor fender damage (SAR 2,400)</span>
        </div>
      </div>

      {/* Interactive Charts & Chain of Custody */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost vs Residual Value Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-soft pb-3">
            <div>
              <h3 className="text-base font-semibold text-ink">Cumulative Operating Cost vs Asset Depreciation</h3>
              <p className="text-xs text-ink-muted">Historical and projected maintenance &amp; fuel costs over vehicle lifecycle</p>
            </div>
            <span className="text-xs font-mono bg-brand-teal/10 text-brand-teal px-2.5 py-1 rounded-apple-pill font-bold">
              SAP PM / CO Synced
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMaint" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066cc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008080" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="maintenance" name="Cumulative Maintenance (SAR)" stroke="#0066cc" fillOpacity={1} fill="url(#colorMaint)" />
                <Area type="monotone" dataKey="residualValue" name="Residual Market Value (SAR)" stroke="#008080" fillOpacity={1} fill="url(#colorResid)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chain of Custody & Ownership Transfer Log */}
        <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
          <div className="border-b border-border-soft pb-3">
            <h3 className="text-base font-semibold text-ink">Chain of Custody &amp; Handover History</h3>
            <p className="text-xs text-ink-muted">Historical employee assignments and custody transfers</p>
          </div>

          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-soft">
            {[
              { driver: "Sultan Al-Otaibi", dept: "Operations - Jubail", period: "Jan 2025 - Present", status: "Active" },
              { driver: "Tariq Al-Harbi", dept: "Logistics - Dammam", period: "Mar 2023 - Dec 2024", status: "Transferred" },
              { driver: "Fahad Al-Qahtani", dept: "Fleet Management Pool", period: "Jan 2022 - Feb 2023", status: "Handed Over" }
            ].map((c, idx) => (
              <div key={idx} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-brand-teal ring-4 ring-white" />
                <span className="text-xs font-bold text-ink">{c.driver}</span>
                <p className="text-[11px] text-ink-muted">{c.dept}</p>
                <div className="flex items-center justify-between text-[10px] text-ink-muted pt-0.5">
                  <span>{c.period}</span>
                  <span className="font-semibold text-brand-teal">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
