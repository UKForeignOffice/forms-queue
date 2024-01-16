import { Application, json } from "express";
import pino from "pino-http";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
}
