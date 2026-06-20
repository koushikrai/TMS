import { delay } from "./utils";

export interface FuelLog {
  date: string;
  liters: number;
  costSar: number;
  location: string;
  odometer: number;
}

export async function getFuelUsage(vehicleId: string, startDate: string, endDate: string): Promise<FuelLog[]> {
  await delay();
  return [
    { date: "2026-06-15", liters: 45, costSar: 104.85, location: "PetroApp Station - Jubail", odometer: 12450 },
    { date: "2026-06-18", liters: 50, costSar: 116.50, location: "PetroApp Station - Jubail Highway", odometer: 12900 },
  ];
}
