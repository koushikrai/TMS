import { delay } from "../utils";

export async function postCrossCharge(costCenter: string, amount: number, description: string): Promise<{ success: boolean; sapDocNo: string }> {
  await delay();
  return {
    success: true,
    sapDocNo: "SAP-FI-" + Math.floor(10000000 + Math.random() * 90000000)
  };
}
