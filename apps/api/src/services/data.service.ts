import { ApiProject } from "../types/domain";

const projects: ApiProject[] = [
  { id: "p1", name: "Client Portal", hourlyRate: 180, expectedRevenue: 28000, criticality: 5 },
  { id: "p2", name: "SaaS Boilerplate", hourlyRate: 140, expectedRevenue: 18000, criticality: 4 }
];

export function listProjects() {
  return projects;
}

export function healthcheck() {
  return { status: "ok", service: "achillhesOS-api" };
}
