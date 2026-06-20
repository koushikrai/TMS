export interface MaintenanceRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  cost: number;
  status: 'Completed' | 'Pending';
}

export interface VehicleDocument {
  id: string;
  type: 'Istimara' | 'Insurance' | 'Ownership' | 'MIZAN' | 'TAMM' | 'MVPI' | 'Tasriya' | 'Naql';
  documentNumber: string;
  expiryDate: string; // ISO string format
  status: 'Valid' | 'Expiring' | 'Expired';
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  type?: 'Site' | 'Depot' | 'Yard' | 'Waypoint' | 'Geofence';
  radius?: number; // for geofence
}

export interface Allocation {
  id: string;
  employeeId: string;
  employeeName: string;
  grade: string;
  department: string;
  costCenter: string;
  startDate: string;
  endDate?: string;
  status: 'Active' | 'Ended';
}

export interface Vehicle {
  id: string;
  sapEquipmentNo: string;
  category: 'SUV' | 'Sedan' | 'SmallSUV' | 'Bus' | 'Truck' | 'Trailer' | 'LowBed' | 'Crane' | 'HeavyEquipment';
  ownership: 'Owned' | 'Vendor';
  vendorId?: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  modelLevel?: 'M1' | 'M2' | 'M3';
  status: 'Active' | 'UnderMaintenance' | 'Breakdown' | 'Decommissioned' | 'Available';
  gpsDeviceId?: string;
  currentLocation?: { lat: number; lng: number; lastUpdated: string };
  department?: string;
  costCenter?: string;
  maintenanceHistory: MaintenanceRecord[];
  documents: VehicleDocument[];
  allocations: Allocation[];
}

export interface Driver {
  id: string;
  sapEmployeeNo: string;
  name: string;
  type: 'Owned' | 'Vendor';
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  iqamaNumber: string;
  iqamaExpiry: string;
  insuranceExpiry: string;
  currentAssignment?: { vehicleId: string; routeId?: string };
  performanceScore: number;
  status: 'Active' | 'OnLeave' | 'Inactive';
}

export interface ApprovalStep {
  role: string;
  approverId?: string;
  approverName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  updatedAt?: string;
  comments?: string;
}

export interface TransportRequest {
  id: string;
  type: 'LightVehicle_Permanent' | 'LightVehicle_Temporary' | 'LightVehicle_Trip' | 'Bus' | 'HeavyVehicle';
  requestorId: string;
  requestorName: string;
  department: string;
  costCenter: string;
  projectWBS?: string;
  pickupLocation: Location;
  dropLocation?: Location;
  scheduledDate: string;
  purpose: string;
  status: 'Draft' | 'Submitted' | 'UnderApproval' | 'Approved' | 'Rejected' | 'Assigned' | 'InProgress' | 'Completed';
  assignedVehicleId?: string;
  assignedDriverId?: string;
  approvalChain: ApprovalStep[];
  estimatedCost?: number;
  actualCost?: number;
  passengerCount?: number;
}

export interface ViolationEvent {
  status: 'Reported' | 'UnderReview' | 'Disputed' | 'Resolved' | 'Closed';
  updatedBy: string;
  updatedAt: string;
  comments: string;
}

export interface Violation {
  id: string;
  vehicleId: string;
  driverId?: string;
  type: 'Speeding' | 'RouteDeviation' | 'GeofenceBreach' | 'DocumentNonCompliance';
  source: 'GPS' | 'Manual' | 'GovernmentPortal';
  capturedAt: string;
  status: 'Reported' | 'UnderReview' | 'Disputed' | 'Resolved' | 'Closed';
  description: string;
  evidence: string[]; // URLs/Paths
  financialImpact?: number;
  costCenter?: string;
  vendorPenalty?: number;
  driverRecordImpact: boolean;
  lifecycle: ViolationEvent[];
}

export interface Route {
  id: string;
  name: string;
  origin: Location;
  destination: Location;
  stops: Location[];
  distanceKm: number;
  estDurationMinutes: number;
  occupancyHeatmap: 'Green' | 'Amber' | 'Red';
  complianceFlag: boolean;
}

export interface GeoZone {
  id: string;
  name: string;
  type: 'Site' | 'Depot' | 'Yard' | 'Restricted';
  coordinates: { lat: number; lng: number }[];
  radiusMeters: number;
}

export interface Vendor {
  id: string;
  sapVendorId: string;
  name: string;
  contractValidityBadge: 'Valid' | 'Expiring' | 'Expired';
  contractExpiryDate: string;
  vehicleCount: number;
  slaCompliance: number; // percentage
  status: 'Active' | 'Review' | 'Inactive';
}

export interface Bid {
  id: string;
  vendorId: string;
  vendorName: string;
  rateSar: number;
  eta: string;
  complianceScore: number;
  historicalSla: number;
  isRecommended: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  deadlineDate: string;
  status: 'Active' | 'Closed' | 'Awarded';
  eligibleVendors: string[]; // Vendor IDs
  bids: Bid[];
  selectedBidId?: string;
}

export interface RateCard {
  id: string;
  vendorId: string;
  vendorName: string;
  tripType: string;
  vehicleCategory: string;
  baseRateSar: number;
  perKmRateSar: number;
  validFrom: string;
  validTo: string;
}

export interface WorkflowNode {
  id: string;
  type: 'Start' | 'Approver' | 'Condition' | 'Escalation' | 'Notification' | 'End';
  label: string;
  position: { x: number; y: number };
  config: {
    role?: string;
    slaTimerHours?: number;
    useSapOrg?: boolean;
    conditionField?: string;
    conditionOperator?: string;
    conditionValue?: string;
    escalationAction?: string;
    channel?: 'InApp' | 'Email' | 'SMS' | 'All';
    endStatus?: 'Approved' | 'Rejected' | 'Auto-Approved';
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  module: 'LightVehicle' | 'Bus' | 'HeavyVehicle' | 'Violations' | 'Vendors' | 'Onboarding';
  status: 'Active' | 'Draft';
  lastModified: string;
  triggeredCount: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  version: number;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  action: string;
  details: string;
}
