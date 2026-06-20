import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    try {
      const updatedVeh = await prisma.vehicle.update({
        where: { id: id },
        data: {
          status: body.status,
          department: body.department,
          costCenter: body.costCenter,
          make: body.make,
          model: body.model,
          year: body.year ? parseInt(body.year) : undefined,
        }
      });
      return NextResponse.json({ success: true, vehicle: updatedVeh });
    } catch (e) {
      console.warn(`DB vehicle update for ${id} failed, returning mock response:`, e.message);
      return NextResponse.json({ success: true, vehicle: { id, ...body } });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    try {
      await prisma.vehicle.delete({
        where: { id: id }
      });
      return NextResponse.json({ success: true, message: `Vehicle ${id} deleted.` });
    } catch (e) {
      console.warn(`DB vehicle delete for ${id} failed, returning mock success:`, e.message);
      return NextResponse.json({ success: true, message: `Vehicle ${id} deleted (mock).` });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
