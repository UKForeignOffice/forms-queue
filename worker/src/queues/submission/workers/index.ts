import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import PgBoss from "pg-boss";
import config from "config";
import { drainQueue } from "../../../Consumer/migrate";

const queue = "submission";
const logger = pino().child({ queue });

const pollingIntervalSeconds = parseInt(
    config.get<string>("pollingIntervalSeconds")
);

const deleteAfterDays = parseInt(
    config.get<string>("Queue.deleteArchivedAfterDays")
);

const retentionMinutes = deleteAfterDays * 24 * 60;

export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info(
      { pollingIntervalSeconds },
      `starting queue '${queue}' workers`
  );

  // Create queue ONLY if it does not exist
  const existingQueue = await consumer.getQueue(queue);

  if (!existingQueue) {
    logger.info(
        { retentionMinutes },
        "queue does not exist — creating"
    );

    await consumer.createQueue(queue, {
      name: "submission",
      policy: "standard",
      retentionMinutes
    });

  } else {
    logger.info(
        {
          retentionMinutes: existingQueue.retentionMinutes
        },
        "queue already exists — skipping creation"
    );
  }

  if (config.has("Queue.drainSchema")) {
    const queueDrainSchema = config.get<string>("Queue.drainSchema");
    try {
      await drainQueue(queue, queueDrainSchema);
    } catch (err) {
      logger.error({ err }, `draining of '${queue}' on ${queueDrainSchema} failed`);
    }
  }

  await consumer.work(
      queue,
      { pollingIntervalSeconds, batchSize: 1 },
      submit.submitHandler
  );
}