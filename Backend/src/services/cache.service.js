const Redis = require("ioredis");

const cacheClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

cacheClient.on("connect", () => {
  console.log("Connected to Redis server");
});

cacheClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

module.exports = cacheClient;
