import pino from "pino";
import config from "config";
import { getInflightMessages, getSchemaVersion, migrateInflightMessagesFromV9 } from "./helpers";

const currentSchema = config.get<string>("Queue.schema");

export async function drainQueue(queue: string, drainSchema: string) {
  const drainLogger = pino().child({
    queue,
    drainSchema,
  });

  if (currentSchema === drainSchema) {
    drainLogger.warn(`current ${currentSchema} and drainSchemas ${drainSchema} are the same. Skipping`);
    return;
  }

  const schemaVersion = await getSchemaVersion(currentSchema);
  const drainSchemaVersion = await getSchemaVersion(drainSchema);

  /**
   * Schema version 20 is equivalent to pg-boss v9.
   */
  if (drainSchemaVersion !== 20 || drainSchemaVersion >= schemaVersion) {
    drainLogger.warn(
      `drainSchema: ${drainSchema} (v${drainSchemaVersion}) and schema: ${currentSchema} (v${schemaVersion}). Automatic migration is only supported from v20 to v23+`
    );
    return;
  }

  const inflightMessagesInV9 = await getInflightMessages(queue, drainSchema);

  if (!inflightMessagesInV9?.length) {
    drainLogger.info(`Skipping draining of ${drainSchema}.${queue}. No inflight messages found`);
    return;
  }

  drainLogger.info({ messagesToMigrate: inflightMessagesInV9 }, `Migrating ${inflightMessagesInV9.length} to ${currentSchema}`);

  await migrateInflightMessagesFromV9(queue, drainSchema);
}
