module.exports = {
  Queue: {
    url: "postgres://user:root@localhost:5432/queue",
    archiveFailedInDays: 30,
    deleteArchivedAfterDays: 60,
    schema: "pgboss_v10",
  },
  Submission: {
    requestTimeout: 2000,
  },
  pollingIntervalSeconds: 2,
  SUPPRESS_NO_CONFIG_WARNING: true,
};
