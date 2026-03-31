import cors from "cors";
import express from "express";
import { financeRouter } from "./routes/finance.routes";
import { projectsRouter } from "./routes/projects.routes";
import { timeRouter } from "./routes/time.routes";
import { healthcheck } from "./services/data.service";

const app = express();
const port = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json(healthcheck());
});

app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/time", timeRouter);
app.use("/api/v1/finance", financeRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`);
});
