import rateLimit from "express-rate-limit";
import { Express, NextFunction, Request, Response } from "express";
import { ApplicationError } from "../ApplicationError";
import { HttpStatusCode } from "axios";

export function rateLimitExceededErrorHandler(req: Request, _res: Response, next: NextFunction) {
  req.log.error("429 rate limit exceeded", { path: req.path });
  next(new ApplicationError("GENERIC", "RATE_LIMIT_EXCEEDED", HttpStatusCode.TooManyRequests));
}

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: rateLimitExceededErrorHandler,
});

export function configureRateLimit(server: Express) {
  server.use(limiter);
}
