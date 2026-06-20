"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, HelpCircle, Star, Users, MapPin, 
  ChevronRight, Calendar, Info, Clock, AlertTriangle, Compass, Check
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

type RequestTab = 'permanent' | 'temporary' | 'trip';

export default function VehicleRequestHub() {
  const { addRequest, addToast, vehicles } = useTMSStore();
  const [activeTab, setActiveTab] = useState<RequestTab>('permanent');
  const [employeeId, setEmployeeId] = useState("EMP-1002");
  const [employeeGrade, setEmployeeGrade] = useState("M2"); // M1, M2, M3
  const [justification, setJustification] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [purpose, setPurpose] = useState("Operational Site Audit");

  // Smart allocation states
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Sheet status
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);

  // Grade vs Vehicle Type Helper
  const getEligibleType = (grade: string) => {
    if (grade === "M1") return "SUV (Full Size)";
    if (grade === "M2") return "Sedans / Small SUVs";
    return "Small SUVs only";
  };

  // Smart Suggest Simulation
  const handleSmartSuggest = () => {
    setIsSuggesting(true);
    setSuggestions([]);
    
    setTimeout(() => {
      // Find vehicles that match grade preference
      const filtered = vehicles
        .filter(v => {
          if (employeeGrade === "M1") return v.category === "SUV";
          if (employeeGrade === "M2") return v.category === "Sedan" || v.category === "SmallSUV";
          return v.category === "SmallSUV";
        })
        .slice(0, 3)
        .map((v, idx) => ({
          ...v,
          score: 95 - idx * 4 - (v.ownership === 'Vendor' ? 5 : 0), // preference to Owned
          proximity: `${0.8 + idx * 0.4} km from depot`,
          history: "Excellent (0 breakdowns)"
        }));

      setSuggestions(filtered);
      setIsSuggesting(false);
      addToast({
        type: "success",
        title: "Suggestions Loaded",
        message: "Smart Suggest engine identified eligible vehicles for your grade."
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      addToast({
        type: "warning",
        title: "Vehicle Selection Required",
        message: "Please choose a suggested vehicle before submitting."
      });
      return;
    }

    // Call store action
    addRequest({
      type: activeTab === 'permanent' ? 'LightVehicle_Permanent' : (activeTab === 'temporary' ? 'LightVehicle_Temporary' : 'LightVehicle_Trip'),
      requestorId: employeeId,
      requestorName: "Employee Name " + employeeId.split("-")[1],
      department: "Operations Department",
      costCenter: "CC-200",
      purpose: justification || purpose,
      scheduledDate: tripDate || new Date().toISOString().split('T')[0],
      pickupLocation: { name: "Expertise HQ - Jubail", lat: 27.0112, lng: 49.6234 },
      dropLocation: { name: "SADARA Site", lat: 26.9112, lng: 49.4234 },
      assignedVehicleId: selectedVehicleId
    });

    setShowSuccessSheet(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative pb-20">
      
      {/* Title */}
      <div>
        <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Vehicle Request Hub</h1>
        <p className="text-caption text-ink-muted mt-1">Submit permanent allocation or short-term trip dispatch requests</p>
      </div>

      {/* Tabs list with indicator */}
      <div className="flex border-b border-border-soft space-x-6 select-none">
        {(['permanent', 'temporary', 'trip'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSuggestions([]);
              setSelectedVehicleId(null);
            }}
            className={`pb-3 text-caption font-semibold relative transition-all capitalize ${
              activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span>{tab === 'trip' ? 'One-time Trip' : `${tab} allocation`}</span>
            {activeTab === tab && (
              <motion.div 
                layoutId="requestTabIndicator" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Forms column (left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSubmit} className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay space-y-5">
            <h3 className="text-caption-strong font-semibold text-ink">Request Configurations</h3>
            
            {/* Employee information card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">SAP Employee Lookup</label>
                <input 
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">Employee Category Grade</label>
                <select
                  className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
                  value={employeeGrade}
                  onChange={(e) => {
                    setEmployeeGrade(e.target.value);
                    setSuggestions([]);
                    setSelectedVehicleId(null);
                  }}
                >
                  <option value="M1">Executive Director (Grade M1)</option>
                  <option value="M2">Operations Manager (Grade M2)</option>
                  <option value="M3">Supervisor Grade (Grade M3)</option>
                </select>
              </div>
            </div>

            {/* Eligibility Banner Info */}
            <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-apple-sm p-4 flex gap-3 text-xs">
              <Info className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink">SAP Grade Policy Eligibility Check</p>
                <p className="text-ink-muted mt-1 leading-relaxed">
                  Based on Grade <span className="font-bold text-brand-blue">{employeeGrade}</span>, the employee is eligible for: 
                  <span className="font-bold text-ink"> {getEligibleType(employeeGrade)}</span>.
                </p>
              </div>
            </div>

            {/* Tab specific fields */}
            {activeTab === 'permanent' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">Justification for Permanent Use</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Allocation required for daily site monitoring at Jubail Port projects."
                  className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink placeholder:text-ink-muted/50"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'temporary' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Start & End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Temporary Allocation Purpose</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'trip' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Trip Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Purpose Code</label>
                  <select className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink">
                    <option value="OP">Operations Site Audit</option>
                    <option value="HR">Employee Emergency Transfer</option>
                    <option value="CLIENT">Client Site Tour</option>
                  </select>
                </div>
              </div>
            )}

            {/* Smart Suggest triggering */}
            <div className="border-t border-border-soft pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="text-xs text-ink-muted">
                <span>Select vehicle using the Smart Suggest Allocation Engine</span>
              </div>
              <button
                type="button"
                onClick={handleSmartSuggest}
                className="h-10 px-4 bg-background-secondary hover:bg-border-soft border border-border-soft rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active text-ink"
              >
                <Compass className="h-4 w-4 text-brand-teal animate-pulse" />
                <span>Smart Suggest Allocation</span>
              </button>
            </div>

            {/* Suggestions lists */}
            {isSuggesting && (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-teal border-t-transparent" />
                <span className="text-xs text-ink-muted font-medium">Resolving proximity coordinates...</span>
              </div>
            )}

            {!isSuggesting && suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Suggested Vehicles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {suggestions.map((s, idx) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedVehicleId(s.id)}
                      className={`border p-4 rounded-apple-md cursor-pointer hover:shadow-overlay transition-all flex flex-col justify-between ${
                        selectedVehicleId === s.id 
                          ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal" 
                          : "border-border-soft bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-bold text-brand-teal">{s.ownership}</span>
                          <span className="text-[11px] font-bold text-brand-blue">{s.score}% Match</span>
                        </div>
                        <h5 className="text-xs font-semibold text-ink mt-2">{s.make} {s.model}</h5>
                        <p className="text-[10px] text-ink-muted mt-0.5 tracking-wider">{s.plateNumber}</p>
                      </div>

                      <div className="mt-4 border-t border-border-soft pt-2.5 space-y-1 text-[9px] text-ink-muted font-medium">
                        <p>Proximity: {s.proximity}</p>
                        <p>Rating: {s.history}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Form submit */}
            {selectedVehicleId && (
              <div className="border-t border-border-soft pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all shadow-overlay"
                >
                  Submit Request and Assign Vehicle
                </button>
              </div>
            )}

          </form>

        </div>

        {/* Info Column: Approval flow visualizer (right 1/3) */}
        <div className="space-y-6">
          <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col">
            <h3 className="text-caption-strong font-semibold text-ink mb-4">Approval Chain Preview</h3>
            
            <div className="relative pl-8 space-y-8 border-l border-border-soft ml-3 py-1.5">
              {/* Step 1: Supervisor */}
              <div className="relative">
                <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-[9px] shadow-overlay border border-white">
                  1
                </span>
                <h5 className="text-xs font-semibold text-ink leading-none">Fleet Supervisor Approval</h5>
                <p className="text-[10px] text-ink-muted mt-1 leading-normal">Assigns driver, validates operational schedule.</p>
                <div className="mt-2 text-[10px] text-brand-teal font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Derived from SAP Org Structure</span>
                </div>
              </div>

              {/* Step 2: Manager */}
              <div className="relative">
                <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-background-secondary text-ink-muted rounded-full flex items-center justify-center font-bold text-[9px] border border-border-soft">
                  2
                </span>
                <h5 className="text-xs font-semibold text-ink leading-none">Department Manager Review</h5>
                <p className="text-[10px] text-ink-muted mt-1 leading-normal">Verifies WBS cost center allocation.</p>
              </div>

              {/* Step 3: Dispatch */}
              <div className="relative">
                <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-background-secondary text-ink-muted rounded-full flex items-center justify-center font-bold text-[9px] border border-border-soft">
                  3
                </span>
                <h5 className="text-xs font-semibold text-ink leading-none">Automatic Dispatched</h5>
                <p className="text-[10px] text-ink-muted mt-1 leading-normal">Dispatches keys, maps route to target GPS.</p>
              </div>
            </div>

            {/* Line SVG Path Animation Simulation Overlay */}
            <div className="mt-4 pt-4 border-t border-border-soft flex items-center gap-1.5 text-[10px] text-ink-muted leading-tight">
              <Compass className="h-4.5 w-4.5 text-brand-teal animate-spin" />
              <span>SVG path draw lines will render active updates on submission.</span>
            </div>
          </div>
        </div>

      </div>

      {/* ---------------- iOS STYLE BOTTOM SHEET ---------------- */}
      <AnimatePresence>
        {showSuccessSheet && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center select-none">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-[500px] bg-white rounded-t-apple-lg border-t border-border-soft p-8 shadow-product flex flex-col items-center text-center gap-5"
            >
              {/* Animated checkmark */}
              <div className="h-16 w-16 bg-system-green/10 border border-system-green/30 text-system-green rounded-full flex items-center justify-center shadow-overlay">
                <Check className="h-8 w-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="text-display-md font-semibold text-ink tracking-tight">Request Logged</h3>
                <p className="text-caption text-ink-muted mt-1">
                  Allocation registered successfully in the system. The approval chain nodes have been activated.
                </p>
              </div>

              <div className="w-full bg-background-secondary border border-border-soft p-4 rounded-apple-md text-xs font-medium text-ink-muted space-y-2 text-left">
                <div className="flex justify-between">
                  <span>SAP Employee:</span>
                  <span className="font-semibold text-ink">{employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Assigned Vehicle:</span>
                  <span className="font-semibold text-ink">{selectedVehicleId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Initial Status:</span>
                  <span className="font-semibold text-system-orange uppercase text-[10px]">Under Approval</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessSheet(false);
                  setSuggestions([]);
                  setSelectedVehicleId(null);
                  setJustification("");
                }}
                className="w-full py-3 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
