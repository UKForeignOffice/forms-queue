import { Router } from "express";
import { get, validate, post } from "./jobId";

export const jobIdRouter = Router();

jobIdRouter.get("/:jobId", get);

jobIdRouter.post("/", validate, post);
