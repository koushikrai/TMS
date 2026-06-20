import { delay } from "./utils";

export interface RegulatoryPermit {
  id: string;
  type: 'MIZAN' | 'TAMM' | 'MVPI' | 'Tasriya' | 'Naql';
  status: 'Valid' | 'Expiring' | 'Expired';
  expiryDate: string;
}

export async function validatePermit(equipmentId: string, permitType: 'MIZAN' | 'TAMM' | 'MVPI' | 'Tasriya' | 'Naql'): Promise<{ isValid: boolean; permit?: RegulatoryPermit }> {
  await delay();
  const isValid = Math.random() > 0.15;
  const expiry = new Date();
  if (isValid) {
    expiry.setDate(expiry.getDate() + Math.floor(Math.random() * 100) + 15);
  } else {
    expiry.setDate(expiry.getDate() - 3);
  }
  
  const statusVal = isValid ? (Math.floor(Math.random() * 100) < 20 ? 'Expiring' : 'Valid') : 'Expired';
  
  return {
    isValid,
    permit: {
      id: "PERM-" + Math.floor(100000 + Math.random() * 900000),
      type: permitType,
      status: statusVal,
      expiryDate: expiry.toISOString().split("T")[0]
    }
  };
}

export async function getPermitStatus(permitId: string): Promise<RegulatoryPermit | null> {
  await delay();
  return {
    id: permitId,
    type: "Naql",
    status: "Valid",
    expiryDate: "2026-09-30"
  };
}
