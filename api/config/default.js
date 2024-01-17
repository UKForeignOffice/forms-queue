const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotEnv.config({ path: ".env" });
}

module.exports = {
  databaseUrl: "postgres://user@root@localhost:5432/reference",
  port: "3001",
  env: "development",
};
