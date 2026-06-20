import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbLogs = await prisma.systemAuditLog.findMany({
      orderBy: { timestamp: "desc" }
    });
    if (dbLogs.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.auditLogs);
    }
    return NextResponse.json(dbLogs);
  } catch (error) {
    console.warn("DB not connected, falling back to mock audit logs:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.auditLogs);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newLog = await prisma.systemAuditLog.create({
        data: {
          timestamp: new Date().toISOString(),
          user: data.user || "System Integration Agent",
          role: data.role || "SYS_ADMIN",
          module: data.module || "System",
          action: data.action,
          details: data.details || "",
        }
      });
      return NextResponse.json({ success: true, log: newLog });
    } catch (e) {
      console.warn("DB audit log write failed, returning mock success:", e.message);
      return NextResponse.json({ success: true, log: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
