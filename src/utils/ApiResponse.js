const { STATUS_CODES } = require("./constants");

class ApiResponse {
  constructor(statusCode, message = "success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < STATUS_CODES.BAD_REQUEST;
  }
}

module.exports = ApiResponse;
