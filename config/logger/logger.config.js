const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const transport = new DailyRotateFile({
  filename: "./log/memory-app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "6d",
});

const logger = createLogger({
  levels: logLevels,
  transports: [
    transport,
    new transports.Console(),
    new transports.File({
      filename: "./log/memory-app.log",
    }),
  ],
  format: format.combine(
    format.label({
      label: `Memory-App🏷️`,
    }),
    format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.printf((info) => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`)
  ),
});

module.exports = logger;
