"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion } from "framer-motion";
import { 
  Bus, Users, Compass, Navigation, AlertTriangle, ArrowRight, 
  Map, Calendar, TrendingUp, HelpCircle
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";

export default function BusOperationsOverview() {
  const { routes, vehicles } = useTMSStore();
  const busFleet = vehicles.filter(v => v.category === 'Bus');

  // KPI calculations
  const totalTrips = 48;
  const transportedEmployees = 1450;
  const emptySeatRatio = 14.5;
  const onTimeRate = 98.2;
  const breakdowns = 0;

  // Render SVG map route coordinates
  const svgRoutes = [
    { id: "rt-1", name: "Jubail HQ Shuttle", d: "M 50,150 Q 150,50 250,150 T 450,150", color: "#34c759", util: "82% Occupied" }, // Green
    { id: "rt-2", name: "SADARA Industrial Route", d: "M 50,220 Q 200,320 350,220 T 450,250", color: "#ff9500", util: "64% Occupied" }, // Amber
    { id: "rt-3", name: "Jubail Port Express", d: "M 50,100 Q 250,200 450,100", color: "#ff3b30", util: "38% Occupied" } // Red (low occupancy)
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Bus & Employee Transport</h1>
          <p className="text-caption text-ink-muted mt-1">Manage daily employee shifts, shuttle routes, and capacity optimization</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/buses/routes"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <Map className="h-4 w-4" />
            <span>Route Planner</span>
          </Link>
          <Link
            href="/buses/trips"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <Calendar className="h-4 w-4" />
            <span>Trip Scheduler</span>
          </Link>
          <Link
            href="/buses/capacity"
            className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Capacity Planner</span>
          </Link>
        </div>
      </div>

      {/* 1. Today's stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Trips Dispatched Today</span>
          <p className="text-display-md text-ink font-semibold mt-1">{totalTrips}</p>
          <p className="text-[9px] text-system-green font-bold uppercase mt-1">🟢 100% on schedule</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Employees Transported</span>
          <p className="text-display-md text-ink font-semibold mt-1">{transportedEmployees}</p>
          <p className="text-[9px] text-ink-muted mt-1">Avg 30 per bus</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Empty Seat Ratio</span>
          <p className="text-display-md text-system-orange font-semibold mt-1">{emptySeatRatio}%</p>
          <p className="text-[9px] text-ink-muted mt-1">Target &lt; 10%</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">On-Time Performance</span>
          <p className="text-display-md text-system-green font-semibold mt-1">{onTimeRate}%</p>
          <p className="text-[9px] text-system-green font-bold uppercase mt-1">Within SLA buffer</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Breakdowns</span>
          <p className="text-display-md text-ink font-semibold mt-1">{breakdowns}</p>
          <p className="text-[9px] text-ink-muted mt-1">Last 30 days: 1 event</p>
        </div>
      </div>

      {/* 2. Live Route Map (occupancy heatmap + moving bus) */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-caption-strong font-semibold text-ink">Shuttle Route Occupancy Heatmap</h3>
            <p className="text-[10px] text-ink-muted mt-0.5">Live passenger count densities relative to seating capacity</p>
          </div>
          <div className="flex gap-4 text-[10px] font-semibold">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-system-green" /><span>Optimal (&gt;80%)</span></div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-system-orange" /><span>Moderate (50-80%)</span></div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-system-red" /><span>Low (&lt;50%)</span></div>
          </div>
        </div>

        {/* Vector SVG Board */}
        <div className="h-[280px] w-full bg-background-secondary rounded-apple-md border border-border-soft relative flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 500 300">
            {/* Draw grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Draw Routes */}
            {svgRoutes.map((rt) => (
              <g key={rt.id}>
                <path
                  d={rt.d}
                  fill="none"
                  stroke={rt.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="opacity-70"
                />
                {/* Moving shuttle dot */}
                <circle r="5" fill="#1d1d1f" stroke="#fff" strokeWidth="1.5">
                  <animateMotion
                    path={rt.d}
                    dur={rt.id === 'rt-1' ? '6s' : (rt.id === 'rt-2' ? '9s' : '12s')}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 3. Daily active shuttles schedule */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
        <h3 className="text-caption-strong font-semibold text-ink mb-4">Active Shuttles Schedule</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-ink-muted font-medium">
                <th className="py-2.5">Bus ID</th>
                <th className="py-2.5">Plate Number</th>
                <th className="py-2.5">Capacity</th>
                <th className="py-2.5">Active Route</th>
                <th className="py-2.5">Assigned Driver</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft text-ink font-medium">
              {busFleet.map((bus) => (
                <tr key={bus.id} className="hover:bg-background-secondary transition-all">
                  <td className="py-3.5 font-mono text-[11px] font-bold text-brand-teal">{bus.id}</td>
                  <td className="py-3.5 tracking-wider">{bus.plateNumber}</td>
                  <td className="py-3.5 text-brand-blue">45 Seats</td>
                  <td className="py-3.5">Jubail Industrial Shuttle</td>
                  <td className="py-3.5">Faisal Al-Shehri</td>
                  <td className="py-3.5"><StatusBadge status={bus.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
