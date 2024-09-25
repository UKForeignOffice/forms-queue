module.exports = {
  Queue: {
    url: "postgres://user:root@localhost:5432/queue",
    archiveFailedInDays: 30,
    deleteArchivedAfterDays: 7,
    schema: "pgboss",
  },
  Submission: {
    requestTimeout: 2000,
  },
  pollingIntervalSeconds: 2,
  SUPPRESS_NO_CONFIG_WARNING: true,
};
