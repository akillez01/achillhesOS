import { Router } from "express";

export const financeRouter = Router();

financeRouter.get("/summary", (_req, res) => {
  res.json({ data: { monthlyNet: 3420, savingsRate: 0.23, roiAverage: 0.218 } });
});
