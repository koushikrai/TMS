"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, Search, Plus, Edit2, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";

export default function RateCardMaster() {
  const { rateCards, addToast } = useTMSStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBaseRate, setEditBaseRate] = useState(0);

  const filteredCards = rateCards.filter(c => 
    c.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tripType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicleCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (id: string, base: number) => {
    setEditingId(id);
    setEditBaseRate(base);
  };

  const handleSaveEdit = (id: string) => {
    setEditingId(null);
    addToast({
      type: "success",
      title: "Rate Card Updated",
      message: "New base rate saved and synchronized with SAP S/4HANA."
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/vendors" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Vendor Directory</span>
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Rate Card Master</h1>
          <p className="text-caption text-ink-muted mt-1">Review vendor contract pricing structures and adjust billing rates</p>
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
            placeholder="Search contractor, trip class, vehicle..."
            className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-hairline rounded-apple-pill text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brand-teal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-soft text-ink-muted font-medium uppercase tracking-wider text-[10px]">
              <th className="py-3">Vendor Contractor</th>
              <th className="py-3">Trip Class</th>
              <th className="py-3">Vehicle Class</th>
              <th className="py-3">Base Price (SAR)</th>
              <th className="py-3">Km Charge (SAR)</th>
              <th className="py-3">Contract Validity</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft text-ink font-semibold">
            {filteredCards.map((card) => {
              const isEditing = editingId === card.id;
              return (
                <tr key={card.id} className="hover:bg-background-secondary transition-all">
                  <td className="py-4 text-ink font-bold">{card.vendorName}</td>
                  <td className="py-4">{card.tripType}</td>
                  <td className="py-4 font-bold text-brand-teal">{card.vehicleCategory}</td>
                  <td className="py-4 font-mono font-bold">
                    {isEditing ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-1 bg-white border border-border-hairline rounded focus:outline-none focus:ring-1 focus:ring-brand-teal"
                        value={editBaseRate}
                        onChange={(e) => setEditBaseRate(Number(e.target.value))}
                      />
                    ) : (
                      `${card.baseRateSar.toLocaleString()} SAR`
                    )}
                  </td>
                  <td className="py-4 text-ink-muted font-mono">{card.perKmRateSar} / km</td>
                  <td className="py-4 text-ink-muted font-medium">Valid Dec 2026</td>
                  
                  <td className="py-4 text-right">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(card.id)}
                        className="p-1 hover:bg-system-green/10 rounded text-system-green transition-all"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(card.id, card.baseRateSar)}
                        className="p-1 hover:bg-border-soft rounded text-ink-muted hover:text-ink transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
