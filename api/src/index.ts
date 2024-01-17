import { createServer } from "./server";
import config from "config";
import logger from "pino";

const initLogger = logger();
async function initApp(): Promise<void> {
  const server = createServer();

  server.listen(config.get("port"), () => {
    initLogger.info(
      `Server listening on PORT: ${config.get("port")}, NODE_ENV: ${config.get(
        "env",
      )}`,
    );
  });

  process.on("exit", () => {
    initLogger.info(`Server stopped`);
  });
}

initApp().catch((err) => {
  initLogger.error(["Server initialisation error"], err);
  process.exit(1);
});
