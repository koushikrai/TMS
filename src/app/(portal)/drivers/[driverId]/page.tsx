"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";
import ComplianceCountdown from "@/components/ui/ComplianceCountdown";
import { 
  AlertTriangle, Users, Calendar, ShieldCheck, DollarSign, Award, 
  MapPin, Clock, ArrowLeft, Send, MessageSquare, Truck, ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

type DriverTab = 'documents' | 'vehicles' | 'trips' | 'performance' | 'chat';

// GSAP CountDown helper
function DaysRemainingCounter({ days }: { days: number }) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      if (countRef.current) {
        gsap.to(obj, {
          val: days,
          duration: 1.2,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = obj.val.toString();
            }
          }
        });
      }
    });
    return () => ctx.revert();
  }, [days]);

  return <span ref={countRef} className="font-bold text-system-orange">0</span>;
}

export default function DriverProfilePage() {
  const params = useParams();
  const driverId = params?.driverId as string;
  const { drivers, requests, addToast } = useTMSStore();
  const [activeTab, setActiveTab] = useState<DriverTab>('documents');
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: "m-1", sender: "Manager", text: "Please confirm departure for SADARA project trip REQ-1002.", time: "12:00 PM" },
    { id: "m-2", sender: "Driver", text: "Departure confirmed, en route. Maps aligned.", time: "12:05 PM" }
  ]);

  const driver = drivers.find(d => d.id === driverId);

  if (!driver) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-3">
        <AlertTriangle className="h-8 w-8 text-system-red animate-bounce" />
        <p className="text-caption text-ink font-semibold">Driver Record Not Found</p>
        <Link href="/drivers" className="text-xs text-brand-teal font-bold hover:underline">
          Return to directory
        </Link>
      </div>
    );
  }

  // Calculate remaining days for License
  const today = new Date();
  const licExpiry = new Date(driver.licenseExpiry);
  const diffDays = Math.ceil((licExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText) return;
    
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "Manager",
      text: messageText,
      time: "Just Now"
    };

    setChatMessages([...chatMessages, newMsg]);
    setMessageText("");
    addToast({
      type: "success",
      title: "Message Dispatched",
      message: "Push notification routed to driver's mobile console."
    });
  };

  const driverTrips = requests.filter(r => r.assignedDriverId === driver.id);

  return (
    <div className="space-y-6">
      
      {/* Back link */}
      <Link href="/drivers" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-all">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Driver Directory</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column sidebar (4/12) */}
        <div className="lg:col-span-4 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-3xl mb-4 border border-border-soft">
              {driver.name.charAt(0)}
            </div>
            <StatusBadge status={driver.status} />
            <h2 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight mt-3">
              {driver.name}
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">{driver.type} Driver · SAP ID {driver.sapEmployeeNo}</p>
          </div>

          <div className="border-t border-border-soft pt-4 space-y-3.5 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted">Email Contact</span>
              <span className="font-semibold text-ink select-all">d.{driver.sapEmployeeNo.toLowerCase()}@expertise.com.sa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Phone Number</span>
              <span className="font-semibold text-ink select-all">+966 50 123 4567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">License Class</span>
              <span className="font-semibold text-ink">{driver.licenseCategory}</span>
            </div>
            {driver.currentAssignment && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Assigned Truck</span>
                <span className="font-semibold text-brand-blue">{driver.currentAssignment.vehicleId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center column tab menus (8/12) */}
        <div className="lg:col-span-8 bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay space-y-6">
          
          <div className="flex border-b border-border-soft space-x-6 select-none overflow-x-auto" role="tablist" aria-label="Driver profile tabs">
            {(['documents', 'vehicles', 'trips', 'performance', 'chat'] as const).map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-caption font-semibold relative transition-all capitalize whitespace-nowrap ${
                  activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
                }`}
              >
                <span>{tab === 'chat' ? 'In-App Messaging' : tab}</span>
                {activeTab === tab && (
                  <motion.div 
                    layoutId="driverTabIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[340px]">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Documents */}
              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Licensing & Credentials Checklist</h3>
                  
                  {diffDays > 0 && diffDays < 30 && (
                    <div className="bg-system-orange/10 border border-system-orange/30 p-4 rounded-apple-sm text-xs text-system-orange flex gap-2 items-start">
                      <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-ink">Attention: License renewal alert</p>
                        <p className="text-ink-muted mt-1 leading-normal">
                          Driver&apos;s license expires in <DaysRemainingCounter days={diffDays} /> days. Please coordinate with HR.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-ink-muted uppercase font-bold">KSA Driver License</span>
                        <p className="text-xs font-semibold text-ink mt-1">Ref: {driver.licenseNumber}</p>
                      </div>
                      <ComplianceCountdown expiryDate={driver.licenseExpiry} />
                    </div>

                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-ink-muted uppercase font-bold">Iqama National ID Card</span>
                        <p className="text-xs font-semibold text-ink mt-1">Ref: {driver.iqamaNumber}</p>
                      </div>
                      <ComplianceCountdown expiryDate={driver.iqamaExpiry} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Vehicles */}
              {activeTab === 'vehicles' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Assigned Vehicles History</h3>
                  <div className="relative pl-6 border-l border-border-soft space-y-5 py-1">
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1.5 h-2 w-2 rounded-full bg-brand-teal" />
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-brand-teal" />
                        <span className="text-xs font-semibold text-ink">Volvo Truck FH16 (Plate 1025 CAB)</span>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-1 leading-none">Active dispatch duty: Jan 2026 - Present</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[30px] top-1.5 h-2 w-2 rounded-full bg-system-gray" />
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-ink-muted" />
                        <span className="text-xs font-semibold text-ink">Toyota Pickup Hilux (Plate 9988 KSA)</span>
                      </div>
                      <p className="text-[10px] text-ink-muted mt-1 leading-none">Sept 2025 - Dec 2025</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Trips */}
              {activeTab === 'trips' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink">Trip logs</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border-soft text-ink-muted font-medium">
                          <th className="py-2.5">Trip ID</th>
                          <th className="py-2.5">Origin / Destination</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-soft text-ink font-medium">
                        {driverTrips.map((tr) => (
                          <tr key={tr.id} className="hover:bg-background-secondary transition-all">
                            <td className="py-3 font-mono text-brand-teal">{tr.id}</td>
                            <td className="py-3 truncate max-w-44">{tr.pickupLocation.name} &rarr; {tr.dropLocation?.name || "Yard"}</td>
                            <td className="py-3">{tr.scheduledDate}</td>
                            <td className="py-3 text-right"><StatusBadge status={tr.status} /></td>
                          </tr>
                        ))}
                        {driverTrips.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-ink-muted">No trip dispatches logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Performance */}
              {activeTab === 'performance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-caption-strong font-semibold text-ink font-display">Safety & Performance Metrics</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">Safety Score</span>
                      <p className="text-display-md text-system-green font-semibold mt-2">{driver.performanceScore}%</p>
                    </div>
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">On-Time Arrival</span>
                      <p className="text-display-md text-brand-teal font-semibold mt-2">97.8%</p>
                    </div>
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">Speed Limits Exceeded</span>
                      <p className="text-display-md text-system-red font-semibold mt-2">1</p>
                    </div>
                    <div className="bg-background-secondary border border-border-soft p-4 rounded-apple-md">
                      <span className="text-[10px] text-ink-muted uppercase font-bold">Active Hours</span>
                      <p className="text-display-md text-ink font-semibold mt-2">168 hrs</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: Chat */}
              {activeTab === 'chat' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-[340px]"
                >
                  {/* Messages Feed */}
                  <div className="flex-1 bg-background-secondary border border-border-soft rounded-apple-md p-4 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-[80%] ${
                          msg.sender === "Manager" ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                      >
                        <span className="text-[9px] text-ink-muted mb-0.5">{msg.sender} · {msg.time}</span>
                        <div className={`px-3 py-2 rounded-apple-sm text-xs leading-normal ${
                          msg.sender === "Manager" ? "bg-brand-teal text-white" : "bg-white border border-border-soft text-ink"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Send Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type operational instruction..."
                      className="flex-1 px-4 py-2 border border-border-soft rounded-apple-pill text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal text-ink bg-white"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="h-9 w-9 bg-brand-teal text-white hover:bg-[#005a5a] rounded-full flex items-center justify-center btn-press-active transition-all shrink-0 shadow-overlay"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
