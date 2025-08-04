const { createClient } = require("redis");
const logger = require("../logger/logger.config");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const redispass = process.env.REDIS_PASSWORD;
const redisConf = redispass && redispass != "" ? { url: redisUrl, password: redispass } : { url: redisUrl };

const redisClient = createClient({
  ...redisConf,
  socket: {
    connectTimeout: 10000,
  },
});

const redisPubClient = redisClient;
const redisSubClient = redisClient.duplicate();

redisClient.on("connect", () => {
  logger.info("##########################---------------Connected to Redis------------------#######################");
});

redisClient.on("error", (error) => {
  logger.error("Redis Error: " + error);
});
module.exports = { redisClient, redisPubClient, redisSubClient };
