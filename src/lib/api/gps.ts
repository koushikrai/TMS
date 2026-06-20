import { delay } from "./utils";

export interface GPSCoordinate {
  lat: number;
  lng: number;
  speed: number;
  lastUpdated: string;
}

export async function getVehicleLocations(): Promise<Record<string, GPSCoordinate>> {
  await delay();
  return {
    "V-LV-01": { lat: 26.9598, lng: 49.5687, speed: 65, lastUpdated: new Date().toISOString() }, // Jubail area
    "V-LV-02": { lat: 27.0112, lng: 49.6234, speed: 0, lastUpdated: new Date().toISOString() },
    "V-BUS-01": { lat: 26.9856, lng: 49.5991, speed: 55, lastUpdated: new Date().toISOString() },
    "V-HV-01": { lat: 27.0543, lng: 49.4982, speed: 80, lastUpdated: new Date().toISOString() },
  };
}

export function subscribeToGPSFeed(vehicleId: string, onUpdate: (coord: GPSCoordinate) => void) {
  const interval = setInterval(() => {
    const baseLat = 27.0112;
    const baseLng = 49.6234;
    onUpdate({
      lat: baseLat + (Math.random() - 0.5) * 0.05,
      lng: baseLng + (Math.random() - 0.5) * 0.05,
      speed: Math.floor(Math.random() * 90) + 10,
      lastUpdated: new Date().toISOString()
    });
  }, 3000);
  
  return () => clearInterval(interval);
}
