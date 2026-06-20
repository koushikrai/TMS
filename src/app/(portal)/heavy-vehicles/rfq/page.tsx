"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, Star, FileText, Check, Plus, HelpCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function VendorRFQPlanner() {
  const { addToast } = useTMSStore();
  const [awardedBidId, setAwardedBidId] = useState<string | null>(null);

  // Mock bids dataset
  const bids = [
    { id: "BID-901", vendor: "Jubail Logistics Co.", rate: 3500, eta: "2 hours", compliance: 98, sla: 96, isRec: true },
    { id: "BID-902", vendor: "Saudi Sands Transport", rate: 3200, eta: "4 hours", compliance: 92, sla: 88, isRec: false },
    { id: "BID-903", vendor: "Gulf Heavy Haulage", rate: 3800, eta: "1.5 hours", compliance: 96, sla: 92, isRec: false }
  ];

  const handleAwardBid = (bidId: string, vendor: string, rate: number) => {
    setAwardedBidId(bidId);
    addToast({
      type: "success",
      title: "Contract Awarded",
      message: `Project cost of ${rate.toLocaleString()} SAR assigned to WBS budget. ${vendor} notified.`
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/heavy-vehicles" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Heavy Operations</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Vendor RFQ Manager</h1>
          <p className="text-caption text-ink-muted mt-1">Review vendor quotes, compare service levels, and award dispatch contracts</p>
        </div>
        <button className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay">
          <Plus className="h-4 w-4" />
          <span>Create RFQ Request</span>
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4">
        <h3 className="text-caption-strong font-semibold text-ink">Bids Comparison Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-soft text-ink-muted font-medium uppercase tracking-wider text-[10px]">
                <th className="py-3">Vendor Contractor</th>
                <th className="py-3">Bid Rate (SAR)</th>
                <th className="py-3">ETA to Yard</th>
                <th className="py-3">Permits Compliance</th>
                <th className="py-3">Historical SLA</th>
                <th className="py-3 text-right">Award Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft text-ink font-semibold">
              {bids.map((bid) => {
                const isAwarded = awardedBidId === bid.id;
                return (
                  <tr key={bid.id} className={`hover:bg-background-secondary transition-all ${bid.isRec && !awardedBidId ? 'bg-brand-teal/5' : ''}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span>{bid.vendor}</span>
                        {bid.isRec && (
                          <span className="px-2 py-0.5 bg-brand-teal text-white text-[8px] font-bold rounded uppercase flex items-center gap-0.5">
                            <Star className="h-2 w-2 fill-white stroke-none" />
                            <span>Recommended</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-bold text-brand-teal">{bid.rate.toLocaleString()} SAR</td>
                    <td className="py-4 text-brand-blue">{bid.eta}</td>
                    <td className="py-4 font-bold text-system-green">{bid.compliance}%</td>
                    <td className="py-4 text-ink-muted">{bid.sla}%</td>
                    
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleAwardBid(bid.id, bid.vendor, bid.rate)}
                        disabled={awardedBidId !== null && !isAwarded}
                        className={`px-3 py-1.5 rounded-apple-pill text-xs font-semibold transition-all flex items-center gap-1 ml-auto btn-press-active ${
                          isAwarded 
                            ? "bg-system-green text-white" 
                            : "border border-border-hairline hover:bg-background-secondary text-ink disabled:opacity-30"
                        }`}
                      >
                        {isAwarded ? <Check className="h-3.5 w-3.5" /> : null}
                        <span>{isAwarded ? "Contract Awarded" : "Award Dispatch"}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
