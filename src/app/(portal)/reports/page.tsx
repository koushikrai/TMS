"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, FileSpreadsheet, TrendingUp, Sliders, Play, 
  HelpCircle, RefreshCw, Sparkles, ShieldCheck, Download, Share2, ToggleLeft, ToggleRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import gsap from "gsap";

type ReportTab = 'library' | 'kpis' | 'predictive' | 'simulation';

export default function ReportsHub() {
  const { addToast } = useTMSStore();
  const [activeTab, setActiveTab] = useState<ReportTab>('library');
  
  // KPI switches
  const [powerBiEnabled, setPowerBiEnabled] = useState<Record<string, boolean>>({
    "kpi-1": true, "kpi-2": false, "kpi-3": true
  });

  // What-if simulator states
  const [fleetSize, setFleetSize] = useState(80);
  const [occupancyTarget, setOccupancyTarget] = useState(85);
  
  const savedVehicles = Math.floor((100 - fleetSize) * 0.4 + (occupancyTarget - 70) * 0.3);
  const savedCost = savedVehicles * 6200;

  const countVehRef = useRef<HTMLSpanElement>(null);
  const countCostRef = useRef<HTMLSpanElement>(null);

  // GSAP Counter
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (countVehRef.current) {
        gsap.to({ val: 0 }, {
          val: Math.max(0, savedVehicles),
          duration: 0.6,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: function() {
            if (countVehRef.current) {
              countVehRef.current.textContent = Math.floor(this.targets()[0].val).toString();
            }
          }
        });
      }
      if (countCostRef.current) {
        gsap.to({ val: 0 }, {
          val: Math.max(0, savedCost),
          duration: 0.8,
          ease: "power2.out",
          onUpdate: function() {
            if (countCostRef.current) {
              countCostRef.current.textContent = Math.floor(this.targets()[0].val).toLocaleString();
            }
          }
        });
      }
    });
    return () => ctx.revert();
  }, [fleetSize, occupancyTarget, savedVehicles, savedCost]);

  const handleExport = (format: 'Excel' | 'PDF') => {
    addToast({
      type: "success",
      title: `${format} Export Triggered`,
      message: `System compiled report metrics and initiated background download.`
    });
  };

  const togglePowerBi = (id: string) => {
    setPowerBiEnabled(prev => ({ ...prev, [id]: !prev[id] }));
    addToast({
      type: "info",
      title: "Power BI Link Toggled",
      message: `OData REST endpoint state modified for target KPI.`
    });
  };

  // Recharts predictive cost trend data
  const trendData = [
    { month: "Jan", Cost: 120000, Forecast: 125000 },
    { month: "Feb", Cost: 115000, Forecast: 120000 },
    { month: "Mar", Cost: 130000, Forecast: 128000 },
    { month: "Apr", Cost: 125000, Forecast: 126000 },
    { month: "May", Cost: 140000, Forecast: 138000 },
    { month: "Jun", Cost: 135000, Forecast: 142000 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Reports & BI Analytics</h1>
          <p className="text-caption text-ink-muted mt-1">Expose Power BI links, run what-if simulators, and export financial logs</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border-soft space-x-6 select-none overflow-x-auto" role="tablist" aria-label="Reports hub tabs">
        {(['library', 'kpis', 'predictive', 'simulation'] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-caption font-semibold relative transition-all capitalize whitespace-nowrap ${
              activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span>{tab === 'kpis' ? 'KPI Studio' : (tab === 'predictive' ? 'Predictive Trends' : tab)}</span>
            {activeTab === tab && (
              <motion.div 
                layoutId="reportsTabIndicator" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Library */}
          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-caption-strong font-semibold text-ink">SAP-Aligned Report Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary hover:shadow-overlay transition-all flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal text-[9px] font-bold rounded uppercase">Fleet Operations</span>
                    <h4 className="text-xs font-bold text-ink mt-2">Fleet Utilisation Index</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Operational active hours mapped against scheduled idle shifts.</p>
                  </div>
                  <div className="mt-5 border-t border-border-soft pt-3 flex justify-end gap-2">
                    <button onClick={() => handleExport('Excel')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><FileSpreadsheet className="h-4.5 w-4.5" /></button>
                    <button onClick={() => handleExport('PDF')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><Download className="h-4.5 w-4.5" /></button>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary hover:shadow-overlay transition-all flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-[9px] font-bold rounded uppercase">Financials</span>
                    <h4 className="text-xs font-bold text-ink mt-2">WBS Cross-charge Audit</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Cross-charge logs posted back to SAP CO-PS cost accounts.</p>
                  </div>
                  <div className="mt-5 border-t border-border-soft pt-3 flex justify-end gap-2">
                    <button onClick={() => handleExport('Excel')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><FileSpreadsheet className="h-4.5 w-4.5" /></button>
                    <button onClick={() => handleExport('PDF')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><Download className="h-4.5 w-4.5" /></button>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary hover:shadow-overlay transition-all flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-system-orange/10 text-system-orange text-[9px] font-bold rounded uppercase">Vendors</span>
                    <h4 className="text-xs font-bold text-ink mt-2">Vendor SLA Compliance</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Weighted metrics comparing contractor billing rates and ETA buffers.</p>
                  </div>
                  <div className="mt-5 border-t border-border-soft pt-3 flex justify-end gap-2">
                    <button onClick={() => handleExport('Excel')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><FileSpreadsheet className="h-4.5 w-4.5" /></button>
                    <button onClick={() => handleExport('PDF')} className="p-1.5 hover:bg-white border border-transparent hover:border-border-soft rounded text-ink-muted hover:text-ink transition-all"><Download className="h-4.5 w-4.5" /></button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: KPIs */}
          {activeTab === 'kpis' && (
            <motion.div
              key="kpis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-caption-strong font-semibold text-ink">KPI Studio & Power BI Integrations</h3>
              
              <div className="space-y-4">
                
                {/* KPI 1 */}
                <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-ink">Fleet Active Hours Ratio (SLA Target: 85%)</span>
                    <p className="text-[10px] text-ink-muted mt-1">Exposes telemetry metrics via OData REST API</p>
                  </div>
                  <button onClick={() => togglePowerBi("kpi-1")}>
                    {powerBiEnabled["kpi-1"] ? (
                      <ToggleRight className="h-8 w-8 text-brand-teal" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-ink-muted" />
                    )}
                  </button>
                </div>

                {/* KPI 2 */}
                <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-ink">Driver Incident & Speed Violations Index</span>
                    <p className="text-[10px] text-ink-muted mt-1">Exposes driver compliance records via Tamm hook</p>
                  </div>
                  <button onClick={() => togglePowerBi("kpi-2")}>
                    {powerBiEnabled["kpi-2"] ? (
                      <ToggleRight className="h-8 w-8 text-brand-teal" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-ink-muted" />
                    )}
                  </button>
                </div>

                {/* KPI 3 */}
                <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-ink">Project WBS Budget Logistics cost</span>
                    <p className="text-[10px] text-ink-muted mt-1">Exposes project cross-charges to SAP Finance</p>
                  </div>
                  <button onClick={() => togglePowerBi("kpi-3")}>
                    {powerBiEnabled["kpi-3"] ? (
                      <ToggleRight className="h-8 w-8 text-brand-teal" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-ink-muted" />
                    )}
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: Predictive */}
          {activeTab === 'predictive' && (
            <motion.div
              key="predictive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Predictive Logistics Cost Forecast</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Chart (2/3) */}
                <div className="lg:col-span-2 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" style={{ fontSize: 9 }} />
                      <YAxis style={{ fontSize: 9 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="Cost" stroke="#006B6B" fill="rgba(0,107,107,0.15)" strokeWidth={2} />
                      <Area type="monotone" dataKey="Forecast" stroke="#0066cc" fill="rgba(0,102,204,0.1)" strokeWidth={1.5} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Anomaly sidebar (1/3) */}
                <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md text-xs space-y-3">
                  <div className="flex items-center gap-1.5 text-system-red font-semibold">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>Predictive replacement alerts</span>
                  </div>
                  <p className="text-[11px] text-ink-muted leading-relaxed">
                    Based on 12-month rolling maintenance logs, vehicle <span className="font-bold text-ink">LV-08</span> is approaching its cost-of-keep threshold. Replacement suggested.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: Simulation */}
          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <h3 className="text-caption-strong font-semibold text-ink">Operational What-If Simulator</h3>
                
                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-ink">
                    <span>Fleet Size Limit</span>
                    <span className="text-brand-teal font-bold">{fleetSize} Vehicles</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    className="w-full h-1.5 bg-border-soft rounded-apple-pill appearance-none cursor-pointer accent-brand-teal"
                    value={fleetSize}
                    onChange={(e) => setFleetSize(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-ink-muted">Reduces total available active light vehicles.</p>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-ink">
                    <span>Occupancy Target Buffer</span>
                    <span className="text-brand-blue font-bold">{occupancyTarget}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    className="w-full h-1.5 bg-border-soft rounded-apple-pill appearance-none cursor-pointer accent-brand-blue"
                    value={occupancyTarget}
                    onChange={(e) => setOccupancyTarget(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-ink-muted">Standard targeting index for consolidating lines.</p>
                </div>
              </div>

              {/* Outputs */}
              <div className="bg-background-secondary border border-border-soft p-5 rounded-apple-md flex flex-col justify-center items-center text-center gap-4">
                <div>
                  <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Simulated Vehicles Saved</p>
                  <h4 className="text-display-md text-brand-teal font-semibold mt-1 tracking-tight">
                    <span ref={countVehRef}>0</span> Units
                  </h4>
                </div>

                <div>
                  <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Projected Monthly Savings</p>
                  <h4 className="text-display-md text-brand-blue font-semibold mt-1 tracking-tight">
                    SAR <span ref={countCostRef}>0</span>
                  </h4>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
