class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    this.error = error;
    this.stack =
      process.env.NODE_ENV == "production"
        ? null
        : stack
        ? stack
        : Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
