"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Calendar, Users, ShieldCheck, Check, Clock, Plus } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function BusDailyTripScheduler() {
  const { addToast } = useTMSStore();
  const [syncing, setSyncing] = useState(false);
  const [shifts, setShifts] = useState([
    { id: "sh-1", time: "Day Shift (06:00 - 18:00)", bus: "BUS-01", driver: "Faisal Al-Shehri", occupancy: 42, max: 45, status: "Assigned" },
    { id: "sh-2", time: "Day Shift (06:00 - 18:00)", bus: "BUS-03", driver: "Abdulrahman Al-Subaie", occupancy: 38, max: 45, status: "Assigned" },
    { id: "sh-3", time: "Night Shift (18:00 - 06:00)", bus: "BUS-02", driver: "Yasser Al-Ghamdi", occupancy: 15, max: 45, status: "In Transit" },
    { id: "sh-4", time: "Night Shift (18:00 - 06:00)", bus: "Standby Pool", driver: "Standby Driver", occupancy: 0, max: 45, status: "Available" },
  ]);

  const handleSyncSAP = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      addToast({
        type: "success",
        title: "SAP Roster Synced",
        message: "Excluded 12 employees on leave from today's active pickup routing."
      });
    }, 1200);
  };

  const handleBookSeat = (shiftId: string) => {
    setShifts(shifts.map(s => {
      if (s.id === shiftId && s.occupancy < s.max) {
        return { ...s, occupancy: s.occupancy + 1 };
      }
      return s;
    }));
    addToast({
      type: "success",
      title: "Passenger Roster Updated",
      message: "Employee assigned to shuttle shift seat."
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Back & Title */}
      <Link href="/buses" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Bus Operations</span>
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Daily Trip Scheduler</h1>
          <p className="text-caption text-ink-muted mt-1">Allocate shuttle resources, schedule shift transits, and track roster entries</p>
        </div>
        <button
          onClick={handleSyncSAP}
          disabled={syncing}
          className="h-10 px-4 bg-background-secondary hover:bg-border-soft border border-border-soft rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active text-ink"
        >
          <RefreshCw className={`h-4 w-4 text-brand-teal ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? "Syncing Roster..." : "Sync SAP Roster"}</span>
        </button>
      </div>

      {/* SAP Roster integration banner */}
      <div className="bg-brand-teal/5 border border-brand-teal/15 rounded-apple-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-teal shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">SAP HCM Roster Integration Active</p>
            <p className="text-ink-muted mt-1 leading-relaxed">
              Automatic daily shift exclusion rule: 12 employees on leave today are auto-excluded from pickup routing algorithms.
            </p>
          </div>
        </div>
        <span className="text-[10px] text-brand-teal font-bold uppercase select-none shrink-0 bg-brand-teal/10 px-2.5 py-1 rounded">
          Sync Connected
        </span>
      </div>

      {/* Shifts scheduler grid */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-caption-strong font-semibold text-ink">Today&apos;s Dispatch Shifts</h3>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>June 20, 2026</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shifts.map((shift) => {
            const isFull = shift.occupancy >= shift.max;
            return (
              <div 
                key={shift.id}
                className="border border-border-soft rounded-apple-md p-4 bg-background-secondary hover:shadow-overlay transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted font-medium">
                      <Clock className="h-4 w-4 text-brand-blue" />
                      <span>{shift.time}</span>
                    </div>
                    <StatusBadge status={shift.status} />
                  </div>

                  <h4 className="text-caption-strong font-semibold text-ink">{shift.bus}</h4>
                  <p className="text-xs text-ink-muted mt-0.5">Driver: {shift.driver}</p>

                  {/* Seat capacity bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-[10px] text-ink-muted font-medium">
                      <span>Seat Occupancy</span>
                      <span className={isFull ? "text-system-red font-semibold" : "text-brand-teal font-semibold"}>
                        {shift.occupancy} / {shift.max} Booked
                      </span>
                    </div>
                    <div className="w-full bg-border-soft h-1.5 rounded-apple-pill overflow-hidden">
                      <div 
                        className={`h-full rounded-apple-pill transition-all duration-300 ${isFull ? 'bg-system-red' : 'bg-brand-teal'}`}
                        style={{ width: `${(shift.occupancy / shift.max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-border-soft pt-3 flex gap-2">
                  <button
                    onClick={() => handleBookSeat(shift.id)}
                    disabled={isFull}
                    className="flex-1 py-2 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all btn-press-active disabled:bg-system-gray/20 disabled:text-ink-muted"
                  >
                    Allocate Employee Seat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
