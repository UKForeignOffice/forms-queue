import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import PgBoss from "pg-boss";

const queue = "submission";
const logger = pino().child({
  queue,
});
export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info(`starting queue '${queue}' workers`);

  logger.info(`starting 'submitHandler' listener`);
  await consumer.work("submission", { newJobCheckInterval: 500 }, submit.submitHandler);
}
