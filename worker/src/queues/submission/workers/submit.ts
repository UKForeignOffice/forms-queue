import { default as axios } from "axios";
import pino from "pino";
import { Job } from "pg-boss";
import { SubmitJob } from "./types";
import config from "config";

const queue = "submission";
const worker = "submit";

const ERROR_CODE = "SUBMIT_ERROR";

const logger = pino().child({
  queue,
  worker,
});

const REQUEST_TIMEOUT = Number.parseInt(config.get<string>("Submission.requestTimeout"));
logger.info(`REQUEST_TIMEOUT set to ${REQUEST_TIMEOUT}`);

/**
 * When a "submission" event is detected, this worker POSTs the data to `job.data.data.webhook_url`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function submitHandler(job: Job<SubmitJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);

  const { data, id } = job;
  const requestBody = data.data;
  const url = data.webhook_url;

  try {
    const res = await axios.post(url, requestBody, {
      timeout: REQUEST_TIMEOUT,
    });
    // @ts-ignore
    logger.info({ jobId, status: res.status, url, data: res.data }, `${url} took ${res.config?.meta?.responseTime}ms`);

    const reference = res.data.reference;
    if (reference) {
      logger.info({ jobId }, `job: ${id} posted successfully to ${url} and responded with reference: ${reference}`);
      return { reference };
    }
    return;
  } catch (e: any) {
    logger.error({ jobId, err: e, errorCode: ERROR_CODE }, `post to ${url} job: ${id} failed with ${e.cause ?? e.message}`);

    if (e.response) {
      logger.error({ jobId, err: e.response.error });
      const { message, name, code, response } = e;
      const { status, data } = response;
      throw {
        message,
        name,
        code,
        status,
        data,
      };
    }

    if (e.request) {
      logger.error(jobId, `post to ${url} request could not be sent, see database for error`);
    }

    // @ts-ignore
    if (e.cause instanceof AggregateError) {
      throw { errors: e.cause.errors };
    }
    throw e;
  }
}

axios.interceptors.request.use((intercepted) => {
  // @ts-ignore
  intercepted.meta = intercepted.meta ?? {};
  // @ts-ignore
  intercepted.meta.requestStartedAt = new Date().getTime();
  return intercepted;
});

axios.interceptors.response.use((intercepted) => {
  // @ts-ignore
  intercepted.config.meta.requestFinishedAt = new Date().getTime();
  // @ts-ignore
  intercepted.config.meta.responseTime = intercepted.config.meta.requestFinishedAt - intercepted.config.meta.requestStartedAt;
  return intercepted;
});
