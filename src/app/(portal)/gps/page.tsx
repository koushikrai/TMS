"use client";

import React, { useState } from "react";
import LiveFleetMap from "@/components/maps/LiveFleetMap";
import { motion } from "framer-motion";
import { 
  Navigation, MapPin, ShieldAlert, History, Radio, 
  CheckCircle, Play, Pause, RefreshCw, Zap
} from "lucide-react";

export default function GpsTelematicsPage() {
  const [activeTab, setActiveTab] = useState<"live" | "geofences" | "alerts" | "playback" | "saudiEx">("live");
  const [isPlaybackRunning, setIsPlaybackRunning] = useState(false);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #76 – #80
            </span>
            <span className="text-xs text-system-green font-semibold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Saudi Ex GPS Connected
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink">Geo-Fencing &amp; GPS Telematics Command Hub</h1>
          <p className="text-caption text-ink-muted">
            Live fleet tracking map, polygon geofence builder, telemetry alerts, route playback engine, and Saudi Ex GPS API connector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-system-green rounded-full animate-ping" />
          <span className="text-xs font-bold text-system-green">Live Stream Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border-soft pb-3 scrollbar-none">
        {[
          { id: "live", label: "Item #76: Live Fleet Map", icon: Navigation },
          { id: "geofences", label: "Item #77: Geofence Builder", icon: MapPin },
          { id: "alerts", label: "Item #78: Telematics Alerts", icon: ShieldAlert },
          { id: "playback", label: "Item #79: Route Playback", icon: History },
          { id: "saudiEx", label: "Item #80: Saudi Ex GPS API", icon: Radio }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-apple-pill text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? "bg-brand-teal text-white shadow-sm"
                  : "bg-white text-ink-muted border border-border-soft hover:text-ink hover:bg-background-secondary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        
        {/* Item #76: Live Fleet Map */}
        {activeTab === "live" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-apple-lg border border-border-soft flex items-center justify-between shadow-sm">
              <span className="text-xs font-semibold text-ink">Real-time GPS Location Feed (Leaflet / OpenStreetMap)</span>
              <span className="text-xs font-mono text-ink-muted">Active Vehicles: 14 | Telemetry Latency: 1.2s</span>
            </div>
            <LiveFleetMap />
          </div>
        )}

        {/* Item #77: Geofence Builder */}
        {activeTab === "geofences" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Item #77 – Geofence Polygon Builder</h2>
                <p className="text-xs text-ink-muted">Define circular and polygonal restricted zones across Jubail, Dammam, and SADARA sites.</p>
              </div>
              <button className="px-3 py-1.5 bg-brand-teal text-white text-xs font-semibold rounded-apple-pill">
                + Create Geofence Zone
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Jubail Industrial Yard A", type: "Depot / Site", radius: "500m", status: "Active" },
                { name: "SADARA Project Gate 3", type: "Restricted Zone", radius: "200m", status: "Active" },
                { name: "Ras Tanura Refinery Zone", type: "High Security", radius: "1000m", status: "Active" }
              ].map((zone, i) => (
                <div key={i} className="p-4 border border-border-soft rounded-apple-md space-y-2 bg-background-secondary">
                  <span className="text-xs font-bold text-brand-teal">{zone.name}</span>
                  <div className="flex justify-between text-xs text-ink-muted">
                    <span>Type: {zone.type}</span>
                    <span>Radius: {zone.radius}</span>
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-system-green/10 text-system-green text-[10px] font-bold rounded">
                    {zone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item #78: Telematics Alerts */}
        {activeTab === "alerts" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #78 – Geofence Speed &amp; Deviation Trigger Rules</h2>
              <p className="text-xs text-ink-muted">Automated real-time event alerts generated from GPS telemetry streams.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "ALT-901", vehicle: "LV-08 (Toyota Camry)", event: "Speeding Breach (125 km/h in 100 km/h zone)", time: "10 mins ago", severity: "High" },
                { id: "ALT-902", vehicle: "HV-12 (Kato Crane 50T)", event: "Geofence Exit: Jubail Yard A", time: "25 mins ago", severity: "Medium" },
                { id: "ALT-903", vehicle: "BUS-04 (Mercedes Shuttle)", event: "Route Deviation Detected (> 1.5 km off path)", time: "1 hour ago", severity: "Low" }
              ].map((alt) => (
                <div key={alt.id} className="p-4 border border-border-soft rounded-apple-md flex items-center justify-between bg-background-secondary">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-ink">{alt.id} • {alt.vehicle}</span>
                    <p className="text-xs text-ink-muted">{alt.event}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      alt.severity === "High" ? "bg-system-red/10 text-system-red" : "bg-system-orange/10 text-system-orange"
                    }`}>
                      {alt.severity} Priority
                    </span>
                    <p className="text-[10px] text-ink-muted">{alt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item #79: Route Playback */}
        {activeTab === "playback" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Item #79 – Historical Route Playback Engine</h2>
                <p className="text-xs text-ink-muted">Replay telemetry timeline scrubbers for trip audit and accident investigation.</p>
              </div>
              <button
                onClick={() => setIsPlaybackRunning(!isPlaybackRunning)}
                className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold flex items-center gap-2"
              >
                {isPlaybackRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaybackRunning ? "Pause Replay" : "Start Route Replay"}</span>
              </button>
            </div>

            <div className="h-64 bg-background-secondary rounded-apple-md border border-border-soft flex items-center justify-center text-ink-muted text-xs">
              [ Interactive Route Timeline Scrubbing Canvas Active ]
            </div>
          </div>
        )}

        {/* Item #80: Saudi Ex GPS API */}
        {activeTab === "saudiEx" && (
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft space-y-6 shadow-sm">
            <div className="border-b border-border-soft pb-4">
              <h2 className="text-lg font-semibold text-ink">Item #80 – Saudi Ex GPS Real-Time Telematics API Connector</h2>
              <p className="text-xs text-ink-muted">Standard API ingestion specs for Saudi Ex GPS devices.</p>
            </div>

            <div className="bg-ink text-white p-4 rounded-apple-md font-mono text-xs overflow-x-auto">
              <pre>{`POST /api/integrations/saudi-ex/telemetry
Content-Type: application/json

{
  "deviceId": "GPS-SAUDIEX-9901",
  "vehiclePlate": "KSA 8821 HDG",
  "timestamp": "2026-07-28T13:45:00Z",
  "latitude": 27.0112,
  "longitude": 49.6234,
  "speedKmh": 82.5,
  "ignition": true,
  "fuelLevelPercent": 78.4,
  "odometerKm": 142850
}`}</pre>
            </div>
          </div>
        )}

      </motion.div>

    </div>
  );
}
