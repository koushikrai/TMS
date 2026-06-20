import React from "react";
import { TransportRequest } from "@/lib/types";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { MapPin, Compass, Navigation, Clock, User } from "lucide-react";

interface TripCardProps {
  request: TransportRequest;
}

export default function TripCard({ request }: TripCardProps) {
  const isInTransit = request.status === 'InProgress';

  return (
    <div className="bg-white border border-border-soft rounded-apple-md p-5 shadow-overlay hover:shadow-product transition-all flex flex-col relative overflow-hidden group">
      
      {/* Header and pulsing status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isInTransit && (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-2.5 w-2.5 bg-system-green rounded-full shrink-0"
            />
          )}
          <span className="text-caption-strong font-bold text-ink uppercase tracking-tight">{request.id}</span>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Locations and path */}
      <div className="relative pl-6 space-y-4 mb-4 border-l-2 border-border-soft border-dashed ml-3">
        {/* Pickup Pin */}
        <div className="relative">
          <span className="absolute -left-[23px] top-0.5 bg-white border-2 border-brand-teal h-4 w-4 rounded-full flex items-center justify-center">
            <span className="h-1.5 w-1.5 bg-brand-teal rounded-full" />
          </span>
          <p className="text-[10px] text-ink-muted uppercase leading-none font-medium">Origin</p>
          <p className="text-xs font-semibold text-ink mt-1 truncate">{request.pickupLocation.name}</p>
        </div>
        
        {/* Dropoff Pin */}
        {request.dropLocation && (
          <div className="relative">
            <span className="absolute -left-[23px] top-0.5 bg-white border-2 border-brand-blue h-4 w-4 rounded-full flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-brand-blue rounded-full" />
            </span>
            <p className="text-[10px] text-ink-muted uppercase leading-none font-medium">Destination</p>
            <p className="text-xs font-semibold text-ink mt-1 truncate">{request.dropLocation.name}</p>
          </div>
        )}
      </div>

      {/* Details footer */}
      <div className="grid grid-cols-2 gap-3 border-t border-border-soft pt-3 text-[11px] text-ink-muted font-medium mt-auto">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{request.requestorName}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{request.scheduledDate}</span>
        </div>
        {request.assignedVehicleId && (
          <div className="flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            <span>Veh: {request.assignedVehicleId}</span>
          </div>
        )}
        {request.estimatedCost && (
          <div className="flex items-center gap-1.5 justify-end text-brand-teal font-semibold">
            <span>{request.estimatedCost} SAR</span>
          </div>
        )}
      </div>
      
    </div>
  );
}
