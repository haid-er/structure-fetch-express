const ApiError = require("../utils/ApiError");
const { logger } = require("./logger.middleware");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error(
    `${req.method} ${req.originalUrl} ${statusCode} - ${err.message}`
  );

  const response = {
    success: false,
    message: err.message,
    errors: err.error || [],
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
};

module.exports = errorHandler;
