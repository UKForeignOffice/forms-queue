import { getConsumer } from "../../../Consumer";
import * as submit from "./submit";
import pino from "pino";
import { sendTestJob } from "./testJob";

const logger = pino();
const queue = "submission";

export async function setupSubmissionWorkers() {
  const consumer = await getConsumer();

  logger.info({ queue }, `starting queue '${queue}' workers`);

  logger.info({ queue }, `starting 'submitHandler' on ${queue} listeners`);
  await consumer.work("submission", submit.submitHandler);

  // sendTestJob();
}
t;
