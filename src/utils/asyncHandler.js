const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.status || 500).json({
//       message: error.message || "Internal Server Error",
//       success: false,
//       stack: process.env.NODE_ENV === "production" ? null : error.stack,
//     });
//     next(error);
//   }
// };
