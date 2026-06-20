const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JUBAIL_COORDS = { lat: 27.0112, lng: 49.6234 };

const LOCATIONS = [
  { name: "Expertise HQ - Jubail", lat: 27.0112, lng: 49.6234, type: "Site" },
  { name: "Jubail Yard A", lat: 27.0315, lng: 49.6105, type: "Yard", radius: 500 },
  { name: "Jubail Depot B", lat: 26.9856, lng: 49.5991, type: "Depot", radius: 800 },
  { name: "Jubail Port Facility", lat: 27.0210, lng: 49.6672, type: "Site" },
  { name: "SADARA Project Site", lat: 26.9112, lng: 49.4234, type: "Site" },
  { name: "SATORP Refinery", lat: 26.8856, lng: 49.5191, type: "Site" },
  { name: "Riyadh Logistics Depot", lat: 24.7136, lng: 46.6753, type: "Site" },
  { name: "Yanbu Project Site", lat: 24.0889, lng: 38.0619, type: "Site" },
];

async function main() {
  console.log("Starting database seeding...");

  // Clean old data
  await prisma.systemAuditLog.deleteMany({});
  await prisma.workflowDefinition.deleteMany({});
  await prisma.rateCard.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.rFQ.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.geoZone.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.violationEvent.deleteMany({});
  await prisma.violation.deleteMany({});
  await prisma.approvalStep.deleteMany({});
  await prisma.transportRequest.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.allocation.deleteMany({});
  await prisma.vehicleDocument.deleteMany({});
  await prisma.maintenanceRecord.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});

  // 0. Seed Users with different roles (hashed password placeholder)
  const roles = ["EXEC", "TRANS_ADMIN", "FLEET_MGR", "DRIVER", "HR_DEPT", "FINANCE", "SYS_ADMIN"];
  for (const role of roles) {
    await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}@expertise.com`,
        passwordHash: "demo123", // placeholder password
        name: `${role.replace("_", " ")} User`,
        role: role,
      },
    });
  }
  console.log("Seeded 7 default users.");

  // 1. Generate 8 Vendors
  const vendors = [];
  const vendorNames = [
    "Jubail Logistics Co.", "Saudi Sands Transport", "Ar-Riyadh Carrier", 
    "Gulf Heavy Haulage", "Desert Express", "Al-Falah Logistics",
    "Jeddah Fleet Services", "Eastern Coast Transport"
  ];
  
  for (let i = 1; i <= 8; i++) {
    const valids = ['Valid', 'Expiring', 'Valid', 'Expired', 'Valid', 'Valid', 'Expiring', 'Valid'];
    const statuses = ['Active', 'Review', 'Active', 'Inactive', 'Active', 'Active', 'Review', 'Active'];
    const vend = await prisma.vendor.create({
      data: {
        id: `VEND-00${i}`,
        sapVendorId: `SAP-V-${200000 + i * 147}`,
        name: vendorNames[i - 1],
        contractValidityBadge: valids[i - 1],
        contractExpiryDate: new Date(2026, 6 + i, 15).toISOString().split('T')[0],
        vehicleCount: 0,
        slaCompliance: 80 + (i * 2.3) > 100 ? 98 : Math.floor(80 + (i * 2.3)),
        status: statuses[i - 1]
      }
    });
    vendors.push(vend);
  }
  console.log("Seeded 8 vendors.");

  // 2. Generate 90 Vehicles (LVs, Buses, Heavies)
  const vehicles = [];
  let ownedCount = 0;
  let vendorCount = 0;

  for (let i = 1; i <= 90; i++) {
    const isLV = i <= 40;
    const isBus = i > 40 && i <= 55;
    
    let category = 'SUV';
    let ownership = 'Owned';
    let modelLevel = null;
    let make = "Toyota";
    let model = "Camry";
    let year = 2021 + (i % 4);

    if (isLV) {
      ownership = ownedCount < 16 ? 'Owned' : 'Vendor';
      if (ownership === 'Owned') ownedCount++; else vendorCount++;
      const lvCats = ['SUV', 'Sedan', 'SmallSUV'];
      category = lvCats[i % 3];
      const modelLevels = ['M1', 'M2', 'M3'];
      modelLevel = modelLevels[i % 3];
      make = category === 'SUV' ? 'Toyota' : (category === 'Sedan' ? 'Hyundai' : 'Nissan');
      model = category === 'SUV' ? 'Land Cruiser' : (category === 'Sedan' ? 'Sonata' : 'Kicks');
    } else if (isBus) {
      ownership = (i - 40) <= 6 ? 'Owned' : 'Vendor';
      category = 'Bus';
      make = 'Mercedes-Benz';
      model = 'Tourismo (45-Seater)';
    } else {
      ownership = (i - 55) <= 13 ? 'Owned' : 'Vendor';
      const heavyCats = ['Truck', 'Trailer', 'LowBed', 'Crane', 'HeavyEquipment'];
      category = heavyCats[i % 5];
      make = category === 'Truck' ? 'Volvo' : (category === 'Crane' ? 'Liebherr' : 'CAT');
      model = category === 'Truck' ? 'FH16' : (category === 'Crane' ? 'LTM 1050' : '966M Loader');
    }

    const assignedVendor = ownership === 'Vendor' ? vendors[i % 8] : null;

    const statuses = ['Available', 'Active', 'UnderMaintenance', 'Available', 'Breakdown'];
    const status = statuses[i % 5];

    const vehId = isLV ? `LV-0${i}` : (isBus ? `BUS-0${i - 40}` : `HV-0${i - 55}`);
    
    const veh = await prisma.vehicle.create({
      data: {
        id: vehId,
        sapEquipmentNo: `EQ-${800000 + i * 37}`,
        category,
        ownership,
        vendorId: assignedVendor ? assignedVendor.id : null,
        plateNumber: `${1000 + i} ${String.fromCharCode(65 + (i % 3))}${String.fromCharCode(66 + (i % 3))}${String.fromCharCode(67 + (i % 3))}`,
        make,
        model,
        year,
        modelLevel,
        status,
        gpsDeviceId: `GPS-DEV-${9000 + i}`,
        lat: JUBAIL_COORDS.lat + (Math.random() - 0.5) * 0.1,
        lng: JUBAIL_COORDS.lng + (Math.random() - 0.5) * 0.1,
        lastUpdated: new Date(),
        department: ownership === 'Owned' ? 'Logistics Fleet' : null,
        costCenter: ownership === 'Owned' ? 'CC-300' : null,
      }
    });
    vehicles.push(veh);

    // Seed Maintenance records for this vehicle
    await prisma.maintenanceRecord.create({
      data: {
        vehicleId: vehId,
        type: "Routine Check",
        description: "Oil and filter replacement",
        date: "2026-04-10",
        cost: 450,
        status: "Completed"
      }
    });
    await prisma.maintenanceRecord.create({
      data: {
        vehicleId: vehId,
        type: "Brake Pads",
        description: "Front brake lining replacement",
        date: "2026-05-18",
        cost: 800,
        status: "Completed"
      }
    });

    // Seed Documents for this vehicle
    const docTypes = ['Istimara', 'Insurance', 'Ownership', 'TAMM', 'Naql'];
    for (let idx = 0; idx < docTypes.length; idx++) {
      const days = idx === 1 ? -4 : (idx === 3 ? 4 : 45);
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + days);
      const isExp = days < 0 ? 'Expired' : (days < 10 ? 'Expiring' : 'Valid');
      
      await prisma.vehicleDocument.create({
        data: {
          vehicleId: vehId,
          type: docTypes[idx],
          documentNumber: `REG-${i * 123 + idx}`,
          expiryDate: expiry.toISOString().split('T')[0],
          status: isExp
        }
      });
    }

    // Seed allocations for active vehicles
    if (status === 'Active') {
      await prisma.allocation.create({
        data: {
          vehicleId: vehId,
          employeeId: `EMP-10${10 + (i % 15)}`,
          employeeName: `Employee Name ${i}`,
          grade: modelLevel || 'M2',
          department: 'Operations',
          costCenter: 'CC-200',
          startDate: '2026-01-10',
          status: 'Active'
        }
      });
    }
  }
  console.log("Seeded 90 vehicles, maintenance logs, documents, and active allocations.");

  // Update vendor vehicle counts
  for (const vend of vendors) {
    const count = await prisma.vehicle.count({ where: { vendorId: vend.id } });
    await prisma.vendor.update({
      where: { id: vend.id },
      data: { vehicleCount: count }
    });
  }

  // 3. Generate 60 Drivers
  const drivers = [];
  const firstNames = ["Sultan", "Mansour", "Khalid", "Abdulrahman", "Faisal", "Tariq", "Yasser", "Bandar", "Naif", "Osama"];
  const lastNames = ["Al-Otaibi", "Al-Shehri", "Al-Subaie", "Al-Ghamdi", "Al-Zahrani", "Al-Dossary", "Al-Shammari", "Al-Anazi"];

  for (let i = 1; i <= 60; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const type = i <= 25 ? 'Owned' : 'Vendor';
    const status = i % 12 === 0 ? 'OnLeave' : (i % 20 === 0 ? 'Inactive' : 'Active');
    
    const licExp = new Date();
    licExp.setDate(licExp.getDate() + (i % 3 === 0 ? 5 : (i % 5 === 0 ? -2 : 120)));
    
    const iqamaExp = new Date();
    iqamaExp.setDate(iqamaExp.getDate() + (i % 4 === 0 ? 4 : 200));

    const assignedVeh = status === 'Active' && i <= 35 ? vehicles[i % vehicles.length].id : null;

    const drv = await prisma.driver.create({
      data: {
        id: `DRV-${100 + i}`,
        sapEmployeeNo: `EMP-20${100 + i}`,
        name: `${fn} ${ln}`,
        type,
        licenseNumber: `LIC-${400000 + i * 23}`,
        licenseCategory: i % 4 === 0 ? "Heavy Transport" : "Light Vehicle",
        licenseExpiry: licExp.toISOString().split('T')[0],
        iqamaNumber: `2400000${100 + i}`,
        iqamaExpiry: iqamaExp.toISOString().split('T')[0],
        insuranceExpiry: new Date(2027, 2, 10).toISOString().split('T')[0],
        vehicleId: assignedVeh,
        performanceScore: 82 + (i % 18),
        status
      }
    });
    drivers.push(drv);
  }
  console.log("Seeded 60 drivers.");

  // 4. Generate 20 Routes
  const routes = [];
  for (let i = 1; i <= 20; i++) {
    const origin = LOCATIONS[i % LOCATIONS.length];
    const destination = LOCATIONS[(i + 2) % LOCATIONS.length];
    const heatmaps = ['Green', 'Amber', 'Red'];
    const route = await prisma.route.create({
      data: {
        id: `RT-0${i}`,
        name: `Route ${origin.name.split(" - ")[0]} → ${destination.name.split(" - ")[0]}`,
        originName: origin.name,
        originLat: origin.lat,
        originLng: origin.lng,
        destinationName: destination.name,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        stopsJson: JSON.stringify([LOCATIONS[(i + 1) % LOCATIONS.length]]),
        distanceKm: 15 + i * 4.2,
        estDurationMinutes: 20 + i * 5,
        occupancyHeatmap: heatmaps[i % 3],
        complianceFlag: i % 7 !== 0
      }
    });
    routes.push(route);
  }
  console.log("Seeded 20 shuttle routes.");

  // 5. Generate 120 Transport Requests
  const requestTypes = ['LightVehicle_Permanent', 'LightVehicle_Temporary', 'LightVehicle_Trip', 'Bus', 'HeavyVehicle'];
  const reqStatuses = ['Draft', 'Submitted', 'UnderApproval', 'Approved', 'Assigned', 'InProgress', 'Completed'];

  for (let i = 1; i <= 120; i++) {
    const requestor = drivers[i % drivers.length];
    const type = requestTypes[i % 5];
    const status = reqStatuses[i % 7];
    
    const pickup = LOCATIONS[i % LOCATIONS.length];
    const drop = LOCATIONS[(i + 3) % LOCATIONS.length];
    const days = (i % 10) - 5;
    const sched = new Date();
    sched.setDate(sched.getDate() + days);

    const assignVeh = status === 'Assigned' || status === 'InProgress' || status === 'Completed' ? vehicles[i % vehicles.length].id : null;
    const assignDrv = status === 'Assigned' || status === 'InProgress' || status === 'Completed' ? drivers[(i + 5) % drivers.length].id : null;

    const req = await prisma.transportRequest.create({
      data: {
        id: `REQ-${1000 + i}`,
        type,
        requestorId: requestor.sapEmployeeNo,
        requestorName: requestor.name,
        department: 'Logistics Project Support',
        costCenter: 'CC-300',
        projectWBS: i % 2 === 0 ? 'WBS-2026-JUBAIL-01' : null,
        pickupName: pickup.name,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        dropName: drop.name,
        dropLat: drop.lat,
        dropLng: drop.lng,
        scheduledDate: sched.toISOString().split('T')[0],
        purpose: `Project movement request for ${pickup.name}`,
        status,
        assignedVehicleId: assignVeh,
        assignedDriverId: assignDrv,
        estimatedCost: 150 + i * 25,
        actualCost: status === 'Completed' ? 150 + i * 25 + (i % 10) : null,
        passengerCount: type === 'Bus' ? 20 + (i % 15) : (type === 'LightVehicle_Trip' ? 2 : null)
      }
    });

    // Create approvals
    await prisma.approvalStep.create({
      data: {
        requestId: req.id,
        role: "Fleet Supervisor",
        status: i % 3 === 0 ? 'Rejected' : 'Approved',
        updatedAt: '2026-06-18T10:00:00Z',
        comments: "Approved for dispatch"
      }
    });
    await prisma.approvalStep.create({
      data: {
        requestId: req.id,
        role: "Department Manager",
        status: i % 4 === 0 ? 'Pending' : 'Approved',
        updatedAt: '2026-06-18T11:30:00Z'
      }
    });
  }
  console.log("Seeded 120 transport requests & approval steps.");

  // 6. Generate 12 Violations
  const vioTypes = ['Speeding', 'RouteDeviation', 'GeofenceBreach', 'DocumentNonCompliance'];
  const vioStatuses = ['Reported', 'UnderReview', 'Disputed', 'Resolved', 'Closed'];

  for (let i = 1; i <= 12; i++) {
    const targetVeh = vehicles[(i * 3) % vehicles.length];
    const targetDrv = drivers[(i * 2) % drivers.length];
    const type = vioTypes[i % 4];
    const status = vioStatuses[i % 5];
    const capTime = new Date();
    capTime.setDate(capTime.getDate() - (i % 10));

    const vio = await prisma.violation.create({
      data: {
        id: `VIO-50${i}`,
        vehicleId: targetVeh.id,
        driverId: targetDrv.id,
        type,
        source: i % 3 === 0 ? 'GovernmentPortal' : (i % 2 === 0 ? 'GPS' : 'Manual'),
        capturedAt: capTime.toISOString(),
        status,
        description: `Speed violation of ${120 + i * 5} km/h recorded on Jubail Highway`,
        evidence: "/evidence-placeholder.jpg",
        financialImpact: i % 2 === 0 ? 500 + i * 100 : null,
        costCenter: 'CC-200',
        vendorPenalty: targetVeh.ownership === 'Vendor' ? 300 : null,
        driverRecordImpact: i % 3 !== 0,
      }
    });

    // Create violation lifecycle events
    await prisma.violationEvent.create({
      data: {
        violationId: vio.id,
        status: 'Reported',
        updatedBy: "System GPS Tracker",
        updatedAt: capTime.toISOString(),
        comments: "Speed exceeded limit"
      }
    });
    await prisma.violationEvent.create({
      data: {
        violationId: vio.id,
        status: 'UnderReview',
        updatedBy: "Fahad Al-Qahtani (Ops Manager)",
        updatedAt: capTime.toISOString(),
        comments: "Reviewing telemetry data"
      }
    });
  }
  console.log("Seeded 12 violations.");

  // 7. Generate 8 active Rate Cards
  for (let i = 1; i <= 8; i++) {
    const targetVend = vendors[i - 1];
    await prisma.rateCard.create({
      data: {
        id: `RTC-0${i}`,
        vendorId: targetVend.id,
        vendorName: targetVend.name,
        tripType: "Jubail Internal Shuttle",
        vehicleCategory: "SUV",
        baseRateSar: 250 + i * 15,
        perKmRateSar: 1.8 + i * 0.1,
        validFrom: "2026-01-01",
        validTo: "2026-12-31"
      }
    });
  }
  console.log("Seeded 8 vendor rate cards.");

  // 8. Workflows
  const workflows = [
    {
      id: "WF-001",
      name: "Light Vehicle Standard Allocation",
      module: "LightVehicle",
      status: "Active",
      lastModified: "2026-06-15",
      triggeredCount: 42,
      version: 2,
      nodes: [
        { id: "node-1", type: "Start", label: "Request Submitted", position: { x: 50, y: 150 }, config: {} },
        { id: "node-2", type: "Condition", label: "Grade Check (M1/M2/M3)", position: { x: 200, y: 150 }, config: { conditionField: "request.grade", conditionOperator: "in", conditionValue: "M1,M2,M3" } },
        { id: "node-3", type: "Approver", label: "Fleet Manager Approval", position: { x: 400, y: 100 }, config: { role: "FLEET_MGR", slaTimerHours: 24, useSapOrg: true } },
        { id: "node-4", type: "Approver", label: "Executive Director Override", position: { x: 400, y: 220 }, config: { role: "EXEC" } },
        { id: "node-5", type: "Notification", label: "Send SMS Alert", position: { x: 600, y: 150 }, config: { channel: "SMS" } },
        { id: "node-6", type: "End", label: "Approved", position: { x: 800, y: 150 }, config: { endStatus: "Approved" } }
      ],
      edges: [
        { id: "edge-1", source: "node-1", target: "node-2" },
        { id: "edge-2", source: "node-2", target: "node-3", label: "Eligible" },
        { id: "edge-3", source: "node-2", target: "node-4", label: "Override Needed" },
        { id: "edge-4", source: "node-3", target: "node-5", label: "Approved" },
        { id: "edge-5", source: "node-4", target: "node-5", label: "Approved" },
        { id: "edge-6", source: "node-5", target: "node-6" }
      ]
    },
    {
      id: "WF-002",
      name: "Heavy Movement Permits Workflow",
      module: "HeavyVehicle",
      status: "Active",
      lastModified: "2026-06-19",
      triggeredCount: 88,
      version: 1,
      nodes: [
        { id: "n-1", type: "Start", label: "Heavy Request Submitted", position: { x: 50, y: 150 }, config: {} },
        { id: "n-2", type: "Approver", label: "Validate Permits (MIZAN, Naql)", position: { x: 250, y: 150 }, config: { role: "SYS_ADMIN", useSapOrg: false } },
        { id: "n-3", type: "End", label: "Auto Dispatch", position: { x: 450, y: 150 }, config: { endStatus: "Approved" } }
      ],
      edges: [
        { id: "e-1", source: "n-1", target: "n-2" },
        { id: "e-2", source: "n-2", target: "n-3" }
      ]
    },
    {
      id: "WF-003",
      name: "Out of Policy Ride Approval",
      module: "LightVehicle",
      status: "Active",
      lastModified: "2026-06-10",
      triggeredCount: 15,
      version: 3,
      nodes: [], edges: []
    },
    {
      id: "WF-004",
      name: "Bus Schedule Optimization",
      module: "Bus",
      status: "Draft",
      lastModified: "2026-06-18",
      triggeredCount: 0,
      version: 1,
      nodes: [], edges: []
    },
    {
      id: "WF-005",
      name: "Vendor Dispatch Verification",
      module: "Vendors",
      status: "Active",
      lastModified: "2026-06-12",
      triggeredCount: 121,
      version: 2,
      nodes: [], edges: []
    },
    {
      id: "WF-006",
      name: "Speed Violation Automatic Warning",
      module: "Violations",
      status: "Active",
      lastModified: "2026-06-14",
      triggeredCount: 304,
      version: 1,
      nodes: [], edges: []
    }
  ];

  for (const wf of workflows) {
    await prisma.workflowDefinition.create({
      data: {
        id: wf.id,
        name: wf.name,
        module: wf.module,
        status: wf.status,
        lastModified: wf.lastModified,
        triggeredCount: wf.triggeredCount,
        version: wf.version,
        nodesJson: JSON.stringify(wf.nodes),
        edgesJson: JSON.stringify(wf.edges),
      }
    });
  }
  console.log("Seeded 6 workflow definitions.");

  // 9. Seed Audit Logs
  const logModules = ["Auth", "Vehicles", "Drivers", "Workflows", "SAP Sync", "Regulatory"];
  const logActions = ["User logged in", "Modified vehicle allocation", "Created dispatch workflow", "Permit sync check completed", "Posted WBS cost cross-charge"];
  
  for (let i = 1; i <= 30; i++) {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - i * 45);
    await prisma.systemAuditLog.create({
      data: {
        id: `AUD-${1000 + i}`,
        timestamp: timestamp.toISOString(),
        user: i % 2 === 0 ? "Fahad Al-Qahtani" : "System Integration Agent",
        role: i % 2 === 0 ? "FLEET_MGR" : "SYS_ADMIN",
        module: logModules[i % logModules.length],
        action: logActions[i % logActions.length],
        details: `Execution record details for transaction segment ${100 + i}`
      }
    });
  }
  console.log("Seeded 30 system audit log entries.");

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
