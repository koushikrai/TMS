"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { ArrowLeft, ShieldAlert, CheckCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import ComplianceCountdown from "@/components/ui/ComplianceCountdown";

export default function KSAPermitsMatrix() {
  const { addToast } = useTMSStore();
  const [permits, setPermits] = useState([
    { id: "PM-101", veh: "HV-01 (Volvo Truck)", mizan: "Valid", tamm: "Valid", mvpi: "Expiring", tasriya: "Valid", naql: "Valid", expiry: "2026-07-15" },
    { id: "PM-102", veh: "HV-02 (Caterpillar Loader)", mizan: "Expired", tamm: "Valid", mvpi: "Valid", tasriya: "Expired", naql: "Valid", expiry: "2026-06-18" },
    { id: "PM-103", veh: "HV-03 (Liebherr Crane)", mizan: "Valid", tamm: "Valid", mvpi: "Valid", tasriya: "Valid", naql: "Valid", expiry: "2026-09-30" },
    { id: "PM-104", veh: "HV-04 (Low-bed Trailer)", mizan: "Valid", tamm: "Expiring", mvpi: "Valid", tasriya: "Valid", naql: "Expired", expiry: "2026-06-19" },
  ]);

  const handleRenewPermit = (id: string, permitType: string) => {
    setPermits(permits.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          [permitType.toLowerCase()]: "Valid", 
          expiry: new Date(2026, 9, 30).toISOString().split('T')[0] 
        };
      }
      return p;
    }));
    addToast({
      type: "success",
      title: "Permit Renewal Submitted",
      message: `Automatic Naql/Naqaba API renewal processed for ${permitType} permit.`
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
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">KSA Permits Matrix</h1>
          <p className="text-caption text-ink-muted mt-1">Cross-check heavy equipment status with Saudi regulatory databases</p>
        </div>
      </div>

      {/* Warning banner */}
      <div className="bg-system-orange/10 border border-system-orange/30 rounded-apple-lg p-4 flex gap-3 text-xs text-system-orange">
        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-ink">Action Required: Permits Expiring Soon</p>
          <p className="text-ink-muted mt-1 leading-relaxed">
            Standard operating cards for low-beds require renewal within 3 days to avoid port dispatch lockouts.
          </p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-soft text-ink-muted font-medium uppercase tracking-wider text-[10px]">
              <th className="py-3">Vehicle</th>
              <th className="py-3">MIZAN (Weight)</th>
              <th className="py-3">TAMM</th>
              <th className="py-3">MVPI (Safety)</th>
              <th className="py-3">Tasriya (Port)</th>
              <th className="py-3">Naql Card</th>
              <th className="py-3">Global Expiry</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft text-ink font-semibold">
            {permits.map((item) => (
              <tr key={item.id} className="hover:bg-background-secondary transition-all">
                <td className="py-4 text-ink font-bold">{item.veh}</td>
                
                {/* Mizan */}
                <td className="py-4">
                  <span onClick={() => handleRenewPermit(item.id, 'mizan')} className="cursor-pointer">
                    <StatusBadge status={item.mizan} />
                  </span>
                </td>
                
                {/* Tamm */}
                <td className="py-4">
                  <span onClick={() => handleRenewPermit(item.id, 'tamm')} className="cursor-pointer">
                    <StatusBadge status={item.tamm} />
                  </span>
                </td>
                
                {/* MVPI */}
                <td className="py-4">
                  <span onClick={() => handleRenewPermit(item.id, 'mvpi')} className="cursor-pointer">
                    <StatusBadge status={item.mvpi} />
                  </span>
                </td>
                
                {/* Tasriya */}
                <td className="py-4">
                  <span onClick={() => handleRenewPermit(item.id, 'tasriya')} className="cursor-pointer">
                    <StatusBadge status={item.tasriya} />
                  </span>
                </td>
                
                {/* Naql */}
                <td className="py-4">
                  <span onClick={() => handleRenewPermit(item.id, 'naql')} className="cursor-pointer">
                    <StatusBadge status={item.naql} />
                  </span>
                </td>

                <td className="py-4">
                  <ComplianceCountdown expiryDate={item.expiry} />
                </td>

                <td className="py-4 text-right">
                  <button 
                    onClick={() => handleRenewPermit(item.id, 'Naql')}
                    className="px-2.5 py-1 bg-background-secondary border border-border-soft rounded hover:bg-white text-[10px] font-bold text-brand-teal transition-all"
                  >
                    Quick Renew
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
