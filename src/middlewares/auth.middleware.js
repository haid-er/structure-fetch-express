const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { STATUS_CODES } = require("../utils/constants");
const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken)
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Unauthorized Request");
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user)
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid access token");
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      error?.message || "Invalid access token"
    );
  }
});

module.exports = verifyJWT;
