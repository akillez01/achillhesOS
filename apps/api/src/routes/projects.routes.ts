import { Router } from "express";
import { listProjects } from "../services/data.service";

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  res.json({ data: listProjects() });
});
