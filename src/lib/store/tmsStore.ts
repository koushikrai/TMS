import { create } from 'zustand';
import { 
  Vehicle, Driver, TransportRequest, Violation, Route, 
  Vendor, RateCard, WorkflowDefinition, SystemAuditLog
} from '../types';
import { generateSeedData } from '../seed/dataGenerator';

export interface Toast {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
}

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
  
  // Actions
  setRole: (role: UserRole | null) => void;
  setCurrentUser: (user: UserProfile | null) => void;
  
  // Requests actions
  addRequest: (req: Omit<TransportRequest, 'id' | 'status' | 'approvalChain'>) => void;
  updateRequest: (id: string, updates: Partial<TransportRequest>) => void;
  
  // Vehicle actions
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  
  // Driver actions
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  
  // Violation actions
  addViolation: (violation: Omit<Violation, 'id' | 'status' | 'lifecycle'>) => void;
  updateViolation: (id: string, updates: Partial<Violation>) => void;
  
  // Workflow actions
  addWorkflow: (wf: WorkflowDefinition) => void;
  updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => void;
  
  // Toast notifications
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Logs
  addAuditLog: (action: string, module: string, details: string) => void;
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

export const useTMSStore = create<TMSState>((set) => ({
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

  setRole: (role) => set((state) => {
    const user = role ? roleUsers[role] : null;
    return { 
      currentRole: role, 
      currentUser: user 
    };
  }),

  setCurrentUser: (user) => set({ currentUser: user, currentRole: user ? user.role : null }),

  addRequest: (req) => set((state) => {
    const newReq: TransportRequest = {
      ...req,
      id: `REQ-${1000 + state.requests.length + 1}`,
      status: 'Submitted',
      approvalChain: [
        { role: "Fleet Supervisor", status: 'Pending' }
      ]
    };
    return {
      requests: [newReq, ...state.requests]
    };
  }),

  updateRequest: (id, updates) => set((state) => ({
    requests: state.requests.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),

  addVehicle: (vehicle) => set((state) => ({
    vehicles: [vehicle, ...state.vehicles]
  })),

  updateVehicle: (id, updates) => set((state) => ({
    vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...updates } : v)
  })),

  updateDriver: (id, updates) => set((state) => ({
    drivers: state.drivers.map((d) => d.id === id ? { ...d, ...updates } : d)
  })),

  addViolation: (violation) => set((state) => {
    const newVio: Violation = {
      ...violation,
      id: `VIO-50${state.violations.length + 1}`,
      status: 'Reported',
      lifecycle: [
        { status: 'Reported', updatedBy: state.currentUser?.name || "System", updatedAt: new Date().toISOString(), comments: "Violation recorded." }
      ]
    };
    return {
      violations: [newVio, ...state.violations]
    };
  }),

  updateViolation: (id, updates) => set((state) => ({
    violations: state.violations.map((v) => v.id === id ? { ...v, ...updates } : v)
  })),

  addWorkflow: (wf) => set((state) => ({
    workflows: [wf, ...state.workflows]
  })),

  updateWorkflow: (id, updates) => set((state) => ({
    workflows: state.workflows.map((w) => w.id === id ? { ...w, ...updates } : w)
  })),

  addToast: (toast) => set((state) => {
    const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };
    return { toasts: [...state.toasts, newToast] };
  }),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  addAuditLog: (action, module, details) => set((state) => {
    const newLog: SystemAuditLog = {
      id: `AUD-${1000 + state.auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: state.currentUser?.name || "Guest System",
      role: state.currentRole || "SYS_ADMIN",
      module,
      action,
      details
    };
    return { auditLogs: [newLog, ...state.auditLogs] };
  })
}));
