import { Application, json } from "express";
import pino from "pino-http";
import { FileService, NotifyService, SESService, SubmitService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const fileService = new FileService();
  const sesService = new SESService({ fileService });
  const notifyService = new NotifyService();
  const submitService = new SubmitService({
    fileService,
    notifyService,
    sesService,
  });
  server.services = {
    fileService,
    submitService,
  };
}
