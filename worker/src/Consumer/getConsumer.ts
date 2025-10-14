import config from "config";
import PgBoss from "pg-boss";
import { ApplicationError } from "../utils/ApplicationError";
import pino from "pino";

const URL = config.get<string>("Queue.url");
const logger = pino().child({ method: "Consumer.create" });

const MINUTE_IN_S = 60;
const HOUR_IN_S = MINUTE_IN_S * 60;
const DAY_IN_S = HOUR_IN_S * 24;

const archiveFailedAfterDays = parseInt(config.get<string>("Queue.archiveFailedInDays"));
const deleteAfterDays = parseInt(config.get<string>("Queue.deleteArchivedAfterDays"));
const schema = config.get<string>("Queue.schema");

const registeredConsumers: Record<string, PgBoss> = {};

logger.info({
    archiveFailedAfterDays,
    deleteAfterDays,
    archiveFailedAfterSeconds: archiveFailedAfterDays * DAY_IN_S,
    deleteAfterSeconds: deleteAfterDays * DAY_IN_S,
}, 'Configured PgBoss retention settings');


type ConsumerOptions = {
    schema?: string;
};
/**
 * Sets up database connection via PgBoss and creates an instance of a "consumer" (consumes the queue).
 */
export async function create(options: ConsumerOptions) {
    const { schema } = options;
    const boss = new PgBoss({
        connectionString: URL,
        schema,
        archiveCompletedAfterSeconds: DAY_IN_S,                         // move to archive after 1 day
        deleteAfterSeconds: deleteAfterDays * DAY_IN_S,                 // delete archived jobs after x days
        archiveFailedAfterSeconds: archiveFailedAfterDays * DAY_IN_S    // move failed apps to the archive after x days
    });

    boss.on("error", (error) => {
        throw error;
    });

    try {
        await boss.start();
    } catch (e: any) {
        if (e.errors) {
            throw new ApplicationError("CONSUMER", "START_FAILED", `Failed to start listener ${e.errors}. Exiting`);
        }
        throw new ApplicationError("CONSUMER", "START_FAILED", `Failed to start listener ${e.message}. Exiting`);
    }

    logger.info(`Successfully started consumer at ${URL} on schema ${schema}`);
    return boss;
}

/**
 * `getConsumer` should be used whenever an instance of a consumer is needed.
 * This is to prevent too many database connections from being opened unnecessarily.
 */
export async function getConsumer(name?: string) {
    const consumerSchema = name ?? schema;
    const consumer = registeredConsumers[consumerSchema];
    try {
        if (!consumer) {
            registeredConsumers[consumerSchema] = await create({ schema: consumerSchema });
        }
        return registeredConsumers[consumerSchema];
    } catch (e) {
        logger.error(e);
        process.exit(1);
    }
}
