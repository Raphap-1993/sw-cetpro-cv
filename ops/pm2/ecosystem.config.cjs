const path = require("path");

const defaultAppRoot = path.resolve(__dirname, "..", "..");
const appRoot = path.resolve(process.env.APP_ROOT || defaultAppRoot);
const envFile = path.resolve(
  process.env.APP_ENV_FILE || process.env.ENV_FILE || path.join(appRoot, ".env")
);
const namePrefix = process.env.PM2_APP_PREFIX || "";
const sharedEnv = {
  NODE_ENV: "production",
  APP_ROOT: appRoot,
  APP_ENV_FILE: envFile,
  ENV_FILE: envFile
};

module.exports = {
  apps: [
    {
      name: `${namePrefix}swcv-api`,
      cwd: appRoot,
      script: "./ops/bin/start-api.sh",
      interpreter: "/bin/sh",
      time: true,
      kill_timeout: 10000,
      env: sharedEnv,
      env_production: sharedEnv
    },
    {
      name: `${namePrefix}swcv-web`,
      cwd: appRoot,
      script: "./ops/bin/start-web.sh",
      interpreter: "/bin/sh",
      time: true,
      kill_timeout: 10000,
      env: sharedEnv,
      env_production: sharedEnv
    }
  ]
};
