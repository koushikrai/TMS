"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Navigation, AlertTriangle, CheckCircle, FileText, X } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function HeavyVehiclesTracking() {
  const { addToast } = useTMSStore();
  const [breachAlert, setBreachAlert] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);
  const [podUploaded, setPodUploaded] = useState(false);

  const triggerBreachSimulation = () => {
    setBreachAlert(true);
    addToast({
      type: "error",
      title: "Geofence Breach Detected",
      message: "Trailer TR-08 exited assigned corridor along Jubail North Highway."
    });
    
    // Auto turn off alert flash after 3 seconds
    setTimeout(() => {
      setBreachAlert(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* ---------------- RED FLASHING GEOFENCE BREACH OVERLAY ---------------- */}
      <AnimatePresence>
        {breachAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="fixed inset-0 bg-system-red pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Back and Title */}
      <Link href="/heavy-vehicles" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Heavy Operations</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Live Trip Monitoring</h1>
          <p className="text-caption text-ink-muted mt-1">Real-time GPS telemetry tracks, geofence alerts, and proof of delivery uploads</p>
        </div>
        <button
          onClick={triggerBreachSimulation}
          className="h-10 px-4 bg-system-red hover:bg-[#cc2f26] text-white rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Simulate Geofence Breach</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Map Panel (8/12) */}
        <div className="lg:col-span-8 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-caption-strong font-semibold text-ink">Active Heavy Vehicle Locations</h3>
            <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider animate-pulse">Live Tracking Active</span>
          </div>

          <div className="h-[360px] w-full bg-background-secondary rounded-apple-md border border-border-soft relative flex items-center justify-center overflow-hidden">
            {/* Draw road grid line */}
            <svg className="absolute inset-0 opacity-15" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <line x1="100" y1="0" x2="100" y2="400" stroke="#000" strokeWidth="3" />
              <line x1="0" y1="180" x2="800" y2="180" stroke="#000" strokeWidth="4" />
            </svg>

            {/* Active Truck Point */}
            <div className="absolute top-[180px] left-[320px] flex flex-col items-center">
              <motion.span
                animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="h-6 w-6 bg-brand-blue/30 rounded-full absolute -top-1.5"
              />
              <div className="h-3 w-3 bg-brand-blue rounded-full relative z-10 border border-white" />
              <span className="bg-white px-2 py-0.5 border border-border-soft rounded shadow-overlay text-[9px] font-bold text-ink mt-2">
                TRK-08 (Volvo FH16)
              </span>
            </div>
            
            {/* Geofence boundary marker overlay */}
            <div className="absolute top-[80px] left-[80px] border border-system-red border-dashed rounded-apple-sm p-4 bg-system-red/5 flex items-center justify-center text-center">
              <span className="text-[8px] font-bold uppercase text-system-red leading-none">Restricted Yard Entry Zone</span>
            </div>
          </div>
        </div>

        {/* Sidebar panel timeline (4/12) */}
        <div className="lg:col-span-4 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col">
          <h3 className="text-caption-strong font-semibold text-ink mb-4">Trip Progress Milestones</h3>
          
          <div className="relative pl-8 space-y-6 border-l border-border-soft ml-3 py-1">
            <div className="relative">
              <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-system-green text-white rounded-full flex items-center justify-center font-bold text-[9px] border border-white">
                ✓
              </span>
              <h5 className="text-xs font-semibold text-ink">Departure Confirmed</h5>
              <p className="text-[10px] text-ink-muted mt-0.5">Jubail HQ Depot (12:30 PM)</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-system-green text-white rounded-full flex items-center justify-center font-bold text-[9px] border border-white">
                ✓
              </span>
              <h5 className="text-xs font-semibold text-ink">Highway Corridor Passed</h5>
              <p className="text-[10px] text-ink-muted mt-0.5">En route (01:15 PM)</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-[9px] border border-white animate-pulse">
                •
              </span>
              <h5 className="text-xs font-semibold text-brand-blue">SADARA Checkpoint Entry</h5>
              <p className="text-[10px] text-ink-muted mt-0.5">ETA: 02:40 PM</p>
            </div>
            <div className="relative opacity-50">
              <span className="absolute -left-[37px] top-0.5 h-4.5 w-4.5 bg-background-secondary text-ink-muted rounded-full flex items-center justify-center font-bold text-[9px] border border-border-soft">
                4
              </span>
              <h5 className="text-xs font-semibold text-ink">Delivery Accomplished</h5>
              <p className="text-[10px] text-ink-muted mt-0.5">Awaiting proof of delivery.</p>
            </div>
          </div>

          <button
            onClick={() => setShowPodModal(true)}
            className="w-full py-2.5 mt-8 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
          >
            Upload Proof of Delivery
          </button>
        </div>

      </div>

      {/* ---------------- PROOF OF DELIVERY UPLOAD MODAL ---------------- */}
      <AnimatePresence>
        {showPodModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[400px] bg-white border border-border-soft rounded-apple-lg p-6 shadow-product relative flex flex-col gap-4"
            >
              <button 
                onClick={() => setShowPodModal(false)}
                className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center border border-border-hairline rounded-apple-pill"
              >
                <X className="h-4 w-4" />
              </button>

              <h3 className="text-caption-strong font-semibold text-ink">Proof of Delivery (POD)</h3>
              <p className="text-xs text-ink-muted leading-normal">
                Upload driver capture confirmation and sign-off records to close dispatch cost-posting.
              </p>

              <div className="border-2 border-dashed border-border-soft rounded-apple-md p-6 flex flex-col items-center justify-center bg-background-secondary text-center cursor-pointer hover:border-brand-teal transition-all">
                <FileText className="h-8 w-8 text-ink-muted mb-2" />
                <span className="text-xs font-semibold text-ink">Click to upload POD documents</span>
                <span className="text-[10px] text-ink-muted mt-1">Supports PDF, PNG, JPG</span>
              </div>

              <button
                onClick={() => {
                  setPodUploaded(true);
                  setShowPodModal(false);
                  addToast({
                    type: "success",
                    title: "POD Logged",
                    message: "Proof of Delivery validated and dispatch closed."
                  });
                }}
                className="w-full py-2.5 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
              >
                Complete Dispatch
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
