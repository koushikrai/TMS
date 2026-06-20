import React from "react";
import { Vehicle } from "@/lib/types";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import ComplianceCountdown from "./ComplianceCountdown";
import { Car, Wrench, Shield, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  // Find first document expiry as summary
  const complianceDoc = vehicle.documents.find(d => d.type === 'Istimara') || vehicle.documents[0];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white border border-border-soft rounded-apple-md overflow-hidden shadow-overlay hover:shadow-product transition-all flex flex-col h-full"
    >
      <div className="p-5 flex-1 flex flex-col">
        {/* Header summary */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-apple-sm bg-background-secondary border border-border-soft flex items-center justify-center text-ink-muted">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase font-bold text-brand-teal tracking-wider">{vehicle.ownership}</span>
                {vehicle.modelLevel && (
                  <span className="px-1.5 py-0.2 bg-background-secondary border border-border-soft text-ink-muted text-[9px] font-bold rounded">
                    {vehicle.modelLevel}
                  </span>
                )}
              </div>
              <h4 className="text-caption-strong font-semibold text-ink leading-tight mt-0.5">{vehicle.make} {vehicle.model}</h4>
            </div>
          </div>
          <StatusBadge status={vehicle.status} />
        </div>

        {/* Plate / Sap information */}
        <div className="bg-background-secondary rounded-apple-sm p-3 flex justify-between items-center mb-4 border border-border-soft select-all">
          <div>
            <p className="text-[10px] text-ink-muted uppercase leading-none font-medium">Plate Number</p>
            <p className="text-xs font-semibold text-ink mt-1 tracking-wider">{vehicle.plateNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-ink-muted uppercase leading-none font-medium">SAP Equipment No</p>
            <p className="text-xs font-mono text-ink mt-1">{vehicle.sapEquipmentNo}</p>
          </div>
        </div>

        {/* Status meters */}
        <div className="space-y-3 mt-auto">
          <div>
            <div className="flex justify-between text-[10px] text-ink-muted mb-1 font-medium">
              <span>Utilisation</span>
              <span>{vehicle.status === 'Active' ? '85%' : '0%'}</span>
            </div>
            <div className="w-full bg-border-soft h-1.5 rounded-apple-pill overflow-hidden">
              <div 
                className={`h-full rounded-apple-pill ${vehicle.status === 'Active' ? 'bg-brand-teal' : 'bg-system-gray/30'}`} 
                style={{ width: vehicle.status === 'Active' ? '85%' : '0%' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-soft pt-3">
            <div className="flex items-center gap-1 text-[11px] text-ink-muted font-medium">
              <Wrench className="h-3.5 w-3.5" />
              <span>Next PM: {vehicle.maintenanceHistory[0]?.date || 'None scheduled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance / Istimara footer */}
      {complianceDoc && (
        <div className="bg-background-secondary border-t border-border-soft px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-ink-muted" />
            <span className="text-[11px] text-ink-muted font-semibold">{complianceDoc.type}</span>
          </div>
          <ComplianceCountdown expiryDate={complianceDoc.expiryDate} />
        </div>
      )}
      
      {/* Detail trigger */}
      <Link 
        href={`/light-vehicles/${vehicle.id}`}
        className="w-full py-2.5 bg-brand-teal hover:bg-[#005a5a] text-white text-center text-xs font-semibold select-none flex items-center justify-center gap-1 transition-all"
      >
        <span>View Vehicle Profile</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
