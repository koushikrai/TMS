"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";
import ComplianceCountdown from "@/components/ui/ComplianceCountdown";
import { 
  AlertTriangle, Car, Calendar, ShieldCheck, DollarSign, Wrench, Compass, 
  MapPin, HelpCircle, ArrowLeft, Plus, Trash2, Edit
} from "lucide-react";
import Link from "next/link";

type ProfileTab = 'overview' | 'maintenance' | 'documents' | 'trips' | 'lifecycle';

export default function VehicleProfilePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params?.vehicleId as string;
  const { vehicles, requests, updateVehicle, addToast } = useTMSStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  // Find vehicle by ID
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <AlertTriangle className="h-8 w-8 text-system-red" />
        <p className="text-caption text-ink font-semibold">Vehicle Record Not Found</p>
        <Link href="/light-vehicles" className="text-xs text-brand-teal font-bold hover:underline">
          Return to overview
        </Link>
      </div>
    );
  }

  // Filter requests matching this vehicle
  const vehicleTrips = requests.filter(r => r.assignedVehicleId === vehicle.id);

  // Toggle Maintenance Dialog Simulation
  const handleScheduleMaintenance = () => {
    updateVehicle(vehicle.id, { status: "UnderMaintenance" });
    addToast({
      type: "warning",
      title: "Vehicle Scheduled",
      message: `Status of ${vehicle.plateNumber} changed to Under Maintenance.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Back navigation */}
      <Link 
        href="/light-vehicles"
        className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to light vehicle fleet list</span>
      </Link>

      {/* Main 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN (4/12) ================= */}
        <div className="lg:col-span-4 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-6">
          {/* Silhouette placeholder */}
          <div className="h-44 w-full bg-background-secondary rounded-apple-md flex items-center justify-center border border-border-soft relative group">
            <Car className="h-20 w-20 text-ink-muted/30 group-hover:scale-105 transition-transform" />
            <div className="absolute top-3 left-3">
              <StatusBadge status={vehicle.status} />
            </div>
            <div className="absolute top-3 right-3 bg-white px-2 py-0.5 border border-border-soft rounded text-[9px] font-bold text-brand-teal">
              {vehicle.ownership}
            </div>
          </div>

          <div>
            <h2 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-caption text-ink-muted mt-0.5">Year {vehicle.year} · Category {vehicle.category}</p>
          </div>

          <div className="border-t border-border-soft pt-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Plate Registration</span>
              <span className="font-semibold text-ink select-all">{vehicle.plateNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">SAP Equipment Code</span>
              <span className="font-mono text-ink select-all">{vehicle.sapEquipmentNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Model level tier</span>
              <span className="font-semibold text-ink">{vehicle.modelLevel || 'M2'} Eligible</span>
            </div>
          </div>

          {/* GPS Live tracking minimap visual */}
          <div className="border border-border-soft rounded-apple-md bg-background-secondary p-4 relative overflow-hidden">
            <span className="text-[9px] text-ink-muted font-bold uppercase absolute top-2 left-3">GPS Location Map</span>
            <div className="h-28 flex items-center justify-center relative">
              {/* Radial signal wave */}
              <motion.span
                animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-8 w-8 bg-brand-blue/30 rounded-full absolute"
              />
              <div className="h-3 w-3 bg-brand-blue rounded-full absolute shadow-overlay" />
              <Compass className="h-6 w-6 text-brand-blue animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div className="text-[10px] text-center text-ink-muted font-medium border-t border-border-soft pt-2 mt-2">
              lat {vehicle.currentLocation?.lat.toFixed(4)} · lng {vehicle.currentLocation?.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN (6/12) ================= */}
        <div className="lg:col-span-6 bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-border-soft space-x-6 select-none overflow-x-auto">
            {(['overview', 'maintenance', 'documents', 'trips', 'lifecycle'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-caption font-semibold relative transition-all capitalize ${
                  activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{tab}</span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="profileTabIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Allocation Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background-secondary p-4 rounded-apple-md border border-border-soft">
                      <p className="text-[9px] text-ink-muted uppercase leading-none font-medium">Current Allocation</p>
                      <p className="text-xs font-semibold text-ink mt-2">
                        {vehicle.allocations[0]?.employeeName || "Available / Pool Standby"}
                      </p>
                      {vehicle.allocations[0] && (
                        <p className="text-[10px] text-ink-muted mt-1 leading-none">
                          Dept: {vehicle.allocations[0].department}
                        </p>
                      )}
                    </div>

                    <div className="bg-background-secondary p-4 rounded-apple-md border border-border-soft">
                      <p className="text-[9px] text-ink-muted uppercase leading-none font-medium">Cost center allocation</p>
                      <p className="text-xs font-semibold text-ink mt-2">
                        {vehicle.allocations[0]?.costCenter || "Direct Pool Charge (CC-300)"}
                      </p>
                      <p className="text-[10px] text-ink-muted mt-1 leading-none">SAP Finance Sync</p>
                    </div>
                  </div>

                  <div className="border-t border-border-soft pt-4 space-y-2">
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-ink-muted">Body Type:</span>
                        <span className="font-semibold text-ink ml-1.5">{vehicle.category}</span>
                      </div>
                      <div>
                        <span className="text-ink-muted">Year Code:</span>
                        <span className="font-semibold text-ink ml-1.5">{vehicle.year}</span>
                      </div>
                      <div>
                        <span className="text-ink-muted">Transmission:</span>
                        <span className="font-semibold text-ink ml-1.5">Automatic</span>
                      </div>
                      <div>
                        <span className="text-ink-muted">GPS Enabled:</span>
                        <span className="font-semibold text-system-green ml-1.5">Yes</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'maintenance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Service & Maintenance Records</h3>
                  <div className="space-y-3 relative pl-6 border-l border-border-soft">
                    {vehicle.maintenanceHistory.map((rec) => (
                      <div key={rec.id} className="relative">
                        <span className="absolute -left-[30px] top-1.5 h-2 w-2 rounded-full bg-brand-teal" />
                        <div className="flex justify-between">
                          <span className="text-xs font-semibold text-ink">{rec.type}</span>
                          <span className="text-[10px] text-ink-muted">{rec.date}</span>
                        </div>
                        <p className="text-[10px] text-ink-muted mt-1 leading-relaxed">{rec.description}</p>
                        <p className="text-[10px] text-brand-teal font-semibold mt-1">Cost: {rec.cost} SAR</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Compliance Documents Registry</h3>
                  <div className="space-y-3.5">
                    {vehicle.documents.map((doc) => (
                      <div key={doc.id} className="bg-background-secondary border border-border-soft rounded-apple-sm p-3.5 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4.5 w-4.5 text-brand-teal shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-ink uppercase tracking-wider">{doc.type}</span>
                            <p className="text-[9px] text-ink-muted font-mono leading-none mt-1">Ref: {doc.documentNumber}</p>
                          </div>
                        </div>
                        <ComplianceCountdown expiryDate={doc.expiryDate} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'trips' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Recent Operational Trip Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border-soft text-ink-muted font-medium">
                          <th className="py-2.5">Trip ID</th>
                          <th className="py-2.5">Purpose</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5 text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft text-ink font-medium">
                        {vehicleTrips.map((tr) => (
                          <tr key={tr.id}>
                            <td className="py-3 font-mono text-brand-teal">{tr.id}</td>
                            <td className="py-3 truncate max-w-44">{tr.purpose}</td>
                            <td className="py-3">{tr.scheduledDate}</td>
                            <td className="py-3 text-right text-brand-blue font-semibold">{tr.estimatedCost || 0} SAR</td>
                          </tr>
                        ))}
                        {vehicleTrips.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-ink-muted">No trip records found for this vehicle.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'lifecycle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Asset Lifecycle & Cost Valuation</h3>
                  
                  {/* Fuel and Maintenance Cost Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background-secondary p-4 rounded-apple-md border border-border-soft">
                      <h4 className="text-[10px] text-ink-muted uppercase font-bold tracking-wider mb-2">Fuel Tracking (Petro App Sync)</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-ink-muted">Total Fuel Consumed:</span><span className="font-semibold text-ink">4,210 Liters</span></div>
                        <div className="flex justify-between"><span className="text-ink-muted">Fuel Cost (SAR):</span><span className="font-semibold text-ink">9,809.30 SAR</span></div>
                        <div className="flex justify-between"><span className="text-ink-muted">Fuel Economy:</span><span className="font-semibold text-ink">9.4 L/100km</span></div>
                      </div>
                    </div>
                    <div className="bg-background-secondary p-4 rounded-apple-md border border-border-soft">
                      <h4 className="text-[10px] text-ink-muted uppercase font-bold tracking-wider mb-2">Cost & Maintenance Spent</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-ink-muted">Initial Asset Value:</span><span className="font-semibold text-ink">95,000 SAR</span></div>
                        <div className="flex justify-between"><span className="text-ink-muted">Total Maintenance Cost:</span><span className="font-semibold text-ink">14,350 SAR</span></div>
                        <div className="flex justify-between"><span className="text-ink-muted">Cross-Charged Dept Value:</span><span className="font-semibold text-ink">38,400 SAR</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Sell vs Keep Recommendation Model */}
                  <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Sell / Keep Recommendation Model</h4>
                      <span className="px-2 py-0.5 rounded bg-system-green/10 text-system-green text-[9px] font-bold uppercase">Active Model</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="text-xs font-semibold text-ink">Recommendation: <span className="text-system-green">KEEP (Highly Cost-Efficient)</span></p>
                        <p className="text-[10px] text-ink-muted mt-1 leading-normal">
                          The current cumulative maintenance cost trend is below the depreciation value slope. Operational efficiency remains at 94.2%.
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-display-sm font-bold text-brand-teal">88%</span>
                        <p className="text-[9px] text-ink-muted uppercase font-semibold">Keep Confidence</p>
                      </div>
                    </div>
                  </div>

                  {/* Accident & Damages Tracking */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Accidents & Damages Log</h4>
                      <span className="px-2 py-0.5 rounded bg-border-hairline text-ink-muted text-[9px] font-bold uppercase">Integration Pending</span>
                    </div>
                    <div className="overflow-x-auto border border-border-soft rounded-apple-sm">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-background-secondary border-b border-border-soft text-ink-muted font-medium text-[9px] uppercase">
                            <th className="p-2.5">Incident Date</th>
                            <th className="p-2.5">Case ID</th>
                            <th className="p-2.5">Description</th>
                            <th className="p-2.5">Damages Cost</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft text-ink font-medium">
                          <tr>
                            <td className="p-2.5">2026-02-14</td>
                            <td className="p-2.5 font-mono text-brand-teal">ACC-29402</td>
                            <td className="p-2.5">Minor scratch on left side panel during depot parking.</td>
                            <td className="p-2.5">1,200 SAR</td>
                            <td className="p-2.5"><span className="text-system-green">Resolved</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (2/12) ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-soft rounded-apple-lg p-4 shadow-overlay flex flex-col gap-4 text-center">
            
            {/* Price stats */}
            <div>
              <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Allocated Cost (Mo)</p>
              <h3 className="text-display-md text-brand-teal font-semibold mt-1 tracking-tight">4,800</h3>
              <p className="text-[9px] text-ink-muted leading-none mt-1">SAR Cross-Charge Rate</p>
            </div>

            <div className="border-t border-border-soft pt-4 space-y-2">
              <button 
                onClick={handleScheduleMaintenance}
                className="w-full py-2 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
              >
                Schedule Service
              </button>
              <button 
                onClick={() => {
                  updateVehicle(vehicle.id, { status: "Breakdown" });
                  addToast({ type: "error", title: "Breakdown Logged", message: `Vehicle ${vehicle.plateNumber} breakdown status registered.` });
                }}
                className="w-full py-2 border border-system-red text-system-red hover:bg-system-red/5 text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
              >
                Report Breakdown
              </button>
            </div>

          </div>

          {/* Chain of ownership */}
          <div className="bg-white border border-border-soft rounded-apple-lg p-4 shadow-overlay flex flex-col">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Chain of Ownership</h4>
            <div className="space-y-3 relative pl-3 border-l border-border-soft">
              <div className="relative">
                <span className="absolute -left-[17px] top-1.5 h-1.5 w-1.5 rounded-full bg-brand-teal" />
                <p className="text-[10px] text-ink leading-none font-semibold">Ahmed Al-Nasser</p>
                <p className="text-[9px] text-ink-muted mt-1 leading-none">Active from Jan 2026</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[17px] top-1.5 h-1.5 w-1.5 rounded-full bg-system-gray" />
                <p className="text-[10px] text-ink leading-none font-semibold">Fleet Pool Standby</p>
                <p className="text-[9px] text-ink-muted mt-1 leading-none">Nov 2025 - Jan 2026</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
