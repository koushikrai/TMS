import React from "react";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface ComplianceCountdownProps {
  expiryDate: string;
}

export default function ComplianceCountdown({ expiryDate }: ComplianceCountdownProps) {
  const expiry = new Date(expiryDate);
  const today = new Date();
  
  // Strip times to only compare calendar days
  expiry.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let text = `${diffDays} days left`;
  let color = "text-system-green bg-system-green/5 border-system-green/20";
  let Icon = CheckCircle;

  if (diffDays < 0) {
    text = `Expired (${Math.abs(diffDays)}d ago)`;
    color = "text-system-red bg-system-red/10 border-system-red/30 font-semibold animate-pulse";
    Icon = AlertTriangle;
  } else if (diffDays <= 7) {
    text = `${diffDays}d left (Critical)`;
    color = "text-system-red bg-system-red/10 border-system-red/30 font-semibold animate-pulse";
    Icon = AlertTriangle;
  } else if (diffDays <= 30) {
    color = "text-system-orange bg-system-orange/15 border-system-orange/30 font-semibold";
    Icon = Clock;
  }

  return (
    <div className={`px-2.5 py-1 rounded-apple-sm text-[11px] border inline-flex items-center gap-1.5 font-medium ${color}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}
