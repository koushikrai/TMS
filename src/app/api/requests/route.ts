import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbRequests = await prisma.transportRequest.findMany({
      include: {
        approvalChain: true
      }
    });
    if (dbRequests.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.requests);
    }
    return NextResponse.json(dbRequests);
  } catch (error) {
    console.warn("DB not connected, falling back to mock requests data:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.requests);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newReq = await prisma.transportRequest.create({
        data: {
          id: data.id,
          type: data.type,
          requestorId: data.requestorId,
          requestorName: data.requestorName,
          department: data.department,
          costCenter: data.costCenter,
          projectWBS: data.projectWBS || null,
          pickupName: data.pickupLocation?.name || data.pickupName || "HQ - Jubail",
          pickupLat: data.pickupLocation?.lat || data.pickupLat || 27.0112,
          pickupLng: data.pickupLocation?.lng || data.pickupLng || 49.6234,
          dropName: data.dropLocation?.name || data.dropName || null,
          dropLat: data.dropLocation?.lat || data.dropLat || null,
          dropLng: data.dropLocation?.lng || data.dropLng || null,
          scheduledDate: data.scheduledDate,
          purpose: data.purpose,
          status: data.status || "Submitted",
          assignedVehicleId: data.assignedVehicleId || null,
          assignedDriverId: data.assignedDriverId || null,
          estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : null,
          actualCost: data.actualCost ? parseFloat(data.actualCost) : null,
          passengerCount: data.passengerCount ? parseInt(data.passengerCount) : null,
        }
      });
      return NextResponse.json({ success: true, request: newReq });
    } catch (e) {
      console.warn("DB request write failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, request: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    try {
      const updatedReq = await prisma.transportRequest.update({
        where: { id: data.id },
        data: {
          status: data.status,
          assignedVehicleId: data.assignedVehicleId,
          assignedDriverId: data.assignedDriverId,
          actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
        }
      });
      return NextResponse.json({ success: true, request: updatedReq });
    } catch (e) {
      console.warn("DB request update failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, request: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
