import { Cashflow, Project, Task, Timesheet } from "./types";

export const projects: Project[] = [
  {
    id: "p1",
    name: "Client Portal",
    criticality: 5,
    hourlyRate: 180,
    expectedRevenue: 28000,
    status: "active"
  },
  {
    id: "p2",
    name: "SaaS Boilerplate",
    criticality: 4,
    hourlyRate: 140,
    expectedRevenue: 18000,
    status: "active"
  }
];

export const tasks: Task[] = [
  { id: "t1", projectId: "p1", title: "Auth RBAC", status: "in_progress", priority: 5 },
  { id: "t2", projectId: "p1", title: "Billing API", status: "review", priority: 4 },
  { id: "t3", projectId: "p2", title: "Landing SEO", status: "todo", priority: 3 },
  { id: "t4", projectId: "p2", title: "CI Pipeline", status: "done", priority: 4 }
];

export const timesheets: Timesheet[] = [
  { id: "ts1", projectId: "p1", taskId: "t1", date: "2026-03-29", minutesWorked: 210 },
  { id: "ts2", projectId: "p1", taskId: "t2", date: "2026-03-30", minutesWorked: 160 },
  { id: "ts3", projectId: "p2", taskId: "t3", date: "2026-03-30", minutesWorked: 120 }
];

export const cashflow: Cashflow[] = [
  { id: "c1", projectId: "p1", kind: "income", amount: 6400, category: "Serviços", occurredAt: "2026-03-28" },
  { id: "c2", projectId: "p1", kind: "expense", amount: 780, category: "Infra", occurredAt: "2026-03-30" },
  { id: "c3", projectId: "p2", kind: "income", amount: 2400, category: "Licenças", occurredAt: "2026-03-30" }
];
