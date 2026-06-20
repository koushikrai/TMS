"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion } from "framer-motion";
import { Briefcase, Search, Plus, Award, CreditCard, ChevronRight, Sliders } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function VendorDirectory() {
  const { vendors } = useTMSStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVendors = vendors.filter((v) => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sapVendorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPerformanceBadge = (sla: number) => {
    if (sla >= 95) return { text: "Gold (Premium)", color: "text-system-green bg-system-green/10" };
    if (sla >= 85) return { text: "Silver (Approved)", color: "text-brand-blue bg-brand-blue/10" };
    return { text: "Review required", color: "text-system-red bg-system-red/10 animate-pulse" };
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Vendors & RFQ</h1>
          <p className="text-caption text-ink-muted mt-1">Monitor transport contractors, manage contract rate cards, and review bid awards</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/vendors/rate-cards"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <CreditCard className="h-4 w-4 text-brand-teal" />
            <span>Rate Card Master</span>
          </Link>
          <button className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay">
            <Plus className="h-4 w-4" />
            <span>Onboard Contractor</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search contractor name, SAP ID..."
            className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-hairline rounded-apple-pill text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand-teal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVendors.map((vendor) => {
          const badge = getPerformanceBadge(vendor.slaCompliance);
          return (
            <motion.div
              key={vendor.id}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white border border-border-soft rounded-apple-md overflow-hidden shadow-overlay hover:shadow-product transition-all flex flex-col justify-between h-full"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 bg-background-secondary border border-border-soft rounded-apple-md flex items-center justify-center text-ink-muted">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <StatusBadge status={vendor.status} />
                </div>

                <div>
                  <h4 className="text-caption-strong font-semibold text-ink leading-tight">{vendor.name}</h4>
                  <p className="text-[10px] text-ink-muted mt-0.5 font-mono uppercase">SAP Vendor Code: {vendor.sapVendorId}</p>
                </div>

                {/* Score badge */}
                <div className="flex justify-between items-center text-xs font-semibold border-t border-border-soft pt-3">
                  <span className="text-ink-muted">SLA compliance:</span>
                  <span className="text-ink">{vendor.slaCompliance}%</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-ink-muted">Leased vehicles:</span>
                  <span className="text-brand-blue">{vendor.vehicleCount} Units</span>
                </div>

                {/* Performance Medal */}
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-ink-muted">SLA rating:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>{badge.text}</span>
                </div>
              </div>

              {/* View profile */}
              <Link
                href={`/vendors/${vendor.id}`}
                className="w-full py-2.5 bg-background-secondary hover:bg-border-soft border-t border-border-soft text-ink text-center text-xs font-semibold flex items-center justify-center gap-1 transition-all"
              >
                <span>Review Vendor File</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
