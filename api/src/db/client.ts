import logger from "pino";
import { Prisma, PrismaClient } from "@prisma/client";

const prismaLogger = logger();

const logLevel: Prisma.LogDefinition[] = [];

export const prisma: PrismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// @ts-ignore
prisma.$on("query", (e: Prisma.QueryEvent) => {
  console.log();
  prismaLogger.info({
    query: e.query,
    duration: `${e.duration}ms`,
    params: e.params,
  });
});

// @ts-ignore
prisma.$on("warn", (e) => {
  prismaLogger.warn(e);
});

// @ts-ignore
prisma.$on("info", (e) => {
  prismaLogger.info(e);
});

// @ts-ignore
prisma.$on("error", (e) => {
  prismaLogger.error(e);
});
