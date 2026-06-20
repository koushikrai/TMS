import { delay } from "../utils";

export async function getWBSCodes(): Promise<string[]> {
  await delay();
  return [
    "WBS-2026-JUBAIL-01",
    "WBS-2026-RIYADH-02",
    "WBS-2026-YANBU-03",
    "WBS-2026-DAMMAM-04"
  ];
}

export async function postProjectCost(wbs: string, amount: number): Promise<{ success: boolean; sapDocNo: string }> {
  await delay();
  return {
    success: true,
    sapDocNo: "SAP-CO-" + Math.floor(10000000 + Math.random() * 90000000)
  };
}
