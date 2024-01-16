import { getConsumer } from "../../Consumer";
import * as submit from "./workers/submit";
import pino from "pino";
import { setupSubmissionWorkers } from "./workers";

const logger = pino();

getConsumer().then(() => setupSubmissionWorkers());
