"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, BarChart2, DollarSign, Wrench, AlertTriangle, 
  Sparkles, CheckCircle, ArrowUpRight, Zap
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function PredictiveAnalyticsPage() {
  // Predictive maintenance trend data
  const trendData = [
    { month: "Jan", actualCost: 34000, predictedCost: 32000, fleetHealth: 94 },
    { month: "Feb", actualCost: 38000, predictedCost: 36000, fleetHealth: 92 },
    { month: "Mar", actualCost: 42000, predictedCost: 41000, fleetHealth: 90 },
    { month: "Apr", actualCost: 45000, predictedCost: 44000, fleetHealth: 88 },
    { month: "May", actualCost: 51000, predictedCost: 49000, fleetHealth: 85 },
    { month: "Jun", actualCost: 58000, predictedCost: 56000, fleetHealth: 82 },
    { month: "Jul (Est)", actualCost: 65000, predictedCost: 63000, fleetHealth: 79 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Banner */}
      <div className="bg-white rounded-apple-xl border border-border-soft p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-apple-pill bg-brand-teal/10 text-brand-teal text-xs font-mono font-bold">
              POC Item #91 &amp; #109
            </span>
            <span className="text-xs text-brand-blue font-semibold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Machine Learning Cost Predictor
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-ink mt-1">Predictive Analytics &amp; Asset Maintenance Trend Forecasting</h1>
          <p className="text-caption text-ink-muted">
            Predictive breakdown probabilities, maintenance cost trajectory modeling, demand forecasting, and automated fleet right-sizing recommendations.
          </p>
        </div>

        <button className="px-4 py-2 bg-brand-teal text-white rounded-apple-md text-xs font-semibold hover:bg-brand-teal/90 transition-all flex items-center gap-2 shadow-sm">
          <Zap className="h-4 w-4" /> Run ML Predictive Model
        </button>
      </div>

      {/* Predictive Chart */}
      <div className="bg-white p-6 rounded-apple-lg border border-border-soft shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border-soft pb-3">
          <div>
            <h3 className="text-base font-semibold text-ink">Maintenance Expenditure Trajectory &amp; Fleet Health Prediction</h3>
            <p className="text-xs text-ink-muted">Comparing actual SAP PM costs with ML predicted maintenance curves</p>
          </div>
          <span className="text-xs font-mono bg-brand-teal/10 text-brand-teal px-2.5 py-1 rounded-apple-pill font-bold">
            94.8% ML Accuracy
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actualCost" name="Actual SAP PM Cost (SAR)" stroke="#0066cc" strokeWidth={3} />
              <Line type="monotone" dataKey="predictedCost" name="ML Predicted Cost (SAR)" stroke="#008080" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Replacement Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-border-soft rounded-apple-md shadow-sm space-y-2">
          <span className="text-xs font-bold text-system-red bg-system-red/10 px-2 py-0.5 rounded">High Replacement Risk</span>
          <h4 className="text-sm font-bold text-ink">LV-03 (Ford Explorer 2019)</h4>
          <p className="text-xs text-ink-muted">Projected repair cost (SAR 32,000) exceeds residual asset value (SAR 28,000).</p>
          <span className="text-xs text-system-red font-semibold block">Action: Initiate Auction / Decommission</span>
        </div>

        <div className="p-5 bg-white border border-border-soft rounded-apple-md shadow-sm space-y-2">
          <span className="text-xs font-bold text-system-orange bg-system-orange/10 px-2 py-0.5 rounded">Preventive Overhaul Due</span>
          <h4 className="text-sm font-bold text-ink">HV-04 (Tadano Crane 60T)</h4>
          <p className="text-xs text-ink-muted">Hydraulic pump wear index reached 88%. Overhaul recommended in next 25 operating hours.</p>
          <span className="text-xs text-brand-teal font-semibold block">Action: Schedule SAP PM Service Order</span>
        </div>

        <div className="p-5 bg-white border border-border-soft rounded-apple-md shadow-sm space-y-2">
          <span className="text-xs font-bold text-system-green bg-system-green/10 px-2 py-0.5 rounded">Optimal Performance</span>
          <h4 className="text-sm font-bold text-ink">BUS-01 (Mercedes Travego)</h4>
          <p className="text-xs text-ink-muted">Operating cost per kilometer (SAR 0.38/km) is 15% below fleet average.</p>
          <span className="text-xs text-system-green font-semibold block">Action: Retain in Shift A Service</span>
        </div>
      </div>

    </div>
  );
}
