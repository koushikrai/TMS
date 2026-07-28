"use client";

import React, { useState, useMemo } from "react";
import { POC_128_ITEMS, PocItem } from "@/lib/data/poc128Items";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Search, Filter, Compass, ArrowUpRight, 
  Sparkles, Layers, ShieldCheck, Cpu, ChevronRight, Zap, RefreshCw, BarChart2
} from "lucide-react";
import Link from "next/link";

export default function Poc128HubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedFitStatus, setSelectedFitStatus] = useState<string>("ALL");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(POC_128_ITEMS.map((item) => item.category)));
    return ["ALL", ...cats.sort()];
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return POC_128_ITEMS.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        item.num.toString().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.rfpRef.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q);
      
      const matchesCategory = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesFit = selectedFitStatus === "ALL" || item.fitStatus === selectedFitStatus;

      return matchesSearch && matchesCategory && matchesFit;
    });
  }, [searchQuery, selectedCategory, selectedFitStatus]);

  // Statistics
  const totalCount = POC_128_ITEMS.length;
  const fullyAvailable = POC_128_ITEMS.filter((i) => i.fitStatus.includes("Fully")).length;
  const partiallyAvailable = POC_128_ITEMS.filter((i) => i.fitStatus.includes("Partially")).length;
  const customConfigured = POC_128_ITEMS.filter((i) => !i.fitStatus.includes("Fully") && !i.fitStatus.includes("Partially")).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Header Banner */}
      <div className="relative rounded-apple-xl bg-gradient-to-r from-brand-teal/20 via-background-secondary to-brand-blue/20 p-8 border border-border-soft overflow-hidden shadow-overlay">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> TMS-365 Proof of Concept Master Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-ink tracking-tight">
              128 POC Requirements Dashboard
            </h1>
            <p className="text-caption text-ink-muted max-w-2xl">
              Complete baseline coverage for the Expertise Transport &amp; Logistics System RFP. Filter by workstream, examine fit status, and launch live interactive demonstrations for all 128 client items.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-apple-md bg-white border border-border-soft text-caption-strong text-ink hover:bg-background-secondary transition-all flex items-center gap-2 shadow-sm"
            >
              Command Center <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedFitStatus("ALL");
              }}
              className="px-4 py-2.5 rounded-apple-md bg-brand-teal text-white text-caption-strong font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-overlay"
            >
              <RefreshCw className="h-4 w-4" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border-soft/60">
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-4 rounded-apple-md border border-border-soft">
            <span className="text-xs text-ink-muted uppercase font-bold tracking-wider">Total Requirements</span>
            <div className="text-2xl font-display font-bold text-ink mt-1 flex items-baseline gap-2">
              {totalCount} <span className="text-xs font-normal text-system-green font-semibold">100% Ready</span>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-4 rounded-apple-md border border-border-soft">
            <span className="text-xs text-ink-muted uppercase font-bold tracking-wider">Fully Available</span>
            <div className="text-2xl font-display font-bold text-system-green mt-1">
              {fullyAvailable}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-4 rounded-apple-md border border-border-soft">
            <span className="text-xs text-ink-muted uppercase font-bold tracking-wider">Configured / Enhanced</span>
            <div className="text-2xl font-display font-bold text-brand-teal mt-1">
              {partiallyAvailable}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-sm p-4 rounded-apple-md border border-border-soft">
            <span className="text-xs text-ink-muted uppercase font-bold tracking-wider">Custom Workstreams</span>
            <div className="text-2xl font-display font-bold text-brand-blue mt-1">
              {customConfigured}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4 bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by Item #, Title, RFP Ref, Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background-secondary border border-border-soft rounded-apple-pill text-caption text-ink focus:outline-none focus:border-brand-teal transition-all"
            />
          </div>

          {/* Fit Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-ink-muted shrink-0 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Fit Status:
            </span>
            {["ALL", "Fully Available", "Partially Available"].map((fit) => (
              <button
                key={fit}
                onClick={() => setSelectedFitStatus(fit)}
                className={`px-3 py-1.5 rounded-apple-pill text-xs font-medium transition-all shrink-0 ${
                  selectedFitStatus === fit
                    ? "bg-ink text-white shadow-sm"
                    : "bg-background-secondary text-ink-muted hover:text-ink hover:bg-border-soft"
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="pt-4 border-t border-border-soft">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-ink-muted shrink-0 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" /> Workstream:
            </span>
            {categories.map((cat) => {
              const count = cat === "ALL" ? POC_128_ITEMS.length : POC_128_ITEMS.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-apple-pill text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? "bg-brand-teal text-white shadow-sm font-semibold"
                      : "bg-background-secondary text-ink-muted hover:text-ink hover:bg-border-soft"
                  }`}
                >
                  <span>{cat === "ALL" ? "All Workstreams" : cat}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    selectedCategory === cat ? "bg-white/20 text-white" : "bg-border-hairline text-ink-muted"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Item List Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-caption text-ink-muted">
            Showing <strong className="text-ink">{filteredItems.length}</strong> of {POC_128_ITEMS.length} requirements
          </span>
          {selectedCategory !== "ALL" && (
            <span className="text-xs font-semibold text-brand-teal bg-brand-teal/10 px-2.5 py-1 rounded-apple-pill">
              Filtered by: {selectedCategory}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.num}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white rounded-apple-md border border-border-soft hover:border-brand-teal/50 hover:shadow-product transition-all p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-apple-sm">
                      Item #{item.num}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-apple-pill ${
                      item.fitStatus.includes("Fully") 
                        ? "bg-system-green/10 text-system-green border border-system-green/20" 
                        : "bg-system-orange/10 text-system-orange border border-system-orange/20"
                    }`}>
                      {item.fitStatus}
                    </span>
                  </div>

                  <h3 className="font-semibold text-ink text-body leading-snug group-hover:text-brand-teal transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-xs text-ink-muted font-mono bg-background-secondary px-2.5 py-1 rounded border border-border-soft/60 inline-block">
                    RFP: {item.rfpRef}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border-soft/60">
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span>Workstream: <strong className="text-ink">{item.category}</strong></span>
                    <span>Phase: <strong className="text-ink">{item.phase}</strong></span>
                  </div>

                  <Link
                    href={item.route}
                    className="w-full py-2 px-3 rounded-apple-sm bg-background-secondary group-hover:bg-brand-teal group-hover:text-white text-ink text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Demonstrate Live</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-apple-lg border border-border-soft p-8 space-y-3">
            <Compass className="h-10 w-10 text-ink-muted/50 mx-auto" />
            <h3 className="text-lg font-semibold text-ink">No POC requirements matched your search</h3>
            <p className="text-caption text-ink-muted max-w-sm mx-auto">
              Try adjusting your search terms or clearing the workstream filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedFitStatus("ALL");
              }}
              className="px-4 py-2 rounded-apple-pill bg-brand-teal text-white text-xs font-semibold hover:bg-brand-teal/90 transition-all mt-2"
            >
              Clear Search &amp; Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
