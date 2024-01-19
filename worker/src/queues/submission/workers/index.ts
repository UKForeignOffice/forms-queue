import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import PgBoss from "pg-boss";

const logger = pino();
const queue = "submission";

export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue }, `starting queue '${queue}' workers`);

  logger.info({ queue }, `starting 'submitHandler' on ${queue} listeners`);
  await consumer.work("submission", { newJobCheckInterval: 500 }, submit.submitHandler);
}
