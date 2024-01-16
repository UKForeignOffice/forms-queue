# API workspace
This workspace is used to run the API server.

## Prerequisites
1. A node version manager, like [nvm](https://formulae.brew.sh/formula/nvm), or [n](https://github.com/tj/n)
2. node 18.x.x
3. yarn >= v1.22. This project uses yarn 3. Yarn v1.22 will load the correct version of yarn by looking at [.yarnrc](./../.yarnrc.yml) and [.yarn](./../yarn)
4. Docker >= 3.9 - [Install docker engine](https://docs.docker.com/engine/install/) 

## Getting started
You can get this repo up and running in two ways; either via `node` and `yarn` directly, or via Docker.

### Getting started with Node and Yarn
You will need node >=18 in order to run the server locally using node.

To start the server from the root of the project, run the following commands:
```
yarn install
yarn api build
yarn api start:local
```
These commands will build the project dependencies, compile the initial build of the api workspace, and run the workspace in local mode (allowing watching for changes).

### Getting started with Docker
You may use docker and docker compose to build and start the project with the right components (e.g. database, microservices), but will not be able to run the application(s) in dev mode.

To do this, simply run this command from the root of the project:
```
docker compose up -d
```

This will then run the server in a docker container in detached mode, allowing you to continue making commands through your terminal, but still keep the docker container running.

If you want to rebuild the server after making some changes, run the following commands:

```
docker compose down
docker compose -d --build
```

This will cause docker to tear down the current container, and force a new build image for the server, allowing you to test your most recent changes.

## Routes
There is currently one route set up, which will be used to test the Optical Character Recognition (OCR) capabilities of the server. This route is:
 * /ocr-email