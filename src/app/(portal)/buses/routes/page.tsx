"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, MoveUp, MoveDown, HelpCircle, Check, Info, TrendingUp } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BusRoutePlanner() {
  const { routes, addToast } = useTMSStore();
  
  // Custom stops builder state
  const [stopsList, setStopsList] = useState([
    { id: "s-1", name: "Jubail HQ" },
    { id: "s-2", name: "Yard A" },
    { id: "s-3", name: "Port Facility" },
    { id: "s-4", name: "Refinery B" },
  ]);

  const moveStop = (index: number, direction: 'up' | 'down') => {
    const updated = [...stopsList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < stopsList.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setStopsList(updated);
      addToast({
        type: "info",
        title: "Stop Reordered",
        message: "Stops sequence updated in the router list."
      });
    }
  };

  const [consolidated, setConsolidated] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/buses" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Bus Operations</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Route Planner</h1>
          <p className="text-caption text-ink-muted mt-1">Design waypoints, coordinate shuttle lines, and consolidate empty seats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Route List & Consolidation (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
            <h3 className="text-caption-strong font-semibold text-ink">Active Shuttle Lines</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-soft text-ink-muted font-medium">
                    <th className="py-2.5">Route</th>
                    <th className="py-2.5">Waypoints</th>
                    <th className="py-2.5">Distance</th>
                    <th className="py-2.5">Time</th>
                    <th className="py-2.5">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft text-ink font-medium">
                  {routes.slice(0, 5).map((route) => (
                    <tr key={route.id} className="hover:bg-background-secondary transition-all">
                      <td className="py-3.5 flex items-center gap-1.5">
                        <span className="font-semibold">{route.name}</span>
                      </td>
                      <td className="py-3.5 text-ink-muted">{route.stops.map(s => s.name).join(" → ") || "Direct Line"}</td>
                      <td className="py-3.5">{route.distanceKm.toFixed(1)} km</td>
                      <td className="py-3.5">{route.estDurationMinutes}m</td>
                      <td className="py-3.5"><StatusBadge status={route.complianceFlag ? "Active" : "Critical"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consolidation Advisor Card */}
          <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand-teal" />
                <h3 className="text-caption-strong font-semibold text-ink">Consolidation Intelligence Advisor</h3>
              </div>
              <span className="px-2 py-0.5 bg-system-orange/10 text-system-orange border border-system-orange/20 text-[9px] font-bold rounded uppercase">
                2 Recommendations
              </span>
            </div>

            <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs font-semibold text-ink">Merge Route 4A + 4B (Jubail Port Lines)</p>
                <p className="text-[10px] text-ink-muted mt-1 leading-normal">
                  Both routes operate at under 45% occupancy during morning shifts. Merging saves 1 bus shuttle, reducing daily fuel cost by 14%.
                </p>
                
                {/* Before/after bar representation */}
                <div className="mt-3.5 flex items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-muted">Current:</span>
                    <span className="font-semibold text-system-red">42% occupancy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-muted">Projected Merge:</span>
                    <span className="font-semibold text-system-green">84% occupancy</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setConsolidated(true);
                  addToast({
                    type: "success",
                    title: "Routes Consolidated",
                    message: "Shuttle schedules successfully merged in the planning master."
                  });
                }}
                disabled={consolidated}
                className="px-3.5 py-1.5 bg-brand-teal text-white hover:bg-[#005a5a] disabled:bg-system-green rounded-apple-pill text-xs font-semibold flex items-center gap-1 transition-all btn-press-active shrink-0"
              >
                {consolidated ? <Check className="h-4 w-4" /> : null}
                <span>{consolidated ? "Merged & Applied" : "Accept Merge Recommendation"}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Waypoint Builder (1/3) */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col">
          <h3 className="text-caption-strong font-semibold text-ink mb-4 font-display">Stops Builder Waypoints</h3>
          <p className="text-[10px] text-ink-muted mb-4 leading-normal">
            Drag and reorder stop waypoints to configure the shuttle path line.
          </p>

          <div className="space-y-2.5 flex-1">
            {stopsList.map((stop, idx) => (
              <div 
                key={stop.id}
                className="bg-background-secondary border border-border-soft rounded-apple-md p-3.5 flex justify-between items-center hover:border-brand-teal transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="text-xs font-semibold text-ink">{stop.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => moveStop(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 border border-border-hairline rounded hover:bg-white disabled:opacity-30 text-ink-muted hover:text-ink transition-all"
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => moveStop(idx, 'down')}
                    disabled={idx === stopsList.length - 1}
                    className="p-1 border border-border-hairline rounded hover:bg-white disabled:opacity-30 text-ink-muted hover:text-ink transition-all"
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 mt-6 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all">
            Save Waypoint Sequence
          </button>
        </div>

      </div>

    </div>
  );
}
