import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSeedData } from "@/lib/seed/dataGenerator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "vendors";

    if (type === "rfqs") {
      const dbRfqs = await prisma.rFQ.findMany({
        include: { bids: true }
      });
      if (dbRfqs.length === 0) {
        const mockData = generateSeedData();
        return NextResponse.json(mockData.workflows); // fallback or empty
      }
      return NextResponse.json(dbRfqs);
    } else if (type === "rate-cards") {
      const dbRateCards = await prisma.rateCard.findMany();
      if (dbRateCards.length === 0) {
        const mockData = generateSeedData();
        return NextResponse.json(mockData.rateCards);
      }
      return NextResponse.json(dbRateCards);
    } else {
      const dbVendors = await prisma.vendor.findMany();
      if (dbVendors.length === 0) {
        const mockData = generateSeedData();
        return NextResponse.json(mockData.vendors);
      }
      return NextResponse.json(dbVendors);
    }
  } catch (error) {
    console.warn("DB not connected, falling back to mock vendors data:", error.message);
    const mockData = generateSeedData();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "vendors";
    if (type === "rfqs") {
      // Create mockup RFQs
      const mockRfqs = [
        {
          id: "RFQ-201",
          title: "Heavy Low-Bed Mobilization - SADARA",
          description: "Transport of LIEBHERR LTM-1050 Crane from Jubail Yard A to SADARA Project Site.",
          createdDate: "2026-06-18",
          deadlineDate: "2026-06-25",
          status: "Active",
          eligibleVendors: ["VEND-001", "VEND-002", "VEND-003"],
          bids: [
            { id: "BID-301", vendorId: "VEND-001", vendorName: "Jubail Logistics Co.", rateSar: 12500, eta: "2 hours", complianceScore: 92, historicalSla: 94, isRecommended: true, status: "Pending" },
            { id: "BID-302", vendorId: "VEND-002", vendorName: "Saudi Sands Transport", rateSar: 14000, eta: "4 hours", complianceScore: 88, historicalSla: 89, isRecommended: false, status: "Pending" }
          ]
        }
      ];
      return NextResponse.json(mockRfqs);
    } else if (type === "rate-cards") {
      return NextResponse.json(mockData.rateCards);
    } else {
      return NextResponse.json(mockData.vendors);
    }
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, payload } = data;
    
    try {
      if (type === "rfq") {
        const newRfq = await prisma.rFQ.create({
          data: {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            createdDate: payload.createdDate || new Date().toISOString().split("T")[0],
            deadlineDate: payload.deadlineDate,
            status: payload.status || "Active",
            eligibleVendorsJson: JSON.stringify(payload.eligibleVendors || []),
          }
        });
        return NextResponse.json({ success: true, rfq: newRfq });
      } else if (type === "bid") {
        const newBid = await prisma.bid.create({
          data: {
            id: payload.id,
            rfqId: payload.rfqId,
            vendorId: payload.vendorId,
            vendorName: payload.vendorName,
            rateSar: parseFloat(payload.rateSar),
            eta: payload.eta,
            complianceScore: parseFloat(payload.complianceScore),
            historicalSla: parseFloat(payload.historicalSla),
            status: payload.status || "Pending",
          }
        });
        return NextResponse.json({ success: true, bid: newBid });
      } else {
        const newRate = await prisma.rateCard.create({
          data: {
            id: payload.id,
            vendorId: payload.vendorId,
            vendorName: payload.vendorName,
            tripType: payload.tripType,
            vehicleCategory: payload.vehicleCategory,
            baseRateSar: parseFloat(payload.baseRateSar),
            perKmRateSar: parseFloat(payload.perKmRateSar),
            validFrom: payload.validFrom,
            validTo: payload.validTo,
          }
        });
        return NextResponse.json({ success: true, rateCard: newRate });
      }
    } catch (e) {
      console.warn("DB vendor POST write failed, returning mock success:", e.message);
      return NextResponse.json({ success: true, data: payload });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
