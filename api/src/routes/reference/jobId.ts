import { Request, Response, NextFunction } from "express";
import {
  addReferenceNumber,
  getReferenceNumber,
} from "../../middlewares/services/ReferenceService";
import joi from "joi";
import { ApplicationError } from "../../ApplicationError";

export async function get(req: Request, res: Response, next: NextFunction) {
  const { jobId } = req.params;
  try {
    const reference = await getReferenceNumber(jobId);
    if (!reference) {
      return res.status(404);
    }
    return res.send(reference);
  } catch (e) {
    return next(e);
  }
}

const schema = joi.object({
  reference: joi.string(),
  jobId: joi.string(),
});
export function validate(req: Request, res: Response, next: NextFunction) {
  const { value, error } = schema.validate(req.body);
  if (error) {
    next(new ApplicationError("REFERENCE", "VALIDATION", 400, error.message));
  }
  res.locals.referencePayload = value;
}
export async function post(_req: Request, res: Response, next: NextFunction) {
  const { jobId, referenceNumber } = res.locals.referencePayload;
  try {
    const row = await addReferenceNumber(jobId, referenceNumber);
    res.send({
      job_id: row.job_id,
      reference: row.reference,
    });
  } catch (e) {
    next(e);
  }
}
