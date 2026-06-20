import React from "react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const norm = status.toLowerCase().replace(/_/g, ' ');
  
  let bg = "bg-system-gray/10 text-system-gray border border-system-gray/20";
  
  if (
    norm === "active" || 
    norm === "available" || 
    norm === "completed" || 
    norm === "valid" || 
    norm === "approved" || 
    norm === "resolved" ||
    norm === "closed"
  ) {
    bg = "bg-system-green/10 text-system-green border border-system-green/20";
  } else if (
    norm === "pending" || 
    norm === "under review" || 
    norm === "underapproval" || 
    norm === "submitted" || 
    norm === "expiring soon" || 
    norm === "expiring" ||
    norm === "disputed"
  ) {
    bg = "bg-system-orange/10 text-system-orange border border-system-orange/20";
  } else if (
    norm === "breakdown" || 
    norm === "critical" || 
    norm === "expired" || 
    norm === "rejected" || 
    norm === "reported"
  ) {
    bg = "bg-system-red/10 text-system-red border border-system-red/20";
  } else if (
    norm === "under maintenance" || 
    norm === "undermaintenance" || 
    norm === "in transit" || 
    norm === "in progress" || 
    norm === "inprogress" ||
    norm === "assigned"
  ) {
    bg = "bg-brand-blue/10 text-brand-blue border border-brand-blue/20";
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-apple-pill text-[10px] font-bold inline-flex items-center justify-center whitespace-nowrap uppercase tracking-wider ${bg}`}>
      {norm}
    </span>
  );
}
