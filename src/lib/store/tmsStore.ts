import { create } from 'zustand';
import { 
  Vehicle, Driver, TransportRequest, Violation, Route, 
  Vendor, RateCard, WorkflowDefinition, SystemAuditLog, Toast
} from '../types';
import { generateSeedData } from '../seed/dataGenerator';

export type UserRole = 'EXEC' | 'TRANS_ADMIN' | 'FLEET_MGR' | 'DRIVER' | 'HR_DEPT' | 'FINANCE' | 'SYS_ADMIN';

export interface UserProfile {
  name: string;
  email: string;
  sapEmployeeNo: string;
  role: UserRole;
  avatar?: string;
}

interface TMSState {
  currentRole: UserRole | null;
  currentUser: UserProfile | null;
  vehicles: Vehicle[];
  drivers: Driver[];
  requests: TransportRequest[];
  violations: Violation[];
  routes: Route[];
  vendors: Vendor[];
  rateCards: RateCard[];
  workflows: WorkflowDefinition[];
  auditLogs: SystemAuditLog[];
  toasts: Toast[];
  initialized: boolean;
  
  // Actions
  initializeStore: () => Promise<void>;
  setRole: (role: UserRole | null) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  
  // Requests actions
  addRequest: (req: Omit<TransportRequest, 'id' | 'status' | 'approvalChain' | 'requestorName'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<TransportRequest>) => Promise<void>;
  
  // Vehicle actions
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  
  // Driver actions
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  
  // Violation actions
  addViolation: (violation: Omit<Violation, 'id' | 'status' | 'lifecycle'>) => Promise<void>;
  updateViolation: (id: string, updates: Partial<Violation>) => Promise<void>;
  
  // Workflow actions
  addWorkflow: (wf: WorkflowDefinition) => Promise<void>;
  updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => Promise<void>;
  
  // Toast notifications
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Logs
  addAuditLog: (action: string, module: string, details: string) => Promise<void>;
}

const initialSeed = generateSeedData();

const roleUsers: Record<UserRole, UserProfile> = {
  EXEC: { name: "Ahmed Al-Nasser", email: "a.nasser@expertise.com.sa", sapEmployeeNo: "EMP-1001", role: "EXEC" },
  TRANS_ADMIN: { name: "Saleh Al-Omari", email: "s.omari@expertise.com.sa", sapEmployeeNo: "EMP-1005", role: "TRANS_ADMIN" },
  FLEET_MGR: { name: "Fahad Al-Qahtani", email: "f.qahtani@expertise.com.sa", sapEmployeeNo: "EMP-1002", role: "FLEET_MGR" },
  DRIVER: { name: "Sultan Al-Otaibi", email: "s.otaibi@expertise.com.sa", sapEmployeeNo: "EMP-20101", role: "DRIVER" },
  HR_DEPT: { name: "Ali Al-Sudairy", email: "a.sudairy@expertise.com.sa", sapEmployeeNo: "EMP-1004", role: "HR_DEPT" },
  FINANCE: { name: "Junaid Siddiqui", email: "j.siddiqui@expertise.com.sa", sapEmployeeNo: "EMP-1012", role: "FINANCE" },
  SYS_ADMIN: { name: "Yousef Al-Harbi", email: "y.harbi@expertise.com.sa", sapEmployeeNo: "EMP-1003", role: "SYS_ADMIN" }
};

