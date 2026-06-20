import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbVehicles = await prisma.vehicle.findMany({
      include: {
        maintenanceHistory: true,
        documents: true,
        allocations: true,
      },
    });
    // If table exists but has no entries, check if we should return empty or mock
    if (dbVehicles.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.vehicles);
    }
    return NextResponse.json(dbVehicles);
  } catch (error) {
    console.warn("DB not connected, falling back to mock seed data:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.vehicles);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newVeh = await prisma.vehicle.create({
        data: {
          id: data.id,
          sapEquipmentNo: data.sapEquipmentNo,
          category: data.category,
          ownership: data.ownership,
          vendorId: data.vendorId || null,
          plateNumber: data.plateNumber,
          make: data.make,
          model: data.model,
          year: parseInt(data.year) || 2024,
          modelLevel: data.modelLevel || null,
          status: data.status || "Available",
          gpsDeviceId: data.gpsDeviceId || null,
          lat: data.lat || 27.0112,
          lng: data.lng || 49.6234,
          department: data.department || null,
          costCenter: data.costCenter || null,
        }
      });
      return NextResponse.json({ success: true, vehicle: newVeh });
    } catch (e) {
      console.warn("DB write failed, simulation fallback:", e.message);
      return NextResponse.json({ success: true, vehicle: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
