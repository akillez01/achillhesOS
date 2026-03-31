import { Router } from "express";

export const timeRouter = Router();

timeRouter.get("/summary", (_req, res) => {
  res.json({ data: { focusedHoursWeek: 28.4, pomodorosToday: 6 } });
});