export const useTMSStore = create<TMSState>((set, get) => ({
  currentRole: null,
  currentUser: null,
  vehicles: initialSeed.vehicles,
  drivers: initialSeed.drivers,
  requests: initialSeed.requests,
  violations: initialSeed.violations,
  routes: initialSeed.routes,
  vendors: initialSeed.vendors,
  rateCards: initialSeed.rateCards,
  workflows: initialSeed.workflows,
  auditLogs: initialSeed.auditLogs,
  toasts: [],
  initialized: false,

  initializeStore: async () => {
    // Avoid double initialization
    if (get().initialized) return;

    try {
      const [
        vehRes, drvRes, reqRes, vioRes, routesRes, 
        vendorsRes, ratesRes, workflowsRes, logsRes
      ] = await Promise.all([
        fetch("/api/vehicles").then(r => r.ok ? r.json() : null),
        fetch("/api/drivers").then(r => r.ok ? r.json() : null),
        fetch("/api/requests").then(r => r.ok ? r.json() : null),
        fetch("/api/violations").then(r => r.ok ? r.json() : null),
        fetch("/api/master-data?type=routes").then(r => r.ok ? r.json() : null),
        fetch("/api/vendors?type=vendors").then(r => r.ok ? r.json() : null),
        fetch("/api/vendors?type=rate-cards").then(r => r.ok ? r.json() : null),
        fetch("/api/workflows").then(r => r.ok ? r.json() : null),
        fetch("/api/audit-logs").then(r => r.ok ? r.json() : null),
      ]);

      set({
        vehicles: vehRes || initialSeed.vehicles,
        drivers: drvRes || initialSeed.drivers,
        requests: reqRes || initialSeed.requests,
        violations: vioRes || initialSeed.violations,
        routes: routesRes || initialSeed.routes,
        vendors: vendorsRes || initialSeed.vendors,
        rateCards: ratesRes || initialSeed.rateCards,
        workflows: workflowsRes || initialSeed.workflows,
        auditLogs: logsRes || initialSeed.auditLogs,
        initialized: true,
      });
    } catch (e) {
      console.warn("Store API hydration failed, using fallback seed data:", e.message);
      set({
        vehicles: initialSeed.vehicles,
        drivers: initialSeed.drivers,
        requests: initialSeed.requests,
        violations: initialSeed.violations,
        routes: initialSeed.routes,
        vendors: initialSeed.vendors,
        rateCards: initialSeed.rateCards,
        workflows: initialSeed.workflows,
        auditLogs: initialSeed.auditLogs,
        initialized: true,
      });
    }
  },

  setRole: (role) => set((state) => {
    const user = role ? roleUsers[role] : null;
    return { 
      currentRole: role, 
      currentUser: user 
    };
  }),

  setCurrentUser: (user) => set({ currentUser: user, currentRole: user ? user.role : null }),

  addRequest: async (req) => {
    const newReq: TransportRequest = {
      ...req,
      requestorName: get().currentUser?.name || "Guest User",
      id: `REQ-${1000 + get().requests.length + 1}`,
      status: 'Submitted',
      approvalChain: [
        { role: "Fleet Supervisor", status: 'Pending' }
      ]
    };
    
    // Optimistically update frontend
    set((state) => ({ requests: [newReq, ...state.requests] }));

    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReq)
      });
    } catch (err) {
      console.warn("API addRequest failed, kept in-memory:", err.message);
    }
  },

  updateRequest: async (id, updates) => {
    set((state) => ({
      requests: state.requests.map((r) => r.id === id ? { ...r, ...updates } : r)
    }));

    try {
      const existing = get().requests.find(r => r.id === id);
      if (existing) {
        await fetch("/api/requests", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, ...updates })
        });
      }
    } catch (err) {
      console.warn("API updateRequest failed:", err.message);
    }
  },

  addVehicle: async (vehicle) => {
    set((state) => ({
      vehicles: [vehicle, ...state.vehicles]
    }));

    try {
      await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle)
      });
    } catch (err) {
      console.warn("API addVehicle failed:", err.message);
    }
  },

  updateVehicle: async (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...updates } : v)
    }));

    try {
      await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.warn("API updateVehicle failed:", err.message);
    }
  },

  updateDriver: async (id, updates) => {
    set((state) => ({
      drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updates } : d)
    }));

    try {
      await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates })
      });
    } catch (err) {
      console.warn("API updateDriver failed:", err.message);
    }
  },

  addViolation: async (violation) => {
    const newVio: Violation = {
      ...violation,
      id: `VIO-50${get().violations.length + 1}`,
      status: 'Reported',
      lifecycle: [
        { status: 'Reported', updatedBy: get().currentUser?.name || "System", updatedAt: new Date().toISOString(), comments: "Violation recorded." }
      ]
    };
    
    set((state) => ({
      violations: [newVio, ...state.violations]
    }));

    try {
      await fetch("/api/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVio)
      });
    } catch (err) {
      console.warn("API addViolation failed:", err.message);
    }
  },

  updateViolation: async (id, updates) => {
    set((state) => ({
      violations: state.violations.map((v) => v.id === id ? { ...v, ...updates } : v)
    }));

    try {
      await fetch("/api/violations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates })
      });
    } catch (err) {
      console.warn("API updateViolation failed:", err.message);
    }
  },

  addWorkflow: async (wf) => {
    set((state) => ({
      workflows: [wf, ...state.workflows]
    }));

    try {
      await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wf)
      });
    } catch (err) {
      console.warn("API addWorkflow failed:", err.message);
    }
  },

  updateWorkflow: async (id, updates) => {
    set((state) => ({
      workflows: state.workflows.map((w) => w.id === id ? { ...w, ...updates } : w)
    }));

    try {
      const existing = get().workflows.find(w => w.id === id);
      if (existing) {
        await fetch("/api/workflows", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, ...updates })
        });
      }
    } catch (err) {
      console.warn("API updateWorkflow failed:", err.message);
    }
  },

  addToast: (toast) => set((state) => {
    const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    return { toasts: [...state.toasts, newToast] };
  }),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  addAuditLog: async (action, module, details) => {
    const newLog: SystemAuditLog = {
      id: `AUD-${1000 + get().auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: get().currentUser?.name || "Guest System",
      role: get().currentRole || "SYS_ADMIN",
      module,
      action,
      details
    };
    
    set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));

    try {
      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog)
      });
    } catch (err) {
      console.warn("API addAuditLog failed:", err.message);
    }
  }
}));
