import rateLimit from "express-rate-limit";
import { Express, Request, Response } from "express";
import { ApplicationError } from "../ApplicationError";

export function rateLimitExceededErrorHandler(_req: Request, _res: Response) {
  throw new ApplicationError("GENERIC", "RATE_LIMIT_EXCEEDED", 429);
}

export function configureRateLimit(server: Express) {
  server.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: rateLimitExceededErrorHandler,
    }),
  );
}
