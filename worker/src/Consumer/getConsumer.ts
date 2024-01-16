import config from "config";
import PgBoss from "pg-boss";
import { ApplicationError } from "../utils/ApplicationError";
import pino from "pino";

const DEFAULT_URL = config.get<string>("Queue.url");
const logger = pino();

let consumer;

export async function create(url: string = DEFAULT_URL) {
  logger.info({ method: "Consumer.create" }, `Starting consumer at ${url}`);
  const boss = new PgBoss(url);

  boss.on("error", (error) => {
    throw error;
  });

  try {
    await boss.start();
  } catch (e: any) {
    throw new ApplicationError("CONSUMER", "START_FAILED", `Failed to start listener ${e.message}. Exiting`);
  }

  logger.info({ method: "Consumer.create" }, `Successfully started consumer at ${url}`);
  return boss;
}

export async function getConsumer() {
  try {
    if (!consumer) {
      const boss = await create();
      consumer = boss;
    }
    return consumer;
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
