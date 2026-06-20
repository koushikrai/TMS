"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion } from "framer-motion";
import { Users, Search, Plus, TrendingUp, HelpCircle, Award } from "lucide-react";
import Link from "next/link";
import DriverCard from "@/components/ui/DriverCard";

export default function DriverDirectory() {
  const { drivers } = useTMSStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = searchQuery === "" || 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.sapEmployeeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "All" || driver.type === typeFilter;
    const matchesStatus = statusFilter === "All" || driver.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Driver Directory</h1>
          <p className="text-caption text-ink-muted mt-1">Review active personnel records, monitor safety performance, and update licensing credentials</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/drivers/performance"
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <Award className="h-4 w-4 text-brand-teal" />
            <span>Safety Leaderboard</span>
          </Link>
          <button className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay">
            <Plus className="h-4 w-4" />
            <span>Onboard New Driver</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Total Active Drivers</span>
          <p className="text-display-md text-ink font-semibold mt-1">
            {drivers.filter(d => d.status === 'Active').length}
          </p>
          <p className="text-[9px] text-ink-muted mt-1">Pool limit: 75 drivers</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Owned vs Vendor</span>
          <p className="text-display-md text-ink font-semibold mt-1">
            25 <span className="text-xs text-ink-muted font-normal">/ 35</span>
          </p>
          <p className="text-[9px] text-brand-teal font-bold uppercase mt-1">42% Owned payroll</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Average Safety Rating</span>
          <p className="text-display-md text-system-green font-semibold mt-1">91.4%</p>
          <p className="text-[9px] text-system-green font-bold uppercase mt-1">SLA Target &gt; 85%</p>
        </div>
        <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay">
          <span className="text-[10px] text-ink-muted uppercase font-semibold">Document Warning Alerts</span>
          <p className="text-display-md text-system-orange font-semibold mt-1">4</p>
          <p className="text-[9px] text-system-orange font-bold uppercase mt-1">Iqama & License checks</p>
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
            placeholder="Search driver by name, SAP ID, license..."
            className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-hairline rounded-apple-pill text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand-teal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="px-3 py-1.5 bg-background-secondary border border-border-soft rounded-apple-sm text-xs text-ink focus:outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Owned">Owned Payroll</option>
            <option value="Vendor">Vendor Contractor</option>
          </select>

          <select
            className="px-3 py-1.5 bg-background-secondary border border-border-soft rounded-apple-sm text-xs text-ink focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Duty</option>
            <option value="OnLeave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Driver Card Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {filteredDrivers.map((driver) => (
          <div key={driver.id}>
            <DriverCard driver={driver} />
          </div>
        ))}
        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-16 bg-white border border-border-soft rounded-apple-lg flex flex-col items-center justify-center text-ink-muted">
            <Users className="h-10 w-10 text-ink-muted mb-2 animate-bounce" />
            <span>No drivers match filters.</span>
          </div>
        )}
      </motion.div>

    </div>
  );
}
