"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, ShieldCheck, HelpCircle, Truck, Info, 
  MapPin, CheckCircle, AlertTriangle, ChevronRight, Check
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function HeavyMovementRequest() {
  const { addToast, vehicles } = useTMSStore();
  const [step, setStep] = useState(1);
  const [cargoWeight, setCargoWeight] = useState(28); // Tons
  const [cargoHeight, setCargoHeight] = useState(4.2); // Meters
  const [wbsCode, setWbsCode] = useState("WBS-2026-JUBAIL-01");
  const [selectedVehId, setSelectedVehId] = useState<string | null>(null);

  // Permit validation simulation state
  const [isValidating, setIsValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [permitsStatus, setPermitsStatus] = useState({
    mizan: "Pending",
    tamm: "Pending",
    mvpi: "Pending",
    tasriya: "Pending",
    naql: "Pending"
  });

  const runPermitsValidation = () => {
    setIsValidating(true);
    setValidated(false);
    
    // Staggered resolution simulator
    setTimeout(() => {
      setPermitsStatus(prev => ({ ...prev, mizan: cargoWeight > 30 ? "Expired" : "Valid" })); // weight check
    }, 500);
    setTimeout(() => {
      setPermitsStatus(prev => ({ ...prev, tamm: "Valid" }));
    }, 1000);
    setTimeout(() => {
      setPermitsStatus(prev => ({ ...prev, mvpi: "Valid" }));
    }, 1500);
    setTimeout(() => {
      setPermitsStatus(prev => ({ ...prev, tasriya: cargoHeight > 4.5 ? "Expired" : "Valid" })); // height check
    }, 2000);
    setTimeout(() => {
      setPermitsStatus(prev => ({ ...prev, naql: "Valid" }));
      setIsValidating(false);
      setValidated(true);
      
      const hasExpired = cargoWeight > 30 || cargoHeight > 4.5;
      addToast({
        type: hasExpired ? "error" : "success",
        title: hasExpired ? "Permits Validation Failed" : "Permits Validated",
        message: hasExpired ? "Cargo limits exceed allowed regulatory permits. Dispatch blocked." : "All required KSA regulatory permits are valid."
      });
    }, 2500);
  };

  const handleNextStep = () => {
    if (step === 2 && (cargoWeight > 30 || cargoHeight > 4.5)) {
      addToast({
        type: "error",
        title: "Dispatch Blocked",
        message: "You cannot proceed with invalid or expired regulatory permits."
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitRequest = () => {
    addToast({
      type: "success",
      title: "Movement Request Created",
      message: "Industrial cargo dispatch scheduled and routing activated."
    });
    setStep(1);
    setValidated(false);
    setPermitsStatus({ mizan: "Pending", tamm: "Pending", mvpi: "Pending", tasriya: "Pending", naql: "Pending" });
    setSelectedVehId(null);
  };

  const eligibleEquipment = vehicles.filter(v => 
    v.category === 'Trailer' || v.category === 'LowBed' || v.category === 'Truck'
  ).slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Back link */}
      <Link href="/heavy-vehicles" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Heavy Vehicles</span>
      </Link>

      {/* Header and Step tracker */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Movement Request Center</h1>
          <p className="text-caption text-ink-muted mt-1">Configure heavy load routes, execute permit checks, and request dispatch</p>
        </div>
        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold select-none">
          {[1, 2, 3, 4].map(s => (
            <React.Fragment key={s}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center border font-bold text-[10px] ${
                step === s ? "bg-brand-teal border-brand-teal text-white shadow-overlay" : 
                step > s ? "bg-brand-teal/10 border-brand-teal/20 text-brand-teal" : "bg-background-secondary border-border-soft text-ink-muted"
              }`}>
                {s}
              </span>
              {s < 4 && <span className="h-0.5 w-6 bg-border-soft" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Panels */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay min-h-[380px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: Details */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Step 1 — Cargo Load & Destination Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Cargo Weight (Tons)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-ink-muted leading-none mt-1">Regulatory limit: 30 Tons max without special permission.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Cargo Height (Meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
                    value={cargoHeight}
                    onChange={(e) => setCargoHeight(Number(e.target.value))}
                  />
                  <p className="text-[9px] text-ink-muted leading-none mt-1">Overhead bridge limit: 4.5 meters.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">WBS Project Code</label>
                  <select
                    className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:ring-1 focus:ring-brand-teal focus:outline-none text-ink font-semibold"
                    value={wbsCode}
                    onChange={(e) => setWbsCode(e.target.value)}
                  >
                    <option value="WBS-2026-JUBAIL-01">Jubail Refinery Expansion (WBS-01)</option>
                    <option value="WBS-2026-YANBU-03">Yanbu Petrochem project (WBS-03)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Pickup Site Location</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted pointer-events-none">
                      <MapPin className="h-4.5 w-4.5 text-brand-teal" />
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 border border-border-hairline rounded-apple-sm text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal text-ink font-medium"
                      defaultValue="Jubail Yard A Depot"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Delivery Site Location</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted pointer-events-none">
                      <MapPin className="h-4.5 w-4.5 text-brand-blue" />
                    </span>
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 border border-border-hairline rounded-apple-sm text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal text-ink font-medium"
                      defaultValue="SADARA Plant Location"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Permits */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Step 2 — KSA Regulatory Permits Check</h3>
              
              <div className="bg-background-secondary border border-border-soft rounded-apple-md p-4 flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs font-semibold text-ink">Auto-evaluate permits based on weight and dimensions</p>
                  <p className="text-[10px] text-ink-muted mt-0.5">Evaluates MIZAN weights, MVPI safety, Naql operation card.</p>
                </div>
                <button
                  type="button"
                  onClick={runPermitsValidation}
                  disabled={isValidating}
                  className="px-4 py-2 bg-brand-teal text-white hover:bg-[#005a5a] disabled:bg-system-gray rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
                >
                  {isValidating ? "Validating..." : "Validate Permits"}
                </button>
              </div>

              {/* Permits resolution checklist */}
              <div className="space-y-3.5 max-w-md">
                {Object.entries(permitsStatus).map(([key, val]) => {
                  let badge = "text-system-gray bg-system-gray/10";
                  let Icon = Info;
                  if (val === "Valid") {
                    badge = "text-system-green bg-system-green/10";
                    Icon = CheckCircle;
                  } else if (val === "Expired") {
                    badge = "text-system-red bg-system-red/10 animate-pulse";
                    Icon = AlertTriangle;
                  }
                  return (
                    <div key={key} className="flex justify-between items-center p-3 border border-border-soft rounded-apple-sm bg-white">
                      <span className="text-xs font-bold text-ink uppercase tracking-wider">{key} Permit Check</span>
                      <span className={`px-2.5 py-0.5 rounded-apple-pill text-[10px] font-bold inline-flex items-center gap-1 uppercase ${badge}`}>
                        <Icon className="h-3 w-3 shrink-0" />
                        <span>{val}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {validated && (cargoWeight > 30 || cargoHeight > 4.5) && (
                <div className="bg-system-red/10 border border-system-red/30 rounded-apple-sm p-4 flex gap-3 text-xs text-system-red">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Over-Limit Warning Triggered</p>
                    <p className="mt-1 leading-relaxed">
                      Cargo parameters exceed allowed KSA regulatory specifications. Route dispatch is blocked until weight or dimensions are reduced to policy margins.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Vehicle Selection */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Step 3 — Heavy Vehicle Suggestion Engine</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {eligibleEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    onClick={() => setSelectedVehId(eq.id)}
                    className={`border p-4 rounded-apple-md cursor-pointer hover:shadow-overlay transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      selectedVehId === eq.id ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal" : "border-border-soft bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-background-secondary rounded text-[10px] font-bold uppercase text-ink-muted">
                          {eq.category}
                        </span>
                        <h4 className="text-caption-strong font-semibold text-ink">{eq.make} {eq.model}</h4>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-1 leading-none">Plate Number: {eq.plateNumber} · SAP Equipment Code: {eq.sapEquipmentNo}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-brand-teal">Available in Area</span>
                      <p className="text-[10px] text-ink-muted mt-1">Capacity: Up to 35 Tons</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Approval Nodes */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-5"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Step 4 — Node Approval Chain Activated</h3>
              
              <div className="relative pl-8 space-y-6 border-l border-border-soft ml-3 py-1">
                <div className="relative">
                  <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-brand-teal text-white rounded-full flex items-center justify-center font-bold text-[9px] border border-white">
                    1
                  </span>
                  <h5 className="text-xs font-semibold text-ink">Heavy Rigging Officer Approval</h5>
                  <p className="text-[10px] text-ink-muted mt-0.5">Validates dimensions and safety clearance lines.</p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-background-secondary text-ink-muted rounded-full flex items-center justify-center font-bold text-[9px] border border-border-soft">
                    2
                  </span>
                  <h5 className="text-xs font-semibold text-ink">Operations Manager review</h5>
                  <p className="text-[10px] text-ink-muted mt-0.5">Examines route clearance maps.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Action Footer */}
        <div className="border-t border-border-soft pt-6 mt-6 flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="h-10 px-5 border border-border-hairline hover:bg-background-secondary rounded-apple-pill text-xs font-semibold text-ink transition-all disabled:opacity-30 btn-press-active"
          >
            Previous
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="h-10 px-5 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold transition-all btn-press-active"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handleSubmitRequest}
              className="h-10 px-5 bg-brand-blue text-white hover:bg-brand-blue-focus rounded-apple-pill text-xs font-semibold transition-all btn-press-active"
            >
              Submit Dispatch Request
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
