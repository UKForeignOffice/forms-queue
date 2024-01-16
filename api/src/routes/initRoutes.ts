import { Express, Router } from "express";

const router = Router();


router.get("/health-check", (_req, res) => {
  res.send({
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  });
});
export function initRoutes(server: Express) {
  server.use(router);
}
