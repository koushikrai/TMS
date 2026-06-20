import { delay } from "../utils";

export interface SAPEquipment {
  equipmentNo: string;
  plateNo: string;
  make: string;
  model: string;
  year: number;
  type: string;
  pmStatus: 'Operational' | 'Due' | 'Overdue';
  lastServiceDate: string;
}

export async function getEquipmentMaster(equipmentId: string): Promise<SAPEquipment | null> {
  await delay();
  return {
    equipmentNo: equipmentId,
    plateNo: "KSA-9988",
    make: "Toyota",
    model: "Hilux",
    year: 2023,
    type: "SUV",
    pmStatus: "Operational",
    lastServiceDate: "2026-05-10"
  };
}

export async function getMaintenanceStatus(equipmentId: string): Promise<{ isAvailable: boolean; nextServiceDate: string }> {
  await delay();
  return {
    isAvailable: true,
    nextServiceDate: "2026-08-15"
  };
}
