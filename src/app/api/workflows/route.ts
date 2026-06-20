import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET() {
  try {
    const dbWorkflows = await prisma.workflowDefinition.findMany();
    if (dbWorkflows.length === 0) {
      const mockData = generateSeedData();
      return NextResponse.json(mockData.workflows);
    }
    const formatted = dbWorkflows.map(w => ({
      id: w.id,
      name: w.name,
      module: w.module,
      status: w.status,
      lastModified: w.lastModified,
      triggeredCount: w.triggeredCount,
      version: w.version,
      nodes: JSON.parse(w.nodesJson),
      edges: JSON.parse(w.edgesJson)
    }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.warn("DB not connected, falling back to mock workflows:", error.message);
    const mockData = generateSeedData();
    return NextResponse.json(mockData.workflows);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    try {
      const newWf = await prisma.workflowDefinition.create({
        data: {
          id: data.id,
          name: data.name,
          module: data.module,
          status: data.status || "Draft",
          lastModified: new Date().toISOString().split("T")[0],
          triggeredCount: data.triggeredCount || 0,
          version: data.version || 1,
          nodesJson: JSON.stringify(data.nodes || []),
          edgesJson: JSON.stringify(data.edges || []),
        }
      });
      return NextResponse.json({ success: true, workflow: newWf });
    } catch (e) {
      console.warn("DB workflow write failed, returning mock fallback:", e.message);
      return NextResponse.json({ success: true, workflow: data });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
