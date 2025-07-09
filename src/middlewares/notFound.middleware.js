const ApiError = require("../utils/ApiError");
const { STATUS_CODES } = require("../utils/constants");

const notFound = (req, res, next) => {
  next(
    new ApiError(STATUS_CODES.NOT_FOUND, `Route ${req.originalUrl} not found`)
  );
};

module.exports = notFound;
