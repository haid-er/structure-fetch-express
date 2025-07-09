const ApiError = require("../utils/ApiError");
const { STATUS_CODES } = require("../utils/constants");

const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const details = error.details.map((err) => err.message);
      return next(
        new ApiError(STATUS_CODES.BAD_REQUEST, "Validation error", details)
      );
    }
    next();
  };

module.exports = validate;
