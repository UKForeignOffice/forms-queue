import { prisma } from "../../db/client";
import { default as pinoLogger } from "pino";
import { ApplicationError } from "../../ApplicationError";

const logger = pinoLogger();
export async function getReferenceNumber(jobId: string) {
  logger.info({ method: "getReferenceNumber" }, `querying for jobId: ${jobId}`);

  try {
    return await prisma.reference.findFirst({
      where: {
        job_id: jobId,
      },
      select: {
        reference: true,
      },
    });
  } catch (e: any) {
    throw new ApplicationError("REFERENCE", "CLIENT", 500, e.message);
  }
}

export async function poll<T extends (...args: any) => any>(
  fn: T,
  args: Parameters<T>[],
  timeoutMs: number,
  limit: number,
  timeout?: NodeJS.Timeout,
) {
  const timer = timeout ?? setTimeout(Promise.resolve, timeoutMs);
  fn(...args).then(poll(fn, args, timeoutMs, limit, timer));
}

function retry(fn, args, maxAttempts = 1, delay = 0, attempts = 0) {
  return Promise.resolve()
    .then(fn)
    .catch((err) => {
      if (attempts < maxAttempts) {
        return retry(fn, maxAttempts, delay, attempts + 1);
      }
      throw err;
    });
}
// poll(getReferenceNumber, ["1"], 2000).then(console.log);

export async function addReferenceNumber(jobId: string, reference: string) {
  logger.info(
    { method: "addReferenceNumber" },
    `adding jobId: ${jobId} with reference: ${reference}`,
  );

  try {
    return await prisma.reference.create({
      data: {
        job_id: jobId,
        reference: reference,
      },
    });
  } catch (e: any) {
    throw new ApplicationError(
      "REFERENCE",
      "CREATE_FAILED",
      500,
      `${e.code} ${e.message}`,
      {
        exposeToClient: false,
      },
    );
  }
}
