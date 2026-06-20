"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, ArrowRight, Plus, MapPin, ShieldCheck, 
  Calendar, FileText, Compass, AlertTriangle, Play 
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import gsap from "gsap";

export default function HeavyVehiclesHub() {
  const { vehicles, updateVehicle, addToast } = useTMSStore();
  const heavyFleet = vehicles.filter(v => 
    v.category === 'Truck' || v.category === 'Trailer' || v.category === 'LowBed' || v.category === 'Crane' || v.category === 'HeavyEquipment'
  );

  const counterRef = useRef<HTMLSpanElement>(null);

  // GSAP CountUp for Daily Requests (35-40+ request range)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (counterRef.current) {
        gsap.to({ val: 0 }, {
          val: 38,
          duration: 1.2,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: function() {
            if (counterRef.current) {
              counterRef.current.textContent = Math.floor(this.targets()[0].val).toString();
            }
          }
        });
      }
    });
    return () => ctx.revert();
  }, []);

  // Kanban status columns
  const columns = [
    { id: "Available", title: "Available Equipment", color: "border-system-green" },
    { id: "Active", title: "Assigned / Transit", color: "border-brand-blue" },
    { id: "UnderMaintenance", title: "Maintenance", color: "border-system-orange" },
    { id: "Breakdown", title: "Breakdown / Issues", color: "border-system-red" }
  ];

  // Move status action simulation
  const handleMoveStatus = (vehicleId: string, newStatus: any) => {
    updateVehicle(vehicleId, { status: newStatus });
    addToast({
      type: "success",
      title: "Equipment Reassigned",
      message: `Asset ${vehicleId} status changed to ${newStatus}.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Heavy Vehicles & Equipment</h1>
          <p className="text-caption text-ink-muted mt-1">Manage industrial crane rigging, naql permits, and cross-center movements</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/heavy-vehicles/permits"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <ShieldCheck className="h-4 w-4 text-brand-teal" />
            <span>KSA Permits Matrix</span>
          </Link>
          <Link
            href="/heavy-vehicles/rfq"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <FileText className="h-4 w-4 text-brand-blue" />
            <span>Vendor RFQ</span>
          </Link>
          <Link
            href="/heavy-vehicles/tracking"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <Compass className="h-4 w-4 text-brand-blue animate-pulse" />
            <span>Live Tracking</span>
          </Link>
          <Link
            href="/heavy-vehicles/requests"
            className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
          >
            <Plus className="h-4 w-4" />
            <span>Movement Request</span>
          </Link>
        </div>
      </div>

      {/* Daily requests counter strip */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-apple-md bg-brand-teal/10 text-brand-teal flex items-center justify-center">
            <Truck className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] text-ink-muted uppercase font-bold tracking-wider">Active Heavy Movement Requests</span>
            <h2 className="text-display-md text-ink font-semibold mt-1">
              <span ref={counterRef}>0</span>
              <span className="text-caption text-ink-muted font-normal"> Daily dispatches logged today</span>
            </h2>
          </div>
        </div>
        <div className="bg-brand-blue/5 border border-brand-blue/15 px-4 py-2 rounded-apple-sm text-xs leading-relaxed max-w-sm">
          <p className="font-semibold text-brand-blue flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>MIZAN Weight Permits Enforcement</span>
          </p>
          <p className="text-ink-muted mt-1">
            Permit controls automatically validate heavy load weight metrics prior to yard exit clearance.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start select-none">
        {columns.map((col) => {
          const colVehicles = heavyFleet.filter(v => v.status === col.id || (col.id === 'Active' && v.status === 'Available')); // fallbacks
          return (
            <div key={col.id} className="flex flex-col bg-background-secondary border border-border-soft rounded-apple-lg p-4 h-[580px]">
              <div className={`border-b-2 ${col.color} pb-3 mb-4 flex justify-between items-center`}>
                <h3 className="text-xs font-bold text-ink uppercase tracking-wider">{col.title}</h3>
                <span className="px-2 py-0.5 bg-white border border-border-soft rounded text-[10px] font-bold text-ink">
                  {colVehicles.length} Assets
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                <AnimatePresence mode="popLayout">
                  {colVehicles.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay hover:shadow-product transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[9px] uppercase font-bold text-brand-teal">{vehicle.category}</span>
                          <StatusBadge status={vehicle.status} />
                        </div>
                        <h4 className="text-caption-strong font-semibold text-ink leading-tight">{vehicle.make} {vehicle.model}</h4>
                        <p className="text-[10px] text-ink-muted mt-0.5 font-mono tracking-wider">{vehicle.plateNumber}</p>
                        
                        <div className="mt-3 text-[10px] text-ink-muted font-medium">
                          <p>Load Capacity: <span className="font-semibold text-brand-blue">25 Tons</span></p>
                          <p className="mt-1">Permit status: <span className="font-semibold text-system-green">✓ Active Naql</span></p>
                        </div>
                      </div>

                      {/* Dropdown status changer simulator */}
                      <div className="mt-4 pt-3 border-t border-border-soft flex justify-between items-center">
                        <span className="text-[9px] text-ink-muted font-semibold">Change State:</span>
                        <select
                          className="px-1.5 py-0.5 bg-background-secondary border border-border-soft rounded text-[9px] text-ink font-semibold focus:outline-none"
                          value={vehicle.status}
                          onChange={(e) => handleMoveStatus(vehicle.id, e.target.value as any)}
                        >
                          <option value="Available">Available</option>
                          <option value="Active">Transit</option>
                          <option value="UnderMaintenance">Maintenance</option>
                          <option value="Breakdown">Breakdown</option>
                        </select>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
                {colVehicles.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-ink-muted text-caption">
                    <span>No active assets.</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
