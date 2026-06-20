"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitFork, Play, Plus, X, Settings, ShieldCheck, 
  HelpCircle, CheckCircle, Save, Layers, Trash2, ArrowRight
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

interface WorkflowNode {
  id: string;
  type: 'Start' | 'Approver' | 'Condition' | 'Escalation' | 'Notification' | 'End';
  label: string;
  config: {
    role?: string;
    slaTimerHours?: number;
    useSapOrg?: boolean;
    conditionField?: string;
    conditionOperator?: string;
    conditionValue?: string;
    channel?: 'Email' | 'SMS' | 'Push';
    status?: string;
  };
}

export default function WorkflowBuilder() {
  const { workflows, updateWorkflow, addToast, addAuditLog } = useTMSStore();
  const [selectedWfId, setSelectedWfId] = useState<string>("WF-001");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeWf = workflows.find(w => w.id === selectedWfId);

  // Inspector state
  const selectedNode = activeWf?.nodes.find(n => n.id === selectedNodeId);

  const handleUpdateNodeConfig = (nodeId: string, updates: any) => {
    if (!activeWf) return;
    const updatedNodes = activeWf.nodes.map(n => 
      n.id === nodeId ? { ...n, config: { ...n.config, ...updates } } : n
    );
    updateWorkflow(activeWf.id, { nodes: updatedNodes as any });
  };

  const handleSaveVersion = () => {
    if (!activeWf) return;
    const nextVer = activeWf.version + 1;
    updateWorkflow(activeWf.id, { version: nextVer, lastModified: new Date().toISOString().split('T')[0] });
    addToast({
      type: "success",
      title: "Workflow Version Saved",
      message: `Version ${nextVer} of '${activeWf.name}' has been successfully published.`
    });
    addAuditLog("Published Workflow Version", "Workflows", `Version ${nextVer} compiled successfully.`);
  };

  const handleAddNode = () => {
    if (!activeWf) return;
    const newNode: any = {
      id: `node-${Date.now()}`,
      type: "Approver",
      label: "New Review Step",
      position: { x: 300, y: 150 },
      config: { role: "FLEET_MGR", useSapOrg: true, slaTimerHours: 24 }
    };
    updateWorkflow(activeWf.id, { nodes: [...activeWf.nodes, newNode] as any });
    addToast({
      type: "info",
      title: "Node Added",
      message: "New Approver node placed on canvas. Click to configure properties."
    });
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col overflow-hidden">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Workflow Builder</h1>
          <p className="text-caption text-ink-muted mt-1">Configure automated dispatch hierarchies, SLA notifications, and cost overrides</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handleSaveVersion}
            className="h-10 px-4 bg-background-secondary border border-border-soft hover:bg-border-soft text-ink rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active"
          >
            <Save className="h-4 w-4 text-brand-teal" />
            <span>Publish Version</span>
          </button>
          <button
            onClick={handleAddNode}
            className="h-10 px-4 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold flex items-center gap-1.5 transition-all btn-press-active shadow-overlay"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step Node</span>
          </button>
        </div>
      </div>

      {/* Main split dashboard (Left List, Center Canvas, Right Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-[500px]">
        
        {/* Left Side: Workflows list (3/12) */}
        <div className="lg:col-span-3 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay space-y-4 h-[560px] overflow-y-auto">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Approval Templates</h3>
          <div className="space-y-2.5">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => {
                  setSelectedWfId(wf.id);
                  setSelectedNodeId(null);
                }}
                className={`border p-3.5 rounded-apple-md cursor-pointer hover:shadow-overlay transition-all flex flex-col justify-between ${
                  selectedWfId === wf.id ? "border-brand-teal bg-brand-teal/5 ring-1 ring-brand-teal" : "border-border-soft bg-white"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.2 bg-background-secondary rounded text-[8px] font-bold text-ink-muted uppercase">{wf.module}</span>
                    <StatusBadge status={wf.status} />
                  </div>
                  <h4 className="text-xs font-bold text-ink mt-2 leading-tight">{wf.name}</h4>
                </div>
                <div className="mt-4 flex justify-between items-center text-[9px] text-ink-muted font-medium border-t border-border-soft pt-2.5">
                  <span>Version {wf.version}</span>
                  <span>Mod: {wf.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Canvas Designer (6/12) */}
        <div className="lg:col-span-6 bg-background-secondary border border-border-soft rounded-apple-lg p-5 shadow-overlay h-[560px] flex flex-col justify-between relative overflow-hidden select-none">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            {/* Draw Dot Grid */}
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotgrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="8" cy="8" r="1.5" fill="#1d1d1f" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotgrid)" />
            </svg>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6 overflow-y-auto py-6">
            {activeWf?.nodes && activeWf.nodes.length > 0 ? (
              activeWf.nodes.map((node, idx) => {
                let border = "border-border-soft";
                let textClass = "text-ink";
                if (node.type === "Start") border = "border-system-green bg-system-green/5";
                else if (node.type === "End") border = "border-system-gray bg-system-gray/5";
                else if (node.type === "Condition") border = "border-system-orange bg-system-orange/5";
                
                const isSelected = selectedNodeId === node.id;

                return (
                  <React.Fragment key={node.id}>
                    {/* Node Visual Box */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-52 border bg-white p-4 rounded-apple-md hover:shadow-overlay transition-all cursor-pointer flex flex-col items-center text-center relative ${border} ${
                        isSelected ? "ring-2 ring-brand-teal" : ""
                      }`}
                    >
                      <span className="text-[8px] uppercase font-bold text-ink-muted leading-none mb-1.5">{node.type} node</span>
                      <h5 className="text-xs font-bold text-ink">{node.label}</h5>
                      {node.config.role && (
                        <span className="mt-1 px-1.5 py-0.2 bg-background-secondary rounded text-[9px] font-bold text-brand-teal">
                          {node.config.role}
                        </span>
                      )}
                    </div>
                    {/* SVG Connector indicator */}
                    {idx < activeWf.nodes.length - 1 && (
                      <div className="h-6 w-0.5 bg-border-hairline relative flex items-center justify-center shrink-0">
                        <ArrowRight className="h-3 w-3 text-ink-muted rotate-90" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="text-center text-ink-muted text-xs">
                <span>Blank canvas. Please click &ldquo;Add Step Node&rdquo; to begin.</span>
              </div>
            )}
          </div>

          <div className="relative z-10 border-t border-border-soft pt-3 text-[10px] text-ink-muted text-center">
            <span>Canvas View: Active Hierarchy Flow Mapping</span>
          </div>
        </div>

        {/* Right Side: Node Inspector Sheet (3/12) */}
        <div className="lg:col-span-3 bg-white border border-border-soft rounded-apple-lg p-5 shadow-overlay h-[560px] overflow-y-auto">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="flex justify-between items-center pb-2 border-b border-border-soft">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Properties Inspector</h3>
                  <button 
                    onClick={() => setSelectedNodeId(null)}
                    className="p-1 hover:bg-border-soft rounded"
                  >
                    <X className="h-4 w-4 text-ink-muted" />
                  </button>
                </div>

                {/* Node config fields */}
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-ink-muted">Step Name Label</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 bg-background-secondary border border-border-hairline rounded text-xs text-ink font-semibold focus:outline-none"
                      value={selectedNode.label}
                      onChange={(e) => {
                        if (!activeWf) return;
                        const updatedNodes = activeWf.nodes.map(n => 
                          n.id === selectedNode.id ? { ...n, label: e.target.value } : n
                        );
                        updateWorkflow(activeWf.id, { nodes: updatedNodes as any });
                      }}
                    />
                  </div>

                  {selectedNode.type === "Approver" && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-ink-muted">Assignee Group / Role</label>
                        <select
                          className="w-full px-2 py-1.5 bg-background-secondary border border-border-hairline rounded text-xs text-ink font-semibold focus:outline-none"
                          value={selectedNode.config.role || ""}
                          onChange={(e) => handleUpdateNodeConfig(selectedNode.id, { role: e.target.value })}
                        >
                          <option value="FLEET_MGR">Fleet Manager (FLEET_MGR)</option>
                          <option value="EXEC">Executive override (EXEC)</option>
                          <option value="SYS_ADMIN">System Administrator (SYS_ADMIN)</option>
                          <option value="FINANCE">Finance Accountant (FINANCE)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-ink-muted">SLA limit Timer (Hours)</label>
                        <input
                          type="number"
                          className="w-full px-2 py-1.5 bg-background-secondary border border-border-hairline rounded text-xs text-ink font-semibold focus:outline-none"
                          value={selectedNode.config.slaTimerHours || 24}
                          onChange={(e) => handleUpdateNodeConfig(selectedNode.id, { slaTimerHours: Number(e.target.value) })}
                        />
                      </div>

                      {/* SAP Org Sync override */}
                      <div className="border-t border-border-soft pt-3 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-ink leading-none">Derive from SAP Org</p>
                          <p className="text-[9px] text-ink-muted mt-1">Pulls approver hierarchy from SAP HCM.</p>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-brand-teal"
                          checked={selectedNode.config.useSapOrg || false}
                          onChange={(e) => handleUpdateNodeConfig(selectedNode.id, { useSapOrg: e.target.checked })}
                        />
                      </div>
                    </>
                  )}

                  {selectedNode.type === "Condition" && (
                    <>
                      <div className="space-y-1">
                        <label className="font-semibold text-ink-muted">Condition Field</label>
                        <select
                          className="w-full px-2 py-1.5 bg-background-secondary border border-border-hairline rounded text-xs text-ink font-semibold focus:outline-none"
                          value={selectedNode.config.conditionField || ""}
                          onChange={(e) => handleUpdateNodeConfig(selectedNode.id, { conditionField: e.target.value })}
                        >
                          <option value="request.grade">Employee Grade (request.grade)</option>
                          <option value="vehicle.ownership">Ownership Code (vehicle.ownership)</option>
                          <option value="estimatedCost">Estimated Cost threshold</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-ink-muted">Condition Value</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1.5 bg-background-secondary border border-border-hairline rounded text-xs text-ink font-semibold focus:outline-none"
                          value={selectedNode.config.conditionValue || ""}
                          onChange={(e) => handleUpdateNodeConfig(selectedNode.id, { conditionValue: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-ink-muted text-xs gap-2">
                <Settings className="h-8 w-8 text-ink-muted animate-spin" style={{ animationDuration: '6s' }} />
                <span>Select a canvas node step to inspect and configure properties.</span>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
