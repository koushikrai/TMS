import { delay } from "./utils";

export async function getAttendanceStatus(employeeId: string): Promise<'Present' | 'Absent' | 'OnLeave'> {
  await delay();
  const leaves = ["EMP-1004", "EMP-1008"];
  if (leaves.includes(employeeId)) return 'OnLeave';
  return Math.random() > 0.15 ? 'Present' : 'Absent';
}
