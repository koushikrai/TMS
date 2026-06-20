"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, Sliders, DollarSign, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import gsap from "gsap";

export default function BusCapacityPlanner() {
  const { addToast } = useTMSStore();
  const [peakOccupancy, setPeakOccupancy] = useState(80);
  const [mergeThreshold, setMergeThreshold] = useState(60);
  
  // Real-time calculated values based on sliders
  const savedBuses = Math.floor((peakOccupancy / 10) + (mergeThreshold / 20));
  const savedCost = savedBuses * 4500;
  
  const savedBusesRef = useRef<HTMLSpanElement>(null);
  const savedCostRef = useRef<HTMLSpanElement>(null);

  // GSAP Counter Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (savedBusesRef.current) {
        gsap.to({ val: 0 }, {
          val: savedBuses,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: function() {
            if (savedBusesRef.current) {
              savedBusesRef.current.textContent = Math.floor(this.targets()[0].val).toString();
            }
          }
        });
      }
      if (savedCostRef.current) {
        gsap.to({ val: 0 }, {
          val: savedCost,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: function() {
            if (savedCostRef.current) {
              savedCostRef.current.textContent = Math.floor(this.targets()[0].val).toLocaleString();
            }
          }
        });
      }
    });
    return () => ctx.revert();
  }, [peakOccupancy, mergeThreshold, savedBuses, savedCost]);

  // Recharts composed chart mock data
  const capacityData = [
    { name: "Week 1", Forecasted: 1300, Actual: 1100, Capacity: 1500 },
    { name: "Week 2", Forecasted: 1450, Actual: 1350, Capacity: 1500 },
    { name: "Week 3", Forecasted: 1200, Actual: 1180, Capacity: 1500 },
    { name: "Week 4", Forecasted: 1600, Actual: 1420, Capacity: 1800 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/buses" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Bus Operations</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Capacity Planner</h1>
          <p className="text-caption text-ink-muted mt-1">Review shuttle utilization history and run what-if consolidation simulations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual chart (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
            <h3 className="text-caption-strong font-semibold text-ink mb-4 font-display">Shuttle Demand Forecast vs Actual Capacity</h3>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={capacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#7a7a7a' }} />
                  <YAxis tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#7a7a7a' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Actual" fill="#006B6B" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line type="monotone" dataKey="Forecasted" stroke="#0066cc" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Capacity" stroke="#ff3b30" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-apple-sm p-4 flex gap-3 text-xs leading-relaxed">
            <Info className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink">Simulations parameters advisory</p>
              <p className="text-ink-muted mt-1">
                Optimizing peak occupancy thresholds allows the consolidated routing engine to merge overlapping route segments, minimizing fleet cost without compromising employee arrival time.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Simulator panel (1/3) */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-brand-teal" />
              <h3 className="text-caption-strong font-semibold text-ink">What-If Simulator</h3>
            </div>

            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-ink">
                <span>Peak Occupancy Target</span>
                <span className="text-brand-teal font-bold">{peakOccupancy}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                className="w-full h-1.5 bg-border-soft rounded-apple-pill appearance-none cursor-pointer accent-brand-teal"
                value={peakOccupancy}
                onChange={(e) => setPeakOccupancy(Number(e.target.value))}
              />
              <p className="text-[9px] text-ink-muted leading-tight">Increases target passenger density per active shuttle vehicle.</p>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-ink">
                <span>Merge Threshold Limit</span>
                <span className="text-brand-blue font-bold">{mergeThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="90" 
                className="w-full h-1.5 bg-border-soft rounded-apple-pill appearance-none cursor-pointer accent-brand-blue"
                value={mergeThreshold}
                onChange={(e) => setMergeThreshold(Number(e.target.value))}
              />
              <p className="text-[9px] text-ink-muted leading-tight">Maximum capacity criteria to trigger route merger alerts.</p>
            </div>
          </div>

          {/* Dynamic GSAP Output */}
          <div className="border-t border-border-soft pt-5 mt-6 space-y-4 text-center">
            <div>
              <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Simulated Buses Saved</p>
              <h4 className="text-display-md text-brand-teal font-semibold mt-1 tracking-tight">
                <span ref={savedBusesRef}>0</span>
                <span className="text-xs text-ink-muted font-normal"> Buses</span>
              </h4>
            </div>

            <div>
              <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Projected Monthly Savings</p>
              <h4 className="text-display-md text-ink font-semibold mt-1 tracking-tight text-brand-blue">
                SAR <span ref={savedCostRef}>0</span>
              </h4>
            </div>

            <button 
              onClick={() => addToast({ type: "success", title: "Simulator Profile Locked", message: "Merged parameters saved to active operational policies." })}
              className="w-full py-2.5 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
            >
              Commit Simulation Parameters
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
