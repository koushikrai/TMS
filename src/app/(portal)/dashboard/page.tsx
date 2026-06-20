"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import MetricTile from "@/components/ui/MetricTile";
import LiveFleetMap from "@/components/maps/LiveFleetMap";
import TripCard from "@/components/ui/TripCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { AlertTriangle, Info, CheckCircle, ShieldAlert, TrendingUp, DollarSign, Calendar, Sliders } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from "recharts";

interface AlertFeedItem {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  timestamp: string;
  module: string;
}

export default function DashboardPage() {
  const { vehicles, requests, violations, vendors } = useTMSStore();
  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  // 1. Calculations for KPIs
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === "Active" || v.status === "Available").length;
  const activeRatio = totalVehicles > 0 ? Math.floor((activeVehicles / totalVehicles) * 100) : 0;
  
  const todayTrips = requests.filter(r => r.status === "InProgress" || r.status === "Assigned").length;
  
  const expiringDocs = vehicles.reduce((acc, curr) => {
    const hasExpiring = curr.documents.some(d => d.status === "Expiring" || d.status === "Expired");
    return hasExpiring ? acc + 1 : acc;
  }, 0);

  const openViolations = violations.filter(v => v.status !== "Closed" && v.status !== "Resolved").length;
  
  const averageSLA = vendors.length > 0 
    ? Math.floor(vendors.reduce((acc, curr) => acc + curr.slaCompliance, 0) / vendors.length) 
    : 0;

  const totalCost = requests
    .filter(r => r.status === 'Completed' || r.status === 'InProgress' || r.status === 'Approved')
    .reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);

  // 2. Alert Feed Data
  const alerts: AlertFeedItem[] = [
    { id: "alt-01", type: "critical", message: "Speeding breach: Vehicle HV-02 logged at 128 km/h on Jubail Highway.", timestamp: "10 mins ago", module: "GPS Tracking" },
    { id: "alt-02", type: "warning", message: "Vehicle LV-08 Istimara document expires in 4 days.", timestamp: "25 mins ago", module: "Compliance" },
    { id: "alt-03", type: "info", message: "SAP HCM synchronization completed: 12 leaves verified.", timestamp: "1 hour ago", module: "Integrations" },
    { id: "alt-04", type: "critical", message: "Geofence boundary breach: Crane CRN-04 exited Jubail Yard A.", timestamp: "2 hours ago", module: "GPS Tracking" },
    { id: "alt-05", type: "warning", message: "Driver Sultan Al-Otaibi Iqama document requires renewal review.", timestamp: "4 hours ago", module: "Compliance" },
    { id: "alt-06", type: "info", message: "New temporary allocation request REQ-1045 submitted.", timestamp: "5 hours ago", module: "Requests" }
  ];

  const filteredAlerts = alerts.filter(item => alertFilter === "all" || item.type === alertFilter);

  // 3. Recharts Data Mapping
  const utilisationData = [
    { name: "SUV", util: 85, fill: "#006B6B" },
    { name: "Sedan", util: 70, fill: "#0066cc" },
    { name: "Buses", util: 92, fill: "#34c759" },
    { name: "Heavy Eq", util: 76, fill: "#ff9500" },
    { name: "Trucks", util: 81, fill: "#af52de" }
  ];

  const complianceChartData = [
    { name: "Valid Documents", value: 34, color: "#34c759" },
    { name: "Expiring soon", value: 8, color: "#ff9500" },
    { name: "Expired", value: 3, color: "#ff3b30" }
  ];

  const vendorPerformanceData = [
    { name: "Jubail Logistics", value: 96, fill: "#006B6B" },
    { name: "Saudi Sands", value: 88, fill: "#0066cc" },
    { name: "Gulf Heavy Haul", value: 92, fill: "#34c759" },
    { name: "Al-Falah Logistics", value: 84, fill: "#ff9500" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Command Center</h1>
          <p className="text-caption text-ink-muted mt-1">Real-time status overview of Expertise CJSC fleet operations</p>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-4 border border-border-hairline rounded-apple-sm text-caption bg-background hover:bg-background-secondary transition-all font-semibold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-ink-muted" />
            <span>Operational Config</span>
          </button>
        </div>
      </div>

      {/* 1. Live Map Tracker */}
      <LiveFleetMap />

      {/* 2. 6-Card KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricTile title="Fleet Active Ratio" value={activeRatio} suffix="%" color="teal" delta="+2.1%" deltaType="positive" />
        <MetricTile title="Active Trips Today" value={todayTrips} color="blue" delta="+12" deltaType="positive" />
        <MetricTile title="Documents Expiring" value={expiringDocs} suffix=" docs" color="orange" delta="-3" deltaType="positive" />
        <MetricTile title="Open Violations" value={openViolations} color="red" delta="+1" deltaType="negative" />
        <MetricTile title="Average Vendor SLA" value={averageSLA} suffix="%" color="green" delta="+0.4%" deltaType="positive" />
        <MetricTile title="Cross-Charges" value={totalCost} prefix="SAR " color="purple" delta="+8%" deltaType="positive" />
      </div>

      {/* 3. Three-Column Detailed Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Real-time Alert Feed */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption-strong font-semibold text-ink">Alert Feed</h3>
            <div className="flex bg-background-secondary p-0.5 rounded-apple-pill border border-border-soft">
              {(["all", "critical", "warning", "info"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={`px-2.5 py-1 rounded-apple-pill text-[10px] uppercase font-bold transition-all ${
                    alertFilter === f 
                      ? "bg-brand-teal text-white shadow-overlay" 
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            <AnimatePresence mode="popLayout">
              {filteredAlerts.map((alert) => {
                let alertColor = "border-brand-blue bg-brand-blue/5 text-brand-blue";
                let Icon = Info;
                if (alert.type === "critical") {
                  alertColor = "border-system-red bg-system-red/5 text-system-red";
                  Icon = AlertTriangle;
                } else if (alert.type === "warning") {
                  alertColor = "border-system-orange bg-system-orange/5 text-system-orange";
                  Icon = ShieldAlert;
                }

                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className={`border-l-4 ${alertColor} p-3 rounded-r-apple-sm flex gap-3`}
                  >
                    <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{alert.module}</span>
                        <span className="text-[10px] text-ink-muted">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-ink font-medium mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredAlerts.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-ink-muted text-caption">
                <CheckCircle className="h-8 w-8 text-system-green mb-2" />
                <span>No active alerts in filter.</span>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Active Trips Monitoring */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col h-[480px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-caption-strong font-semibold text-ink">Active Transit Status</h3>
            <span className="text-xs text-brand-blue font-semibold hover:underline cursor-pointer">Monitor Map</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {requests.filter(r => r.status === 'InProgress').slice(0, 3).map((req) => (
              <TripCard key={req.id} request={req} />
            ))}
            {requests.filter(r => r.status === 'InProgress').length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-ink-muted text-caption">
                <Info className="h-8 w-8 text-brand-blue mb-2 animate-bounce" />
                <span>No active trips on duty right now.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Compliance Status Ring */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay flex flex-col h-[480px]">
          <h3 className="text-caption-strong font-semibold text-ink mb-4">Core Compliance Health</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Recharts Pie Donut */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceChartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {complianceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legends list */}
            <div className="w-full space-y-2 mt-4">
              {complianceChartData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-ink-muted font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold text-ink">{item.value} Assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Grid: Fleet Utilisation & Vendor Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fleet Utilisation Chart */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
          <h3 className="text-caption-strong font-semibold text-ink mb-4">Operational Utilization by Segment</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilisationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#7a7a7a' }} />
                <YAxis unit="%" tickLine={false} axisLine={false} style={{ fontSize: 10, fill: '#7a7a7a' }} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="util" radius={[4, 4, 0, 0]}>
                  {utilisationData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Performance Radial Chart */}
        <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay">
          <h3 className="text-caption-strong font-semibold text-ink mb-4">Leased Vendor SLA Adherence</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="90%" 
                barSize={12} 
                data={vendorPerformanceData}
              >
                <RadialBar
                  label={{ position: 'insideStart', fill: '#fff', fontSize: 9 }}
                  background
                  dataKey="value"
                />
                <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
