import pino from "pino";
import { Pool } from "pg";
import config from "config";

const logger = pino();
const currentSchema = config.get<string>("Queue.schema");

const db = new Pool({
  connectionString: config.get<string>("Queue.url"),
});

export async function getSchemaVersion(schema: string) {
  try {
    const res = await db.query(`SELECT version FROM ${schema}.version`);
    return res.rows[0]?.version;
  } catch (err) {
    logger.error({ err }, `Could not get version from ${schema}`);
    throw err;
  }
}

export async function getInflightMessages(queue: string, schema: string) {
  const query = `
    SELECT 
        id
    FROM 
        ${schema}.job
    WHERE 
        name = '${queue}'
    AND state in ('created', 'retry')`;

  const inflightMessages = await db.query(query);
  const numberOfMessages = inflightMessages?.rows.length;
  logger.info({ queue, schema }, `Detected ${numberOfMessages} created messages in ${schema}.job`);

  if (numberOfMessages) {
    return inflightMessages.rows;
  }
}

export async function migrateInflightMessagesFromV9(queue: string, schema: string) {
  logger.info({ queue, schema }, `Starting migration from ${schema} to ${currentSchema}`);

  // DB connection must be established for transactions to run properly
  const client = await db.connect();

  try {
    logger.info(`Copying inflight messages for queue ${queue} from ${schema} to ${currentSchema} and deleting old messages`);
    await client.query("BEGIN");
    await client.query(`INSERT INTO ${currentSchema}.job (
        id,
        name,
        data,
        retry_limit,
        retry_count,
        retry_delay,
        retry_backoff,
        expire_in,
        created_on,
        keep_until,
        output
      )

      SELECT id,
             name,
             data,
             retryLimit,
             retryCount,
             retryDelay,
             retryBackoff,
             expireIn,
             createdOn,
             keepUntil,
             output
      FROM ${schema}.job
      WHERE name = '${queue}'
        AND state IN ('created', 'retry')
      ON CONFLICT DO NOTHING`);

    await client.query(`
        DELETE from ${schema}.job
        WHERE name = '${queue}' and state IN ('created', 'completed', 'retry');

        DELETE from ${schema}.archive
        WHERE name = '${queue}' and state IN ('created', 'completed', 'retry');
        `);

    await client.query("COMMIT");
  } catch (err) {
    logger.error({ err }, `Migration for queue ${queue} from ${schema} to ${currentSchema} failed`);
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }

  logger.info({ drainSchema: schema, queue }, `Inflight messages drained successfully for queue ${queue}, from schema ${schema} to ${currentSchema}`);
}
