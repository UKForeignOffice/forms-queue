# notarial-api
This ia a monorepo used for the notarial services apis, which power the [prove your eligibility to a foreign government forms](https://github.com/UKForeignOffice/prove-eligibility-foreign-government-forms).

## Prerequisites
1. A node version manager, like [nvm](https://formulae.brew.sh/formula/nvm), or [n](https://github.com/tj/n)
2. node 18.x.x
3. yarn >= v1.22. This project uses yarn 3. Yarn v1.22 will load the correct version of yarn by looking at [.yarnrc](./.yarnrc.yml) and [.yarn](./yarn)
4. Docker >= 3.9 - [Install docker engine](https://docs.docker.com/engine/install/)


## Workspaces
Currently, there is only workspace in this project:

* [api](./api/README.md)

### Getting started with Docker
You may use docker and docker compose to build and start the project with the right components (e.g. database, microservices), but will not be able to run the application(s) in dev mode.

To do this, simply run this command from the root of the project:
```
docker compose up -d
```

This will then run the server in a docker container in detached mode, allowing you to continue making commands through your terminal, but still keep the docker container running.

To rebuild the server after making some changes, run the following commands:

```
docker compose down
docker compose -d --build
```

### Formatting
This project uses ESLint and Prettier to ensure consistent formatting. It is recommended that you add and turn on the prettier plugin for your IDE, and reformat on save.


## CI/CD
There is a CI/CD pipeline currently set up for deploying new versions of the project to test environments. For more information, please refer to the [CI/CD docs](https://github.com/UKForeignOffice/notarial-api/blob/main/docs/ci.md)

## Testing
Currently, there is unit testing and integration testing set up for the api workspace. For more information, refer to the [testing docs](./docs/testing.md).

