import { delay } from "../utils";

export interface RosterShift {
  employeeId: string;
  employeeName: string;
  shift: 'Day' | 'Night' | 'Off';
  date: string;
}

export async function getRosterByDate(date: string): Promise<RosterShift[]> {
  await delay();
  return [
    { employeeId: "EMP-1001", employeeName: "Ahmed Al-Nasser", shift: "Day", date },
    { employeeId: "EMP-1002", employeeName: "Fahad Al-Qahtani", shift: "Day", date },
    { employeeId: "EMP-1003", employeeName: "Yousef Al-Harbi", shift: "Night", date },
    { employeeId: "EMP-1004", employeeName: "Ali Al-Sudairy", shift: "Off", date },
  ];
}

export async function getLeavesToday(): Promise<string[]> {
  await delay();
  return ["EMP-1004", "EMP-1008"]; // List of employee IDs on leave today (for exclusion checks)
}
