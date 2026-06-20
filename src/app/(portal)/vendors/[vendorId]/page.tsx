"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Calendar, ShieldCheck, DollarSign, BarChart3, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";

type VendorTab = 'overview' | 'sla' | 'invoices';

export default function VendorProfilePage() {
  const params = useParams();
  const vendorId = params?.vendorId as string;
  const { vendors, addToast } = useTMSStore();
  const [activeTab, setActiveTab] = useState<VendorTab>('overview');

  const vendor = vendors.find(v => v.id === vendorId);

  if (!vendor) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <p className="text-caption text-ink font-semibold">Vendor Record Not Found</p>
        <Link href="/vendors" className="text-xs text-brand-teal font-bold hover:underline">
          Return to directory
        </Link>
      </div>
    );
  }

  // Mock SLA trend data
  const slaTrend = [
    { month: "Jan", SLA: 92 },
    { month: "Feb", SLA: 94 },
    { month: "Mar", SLA: 91 },
    { month: "Apr", SLA: 95 },
    { month: "May", SLA: vendor.slaCompliance },
  ];

  return (
    <div className="space-y-6">
      
      {/* Back and Title */}
      <Link href="/vendors" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Vendor Directory</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left card (4/12) */}
        <div className="lg:col-span-4 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-background-secondary border border-border-soft rounded-apple-md flex items-center justify-center text-brand-teal mb-4">
              <Briefcase className="h-8 w-8" />
            </div>
            <StatusBadge status={vendor.status} />
            <h2 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight mt-3">
              {vendor.name}
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">SAP Vendor ID: {vendor.sapVendorId}</p>
          </div>

          <div className="border-t border-border-soft pt-4 space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Contract Expiry</span>
              <span className="font-semibold text-ink">{vendor.contractExpiryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Contract Status</span>
              <span className="font-semibold text-system-green">✓ Valid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Leased Fleet Size</span>
              <span className="font-semibold text-brand-blue">{vendor.vehicleCount} Units</span>
            </div>
          </div>
        </div>

        {/* Center column tab menus (6/12) */}
        <div className="lg:col-span-6 bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay space-y-6">
          <div className="flex border-b border-border-soft space-x-6 select-none">
            {(['overview', 'sla', 'invoices'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-caption font-semibold relative transition-all capitalize ${
                  activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{tab === 'sla' ? 'SLA Trend Logs' : tab}</span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="vendorProfileTabIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Contract Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">Authorized Dispatch Routes</span>
                      <p className="text-xs font-semibold text-ink mt-2">Jubail Industrial Shuttle Lines</p>
                    </div>
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">WBS Linked cost centers</span>
                      <p className="text-xs font-semibold text-ink mt-2">Logistics Projects CC-300</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sla' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Historical SLA compliance rating</h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={slaTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" style={{ fontSize: 9 }} />
                        <YAxis unit="%" domain={[80, 100]} style={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="SLA" stroke="#006B6B" fill="rgba(0,107,107,0.15)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {activeTab === 'invoices' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink font-display">Invoice reconciliation sheets</h3>
                  <div className="space-y-3.5">
                    <div className="bg-background-secondary border border-border-soft p-3.5 rounded-apple-sm flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-ink">Invoice June 2026</span>
                        <p className="text-[10px] text-ink-muted mt-1 leading-none">Reconciled accuracy rate: 100%</p>
                      </div>
                      <span className="font-bold text-brand-teal">24,500 SAR</span>
                    </div>
                    <div className="bg-background-secondary border border-border-soft p-3.5 rounded-apple-sm flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-ink">Invoice May 2026</span>
                        <p className="text-[10px] text-ink-muted mt-1 leading-none">Reconciled accuracy rate: 98.4%</p>
                      </div>
                      <span className="font-bold text-brand-teal">28,000 SAR</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Right action column (2/12) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-border-soft rounded-apple-lg p-4 shadow-overlay flex flex-col gap-4 text-center">
            <div>
              <p className="text-[10px] text-ink-muted uppercase leading-none font-semibold">Average SLA</p>
              <h3 className="text-display-md text-brand-teal font-semibold mt-1 tracking-tight">{vendor.slaCompliance}%</h3>
              <p className="text-[9px] text-ink-muted leading-none mt-1">SLA target: 90%</p>
            </div>

            <div className="border-t border-border-soft pt-4 space-y-2">
              <button 
                onClick={() => addToast({ type: "success", title: "Contract Flagged for Renewal", message: `Contract renewal request submitted for ${vendor.name}.` })}
                className="w-full py-2 bg-brand-teal hover:bg-[#005a5a] text-white text-xs font-semibold rounded-apple-pill btn-press-active transition-all"
              >
                Initiate Renewal
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
