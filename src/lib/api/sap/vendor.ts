import { delay } from "../utils";

export interface SAPVendor {
  vendorId: string;
  name: string;
  crNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export async function getVendorMaster(vendorId: string): Promise<SAPVendor | null> {
  await delay();
  return {
    vendorId,
    name: "Jubail Logistics Co.",
    crNumber: "2055001234",
    contactPerson: "Mohammed Al-Harthi",
    email: "ops@jubaillogistics.com",
    phone: "+966 13 340 1234"
  };
}

export async function getVendorVehicles(vendorId: string): Promise<string[]> {
  await delay();
  return ["V-LV-01", "V-HV-02", "V-BUS-03"]; // List of vehicle IDs leased from this vendor
}
