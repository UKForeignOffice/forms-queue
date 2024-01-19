import { default as axios } from "axios";
import pino from "pino";
import { Job } from "pg-boss";
import { SubmitJob } from "./types";
import config from "config";

const queue = "submission";
const worker = "submit";

const logger = pino();
export const metadata = { queue, worker };
const REQUEST_TIMEOUT = Number.parseInt(config.get<string>("Submission.requestTimeout"));
logger.info(metadata, `REQUEST_TIMEOUT set to ${REQUEST_TIMEOUT}`);

axios.interceptors.request.use((intercepted) => {
  // @ts-ignore
  intercepted.meta = intercepted.meta ?? {};
  // @ts-ignore
  intercepted.meta.requestStartedAt = new Date().getTime();
  return intercepted;
});

axios.interceptors.response.use((intercepted) => {
  // @ts-ignore
  intercepted.meta.requestFinishedAt = new Date().getTime();
  // @ts-ignore
  intercepted.meta.responseTime = intercepted.meta.requestFinishedAt - intercepted.config.meta.requestStartedAt;
  return intercepted;
});

/**
 * When a "submission" event is detected, this worker POSTs the data to `job.data.data.webhook_url`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function submitHandler(job: Job<SubmitJob>) {
  const jobLogData = { jobId: job.id, ...metadata };
  logger.info(jobLogData, `received ${worker} job`);

  const { data, id } = job;
  const requestBody = data.data;
  const url = data.webhook_url;
  try {
    const res = await axios.post(url, requestBody, {
      timeout: REQUEST_TIMEOUT,
    });
    // @ts-ignore
    logger.info(jobLogData, `${url} took ${res.meta.responseTime}ms`);
    const reference = res.data.reference;
    logger.info(JSON.stringify(res.data));
    if (reference) {
      logger.info(jobLogData, `job: ${id} posted successfully to ${url} and responded with reference: ${reference}`);
      return { reference };
    }
    return;
  } catch (e: any) {
    logger.error(jobLogData, `job: ${id} failed with ${e.cause ?? e.message}`);
    // @ts-ignore
    if (e.cause instanceof AggregateError) {
      throw { errors: e.cause.errors };
    }
    throw e;
  }
}
