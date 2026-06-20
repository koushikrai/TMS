"use client";

import React, { useState } from "react";
import { useTMSStore } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Users, Server, FileText, Clock, ShieldCheck, 
  RefreshCw, CheckCircle, AlertTriangle, HelpCircle, Save, Plus, ArrowRight, Play
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

type SettingsTab = 'rbac' | 'integrations' | 'notifications' | 'audit';

export default function SettingsPage() {
  const { auditLogs, addToast, addAuditLog } = useTMSStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('rbac');

  // Integrations states
  const [testingId, setTestingId] = useState<string | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, 'Connected' | 'Error' | 'Idle'>>({
    sap: 'Connected', gps: 'Connected', biometric: 'Idle', fuel: 'Idle', regulatory: 'Idle', middleware: 'Idle'
  });

  // Notification Template states
  const [selectedEvent, setSelectedEvent] = useState("Vehicle Request Approved");
  const [smsTemplate, setSmsTemplate] = useState("Dear {{employee.name}}, your light vehicle request for vehicle {{vehicle.plate}} has been approved. Dispatch scheduled.");

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setIntegrationStatus(prev => ({ ...prev, [id]: 'Connected' }));
      addToast({
        type: "success",
        title: "Integration Online",
        message: `API handshake with ${name} completed with 0 errors.`
      });
      addAuditLog("Tested API Connection", "Settings", `Integration ${name} test succeeded.`);
    }, 1200);
  };

  const handleSaveTemplate = () => {
    addToast({
      type: "success",
      title: "Notification Template Saved",
      message: "Template changes updated in the messaging engine."
    });
  };

  // RBAC grid metadata
  const rbacMatrix = [
    { role: "Executive (EXEC)", dash: "Read", lv: "Read", bus: "Read", heavy: "Read", work: "None", logs: "Read" },
    { role: "Fleet Manager (FLEET_MGR)", dash: "Admin", lv: "Admin", bus: "Admin", heavy: "Admin", work: "None", logs: "Read" },
    { role: "Finance (FINANCE)", dash: "Read", lv: "Read", bus: "Read", heavy: "Read", work: "None", logs: "Read" },
    { role: "System Admin (SYS_ADMIN)", dash: "Admin", lv: "Admin", bus: "Admin", heavy: "Admin", work: "Admin", logs: "Admin" },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-display-md text-ink font-semibold tracking-tight text-apple-tight">Settings & Config</h1>
        <p className="text-caption text-ink-muted mt-1">Configure user permissions, monitor system integrations, edit notification templates, and view audit logs</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border-soft space-x-6 select-none overflow-x-auto" role="tablist" aria-label="Settings options">
        {(['rbac', 'integrations', 'notifications', 'audit'] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-caption font-semibold relative transition-all capitalize whitespace-nowrap ${
              activeTab === tab ? "text-brand-teal" : "text-ink-muted hover:text-ink"
            }`}
          >
            <span>{tab === 'rbac' ? 'RBAC Matrix' : (tab === 'integrations' ? 'API Integrations' : (tab === 'notifications' ? 'Alert Templates' : 'System Audit Log'))}</span>
            {activeTab === tab && (
              <motion.div 
                layoutId="settingsTabIndicator" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      <div className="bg-white border border-border-soft rounded-apple-lg p-6 shadow-overlay">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: RBAC Matrix */}
          {activeTab === 'rbac' && (
            <motion.div
              key="rbac"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-caption-strong font-semibold text-ink">Role-Based Access Control (RBAC) Matrix</h3>
              <div className="overflow-x-auto border border-border-soft rounded-apple-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-soft text-ink-muted font-medium text-[10px] uppercase">
                      <th className="p-3">User Role</th>
                      <th className="p-3">Dashboard</th>
                      <th className="p-3">Light Vehicles</th>
                      <th className="p-3">Buses & Transport</th>
                      <th className="p-3">Heavy Equipment</th>
                      <th className="p-3">Workflows</th>
                      <th className="p-3">System Logs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft text-ink font-semibold">
                    {rbacMatrix.map((row) => (
                      <tr key={row.role} className="hover:bg-background-secondary transition-all">
                        <td className="p-3 font-bold text-ink">{row.role}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.dash === 'Admin' ? 'text-system-green bg-system-green/10' : row.dash === 'Read' ? 'text-brand-blue bg-brand-blue/10' : 'text-ink-muted'}`}>{row.dash}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.lv === 'Admin' ? 'text-system-green bg-system-green/10' : row.lv === 'Read' ? 'text-brand-blue bg-brand-blue/10' : 'text-ink-muted'}`}>{row.lv}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.bus === 'Admin' ? 'text-system-green bg-system-green/10' : row.bus === 'Read' ? 'text-brand-blue bg-brand-blue/10' : 'text-ink-muted'}`}>{row.bus}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.heavy === 'Admin' ? 'text-system-green bg-system-green/10' : row.heavy === 'Read' ? 'text-brand-blue bg-brand-blue/10' : 'text-ink-muted'}`}>{row.heavy}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.work === 'Admin' ? 'text-system-green bg-system-green/10' : 'text-ink-muted'}`}>{row.work}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase ${row.logs === 'Admin' ? 'text-system-green bg-system-green/10' : row.logs === 'Read' ? 'text-brand-blue bg-brand-blue/10' : 'text-ink-muted'}`}>{row.logs}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: API Integrations */}
          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <h3 className="text-caption-strong font-semibold text-ink">External Systems Connection Board</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Integration Card 1 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">ERP Connector</span>
                    <h4 className="text-xs font-bold text-ink mt-2">SAP S/4HANA Sync</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Synchronizes equipment masters, employee files, and cross-charge cross-checks.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-system-green animate-pulse" />
                      <span className="text-[10px] text-system-green font-bold uppercase">Online Connected</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('sap', 'SAP S/4HANA')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'sap' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Test Connection</span>
                  </button>
                </div>

                {/* Integration Card 2 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">GPS Telemetry Provider</span>
                    <h4 className="text-xs font-bold text-ink mt-2">Saudi Ex GPS Telemetry</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Pulls vehicle coordinates, geofence breaches, and odometer speed records.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-system-green animate-pulse" />
                      <span className="text-[10px] text-system-green font-bold uppercase">Online Connected</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('gps', 'Saudi Ex GPS')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'gps' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Test Connection</span>
                  </button>
                </div>

                {/* Integration Card 3 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">Attendance System</span>
                    <h4 className="text-xs font-bold text-ink mt-2">ZKT Biotime Device Integration</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Tracks driver attendance, shift times, and automatic schedule exclusions.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${integrationStatus.biometric === 'Connected' ? 'bg-system-green' : 'bg-system-orange'} animate-pulse`} />
                      <span className={`text-[10px] ${integrationStatus.biometric === 'Connected' ? 'text-system-green' : 'text-system-orange'} font-bold uppercase`}>
                        {integrationStatus.biometric === 'Connected' ? 'Online Connected' : 'Integration Pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('biometric', 'ZKT Biotime Attendance')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'biometric' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Set Up Sync</span>
                  </button>
                </div>

                {/* Integration Card 4 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">Fuel Card Manager</span>
                    <h4 className="text-xs font-bold text-ink mt-2">Petro APP Fuel Integration</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Pulls live fuel usage, digital card logs, and cost anomalies per asset.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${integrationStatus.fuel === 'Connected' ? 'bg-system-green' : 'bg-system-orange'} animate-pulse`} />
                      <span className={`text-[10px] ${integrationStatus.fuel === 'Connected' ? 'text-system-green' : 'text-system-orange'} font-bold uppercase`}>
                        {integrationStatus.fuel === 'Connected' ? 'Online Connected' : 'Integration Pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('fuel', 'Petro APP')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'fuel' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Set Up Sync</span>
                  </button>
                </div>

                {/* Integration Card 5 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">Regulatory Authority</span>
                    <h4 className="text-xs font-bold text-ink mt-2">KSA Naql & MIZAN Gateway</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Validates vehicle operating cards, TAMM status, and load dimensions.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${integrationStatus.regulatory === 'Connected' ? 'bg-system-green' : 'bg-system-orange'} animate-pulse`} />
                      <span className={`text-[10px] ${integrationStatus.regulatory === 'Connected' ? 'text-system-green' : 'text-system-orange'} font-bold uppercase`}>
                        {integrationStatus.regulatory === 'Connected' ? 'Online Connected' : 'Integration Pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('regulatory', 'Naql / MIZAN Gateway')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'regulatory' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Set Up Sync</span>
                  </button>
                </div>

                {/* Integration Card 6 */}
                <div className="border border-border-soft rounded-apple-md p-4 bg-background-secondary flex justify-between items-center hover:shadow-overlay transition-all">
                  <div>
                    <span className="text-[10px] text-ink-muted font-bold uppercase leading-none">SAP S/4HANA Middleware</span>
                    <h4 className="text-xs font-bold text-ink mt-2">SAP CPI Integration Monitor</h4>
                    <p className="text-[10px] text-ink-muted mt-1 leading-normal">Handles API routing errors, data mapping reconciliations, and retry buffers.</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${integrationStatus.middleware === 'Connected' ? 'bg-system-green' : 'bg-system-orange'} animate-pulse`} />
                      <span className={`text-[10px] ${integrationStatus.middleware === 'Connected' ? 'text-system-green' : 'text-system-orange'} font-bold uppercase`}>
                        {integrationStatus.middleware === 'Connected' ? 'Online Connected' : 'Integration Pending'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestConnection('middleware', 'SAP CPI Middleware')}
                    className="px-3.5 py-1.5 border border-border-hairline rounded-apple-pill text-xs font-semibold hover:bg-white text-ink transition-all flex items-center gap-1 shrink-0"
                  >
                    {testingId === 'middleware' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    <span>Set Up Sync</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: Alert Templates */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Form (2/3) */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-caption-strong font-semibold text-ink">Alert Templates Composer</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">Target Operational Event</label>
                  <select
                    className="w-full px-3 py-2 bg-background-secondary border border-border-hairline rounded-apple-sm text-xs focus:outline-none text-ink font-semibold"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    <option value="Vehicle Request Approved">Vehicle Request Approved Notification</option>
                    <option value="Geofence Breach Warning">Geofence Restricted Breach Warning</option>
                    <option value="Document Expiry Alert">Compliance Expiry Alert</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-ink">SMS/Push Template Text</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-border-hairline rounded-apple-sm text-xs focus:outline-none text-ink font-semibold placeholder:text-ink-muted/50 leading-relaxed"
                    value={smsTemplate}
                    onChange={(e) => setSmsTemplate(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="px-5 py-2.5 bg-brand-teal text-white hover:bg-[#005a5a] rounded-apple-pill text-xs font-semibold transition-all btn-press-active shadow-overlay"
                >
                  Save Notification Rule
                </button>
              </div>

              {/* Variables Palette (1/3) */}
              <div className="bg-background-secondary border border-border-soft rounded-apple-md p-4">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Variables Palette</h4>
                <p className="text-[10px] text-ink-muted mb-4 leading-normal">
                  Incorporate these tags into the composers text box to display dynamic values.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2 border border-border-soft bg-white rounded cursor-pointer hover:border-brand-teal transition-all font-mono text-[10px] font-bold">
                    {"{{employee.name}}"}
                  </div>
                  <div className="p-2 border border-border-soft bg-white rounded cursor-pointer hover:border-brand-teal transition-all font-mono text-[10px] font-bold">
                    {"{{vehicle.plate}}"}
                  </div>
                  <div className="p-2 border border-border-soft bg-white rounded cursor-pointer hover:border-brand-teal transition-all font-mono text-[10px] font-bold">
                    {"{{expiry.date}}"}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: System Audit Log */}
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="text-caption-strong font-semibold text-ink font-display">System Audit Log</h3>
              
              <div className="overflow-x-auto border border-border-soft rounded-apple-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-background-secondary border-b border-border-soft text-ink-muted font-medium uppercase tracking-wider text-[9px]">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">Action Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft text-ink font-semibold">
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-background-secondary transition-all">
                        <td className="p-3 text-[10px] text-ink-muted font-mono">{log.timestamp.split("T")[0]} {log.timestamp.split("T")[1]?.slice(0, 8)}</td>
                        <td className="p-3">{log.user}</td>
                        <td className="p-3 uppercase text-brand-teal">{log.role}</td>
                        <td className="p-3">{log.module}</td>
                        <td className="p-3 text-ink-muted">{log.action} - {log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
