import { delay } from "../utils";

export async function triggerFioriNotification(userId: string, message: string): Promise<{ success: boolean; pushToken?: string }> {
  await delay();
  return {
    success: true,
    pushToken: "PUSH-" + Math.floor(100000 + Math.random() * 900000)
  };
}
