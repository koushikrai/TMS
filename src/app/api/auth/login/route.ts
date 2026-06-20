import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();
    
    // Attempt DB check
    try {
      const user = await prisma.user.findFirst({
        where: { role: role }
      });
      if (user) {
        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        });
      }
    } catch (e) {
      console.warn("DB Auth query failed, falling back to local auth:", e.message);
    }

    // Fallback static auth for developer ease
    return NextResponse.json({
      success: true,
      user: {
        id: `USR-${role.toLowerCase()}`,
        email: email || `${role.toLowerCase()}@expertise.com`,
        name: `${role.replace("_", " ")} User`,
        role: role
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
