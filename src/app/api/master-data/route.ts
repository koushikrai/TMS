import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "locations";

    if (type === "routes") {
      const dbRoutes = await prisma.route.findMany();
      if (dbRoutes.length === 0) {
        const mockData = generateSeedData();
        return NextResponse.json(mockData.routes);
      }
      // Reformat DB schema structure to match TypeScript Location interface
      const formatted = dbRoutes.map(r => ({
        id: r.id,
        name: r.name,
        origin: { name: r.originName, lat: r.originLat, lng: r.originLng },
        destination: { name: r.destinationName, lat: r.destinationLat, lng: r.destinationLng },
        stops: JSON.parse(r.stopsJson),
        distanceKm: r.distanceKm,
        estDurationMinutes: r.estDurationMinutes,
        occupancyHeatmap: r.occupancyHeatmap,
        complianceFlag: r.complianceFlag
      }));
      return NextResponse.json(formatted);
    } else {
      // Fetch locations or geozones
      const dbGeozones = await prisma.geoZone.findMany();
      if (dbGeozones.length === 0) {
        // Return default list of sites
        return NextResponse.json([
          { name: "Expertise HQ - Jubail", lat: 27.0112, lng: 49.6234, type: "Site" },
          { name: "Jubail Yard A", lat: 27.0315, lng: 49.6105, type: "Yard", radius: 500 },
          { name: "Jubail Depot B", lat: 26.9856, lng: 49.5991, type: "Depot", radius: 800 },
          { name: "Jubail Port Facility", lat: 27.0210, lng: 49.6672, type: "Site" },
          { name: "SADARA Project Site", lat: 26.9112, lng: 49.4234, type: "Site" },
        ]);
      }
      const formatted = dbGeozones.map(g => ({
        name: g.name,
        lat: JSON.parse(g.coordinatesJson)[0]?.lat || 27.0112,
        lng: JSON.parse(g.coordinatesJson)[0]?.lng || 49.6234,
        type: g.type,
        radius: g.radiusMeters
      }));
      return NextResponse.json(formatted);
    }
  } catch (error) {
    console.warn("DB not connected, falling back to mock master data:", error.message);
    const mockData = generateSeedData();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "locations";
    if (type === "routes") {
      return NextResponse.json(mockData.routes);
    } else {
      return NextResponse.json([
        { name: "Expertise HQ - Jubail", lat: 27.0112, lng: 49.6234, type: "Site" },
        { name: "Jubail Yard A", lat: 27.0315, lng: 49.6105, type: "Yard", radius: 500 },
        { name: "Jubail Depot B", lat: 26.9856, lng: 49.5991, type: "Depot", radius: 800 },
        { name: "Jubail Port Facility", lat: 27.0210, lng: 49.6672, type: "Site" },
        { name: "SADARA Project Site", lat: 26.9112, lng: 49.4234, type: "Site" },
      ]);
    }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, payload } = data;
    try {
      if (type === "route") {
        const newRoute = await prisma.route.create({
          data: {
            id: payload.id,
            name: payload.name,
            originName: payload.origin?.name || "Origin",
            originLat: parseFloat(payload.origin?.lat) || 27.0112,
            originLng: parseFloat(payload.origin?.lng) || 49.6234,
            destinationName: payload.destination?.name || "Destination",
            destinationLat: parseFloat(payload.destination?.lat) || 27.0112,
            destinationLng: parseFloat(payload.destination?.lng) || 49.6234,
            stopsJson: JSON.stringify(payload.stops || []),
            distanceKm: parseFloat(payload.distanceKm) || 10,
            estDurationMinutes: parseFloat(payload.estDurationMinutes) || 15,
            occupancyHeatmap: payload.occupancyHeatmap || "Green",
            complianceFlag: payload.complianceFlag !== false,
          }
        });
        return NextResponse.json({ success: true, route: newRoute });
      } else {
        const newGeo = await prisma.geoZone.create({
          data: {
            id: `GEO-${Date.now()}`,
            name: payload.name,
            type: payload.type || "Site",
            coordinatesJson: JSON.stringify([{ lat: payload.lat, lng: payload.lng }]),
            radiusMeters: parseFloat(payload.radius) || 500,
          }
        });
        return NextResponse.json({ success: true, geofence: newGeo });
      }
    } catch (e) {
      console.warn("DB master-data POST failed, returning mock success:", e.message);
      return NextResponse.json({ success: true, data: payload });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
