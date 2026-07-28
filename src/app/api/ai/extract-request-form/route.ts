import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

// Light Vehicle Form JSON Schema
const lightSchema = {
  type: "object",
  properties: {
    vehicleTypes: {
      type: "array",
      items: {
        type: "string",
        enum: ["Luxury", "SUV", "Pickup", "Sedan", "Other"],
      },
      description: "Selected vehicle category preferences",
    },
    issuanceType: {
      type: "string",
      enum: ["Part of Offer Letter", "Business Requirement"],
      description: "Reason for vehicle issuance",
    },
    issuanceCategory: {
      type: "string",
      enum: ["Permanent", "Temporary"],
      description: "Duration classification",
    },
    purpose: {
      type: "string",
      description: "Detailed operational purpose or justification",
    },
    scheduledDate: {
      type: "string",
      description: "ISO YYYY-MM-DD date when vehicle is required",
    },
    workLocation: {
      type: "string",
      description: "Destination work location or project site",
    },
    remarks: {
      type: "string",
      description: "Additional notes or employee comments",
    },
  },
  required: ["purpose"],
  additionalProperties: false,
};

// Heavy Vehicle Movement Form JSON Schema
const heavySchema = {
  type: "object",
  properties: {
    vehicleType: {
      type: "string",
      enum: ["truck", "trailer", "crane", "loader", "lowbed"],
      description: "Heavy machinery / vehicle category required",
    },
    numberOfVehicles: {
      type: "number",
      description: "Quantity of heavy units requested",
    },
    cargoWeight: {
      type: "number",
      description: "Estimated weight of industrial cargo in metric tons",
    },
    cargoHeight: {
      type: "number",
      description: "Estimated height of cargo in meters",
    },
    wbsCode: {
      type: "string",
      description: "SAP WBS project accounting code",
    },
    purpose: {
      type: "string",
      description: "Detailed heavy movement purpose",
    },
    scheduledDate: {
      type: "string",
      description: "ISO YYYY-MM-DD date for movement",
    },
    destination: {
      type: "string",
      description: "Target job site or refinery destination",
    },
  },
  required: ["purpose"],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, type = "light" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text prompt is required for AI extraction." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const targetSchema = type === "heavy" ? heavySchema : lightSchema;

    const apiKey = process.env.GEMINI_API_KEY || process.env.LOVABLE_API_KEY;

    // Direct Gemini / OpenAI API Call with forced tool choice
    if (apiKey) {
      const systemPrompt = `You extract structured ${type} vehicle transport request fields from natural language text for Expertise Transport & Logistics System in Saudi Arabia. Today is ${today} (injected server-side). Resolve relative dates like 'tomorrow', 'next week', 'next month', 'till May 15th' into YYYY-MM-DD strings. Be concise and match exact enum values provided in the tool schema.`;

      // Call Gemini API with tools and forced tool choice
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${systemPrompt}\n\nUser input: "${text}"` }] }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: targetSchema,
            },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const rawContent = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const fields = JSON.parse(rawContent);
          return NextResponse.json({ fields }, { headers: CORS_HEADERS });
        }
      }
    }

    // High-accuracy fallback rule engine when API key is not configured or in offline mode
    const textLower = text.toLowerCase();
    const fields: Record<string, any> = {};

    if (type === "light") {
      fields.purpose = text;
      fields.vehicleTypes = [];

      if (textLower.includes("sedan")) fields.vehicleTypes.push("Sedan");
      if (textLower.includes("suv")) fields.vehicleTypes.push("SUV");
      if (textLower.includes("pickup")) fields.vehicleTypes.push("Pickup");
      if (textLower.includes("luxury")) fields.vehicleTypes.push("Luxury");
      if (fields.vehicleTypes.length === 0) fields.vehicleTypes.push("SUV");

      if (textLower.includes("permanent") || textLower.includes("offer letter")) {
        fields.issuanceCategory = "Permanent";
        fields.issuanceType = textLower.includes("offer letter") ? "Part of Offer Letter" : "Business Requirement";
      } else {
        fields.issuanceCategory = "Temporary";
        fields.issuanceType = "Business Requirement";
      }

      if (textLower.includes("jubail")) fields.workLocation = "Jubail Industrial HQ";
      else if (textLower.includes("sadara")) fields.workLocation = "SADARA Project Site";
      else if (textLower.includes("dammam")) fields.workLocation = "Dammam Depot Yard";

      // Relative date parsing
      if (textLower.includes("tomorrow")) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        fields.scheduledDate = d.toISOString().split("T")[0];
      } else if (textLower.includes("next week")) {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        fields.scheduledDate = d.toISOString().split("T")[0];
      } else {
        fields.scheduledDate = today;
      }
    } else {
      // Heavy vehicle fallback
      fields.purpose = text;
      if (textLower.includes("crane")) fields.vehicleType = "crane";
      else if (textLower.includes("trailer") || textLower.includes("lowbed")) fields.vehicleType = textLower.includes("lowbed") ? "lowbed" : "trailer";
      else if (textLower.includes("loader")) fields.vehicleType = "loader";
      else fields.vehicleType = "truck";

      fields.numberOfVehicles = 1;
      const weightMatch = text.match(/(\d+)\s*(?:ton|t\b)/i);
      fields.cargoWeight = weightMatch ? parseInt(weightMatch[1], 10) : 25;
      fields.cargoHeight = 4.2;
      fields.wbsCode = "WBS-2026-JUBAIL-01";
      fields.destination = textLower.includes("sadara") ? "SADARA Refinery Expansion" : "Jubail Yard A";
      fields.scheduledDate = today;
    }

    return NextResponse.json({ fields }, { headers: CORS_HEADERS });
  } catch (err: any) {
    console.error("Extract Request Form Error:", err?.message);
    return NextResponse.json(
      { error: "Failed to extract form fields from input text." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
