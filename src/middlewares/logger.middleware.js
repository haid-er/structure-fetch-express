const winston = require("winston");
require("winston-daily-rotate-file");

// Create a daily rotating file transport for errors
const errorTransport = new winston.transports.DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", // keep logs for 14 days
});

// Create a daily rotating file transport for all combined logs
const combinedTransport = new winston.transports.DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d", // keep logs for 14 days
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  defaultMeta: { service: "api-service" },
  transports: [errorTransport, combinedTransport],
});

// console logging in development
if (true || process.env.NODE_ENV === "development") {
  logger.add(
    new winston.transports.Console({ format: winston.format.simple() })
  );
}

// middleware to log requests
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

module.exports = { logger, requestLogger };
