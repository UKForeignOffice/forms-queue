import { Express, Router } from "express";
import { jobIdRouter } from "./reference/jobIdRouter";

const router = Router();

router.get("/health-check", (_req, res) => {
  res.send({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  });
});

router.use("/reference", jobIdRouter);
export function initRoutes(server: Express) {
  server.use(router);
}
