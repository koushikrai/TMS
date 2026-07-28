"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bus, Users, CheckCircle, AlertTriangle, Layers, 
  MapPin, RefreshCw, Sparkles, Filter, ChevronRight
} from "lucide-react";

export default function BusCapacityHeatmapPage() {
  const [selectedRoute, setSelectedRoute] = useState("Shift A - Jubail HQ to SADARA Site");
  const [selectedBusId, setSelectedBusId] = useState("BUS-01");

  // Simulated seating layout (45 seats in a 4-column layout)
  const totalSeats = 44;
  const occupiedSeatNumbers = [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27, 29, 30, 31, 33, 34, 35, 37, 38, 39, 41, 42];
  const occupiedCount = occupiedSeatNumbers.length;
  const occupancyPercentage = Math.round((occupiedCount / totalSeats) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #31 &amp; #40
            </span>
            <span className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Interactive Capacity Heatmap
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink mt-1">Bus Seat Capacity &amp; Occupancy Heatmap Visualizer</h1>
          <p className="text-caption text-ink-muted">
            Real-time seat allocation, passenger occupancy heatmaps, shift capacity planning, and bus overload alert monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="px-3 py-2 bg-background-secondary border border-border-soft rounded-apple-md text-xs font-semibold text-ink cursor-pointer focus:outline-none"
          >
            <option value="BUS-01">BUS-01 • Mercedes Travego (44 Seats)</option>
            <option value="BUS-02">BUS-02 • Volvo 9700 (50 Seats)</option>
            <option value="BUS-03">BUS-03 • Scania Touring (40 Seats)</option>
          </select>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Total Seat Capacity</span>
          <div className="text-2xl font-display font-bold text-ink mt-1">{totalSeats} Seats</div>
          <span className="text-[11px] text-ink-muted">Standard 4-Column Shuttle</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Booked Passengers</span>
          <div className="text-2xl font-display font-bold text-brand-teal mt-1">{occupiedCount} Roster Passes</div>
          <span className="text-[11px] text-ink-muted">BioTime QR Verified</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Available Seats</span>
          <div className="text-2xl font-display font-bold text-system-green mt-1">{totalSeats - occupiedCount} Open</div>
          <span className="text-[11px] text-system-green font-semibold">Immediate Booking Open</span>
        </div>
        <div className="bg-white p-5 rounded-apple-md border border-border-soft shadow-sm space-y-1">
          <span className="text-xs text-ink-muted uppercase font-bold">Occupancy Rate</span>
          <div className={`text-2xl font-display font-bold mt-1 ${occupancyPercentage > 85 ? "text-system-orange" : "text-brand-teal"}`}>
            {occupancyPercentage} %
          </div>
          <span className="text-[11px] text-ink-muted">Optimal Load Factor</span>
        </div>
      </div>

      {/* Main Bus Seating Plan Visualizer */}
      <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-6">
        <div className="border-b border-border-soft pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Interactive Seating Chart for {selectedBusId}</h3>
            <p className="text-xs text-ink-muted">Route: {selectedRoute}</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-system-green" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-brand-teal" /> Occupied (Rostered)</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-system-orange" /> Reserved VIP</span>
          </div>
        </div>

        {/* Bus Cabin Blueprint */}
        <div className="p-8 bg-background-secondary rounded-apple-xl border border-border-soft max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs font-mono font-bold text-ink-muted border-b border-border-soft pb-3">
            <span>DRIVER CABIN (FRONT)</span>
            <span className="px-2 py-0.5 bg-brand-teal/10 text-brand-teal rounded">DOOR ENTRY</span>
          </div>

          {/* Grid of seats */}
          <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto">
            {Array.from({ length: totalSeats }).map((_, idx) => {
              const seatNum = idx + 1;
              const isOccupied = occupiedSeatNumbers.includes(seatNum);
              const isAisle = (seatNum % 4 === 2); // Put aisle after 2nd column

              return (
                <React.Fragment key={seatNum}>
                  <div
                    className={`h-12 rounded-apple-md border flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isOccupied
                        ? "bg-brand-teal text-white border-brand-teal shadow-overlay"
                        : "bg-white text-ink border-border-soft hover:border-system-green hover:bg-system-green/10"
                    }`}
                  >
                    <span>S-{seatNum}</span>
                    <span className="text-[9px] opacity-80">{isOccupied ? "Occupied" : "Open"}</span>
                  </div>

                  {/* Insert aisle gap after every 2 seats */}
                  {(seatNum % 2 === 0 && seatNum % 4 !== 0) && (
                    <div className="flex items-center justify-center text-[10px] text-ink-muted font-mono font-bold">
                      AISLE
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="text-center text-xs font-mono font-bold text-ink-muted border-t border-border-soft pt-3">
            REAR ENGINE / EMERGENCY EXIT
          </div>
        </div>
      </div>

    </div>
  );
}
