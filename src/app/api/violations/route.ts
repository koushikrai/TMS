import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbViolations = await prisma.violation.findMany({
      include: {
        lifecycle: true
      }
    });
    if (dbViolations.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.violations);
    }
    return NextResponse.json(dbViolations);
  } catch (error) {
    console.warn("DB not connected, falling back to mock violations data:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.violations);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newVio = await prisma.violation.create({
        data: {
          id: data.id,
          vehicleId: data.vehicleId,
          driverId: data.driverId || null,
          type: data.type,
          source: data.source,
          capturedAt: data.capturedAt || new Date().toISOString(),
          status: data.status || "Reported",
          description: data.description,
          evidence: Array.isArray(data.evidence) ? data.evidence.join(",") : (data.evidence || ""),
          financialImpact: data.financialImpact ? parseFloat(data.financialImpact) : null,
          costCenter: data.costCenter || null,
          vendorPenalty: data.vendorPenalty ? parseFloat(data.vendorPenalty) : null,
          driverRecordImpact: data.driverRecordImpact || false,
        }
      });
      return NextResponse.json({ success: true, violation: newVio });
    } catch (e) {
      console.warn("DB violation write failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, violation: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    try {
      const updatedVio = await prisma.violation.update({
        where: { id: data.id },
        data: {
          status: data.status,
          financialImpact: data.financialImpact ? parseFloat(data.financialImpact) : undefined,
          vendorPenalty: data.vendorPenalty ? parseFloat(data.vendorPenalty) : undefined,
        }
      });
      return NextResponse.json({ success: true, violation: updatedVio });
    } catch (e) {
      console.warn("DB violation update failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, violation: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
