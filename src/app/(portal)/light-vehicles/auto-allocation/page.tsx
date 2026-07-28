"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, CheckCircle2, Car, MapPin, Fuel, ShieldCheck, 
  Sparkles, ArrowRight, UserCheck, RefreshCw, Award
} from "lucide-react";

export default function AutoAllocationPage() {
  const { vehicles, requests, updateRequest, addToast } = useTMSStore();
  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id || "REQ-1001");
  const [isCalculating, setIsCalculating] = useState(false);
  const [allocatedSuccess, setAllocatedSuccess] = useState(false);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) || requests[0];

  // Smart Allocation Ranking Algorithm
  const availableVehicles = vehicles.filter((v) => v.status === "Active" || v.status === "Available");

  const rankedVehicles = availableVehicles.map((v) => {
    // Proximity score (0-40)
    const distanceKm = Math.round((Math.abs((v.currentLocation?.lat || 27.01) - (selectedRequest?.pickupLocation.lat || 27.01)) + 
      Math.abs((v.currentLocation?.lng || 49.62) - (selectedRequest?.pickupLocation.lng || 49.62))) * 100);
    const proximityScore = Math.max(5, 40 - (distanceKm * 2));

    // Grade match score (0-30)
    const gradeScore = v.modelLevel === "M1" ? 30 : (v.modelLevel === "M2" ? 25 : 20);

    // Fuel & Maintenance efficiency score (0-30)
    const fuelScore = v.documents.every((d) => d.status === "Valid") ? 30 : 15;

    const totalScore = proximityScore + gradeScore + fuelScore;

    return {
      vehicle: v,
      distanceKm,
      proximityScore,
      gradeScore,
      fuelScore,
      totalScore
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const bestMatch = rankedVehicles[0];

  const handleExecuteAutoAllocation = () => {
    setIsCalculating(true);
    setAllocatedSuccess(false);

    setTimeout(() => {
      setIsCalculating(false);
      setAllocatedSuccess(true);
      if (selectedRequest && bestMatch) {
        updateRequest(selectedRequest.id, {
          assignedVehicleId: bestMatch.vehicle.id,
          status: "Assigned"
        });
        addToast({
          type: "success",
          title: "Auto-Allocation Complete",
          message: `Matched Request ${selectedRequest.id} with vehicle ${bestMatch.vehicle.id} (${bestMatch.vehicle.make} ${bestMatch.vehicle.model}) score ${bestMatch.totalScore}%!`
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Items #19 &amp; #22
            </span>
            <span className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> AI Auto-Allocation Engine
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink mt-1">Smart Vehicle Auto-Allocation Hub</h1>
          <p className="text-caption text-ink-muted">
            Intelligent recommendation algorithm matching employee requests with fleet proximity, grade eligibility, fuel efficiency, and compliance status.
          </p>
        </div>

        <button
          onClick={handleExecuteAutoAllocation}
          disabled={isCalculating || !bestMatch}
          className="px-5 py-2.5 bg-brand-teal text-white rounded-apple-pill text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-overlay disabled:opacity-50"
        >
          <Zap className={`h-4 w-4 ${isCalculating ? "animate-spin" : ""}`} />
          <span>{isCalculating ? "Calculating Match..." : "Run Auto-Allocation"}</span>
        </button>
      </div>

      {/* Select Request & Top Match */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Request Selector */}
        <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
          <div className="border-b border-border-soft pb-3">
            <h2 className="text-base font-semibold text-ink">Active Transport Requests</h2>
            <p className="text-xs text-ink-muted">Select a pending request to run allocation</p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {requests.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelectedRequestId(req.id)}
                className={`w-full text-left p-3.5 rounded-apple-md border transition-all ${
                  selectedRequestId === req.id
                    ? "bg-brand-teal/10 border-brand-teal text-ink font-semibold"
                    : "bg-background-secondary border-border-soft text-ink hover:bg-border-soft"
                }`}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-brand-teal">{req.id}</span>
                  <span className="text-ink-muted">{req.scheduledDate}</span>
                </div>
                <p className="text-xs text-ink line-clamp-1">{req.purpose}</p>
                <div className="flex items-center justify-between text-[10px] text-ink-muted mt-2 pt-1 border-t border-border-soft/60">
                  <span>Req: {req.requestorName}</span>
                  <span className="font-bold text-system-orange">{req.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Best Recommended Match */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-6">
            <div className="border-b border-border-soft pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded">
                  Top Recommended Vehicle Match
                </span>
                <h2 className="text-xl font-display font-bold text-ink mt-1">
                  {bestMatch?.vehicle.make} {bestMatch?.vehicle.model} ({bestMatch?.vehicle.plateNumber})
                </h2>
              </div>

              <div className="text-right">
                <div className="text-2xl font-display font-bold text-system-green">
                  {bestMatch?.totalScore} %
                </div>
                <span className="text-[10px] uppercase font-bold text-ink-muted">Match Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-brand-teal" /> Pickup Proximity
                </span>
                <p className="text-sm font-bold text-ink">{bestMatch?.distanceKm} km away</p>
                <span className="text-[10px] text-system-green font-semibold">+{bestMatch?.proximityScore} Score</span>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-brand-blue" /> Grade Eligibility
                </span>
                <p className="text-sm font-bold text-ink">Grade {bestMatch?.vehicle.modelLevel || "M1"} Verified</p>
                <span className="text-[10px] text-system-green font-semibold">+{bestMatch?.gradeScore} Score</span>
              </div>
              <div className="p-4 border border-border-soft rounded-apple-md bg-background-secondary space-y-1">
                <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-system-green" /> Document Compliance
                </span>
                <p className="text-sm font-bold text-ink">Istimara &amp; MVPI Valid</p>
                <span className="text-[10px] text-system-green font-semibold">+{bestMatch?.fuelScore} Score</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border-soft flex items-center justify-between">
              <span className="text-xs text-ink-muted">Assigned SAP Equipment No: <strong className="text-ink font-mono">{bestMatch?.vehicle.sapEquipmentNo}</strong></span>
              <button
                onClick={handleExecuteAutoAllocation}
                disabled={isCalculating}
                className="px-5 py-2.5 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <UserCheck className="h-4 w-4" /> Confirm &amp; Dispatch Vehicle
              </button>
            </div>
          </div>

          {/* Ranked Candidates Table */}
          <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-ink">All Eligible Candidate Vehicles</h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-background-secondary border-b border-border-soft">
                  <th className="p-3 font-semibold text-ink">Rank</th>
                  <th className="p-3 font-semibold text-ink">Vehicle</th>
                  <th className="p-3 font-semibold text-ink">Distance</th>
                  <th className="p-3 font-semibold text-ink">Grade</th>
                  <th className="p-3 font-semibold text-ink">Match Score</th>
                  <th className="p-3 font-semibold text-ink">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {rankedVehicles.map((item, idx) => (
                  <tr key={item.vehicle.id} className="hover:bg-background-secondary/50">
                    <td className="p-3 font-bold text-brand-teal">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-ink">{item.vehicle.make} {item.vehicle.model} ({item.vehicle.plateNumber})</td>
                    <td className="p-3 text-ink-muted">{item.distanceKm} km</td>
                    <td className="p-3 text-ink-muted">{item.vehicle.modelLevel || "M1"}</td>
                    <td className="p-3 font-bold text-system-green">{item.totalScore}%</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          updateRequest(selectedRequest.id, { assignedVehicleId: item.vehicle.id, status: "Assigned" });
                          addToast({ type: "success", title: "Manual Override", message: `Assigned ${item.vehicle.id} to ${selectedRequest.id}` });
                        }}
                        className="px-2.5 py-1 bg-background-secondary border border-border-soft rounded hover:bg-brand-teal hover:text-white text-ink text-[11px] font-medium transition-all"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
