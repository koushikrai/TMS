import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricTileProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  color?: 'teal' | 'blue' | 'orange' | 'red' | 'green' | 'purple';
}

export default function MetricTile({ 
  title, 
  value, 
  suffix = "", 
  prefix = "", 
  delta, 
  deltaType = 'positive', 
  color = 'teal' 
}: MetricTileProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counterObj = { val: 0 };
      if (numRef.current) {
        gsap.to(counterObj, {
          val: value,
          duration: 1.2,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = counterObj.val.toLocaleString();
            }
          }
        });
      }
    });
    return () => ctx.revert();
  }, [value]);

  // Color mappings
  const colorMap = {
    teal: "text-brand-teal bg-brand-teal/5",
    blue: "text-brand-blue bg-brand-blue/5",
    orange: "text-system-orange bg-system-orange/5",
    red: "text-system-red bg-system-red/5",
    green: "text-system-green bg-system-green/5",
    purple: "text-system-purple bg-system-purple/5"
  };

  // Sparkline generator
  const getSparklinePath = () => {
    // Generate organic mini graph curve based on value index
    const seed = title.length;
    const p1 = 10 + (seed % 15);
    const p2 = 25 - (seed % 10);
    const p3 = 5 + (seed % 20);
    const p4 = 20 + (seed % 8);
    return `M 0,25 Q 10,${p1} 20,${p2} T 40,${p3} T 60,${p4} T 80,10`;
  };

  return (
    <div className="bg-white border border-border-soft rounded-apple-md p-5 shadow-overlay flex flex-col relative overflow-hidden group hover:shadow-product transition-all duration-300">
      
      {/* Soft color header badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-caption text-ink-muted font-medium">{title}</span>
        {delta && (
          <span className={`px-2 py-0.5 rounded-apple-pill text-[10px] font-bold flex items-center gap-0.5 ${
            deltaType === 'positive' ? 'text-system-green bg-system-green/10' :
            deltaType === 'negative' ? 'text-system-red bg-system-red/10' : 'text-system-gray bg-system-gray/10'
          }`}>
            {deltaType === 'positive' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">
            {prefix}
            <span ref={numRef}>0</span>
            {suffix}
          </span>
        </div>

        {/* Dynamic Premium Mini Sparkline */}
        <div className="w-20 h-10 select-none opacity-80 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full" viewBox="0 0 80 30">
            <path
              d={getSparklinePath()}
              fill="none"
              stroke={
                color === 'teal' ? '#006B6B' : 
                color === 'blue' ? '#0066cc' : 
                color === 'orange' ? '#ff9500' : 
                color === 'red' ? '#ff3b30' : 
                color === 'green' ? '#34c759' : '#af52de'
              }
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Subtle bottom border highlight */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${
        color === 'teal' ? 'bg-brand-teal' :
        color === 'blue' ? 'bg-brand-blue' :
        color === 'orange' ? 'bg-system-orange' :
        color === 'red' ? 'bg-system-red' :
        color === 'green' ? 'bg-system-green' : 'bg-system-purple'
      } opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
}
