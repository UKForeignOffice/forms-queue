import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import PgBoss from "pg-boss";
import config from "config";

const queue = "submission";
const logger = pino().child({
  queue,
});

const pollingIntervalSeconds = parseInt(config.get<"string">("pollingIntervalSeconds"));
export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info(`starting queue '${queue}' workers, checking every ${pollingIntervalSeconds}ss`);

  logger.info(`starting 'submitHandler' listener`);
  await consumer.createQueue("submission", { name: "submission", policy: "standard" });

  await consumer.work("submission", { pollingIntervalSeconds, batchSize: 1 }, submit.submitHandler);
}
