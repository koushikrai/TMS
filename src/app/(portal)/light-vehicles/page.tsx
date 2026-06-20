"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import VehicleCard from "@/components/ui/StatusBadge"; // Wait, we should import VehicleCard!
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, Search, Plus, ArrowRight, ShieldCheck, Car } from "lucide-react";
import Link from "next/link";
import VehicleCardComponent from "@/components/ui/VehicleCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function LightVehiclesOverview() {
  const { vehicles } = useTMSStore();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ownershipFilter, setOwnershipFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter light vehicles only (SUV, Sedan, SmallSUV)
  const lvList = vehicles.filter(v => 
    v.category === 'SUV' || v.category === 'Sedan' || v.category === 'SmallSUV'
  );

  const filteredLV = lvList.filter(v => {
    const matchesCategory = categoryFilter === "All" || v.category === categoryFilter;
    const matchesOwnership = ownershipFilter === "All" || v.ownership === ownershipFilter;
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sapEquipmentNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesOwnership && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Light Vehicle Management</h1>
          <p className="text-caption text-ink-muted mt-1">Request allocations, review assignments, and manage light logistics fleet</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/light-vehicles/requests"
            className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
          >
            <Plus className="h-4 w-4" />
            <span>Vehicle Request Hub</span>
          </Link>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="bg-white border border-border-soft rounded-apple-md p-4 shadow-overlay flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-muted pointer-events-none">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search make, model, plate or SAP No..."
            className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-hairline rounded-apple-pill text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand-teal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category */}
          <select
            className="px-3 py-1.5 bg-background-secondary border border-border-soft rounded-apple-sm text-xs text-ink focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="SUV">SUVs</option>
            <option value="Sedan">Sedans</option>
            <option value="SmallSUV">Small SUVs</option>
          </select>

          {/* Ownership */}
          <select
            className="px-3 py-1.5 bg-background-secondary border border-border-soft rounded-apple-sm text-xs text-ink focus:outline-none"
            value={ownershipFilter}
            onChange={(e) => setOwnershipFilter(e.target.value)}
          >
            <option value="All">All Ownership</option>
            <option value="Owned">Owned Fleet</option>
            <option value="Vendor">Vendor Leased</option>
          </select>

          {/* Status */}
          <select
            className="px-3 py-1.5 bg-background-secondary border border-border-soft rounded-apple-sm text-xs text-ink focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Active">Active Duty</option>
            <option value="UnderMaintenance">Under Service</option>
            <option value="Breakdown">Breakdown</option>
          </select>

          {/* Grid/Table Toggle */}
          <div className="flex border border-border-soft rounded-apple-sm overflow-hidden ml-auto md:ml-0 bg-background-secondary">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all ${viewMode === "grid" ? "bg-white text-brand-teal" : "text-ink-muted hover:text-ink"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 transition-all ${viewMode === "table" ? "bg-white text-brand-teal" : "text-ink-muted hover:text-ink"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table display */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredLV.map((vehicle) => (
              <div key={vehicle.id}>
                <VehicleCardComponent vehicle={vehicle} />
              </div>
            ))}
            {filteredLV.length === 0 && (
              <div className="col-span-full py-16 bg-white border border-border-soft rounded-apple-lg flex flex-col items-center justify-center text-ink-muted">
                <Car className="h-10 w-10 text-ink-muted mb-2 animate-bounce" />
                <span>No light vehicles match filters.</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-border-soft rounded-apple-lg p-4 shadow-overlay overflow-x-auto"
          >
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-soft text-ink-muted font-medium">
                  <th className="py-3">SAP ID</th>
                  <th className="py-3">Plate No</th>
                  <th className="py-3">Vehicle Details</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Ownership</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft text-ink font-medium">
                {filteredLV.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-background-secondary transition-all">
                    <td className="py-3.5 font-mono text-[11px]">{vehicle.sapEquipmentNo}</td>
                    <td className="py-3.5 tracking-wider font-semibold">{vehicle.plateNumber}</td>
                    <td className="py-3.5">{vehicle.make} {vehicle.model} ({vehicle.year})</td>
                    <td className="py-3.5"><span className="px-1.5 py-0.5 bg-background-secondary rounded text-[10px]">{vehicle.category}</span></td>
                    <td className="py-3.5 uppercase text-[10px] font-bold text-brand-teal">{vehicle.ownership}</td>
                    <td className="py-3.5"><StatusBadge status={vehicle.status} /></td>
                    <td className="py-3.5 text-right">
                      <Link href={`/light-vehicles/${vehicle.id}`} className="text-brand-blue font-bold hover:underline">
                        Profile &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
