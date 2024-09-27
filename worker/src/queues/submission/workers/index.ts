import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import PgBoss from "pg-boss";
import config from "config";
import { drainQueue } from "../../../Consumer/migrate";

const queue = "submission";
const logger = pino().child({
  queue,
});

const pollingIntervalSeconds = parseInt(config.get<"string">("pollingIntervalSeconds"));

export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info(`starting queue '${queue}' workers, checking every ${pollingIntervalSeconds}s`);

  logger.info(`starting 'submitHandler' listener`);
  await consumer.createQueue("submission", { name: "submission", policy: "standard" });

  if (config.has("Queue.drainSchema")) {
    const queueDrainSchema = config.get<"string">("Queue.drainSchema");
    try {
      const drainSchema = config.get<string>("QUEUE_DRAIN_SCHEMA");
      await drainQueue(queue, drainSchema);
    } catch (err) {
      logger.error({ err }, `draining of 'submission on ${queueDrainSchema} failed`);
    }
  }

  await consumer.work("submission", { pollingIntervalSeconds, batchSize: 1 }, submit.submitHandler);
}
