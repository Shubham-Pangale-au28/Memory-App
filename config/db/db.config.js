const mongoose = require("mongoose");
const logger = require("../logger/logger.config.js");

const db = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Database Connected Successfully!!..."))
  .catch((err) => {
    logger.error("Unable to connect database: ", err);
  });
module.exports = db;
