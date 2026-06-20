import React from "react";
import { Driver } from "@/lib/types";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { Users, ShieldCheck, Award, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DriverCardProps {
  driver: Driver;
}

export default function DriverCard({ driver }: DriverCardProps) {
  // Score styling
  let scoreColor = "text-system-green bg-system-green/10";
  if (driver.performanceScore < 85) scoreColor = "text-system-orange bg-system-orange/10";
  if (driver.performanceScore < 75) scoreColor = "text-system-red bg-system-red/10";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white border border-border-soft rounded-apple-md overflow-hidden shadow-overlay hover:shadow-product transition-all flex flex-col h-full"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header Name & Role */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold">
              {driver.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-caption-strong font-semibold text-ink leading-tight">{driver.name}</h4>
              <p className="text-[10px] text-ink-muted mt-0.5 font-medium uppercase tracking-wider">{driver.type} Driver · {driver.sapEmployeeNo}</p>
            </div>
          </div>
          <StatusBadge status={driver.status} />
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 pt-1">
          <div className="bg-background-secondary border border-border-soft p-2 rounded-apple-sm">
            <div className="flex items-center gap-1 text-[9px] text-ink-muted uppercase font-semibold">
              <CreditCard className="h-3 w-3" />
              <span>License</span>
            </div>
            <p className="text-xs font-semibold text-ink mt-0.5 tracking-wider truncate">{driver.licenseCategory}</p>
          </div>
          <div className="bg-background-secondary border border-border-soft p-2 rounded-apple-sm">
            <div className="flex items-center gap-1 text-[9px] text-ink-muted uppercase font-semibold">
              <ShieldCheck className="h-3 w-3" />
              <span>Iqama / ID</span>
            </div>
            <p className="text-xs font-semibold text-ink mt-0.5 tracking-wider truncate">{driver.iqamaNumber}</p>
          </div>
        </div>

        {/* Current Duty Assignment */}
        <div className="space-y-3 mt-auto border-t border-border-soft pt-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-ink-muted font-semibold uppercase">Active Assignment</span>
            <span className="text-xs text-ink font-semibold">
              {driver.currentAssignment?.vehicleId || "Standby / Idle"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-ink-muted font-medium">
              <Award className="h-3.5 w-3.5" />
              <span>Safety Rating</span>
            </div>
            <span className={`px-2 py-0.5 rounded-apple-sm text-xs font-bold ${scoreColor}`}>
              {driver.performanceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Profile Detail Link */}
      <Link 
        href={`/drivers/${driver.id}`}
        className="w-full py-2.5 bg-background-secondary border-t border-border-soft hover:bg-border-soft text-ink text-center text-xs font-semibold select-none flex items-center justify-center gap-1 transition-all"
      >
        <span>Access Driver Profile</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>

    </motion.div>
  );
}
