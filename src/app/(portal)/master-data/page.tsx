"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  MapPin, Route as RouteIcon, FileText, CheckSquare, Plus, Edit2, 
  Trash2, Play, RefreshCw, AlertTriangle, ShieldCheck, Database, Sliders, Check,
  Compass, CheckCircle
} from "lucide-react";

type MDMTab = 'locations' | 'routes' | 'compliance' | 'quality';

export default function MasterDataPage() {
  const { routes, addToast, addAuditLog } = useTMSStore();
  const [activeTab, setActiveTab] = useState<MDMTab>('locations');
  
  // Locations state
  const [locations, setLocations] = useState([
    { id: "LOC-01", name: "Expertise HQ - Jubail", type: "Site", lat: 27.0112, lng: 49.6234, radius: 200, status: "Active" },
    { id: "LOC-02", name: "Jubail Yard A", type: "Yard", lat: 27.0315, lng: 49.6105, radius: 500, status: "Active" },
    { id: "LOC-03", name: "Jubail Depot B", type: "Depot", lat: 26.9856, lng: 49.5991, radius: 800, status: "Active" },
    { id: "LOC-04", name: "Jubail Port Facility", type: "Site", lat: 27.0210, lng: 49.6672, radius: 400, status: "Active" },
  ]);
  const [isTestingGeofence, setIsTestingGeofence] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState<"OUT" | "IN">("OUT");
  const [newLocName, setNewLocName] = useState("");
  const [newLocType, setNewLocType] = useState("Site");

  // Route states
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  // Compliance rules state
  const [complianceRules, setComplianceRules] = useState([
    { id: "CR-01", name: "Istimara Renewal", authority: "KSA Traffic Dept", alertDays: 30, criticalDays: 7, category: "Vehicle" },
    { id: "CR-02", name: "Naql Operation Card", authority: "KSA TGA Agency", alertDays: 45, criticalDays: 15, category: "Regulatory" },
    { id: "CR-03", name: "MIZAN Weight Permit", authority: "KSA Ministry of Transport", alertDays: 15, criticalDays: 3, category: "Heavy Equipment" },
    { id: "CR-04", name: "Iqama Work Permit", authority: "KSA Ministry of HR", alertDays: 60, criticalDays: 15, category: "Driver" },
  ]);

  // Data Quality errors state
  const [qualityErrors, setQualityErrors] = useState([
    { id: "ERR-102", type: "Duplicate", entity: "Driver Iqama", detail: "Duplicate Iqama 2400000122 assigned to Mansour Al-Otaibi", status: "Open" },
    { id: "ERR-104", type: "Missing Field", entity: "Vehicle Plate", detail: "Missing plate number for Equipment No EQ-800045", status: "Open" },
  ]);

  // Simulated Geofence Simulation
  const handleTestGeofence = () => {
    setIsTestingGeofence(true);
    setGeofenceStatus("OUT");
    
    // Animate coordinates crossing over 3 seconds
    setTimeout(() => {
      setGeofenceStatus("IN");
      addToast({
        type: "success",
        title: "Geofence Violation Logged",
        message: "Test vehicle entered restricted perimeter at Jubail Yard A."
      });
      addAuditLog("Tested Geofence Perimeter", "MasterData", "Simulated entry event logged successfully.");
    }, 2000);

    setTimeout(() => {
      setIsTestingGeofence(false);
    }, 3500);
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName) return;
    const newLoc = {
      id: `LOC-0${locations.length + 1}`,
      name: newLocName,
      type: newLocType,
      lat: 27.01 + Math.random() * 0.05,
      lng: 49.61 + Math.random() * 0.05,
      radius: 300,
      status: "Active"
    };
    setLocations([...locations, newLoc]);
    setNewLocName("");
    addToast({
      type: "success",
      title: "Location Registered",
      message: `${newLocName} has been successfully added to MDM.`
    });
  };

  const fixQualityError = (id: string) => {
    setQualityErrors(qualityErrors.filter(e => e.id !== id));
    addToast({
      type: "success",
      title: "Data Reconciled",
      message: `Error ${id} resolved and written back to SAP S/4HANA.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Master Data Management</h1>
        <p className="text-caption text-ink-muted mt-1">Operational parameters, geofences, compliance registries, and SAP reconciliation logs</p>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-border-soft space-x-6 select-none">
        {(['locations', 'routes', 'compliance', 'quality'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-caption font-semibold relative transition-all ${
              activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span className="capitalize">{tab === 'quality' ? 'Data Quality' : tab}</span>
            {activeTab === tab && (
              <motion.div 
                layoutId="mdmTabIndicator" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay">
        
        {/* ================= TAB 1: LOCATIONS ================= */}
        {activeTab === 'locations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 cols: List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-caption-strong font-semibold text-ink">Registered Sites & Geofences</h3>
                <button 
                  onClick={handleTestGeofence}
                  disabled={isTestingGeofence}
                  className="h-9 px-3 bg-brand-teal text-white hover:bg-[#005a5a] disabled:bg-system-gray rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isTestingGeofence ? "Testing Geofence..." : "Test Geofence Simulation"}</span>
                </button>
              </div>

              {/* Geofence visualizer sandbox */}
              {isTestingGeofence && (
                <div className="border border-border-soft rounded-apple-md bg-background-secondary p-4 flex flex-col items-center justify-center relative overflow-hidden">
                  <span className="text-[10px] text-ink-muted font-bold absolute top-2 left-3 uppercase">Simulation Sandbox</span>
                  
                  <div className="flex items-center gap-12 py-6">
                    {/* Vehicle Dot */}
                    <motion.div
                      animate={{ x: geofenceStatus === "IN" ? 140 : 0 }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                      className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-white shadow-product z-10"
                    >
                      <MapPin className="h-4 w-4" />
                    </motion.div>
                    
                    {/* Boundary line */}
                    <div className="h-20 w-0.5 bg-system-red border border-system-red/30 relative flex items-center justify-center">
                      <span className="absolute bg-white px-2 py-0.5 text-[8px] font-bold text-system-red border border-system-red/20 rounded uppercase -top-4">Boundary</span>
                    </div>

                    {/* Yard Center */}
                    <div className="h-16 w-16 rounded-full border-2 border-brand-teal border-dashed flex items-center justify-center text-brand-teal bg-brand-teal/5">
                      <span className="text-[9px] font-bold uppercase text-center">Jubail Yard A</span>
                    </div>
                  </div>

                  <div className="text-xs font-semibold flex gap-2">
                    <span className="text-ink-muted">Vehicle State:</span>
                    <span className={geofenceStatus === "IN" ? "text-system-red animate-pulse" : "text-brand-blue"}>
                      {geofenceStatus === "IN" ? "BREACHED (INSIDE YARD)" : "APPROACHING BOUNDARY (OUTSIDE)"}
                    </span>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-soft text-ink-muted font-medium">
                      <th className="py-3">Name</th>
                      <th className="py-3">Type</th>
                      <th className="py-3">Coordinates</th>
                      <th className="py-3">Radius</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft text-ink">
                    {locations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-background-secondary transition-all">
                        <td className="py-3.5 font-semibold flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-brand-teal shrink-0" />
                          <span>{loc.name}</span>
                        </td>
                        <td className="py-3.5">{loc.type}</td>
                        <td className="py-3.5 font-mono text-[10px]">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</td>
                        <td className="py-3.5 font-semibold text-brand-blue">{loc.radius}m</td>
                        <td className="py-3.5"><StatusBadge status={loc.status} /></td>
                        <td className="py-3.5 text-right space-x-2">
                          <button className="p-1 hover:bg-border-soft rounded text-ink-muted hover:text-ink"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button className="p-1 hover:bg-system-red/10 rounded text-ink-muted hover:text-system-red"><Trash2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right col: Add form */}
            <div className="bg-background-secondary border border-border-soft rounded-apple-md p-5 h-fit">
              <h4 className="text-caption-strong font-semibold text-ink mb-4">Register New Location</h4>
              <form onSubmit={handleAddLocation} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Location / Site Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jubail Yard C"
                    className="w-full px-3 py-2 bg-white border border-border-hairline rounded-apple-sm text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal text-ink"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Type</label>
                  <select
                    className="w-full px-3 py-2 bg-white border border-border-hairline rounded-apple-sm text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal text-ink"
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value)}
                  >
                    <option value="Site">Site / Construction Point</option>
                    <option value="Yard">Yards & Equipment Depot</option>
                    <option value="Depot">Employee Drop Yard</option>
                    <option value="Restricted">Restricted Regulatory Area</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register site</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ROUTES ================= */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-caption-strong font-semibold text-ink">Global Route Master Directory</h3>
              <button className="h-9 px-3.5 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay">
                <Plus className="h-4 w-4" />
                <span>Create Custom Route</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-ink-muted font-medium">
                    <th className="py-3">Route ID</th>
                    <th className="py-3">Route Name</th>
                    <th className="py-3">Distance</th>
                    <th className="py-3">Est. Duration</th>
                    <th className="py-3">Stops</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft text-ink">
                  {routes.slice(0, 8).map((route) => {
                    const isExpanded = expandedRouteId === route.id;
                    return (
                      <React.Fragment key={route.id}>
                        <tr 
                          onClick={() => setExpandedRouteId(isExpanded ? null : route.id)}
                          className="hover:bg-background-secondary transition-all cursor-pointer"
                        >
                          <td className="py-3.5 font-mono font-bold text-brand-teal">{route.id}</td>
                          <td className="py-3.5 font-semibold flex items-center gap-1.5">
                            <RouteIcon className="h-4 w-4 text-brand-blue" />
                            <span>{route.name}</span>
                          </td>
                          <td className="py-3.5">{route.distanceKm.toFixed(1)} km</td>
                          <td className="py-3.5">{route.estDurationMinutes} mins</td>
                          <td className="py-3.5 font-semibold text-brand-teal">{route.stops.length + 2} stops</td>
                          <td className="py-3.5">
                            <StatusBadge status={route.complianceFlag ? "Active" : "Critical"} />
                          </td>
                          <td className="py-3.5 text-right">
                            <span className="text-[10px] text-brand-blue font-bold hover:underline">
                              {isExpanded ? "Hide map" : "Show map"}
                            </span>
                          </td>
                        </tr>
                        
                        {/* Expandable path visualization row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="bg-background-secondary p-4 border border-border-soft rounded-apple-sm">
                              <div className="flex flex-col md:flex-row gap-6 items-center">
                                {/* SVG Route representation */}
                                <div className="flex-1 w-full h-24 bg-white border border-border-soft rounded-apple-sm p-4 relative flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 bg-brand-teal rounded-full" />
                                    <div className="flex flex-col">
                                      <span className="text-[9px] uppercase text-ink-muted">Origin</span>
                                      <span className="text-xs font-semibold text-ink">{route.origin.name}</span>
                                    </div>
                                  </div>

                                  <div className="flex-1 mx-4 h-0.5 border-t-2 border-dashed border-border-hairline relative flex items-center justify-center">
                                    <Compass className="h-4 w-4 text-brand-blue bg-white px-0.5 animate-pulse" />
                                  </div>

                                  <div className="flex items-center gap-1.5 text-right">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] uppercase text-ink-muted">Destination</span>
                                      <span className="text-xs font-semibold text-ink">{route.destination.name}</span>
                                    </div>
                                    <div className="h-2.5 w-2.5 bg-brand-blue rounded-full" />
                                  </div>
                                </div>

                                <div className="space-y-2 text-xs md:w-64">
                                  <div className="flex justify-between">
                                    <span className="text-ink-muted">Waypoints:</span>
                                    <span className="font-semibold text-ink">{route.stops.map(s => s.name).join(", ") || "Direct route"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-ink-muted">SLA Compliance:</span>
                                    <span className="font-semibold text-system-green">98.4%</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COMPLIANCE ================= */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-caption-strong font-semibold text-ink">Global Regulatory Document Types Registry</h3>
              <button className="h-9 px-3 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active">
                <Plus className="h-4 w-4" />
                <span>Add Registry Rule</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-ink-muted font-medium">
                    <th className="py-3">Document Rule</th>
                    <th className="py-3">Issuing Authority</th>
                    <th className="py-3">Scope Category</th>
                    <th className="py-3">Warning Lead Time</th>
                    <th className="py-3">Critical Lead Time</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft text-ink">
                  {complianceRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-background-secondary transition-all">
                      <td className="py-3.5 font-semibold flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-brand-teal" />
                        <span>{rule.name}</span>
                      </td>
                      <td className="py-3.5">{rule.authority}</td>
                      <td className="py-3.5"><StatusBadge status={rule.category} /></td>
                      <td className="py-3.5 font-semibold text-system-orange">{rule.alertDays} days prior</td>
                      <td className="py-3.5 font-semibold text-system-red">{rule.criticalDays} days prior</td>
                      <td className="py-3.5 text-right space-x-2">
                        <button className="p-1 hover:bg-border-soft rounded text-ink-muted hover:text-ink"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button className="p-1 hover:bg-system-red/10 rounded text-ink-muted hover:text-system-red"><Trash2 className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: QUALITY CONTROLS ================= */}
        {activeTab === 'quality' && (
          <div className="space-y-8">
            
            {/* Upper grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background-secondary border border-border-soft rounded-apple-md p-4">
                <div className="flex items-center gap-2 mb-2 text-brand-teal">
                  <Database className="h-5 w-5" />
                  <h4 className="text-xs font-semibold text-ink">SAP S/4HANA Sync Status</h4>
                </div>
                <p className="text-[10px] text-ink-muted">Last automatic reconciliation pull:</p>
                <p className="text-xs font-semibold text-ink mt-1">2026-06-20 12:45:00 (Asia/Riyadh)</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-system-green font-bold uppercase">
                  <Check className="h-3.5 w-3.5" />
                  <span>Operational Connected</span>
                </div>
              </div>

              <div className="bg-background-secondary border border-border-soft rounded-apple-md p-4">
                <div className="flex items-center gap-2 mb-2 text-brand-blue">
                  <Sliders className="h-5 w-5" />
                  <h4 className="text-xs font-semibold text-ink">Duplicate Prevention</h4>
                </div>
                <p className="text-[10px] text-ink-muted">Strict validation fields configured:</p>
                <p className="text-xs font-semibold text-ink mt-1">Plate Number, Iqama ID, Vendor Code</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-brand-teal font-bold uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Validation Strict Mode</span>
                </div>
              </div>

              <div className="bg-background-secondary border border-border-soft rounded-apple-md p-4">
                <div className="flex items-center gap-2 mb-2 text-system-red">
                  <AlertTriangle className="h-5 w-5" />
                  <h4 className="text-xs font-semibold text-ink">Reconciliation Failures</h4>
                </div>
                <p className="text-[10px] text-ink-muted">Unresolved import records pending:</p>
                <p className="text-xs font-semibold text-ink mt-1">{qualityErrors.length} validation errors</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] text-system-red font-bold uppercase animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Needs Manual Fix</span>
                </div>
              </div>
            </div>

            {/* Error logs section */}
            <div className="space-y-4">
              <h3 className="text-caption-strong font-semibold text-ink">SAP Data Quality & Reconciliation Logs</h3>
              
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {qualityErrors.map((err) => (
                    <motion.div
                      key={err.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      className="bg-white border border-border-soft rounded-apple-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-overlay transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-system-orange shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-system-orange/10 text-system-orange text-[9px] font-bold rounded uppercase">
                              {err.type}
                            </span>
                            <span className="font-mono text-xs font-semibold text-brand-teal">{err.id}</span>
                            <span className="text-xs text-ink-muted">· {err.entity}</span>
                          </div>
                          <p className="text-xs text-ink font-semibold mt-1">{err.detail}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => fixQualityError(err.id)}
                        className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill hover:bg-background-secondary text-xs font-semibold text-ink btn-press-active transition-all"
                      >
                        Reconcile & Writeback
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {qualityErrors.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-border-soft rounded-apple-md flex flex-col items-center justify-center text-ink-muted text-caption">
                    <CheckCircle className="h-8 w-8 text-system-green mb-2" />
                    <span>All SAP master records are fully synchronized and validated.</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
