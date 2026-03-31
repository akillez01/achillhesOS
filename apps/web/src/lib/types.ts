export type Project = {
  id: string;
  name: string;
  criticality: number;
  hourlyRate: number;
  expectedRevenue: number;
  status: "active" | "paused" | "archived";
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: number;
};

export type Timesheet = {
  id: string;
  projectId: string;
  taskId?: string;
  date: string;
  minutesWorked: number;
};

export type Cashflow = {
  id: string;
  projectId?: string;
  kind: "income" | "expense";
  amount: number;
  category: string;
  occurredAt: string;
};
