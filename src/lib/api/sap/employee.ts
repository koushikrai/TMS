import { delay } from "../utils";

export interface SAPEmployee {
  employeeId: string;
  name: string;
  grade: 'M1' | 'M2' | 'M3' | 'Regular';
  department: string;
  costCenter: string;
  email: string;
  phone: string;
}

export async function getEmployeeMaster(employeeId: string): Promise<SAPEmployee | null> {
  await delay();
  const mockEmployees: Record<string, SAPEmployee> = {
    "EMP-1001": { employeeId: "EMP-1001", name: "Ahmed Al-Nasser", grade: "M1", department: "Executive", costCenter: "CC-100", email: "a.nasser@expertise.com.sa", phone: "+966 50 123 4567" },
    "EMP-1002": { employeeId: "EMP-1002", name: "Fahad Al-Qahtani", grade: "M2", department: "Operations", costCenter: "CC-200", email: "f.qahtani@expertise.com.sa", phone: "+966 50 234 5678" },
    "EMP-1003": { employeeId: "EMP-1003", name: "Yousef Al-Harbi", grade: "M3", department: "Logistics", costCenter: "CC-300", email: "y.harbi@expertise.com.sa", phone: "+966 50 345 6789" },
    "EMP-1004": { employeeId: "EMP-1004", name: "Ali Al-Sudairy", grade: "Regular", department: "HR", costCenter: "CC-400", email: "a.sudairy@expertise.com.sa", phone: "+966 50 456 7890" },
  };
  return mockEmployees[employeeId] || {
    employeeId,
    name: "Employee " + employeeId,
    grade: "Regular",
    department: "Operations",
    costCenter: "CC-200",
    email: `emp.${employeeId.toLowerCase()}@expertise.com.sa`,
    phone: "+966 50 000 0000"
  };
}
