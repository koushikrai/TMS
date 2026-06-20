import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbDrivers = await prisma.driver.findMany({
      include: {
        vehicle: true
      }
    });
    if (dbDrivers.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.drivers);
    }
    return NextResponse.json(dbDrivers);
  } catch (error) {
    console.warn("DB not connected, falling back to mock driver data:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.drivers);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newDrv = await prisma.driver.create({
        data: {
          id: data.id,
          sapEmployeeNo: data.sapEmployeeNo,
          name: data.name,
          type: data.type,
          licenseNumber: data.licenseNumber,
          licenseCategory: data.licenseCategory,
          licenseExpiry: data.licenseExpiry,
          iqamaNumber: data.iqamaNumber,
          iqamaExpiry: data.iqamaExpiry,
          insuranceExpiry: data.insuranceExpiry,
          vehicleId: data.vehicleId || null,
          performanceScore: parseFloat(data.performanceScore) || 95,
          status: data.status || "Active",
        }
      });
      return NextResponse.json({ success: true, driver: newDrv });
    } catch (e) {
      console.warn("DB driver write failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, driver: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
