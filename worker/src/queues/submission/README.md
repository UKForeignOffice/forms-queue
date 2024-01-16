# Queue: `submission`

Workers
- `submit`

## `submit`
[submit]('./submit.ts')

When a "submission" event is detected, this worker POSTs the data to `job.data.data.webhook_url`.

The source of this event is the runner, after a user has submitted a form. 

### Troubleshooting

When tasks fail, the error emitted will automatically be added to the jobs table, and the error is logged.

The log will look like:
```
{"level":50,"time":1704820757968,"pid":70068,"hostname":"HOST_NAME","jobId":"6aa3b250-4bc8-4fcb-9a15-7ca56551d04b","queue":"submission","worker":"submit","msg":"job: 6aa3b250-4bc8-4fcb-9a15-7ca56551d04b failed with ECONNREFUSED"}
```

If the logs are incomplete, further logging may be found on the database in the `output` column.

```postgresql
    select data, output from job where id = '6aa3b250-4bc8-4fcb-9a15-7ca56551d04b';
```

`ECONNREFUSED` may be due to misconfigured webhook_url.

Events can easily be retried by setting completedon = null, retrycount = 0, state = 'created'
```postgresql
    update job
    set data = jsonb_set(
            data,
            '{webhook_url}',
            '"https://b4bf0fcd-1dd3-4650-92fe-d1f83885a447.mock.pstmn.io"'
        ),
    completedon = null,
    retrycount = 0,
    state = 'created'
    where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7';
```

If you wish to keep a record of the failed event, create a new event using the failed events details.
```postgresql
    insert into job (name, data)
    SELECT name, data
    from job where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7';
```