import { Express, NextFunction, Request, Response } from "express";
import { ApplicationError } from "../ApplicationError";
import { ERRORS } from "../errors";
import logger from "pino";
const stackLogger = logger();

function errorLogger(
  error: Error,
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (error instanceof ApplicationError) {
    const { name, code } = error;
    const summary = `${ERRORS[name][code]}`;
    req.log.error(`${name} ${code} ${summary}`, error);
    stackLogger.error(error);
    next(error);
    return;
  }
  req.log.error(error);
  next(error);
}
function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(500);
  if (error instanceof ApplicationError) {
    res.status(error.httpStatusCode);

    if (!error.exposeToClient) {
      return res.send({ error: error.code });
    }

    return res.send({
      error: error.code,
      message: error.message,
    });
  }

  return res.send({ message: error.message });
}

export function configureErrorHandlers(server: Express) {
  server.use("/", errorLogger, errorHandler);
}
