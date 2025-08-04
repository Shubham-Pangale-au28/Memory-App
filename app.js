const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./config/logger/logger.config.js");
const postRoutes = require("./routes/posts.js");
const userRouter = require("./routes/user.js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const db = require("./config/db/db.config.js");
const { redisClient, redisPubClient, redisSubClient } = require("./config/cache/redis.config.js");
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;
redisClient
  .connect()
  .then(async () => {
    try {
      await Promise.all([redisPubClient, redisSubClient.connect()]);
      logger.info("################----------Connected to Redis Client PUB/SUB -------------------######");
    } catch (error) {
      console.error("Error connecting Redis (pub,sub) clients:", error);
    }
  })
  .catch((error) => {
    logger.error("Unable to connect redis: ", error);
  });
app.listen(PORT, () => {
  logger.info(`Server Started On Port http://localhost: ${PORT}`);
});
