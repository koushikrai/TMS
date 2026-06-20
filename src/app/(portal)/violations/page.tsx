"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, ShieldCheck, HelpCircle, DollarSign, 
  Plus, Search, X, Calendar, User, Info, ArrowRight, Gavel
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell, Tooltip } from "recharts";

export default function ViolationsDashboard() {
  const { violations, updateViolation, addToast } = useTMSStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVioId, setSelectedVioId] = useState<string | null>(null);

  // Virtualization parameters
  const [scrollTop, setScrollTop] = useState(0);
  const rowHeight = 52;
  const viewportHeight = 350;

  // 1. Calculations
  const totalOpen = violations.filter(v => v.status === 'Reported' || v.status === 'UnderReview').length;
  const underReview = violations.filter(v => v.status === 'UnderReview').length;
  const disputed = violations.filter(v => v.status === 'Disputed').length;
  const resolved = violations.filter(v => v.status === 'Resolved').length;

  const filteredViolations = violations.filter(v => 
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedVio = violations.find(v => v.id === selectedVioId);

  // Virtualization math
  const totalRows = filteredViolations.length;
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endIndex = Math.min(totalRows - 1, Math.floor((scrollTop + viewportHeight) / rowHeight) + 2);

  const visibleViolations = filteredViolations.slice(startIndex, endIndex + 1);
  const paddingTop = startIndex * rowHeight;
  const paddingBottom = Math.max(0, (totalRows - endIndex - 1) * rowHeight);

  // 2. Chart Mapping
  const radarData = [
    { subject: 'Speeding', A: 8, fullMark: 15 },
    { subject: 'Route Deviation', A: 4, fullMark: 15 },
    { subject: 'Geofence Breach', A: 6, fullMark: 15 },
    { subject: 'Doc Expiry', A: 3, fullMark: 15 }
  ];

  const sourceData = [
    { name: 'GPS Telemetry', value: 7, color: '#006B6B' },
    { name: 'Gov Portal (TGA)', value: 3, color: '#0066cc' },
    { name: 'Manual Inspections', value: 2, color: '#ff9500' }
  ];

  const handleResolveViolation = (id: string) => {
    updateViolation(id, { status: "Resolved" });
    addToast({
      type: "success",
      title: "Violation Resolved",
      message: `Violation ${id} has been marked as resolved and closed in audit logs.`
    });
    setSelectedVioId(null);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Violations & Compliance</h1>
          <p className="text-caption text-ink-muted mt-1">Review telemetry alerts, manage dispute overrides, and allocate financial penalties</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/violations/new"
            className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
          >
            <Plus className="h-4 w-4" />
            <span>Log Manual Violation</span>
          </Link>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Unresolved Infractions</span>
          <p className="text-display-md text-ink font-semibold mt-1">{totalOpen}</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Under Review</span>
          <p className="text-display-md text-brand-blue font-semibold mt-1">{underReview}</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Active Disputes</span>
          <p className="text-display-md text-system-orange font-semibold mt-1">{disputed}</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Resolved this month</span>
          <p className="text-display-md text-system-green font-semibold mt-1">{resolved}</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar type breakdown */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col items-center">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-4 w-full text-left">Infraction Categories Breakdown</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="subject" style={{ fontSize: 10, fill: '#1d1d1f' }} />
                <PolarRadiusAxis angle={30} domain={[0, 15]} style={{ fontSize: 8 }} />
                <Radar name="Violations" dataKey="A" stroke="#ff3b30" fill="#ff3b30" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source breakdown Pie */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col items-center">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-4 w-full text-left">Incident Trigger Sources</h3>
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom legends list */}
            <div className="w-1/2 space-y-2 text-xs">
              {sourceData.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-ink-muted">{item.name}</span>
                  </div>
                  <span className="font-semibold text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-caption-strong font-semibold text-ink">Incidents Registry Log (Virtualized)</h3>
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted pointer-events-none">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by ID, Vehicle, details..."
              className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-hairline rounded-apple-pill text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand-teal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[350px] overflow-y-auto" onScroll={handleScroll}>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-ink-muted font-medium uppercase tracking-wider text-[10px] bg-white sticky top-0 z-10">
                <th className="py-3">Violation ID</th>
                <th className="py-3">Vehicle</th>
                <th className="py-3">Category</th>
                <th className="py-3">Source</th>
                <th className="py-3">Cost Impact</th>
                <th className="py-3">Incident Date</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-ink font-semibold">
              {paddingTop > 0 && (
                <tr>
                  <td colSpan={7} style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {visibleViolations.map((vio) => (
                <tr 
                  key={vio.id} 
                  onClick={() => setSelectedVioId(vio.id)}
                  className="hover:bg-background-secondary transition-all cursor-pointer border-b border-border-soft"
                  style={{ height: `${rowHeight}px` }}
                >
                  <td className="py-2 font-mono text-brand-teal">{vio.id}</td>
                  <td className="py-2 font-bold">{vio.vehicleId}</td>
                  <td className="py-2 font-bold text-system-red">{vio.type}</td>
                  <td className="py-2 text-ink-muted">{vio.source}</td>
                  <td className="py-2 text-brand-teal">{vio.financialImpact ? `${vio.financialImpact.toLocaleString()} SAR` : "None"}</td>
                  <td className="py-2 text-ink-muted font-medium">{vio.capturedAt.split("T")[0]}</td>
                  <td className="py-2"><StatusBadge status={vio.status} /></td>
                </tr>
              ))}
              {paddingBottom > 0 && (
                <tr>
                  <td colSpan={7} style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- SLIDE-IN DETAIL PANEL (x: 100% -> 0) ---------------- */}
      <AnimatePresence>
        {selectedVio && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-end">
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-[480px] bg-white h-full p-6 flex flex-col justify-between shadow-product relative border-l border-border-soft overflow-y-auto"
            >
              <div>
                <button 
                  onClick={() => setSelectedVioId(null)}
                  className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center border border-border-hairline rounded-apple-pill hover:bg-background-secondary transition-all"
                >
                  <X className="h-4 w-4 text-ink-muted" />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs font-bold text-brand-teal">{selectedVio.id}</span>
                  <StatusBadge status={selectedVio.status} />
                </div>

                <h3 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight mb-5">
                  {selectedVio.type} Incident Details
                </h3>

                <div className="space-y-4 text-xs font-medium border-t border-border-soft pt-4">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Involved Vehicle:</span>
                    <span className="font-bold text-ink">{selectedVio.vehicleId}</span>
                  </div>
                  {selectedVio.driverId && (
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Assigned Driver:</span>
                      <span className="font-bold text-ink">{selectedVio.driverId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Trigger Source:</span>
                    <span className="text-brand-blue font-bold">{selectedVio.source}</span>
                  </div>
                  {selectedVio.financialImpact && (
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Cross-Charge Cost:</span>
                      <span className="text-system-red font-bold">{selectedVio.financialImpact} SAR</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5 border-t border-border-soft pt-4">
                    <span className="text-ink-muted">Incident Description:</span>
                    <p className="text-ink font-semibold leading-relaxed bg-background-secondary border border-border-soft p-3 rounded">
                      {selectedVio.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {selectedVio.status !== "Resolved" && (
                <div className="mt-8 pt-4 border-t border-border-soft space-y-2">
                  <button
                    onClick={() => handleResolveViolation(selectedVio.id)}
                    className="w-full py-2.5 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
                  >
                    Mark as Resolved
                  </button>
                  <button
                    onClick={() => {
                      updateViolation(selectedVio.id, { status: "Disputed" });
                      addToast({ type: "info", title: "Dispute Raised", message: `Violation ${selectedVio.id} marked as Disputed.` });
                      setSelectedVioId(null);
                    }}
                    className="w-full py-2.5 border border-system-orange hover:bg-system-orange/5 text-system-orange text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
                  >
                    File Dispute Override
                  </button>
                </div>
              )}

            </motion.aside>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
