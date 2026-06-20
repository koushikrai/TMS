"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, Award, TrendingUp, Sliders, ShieldAlert, Star } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatusBadge from "@/components/ui/StatusBadge";

export default function DriverPerformanceAnalytics() {
  const { drivers } = useTMSStore();

  // 1. Sort top 5 drivers for Leaderboard
  const leaderboard = [...drivers]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 5);

  // 2. Mock charting data
  const completionData = [
    { day: "06/15", Completed: 42, Scheduled: 45 },
    { day: "06/16", Completed: 38, Scheduled: 38 },
    { day: "06/17", Completed: 45, Scheduled: 48 },
    { day: "06/18", Completed: 50, Scheduled: 51 },
    { day: "06/19", Completed: 48, Scheduled: 48 },
  ];

  const onTimeData = [
    { day: "06/15", Pickup: 98, Drop: 97 },
    { day: "06/16", Pickup: 96, Drop: 95 },
    { day: "06/17", Pickup: 98, Drop: 98 },
    { day: "06/18", Pickup: 99, Drop: 98 },
    { day: "06/19", Pickup: 97, Drop: 97 },
  ];

  const violationTypeData = [
    { type: "Speeding", count: 8 },
    { type: "Route Deviation", count: 3 },
    { type: "Geofence Breach", count: 2 },
    { type: "Expired Permits", count: 1 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/drivers" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Driver directory</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Driver Performance & Safety</h1>
          <p className="text-caption text-ink-muted mt-1">Review organizational leaderboards, safety metrics, and trip schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Leaderboard (1/3) */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col h-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-brand-teal animate-bounce" />
            <h3 className="text-caption-strong font-semibold text-ink font-display">Safety Leaderboard (Top 5)</h3>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
            {leaderboard.map((drv, idx) => (
              <div key={drv.id} className="bg-background-secondary border border-border-soft rounded-apple-md p-3.5 flex justify-between items-center hover:shadow-overlay transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <span>{drv.name}</span>
                      {idx === 0 && <Star className="h-3.5 w-3.5 text-system-orange fill-system-orange shrink-0" />}
                    </h4>
                    <p className="text-[10px] text-ink-muted leading-none mt-1">SAP ID: {drv.sapEmployeeNo}</p>
                  </div>
                </div>
                
                <span className="px-2.5 py-0.5 bg-system-green/10 border border-system-green/20 rounded-apple-sm text-xs font-bold text-system-green">
                  {drv.performanceScore}% Score
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Recharts diagrams (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Trip Completion Rate */}
            <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Trip Completion Ratio</h4>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={completionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" style={{ fontSize: 9 }} />
                    <YAxis style={{ fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Scheduled" fill="#e0e0e0" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Completed" fill="#006B6B" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* On-time Pickup & Drop */}
            <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">On-Time Accuracy Trend</h4>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={onTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" style={{ fontSize: 9 }} />
                    <YAxis unit="%" style={{ fontSize: 9 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Line type="monotone" dataKey="Pickup" stroke="#0066cc" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="Drop" stroke="#34c759" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Safety Violations Category Distribution */}
          <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Safety Violations Distribution</h4>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={violationTypeData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" style={{ fontSize: 9 }} />
                  <YAxis dataKey="type" type="category" style={{ fontSize: 9 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff3b30" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
